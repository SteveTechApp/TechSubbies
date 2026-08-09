import { Router } from "express";
import { z } from "zod";
import { findJobById, findUserById } from "../lib/db.js";
import {
  getMarketplaceAnalyticsSummary,
  recordMarketplaceAnalyticsEvent,
  type MarketplaceAnalyticsWindow,
} from "../lib/marketplaceAnalyticsRepository.js";
import { requireAuth, requireRole, type AuthedRequest } from "../middleware/auth.js";

export const marketplaceAnalyticsRouter = Router();
export const adminMarketplaceAnalyticsRouter = Router();

const clientEventSchema = z.object({
  eventType: z.enum(["search.performed", "profile.viewed", "invitation.sent"]),
  subjectUserId: z.string().min(1).optional(),
  jobId: z.string().min(1).optional(),
});

marketplaceAnalyticsRouter.post(
  "/events",
  requireAuth,
  requireRole("Company", "Resourcing Company"),
  (req: AuthedRequest, res) => {
    const parsed = clientEventSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ error: "Unsupported marketplace analytics event." });
    }

    const { eventType, subjectUserId, jobId } = parsed.data;
    if (eventType !== "search.performed") {
      if (!subjectUserId) {
        return res.status(400).json({ error: "This event requires an engineer profile." });
      }
      const engineer = findUserById(subjectUserId);
      if (!engineer || engineer.role !== "Engineer" || engineer.deletedAt || engineer.suspendedAt) {
        return res.status(400).json({ error: "The selected engineer is unavailable." });
      }
    }

    if (eventType === "invitation.sent") {
      if (!jobId) {
        return res.status(400).json({ error: "An invitation event requires a job." });
      }
      const job = findJobById(jobId);
      if (!job || job.companyId !== req.userId) {
        return res.status(403).json({ error: "Only the posting company can record an invitation." });
      }
    }

    const recorded = recordMarketplaceAnalyticsEvent({
      eventType,
      actorUserId: req.userId!,
      subjectUserId,
      jobId,
    });
    return res.status(202).json({ recorded, deduplicated: !recorded });
  }
);

adminMarketplaceAnalyticsRouter.use(requireAuth, requireRole("Admin"));
adminMarketplaceAnalyticsRouter.get("/", (req, res) => {
  const raw = String(req.query.window || "30");
  const parsed = z.enum(["30", "90", "all"]).safeParse(raw);
  if (!parsed.success) {
    return res.status(400).json({ error: "Analytics window must be 30, 90 or all." });
  }
  const windowDays: MarketplaceAnalyticsWindow = parsed.data === "all"
    ? "all"
    : Number(parsed.data) as 30 | 90;
  return res.json({ analytics: getMarketplaceAnalyticsSummary(windowDays) });
});
