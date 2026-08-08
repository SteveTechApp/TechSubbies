import { Router } from "express";
import { z } from "zod";
import {
  createApplication,
  createJob,
  findApplication,
  findApplicationById,
  findJobById,
  findUserById,
  listActiveJobs,
  listApplicationsForEngineer,
  listApplicationsForJob,
  listApplicationsForCompany,
  listJobsForCompany,
  updateApplicationStatus,
  updateJob,
  recordPilotFunnelEvent,
} from "../lib/db.js";
import { sendApplicationStatusNotification } from "../lib/applicationNotifications.js";
import { toPublicApplication, toPublicJob } from "../lib/publicJob.js";
import { requireAuth, requireRole, type AuthedRequest } from "../middleware/auth.js";
import { canonicalizeRoleId } from "../lib/canonicalRoles.js";

export const jobsRouter = Router();

const jobSchema = z.object({
  title: z.string().min(1),
  description: z.string().min(1),
  location: z.string().min(1),
  dayRate: z.string().min(1),
  duration: z.string().min(1),
  currency: z.string().min(1),
  startDate: z.union([z.string(), z.null()]).optional(),
  jobType: z.string().min(1),
  experienceLevel: z.string().min(1),
  jobRole: z.string().min(1),
  canonicalRoleId: z.string().min(1).optional(),
  skillRequirements: z.array(z.record(z.any())).optional().default([]),
  supervisionArrangement: z.string().optional(),
  supervisionDisclaimerAccepted: z.boolean().optional(),
});

jobsRouter.get("/", async (_req, res) => {
  return res.json(listActiveJobs().map(toPublicJob));
});

jobsRouter.get("/mine", requireAuth, requireRole("Company", "Resourcing Company"), (req: AuthedRequest, res) => {
  return res.json(listJobsForCompany(req.userId!).map((job) => ({
    ...toPublicJob(job),
    moderatedAt: job.moderatedAt,
    moderationReason: job.moderationReason,
  })));
});

jobsRouter.get("/:jobId", async (req, res) => {
  const job = findJobById(req.params.jobId);
  if (!job || job.status !== "active") {
    return res.status(404).json({ error: "Job not found." });
  }
  return res.json(toPublicJob(job));
});

jobsRouter.post("/", requireAuth, requireRole("Company", "Resourcing Company"), async (req: AuthedRequest, res) => {
  const parsed = jobSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: parsed.error.issues.map((i) => i.message).join(", ") });
  }

  const canonicalRoleId = canonicalizeRoleId(parsed.data.canonicalRoleId || parsed.data.jobRole);
  if (parsed.data.canonicalRoleId && !canonicalRoleId) {
    return res.status(400).json({ error: "Select a recognized canonical role." });
  }
  const jobData = canonicalRoleId ? { ...parsed.data, canonicalRoleId } : parsed.data;
  const job = createJob(req.userId!, jobData);
  recordPilotFunnelEvent({ eventType: "job.posted", userId: req.userId, roleId: canonicalRoleId || parsed.data.jobRole, jobId: job.id });
  return res.status(201).json(toPublicJob(job));
});

const jobUpdateSchema = jobSchema.partial().extend({
  status: z.enum(["active", "closed", "filled"]).optional(),
});

jobsRouter.patch("/:jobId", requireAuth, async (req: AuthedRequest, res) => {
  const job = findJobById(req.params.jobId);
  if (!job) return res.status(404).json({ error: "Job not found." });
  if (job.companyId !== req.userId) {
    return res.status(403).json({ error: "Only the posting company can update this job." });
  }

  const parsed = jobUpdateSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: parsed.error.issues.map((i) => i.message).join(", ") });
  }

  const { status, ...data } = parsed.data;
  if (status === "active" && job.moderatorId && job.status === "closed") {
    return res.status(403).json({
      error: "An administrator closed this listing. Contact TechSubbies support before it can be reopened.",
    });
  }

  let normalizedData = data;
  if (data.canonicalRoleId !== undefined || data.jobRole !== undefined) {
    const canonicalRoleId = canonicalizeRoleId(data.canonicalRoleId || data.jobRole);
    if (!canonicalRoleId) {
      return res.status(400).json({ error: "Select a recognized canonical role." });
    }
    normalizedData = { ...data, canonicalRoleId };
  }

  const updated = updateJob(job.id, { data: normalizedData, status });
  return res.json(toPublicJob(updated!));
});

