import { API_BASE_URL } from './apiConfig';
import { secureFetch } from './httpClient';
import { ProfileTier } from '../types';

export type MembershipBillingStatus =
    | 'free'
    | 'incomplete'
    | 'incomplete_expired'
    | 'trialing'
    | 'active'
    | 'past_due'
    | 'unpaid'
    | 'canceled'
    | 'paused';

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

async function jsonResponse<T>(response: Response, fallback: string): Promise<T> {
    const data = await response.json();
    if (!response.ok) throw new Error(data?.error || fallback);
    return data as T;
}

export async function getMembershipBillingState(): Promise<MembershipBillingState> {
    const response = await secureFetch(`${API_BASE_URL}/billing/me`);
    return jsonResponse(response, 'Could not load membership billing status.');
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

export function redirectToBillingUrl(url: string) {
    window.location.assign(url);
}
