import { afterEach, describe, it, expect, vi } from 'vitest';
import apiService, { clearAuthToken } from './apiService';
import { ApplicationStatus, Contract, ContractStatus, ContractType, Currency, PaymentTerms, Role } from '../types';

afterEach(() => {
  vi.unstubAllGlobals();
});

describe('apiService.loginWithCredentials', () => {
  it('returns a user and token for a role that exists in the mock data', async () => {
    const { user, token } = await apiService.loginWithCredentials('anyone@example.com', Role.ENGINEER);

    expect(user.role).toBe(Role.ENGINEER);
    expect(token).toContain(user.id);
  });

  it('throws when no mock user matches the requested role', async () => {
    await expect(
      apiService.loginWithCredentials('nobody@example.com', 'Not A Real Role' as Role)
    ).rejects.toThrow('Invalid credentials');
  });
});

describe('apiService.createEngineer', () => {
  it('creates a new engineer user with sensible defaults', async () => {
    // Keep this unit test independent of whether the local backend is running.
    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new TypeError('Network unavailable in unit test')));

    const newUser: any = await apiService.createEngineer({ name: 'Test Engineer', email: 'test@example.com' });

    expect(newUser.role).toBe(Role.ENGINEER);
    expect(newUser.profile.name).toBe('Test Engineer');
    expect(newUser.profile.contact.email).toBe('test@example.com');
  });
});

// No backend is running in this test environment, and these two are
// called with no saved auth token, so both should go straight to the
// in-memory mock fallback (see services/apiService.ts postJob/applyForJob).
describe('apiService.postJob', () => {
  it('falls back to the in-memory mock when there is no backend session', async () => {
    clearAuthToken();
    const job: any = await apiService.postJob({ title: 'Test Job', jobRole: 'senior-av-installer' });

    expect(job.id).toBeDefined();
    expect(job.status).toBe('active');
    expect(job.title).toBe('Test Job');
  });
});

describe('apiService.applyForJob', () => {
  it('falls back to the in-memory mock when there is no backend session', async () => {
    clearAuthToken();
    const application: any = await apiService.applyForJob('job-1', 'eng-1');

    expect(application.jobId).toBe('job-1');
    expect(application.engineerId).toBe('eng-1');
    expect(application.status).toBe(ApplicationStatus.APPLIED);
  });
});

// Same "no backend session -> fall back" shape as postJob/applyForJob
// above, but these resolve differently: createContract falls back to
// returning the locally-built contract as-is, while the rest resolve to
// `null` (meaning "nothing to reconcile with, keep the optimistic local
// update") - see services/apiService.ts and context/InteractionContext.tsx.
describe('apiService contract/invoice methods without a backend session', () => {
  const sampleContract: Contract = {
    id: 'contract-1',
    jobId: 'job-1',
    companyId: 'company-1',
    engineerId: 'eng-1',
    type: ContractType.SOW,
    description: 'Terms...',
    amount: 500,
    currency: Currency.GBP,
    status: ContractStatus.PENDING_SIGNATURE,
    engineerSignature: null,
    companySignature: null,
    milestones: [],
  };

  it('createContract falls back to returning the locally-built contract as-is', async () => {
    clearAuthToken();
    const result = await apiService.createContract(sampleContract);
    expect(result).toEqual(sampleContract);
  });

  it('signContract falls back to null, signalling "keep the optimistic update"', async () => {
    clearAuthToken();
    const result = await apiService.signContract('contract-1', 'Jane Doe');
    expect(result).toBeNull();
  });

  it('fundMilestone falls back to null', async () => {
    clearAuthToken();
    const result = await apiService.fundMilestone('contract-1', 'ms-1');
    expect(result).toBeNull();
  });

  it('submitTimesheet falls back to null', async () => {
    clearAuthToken();
    const result = await apiService.submitTimesheet('contract-1', { period: 'Week 1', days: 5 });
    expect(result).toBeNull();
  });

  it('generateInvoice falls back to null', async () => {
    clearAuthToken();
    const result = await apiService.generateInvoice('contract-1', PaymentTerms.NET14);
    expect(result).toBeNull();
  });
});

// Same "no backend session -> resolve to null/empty rather than throw"
// shape as the contract methods above - see services/apiService.ts.
describe('apiService conversation/message methods without a backend session', () => {
  it('startOrGetConversation falls back to null', async () => {
    clearAuthToken();
    const result = await apiService.startOrGetConversation('user-2');
    expect(result).toBeNull();
  });

  it('sendMessage (conversation) falls back to null', async () => {
    clearAuthToken();
    const result = await apiService.sendMessage('convo-1', 'Hello there');
    expect(result).toBeNull();
  });

  it('getBackendConversations falls back to an empty array', async () => {
    clearAuthToken();
    const result = await apiService.getBackendConversations();
    expect(result).toEqual([]);
  });

  it('getBackendMessagesForConversation falls back to null, not an empty array', async () => {
    clearAuthToken();
    const result = await apiService.getBackendMessagesForConversation('convo-1');
    expect(result).toBeNull();
  });
});
