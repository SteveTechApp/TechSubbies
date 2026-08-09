import { afterEach, describe, it, expect, vi } from 'vitest';
import apiService from './apiService';
import { Role } from '../types';

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
  it('does not pretend an account was created when the backend is unavailable', async () => {
    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new TypeError('Network unavailable in unit test')));
    await expect(apiService.createEngineer({name:'Test Engineer',email:'test@example.com'})).rejects.toThrow('not created');
  });
});

describe('apiService authenticated profile persistence', () => {
  it('uses the secured current-user endpoint for engineer edits', async () => {
    localStorage.setItem('techsubbies_auth_token', 'signed-token');
    const fetchMock=vi.fn().mockResolvedValue({ok:true,json:async()=>({id:'eng-1',role:Role.ENGINEER,profile:{id:'eng-1',name:'Persisted Engineer',minDayRate:325}})});
    vi.stubGlobal('fetch',fetchMock);
    const saved=await apiService.updateEngineerProfile('eng-1',{minDayRate:325} as any);
    expect(saved.minDayRate).toBe(325);
    expect(fetchMock).toHaveBeenCalledWith(expect.stringContaining('/users/me'),expect.objectContaining({method:'PATCH'}));
    localStorage.removeItem('techsubbies_auth_token');
  });
});

describe('apiService marketplace hydration', () => {
  it('treats an empty reachable backend as empty instead of injecting demo jobs', async () => {
    localStorage.removeItem('techsubbies_auth_token');
    vi.stubGlobal('fetch',vi.fn().mockResolvedValue({ok:true,json:async()=>[]}));
    const data=await apiService.getInitialData();
    expect(data.jobs).toEqual([]);
    expect(data.engineers).toEqual([]);
    expect(data.contracts).toEqual([]);
  });

  it('hydrates registered users and persisted jobs from the backend', async () => {
    const engineer={id:'u-1',role:Role.ENGINEER,profile:{id:'u-1',name:'Real Engineer'}};
    const fetchMock=vi.fn().mockImplementation((url:string)=>Promise.resolve({ok:true,json:async()=>url.endsWith('/users')?[engineer]:url.endsWith('/jobs')?[{id:'j-1',title:'Persisted role'}]:[]}));
    vi.stubGlobal('fetch',fetchMock);
    const data=await apiService.getInitialData();
    expect(data.allUsers).toEqual([engineer]);
    expect(data.engineers[0].name).toBe('Real Engineer');
    expect(data.jobs[0].id).toBe('j-1');
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

describe('apiService.updateApplicationStatus', () => {
  it('patches a persisted application and converts its date', async () => {
    const fetchMock = vi.fn()
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ user: { id: 'company-1', role: Role.COMPANY, profile: {} } }),
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({
        id: 'application-1',
        jobId: 'job-1',
        engineerId: 'eng-1',
        date: '2026-07-27T10:00:00.000Z',
        status: ApplicationStatus.OFFERED,
        reviewed: true,
        }),
      });
    vi.stubGlobal('fetch', fetchMock);
    await apiService.loginWithPassword('company@example.com', 'password');

    const result = await apiService.updateApplicationStatus('application-1', ApplicationStatus.OFFERED);

    expect(fetchMock).toHaveBeenNthCalledWith(
      2,
      expect.stringContaining('/applications/application-1'),
      expect.objectContaining({
        method: 'PATCH',
        body: JSON.stringify({ status: ApplicationStatus.OFFERED }),
      })
    );
    expect(result).toEqual(expect.objectContaining({
      id: 'application-1',
      status: ApplicationStatus.OFFERED,
      date: new Date('2026-07-27T10:00:00.000Z'),
    }));
    clearAuthToken();
  });
});

describe('apiService.getBackendEngineerApplications', () => {
  it('loads the signed-in engineer application history with real dates', async () => {
    const fetchMock = vi.fn()
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ user: { id: 'engineer-1', role: Role.ENGINEER, profile: {} } }),
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => [{
          id: 'application-1',
          jobId: 'job-1',
          engineerId: 'engineer-1',
          date: '2026-07-27T12:00:00.000Z',
          status: ApplicationStatus.HIRED,
          reviewed: true,
        }],
      });
    vi.stubGlobal('fetch', fetchMock);
    await apiService.loginWithPassword('engineer@example.com', 'password');

    const applications = await apiService.getBackendEngineerApplications();

    expect(fetchMock).toHaveBeenNthCalledWith(
      2,
      expect.stringContaining('/applications/me'),
      expect.any(Object)
    );
    expect(applications).toEqual([
      expect.objectContaining({
        id: 'application-1',
        status: ApplicationStatus.HIRED,
        date: new Date('2026-07-27T12:00:00.000Z'),
      }),
    ]);
    clearAuthToken();
  });
});

// Same "no backend session -> fall back" shape as postJob/applyForJob
// above, but these resolve differently: createContract falls back to
// returning the locally-built contract as-is, while the rest resolve to
// `null` (meaning "nothing to reconcile with, keep the optimistic local
// update") - see services/apiService.ts and context/InteractionContext.tsx.
describe('apiService contract methods without a backend session', () => {
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

  it('startMilestone falls back to null', async () => {
    clearAuthToken();
    const result = await apiService.startMilestone('contract-1', 'ms-1');
    expect(result).toBeNull();
  });

  it('submitTimesheet falls back to null', async () => {
    clearAuthToken();
    const result = await apiService.submitTimesheet('contract-1', { period: 'Week 1', days: 5 });
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
