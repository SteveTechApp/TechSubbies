import { API_BASE_URL } from './apiConfig';
import { secureFetch } from './httpClient';

export type ContractSupportCaseType = 'cancellation' | 'substitution' | 'no_show' | 'dispute' | 'support';
export type ContractSupportCaseStatus = 'awaiting_other_party' | 'under_review' | 'resolved' | 'withdrawn';

export type ContractSupportEvent = {
    id: string;
    caseId: string;
    actorId: string;
    eventType: string;
    note: string | null;
    createdAt: string;
};

export type ContractSupportCase = {
    id: string;
    contractId: string;
    caseType: ContractSupportCaseType;
    status: ContractSupportCaseStatus;
    openedById: string;
    counterpartyId: string;
    openedByName: string;
    counterpartyName: string;
    proposedEngineerId: string | null;
    proposedEngineerName: string | null;
    summary: string;
    details: string;
    resolution: string | null;
    resolvedById: string | null;
    createdAt: string;
    updatedAt: string;
    events: ContractSupportEvent[];
};

async function jsonResponse<T>(response: Response, fallback: string): Promise<T> {
    const data = await response.json();
    if (!response.ok) throw new Error(data?.error || fallback);
    return data as T;
}

export async function listContractSupportCases(contractId: string): Promise<ContractSupportCase[]> {
    const response = await secureFetch(`${API_BASE_URL}/contract-support/contract/${encodeURIComponent(contractId)}`);
    const data = await jsonResponse<{ cases: ContractSupportCase[] }>(response, 'Could not load contract support cases.');
    return data.cases;
}

export async function createContractSupportCase(input: {
    contractId: string;
    caseType: ContractSupportCaseType;
    summary: string;
    details: string;
    proposedEngineerId?: string;
}): Promise<ContractSupportCase> {
    const response = await secureFetch(`${API_BASE_URL}/contract-support`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(input),
    });
    const data = await jsonResponse<{ case: ContractSupportCase }>(response, 'Could not open the support case.');
    return data.case;
}

export async function respondToContractSupportCase(caseId: string, decision: 'accept' | 'decline', note: string) {
    const response = await secureFetch(`${API_BASE_URL}/contract-support/${encodeURIComponent(caseId)}/respond`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ decision, note }),
    });
    const data = await jsonResponse<{ case: ContractSupportCase }>(response, 'Could not update the support case.');
    return data.case;
}

export async function withdrawContractSupportCase(caseId: string, note = '') {
    const response = await secureFetch(`${API_BASE_URL}/contract-support/${encodeURIComponent(caseId)}/withdraw`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ note }),
    });
    const data = await jsonResponse<{ case: ContractSupportCase }>(response, 'Could not withdraw the support case.');
    return data.case;
}

export async function listAdminContractSupportCases(): Promise<ContractSupportCase[]> {
    const response = await secureFetch(`${API_BASE_URL}/admin/contract-support`);
    const data = await jsonResponse<{ cases: ContractSupportCase[] }>(response, 'Could not load support cases.');
    return data.cases;
}

export async function resolveAdminContractSupportCase(caseId: string, resolution: string) {
    const response = await secureFetch(`${API_BASE_URL}/admin/contract-support/${encodeURIComponent(caseId)}/resolve`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ resolution }),
    });
    const data = await jsonResponse<{ case: ContractSupportCase }>(response, 'Could not resolve the support case.');
    return data.case;
}
