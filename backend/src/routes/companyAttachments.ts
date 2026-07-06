import { Router } from "express";
import { z } from "zod";
import {
  createCompanyAttachmentRequest,
  findCompanyAttachmentRequestById,
  findPendingCompanyAttachmentRequest,
  findUserById,
  listCompanyAttachmentRequestsForEngineer,
  listPendingCompanyAttachmentRequestsForCompany,
  updateCompanyAttachmentRequestStatus,
  updateUserProfile,
} from "../lib/db.js";
import { toPublicUser } from "../lib/publicUser.js";
import { requireAuth, type AuthedRequest } from "../middleware/auth.js";

export const companyAttachmentsRouter = Router();

function readProfile(profileJson: string): Record<string, unknown> {
  try {
    const parsed = JSON.parse(profileJson);
    return typeof parsed === "object" && parsed !== null ? parsed : {};
  } catch {
    return {};
  }
}

const requestSchema = z.object({
  resourcingCompanyId: z.string().min(1),
});

// POST /api/company-attachments/request - engineer requests to join a resourcing company.
companyAttachmentsRouter.post("/request", requireAuth, async (req: AuthedRequest, res) => {
  const parsed = requestSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: "A resourcing company id is required." });
  }

  const engineer = findUserById(req.userId!);
  if (!engineer) {
    return res.status(404).json({ error: "Account not found." });
  }

  // Role strings are set by the frontend at registration and must match
  // the `Role` enum values in types/index.ts ("Engineer", "Resourcing Company", etc).
  if (engineer.role !== "Engineer") {
    return res.status(400).json({ error: "Only engineer accounts can request to join a resourcing company." });
  }

  const company = findUserById(parsed.data.resourcingCompanyId);
  if (!company || company.role !== "Resourcing Company") {
    return res.status(404).json({ error: "Resourcing company not found." });
  }

  const engineerProfile = readProfile(engineer.profile);
  if (engineerProfile.resourcingCompanyId === company.id) {
    return res.status(409).json({ error: "You're already attached to this resourcing company." });
  }

  const existingPending = findPendingCompanyAttachmentRequest(engineer.id, company.id);
  if (existingPending) {
    return res.status(409).json({ error: "A request to join this company is already pending." });
  }

  const created = createCompanyAttachmentRequest(engineer.id, company.id);
  return res.status(201).json({ status: "pending", request: created });
});

// POST /api/company-attachments/:id/approve - resourcing company approves the engineer's request.
companyAttachmentsRouter.post("/:id/approve", requireAuth, async (req: AuthedRequest, res) => {
  const request = findCompanyAttachmentRequestById(req.params.id);
  if (!request) {
    return res.status(404).json({ error: "Request not found." });
  }
  if (request.resourcingCompanyId !== req.userId) {
    return res.status(403).json({ error: "Only the resourcing company can approve this request." });
  }
  if (request.status !== "pending") {
    return res.status(409).json({ error: "This request has already been resolved." });
  }

  const engineer = findUserById(request.engineerId);
  const company = findUserById(request.resourcingCompanyId);
  if (!engineer || !company) {
    return res.status(404).json({ error: "Account no longer exists." });
  }

  const engineerProfile = { ...readProfile(engineer.profile), resourcingCompanyId: company.id };
  updateUserProfile(engineer.id, JSON.stringify(engineerProfile), engineer.name);

  const companyProfile = readProfile(company.profile);
  const managedEngineerIds = Array.isArray(companyProfile.managedEngineerIds)
    ? (companyProfile.managedEngineerIds as string[])
    : [];
  if (!managedEngineerIds.includes(engineer.id)) {
    managedEngineerIds.push(engineer.id);
  }
  updateUserProfile(
    company.id,
    JSON.stringify({ ...companyProfile, managedEngineerIds }),
    company.name
  );

  updateCompanyAttachmentRequestStatus(request.id, "accepted");
  return res.json({ status: "accepted", request: findCompanyAttachmentRequestById(request.id) });
});

// POST /api/company-attachments/:id/reject - resourcing company rejects the engineer's request.
companyAttachmentsRouter.post("/:id/reject", requireAuth, async (req: AuthedRequest, res) => {
  const request = findCompanyAttachmentRequestById(req.params.id);
  if (!request) {
    return res.status(404).json({ error: "Request not found." });
  }
  if (request.resourcingCompanyId !== req.userId) {
    return res.status(403).json({ error: "Only the resourcing company can reject this request." });
  }
  if (request.status !== "pending") {
    return res.status(409).json({ error: "This request has already been resolved." });
  }

  updateCompanyAttachmentRequestStatus(request.id, "declined");
  return res.json({ status: "declined", request: findCompanyAttachmentRequestById(request.id) });
});

// GET /api/company-attachments/me - the signed-in engineer's own requests.
companyAttachmentsRouter.get("/me", requireAuth, async (req: AuthedRequest, res) => {
  const requests = listCompanyAttachmentRequestsForEngineer(req.userId!);
  return res.json({ requests });
});

// GET /api/company-attachments/pending - pending requests awaiting the signed-in resourcing company.
companyAttachmentsRouter.get("/pending", requireAuth, async (req: AuthedRequest, res) => {
  const requests = listPendingCompanyAttachmentRequestsForCompany(req.userId!);
  const withEngineers = requests.map((request) => {
    const engineer = findUserById(request.engineerId);
    return {
      ...request,
      engineer: engineer ? toPublicUser(engineer) : null,
    };
  });
  return res.json({ requests: withEngineers });
});
