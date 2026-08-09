import { API_BASE_URL } from './apiConfig';
import { secureFetch } from './httpClient';

export type CommercialRole = 'Engineer' | 'Company' | 'Resourcing Company';
export type CommercialValidationStage = 'insufficient-evidence' | 'cohort-test-ready' | 'observed-evidence-ready';
export type CommercialDecisionStatus = 'draft' | 'approved-for-cohort' | 'rejected' | 'completed';
export type PricingValueDriver =
  | 'verified-talent'
  | 'better-matching'
  | 'faster-hiring'
  | 'profile-visibility'
  | 'evidence-verification'
  | 'contract-workflow'
  | 'messaging'
  | 'analytics'
  | 'resourcing-roster'
  | 'priority-support';

export type CommercialRoleValidation = {
  role: CommercialRole;
  stage: CommercialValidationStage;
  readyForCohortTest: boolean;
  research: {
    responses: number;
    averageValueScore: number | null;
    averageLikelihoodToPay: number | null;
    likelyToPayRate: number | null;
    medianPriceGoodValue: number | null;
    medianPriceExpensive: number | null;
  };
  marketplace: {
    engagedAccounts90d: number;
    primaryActions90d: number;
    bookings90d: number;
  };
  billing: {
    capabilityAvailable: boolean;
    paidAccounts: number;
    activeOrTrialing: number;
    pastDue: number;
    endingAtPeriodEnd: number;
  };
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
  thresholds: {
    pricingResponses: number;
    engagedAccounts90d: number;
    statedLikelyToPayRate: number;
    averageValueScore: number;
    engineerObservedPaidAccounts: number;
  };
  roles: CommercialRoleValidation[];
};

export type CommercialDecision = {
  id: string;
  accountRole: CommercialRole;
  packageName: string;
  candidateMonthlyPrice: number;
  candidateAnnualPrice: number | null;
  valueDrivers: PricingValueDriver[];
  status: CommercialDecisionStatus;
  evidenceSnapshot: CommercialRoleValidation | null;
  decisionNote: string | null;
  createdAt: string;
  updatedAt: string;
  decidedAt: string | null;
};

async function readJson<T>(response: Response, fallback: string): Promise<T> {
  const data = await response.json();
  if (!response.ok) throw new Error(data?.error || fallback);
  return data as T;
}

export async function getCommercialValidationSummary(): Promise<CommercialValidationSummary> {
  const response = await secureFetch(`${API_BASE_URL}/admin/commercial-validation/summary`);
  const data = await readJson<{ validation: CommercialValidationSummary }>(response, 'Could not load commercial validation evidence.');
  return data.validation;
}

export async function listCommercialDecisions(): Promise<CommercialDecision[]> {
  const response = await secureFetch(`${API_BASE_URL}/admin/commercial-validation/decisions`);
  const data = await readJson<{ decisions: CommercialDecision[] }>(response, 'Could not load commercial validation decisions.');
  return data.decisions;
}

export async function createCommercialDecision(input: {
  accountRole: CommercialRole;
  packageName: string;
  candidateMonthlyPrice: number;
  candidateAnnualPrice?: number | null;
  valueDrivers: PricingValueDriver[];
}): Promise<CommercialDecision> {
  const response = await secureFetch(`${API_BASE_URL}/admin/commercial-validation/decisions`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(input),
  });
  const data = await readJson<{ decision: CommercialDecision }>(response, 'Could not save the package hypothesis.');
  return data.decision;
}

export async function updateCommercialDecisionStatus(
  decisionId: string,
  status: Exclude<CommercialDecisionStatus, 'draft'>,
  decisionNote?: string,
): Promise<CommercialDecision> {
  const response = await secureFetch(`${API_BASE_URL}/admin/commercial-validation/decisions/${decisionId}/status`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ status, decisionNote: decisionNote || null }),
  });
  const data = await readJson<{ decision: CommercialDecision }>(response, 'Could not update the commercial validation decision.');
  return data.decision;
}
