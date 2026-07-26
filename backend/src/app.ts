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

const FRONTEND_ORIGIN = process.env.FRONTEND_ORIGIN || "http://localhost:5173";

export function createApp() {
  const app = express();

  app.use(cors({ origin: FRONTEND_ORIGIN }));
  app.use(express.json({ limit: "2mb" }));

  app.get("/api/health", (_req, res) => {
    res.json({ status: "ok" });
  });

  app.use("/api/auth", authRouter);
  app.use("/api/users", usersRouter);
  app.use("/api/ai", aiRouter);
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
