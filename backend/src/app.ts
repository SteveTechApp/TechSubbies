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
import { requireCsrf, securityHeaders } from "./middleware/security.js";
import { createRateLimiter } from "./middleware/rateLimit.js";
import { frontendOrigin, validateRuntimeConfig } from "./lib/config.js";
import { requireVerifiedEmailForMutation } from "./middleware/auth.js";
import { checkDatabaseConnection } from "./lib/db.js";
import { checkEvidenceRepository } from "./lib/evidenceRepository.js";
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
  app.use(express.json({ limit: "2mb" }));
  app.use(requireCsrf);

  app.get("/api/health/live", (_req, res) => {
    res.json({ status: "ok" });
  });

  const readinessCheck = options.readinessCheck
    || (() => checkDatabaseConnection() && checkEvidenceRepository());
  const readinessHandler = (_req: express.Request, res: express.Response) => {
    try {
      if (!readinessCheck()) throw new Error("Readiness check returned false.");
      return res.json({ status: "ready", checks: { database: "ok", evidenceRepository: "ok" } });
    } catch {
      return res.status(503).json({
        status: "unavailable",
        checks: { database: "unavailable", evidenceRepository: "unavailable" },
      });
    }
  };

  app.get("/api/health/ready", readinessHandler);
  // Backwards-compatible alias for existing deployment checks.
  app.get("/api/health", readinessHandler);

  app.use("/api/auth", authRateLimit, authRouter);
  app.use("/api/users", usersRouter);
  app.use("/api/admin", adminRouter);
  app.use("/api/ai", aiRateLimit, aiRouter);
  app.use(
    [
      "/api/partnerships",
      "/api/company-attachments",
      "/api/jobs",
      "/api/applications",
      "/api/contracts",
      "/api/conversations",
      "/api/evidence",
    ],
    requireVerifiedEmailForMutation
  );
  app.use("/api/partnerships", partnershipsRouter);
  app.use("/api/company-attachments", companyAttachmentsRouter);
  app.use("/api/jobs", jobsRouter);
  app.use("/api/applications", applicationsRouter);
  app.use("/api/contracts", contractsRouter);
  app.use("/api/conversations", conversationsRouter);
  app.use("/api/evidence", evidenceRouter);

  // Keep this last: catches anything unmatched under /api.
  app.use("/api", (_req, res) => {
    res.status(404).json({ error: "Not found." });
  });
  app.use(safeErrorHandler);

  return app;
}
