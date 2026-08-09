import { randomUUID } from "node:crypto";
import { db } from "./db.js";
import {
  getPricingResearchSummary,
  type PricingResearchRole,
  type PricingResearchSegment,
  type PricingValueDriver,
} from "./pricingResearchRepository.js";

export type CommercialValidationStage =
  | "insufficient-evidence"
  | "cohort-test-ready"
  | "observed-evidence-ready";

export type CommercialDecisionStatus =
  | "draft"
  | "approved-for-cohort"
  | "rejected"
  | "completed";

export const COMMERCIAL_VALIDATION_THRESHOLDS = {
  pricingResponses: 10,
  engagedAccounts90d: 5,
  statedLikelyToPayRate: 0.4,
  averageValueScore: 3.5,
  engineerObservedPaidAccounts: 3,
} as const;

export type RoleMarketplaceEvidence = {
  engagedAccounts90d: number;
  primaryActions90d: number;
  bookings90d: number;
};

export type RoleBillingEvidence = {
  capabilityAvailable: boolean;
  paidAccounts: number;
  activeOrTrialing: number;
  pastDue: number;
  endingAtPeriodEnd: number;
};

export type CommercialRoleValidation = {
  role: PricingResearchRole;
  stage: CommercialValidationStage;
  readyForCohortTest: boolean;
  research: PricingResearchSegment;
  marketplace: RoleMarketplaceEvidence;
  billing: RoleBillingEvidence;
  gates: {
    researchSample: boolean;
    marketplaceUsage: boolean;
    statedIntent: boolean;
    observedBilling: boolean | null;
  };
  researchPriceBand: {
    lowerMonthly: number | null;
    upperMonthly: number | null;
  };
  blockers: string[];
};

export type CommercialValidationSummary = {
  generatedAt: string;
  thresholds: typeof COMMERCIAL_VALIDATION_THRESHOLDS;
  roles: CommercialRoleValidation[];
};

export type CommercialDecision = {
  id: string;
  accountRole: PricingResearchRole;
  packageName: string;
  candidateMonthlyPrice: number;
  candidateAnnualPrice: number | null;
  valueDrivers: PricingValueDriver[];
  status: CommercialDecisionStatus;
  evidenceSnapshot: CommercialRoleValidation | null;
  decisionNote: string | null;
  createdBy: string;
  decidedBy: string | null;
  createdAt: string;
  updatedAt: string;
  decidedAt: string | null;
};

db.exec(`
  CREATE TABLE IF NOT EXISTS commercial_validation_decisions (
    id TEXT PRIMARY KEY,
    accountRole TEXT NOT NULL,
    packageName TEXT NOT NULL,
    candidateMonthlyPrice INTEGER NOT NULL,
    candidateAnnualPrice INTEGER,
    valueDrivers TEXT NOT NULL,
    status TEXT NOT NULL,
    evidenceSnapshot TEXT,
    decisionNote TEXT,
    createdBy TEXT NOT NULL,
    decidedBy TEXT,
    createdAt TEXT NOT NULL,
    updatedAt TEXT NOT NULL,
    decidedAt TEXT,
    FOREIGN KEY(createdBy) REFERENCES users(id),
    FOREIGN KEY(decidedBy) REFERENCES users(id)
  );
  CREATE INDEX IF NOT EXISTS commercial_validation_decisions_role_created
    ON commercial_validation_decisions(accountRole, createdAt DESC);
`);

export function checkCommercialValidationRepository(): boolean {
  const row = db.prepare(
    "SELECT name FROM sqlite_master WHERE type = 'table' AND name = 'commercial_validation_decisions'"
  ).get() as { name?: string } | undefined;
  return row?.name === "commercial_validation_decisions";
}

type SqlParameter = string | number | bigint | null | Uint8Array;

function count(sql: string, ...params: SqlParameter[]): number {
  const row = db.prepare(sql).get(...params) as { total?: number } | undefined;
  return Number(row?.total || 0);
}

