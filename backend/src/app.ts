import "dotenv/config";
import express from "express";
import cors from "cors";
import { authRouter } from "./routes/auth.js";
import { usersRouter } from "./routes/users.js";
import { aiRouter } from "./routes/ai.js";
import { partnershipsRouter } from "./routes/partnerships.js";
import { companyAttachmentsRouter } from "./routes/companyAttachments.js";
import { applicationsRouter, jobsRouter } from "./routes/jobs.js";
import { contractsRouter } from "./routes/contracts.js";
import { conversationsRouter } from "./routes/conversations.js";
import { adminRouter } from "./routes/admin.js";
import { evidenceRouter } from "./routes/evidence.js";
import { adminCertificatesRouter, certificatesRouter } from "./routes/certificates.js";
import { dropboxSignWebhookRouter, esignRouter } from "./routes/esign.js";
import { billingRouter, stripeBillingWebhookRouter } from "./routes/billing.js";
import { requireCsrf, securityHeaders } from "./middleware/security.js";
import { createRateLimiter } from "./middleware/rateLimit.js";
import { frontendOrigin, validateRuntimeConfig } from "./lib/config.js";
import { requireVerifiedEmailForMutation } from "./middleware/auth.js";
import { checkDatabaseConnection } from "./lib/db.js";
import { checkEvidenceRepository } from "./lib/evidenceRepository.js";
import { checkCertificateRepository } from "./lib/certificateRepository.js";
import { checkEsignRepository } from "./lib/esignRepository.js";
import { checkBillingRepository } from "./lib/billingRepository.js";
import { requestContext, requestLogger, safeErrorHandler } from "./middleware/observability.js";

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

  // Stripe requires the exact raw JSON payload for webhook signature
  // verification. Mount this before express.json() and the browser CSRF gate.
  app.use("/api/billing/stripe/webhook", stripeBillingWebhookRouter);

  app.use(express.json({ limit: "2mb" }));
  app.use(requireCsrf);

  app.get("/api/health/live", (_req, res) => {
    res.json({ status: "ok" });
  });

  const readinessCheck = options.readinessCheck
    || (() => checkDatabaseConnection()
      && checkEvidenceRepository()
      && checkCertificateRepository()
      && checkEsignRepository()
      && checkBillingRepository());
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

  // Paid membership entitlements are provider-owned once Stripe Billing is
  // enabled. These guards prevent the legacy manual selection/Admin-confirm
  // flow from granting a paid tier without a matching subscription webhook.
  app.post("/api/users/me/membership-selection", (req, res, next) => {
    if (process.env.BILLING_PROVIDER === "stripe") {
      return res.status(409).json({
        error: "Paid membership changes must use secure subscription billing.",
        code: "BILLING_PROVIDER_REQUIRED",
      });
    }
    next();
  });
  app.post("/api/admin/membership-selections/:userId/confirm", (req, res, next) => {
    if (process.env.BILLING_PROVIDER === "stripe") {
      return res.status(409).json({
        error: "Paid memberships are activated only from verified Stripe subscription events.",
        code: "BILLING_PROVIDER_REQUIRED",
      });
    }
    next();
  });

  app.use("/api/users", usersRouter);
  app.use("/api/admin", adminRouter);
  app.use("/api/admin/certificates", adminCertificatesRouter);
  app.use("/api/ai", aiRateLimit, aiRouter);

  // Dropbox Sign sends an unauthenticated multipart callback. Authenticity is
  // verified inside the route using the provider event hash before any state
  // is changed. Keep this mounted before the verified-user mutation gate.
  app.use("/api/esign/dropbox-sign/webhook", dropboxSignWebhookRouter);

  app.use(
    [
      "/api/partnerships",
      "/api/company-attachments",
      "/api/jobs",
      "/api/applications",
      "/api/contracts",
      "/api/conversations",
      "/api/evidence",
      "/api/certificates",
      "/api/esign",
      "/api/billing",
    ],
    requireVerifiedEmailForMutation
  );

  // The legacy typed-name endpoint is retained for local/demo mode only.
  // Once a real provider is selected, contract state may change only from a
  // verified provider callback, preventing a browser from bypassing e-sign.
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
  app.use("/api/jobs", jobsRouter);
  app.use("/api/applications", applicationsRouter);
  app.use("/api/contracts", contractsRouter);
  app.use("/api/conversations", conversationsRouter);
  app.use("/api/evidence", evidenceRouter);
  app.use("/api/certificates", certificatesRouter);
  app.use("/api/esign", esignRouter);
  app.use("/api/billing", billingRouter);

  app.use("/api", (_req, res) => {
    res.status(404).json({ error: "Not found." });
  });
  app.use(safeErrorHandler);

  return app;
}
