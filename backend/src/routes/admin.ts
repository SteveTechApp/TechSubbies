import { Router } from "express";
import { z } from "zod";
import {
  listAccountDeletionRequests,
  reviewAccountDeletionRequest,
  getAccountDeletionEligibility,
} from "../lib/accountDeletion.js";
import { recordAccountAudit } from "../lib/accountAudit.js";
import { requireAuth, requireRole, type AuthedRequest } from "../middleware/auth.js";

export const adminRouter = Router();

adminRouter.use(requireAuth, requireRole("Admin"));

adminRouter.get("/deletion-requests", (req, res) => {
  const parsed = z.enum(["pending", "approved", "rejected", "cancelled"]).safeParse(req.query.status || "pending");
  if (!parsed.success) {
    return res.status(400).json({ error: "Unsupported deletion request status." });
  }
  const requests = listAccountDeletionRequests(parsed.data).map((request) => ({
    ...request,
    eligibility: getAccountDeletionEligibility(request.userId),
  }));
  return res.json({ requests });
});

adminRouter.patch("/deletion-requests/:requestId", (req: AuthedRequest, res) => {
  const parsed = z.object({
    decision: z.enum(["approved", "rejected"]),
    note: z.string().trim().min(10).max(1000),
  }).safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({
      error: "Choose approved or rejected and provide a review note of at least 10 characters.",
    });
  }

  const queued = listAccountDeletionRequests("pending").find(
    (request) => request.id === req.params.requestId
  );
  if (!queued) {
    return res.status(409).json({ error: "This request is missing or has already been reviewed." });
  }
  const eligibility = getAccountDeletionEligibility(queued.userId);
  if (parsed.data.decision === "approved" && !eligibility.eligible) {
    return res.status(409).json({
      error: "This account still has unresolved marketplace obligations.",
      eligibility,
    });
  }

  const reviewed = reviewAccountDeletionRequest(
    req.params.requestId,
    req.userId!,
    parsed.data.decision,
    parsed.data.note
  );
  if (!reviewed) {
    return res.status(409).json({ error: "This request is missing or has already been reviewed." });
  }

  recordAccountAudit({
    eventType: `deletion.${parsed.data.decision}`,
    outcome: "success",
    userId: reviewed.userId,
    requestId: res.locals.requestId,
  });
  return res.json({
    request: reviewed,
    processingNotice: "No account data has been deleted. Complete retention and active-marketplace checks first.",
  });
});