function marketplaceEvidence(role: PricingResearchRole, since: string): RoleMarketplaceEvidence {
  if (role === "Engineer") {
    return {
      engagedAccounts90d: count(`
        SELECT COUNT(DISTINCT actorUserId) AS total FROM (
          SELECT engineerId AS actorUserId FROM applications WHERE createdAt >= ?
          UNION
          SELECT engineerId AS actorUserId FROM contracts WHERE createdAt >= ?
        )
      `, since, since),
      primaryActions90d: count("SELECT COUNT(*) AS total FROM applications WHERE createdAt >= ?", since),
      bookings90d: count("SELECT COUNT(*) AS total FROM contracts WHERE createdAt >= ?", since),
    };
  }

  return {
    engagedAccounts90d: count(`
      SELECT COUNT(DISTINCT actorUserId) AS total FROM (
        SELECT events.actorUserId AS actorUserId
        FROM marketplace_analytics_events events
        JOIN users ON users.id = events.actorUserId
        WHERE users.role = ? AND events.createdAt >= ?
        UNION
        SELECT jobs.companyId AS actorUserId
        FROM jobs
        JOIN users ON users.id = jobs.companyId
        WHERE users.role = ? AND jobs.postedDate >= ?
        UNION
        SELECT contracts.companyId AS actorUserId
        FROM contracts
        JOIN users ON users.id = contracts.companyId
        WHERE users.role = ? AND contracts.createdAt >= ?
      )
    `, role, since, role, since, role, since),
    primaryActions90d: count(`
      SELECT (
        (SELECT COUNT(*) FROM marketplace_analytics_events events
          JOIN users ON users.id = events.actorUserId
          WHERE users.role = ? AND events.eventType IN ('search.performed', 'invitation.sent') AND events.createdAt >= ?)
        +
        (SELECT COUNT(*) FROM jobs
          JOIN users ON users.id = jobs.companyId
          WHERE users.role = ? AND jobs.postedDate >= ?)
      ) AS total
    `, role, since, role, since),
    bookings90d: count(`
      SELECT COUNT(*) AS total
      FROM contracts
      JOIN users ON users.id = contracts.companyId
      WHERE users.role = ? AND contracts.createdAt >= ?
    `, role, since),
  };
}

function billingEvidence(role: PricingResearchRole): RoleBillingEvidence {
  const capabilityAvailable = role === "Engineer";
  const row = db.prepare(`
    SELECT
      COUNT(*) AS paidAccounts,
      COALESCE(SUM(CASE WHEN billing.status IN ('active', 'trialing') THEN 1 ELSE 0 END), 0) AS activeOrTrialing,
      COALESCE(SUM(CASE WHEN billing.status = 'past_due' THEN 1 ELSE 0 END), 0) AS pastDue,
      COALESCE(SUM(CASE WHEN billing.cancelAtPeriodEnd = 1 THEN 1 ELSE 0 END), 0) AS endingAtPeriodEnd
    FROM subscription_billing billing
    JOIN users ON users.id = billing.userId
    WHERE users.role = ? AND users.deletedAt IS NULL
  `).get(role) as {
    paidAccounts: number;
    activeOrTrialing: number;
    pastDue: number;
    endingAtPeriodEnd: number;
  };
  return {
    capabilityAvailable,
    paidAccounts: Number(row?.paidAccounts || 0),
    activeOrTrialing: Number(row?.activeOrTrialing || 0),
    pastDue: Number(row?.pastDue || 0),
    endingAtPeriodEnd: Number(row?.endingAtPeriodEnd || 0),
  };
}

