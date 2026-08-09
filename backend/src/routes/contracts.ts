import { Router } from "express";
import { z } from "zod";
import {
  createContractAndHireApplication,
  findApplication,
  findContractById,
  findContractForApplication,
  findJobById,
  findUserById,
  listContractsForUser,
  updateContractMilestones,
  updateContractSignature,
  updateContractTimesheets,
  recordPilotFunnelEvent,
} from "../lib/db.js";
import { sendApplicationStatusNotification } from "../lib/applicationNotifications.js";
import { toPublicContract } from "../lib/publicContract.js";
import { requireAuth, requireRole, type AuthedRequest } from "../middleware/auth.js";

export const contractsRouter = Router();

// Matches the string values of the `MilestoneStatus`/`ContractStatus`/
// `TimesheetStatus` enums in types/index.ts exactly, so a contract created
// here slots straight into the frontend's existing status-badge/permission
// logic (see views/ContractDetailsView.tsx) without any translation layer.
const MILESTONE_STATUS = {
  NOT_STARTED: "Not Started",
  IN_PROGRESS: "In Progress",
  SUBMITTED: "Submitted for Approval",
  APPROVED: "Approved",
} as const;

const CONTRACT_STATUS = {
  PENDING_SIGNATURE: "Pending Signature",
  SIGNED: "Signed by Engineer",
  ACTIVE: "Active",
} as const;

const TIMESHEET_STATUS = {
  SUBMITTED: "submitted",
  APPROVED: "approved",
} as const;

function isParticipant(contract: { companyId: string; engineerId: string }, userId: string): boolean {
  return contract.companyId === userId || contract.engineerId === userId;
}

const milestoneInputSchema = z.object({
  id: z.string().min(1),
  description: z.string().min(1),
  amount: z.number(),
});

const contractSchema = z.object({
  jobId: z.string().min(1),
  engineerId: z.string().min(1),
  jobTitle: z.string().optional(),
  type: z.string().min(1),
  description: z.string().min(1),
  amount: z.union([z.number(), z.string()]),
  currency: z.string().min(1),
  milestones: z.array(milestoneInputSchema).optional().default([]),
  // Recorded when a company overrides the "needs a lead/supervisor" check -
  // see utils/leadSupervision.ts on the frontend, which decides whether
  // this is required before letting the "Send for Signature" button work.
  supervisionOverrideReason: z.string().optional(),
});

// POST /api/contracts - create a contract for a hired engineer (Company /
// Resourcing Company only). Starts life as "Pending Signature" - ready for
// the engineer to review and sign straight away, rather than sitting in an
// unreachable draft state.
contractsRouter.post(
  "/",
  requireAuth,
  requireRole("Company", "Resourcing Company"),
  async (req: AuthedRequest, res) => {
  const parsed = contractSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: parsed.error.issues.map((i) => i.message).join(", ") });
  }

  const { jobId, engineerId, milestones, ...data } = parsed.data;
  const job = findJobById(jobId);
  if (!job) {
    return res.status(404).json({ error: "Job not found." });
  }
  if (job.companyId !== req.userId) {
    return res.status(403).json({ error: "Only the posting company can create this contract." });
  }

  const engineer = findUserById(engineerId);
  if (!engineer || engineer.role !== "Engineer" || engineer.deletedAt || engineer.suspendedAt) {
    return res.status(400).json({ error: "The selected engineer is not available for contracting." });
  }

  const application = findApplication(jobId, engineerId);
  if (findContractForApplication(jobId, engineerId)) {
    return res.status(409).json({ error: "A contract already exists for this application." });
  }
  if (!application || application.status !== "Offered") {
    return res.status(409).json({ error: "A contract requires an offered application for this job." });
  }

  const milestonesWithStatus = milestones.map((m) => ({ ...m, status: MILESTONE_STATUS.NOT_STARTED }));
  let jobTitle = "Technical opportunity";
  try {
    jobTitle = String(JSON.parse(job.data).title || jobTitle);
  } catch {
    // Keep the safe fallback title.
  }

  const contract = createContractAndHireApplication(
    application.id,
    req.userId!,
    engineerId,
    jobId,
    CONTRACT_STATUS.PENDING_SIGNATURE,
    { ...data, jobTitle },
    milestonesWithStatus
  );
  recordPilotFunnelEvent({ eventType: "contract.created", userId: req.userId, jobId });
  const notificationSent = await sendApplicationStatusNotification({
    to: engineer.email,
    jobTitle,
    status: "Hired",
  });
  return res.status(201).json({ ...toPublicContract(contract), notificationSent });
  }
);

