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
