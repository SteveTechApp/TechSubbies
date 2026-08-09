import { MOCK_ENGINEERS, MOCK_COMPANIES, MOCK_JOBS, MOCK_APPLICATIONS, MOCK_REVIEWS, MOCK_CONVERSATIONS, MOCK_MESSAGES, MOCK_CONTRACTS, MOCK_TRANSACTIONS, MOCK_PROJECTS, ALL_MOCK_USERS, MOCK_FORUM_POSTS, MOCK_FORUM_COMMENTS, MOCK_NOTIFICATIONS, MOCK_COLLABORATION_POSTS, MOCK_INVOICES } from '../data/mockData';
import { MOCK_RESOURCING_COMPANY_1, MOCK_ADMIN_PROFILE, MOCK_FREE_ENGINEER, MOCK_ENGINEER_STEVE } from '../data/modules/mockStaticProfiles';
import { ApplicationStatus, EngineerProfile, ProfileTier, Role, User, ContractStatus, ContractType, MilestoneStatus, Timesheet, TimesheetStatus, PaymentTerms, InvoiceStatus, ForumPost, Notification, CollaborationPost, CompanyProfile, ResourcingCompanyProfile, Job, Discipline, Currency, Country, ExperienceLevel } from '../types';
import type { MarketplaceShortlistResponse } from '../types/marketplaceApi';

// --- API Service ---
// Core account, profile, marketplace, trust and membership workflows call
// the persistent backend. Legacy community/demo features lower in this file
// retain their in-memory fixtures until they receive dedicated APIs.

const simulateDelay = (ms: number = 500) => new Promise(res => setTimeout(res, ms));

const API_BASE_URL = (import.meta as any).env?.VITE_API_BASE_URL || 'http://localhost:4000/api';
const ENABLE_DEMO_DATA=(import.meta as any).env?.VITE_ENABLE_DEMO_DATA==='true';
const TOKEN_KEY = 'techsubbies_auth_token';

export function getAuthToken(): string | null {
  try {
    return window.localStorage.getItem(TOKEN_KEY);
  } catch {
    return null;
  }
}

function saveAuthToken(token: string) {
  try {
    window.localStorage.setItem(TOKEN_KEY, token);
  } catch {
    // localStorage unavailable (e.g. private browsing) - the session just
    // won't survive a refresh, which matches the old mock behavior anyway.
  }
}

function hydrateMarketplaceContract(contract:any){const signatures=contract.signatures||{};return{...contract,description:contract.description||contract.scope||'',jobTitle:contract.jobTitle||'Technical services agreement',type:contract.type||ContractType.SOW,milestones:Array.isArray(contract.milestones)?contract.milestones:[],timesheets:Array.isArray(contract.timesheets)?contract.timesheets:[],engineerSignature:signatures[contract.engineerId]||contract.engineerSignature||null,companySignature:signatures[contract.companyId]||contract.companySignature||null};}

export function clearAuthToken() {
  try {
    window.localStorage.removeItem(TOKEN_KEY);
  } catch {
    // no-op
  }
}

// True when the backend genuinely couldn't be reached (it's not running,
// wrong URL, offline, etc) - as opposed to the backend responding with a
// real validation error (bad password, duplicate email, ...).
function isNetworkError(error: any): boolean {
  return error instanceof TypeError;
}

async function backendRegister(payload: { email: string; password: string; role: string; name: string; profileData: any }) {
  const response = await fetch(`${API_BASE_URL}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data?.error || 'Registration failed.');
  }
  saveAuthToken(data.token);
  return data.user as User;
}

async function backendLogin(email: string, password: string) {
  const response = await fetch(`${API_BASE_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data?.error || 'Invalid credentials.');
  }
  saveAuthToken(data.token);
  return data.user as User;
}

