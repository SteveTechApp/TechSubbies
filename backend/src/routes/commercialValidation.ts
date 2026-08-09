import { Router } from "express";
import { z } from "zod";
import {
  createCommercialDecision,
  findCommercialDecision,
  getCommercialValidationSummary,
  listCommercialDecisions,
  updateCommercialDecisionStatus,
} from "../lib/commercialValidationRepository.js";
import { requireAuth, requireRole, type AuthedRequest } from "../middleware/auth.js";

export const adminCommercialValidationRouter = Router();
adminCommercialValidationRouter.use(requireAuth, requireRole("Admin"));

const roleSchema = z.enum(["Engineer", "Company", "Resourcing Company"]);
const valueDriverSchema = z.enum([
  "verified-talent",
  "better-matching",
  "faster-hiring",
  "profile-visibility",
  "evidence-verification",
  "contract-workflow",
  "messaging",
  "analytics",
  "resourcing-roster",
  "priority-support",
]);

adminCommercialValidationRouter.get("/summary", (_req, res) => {
  return res.json({ validation: getCommercialValidationSummary() });
});

adminCommercialValidationRouter.get("/decisions", (_req, res) => {
  return res.json({ decisions: listCommercialDecisions() });
});

adminCommercialValidationRouter.post("/decisions", (req: AuthedRequest, res) => {
  const parsed = z.object({
    accountRole: roleSchema,
    packageName: z.string().trim().min(1).max(80),
    candidateMonthlyPrice: z.number().int().min(0).max(10000),
    candidateAnnualPrice: z.number().int().min(0).max(100000).nullable().optional(),
    valueDrivers: z.array(valueDriverSchema).min(1).max(5),
  }).safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: parsed.error.issues.map((issue) => issue.message).join(", ") });
  }
  const decision = createCommercialDecision({
    ...parsed.data,
    createdBy: req.userId!,
  });
  return res.status(201).json({ decision });
});

adminCommercialValidationRouter.patch("/decisions/:decisionId/status", (req: AuthedRequest, res) => {
  const existing = findCommercialDecision(req.params.decisionId);
  if (!existing) return res.status(404).json({ error: "Commercial validation decision not found." });

  const parsed = z.object({
    status: z.enum(["approved-for-cohort", "rejected", "completed"]),
    decisionNote: z.string().trim().max(1000).nullable().optional(),
  }).safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: parsed.error.issues.map((issue) => issue.message).join(", ") });
  }

  try {
    const decision = updateCommercialDecisionStatus({
      id: existing.id,
      status: parsed.data.status,
      decisionNote: parsed.data.decisionNote,
      decidedBy: req.userId!,
    });
    return res.json({ decision });
  } catch (error) {
    return res.status(409).json({ error: error instanceof Error ? error.message : "Decision could not be updated." });
  }
});
