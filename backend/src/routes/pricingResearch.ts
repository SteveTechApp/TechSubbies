import { Router } from "express";
import { z } from "zod";
import { requireAuth, requireRole, type AuthedRequest } from "../middleware/auth.js";
import { findUserById } from "../lib/db.js";
import {
  findPricingResearchResponse,
  getPricingResearchSummary,
  upsertPricingResearchResponse,
} from "../lib/pricingResearchRepository.js";

export const pricingResearchRouter = Router();
export const adminPricingResearchRouter = Router();

const valueDrivers = [
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
] as const;

const responseSchema = z.object({
  valueScore: z.number().int().min(1).max(5),
  likelihoodToPay: z.number().int().min(1).max(5),
  priceTooCheap: z.number().int().min(0).max(2000),
  priceGoodValue: z.number().int().min(0).max(2000),
  priceExpensive: z.number().int().min(0).max(2000),
  priceTooExpensive: z.number().int().min(0).max(2000),
  preferredBilling: z.enum(["monthly", "annual", "either"]),
  valueDrivers: z.array(z.enum(valueDrivers)).min(1).max(5),
  primaryBlocker: z.enum([
    "price",
    "need-proof-of-value",
    "not-enough-demand",
    "not-enough-supply",
    "missing-features",
    "billing-commitment",
    "none",
  ]),
}).superRefine((value, ctx) => {
  const prices = [value.priceTooCheap, value.priceGoodValue, value.priceExpensive, value.priceTooExpensive];
  if (prices.some((price, index) => index > 0 && price < prices[index - 1])) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      path: ["priceTooExpensive"],
      message: "Price thresholds must increase from too cheap through too expensive.",
    });
  }
});

pricingResearchRouter.use(requireAuth, requireRole("Engineer", "Company", "Resourcing Company"));

pricingResearchRouter.get("/me", (req: AuthedRequest, res) => {
  return res.json({ response: findPricingResearchResponse(req.userId!) || null });
});

pricingResearchRouter.put("/me", (req: AuthedRequest, res) => {
  const parsed = responseSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: parsed.error.issues.map((issue) => issue.message).join(" ") });
  }
  const user = findUserById(req.userId!);
  if (!user || !["Engineer", "Company", "Resourcing Company"].includes(user.role)) {
    return res.status(403).json({ error: "This account cannot submit pricing research." });
  }
  const saved = upsertPricingResearchResponse(
    user.id,
    user.role as "Engineer" | "Company" | "Resourcing Company",
    parsed.data
  );
  return res.json({ response: saved });
});

adminPricingResearchRouter.use(requireAuth, requireRole("Admin"));
adminPricingResearchRouter.get("/", (_req, res) => {
  return res.json({ summary: getPricingResearchSummary() });
});
