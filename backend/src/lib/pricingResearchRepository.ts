import { randomUUID } from "node:crypto";
import { z } from "zod";
import { db } from "./db.js";
import { AppError } from "./errors.js";

export type PricingResearchRole = "Engineer" | "Company" | "Resourcing Company";
export type BillingPreference = "monthly" | "annual" | "either";
export type PricingBlocker =
  | "price"
  | "need-proof-of-value"
  | "not-enough-demand"
  | "not-enough-supply"
  | "missing-features"
  | "billing-commitment"
  | "none";

export type PricingValueDriver =
  | "verified-talent"
  | "better-matching"
  | "faster-hiring"
  | "profile-visibility"
  | "evidence-verification"
  | "contract-workflow"
  | "messaging"
  | "analytics"
  | "resourcing-roster"
  | "priority-support";

export type PricingResearchInput = {
  valueScore: number;
  likelihoodToPay: number;
  priceTooCheap: number;
  priceGoodValue: number;
  priceExpensive: number;
  priceTooExpensive: number;
  preferredBilling: BillingPreference;
  valueDrivers: PricingValueDriver[];
  primaryBlocker: PricingBlocker;
};

export type PricingResearchResponse = PricingResearchInput & {
  id: string;
  userId: string;
  accountRole: PricingResearchRole;
  createdAt: string;
  updatedAt: string;
};

export type PricingResearchSegment = {
  role: PricingResearchRole;
  responses: number;
  averageValueScore: number | null;
  averageLikelihoodToPay: number | null;
  likelyToPayResponses: number;
  likelyToPayRate: number | null;
  medianPriceTooCheap: number | null;
  medianPriceGoodValue: number | null;
  medianPriceExpensive: number | null;
  medianPriceTooExpensive: number | null;
  preferredBilling: Record<BillingPreference, number>;
  topValueDrivers: Array<{ driver: PricingValueDriver; responses: number }>;
  blockers: Array<{ blocker: PricingBlocker; responses: number }>;
};

export type PricingResearchSummary = {
  totalResponses: number;
  segments: PricingResearchSegment[];
  generatedAt: string;
};

db.exec(`
  CREATE TABLE IF NOT EXISTS pricing_research_responses (
    id TEXT PRIMARY KEY,
    userId TEXT NOT NULL UNIQUE,
    accountRole TEXT NOT NULL,
    valueScore INTEGER NOT NULL,
    likelihoodToPay INTEGER NOT NULL,
    priceTooCheap INTEGER NOT NULL,
    priceGoodValue INTEGER NOT NULL,
    priceExpensive INTEGER NOT NULL,
    priceTooExpensive INTEGER NOT NULL,
    preferredBilling TEXT NOT NULL,
    valueDrivers TEXT NOT NULL,
    primaryBlocker TEXT NOT NULL,
    createdAt TEXT NOT NULL,
    updatedAt TEXT NOT NULL,
    FOREIGN KEY(userId) REFERENCES users(id) ON DELETE CASCADE
  );
  CREATE INDEX IF NOT EXISTS pricing_research_role_updated
    ON pricing_research_responses(accountRole, updatedAt DESC);
`);

export function checkPricingResearchRepository(): boolean {
  const row = db.prepare(
    "SELECT name FROM sqlite_master WHERE type = 'table' AND name = 'pricing_research_responses'"
  ).get() as { name?: string } | undefined;
  return row?.name === "pricing_research_responses";
}

const pricingRoles = ["Engineer", "Company", "Resourcing Company"] as const;
const billingPreferences = ["monthly", "annual", "either"] as const;
const pricingBlockers = [
  "price", "need-proof-of-value", "not-enough-demand", "not-enough-supply",
  "missing-features", "billing-commitment", "none",
] as const;
const pricingValueDrivers = [
  "verified-talent", "better-matching", "faster-hiring", "profile-visibility",
  "evidence-verification", "contract-workflow", "messaging", "analytics",
  "resourcing-roster", "priority-support",
] as const;

const pricingResearchRowSchema = z.object({
  id: z.string().min(1),
  userId: z.string().min(1),
  accountRole: z.enum(pricingRoles),
  valueScore: z.number().int().min(1).max(5),
  likelihoodToPay: z.number().int().min(1).max(5),
  priceTooCheap: z.number().int().nonnegative(),
  priceGoodValue: z.number().int().nonnegative(),
  priceExpensive: z.number().int().nonnegative(),
  priceTooExpensive: z.number().int().nonnegative(),
  preferredBilling: z.enum(billingPreferences),
  valueDrivers: z.string(),
  primaryBlocker: z.enum(pricingBlockers),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});

function corruptPricingResearchRow(id: string | undefined): never {
  throw new AppError(
    "PERSISTED_DATA_CORRUPT",
    "Stored pricing research response is corrupt.",
    500,
    { entity: "pricing research response", id: id || "unknown" },
  );
}