function roleValidation(role: PricingResearchRole, research: PricingResearchSegment): CommercialRoleValidation {
  const since = new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString();
  const marketplace = marketplaceEvidence(role, since);
  const billing = billingEvidence(role);
  const gates = {
    researchSample: research.responses >= COMMERCIAL_VALIDATION_THRESHOLDS.pricingResponses,
    marketplaceUsage: marketplace.engagedAccounts90d >= COMMERCIAL_VALIDATION_THRESHOLDS.engagedAccounts90d,
    statedIntent: (research.likelyToPayRate || 0) >= COMMERCIAL_VALIDATION_THRESHOLDS.statedLikelyToPayRate
      && (research.averageValueScore || 0) >= COMMERCIAL_VALIDATION_THRESHOLDS.averageValueScore,
    observedBilling: billing.capabilityAvailable
      ? billing.activeOrTrialing >= COMMERCIAL_VALIDATION_THRESHOLDS.engineerObservedPaidAccounts
      : null,
  };
  const readyForCohortTest = gates.researchSample && gates.marketplaceUsage && gates.statedIntent;
  const stage: CommercialValidationStage = readyForCohortTest
    ? gates.observedBilling === true ? "observed-evidence-ready" : "cohort-test-ready"
    : "insufficient-evidence";
  const blockers: string[] = [];
  if (!gates.researchSample) blockers.push(`Need at least ${COMMERCIAL_VALIDATION_THRESHOLDS.pricingResponses} pricing responses for this account type.`);
  if (!gates.marketplaceUsage) blockers.push(`Need at least ${COMMERCIAL_VALIDATION_THRESHOLDS.engagedAccounts90d} recently engaged accounts for this account type.`);
  if (!gates.statedIntent) blockers.push("Stated willingness-to-pay/value evidence has not reached the initial validation threshold.");
  if (!billing.capabilityAvailable) blockers.push("Observed paid-subscription evidence is unavailable because Stripe membership checkout is not enabled for this account type.");
  else if (!gates.observedBilling) blockers.push(`Need at least ${COMMERCIAL_VALIDATION_THRESHOLDS.engineerObservedPaidAccounts} active/trial paid accounts before treating billing behaviour as observed evidence.`);

  return {
    role,
    stage,
    readyForCohortTest,
    research,
    marketplace,
    billing,
    gates,
    researchPriceBand: {
      lowerMonthly: research.medianPriceGoodValue,
      upperMonthly: research.medianPriceExpensive,
    },
    blockers,
  };
}

export function getCommercialValidationSummary(): CommercialValidationSummary {
  const pricing = getPricingResearchSummary();
  return {
    generatedAt: new Date().toISOString(),
    thresholds: COMMERCIAL_VALIDATION_THRESHOLDS,
    roles: pricing.segments.map((segment) => roleValidation(segment.role, segment)),
  };
}

const decisionRoles: PricingResearchRole[] = ["Engineer", "Company", "Resourcing Company"];
const decisionStatuses: CommercialDecisionStatus[] = ["draft", "approved-for-cohort", "rejected", "completed"];
const pricingValueDrivers: PricingValueDriver[] = ["verified-talent", "better-matching", "faster-hiring", "profile-visibility", "evidence-verification", "contract-workflow", "messaging", "analytics", "resourcing-roster", "priority-support"];

function decisionRecord(value: unknown): Record<string, unknown> {
  if (typeof value !== "object" || value === null || Array.isArray(value)) throw new Error("Stored commercial validation decision is invalid.");
  return value as Record<string, unknown>;
}

function parseStoredJson(value: string, label: string): unknown {
  try { return JSON.parse(value); } catch { throw new Error(`Stored commercial validation ${label} is corrupt.`); }
}

function rowToDecision(value: unknown): CommercialDecision {
  const row = decisionRecord(value);
  const requiredString = (field: string): string => {
    const value = row[field];
    if (typeof value !== "string" || !value) throw new Error("Stored commercial validation decision is invalid.");
    return value;
  };
  const accountRole = requiredString("accountRole") as PricingResearchRole;
  const status = requiredString("status") as CommercialDecisionStatus;
  if (!decisionRoles.includes(accountRole) || !decisionStatuses.includes(status)) throw new Error("Stored commercial validation decision is invalid.");
  const rawDrivers = parseStoredJson(requiredString("valueDrivers"), "value drivers");
  if (!Array.isArray(rawDrivers) || !rawDrivers.every((driver): driver is PricingValueDriver => typeof driver === "string" && pricingValueDrivers.includes(driver as PricingValueDriver))) {
    throw new Error("Stored commercial validation value drivers are invalid.");
  }
  let evidenceSnapshot: CommercialRoleValidation | null = null;
  if (typeof row.evidenceSnapshot === "string" && row.evidenceSnapshot) {
    const snapshot = parseStoredJson(row.evidenceSnapshot, "evidence snapshot");
    evidenceSnapshot = decisionRecord(snapshot) as CommercialRoleValidation;
  } else if (row.evidenceSnapshot !== null && row.evidenceSnapshot !== undefined) {
    throw new Error("Stored commercial validation evidence snapshot is invalid.");
  }
  const monthly = Number(row.candidateMonthlyPrice);
  const annual = row.candidateAnnualPrice === null ? null : Number(row.candidateAnnualPrice);
  if (!Number.isFinite(monthly) || (annual !== null && !Number.isFinite(annual))) throw new Error("Stored commercial validation decision is invalid.");
  const optionalString = (field: string): string | null => row[field] === null || row[field] === undefined ? null : requiredString(field);
  return {
    id: requiredString("id"),
    accountRole,
    packageName: requiredString("packageName"),
    candidateMonthlyPrice: monthly,
    candidateAnnualPrice: annual,
    valueDrivers: rawDrivers,
    status,
    evidenceSnapshot,
    decisionNote: optionalString("decisionNote"),
    createdBy: requiredString("createdBy"),
    decidedBy: optionalString("decidedBy"),
    createdAt: requiredString("createdAt"),
    updatedAt: requiredString("updatedAt"),
    decidedAt: optionalString("decidedAt"),
  };
}

