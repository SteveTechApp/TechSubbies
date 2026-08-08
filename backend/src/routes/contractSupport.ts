import { Router } from "express";
import { z } from "zod";
import { findContractById, findUserById } from "../lib/db.js";
import { recordAccountAudit } from "../lib/accountAudit.js";
import { sendEmail } from "../lib/email.js";
import { requireAuth, requireRole, type AuthedRequest } from "../middleware/auth.js";
import {
  createContractSupportCase,
  findContractSupportCaseById,
  listAdminContractSupportCases,
  listContractSupportCasesForContract,
  listContractSupportCasesForUser,
  listContractSupportEvents,
  reopenContractSupportCaseForReview,
  resolveContractSupportCase,
  respondToContractSupportCase,
  withdrawContractSupportCase,
  type ContractSupportCaseStatus,
} from "../lib/contractSupportRepository.js";

const caseTypeSchema = z.enum(["cancellation", "substitution", "no_show", "dispute", "support"]);
const statusSchema = z.enum(["awaiting_other_party", "under_review", "resolved", "withdrawn"]);

function isParticipant(contract: { companyId: string; engineerId: string }, userId: string) {
  return contract.companyId === userId || contract.engineerId === userId;
}

function counterpartyId(contract: { companyId: string; engineerId: string }, userId: string) {
  return contract.companyId === userId ? contract.engineerId : contract.companyId;
}

async function sendSupportEmail(input: { userId: string; subject: string; text: string }) {
  const user = findUserById(input.userId);
  if (!user) return false;
  try {
    await sendEmail({ to: user.email, subject: input.subject, text: input.text });
    return true;
  } catch {
    return false;
  }
}

function publicCase(caseId: string) {
  const supportCase = findContractSupportCaseById(caseId);
  if (!supportCase) return null;
  const openedBy = findUserById(supportCase.openedById);
  const counterparty = findUserById(supportCase.counterpartyId);
  const proposedEngineer = supportCase.proposedEngineerId
    ? findUserById(supportCase.proposedEngineerId)
    : undefined;
  return {
    ...supportCase,
    openedByName: openedBy?.name || "Unknown account",
    counterpartyName: counterparty?.name || "Unknown account",
    proposedEngineerName: proposedEngineer?.name || null,
    events: listContractSupportEvents(caseId),
  };
}

export const contractSupportRouter = Router();
contractSupportRouter.use(requireAuth);

contractSupportRouter.get("/me", (req: AuthedRequest, res) => {
  return res.json({ cases: listContractSupportCasesForUser(req.userId!).map((item) => publicCase(item.id)) });
});

contractSupportRouter.get("/contract/:contractId", (req: AuthedRequest, res) => {
  const contract = findContractById(req.params.contractId);
  if (!contract) return res.status(404).json({ error: "Contract not found." });
  if (!isParticipant(contract, req.userId!)) {
    return res.status(403).json({ error: "You are not a party to this contract." });
  }
  return res.json({ cases: listContractSupportCasesForContract(contract.id).map((item) => publicCase(item.id)) });
});

contractSupportRouter.post("/", async (req: AuthedRequest, res) => {
  const parsed = z.object({
    contractId: z.string().min(1),
    caseType: caseTypeSchema,
    summary: z.string().trim().min(5).max(120),
    details: z.string().trim().min(10).max(2000),
    proposedEngineerId: z.string().trim().min(1).optional(),
  }).safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: "Provide a case type, short summary and at least 10 characters of detail." });
  }

  const contract = findContractById(parsed.data.contractId);
  if (!contract) return res.status(404).json({ error: "Contract not found." });
  if (!isParticipant(contract, req.userId!)) {
    return res.status(403).json({ error: "Only contract parties can open a support case." });
  }
  if (["Cancelled", "Completed"].includes(contract.status) && parsed.data.caseType === "cancellation") {
    return res.status(409).json({ error: "This contract is already closed." });
  }

  let proposedEngineerId: string | null = null;
  if (parsed.data.caseType === "substitution" && parsed.data.proposedEngineerId) {
    const replacement = findUserById(parsed.data.proposedEngineerId);
    if (!replacement || replacement.role !== "Engineer" || replacement.deletedAt || replacement.suspendedAt) {
      return res.status(400).json({ error: "The proposed replacement engineer is not available." });
    }
    if (replacement.id === contract.engineerId) {
      return res.status(400).json({ error: "The proposed replacement must be a different engineer." });
    }
    proposedEngineerId = replacement.id;
  }

  const otherPartyId = counterpartyId(contract, req.userId!);
  const supportCase = createContractSupportCase({
    contractId: contract.id,
    caseType: parsed.data.caseType,
    openedById: req.userId!,
    counterpartyId: otherPartyId,
    proposedEngineerId,
    summary: parsed.data.summary,
    details: parsed.data.details,
  });

  recordAccountAudit({
    eventType: "contract_support.opened",
    outcome: "success",
    userId: req.userId!,
    requestId: res.locals.requestId,
  });

  const notificationSent = await sendSupportEmail({
    userId: otherPartyId,
    subject: `TechSubbies contract ${parsed.data.caseType.replaceAll("_", " ")} update`,
    text: `A ${parsed.data.caseType.replaceAll("_", " ")} case has been opened for contract ${contract.id}. Open the contract in TechSubbies to review the details. Project payments and any financial settlement remain directly between the contract parties.`,
  });

  return res.status(201).json({ case: publicCase(supportCase.id), notificationSent });
});