function rowToResponse(row: unknown): PricingResearchResponse {
  const parsed = pricingResearchRowSchema.safeParse(row);
  if (!parsed.success) {
    const id = typeof row === "object" && row !== null && "id" in row && typeof row.id === "string"
      ? row.id
      : undefined;
    corruptPricingResearchRow(id);
  }

  let valueDrivers: unknown;
  try {
    valueDrivers = JSON.parse(parsed.data.valueDrivers);
  } catch {
    corruptPricingResearchRow(parsed.data.id);
  }
  const parsedDrivers = z.array(z.enum(pricingValueDrivers)).safeParse(valueDrivers);
  if (!parsedDrivers.success) corruptPricingResearchRow(parsed.data.id);

  return { ...parsed.data, valueDrivers: parsedDrivers.data };
}

export function findPricingResearchResponse(userId: string): PricingResearchResponse | undefined {
  const row = db.prepare("SELECT * FROM pricing_research_responses WHERE userId = ?").get(userId);
  return row ? rowToResponse(row) : undefined;
}

export function upsertPricingResearchResponse(
  userId: string,
  accountRole: PricingResearchRole,
  input: PricingResearchInput
): PricingResearchResponse {
  const existing = findPricingResearchResponse(userId);
  const now = new Date().toISOString();
  const id = existing?.id || randomUUID();
  const createdAt = existing?.createdAt || now;
  db.prepare(`
    INSERT INTO pricing_research_responses (
      id, userId, accountRole, valueScore, likelihoodToPay,
      priceTooCheap, priceGoodValue, priceExpensive, priceTooExpensive,
      preferredBilling, valueDrivers, primaryBlocker, createdAt, updatedAt
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    ON CONFLICT(userId) DO UPDATE SET
      accountRole = excluded.accountRole,
      valueScore = excluded.valueScore,
      likelihoodToPay = excluded.likelihoodToPay,
      priceTooCheap = excluded.priceTooCheap,
      priceGoodValue = excluded.priceGoodValue,
      priceExpensive = excluded.priceExpensive,
      priceTooExpensive = excluded.priceTooExpensive,
      preferredBilling = excluded.preferredBilling,
      valueDrivers = excluded.valueDrivers,
      primaryBlocker = excluded.primaryBlocker,
      updatedAt = excluded.updatedAt
  `).run(
    id,
    userId,
    accountRole,
    input.valueScore,
    input.likelihoodToPay,
    input.priceTooCheap,
    input.priceGoodValue,
    input.priceExpensive,
    input.priceTooExpensive,
    input.preferredBilling,
    JSON.stringify(input.valueDrivers),
    input.primaryBlocker,
    createdAt,
    now
  );
  return findPricingResearchResponse(userId)!;
}

function average(values: number[]): number | null {
  if (!values.length) return null;
  return values.reduce((sum, value) => sum + value, 0) / values.length;
}

function median(values: number[]): number | null {
  if (!values.length) return null;
  const sorted = [...values].sort((a, b) => a - b);
  const middle = Math.floor(sorted.length / 2);
  return sorted.length % 2 === 0
    ? (sorted[middle - 1] + sorted[middle]) / 2
    : sorted[middle];
}

function ratio(numerator: number, denominator: number): number | null {
  return denominator > 0 ? numerator / denominator : null;
}

export function getPricingResearchSummary(): PricingResearchSummary {
  const rows = db.prepare("SELECT * FROM pricing_research_responses ORDER BY updatedAt DESC").all()
    .map(rowToResponse);
  const roles: PricingResearchRole[] = [...pricingRoles];
  const segments = roles.map((role): PricingResearchSegment => {
    const responses = rows.filter((row) => row.accountRole === role);
    const likelyToPayResponses = responses.filter((row) => row.likelihoodToPay >= 4).length;
    const preferredBilling: Record<BillingPreference, number> = { monthly: 0, annual: 0, either: 0 };
    const driverCounts = new Map<PricingValueDriver, number>();
    const blockerCounts = new Map<PricingBlocker, number>();
    for (const response of responses) {
      preferredBilling[response.preferredBilling] += 1;
      response.valueDrivers.forEach((driver) => driverCounts.set(driver, (driverCounts.get(driver) || 0) + 1));
      blockerCounts.set(response.primaryBlocker, (blockerCounts.get(response.primaryBlocker) || 0) + 1);
    }
    return {
      role,
      responses: responses.length,
      averageValueScore: average(responses.map((row) => row.valueScore)),
      averageLikelihoodToPay: average(responses.map((row) => row.likelihoodToPay)),
      likelyToPayResponses,
      likelyToPayRate: ratio(likelyToPayResponses, responses.length),
      medianPriceTooCheap: median(responses.map((row) => row.priceTooCheap)),
      medianPriceGoodValue: median(responses.map((row) => row.priceGoodValue)),
      medianPriceExpensive: median(responses.map((row) => row.priceExpensive)),
      medianPriceTooExpensive: median(responses.map((row) => row.priceTooExpensive)),
      preferredBilling,
      topValueDrivers: [...driverCounts.entries()]
        .map(([driver, count]) => ({ driver, responses: count }))
        .sort((a, b) => b.responses - a.responses || a.driver.localeCompare(b.driver))
        .slice(0, 5),
      blockers: [...blockerCounts.entries()]
        .map(([blocker, count]) => ({ blocker, responses: count }))
        .sort((a, b) => b.responses - a.responses || a.blocker.localeCompare(b.blocker)),
    };
  });
  return { totalResponses: rows.length, segments, generatedAt: new Date().toISOString() };
}
