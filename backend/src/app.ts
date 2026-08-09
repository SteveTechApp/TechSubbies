import "dotenv/config";
import express from "express";
import cors from "cors";
import { authRouter } from "./routes/auth.js";
import { usersRouter } from "./routes/users.js";
import { aiRouter } from "./routes/ai.js";
import { partnershipsRouter } from "./routes/partnerships.js";
import { companyAttachmentsRouter } from "./routes/companyAttachments.js";
import { marketplaceRouter } from "./routes/marketplace.js";
import { trustRouter } from "./routes/trust.js";
import { databaseIntegrity, db } from "./lib/db.js";
import { randomUUID } from "node:crypto";
import { membershipBillingRouter, membershipWebhook, membershipWebhookBody } from "./routes/membershipBilling.js";
import { log } from "./lib/logger.js";
import { documentsRouter } from "./routes/documents.js";
import { AppError, defaultHttpErrorCode, errorBody } from "./lib/errors.js";

type AppOptions = {
  readinessCheck?: () => boolean;
};

export function createApp(options: AppOptions = {}) {
  validateRuntimeConfig();
  const app = express();
  const production = process.env.NODE_ENV === "production";
  const authRateLimit = createRateLimiter({
    windowMs: 15 * 60 * 1000,
    max: production ? 10 : 100,
    name: "authentication",
  });
  const aiRateLimit = createRateLimiter({
    windowMs: 60 * 1000,
    max: production ? 30 : 300,
    name: "AI",
  });

  app.use(requestContext);
  app.use(requestLogger);
  app.use(securityHeaders);
  app.use(cors({ origin: frontendOrigin(), credentials: true }));

  app.use("/api/billing/stripe/webhook", stripeBillingWebhookRouter);

  app.disable("x-powered-by");
  app.set("trust proxy", 1);
  const allowedOrigins = FRONTEND_ORIGIN.split(",").map((value) => value.trim()).filter(Boolean);
  app.use(cors({ origin(origin, callback) { if (!origin || allowedOrigins.includes(origin)) return callback(null, true); return callback(new Error("Origin not allowed.")); }, credentials: false }));
  app.use((req, res, next) => {
    const requestId = String(req.headers["x-request-id"] || randomUUID());
    res.setHeader("X-Request-Id", requestId);
    res.setHeader("X-Content-Type-Options", "nosniff");
    res.setHeader("X-Frame-Options", "DENY");
    res.setHeader("Referrer-Policy", "strict-origin-when-cross-origin");
    res.setHeader("Permissions-Policy", "camera=(), microphone=(), geolocation=()");
    res.setHeader("Content-Security-Policy", "default-src 'none'; frame-ancestors 'none'");
    const started=Date.now();res.on("finish",()=>log("info","http.request",{requestId,method:req.method,path:req.path,statusCode:res.statusCode,durationMs:Date.now()-started}));
    next();
  });
  app.post("/api/membership/webhook", membershipWebhookBody, membershipWebhook);
  app.use(express.json({ limit: "2mb" }));
  app.use((req,res,next)=>{const send=res.json.bind(res);res.json=((body:unknown)=>{if(res.statusCode>=400&&body&&typeof body==="object"&&!Array.isArray(body)&&"error" in body&&!Object.hasOwn(body,"code")){return send({...body,code:defaultHttpErrorCode(res.statusCode)});}return send(body);}) as typeof res.json;next();});

  app.get("/api/health", (_req, res) => {
    res.json({ status: "ok", service: "techsubbies-api" });
  });
  app.get("/api/ready", (_req, res) => { try { const integrity=databaseIntegrity(); return res.status(integrity.ok?200:503).json({ status: integrity.ok?"ready":"not-ready", database: integrity.quickCheck }); } catch { return res.status(503).json({ status: "not-ready" }); } });

  const readinessCheck = options.readinessCheck
    || (() => checkDatabaseConnection()
      && checkEvidenceRepository()
      && checkCertificateRepository()
      && checkEsignRepository()
      && checkBillingRepository()
      && checkContractSupportRepository()
      && checkNotificationRepository()
      && checkTaxonomyRepository()
      && checkMarketplaceAnalyticsRepository()
      && checkPricingResearchRepository()
      && checkCommercialValidationRepository());
  const readinessHandler = (_req: express.Request, res: express.Response) => {
    try {
      if (!readinessCheck()) throw new Error("Readiness check returned false.");
      return res.json({ status: "ready", checks: { database: "ok" } });
    } catch {
      return res.status(503).json({ status: "unavailable", checks: { database: "unavailable" } });
    }
  };

  app.get("/api/health/ready", readinessHandler);
  app.get("/api/health", readinessHandler);

  app.use("/api/auth", authRateLimit, authRouter);

  app.post("/api/users/me/membership-selection", requireAuth, (req, res, next) => {
    if (process.env.BILLING_PROVIDER === "stripe") {
      return res.status(409).json({
        error: "Paid membership changes must use secure subscription billing.",
        code: "BILLING_PROVIDER_REQUIRED",
      });
    }
    next();
  });
  app.post(
    "/api/admin/membership-selections/:userId/confirm",
    requireAuth,
    requireRole("Admin"),
    (req, res, next) => {
      if (process.env.BILLING_PROVIDER === "stripe") {
        return res.status(409).json({
          error: "Paid memberships are activated only from verified Stripe subscription events.",
          code: "BILLING_PROVIDER_REQUIRED",
        });
      }
      next();
    }
  );

  app.use("/api/users", usersRouter);
  app.use("/api/admin/billing", adminBillingRouter);
  app.use("/api/admin/contract-support", adminContractSupportRouter);
  app.use("/api/admin/taxonomy", adminTaxonomyRouter);
  app.use("/api/admin/marketplace-analytics", adminMarketplaceAnalyticsRouter);
  app.use("/api/admin/pricing-research", adminPricingResearchRouter);
  app.use("/api/admin/commercial-validation", adminCommercialValidationRouter);
  app.use("/api/admin", adminRouter);
  app.use("/api/admin/certificates", adminCertificatesRouter);
  app.use("/api/ai", aiRateLimit, aiRouter);

  app.use("/api/esign/dropbox-sign/webhook", dropboxSignWebhookRouter);

  app.use(
    [
      "/api/partnerships",
      "/api/company-attachments",
      "/api/jobs",
      "/api/applications",
      "/api/contracts",
      "/api/conversations",
      "/api/notifications",
      "/api/evidence",
      "/api/certificates",
      "/api/esign",
      "/api/billing",
      "/api/contract-support",
      "/api/taxonomy",
      "/api/marketplace-analytics",
      "/api/pricing-research",
    ],
    requireVerifiedEmailForMutation
  );

  app.patch("/api/contracts/:contractId/sign", (req, res, next) => {
    if (process.env.ESIGN_PROVIDER === "dropbox_sign") {
      return res.status(409).json({
        error: "This contract must be signed through the secure e-signature workflow.",
        code: "ESIGN_PROVIDER_REQUIRED",
      });
    }
    next();
  });

  app.use("/api/partnerships", partnershipsRouter);
  app.use("/api/company-attachments", companyAttachmentsRouter);
  app.use("/api", marketplaceRouter);
  app.use("/api", membershipBillingRouter);
  app.use("/api", documentsRouter);
  app.use("/api/trust", trustRouter);

  app.use("/api", (_req, res) => {
    res.status(404).json({ error: "Not found." });
  });
  app.use((error: Error, req: express.Request, res: express.Response, _next: express.NextFunction) => { if (error.message === "Origin not allowed.") return res.status(403).json({ error: "Origin not allowed.",code:"ORIGIN_NOT_ALLOWED" }); if(error instanceof AppError){log(error.statusCode>=500?"error":"warn","http.application-error",{requestId:res.getHeader("X-Request-Id"),method:req.method,path:req.path,errorName:error.name,code:error.code,message:error.message});return res.status(error.statusCode).json(errorBody(error));} log("error","http.unhandled-error",{requestId:res.getHeader("X-Request-Id"),method:req.method,path:req.path,errorName:error.name,message:error.message}); return res.status(500).json({ error: "Internal server error.",code:"INTERNAL_ERROR" }); });

  return app;
}
