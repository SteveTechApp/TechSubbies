import { Router } from "express";
import { z } from "zod";
import {
  createContract,
  createInvoice,
  findContractById,
  findUserById,
  listContractsForUser,
  listInvoicesForUser,
  updateContractMilestones,
  updateContractSignature,
  updateContractTimesheets,
} from "../lib/db.js";
import { toPublicContract, toPublicInvoice } from "../lib/publicContract.js";
import { requireAuth, type AuthedRequest } from "../middleware/auth.js";

export const contractsRouter = Router();
export const invoicesRouter = Router();

// Matches the `Role` enum values in types/index.ts.
const COMPANY_ROLES = new Set(["Company", "Resourcing Company"]);
const COMPANY_SIDE_ROLES = new Set(["Company", "Resourcing Company", "Admin"]);

// Matches the string values of the `MilestoneStatus`/`ContractStatus`/
// `TimesheetStatus` enums in types/index.ts exactly, so a contract created
// here slots straight into the frontend's existing status-badge/permission
// logic (see views/ContractDetailsView.tsx) without any translation layer.
const MILESTONE_STATUS = {
  AWAITING_FUNDING: "Awaiting Funding",
  FUNDED_IN_PROGRESS: "In Progress",
  SUBMITTED_FOR_APPROVAL: "Submitted for Approval",
  APPROVED_PENDING_INVOICE: "Approved - Pending Invoice",
  COMPLETED_PAID: "Completed & Paid",
} as const;

const CONTRACT_STATUS = {
  PENDING_SIGNATURE: "Pending Signature",
  SIGNED: "Signed by Engineer",
  ACTIVE: "Active",
} as const;

const TIMESHEET_STATUS = {
  SUBMITTED: "submitted",
  PAID: "paid",
} as const;

const PAYMENT_TERM_DAYS: Record<string, number> = {
  "Net 14 Days": 14,
  "Net 30 Days": 30,
  "Net 60 Days": 60,
};

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
contractsRouter.post("/", requireAuth, async (req: AuthedRequest, res) => {
  const poster = findUserById(req.userId!);
  if (!poster) {
    return res.status(404).json({ error: "Account not found." });
  }
  if (!COMPANY_ROLES.has(poster.role)) {
    return res.status(403).json({ error: "Only company accounts can create contracts." });
  }

  const parsed = contractSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: parsed.error.issues.map((i) => i.message).join(", ") });
  }

  const { jobId, engineerId, milestones, ...data } = parsed.data;
  const milestonesWithStatus = milestones.map((m) => ({ ...m, status: MILESTONE_STATUS.AWAITING_FUNDING }));

  const contract = createContract(
    poster.id,
    engineerId,
    jobId,
    CONTRACT_STATUS.PENDING_SIGNATURE,
    data,
    milestonesWithStatus
  );
  return res.status(201).json(toPublicContract(contract));
});

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

// PATCH /api/contracts/:contractId/milestones/:milestoneId/fund - the
// company (or admin) funds an awaiting milestone into escrow.
contractsRouter.patch(
  "/:contractId/milestones/:milestoneId/fund",
  requireAuth,
  async (req: AuthedRequest, res) => {
    const contract = findContractById(req.params.contractId);
    if (!contract) return res.status(404).json({ error: "Contract not found." });

    const signer = findUserById(req.userId!);
    if (!signer || !(contract.companyId === signer.id || signer.role === "Admin")) {
      return res.status(403).json({ error: "Only the client can fund a milestone." });
    }

    const found = findMilestone(contract, req.params.milestoneId);
    if (!found) return res.status(404).json({ error: "Milestone not found." });
    if (found.milestones[found.index].status !== MILESTONE_STATUS.AWAITING_FUNDING) {
      return res.status(409).json({ error: "This milestone isn't awaiting funding." });
    }

    found.milestones[found.index].status = MILESTONE_STATUS.FUNDED_IN_PROGRESS;
    const updated = updateContractMilestones(contract.id, found.milestones);
    return res.json(toPublicContract(updated!));
  }
);