export function listCommercialDecisions(): CommercialDecision[] {
  return db.prepare("SELECT * FROM commercial_validation_decisions ORDER BY createdAt DESC").all().map(rowToDecision);
}

export function findCommercialDecision(id: string): CommercialDecision | undefined {
  const row = db.prepare("SELECT * FROM commercial_validation_decisions WHERE id = ?").get(id);
  return row ? rowToDecision(row) : undefined;
}

export function createCommercialDecision(input: {
  accountRole: PricingResearchRole;
  packageName: string;
  candidateMonthlyPrice: number;
  candidateAnnualPrice?: number | null;
  valueDrivers: PricingValueDriver[];
  createdBy: string;
}): CommercialDecision {
  const now = new Date().toISOString();
  const id = randomUUID();
  db.prepare(`
    INSERT INTO commercial_validation_decisions (
      id, accountRole, packageName, candidateMonthlyPrice, candidateAnnualPrice,
      valueDrivers, status, evidenceSnapshot, decisionNote, createdBy, decidedBy,
      createdAt, updatedAt, decidedAt
    ) VALUES (?, ?, ?, ?, ?, ?, 'draft', NULL, NULL, ?, NULL, ?, ?, NULL)
  `).run(
    id,
    input.accountRole,
    input.packageName,
    input.candidateMonthlyPrice,
    input.candidateAnnualPrice ?? null,
    JSON.stringify(input.valueDrivers),
    input.createdBy,
    now,
    now
  );
  return findCommercialDecision(id)!;
}

export function updateCommercialDecisionStatus(input: {
  id: string;
  status: Exclude<CommercialDecisionStatus, "draft">;
  decidedBy: string;
  decisionNote?: string | null;
}): CommercialDecision {
  const existing = findCommercialDecision(input.id);
  if (!existing) throw new Error("Commercial validation decision not found.");
  if (existing.status === "rejected" || existing.status === "completed") {
    throw new Error("This commercial validation decision is already closed.");
  }
  if (input.status === "completed" && existing.status !== "approved-for-cohort") {
    throw new Error("Only an approved cohort decision can be completed.");
  }

  let snapshot = existing.evidenceSnapshot;
  if (input.status === "approved-for-cohort") {
    const validation = getCommercialValidationSummary().roles.find((entry) => entry.role === existing.accountRole)!;
    if (!validation.readyForCohortTest) {
      throw new Error("This account type has not met the controlled-cohort evidence gate.");
    }
    snapshot = validation;
  }

  const now = new Date().toISOString();
  db.prepare(`
    UPDATE commercial_validation_decisions
    SET status = ?, evidenceSnapshot = ?, decisionNote = ?, decidedBy = ?, updatedAt = ?, decidedAt = ?
    WHERE id = ?
  `).run(
    input.status,
    snapshot ? JSON.stringify(snapshot) : null,
    input.decisionNote || null,
    input.decidedBy,
    now,
    now,
    input.id
  );
  return findCommercialDecision(input.id)!;
}
