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

const FRONTEND_ORIGIN = process.env.FRONTEND_ORIGIN || "http://localhost:5173";

export function createApp() {
  const app = express();

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

  app.use("/api/auth", authRouter);
  app.use("/api/users", usersRouter);
  app.use("/api/ai", aiRouter);
  app.use("/api/partnerships", partnershipsRouter);
  app.use("/api/company-attachments", companyAttachmentsRouter);
  app.use("/api", marketplaceRouter);
  app.use("/api", membershipBillingRouter);
  app.use("/api", documentsRouter);
  app.use("/api/trust", trustRouter);

  // Keep this last: catches anything unmatched under /api.
  app.use("/api", (_req, res) => {
    res.status(404).json({ error: "Not found." });
  });
  app.use((error: Error, req: express.Request, res: express.Response, _next: express.NextFunction) => { if (error.message === "Origin not allowed.") return res.status(403).json({ error: "Origin not allowed.",code:"ORIGIN_NOT_ALLOWED" }); if(error instanceof AppError){log(error.statusCode>=500?"error":"warn","http.application-error",{requestId:res.getHeader("X-Request-Id"),method:req.method,path:req.path,errorName:error.name,code:error.code,message:error.message});return res.status(error.statusCode).json(errorBody(error));} log("error","http.unhandled-error",{requestId:res.getHeader("X-Request-Id"),method:req.method,path:req.path,errorName:error.name,message:error.message}); return res.status(500).json({ error: "Internal server error.",code:"INTERNAL_ERROR" }); });

  return app;
}
