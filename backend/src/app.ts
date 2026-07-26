import "dotenv/config";
import express from "express";
import cors from "cors";
import { authRouter } from "./routes/auth.js";
import { usersRouter } from "./routes/users.js";
import { aiRouter } from "./routes/ai.js";
import { partnershipsRouter } from "./routes/partnerships.js";
import { companyAttachmentsRouter } from "./routes/companyAttachments.js";
import { applicationsRouter, jobsRouter } from "./routes/jobs.js";
import { contractsRouter, invoicesRouter } from "./routes/contracts.js";
import { conversationsRouter } from "./routes/conversations.js";
import { requireCsrf, securityHeaders } from "./middleware/security.js";
import { createRateLimiter } from "./middleware/rateLimit.js";
import { frontendOrigin, validateRuntimeConfig } from "./lib/config.js";

export function createApp() {
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

  app.use(securityHeaders);
  app.use(cors({ origin: frontendOrigin(), credentials: true }));
  app.use(express.json({ limit: "2mb" }));
  app.use(requireCsrf);

  app.get("/api/health", (_req, res) => {
    res.json({ status: "ok" });
  });

  app.use("/api/auth", authRateLimit, authRouter);
  app.use("/api/users", usersRouter);
  app.use("/api/ai", aiRateLimit, aiRouter);
  app.use("/api/partnerships", partnershipsRouter);
  app.use("/api/company-attachments", companyAttachmentsRouter);
  app.use("/api/jobs", jobsRouter);
  app.use("/api/applications", applicationsRouter);
  app.use("/api/contracts", contractsRouter);
  app.use("/api/invoices", invoicesRouter);
  app.use("/api/conversations", conversationsRouter);

  // Keep this last: catches anything unmatched under /api.
  app.use("/api", (_req, res) => {
    res.status(404).json({ error: "Not found." });
  });

  return app;
}