// GET /api/contracts/me - every contract where the signed-in user is
// either the company or the engineer party.
contractsRouter.get("/me", requireAuth, async (req: AuthedRequest, res) => {
  return res.json(listContractsForUser(req.userId!).map(toPublicContract));
});

// GET /api/contracts/:contractId - a single contract, participants only.
contractsRouter.get("/:contractId", requireAuth, async (req: AuthedRequest, res) => {
  const contract = findContractById(req.params.contractId);
  if (!contract) {
    return res.status(404).json({ error: "Contract not found." });
  }
  if (!isParticipant(contract, req.userId!)) {
    return res.status(403).json({ error: "You are not a party to this contract." });
  }
  return res.json(toPublicContract(contract));
});

const signSchema = z.object({ signatureName: z.string().min(1) });

// PATCH /api/contracts/:contractId/sign - the engineer signs first
// (Pending Signature -> Signed by Engineer), then the company/admin
// countersigns to activate it (Signed by Engineer -> Active). Matches the
// two-step flow in views/ContractDetailsView.tsx exactly.
contractsRouter.patch("/:contractId/sign", requireAuth, async (req: AuthedRequest, res) => {
  const contract = findContractById(req.params.contractId);
  if (!contract) {
    return res.status(404).json({ error: "Contract not found." });
  }

  const parsed = signSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: "A signature name is required." });
  }

  const signer = findUserById(req.userId!);
  if (!signer) {
    return res.status(404).json({ error: "Account not found." });
  }

  const signature = { name: parsed.data.signatureName, date: new Date().toISOString() };

  if (contract.engineerId === signer.id) {
    if (contract.status !== CONTRACT_STATUS.PENDING_SIGNATURE || contract.engineerSignature) {
      return res.status(409).json({ error: "This contract isn't waiting on your signature." });
    }
    const updated = updateContractSignature(contract.id, "engineerSignature", signature, CONTRACT_STATUS.SIGNED);
    return res.json(toPublicContract(updated!));
  }

  if (contract.companyId === signer.id || signer.role === "Admin") {
    if (contract.status !== CONTRACT_STATUS.SIGNED || contract.companySignature) {
      return res.status(409).json({ error: "This contract isn't waiting on a countersignature." });
    }
    const updated = updateContractSignature(contract.id, "companySignature", signature, CONTRACT_STATUS.ACTIVE);
    return res.json(toPublicContract(updated!));
  }

  return res.status(403).json({ error: "You are not a party to this contract." });
});

function findMilestone(contract: ReturnType<typeof findContractById>, milestoneId: string) {
  if (!contract) return null;
  const milestones = JSON.parse(contract.milestones) as { id: string; status: string }[];
  const index = milestones.findIndex((m) => m.id === milestoneId);
  return index === -1 ? null : { milestones, index };
}

// PATCH /api/contracts/:contractId/milestones/:milestoneId/start - the
// company (or admin) confirms that work may begin. No payment is processed.
contractsRouter.patch(
  "/:contractId/milestones/:milestoneId/start",
  requireAuth,
  async (req: AuthedRequest, res) => {
    const contract = findContractById(req.params.contractId);
    if (!contract) return res.status(404).json({ error: "Contract not found." });

    const signer = findUserById(req.userId!);
    if (!signer || !(contract.companyId === signer.id || signer.role === "Admin")) {
      return res.status(403).json({ error: "Only the client can start a milestone." });
    }

    const found = findMilestone(contract, req.params.milestoneId);
    if (!found) return res.status(404).json({ error: "Milestone not found." });
    if (found.milestones[found.index].status !== MILESTONE_STATUS.NOT_STARTED) {
      return res.status(409).json({ error: "This milestone has already started." });
    }

    found.milestones[found.index].status = MILESTONE_STATUS.IN_PROGRESS;
    const updated = updateContractMilestones(contract.id, found.milestones);
    return res.json(toPublicContract(updated!));
  }
);