// PATCH /api/contracts/:contractId/milestones/:milestoneId/submit - the
// engineer marks a funded milestone as done, for the company to approve.
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
    if (found.milestones[found.index].status !== MILESTONE_STATUS.FUNDED_IN_PROGRESS) {
      return res.status(409).json({ error: "This milestone isn't in progress." });
    }

    found.milestones[found.index].status = MILESTONE_STATUS.SUBMITTED_FOR_APPROVAL;
    const updated = updateContractMilestones(contract.id, found.milestones);
    return res.json(toPublicContract(updated!));
  }
);

// PATCH /api/contracts/:contractId/milestones/:milestoneId/approve - the
// company (or admin) approves a submitted milestone, clearing it to invoice.
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
    if (found.milestones[found.index].status !== MILESTONE_STATUS.SUBMITTED_FOR_APPROVAL) {
      return res.status(409).json({ error: "This milestone hasn't been submitted for approval." });
    }

    found.milestones[found.index].status = MILESTONE_STATUS.APPROVED_PENDING_INVOICE;
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
// company (or admin) approves and pays a submitted timesheet in one step,
// matching the "Approve & Pay" action in components/TimesheetRow.tsx.
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

    timesheets[index].status = TIMESHEET_STATUS.PAID;
    const updated = updateContractTimesheets(contract.id, timesheets);
    return res.json(toPublicContract(updated!));
  }
);

const invoiceSchema = z.object({
  paymentTerms: z.string().min(1),
});

// POST /api/contracts/:contractId/invoices - the engineer (contractor)
// generates an invoice covering every milestone that's approved and
// waiting to be invoiced, matching the "Generate Invoice" action gated to
// engineers in views/ContractDetailsView.tsx.
contractsRouter.post("/:contractId/invoices", requireAuth, async (req: AuthedRequest, res) => {
  const contract = findContractById(req.params.contractId);
  if (!contract) return res.status(404).json({ error: "Contract not found." });
  if (contract.engineerId !== req.userId) {
    return res.status(403).json({ error: "Only the contractor can generate an invoice for this contract." });
  }

  const parsed = invoiceSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: "Payment terms are required." });
  }
  const days = PAYMENT_TERM_DAYS[parsed.data.paymentTerms] ?? 14;

  const milestones = JSON.parse(contract.milestones) as { description: string; amount: number; status: string }[];
  const approved = milestones.filter((m) => m.status === MILESTONE_STATUS.APPROVED_PENDING_INVOICE);
  if (approved.length === 0) {
    return res.status(409).json({ error: "There are no approved milestones ready to invoice." });
  }

  const items = approved.map((m) => ({ description: `Milestone: ${m.description}`, amount: m.amount }));
  const total = items.reduce((sum, item) => sum + item.amount, 0);
  const dueDate = new Date(Date.now() + days * 24 * 60 * 60 * 1000).toISOString();

  const invoice = createInvoice({
    contractId: contract.id,
    companyId: contract.companyId,
    engineerId: contract.engineerId,
    items,
    total,
    dueDate,
  });

  const paidMilestones = milestones.map((m) =>
    m.status === MILESTONE_STATUS.APPROVED_PENDING_INVOICE ? { ...m, status: MILESTONE_STATUS.COMPLETED_PAID } : m
  );
  updateContractMilestones(contract.id, paidMilestones);

  return res.status(201).json(toPublicInvoice(invoice));
});

// GET /api/invoices/me - every invoice where the signed-in user is either
// the company or the engineer party. Mounted separately in app.ts, kept
// here since it shares all its helpers with the contract routes above.
invoicesRouter.get("/me", requireAuth, async (req: AuthedRequest, res) => {
  return res.json(listInvoicesForUser(req.userId!).map(toPublicInvoice));
});
