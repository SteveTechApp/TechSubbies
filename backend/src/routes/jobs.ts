import { Router } from "express";
import { z } from "zod";
import {
  createApplication,
  createJob,
  findApplication,
  findJobById,
  findUserById,
  listActiveJobs,
  listApplicationsForEngineer,
  listApplicationsForJob,
  updateJob,
} from "../lib/db.js";
import { toPublicApplication, toPublicJob } from "../lib/publicJob.js";
import { requireAuth, type AuthedRequest } from "../middleware/auth.js";

export const jobsRouter = Router();

// Roles that are allowed to post/manage jobs. Matches the `Role` enum
// values in types/index.ts ("Company", "Resourcing Company", ...).
const COMPANY_ROLES = new Set(["Company", "Resourcing Company"]);

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
  skillRequirements: z.array(z.record(z.any())).optional().default([]),
  // Self-declared supervision arrangement for junior/labour-type roles (see
  // utils/leadSupervision.ts on the frontend) - optional so older/simpler
  // job posts without it still validate.
  supervisionArrangement: z.string().optional(),
  supervisionDisclaimerAccepted: z.boolean().optional(),
});

// GET /api/jobs - public list of active jobs (search/browse screens).
jobsRouter.get("/", async (_req, res) => {
  return res.json(listActiveJobs().map(toPublicJob));
});

// GET /api/jobs/:jobId - a single job.
jobsRouter.get("/:jobId", async (req, res) => {
  const job = findJobById(req.params.jobId);
  if (!job) {
    return res.status(404).json({ error: "Job not found." });
  }
  return res.json(toPublicJob(job));
});

// POST /api/jobs - create a job posting (Company / Resourcing Company only).
jobsRouter.post("/", requireAuth, async (req: AuthedRequest, res) => {
  const poster = findUserById(req.userId!);
  if (!poster) {
    return res.status(404).json({ error: "Account not found." });
  }
  if (!COMPANY_ROLES.has(poster.role)) {
    return res.status(403).json({ error: "Only company accounts can post jobs." });
  }

  const parsed = jobSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: parsed.error.issues.map((i) => i.message).join(", ") });
  }

  const job = createJob(poster.id, parsed.data);
  return res.status(201).json(toPublicJob(job));
});

const jobUpdateSchema = jobSchema.partial().extend({
  status: z.enum(["active", "closed", "filled"]).optional(),
});

// PATCH /api/jobs/:jobId - update a job posting (only the posting company).
jobsRouter.patch("/:jobId", requireAuth, async (req: AuthedRequest, res) => {
  const job = findJobById(req.params.jobId);
  if (!job) {
    return res.status(404).json({ error: "Job not found." });
  }
  if (job.companyId !== req.userId) {
    return res.status(403).json({ error: "Only the posting company can update this job." });
  }

  const parsed = jobUpdateSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: parsed.error.issues.map((i) => i.message).join(", ") });
  }

  const { status, ...data } = parsed.data;
  const updated = updateJob(job.id, { data, status });
  return res.json(toPublicJob(updated!));
});

// POST /api/jobs/:jobId/apply - an engineer applies for a job.
jobsRouter.post("/:jobId/apply", requireAuth, async (req: AuthedRequest, res) => {
  const applicant = findUserById(req.userId!);
  if (!applicant) {
    return res.status(404).json({ error: "Account not found." });
  }
  if (applicant.role !== "Engineer") {
    return res.status(403).json({ error: "Only engineer accounts can apply for jobs." });
  }

  const job = findJobById(req.params.jobId);
  if (!job) {
    return res.status(404).json({ error: "Job not found." });
  }
  if (job.status !== "active") {
    return res.status(409).json({ error: "This job is no longer accepting applications." });
  }

  if (findApplication(job.id, applicant.id)) {
    return res.status(409).json({ error: "You've already applied for this job." });
  }

  const application = createApplication(job.id, applicant.id, "Applied");
  return res.status(201).json(toPublicApplication(application));
});

// GET /api/jobs/:jobId/applications - list applicants for a job (posting company only).
jobsRouter.get("/:jobId/applications", requireAuth, async (req: AuthedRequest, res) => {
  const job = findJobById(req.params.jobId);
  if (!job) {
    return res.status(404).json({ error: "Job not found." });
  }
  if (job.companyId !== req.userId) {
    return res.status(403).json({ error: "Only the posting company can view its applicants." });
  }

  return res.json(listApplicationsForJob(job.id).map(toPublicApplication));
});

// GET /api/applications/me - the signed-in engineer's own applications.
// Mounted separately in app.ts under /api/applications, kept in this file
// since it shares all its helpers with the jobs routes above.
export const applicationsRouter = Router();

applicationsRouter.get("/me", requireAuth, async (req: AuthedRequest, res) => {
  const user = findUserById(req.userId!);
  if (!user) {
    return res.status(404).json({ error: "Account not found." });
  }
  return res.json(listApplicationsForEngineer(user.id).map(toPublicApplication));
});