jobsRouter.post("/:jobId/apply", requireAuth, requireRole("Engineer"), async (req: AuthedRequest, res) => {
  const job = findJobById(req.params.jobId);
  if (!job) return res.status(404).json({ error: "Job not found." });
  if (job.status !== "active") {
    return res.status(409).json({ error: "This job is no longer accepting applications." });
  }
  if (findApplication(job.id, req.userId!)) {
    return res.status(409).json({ error: "You've already applied for this job." });
  }

  const application = createApplication(job.id, req.userId!, "Applied");
  recordPilotFunnelEvent({ eventType: "application.submitted", userId: req.userId, jobId: job.id });
  return res.status(201).json(toPublicApplication(application));
});

jobsRouter.get("/:jobId/applications", requireAuth, async (req: AuthedRequest, res) => {
  const job = findJobById(req.params.jobId);
  if (!job) return res.status(404).json({ error: "Job not found." });
  if (job.companyId !== req.userId) {
    return res.status(403).json({ error: "Only the posting company can view its applicants." });
  }
  return res.json(listApplicationsForJob(job.id).map(toPublicApplication));
});

export const applicationsRouter = Router();

applicationsRouter.get("/company", requireAuth, requireRole("Company", "Resourcing Company"), (req: AuthedRequest, res) => {
  return res.json(listApplicationsForCompany(req.userId!).map(toPublicApplication));
});

const applicationStatusSchema = z.object({
  status: z.enum(["Viewed", "Offered", "Hired", "Rejected"]),
});

const applicationStatusTransitions: Record<string, string[]> = {
  Applied: ["Viewed", "Offered", "Rejected"],
  Viewed: ["Offered", "Rejected"],
  Offered: ["Hired", "Rejected"],
  Hired: [],
  Rejected: [],
};

applicationsRouter.patch(
  "/:applicationId",
  requireAuth,
  requireRole("Company", "Resourcing Company"),
  async (req: AuthedRequest, res) => {
    const application = findApplicationById(req.params.applicationId);
    if (!application) return res.status(404).json({ error: "Application not found." });

    const job = findJobById(application.jobId);
    if (!job || job.companyId !== req.userId) {
      return res.status(403).json({ error: "Only the posting company can update this application." });
    }

    const parsed = applicationStatusSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ error: parsed.error.issues.map((issue) => issue.message).join(", ") });
    }

    if (parsed.data.status === application.status) {
      return res.json({
        ...toPublicApplication(updateApplicationStatus(application.id, application.status, true)!),
        notificationSent: false,
      });
    }

    const allowedStatuses = applicationStatusTransitions[application.status] || [];
    if (!allowedStatuses.includes(parsed.data.status)) {
      return res.status(409).json({
        error: `Application status cannot change from ${application.status} to ${parsed.data.status}.`,
      });
    }

    const updated = updateApplicationStatus(application.id, parsed.data.status, true)!;
    const engineer = findUserById(application.engineerId);
    let jobTitle = "a technical opportunity";
    try {
      jobTitle = String(JSON.parse(job.data).title || jobTitle);
    } catch {
      // Keep the safe fallback title.
    }
    let notificationSent = false;
    if (engineer && parsed.data.status !== "Viewed") {
      notificationSent = await sendApplicationStatusNotification({
        to: engineer.email,
        jobTitle,
        status: parsed.data.status,
      });
    }

    return res.json({
      ...toPublicApplication(updated),
      notificationSent,
    });
  }
);

applicationsRouter.get("/me", requireAuth, requireRole("Engineer"), async (req: AuthedRequest, res) => {
  return res.json(listApplicationsForEngineer(req.userId!).map((application) => {
    const job = findJobById(application.jobId);
    const company = job ? findUserById(job.companyId) : undefined;
    let jobData: Record<string, unknown> = {};
    if (job) {
      try {
        jobData = JSON.parse(job.data) as Record<string, unknown>;
      } catch {
        // Keep safe fallbacks for damaged legacy job data.
      }
    }
    return {
      ...toPublicApplication(application),
      jobTitle: String(jobData.title || "Technical opportunity"),
      jobLocation: String(jobData.location || ""),
      companyName: company?.name || "TechSubbies client",
    };
  }));
});