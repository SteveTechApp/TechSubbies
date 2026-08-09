import { API_BASE_URL } from './apiConfig';
import { secureFetch } from './httpClient';
import { ProfileTier } from '../types';
import { MARKETPLACE_API_SCHEMA_VERSION, MembershipBillingStateDTO, MembershipBillingStatusDTO } from '../types/marketplaceApi';

export type MembershipBillingStatus = MembershipBillingStatusDTO;

export type MembershipBillingState = {
    tier: ProfileTier;
    status: MembershipBillingStatus;
    currentPeriodEnd: string | null;
    cancelAtPeriodEnd: boolean;
    hasCustomer: boolean;
    hasSubscription: boolean;
    paymentIssue: boolean;
    lastPaymentFailedAt: string | null;
};

function parseBillingState(value: unknown): MembershipBillingState {
    const data = value as Partial<MembershipBillingStateDTO>;
    if (data.schemaVersion !== MARKETPLACE_API_SCHEMA_VERSION || typeof data.tier !== 'string' || typeof data.status !== 'string') {
        throw new Error('Unsupported membership billing response.');
    }
    return data as MembershipBillingStateDTO;
}

export type AdminSubscriptionBillingSummary = {
    paidAccounts: number;
    active: number;
    trialing: number;
    pastDue: number;
    endingAtPeriodEnd: number;
    ended: number;
};

export type AdminSubscriptionBillingAccount = {
    userId: string;
    name: string;
    email: string;
    tier: ProfileTier;
    status: MembershipBillingStatus;
    currentPeriodEnd: string | null;
    cancelAtPeriodEnd: boolean;
    paymentIssue: boolean;
    lastPaymentFailedAt: string | null;
    updatedAt: string;
};

async function jsonResponse<T>(response: Response, fallback: string): Promise<T> {
    const data = await response.json();
    if (!response.ok) throw new Error(data?.error || fallback);
    return data as T;
}

export async function getMembershipBillingState(): Promise<MembershipBillingState> {
    const response = await secureFetch(`${API_BASE_URL}/billing/me`);
    return parseBillingState(await jsonResponse<unknown>(response, 'Could not load membership billing status.'));
}

export async function createMembershipCheckout(tier: ProfileTier): Promise<string> {
    const response = await secureFetch(`${API_BASE_URL}/billing/checkout`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tier }),
    });
    const data = await jsonResponse<{ url: string }>(response, 'Could not start membership checkout.');
    return data.url;
}

export async function createMembershipPortal(): Promise<string> {
    const response = await secureFetch(`${API_BASE_URL}/billing/portal`, { method: 'POST' });
    const data = await jsonResponse<{ url: string }>(response, 'Could not open billing management.');
    return data.url;
}

export async function getAdminSubscriptionBillingSummary(): Promise<AdminSubscriptionBillingSummary> {
    const response = await secureFetch(`${API_BASE_URL}/admin/billing/summary`);
    const data = await jsonResponse<{ summary: AdminSubscriptionBillingSummary }>(response, 'Could not load subscription billing summary.');
    return data.summary;
}

export async function listAdminSubscriptionBillingAccounts(): Promise<AdminSubscriptionBillingAccount[]> {
    const response = await secureFetch(`${API_BASE_URL}/admin/billing/accounts`);
    const data = await jsonResponse<{ accounts: AdminSubscriptionBillingAccount[] }>(response, 'Could not load subscription billing accounts.');
    return data.accounts;
}

export function redirectToBillingUrl(url: string) {
    window.location.assign(url);
}
