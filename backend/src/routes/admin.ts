import { Router } from "express";
import { z } from "zod";
import {
  listAccountDeletionRequests,
  reviewAccountDeletionRequest,
  getAccountDeletionEligibility,
  processAccountDeletionRequest,
  getAccountDeletionSummary,
  accountDeletionResponseDueAt,
  countAccountDeletionRequests,
  findAccountDeletionReviewItem,
} from "../lib/accountDeletion.js";
import { recordAccountAudit } from "../lib/accountAudit.js";
import { requireAuth, requireRole, type AuthedRequest } from "../middleware/auth.js";
import {
  countAdminUsers,
  findUserById,
  listAdminUsers,
  setUserSuspension,
  getAdminPlatformMetrics,
  countAdminJobs,
  listAdminJobs,
  moderateJob,
  listPendingMembershipSelections,
  activateRequestedMembership,
} from "../lib/db.js";
import { sendPrivacyNotification } from "../lib/privacyNotifications.js";
import { sendModerationNotification } from "../lib/moderationNotifications.js";
import { toPublicJob } from "../lib/publicJob.js";
import { sendJobModerationNotification } from "../lib/jobModerationNotifications.js";

export const adminRouter = Router();

adminRouter.use(requireAuth, requireRole("Admin"));

adminRouter.get("/privacy-summary", (_req, res) => {
  return res.json({ summary: getAccountDeletionSummary() });
});

adminRouter.get("/metrics", (_req, res) => {
  return res.json({ metrics: getAdminPlatformMetrics() });
});

adminRouter.get("/membership-selections", (_req, res) => {
  return res.json({ selections: listPendingMembershipSelections() });
});

adminRouter.post("/membership-selections/:userId/confirm", (req: AuthedRequest, res) => {
  const parsed = z.object({ confirmation: z.literal("BILLING VERIFIED") }).safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: 'Type "BILLING VERIFIED" to confirm activation.' });
  }
  const updated = activateRequestedMembership(req.params.userId, req.userId!);
  if (!updated) {
    return res.status(409).json({ error: "No pending membership selection is available for this account." });
  }
  recordAccountAudit({
    eventType: "membership.activated",
    outcome: "success",
    userId: updated.id,
    requestId: res.locals.requestId,
  });
  return res.json({
    userId: updated.id,
    activeTier: (JSON.parse(updated.profile) as Record<string, unknown>).profileTier,
  });
});

adminRouter.get("/jobs", (req, res) => {
  const parsed = z.object({
    limit: z.coerce.number().int().min(1).max(100).default(25),
    offset: z.coerce.number().int().min(0).default(0),
    query: z.string().trim().max(100).default(""),
  }).safeParse({
    limit: req.query.limit,
    offset: req.query.offset,
    query: req.query.query,
  });
  if (!parsed.success) {
    return res.status(400).json({ error: "Invalid job search or pagination." });
  }
  const jobs = listAdminJobs(parsed.data).map((job) => ({
    ...toPublicJob(job),
    companyName: job.companyName,
    companyEmail: job.companyEmail,
    moderatedAt: job.moderatedAt,
    moderationReason: job.moderationReason,
  }));
  return res.json({
    jobs,
    total: countAdminJobs(parsed.data.query),
    limit: parsed.data.limit,
    offset: parsed.data.offset,
  });
});

adminRouter.patch("/jobs/:jobId/moderation", async (req: AuthedRequest, res) => {
  const parsed = z.discriminatedUnion("status", [
    z.object({ status: z.literal("closed"), reason: z.string().trim().min(10).max(500) }),
    z.object({ status: z.literal("active"), reason: z.string().optional() }),
  ]).safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: "Closing a job requires a reason of at least 10 characters." });
  }
  const updated = moderateJob(
    req.params.jobId,
    parsed.data.status,
    req.userId!,
    parsed.data.status === "closed" ? parsed.data.reason : null
  );
  if (!updated) {
    return res.status(404).json({ error: "Job not found." });
  }
  const company = findUserById(updated.companyId);
  let jobTitle = "Job listing";
  try {
    jobTitle = String(JSON.parse(updated.data).title || jobTitle);
  } catch {
    // Keep the safe fallback title.
  }
  recordAccountAudit({
    eventType: parsed.data.status === "closed" ? "job.closed" : "job.reopened",
    outcome: "success",
    userId: updated.companyId,
    requestId: res.locals.requestId,
  });
  const notificationSent = company
    ? await sendJobModerationNotification({
        to: company.email,
        title: jobTitle,
        jobId: updated.id,
        status: parsed.data.status,
        reason: updated.moderationReason,
      })
    : false;
  return res.json({ job: toPublicJob(updated), notificationSent });
});