const apiService = {
  requestPasswordReset:async(email:string)=>{const response=await fetch(`${API_BASE_URL}/auth/password/forgot`,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({email})});const data=await response.json();if(!response.ok)throw new Error(data?.error||'Could not request a password reset.');return data;},
  resetPassword:async(token:string,password:string)=>{const response=await fetch(`${API_BASE_URL}/auth/password/reset`,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({token,password})});const data=await response.json();if(!response.ok)throw new Error(data?.error||'Could not reset password.');return data;},
  confirmEmail:async(token:string)=>{const response=await fetch(`${API_BASE_URL}/auth/verification/confirm`,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({token})});const data=await response.json();if(!response.ok)throw new Error(data?.error||'Could not verify email.');return data;},
  // --- DATA FETCHING ---
  getInitialData: async () => {
    let backendAvailable = false;
    let persistedJobs: any[] = [];
    let persistedApplications: any[] = [];
    let persistedContracts: any[] = [];
    let persistedUsers: User[] = [];
    let membershipInvoices: any[] = [];
    try {
      const [jobsResponse,usersResponse] = await Promise.all([fetch(`${API_BASE_URL}/jobs`),fetch(`${API_BASE_URL}/users`)]);
      backendAvailable = jobsResponse.ok && usersResponse.ok;
      if (jobsResponse.ok) persistedJobs = await jobsResponse.json();
      if (usersResponse.ok) persistedUsers = await usersResponse.json();
      const token = getAuthToken();
      if (token) {
        const headers = { Authorization: `Bearer ${token}` };
        const [applicationsResponse, contractsResponse, invoicesResponse] = await Promise.all([
          fetch(`${API_BASE_URL}/applications`, { headers }), fetch(`${API_BASE_URL}/contracts`, { headers }), fetch(`${API_BASE_URL}/membership/invoices`, { headers }),
        ]);
        if (applicationsResponse.ok) persistedApplications = await applicationsResponse.json();
        if (contractsResponse.ok) persistedContracts = (await contractsResponse.json()).map(hydrateMarketplaceContract);
        if (invoicesResponse.ok) membershipInvoices = await invoicesResponse.json();
      }
    } catch { /* surfaced below as an empty operational state unless explicit demo data is enabled */ }
    const persistedEngineers = persistedUsers.filter(user=>user.role===Role.ENGINEER).map(user=>user.profile as EngineerProfile);
    const persistedCompanies = persistedUsers.filter(user=>user.role===Role.COMPANY||user.role===Role.RESOURCING_COMPANY).map(user=>user.profile as CompanyProfile);
    return {
      engineers: backendAvailable ? persistedEngineers : ENABLE_DEMO_DATA?[...MOCK_ENGINEERS, MOCK_ENGINEER_STEVE, MOCK_FREE_ENGINEER]:[],
      companies: backendAvailable ? persistedCompanies : ENABLE_DEMO_DATA?[...MOCK_COMPANIES, MOCK_RESOURCING_COMPANY_1]:[],
      jobs: backendAvailable ? persistedJobs : ENABLE_DEMO_DATA?MOCK_JOBS:[],
      applications: backendAvailable ? persistedApplications : ENABLE_DEMO_DATA?MOCK_APPLICATIONS:[],
      reviews: ENABLE_DEMO_DATA?MOCK_REVIEWS:[],
      allUsers: backendAvailable ? persistedUsers : ENABLE_DEMO_DATA?ALL_MOCK_USERS:[],
      conversations: ENABLE_DEMO_DATA?MOCK_CONVERSATIONS:[],
      messages: ENABLE_DEMO_DATA?MOCK_MESSAGES:[],
      contracts: backendAvailable ? persistedContracts : ENABLE_DEMO_DATA?MOCK_CONTRACTS:[],
      transactions: [],
      projects: ENABLE_DEMO_DATA?MOCK_PROJECTS:[],
      forumPosts: ENABLE_DEMO_DATA?MOCK_FORUM_POSTS:[],
      forumComments: ENABLE_DEMO_DATA?MOCK_FORUM_COMMENTS:[],
      notifications: ENABLE_DEMO_DATA?MOCK_NOTIFICATIONS:[],
      collaborationPosts: ENABLE_DEMO_DATA?MOCK_COLLABORATION_POSTS:[],
      invoices: backendAvailable ? membershipInvoices : [],
    };
  },

  // --- AUTHENTICATION ---
  loginWithCredentials: async (email: string, role: Role): Promise<{ user: User, token: string }> => {
    await simulateDelay();
    // Simulate finding a user by role. A real app would verify email/password.
    const user = ALL_MOCK_USERS.find(u => u.role === role);
    if (user) {
      return { user, token: `mock-jwt-token-for-${user.id}` };
    }
    throw new Error("Invalid credentials or user role not found.");
  },

  // Real, password-based login against the backend. Used by the sign-in
  // form for accounts created through the sign-up wizards below. Throws
  // if the backend can't be reached at all, so callers can fall back to
  // the demo login system if they want to keep working offline.
  loginWithPassword: async (email: string, password: string): Promise<User> => {
    return backendLogin(email, password);
  },

  // Looks up a single profile by id from the backend (public data, no
  // auth required to read it - matches GET /users/:profileId in the spec).
  getUserById: async (id: string): Promise<User | null> => {
    const response = await fetch(`${API_BASE_URL}/users/${id}`);
    if (!response.ok) return null;
    return (await response.json()) as User;
  },

  // Lists resourcing companies registered on the real backend, so an
  // engineer can pick one to request attaching themselves to.
  listResourcingCompanies: async (): Promise<User[]> => {
    try {
      const response = await fetch(`${API_BASE_URL}/users`);
      if (!response.ok) return [];
      const all = (await response.json()) as User[];
      return all.filter((u) => u.role === Role.RESOURCING_COMPANY);
    } catch {
      return [];
    }
  },

  // Restores a signed-in session after a page reload, using the JWT saved
  // in localStorage. Returns null if there's no token, the token is
  // unreadable, or the backend can't be reached (e.g. not running).
  getCurrentUserFromToken: async (): Promise<User | null> => {
    const token = getAuthToken();
    if (!token) return null;
    try {
      const response=await fetch(`${API_BASE_URL}/users/me`,{headers:{Authorization:`Bearer ${token}`}});
      if(!response.ok)return null;
      return await response.json() as User;
    } catch {
      return null;
    }
  },

  // --- USER CREATION ---
  // Each of these tries the real backend first (so the account is
  // actually saved to the database). If the backend simply isn't running
  // (a network error, not a validation error), it falls back to the old
  // in-memory mock so the app still works for quick local demos without
  // the backend started.
  createEngineer: async (data: any): Promise<User> => {
    try {
      return await backendRegister({
        email: data.email,
        password: data.password,
        role: Role.ENGINEER,
        name: data.name || data.fullName,
        profileData: {
          discipline: data.discipline || Discipline.AV,
          location: data.location || data.baseLocation || 'London, UK',
          country: data.country || Country.UK,
          description: 'Newly registered engineer.',
          experience: data.experience || 0,
          experienceLevel: data.experienceLevel || ExperienceLevel.JUNIOR,
          profileTier: ProfileTier.BASIC,
          minDayRate: data.minDayRate || 150,
          maxDayRate: data.maxDayRate || 195,
          currency: data.currency || Currency.GBP,
          compliance: data.compliance || {},
          identity: data.identity || {},
          badges: [],
          platformCredits: 1,
          loyaltyPoints: 0,
          roleSkillProfiles: data.roleSkillProfiles || [],
          sectorProfiles: data.sectorProfiles || [],
        },
      });
    } catch (error: any) {
      if (!isNetworkError(error)) throw error;
      if(!ENABLE_DEMO_DATA)throw new Error('Registration service is unavailable. Your account was not created.');

      await simulateDelay();
      const newEngineer: EngineerProfile = {
          id: `eng-${Date.now()}`,
          name: data.name,
          avatar: 'https://xsgames.co/randomusers/assets/avatars/male/1.jpg',
          status: 'active',
          role: Role.ENGINEER,
          discipline: data.discipline || Discipline.AV,
          location: data.location || 'London, UK',
          country: data.country || Country.UK,
          description: 'Newly registered engineer.',
          experience: data.experience || 0,
          experienceLevel: data.experienceLevel || ExperienceLevel.JUNIOR,
          profileTier: ProfileTier.BASIC,
          minDayRate: data.minDayRate || 150,
          maxDayRate: data.maxDayRate || 195,
          currency: data.currency || Currency.GBP,
          availability: new Date(data.availability) || new Date(),
          compliance: data.compliance || {},
          identity: data.identity || {},
          profileViews: 0, searchAppearances: 0, jobInvites: 0, reputation: 50, complianceScore: 50,
          calendarSyncUrl: `https://wingman.com/cal/eng-${Date.now()}.ics`,
          badges: [],
          contact: { email: data.email },
          platformCredits: 1, loyaltyPoints: 0,
      };
      const newUser: User = { id: `user-${newEngineer.id}`, role: Role.ENGINEER, profile: newEngineer };
      MOCK_ENGINEERS.push(newEngineer);
      ALL_MOCK_USERS.push(newUser);
      return newUser;
    }
  },

  createCompany: async (data: any): Promise<User> => {
    try {
      return await backendRegister({
        email: data.email,
        password: data.password,
        role: Role.COMPANY,
        name: data.companyName,
        profileData: {
          website: data.website,
          location: data.location,
          contact: { name: data.contactName, email: data.email },
        },
      });
    } catch (error: any) {
      if (!isNetworkError(error)) throw error;
      if(!ENABLE_DEMO_DATA)throw new Error('Registration service is unavailable. Your account was not created.');

      await simulateDelay();
      const newCompany: CompanyProfile = {
          id: `comp-${Date.now()}`,
          name: data.companyName,
          avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(data.companyName)}`,
          logo: `https://ui-avatars.com/api/?name=${encodeURIComponent(data.companyName)}`,
          status: 'active',
          role: Role.COMPANY,
          website: data.website,
          location: data.location,
          contact: { name: data.contactName, email: data.email },
      };
      const newUser: User = { id: `user-${newCompany.id}`, role: Role.COMPANY, profile: newCompany };
      MOCK_COMPANIES.push(newCompany);
      ALL_MOCK_USERS.push(newUser);
      return newUser;
    }
  },
  
  createResourcingCompany: async (data: any): Promise<User> => {
    try {
      return await backendRegister({
        email: data.email,
        password: data.password,
        role: Role.RESOURCING_COMPANY,
        name: data.companyName,
        profileData: {
          website: data.website,
          location: data.location,
          contact: { name: data.contactName, email: data.email },
          managedEngineerIds: [],
        },
      });
    } catch (error: any) {
      if (!isNetworkError(error)) throw error;
      if(!ENABLE_DEMO_DATA)throw new Error('Registration service is unavailable. Your account was not created.');

      await simulateDelay();
      const newResourcingCompany: ResourcingCompanyProfile = {
          id: `res-${Date.now()}`,
          name: data.companyName,
          avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(data.companyName)}`,
          logo: `https://ui-avatars.com/api/?name=${encodeURIComponent(data.companyName)}`,
          status: 'active',
          role: Role.RESOURCING_COMPANY,
          website: data.website,
          location: data.location,
          contact: { name: data.contactName, email: data.email },
          managedEngineerIds: [],
      };
      const newUser: User = { id: `user-${newResourcingCompany.id}`, role: Role.RESOURCING_COMPANY, profile: newResourcingCompany };
      MOCK_COMPANIES.push(newResourcingCompany);
      ALL_MOCK_USERS.push(newUser);
      return newUser;
    }
  },

  // Updates the signed-in user's profile on the real backend. Only works
  // for accounts that were created via the real registration path above
  // (i.e. a token is stored) - falls back to updating the in-memory mock
  // otherwise, same pattern as account creation.
  updateMyProfile: async (updates: Record<string, unknown>): Promise<User | null> => {
    const token = getAuthToken();
    if (!token) return null;

    const response = await fetch(`${API_BASE_URL}/users/me`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify(updates),
    });
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data?.error || 'Could not update profile.');
    }
    return data as User;
  },

  // --- ENGINEER PARTNERSHIPS ("team" pairing) ---
  // Requires the signed-in user to have a real backend account (a token
  // saved from registration/login). Mirrors backend/src/routes/partnerships.ts.

  requestPartnership: async (partnerEmail: string): Promise<any> => {
    const token = getAuthToken();
    if (!token) throw new Error('You need to be signed in to do this.');
    const response = await fetch(`${API_BASE_URL}/partnerships/request`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ partnerEmail }),
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data?.error || 'Could not send partner request.');
    return data;
  },

  respondToPartnershipRequest: async (requestId: string, accept: boolean): Promise<any> => {
    const token = getAuthToken();
    if (!token) throw new Error('You need to be signed in to do this.');
    const response = await fetch(`${API_BASE_URL}/partnerships/${requestId}/${accept ? 'accept' : 'decline'}`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data?.error || 'Could not respond to the partner request.');
    return data;
  },

  removePartnership: async (): Promise<any> => {
    const token = getAuthToken();
    if (!token) throw new Error('You need to be signed in to do this.');
    const response = await fetch(`${API_BASE_URL}/partnerships/remove`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data?.error || 'Could not remove your partner.');
    return data;
  },

  getMyPartnershipStatus: async (): Promise<{ incoming: any[]; outgoing: any[]; partner: User | null }> => {
    const token = getAuthToken();
    if (!token) return { incoming: [], outgoing: [], partner: null };
    const response = await fetch(`${API_BASE_URL}/partnerships/me`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!response.ok) return { incoming: [], outgoing: [], partner: null };
    return await response.json();
  },

  // --- RESOURCING COMPANY ATTACHMENT ---
  // Mirrors backend/src/routes/companyAttachments.ts.

  requestCompanyAttachment: async (resourcingCompanyId: string): Promise<any> => {
    const token = getAuthToken();
    if (!token) throw new Error('You need to be signed in to do this.');
    const response = await fetch(`${API_BASE_URL}/company-attachments/request`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ resourcingCompanyId }),
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data?.error || 'Could not send the request to join this company.');
    return data;
  },

  respondToCompanyAttachmentRequest: async (requestId: string, approve: boolean): Promise<any> => {
    const token = getAuthToken();
    if (!token) throw new Error('You need to be signed in to do this.');
    const response = await fetch(`${API_BASE_URL}/company-attachments/${requestId}/${approve ? 'approve' : 'reject'}`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data?.error || 'Could not respond to the request.');
    return data;
  },

  getMyCompanyAttachmentRequests: async (): Promise<any[]> => {
    const token = getAuthToken();
    if (!token) return [];
    const response = await fetch(`${API_BASE_URL}/company-attachments/me`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!response.ok) return [];
    const data = await response.json();
    return data.requests || [];
  },

  getPendingCompanyAttachmentRequests: async (): Promise<any[]> => {
    const token = getAuthToken();
    if (!token) return [];
    const response = await fetch(`${API_BASE_URL}/company-attachments/pending`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!response.ok) return [];
    const data = await response.json();
    return data.requests || [];
  },

  // --- FILE UPLOADS (Production Pattern) ---
  uploadDocument:async(file:File,documentType:'cv'|'certification'|'insurance'|'identity'|'capability-evidence')=>{const token=getAuthToken();if(!token)throw new Error('Sign in before uploading private documents.');const response=await fetch(`${API_BASE_URL}/documents`,{method:'POST',headers:{Authorization:`Bearer ${token}`,'Content-Type':file.type,'X-Document-Type':documentType,'X-File-Name':file.name},body:file});const data=await response.json();if(!response.ok)throw new Error(data?.error||'Document upload failed.');return data as {id:string;fileUrl:string;originalName:string;status:string};},
  getPresignedUploadUrl: async (fileName: string, fileType: string): Promise<{ uploadUrl: string, fileUrl: string }> => {
    throw new Error(`Direct presigned uploads are not enabled. Upload ${fileName} through the authenticated document service (${fileType}).`);
  },

  confirmFileUpload: async (fileUrl: string, context: { entityId: string, documentType: string }): Promise<{ success: boolean }> => {
    throw new Error(`Untrusted external file URLs cannot be attached (${fileUrl}, ${context.documentType}, ${context.entityId}).`);
  },

  // --- E-SIGNATURE ---
  createSignatureSession: async (contractId: string, signerProfileId: string): Promise<{ signingUrl: string }> => {
    await simulateDelay();
    // Backend would integrate with DocuSign/HelloSign here and return an embedded signing URL.
    return { signingUrl: `/mock-embedded-signing-page?contract=${contractId}&signer=${signerProfileId}` };
  },
  
  // --- OTHER "WRITE" OPERATIONS ---
  
  updateEngineerProfile: async (profileId: string, profileData: Partial<EngineerProfile>): Promise<EngineerProfile> => {
    const token=getAuthToken();
    if(token){const saved=await apiService.updateMyProfile(profileData as Record<string,unknown>);if(!saved||saved.role!==Role.ENGINEER)throw new Error('Engineer profile could not be saved.');return saved.profile as EngineerProfile;}
    if(!ENABLE_DEMO_DATA)throw new Error('Sign in to save an engineer profile.');await simulateDelay(); const engineer=MOCK_ENGINEERS.find(e=>e.id===profileId)||MOCK_ENGINEER_STEVE; if(!engineer)throw new Error("Engineer not found"); Object.assign(engineer,profileData); return {...engineer};
  },
  
  updateCompanyProfile: async (profileId: string, profileData: Partial<CompanyProfile>): Promise<CompanyProfile> => {
      const token=getAuthToken();
      if(token){const saved=await apiService.updateMyProfile(profileData as Record<string,unknown>);if(!saved||![Role.COMPANY,Role.RESOURCING_COMPANY].includes(saved.role))throw new Error('Company profile could not be saved.');return saved.profile as CompanyProfile;}
      if(!ENABLE_DEMO_DATA)throw new Error('Sign in to save a company profile.');await simulateDelay(); const company=MOCK_COMPANIES.find(c=>c.id===profileId); if(!company)throw new Error("Company not found"); Object.assign(company,profileData); return {...company};
  },
  
  postJob: async (jobData: any): Promise<Job> => {
    const token = getAuthToken();
    if (!token) throw new Error('A verified company account is required to post a job.');
    const response = await fetch(`${API_BASE_URL}/jobs`, { method: 'POST', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` }, body: JSON.stringify(jobData) });
    const data = await response.json(); if (!response.ok) throw new Error(data?.error || 'Could not post job.'); return data as Job;
  },
  getJobShortlist: async (jobId:string):Promise<MarketplaceShortlistResponse> => { const token=getAuthToken(); const response=await fetch(`${API_BASE_URL}/jobs/${jobId}/shortlist`,{headers:{Authorization:`Bearer ${token}`}}); const data=await response.json(); if(!response.ok)throw new Error(data?.error||'Could not load the applicant shortlist.'); return data as MarketplaceShortlistResponse; },

  // ... other "write" operations would follow the same async/Promise pattern
  // For brevity, we'll keep the existing synchronous mocks for less critical functions
  // but a full implementation would convert all of these.

   applyForJob: async (jobId: string, engineerId: string) => {
    const token = getAuthToken(); if (!token) throw new Error('A verified engineer account is required to apply.');
    const response = await fetch(`${API_BASE_URL}/jobs/${jobId}/apply`, { method: 'POST', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` }, body: JSON.stringify({ engineerId }) });
    const data = await response.json(); if (!response.ok) throw new Error(data?.error || 'Could not apply.'); return data;
  },
  listEngineers: async (): Promise<User[]> => { try { const response=await fetch(`${API_BASE_URL}/users`); if(!response.ok)return []; const all=await response.json() as User[]; return all.filter(user=>user.role===Role.ENGINEER); } catch { return []; } },

  updateApplicationStatus: async (applicationId: string, status: string) => {
    const token = getAuthToken(); const response = await fetch(`${API_BASE_URL}/applications/${applicationId}`, { method: 'PATCH', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` }, body: JSON.stringify({ status }) }); const data = await response.json(); if (!response.ok) throw new Error(data?.error || 'Could not update application.'); return data;
  },
  createMarketplaceContract: async (applicationId: string, scope: string, overrideExclusionReason?:string, type?:ContractType) => {
    const token = getAuthToken(); const response = await fetch(`${API_BASE_URL}/contracts`, { method: 'POST', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` }, body: JSON.stringify({ applicationId, scope, description:scope, type:type||ContractType.SOW, overrideExclusionReason }) }); const data = await response.json(); if (!response.ok) throw new Error(data?.error || 'Could not create contract.'); return hydrateMarketplaceContract(data);
  },
  signMarketplaceContract: async (contractId: string) => {
    const token = getAuthToken(); const response = await fetch(`${API_BASE_URL}/contracts/${contractId}/sign`, { method: 'POST', headers: { Authorization: `Bearer ${token}` } }); const data = await response.json(); if (!response.ok) throw new Error(data?.error || 'Could not sign contract.'); return hydrateMarketplaceContract(data);
  },
  submitTimesheet: async (contractId: string, entry: { period: string; hours: number; workSummary: string; days?:number }) => {
    const token = getAuthToken(); const response = await fetch(`${API_BASE_URL}/contracts/${contractId}/timesheets`, { method: 'POST', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` }, body: JSON.stringify(entry) }); const data = await response.json(); if (!response.ok) throw new Error(data?.error || 'Could not submit timesheet.'); return data;
  },
  reviewTimesheet: async (timesheetId: string, status: 'approved' | 'rejected') => {
    const token = getAuthToken(); const response = await fetch(`${API_BASE_URL}/timesheets/${timesheetId}`, { method: 'PATCH', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` }, body: JSON.stringify({ status }) }); const data = await response.json(); if (!response.ok) throw new Error(data?.error || 'Could not review timesheet.'); return data;
  },
  completeMarketplaceContract: async (contractId: string) => {
    const token = getAuthToken(); const response = await fetch(`${API_BASE_URL}/contracts/${contractId}/complete`, { method: 'POST', headers: { Authorization: `Bearer ${token}` } }); const data = await response.json(); if (!response.ok) throw new Error(data?.error || 'Could not complete contract.'); return hydrateMarketplaceContract(data);
  },
  createMembershipInvoice: async (plan: 'professional' | 'skills' | 'business') => {
    const token = getAuthToken(); const response = await fetch(`${API_BASE_URL}/membership/invoices`, { method: 'POST', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` }, body: JSON.stringify({ plan }) }); const data = await response.json(); if (!response.ok) throw new Error(data?.error || 'Could not create membership invoice.'); return data;
  },
  createMembershipCheckout: async (plan: 'professional' | 'skills' | 'business') => {
    const token=getAuthToken();const response=await fetch(`${API_BASE_URL}/membership/checkout`,{method:'POST',headers:{'Content-Type':'application/json',Authorization:`Bearer ${token}`},body:JSON.stringify({plan})});const data=await response.json();if(!response.ok)throw new Error(data?.error||'Could not start secure membership checkout.');return data as {invoice:any;checkoutUrl:string};
  },
  getEngineerValidations: async (engineerId: string) => {
    const token=getAuthToken(); if(!token) return []; const response=await fetch(`${API_BASE_URL}/trust/engineers/${engineerId}/validations`,{headers:{Authorization:`Bearer ${token}`}}); return response.ok ? response.json() : [];
  },
  validateCompletedAssignment: async (contractId: string, validation: Record<string, unknown>) => {
    const token=getAuthToken(); const response=await fetch(`${API_BASE_URL}/trust/contracts/${contractId}/validation`,{method:'POST',headers:{'Content-Type':'application/json',Authorization:`Bearer ${token}`},body:JSON.stringify(validation)}); const data=await response.json(); if(!response.ok) throw new Error(data?.error||'Could not save validation.'); return data;
  },
  getTalentPool: async () => {
    const token=getAuthToken(); if(!token) return []; const response=await fetch(`${API_BASE_URL}/trust/talent-pool`,{headers:{Authorization:`Bearer ${token}`}}); return response.ok ? response.json() : [];
  },
  saveTalentPoolEntry: async (engineerId: string, entry: Record<string, unknown>) => {
    const token=getAuthToken(); const response=await fetch(`${API_BASE_URL}/trust/talent-pool/${engineerId}`,{method:'PUT',headers:{'Content-Type':'application/json',Authorization:`Bearer ${token}`},body:JSON.stringify(entry)}); const data=await response.json(); if(!response.ok) throw new Error(data?.error||'Could not update talent pool.'); return data;
  },
  removeTalentPoolEntry: async (engineerId: string) => {
    const token=getAuthToken(); const response=await fetch(`${API_BASE_URL}/trust/talent-pool/${engineerId}`,{method:'DELETE',headers:{Authorization:`Bearer ${token}`}}); if(!response.ok&&response.status!==404) throw new Error('Could not remove talent-pool entry.');
  },
  confirmAvailability: async (availability: Record<string, unknown>) => {
    const token=getAuthToken(); const response=await fetch(`${API_BASE_URL}/users/me/availability`,{method:'PUT',headers:{'Content-Type':'application/json',Authorization:`Bearer ${token}`},body:JSON.stringify(availability)}); const data=await response.json(); if(!response.ok) throw new Error(data?.error||'Could not confirm availability.'); return data;
  },
  getTechnicalWorkPack: async (contractId:string) => { const token=getAuthToken(); const response=await fetch(`${API_BASE_URL}/trust/contracts/${contractId}/work-pack`,{headers:{Authorization:`Bearer ${token}`}}); if(response.status===404)return null; const data=await response.json(); if(!response.ok)throw new Error(data?.error||'Could not load work pack.'); return data; },
  saveTechnicalWorkPack: async (contractId:string,pack:Record<string,unknown>) => { const token=getAuthToken(); const response=await fetch(`${API_BASE_URL}/trust/contracts/${contractId}/work-pack`,{method:'PUT',headers:{'Content-Type':'application/json',Authorization:`Bearer ${token}`},body:JSON.stringify(pack)}); const data=await response.json(); if(!response.ok)throw new Error(data?.error||'Could not save work pack.'); return data; },
  getProjectTeams: async () => { const token=getAuthToken(); const response=await fetch(`${API_BASE_URL}/trust/teams`,{headers:{Authorization:`Bearer ${token}`}}); const data=await response.json(); if(!response.ok)throw new Error(data?.error||'Could not load project teams.'); return data; },
  createProjectTeam: async (team:Record<string,unknown>) => { const token=getAuthToken(); const response=await fetch(`${API_BASE_URL}/trust/teams`,{method:'POST',headers:{'Content-Type':'application/json',Authorization:`Bearer ${token}`},body:JSON.stringify(team)}); const data=await response.json(); if(!response.ok)throw new Error(data?.error||'Could not save project team.'); return data; },
  getWorkforceInsights: async () => { const token=getAuthToken(); const response=await fetch(`${API_BASE_URL}/trust/insights`,{headers:{Authorization:`Bearer ${token}`}}); const data=await response.json(); if(!response.ok)throw new Error(data?.error||'Could not load workforce insights.'); return data; },
  getCompanyAudit: async () => { const token=getAuthToken(); const response=await fetch(`${API_BASE_URL}/trust/audit`,{headers:{Authorization:`Bearer ${token}`}}); const data=await response.json(); if(!response.ok)throw new Error(data?.error||'Could not load audit history.'); return data; },
  getContractContact: async (contractId:string) => { const token=getAuthToken(); const response=await fetch(`${API_BASE_URL}/contracts/${contractId}/contacts`,{headers:{Authorization:`Bearer ${token}`}}); const data=await response.json(); if(!response.ok)throw new Error(data?.error||'Could not load contract contact.'); return data; },
};

export default apiService;
