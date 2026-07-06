import { MOCK_ENGINEERS, MOCK_COMPANIES, MOCK_JOBS, MOCK_APPLICATIONS, MOCK_REVIEWS, MOCK_CONVERSATIONS, MOCK_MESSAGES, MOCK_CONTRACTS, MOCK_TRANSACTIONS, MOCK_PROJECTS, ALL_MOCK_USERS, MOCK_FORUM_POSTS, MOCK_FORUM_COMMENTS, MOCK_NOTIFICATIONS, MOCK_COLLABORATION_POSTS, MOCK_INVOICES } from '../data/mockData';
import { MOCK_RESOURCING_COMPANY_1, MOCK_ADMIN_PROFILE, MOCK_FREE_ENGINEER, MOCK_ENGINEER_STEVE } from '../data/modules/mockStaticProfiles';
import { ApplicationStatus, EngineerProfile, ProfileTier, Role, User, ContractStatus, MilestoneStatus, Timesheet, TimesheetStatus, PaymentTerms, InvoiceStatus, ForumPost, Notification, CollaborationPost, CompanyProfile, ResourcingCompanyProfile, Job, Discipline, Currency, Country, ExperienceLevel } from '../types';

// --- API Service ---
// Account creation, login and profile updates now call the real backend
// (see backend/API_SPECIFICATION.md and backend/src). Everything else
// below is still an in-memory simulation of a backend API - jobs,
// contracts, messaging, invoicing etc still reset on refresh. That's the
// next phase of work, not this one.

const simulateDelay = (ms: number = 500) => new Promise(res => setTimeout(res, ms));

const API_BASE_URL = (typeof process !== 'undefined' && (process as any).env?.API_BASE_URL) || 'http://localhost:4000/api';
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
  // --- DATA FETCHING ---
  getInitialData: async () => {
    await simulateDelay();
    // In a real app, this would be multiple API calls (e.g., /users, /jobs, etc.)
    return {
      engineers: [...MOCK_ENGINEERS, MOCK_ENGINEER_STEVE, MOCK_FREE_ENGINEER],
      companies: [...MOCK_COMPANIES, MOCK_RESOURCING_COMPANY_1],
      jobs: MOCK_JOBS,
      applications: MOCK_APPLICATIONS,
      reviews: MOCK_REVIEWS,
      allUsers: ALL_MOCK_USERS,
      conversations: MOCK_CONVERSATIONS,
      messages: MOCK_MESSAGES,
      contracts: MOCK_CONTRACTS,
      transactions: MOCK_TRANSACTIONS,
      projects: MOCK_PROJECTS,
      forumPosts: MOCK_FORUM_POSTS,
      forumComments: MOCK_FORUM_COMMENTS,
      notifications: MOCK_NOTIFICATIONS,
      collaborationPosts: MOCK_COLLABORATION_POSTS,
      invoices: MOCK_INVOICES,
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
      const payloadSegment = token.split('.')[1];
      const payload = JSON.parse(atob(payloadSegment.replace(/-/g, '+').replace(/_/g, '/')));
      if (!payload?.sub) return null;
      return await apiService.getUserById(payload.sub);
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
        },
      });
    } catch (error: any) {
      if (!isNetworkError(error)) throw error;

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
  getPresignedUploadUrl: async (fileName: string, fileType: string): Promise<{ uploadUrl: string, fileUrl: string }> => {
    await simulateDelay(300);
    // This simulates the backend generating a secure, temporary URL for a direct client-to-S3 upload.
    const uniqueId = `${Date.now()}-${fileName}`;
    const uploadUrl = `https://mock-s3-bucket.com/uploads/${uniqueId}?signature=secure-token`;
    const fileUrl = `https://cdn.wingman.com/uploads/${uniqueId}`; // The final, public URL
    return { uploadUrl, fileUrl };
  },

  confirmFileUpload: async (fileUrl: string, context: { entityId: string, documentType: string }): Promise<{ success: boolean }> => {
    await simulateDelay(200);
    // This simulates the client notifying the backend that the upload to S3 is complete,
    // so the backend can link the fileUrl to the correct database entity (e.g., user profile, certification).
    console.log(`Backend confirmed upload for ${fileUrl} for ${context.entityId}`);
    return { success: true };
  },

  // --- E-SIGNATURE ---
  createSignatureSession: async (contractId: string, signerProfileId: string): Promise<{ signingUrl: string }> => {
    await simulateDelay();
    // Backend would integrate with DocuSign/HelloSign here and return an embedded signing URL.
    return { signingUrl: `/mock-embedded-signing-page?contract=${contractId}&signer=${signerProfileId}` };
  },
  
  // --- OTHER "WRITE" OPERATIONS ---
  
  updateEngineerProfile: async (profileId: string, profileData: Partial<EngineerProfile>): Promise<EngineerProfile> => {
    await simulateDelay();
    const engineer = MOCK_ENGINEERS.find(e => e.id === profileId) || MOCK_ENGINEER_STEVE;
    if (!engineer) throw new Error("Engineer not found");
    Object.assign(engineer, profileData);
    return { ...engineer }; // Return a copy to simulate fresh data from API
  },
  
  updateCompanyProfile: async (profileId: string, profileData: Partial<CompanyProfile>): Promise<CompanyProfile> => {
      await simulateDelay();
      const company = MOCK_COMPANIES.find(c => c.id === profileId);
      if (!company) throw new Error("Company not found");
      Object.assign(company, profileData);
      return { ...company };
  },
  
  postJob: async (jobData: any): Promise<Job> => {
    await simulateDelay();
    const newJob: Job = {
      ...jobData,
      id: `job-${Date.now()}`,
      postedDate: new Date(),
      status: 'active',
    };
    MOCK_JOBS.unshift(newJob);
    return newJob;
  },

  // ... other "write" operations would follow the same async/Promise pattern
  // For brevity, we'll keep the existing synchronous mocks for less critical functions
  // but a full implementation would convert all of these.

   applyForJob: async (jobId: string, engineerId: string) => {
    const newApplication = {
      jobId,
      engineerId,
      date: new Date(),
      status: ApplicationStatus.APPLIED,
      reviewed: false,
    };
    MOCK_APPLICATIONS.push(newApplication);
    return newApplication;
  },
};

export default apiService;