adminRouter.get("/users", (req, res) => {
  const parsed = z.object({
    limit: z.coerce.number().int().min(1).max(100).default(25),
    offset: z.coerce.number().int().min(0).default(0),
    query: z.string().trim().max(100).default(""),
  }).safeParse({
    limit: req.query.limit,
    offset: req.query.offset,
    query: req.query.query,
  });
  if (!parsed.success) {
    return res.status(400).json({ error: "Invalid user search or pagination." });
  }
  return res.json({
    users: listAdminUsers(parsed.data),
    total: countAdminUsers(parsed.data.query),
    limit: parsed.data.limit,
    offset: parsed.data.offset,
  });
});

adminRouter.patch("/users/:userId/suspension", async (req: AuthedRequest, res) => {
  const parsed = z.discriminatedUnion("suspended", [
    z.object({ suspended: z.literal(true), reason: z.string().trim().min(10).max(500) }),
    z.object({ suspended: z.literal(false), reason: z.string().optional() }),
  ]).safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: "Suspension requires a reason of at least 10 characters." });
  }
  if (req.params.userId === req.userId) {
    return res.status(409).json({ error: "Administrators cannot suspend their own account." });
  }
  const updated = setUserSuspension(
    req.params.userId,
    parsed.data.suspended,
    parsed.data.suspended ? parsed.data.reason : null,
    req.userId!
  );
  if (!updated) {
    return res.status(404).json({ error: "Account not found." });
  }
  recordAccountAudit({
    eventType: parsed.data.suspended ? "account.suspended" : "account.reactivated",
    outcome: "success",
    userId: updated.id,
    requestId: res.locals.requestId,
  });
  const notificationSent = await sendModerationNotification({
    to: updated.email,
    suspended: parsed.data.suspended,
    reason: updated.suspensionReason,
  });
  return res.json({
    user: {
      id: updated.id,
      email: updated.email,
      role: updated.role,
      name: updated.name,
      suspendedAt: updated.suspendedAt,
      suspensionReason: updated.suspensionReason,
      updatedAt: updated.updatedAt,
    },
    notificationSent,
  });
});

adminRouter.get("/deletion-requests", (req, res) => {
  const parsed = z.enum(["pending", "approved", "rejected", "cancelled", "processed"]).safeParse(req.query.status || "pending");
  if (!parsed.success) {
    return res.status(400).json({ error: "Unsupported deletion request status." });
  }
  const paging = z.object({
    limit: z.coerce.number().int().min(1).max(100).default(20),
    offset: z.coerce.number().int().min(0).default(0),
    query: z.string().trim().max(100).default(""),
  }).safeParse({
    limit: req.query.limit,
    offset: req.query.offset,
    query: req.query.query,
  });
  if (!paging.success) {
    return res.status(400).json({ error: "Invalid privacy queue search or pagination." });
  }
  const requests = listAccountDeletionRequests(parsed.data, paging.data).map((request) => ({
    ...request,
    responseDueAt: accountDeletionResponseDueAt(request.requestedAt),
    eligibility: getAccountDeletionEligibility(request.userId),
  }));
  return res.json({
    requests,
    total: countAccountDeletionRequests(parsed.data, paging.data.query),
    limit: paging.data.limit,
    offset: paging.data.offset,
  });
});

adminRouter.patch("/deletion-requests/:requestId", async (req: AuthedRequest, res) => {
  const parsed = z.object({
    decision: z.enum(["approved", "rejected"]),
    note: z.string().trim().min(10).max(1000),
    userMessage: z.string().trim().min(10).max(1000),
  }).safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({
      error: "Choose approved or rejected and provide internal and user-facing notes of at least 10 characters.",
    });
  }

  const queued = findAccountDeletionReviewItem(req.params.requestId, "pending");
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
    parsed.data.note,
    parsed.data.userMessage
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
  const notificationSent = await sendPrivacyNotification(
    queued.accountEmail,
    parsed.data.decision
  );
  return res.json({
    request: reviewed,
    processingNotice: "No account data has been deleted. Complete retention and active-marketplace checks first.",
    notificationSent,
  });
});

adminRouter.post("/deletion-requests/:requestId/process", async (req: AuthedRequest, res) => {
  const parsed = z.object({
    confirmation: z.literal("ANONYMISE ACCOUNT"),
  }).safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: 'Type "ANONYMISE ACCOUNT" to confirm final processing.' });
  }

  const approved = findAccountDeletionReviewItem(req.params.requestId, "approved");
  const accountEmail = approved ? findUserById(approved.userId)?.email : undefined;
  const processed = processAccountDeletionRequest(req.params.requestId, req.userId!);
  if (!processed) {
    return res.status(409).json({
      error: "Only an approved, eligible, unprocessed request can be processed.",
    });
  }
  recordAccountAudit({
    eventType: "deletion.processed",
    outcome: "success",
    userId: processed.userId,
    requestId: res.locals.requestId,
  });
  const notificationSent = accountEmail
    ? await sendPrivacyNotification(accountEmail, "processed")
    : false;
  return res.json({
    request: processed,
    processingNotice: "Direct identity and authentication data were anonymised; transactional references were retained.",
    notificationSent,
  });
});
