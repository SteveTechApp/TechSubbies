import { API_BASE_URL } from './apiConfig';
import { secureFetch } from './httpClient';

export type PricingResearchRole = 'Engineer' | 'Company' | 'Resourcing Company';
export type BillingPreference = 'monthly' | 'annual' | 'either';
export type PricingBlocker =
  | 'price'
  | 'need-proof-of-value'
  | 'not-enough-demand'
  | 'not-enough-supply'
  | 'missing-features'
  | 'billing-commitment'
  | 'none';
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

async function jsonResponse<T>(response: Response, fallback: string): Promise<T> {
  const data = await response.json();
  if (!response.ok) throw new Error(data?.error || fallback);
  return data as T;
}

export async function getMyPricingResearchResponse(): Promise<PricingResearchResponse | null> {
  const response = await secureFetch(`${API_BASE_URL}/pricing-research/me`);
  const data = await jsonResponse<{ response: PricingResearchResponse | null }>(response, 'Could not load pricing research.');
  return data.response;
}

export async function saveMyPricingResearchResponse(input: PricingResearchInput): Promise<PricingResearchResponse> {
  const response = await secureFetch(`${API_BASE_URL}/pricing-research/me`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(input),
  });
  const data = await jsonResponse<{ response: PricingResearchResponse }>(response, 'Could not save pricing research.');
  return data.response;
}

export async function getAdminPricingResearchSummary(): Promise<PricingResearchSummary> {
  const response = await secureFetch(`${API_BASE_URL}/admin/pricing-research`);
  const data = await jsonResponse<{ summary: PricingResearchSummary }>(response, 'Could not load pricing research summary.');
  return data.summary;
}