// PATCH /api/contracts/:contractId/milestones/:milestoneId/submit - the
// engineer marks an in-progress milestone as done, for the company to approve.
contractsRouter.patch(
  "/:contractId/milestones/:milestoneId/submit",
  requireAuth,
  async (req: AuthedRequest, res) => {
    const contract = findContractById(req.params.contractId);
    if (!contract) return res.status(404).json({ error: "Contract not found." });
    if (contract.engineerId !== req.userId) {
      return res.status(403).json({ error: "Only the contractor can submit a milestone for approval." });
    }

    const found = findMilestone(contract, req.params.milestoneId);
    if (!found) return res.status(404).json({ error: "Milestone not found." });
    if (found.milestones[found.index].status !== MILESTONE_STATUS.IN_PROGRESS) {
      return res.status(409).json({ error: "This milestone isn't in progress." });
    }

    found.milestones[found.index].status = MILESTONE_STATUS.SUBMITTED;
    const updated = updateContractMilestones(contract.id, found.milestones);
    return res.json(toPublicContract(updated!));
  }
);

// PATCH /api/contracts/:contractId/milestones/:milestoneId/approve - the
// company (or admin) confirms that submitted work is approved.
contractsRouter.patch(
  "/:contractId/milestones/:milestoneId/approve",
  requireAuth,
  async (req: AuthedRequest, res) => {
    const contract = findContractById(req.params.contractId);
    if (!contract) return res.status(404).json({ error: "Contract not found." });

    const signer = findUserById(req.userId!);
    if (!signer || !(contract.companyId === signer.id || signer.role === "Admin")) {
      return res.status(403).json({ error: "Only the client can approve a milestone." });
    }

    const found = findMilestone(contract, req.params.milestoneId);
    if (!found) return res.status(404).json({ error: "Milestone not found." });
    if (found.milestones[found.index].status !== MILESTONE_STATUS.SUBMITTED) {
      return res.status(409).json({ error: "This milestone hasn't been submitted for approval." });
    }

    found.milestones[found.index].status = MILESTONE_STATUS.APPROVED;
    const updated = updateContractMilestones(contract.id, found.milestones);
    return res.json(toPublicContract(updated!));
  }
);

const timesheetSchema = z.object({
  period: z.string().min(1),
  days: z.number().positive(),
});

// POST /api/contracts/:contractId/timesheets - the engineer submits a new
// timesheet on a day-rate contract.
contractsRouter.post("/:contractId/timesheets", requireAuth, async (req: AuthedRequest, res) => {
  const contract = findContractById(req.params.contractId);
  if (!contract) return res.status(404).json({ error: "Contract not found." });
  if (contract.engineerId !== req.userId) {
    return res.status(403).json({ error: "Only the contractor can submit a timesheet." });
  }

  const parsed = timesheetSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: parsed.error.issues.map((i) => i.message).join(", ") });
  }

  const timesheets = JSON.parse(contract.timesheets) as Record<string, unknown>[];
  const newTimesheet = {
    id: `ts-${Date.now()}-${timesheets.length}`,
    contractId: contract.id,
    engineerId: contract.engineerId,
    period: parsed.data.period,
    days: parsed.data.days,
    status: TIMESHEET_STATUS.SUBMITTED,
  };
  timesheets.push(newTimesheet);
  const updated = updateContractTimesheets(contract.id, timesheets);
  return res.status(201).json(toPublicContract(updated!));
});

// PATCH /api/contracts/:contractId/timesheets/:timesheetId/approve - the
// company (or admin) approves a submitted timesheet. Payment remains a
// direct matter between the parties and is not recorded by TechSubbies.
contractsRouter.patch(
  "/:contractId/timesheets/:timesheetId/approve",
  requireAuth,
  async (req: AuthedRequest, res) => {
    const contract = findContractById(req.params.contractId);
    if (!contract) return res.status(404).json({ error: "Contract not found." });

    const signer = findUserById(req.userId!);
    if (!signer || !(contract.companyId === signer.id || signer.role === "Admin")) {
      return res.status(403).json({ error: "Only the client can approve a timesheet." });
    }

    const timesheets = JSON.parse(contract.timesheets) as { id: string; status: string }[];
    const index = timesheets.findIndex((t) => t.id === req.params.timesheetId);
    if (index === -1) return res.status(404).json({ error: "Timesheet not found." });
    if (timesheets[index].status !== TIMESHEET_STATUS.SUBMITTED) {
      return res.status(409).json({ error: "This timesheet has already been processed." });
    }

    timesheets[index].status = TIMESHEET_STATUS.APPROVED;
    const updated = updateContractTimesheets(contract.id, timesheets);
    return res.json(toPublicContract(updated!));
  }
);