contractSupportRouter.get("/:caseId", (req: AuthedRequest, res) => {
  const supportCase = findContractSupportCaseById(req.params.caseId);
  if (!supportCase) return res.status(404).json({ error: "Support case not found." });
  const contract = findContractById(supportCase.contractId);
  if (!contract) return res.status(404).json({ error: "Contract not found." });
  if (!isParticipant(contract, req.userId!)) {
    return res.status(403).json({ error: "You are not a party to this support case." });
  }
  return res.json({ case: publicCase(supportCase.id) });
});

contractSupportRouter.post("/:caseId/respond", async (req: AuthedRequest, res) => {
  const parsed = z.object({
    decision: z.enum(["accept", "decline"]),
    note: z.string().trim().min(5).max(1000),
  }).safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: "Choose accept or decline and add a short note." });

  const supportCase = findContractSupportCaseById(req.params.caseId);
  if (!supportCase) return res.status(404).json({ error: "Support case not found." });
  if (supportCase.counterpartyId !== req.userId) {
    return res.status(403).json({ error: "Only the other contract party can respond to this request." });
  }

  const updated = respondToContractSupportCase({
    caseId: supportCase.id,
    actorId: req.userId!,
    decision: parsed.data.decision,
    note: parsed.data.note,
  });
  if (!updated) return res.status(409).json({ error: "This request is no longer awaiting a party response." });

  recordAccountAudit({
    eventType: parsed.data.decision === "accept" ? "contract_support.accepted" : "contract_support.declined",
    outcome: "success",
    userId: req.userId!,
    requestId: res.locals.requestId,
  });

  await sendSupportEmail({
    userId: supportCase.openedById,
    subject: "TechSubbies contract support case updated",
    text: `The other contract party has ${parsed.data.decision === "accept" ? "accepted" : "declined"} your ${supportCase.caseType.replaceAll("_", " ")} request. Open the contract to review the case status.`,
  });
  return res.json({ case: publicCase(updated.id) });
});

contractSupportRouter.post("/:caseId/withdraw", (req: AuthedRequest, res) => {
  const parsed = z.object({ note: z.string().trim().max(1000).optional() }).safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: "Invalid withdrawal note." });
  const updated = withdrawContractSupportCase({
    caseId: req.params.caseId,
    actorId: req.userId!,
    note: parsed.data.note,
  });
  if (!updated) return res.status(409).json({ error: "This case cannot be withdrawn." });
  recordAccountAudit({
    eventType: "contract_support.withdrawn",
    outcome: "success",
    userId: req.userId!,
    requestId: res.locals.requestId,
  });
  return res.json({ case: publicCase(updated.id) });
});

export const adminContractSupportRouter = Router();
adminContractSupportRouter.use(requireAuth, requireRole("Admin"));

adminContractSupportRouter.get("/", (req, res) => {
  const parsed = z.object({ status: statusSchema.optional() }).safeParse({ status: req.query.status || undefined });
  if (!parsed.success) return res.status(400).json({ error: "Unsupported support case status." });
  return res.json({
    cases: listAdminContractSupportCases(parsed.data.status as ContractSupportCaseStatus | undefined)
      .map((item) => publicCase(item.id)),
  });
});

adminContractSupportRouter.post("/:caseId/resolve", async (req: AuthedRequest, res) => {
  const parsed = z.object({ resolution: z.string().trim().min(10).max(2000) }).safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: "Provide a resolution note of at least 10 characters." });
  const supportCase = findContractSupportCaseById(req.params.caseId);
  if (!supportCase) return res.status(404).json({ error: "Support case not found." });
  const updated = resolveContractSupportCase({
    caseId: supportCase.id,
    administratorId: req.userId!,
    resolution: parsed.data.resolution,
  });
  if (!updated) return res.status(409).json({ error: "This case is already closed." });

  recordAccountAudit({
    eventType: "contract_support.resolved",
    outcome: "success",
    userId: supportCase.openedById,
    requestId: res.locals.requestId,
  });
  await Promise.all([
    sendSupportEmail({
      userId: supportCase.openedById,
      subject: "TechSubbies support case resolved",
      text: `Your contract support case has been resolved. ${parsed.data.resolution}`,
    }),
    sendSupportEmail({
      userId: supportCase.counterpartyId,
      subject: "TechSubbies support case resolved",
      text: `A contract support case involving you has been resolved. ${parsed.data.resolution}`,
    }),
  ]);
  return res.json({ case: publicCase(updated.id) });
});

adminContractSupportRouter.post("/:caseId/reopen", (req: AuthedRequest, res) => {
  const parsed = z.object({ note: z.string().trim().min(10).max(1000) }).safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: "Provide a review note of at least 10 characters." });
  const updated = reopenContractSupportCaseForReview({
    caseId: req.params.caseId,
    administratorId: req.userId!,
    note: parsed.data.note,
  });
  if (!updated) return res.status(409).json({ error: "This case cannot be reopened." });
  recordAccountAudit({
    eventType: "contract_support.reopened",
    outcome: "success",
    userId: updated.openedById,
    requestId: res.locals.requestId,
  });
  return res.json({ case: publicCase(updated.id) });
});
