import { MOCK_ENGINEERS, MOCK_COMPANIES, MOCK_JOBS, MOCK_APPLICATIONS, MOCK_REVIEWS, MOCK_CONVERSATIONS, MOCK_MESSAGES, MOCK_CONTRACTS, MOCK_TRANSACTIONS, MOCK_PROJECTS, ALL_MOCK_USERS, MOCK_FORUM_POSTS, MOCK_FORUM_COMMENTS, MOCK_NOTIFICATIONS, MOCK_COLLABORATION_POSTS, MOCK_INVOICES } from '../data/mockData';
import { MOCK_RESOURCING_COMPANY_1, MOCK_ADMIN_PROFILE, MOCK_FREE_ENGINEER, MOCK_ENGINEER_STEVE } from '../data/modules/mockStaticProfiles';
import { ApplicationStatus, EngineerProfile, ProfileTier, Role, User, Contract, ContractStatus, MilestoneStatus, Timesheet, TimesheetStatus, PaymentTerms, Invoice, InvoiceStatus, Conversation, Message, ForumPost, Notification, CollaborationPost, CompanyProfile, ResourcingCompanyProfile, Job, Discipline, Currency, Country, ExperienceLevel } from '../types';
import { secureFetch } from './httpClient';
import { API_BASE_URL } from './apiConfig';

// --- API Service ---
// Account creation, login and profile updates now call the real backend
// (see backend/API_SPECIFICATION.md and backend/src). Everything else
// below is still an in-memory simulation of a backend API - jobs,
// contracts, messaging, invoicing etc still reset on refresh. That's the
// next phase of work, not this one.

const simulateDelay = (ms: number = 500) => new Promise(res => setTimeout(res, ms));

export type AdminDeletionRequest = {
  id: string;
  userId: string;
  status: 'pending' | 'approved' | 'rejected' | 'cancelled';
  requestedAt: string;
  reviewedAt: string | null;
  reviewerId: string | null;
  resolutionNote: string | null;
  processedAt: string | null;
  processorId: string | null;
  accountEmail: string;
  accountName: string;
  accountRole: string;
  eligibility: {
    eligible: boolean;
    blockers: Array<{ code: string; count: number; message: string }>;
  };
};

export type AdminPrivacySummary = {
  pending: number;
  approved: number;
  rejected: number;
  processed: number;
  overduePending: number;
  oldestPendingAt: string | null;
};

export type AccountDeletionStatus = {
  status: string;
  requestedAt: string;
  cancelledAt: string | null;
  reviewedAt: string | null;
  resolutionNote: string | null;
  processedAt: string | null;
};

const TOKEN_KEY = 'techsubbies_auth_token';
const fetch = secureFetch;
let cookieSessionAvailable = false;

export function getAuthToken(): string | null {
  return cookieSessionAvailable ? "cookie-session" : null;
}

function saveAuthToken(_token?: string) {
  cookieSessionAvailable = true;
  try {
    window.localStorage.removeItem(TOKEN_KEY);
  } catch {
    // no-op
  }
}

export function clearAuthToken() {
  cookieSessionAvailable = false;
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
  saveAuthToken();
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
  saveAuthToken();
  return data.user as User;
}

const apiService = {
  // --- DATA FETCHING ---
  getInitialData: async () => {
    await simulateDelay();
    // In a real app, this would be multiple API calls (e.g., /users, /jobs, etc.)
    // Jobs actually posted to the real backend (see postJob above) are
    // merged in alongside the demo/mock jobs, so anyone who's posted a real
    // job sees it here too. Falls back to just the mock list if the
    // backend isn't reachable.
    const backendJobs = await apiService.getBackendJobs();
    const mergedJobs = [...backendJobs, ...MOCK_JOBS.filter(j => !backendJobs.some(b => b.id === j.id))];
    // Contracts/invoices are only fetched if there's a saved backend session
    // (see getBackendContracts/getBackendInvoices below) - merged in
    // alongside the demo data the same way jobs are, so a real, signed-in
    // account sees its actual contracts on top of the mock ones.
    const backendContracts = await apiService.getBackendContracts();
    const mergedContracts = [...backendContracts, ...MOCK_CONTRACTS.filter(c => !backendContracts.some(b => b.id === c.id))];
    const backendInvoices = await apiService.getBackendInvoices();
    const mergedInvoices = [...backendInvoices, ...MOCK_INVOICES.filter(i => !backendInvoices.some(b => b.id === i.id))];
    // Conversations/messages follow the same "only if there's a saved
    // session" shape - and since a conversation's full history is small,
    // it's pulled in alongside the conversation list itself rather than
    // needing a separate lazy-load step (see getBackendConversations/
    // getBackendMessagesForConversation below).
    const backendConversations = await apiService.getBackendConversations();
    const mergedConversations = [...backendConversations, ...MOCK_CONVERSATIONS.filter(c => !backendConversations.some(b => b.id === c.id))];
    const backendMessageLists = await Promise.all(
      backendConversations.map(c => apiService.getBackendMessagesForConversation(c.id))
    );
    const backendMessages = backendMessageLists.flatMap(list => list ?? []);
    const mergedMessages = [...backendMessages, ...MOCK_MESSAGES.filter(m => !backendMessages.some(b => b.id === m.id))];
    return {
      engineers: [...MOCK_ENGINEERS, MOCK_ENGINEER_STEVE, MOCK_FREE_ENGINEER],
      companies: [...MOCK_COMPANIES, MOCK_RESOURCING_COMPANY_1],
      jobs: mergedJobs,
      applications: MOCK_APPLICATIONS,
      reviews: MOCK_REVIEWS,
      allUsers: ALL_MOCK_USERS,
      conversations: mergedConversations,
      messages: mergedMessages,
      contracts: mergedContracts,
      transactions: MOCK_TRANSACTIONS,
      projects: MOCK_PROJECTS,
      forumPosts: MOCK_FORUM_POSTS,
      forumComments: MOCK_FORUM_COMMENTS,
      notifications: MOCK_NOTIFICATIONS,
      collaborationPosts: MOCK_COLLABORATION_POSTS,
      invoices: mergedInvoices,
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

  logoutSession: async (): Promise<void> => {
    try {
      await fetch(`${API_BASE_URL}/auth/logout`, { method: 'POST' });
    } finally {
      clearAuthToken();
    }
  },

  requestPasswordReset: async (email: string): Promise<void> => {
    const response = await fetch(`${API_BASE_URL}/auth/password-reset/request`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }),
    });
    if (!response.ok) throw new Error('Could not request a password reset.');
  },

  confirmPasswordReset: async (token: string, newPassword: string): Promise<void> => {
    const response = await fetch(`${API_BASE_URL}/auth/password-reset/confirm`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token, newPassword }),
    });
    const data = response.status === 204 ? null : await response.json();
    if (!response.ok) throw new Error(data?.error || 'Could not reset the password.');
  },

  confirmEmailVerification: async (token: string): Promise<void> => {
    const response = await fetch(`${API_BASE_URL}/auth/verification/confirm`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token }),
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data?.error || 'Could not verify the email address.');
  },

  resendEmailVerification: async (): Promise<void> => {
    const response = await fetch(`${API_BASE_URL}/auth/verification/request`, { method: 'POST' });
    if (!response.ok && response.status !== 204) {
      const data = await response.json();
      throw new Error(data?.error || 'Could not resend the verification email.');
    }
  },

  changePassword: async (currentPassword: string, newPassword: string): Promise<void> => {
    const response = await fetch(`${API_BASE_URL}/auth/password/change`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ currentPassword, newPassword }),
    });
    const data = response.status === 204 ? null : await response.json();
    if (!response.ok) throw new Error(data?.error || 'Could not change the password.');
    clearAuthToken();
  },

  listSecurityEvents: async (): Promise<Array<{
    id: string;
    eventType: string;
    outcome: string;
    createdAt: string;
  }>> => {
    const response = await fetch(`${API_BASE_URL}/auth/security-events`);
    const data = await response.json();
    if (!response.ok) throw new Error(data?.error || 'Could not load security activity.');
    return data.events;
  },

  revokeAllSessions: async (): Promise<void> => {
    const response = await fetch(`${API_BASE_URL}/auth/sessions/revoke-all`, { method: 'POST' });
    if (!response.ok) {
      const data = await response.json();
      throw new Error(data?.error || 'Could not sign out all devices.');
    }
    clearAuthToken();
  },

  exportMyAccountData: async (): Promise<unknown> => {
    const response = await fetch(`${API_BASE_URL}/users/me/export`);
    const data = await response.json();
    if (!response.ok) throw new Error(data?.error || 'Could not export account data.');
    return data;
  },

  getDeletionRequest: async (): Promise<AccountDeletionStatus | null> => {
    const response = await fetch(`${API_BASE_URL}/users/me/deletion-request`);
    const data = await response.json();
    if (!response.ok) throw new Error(data?.error || 'Could not load deletion request.');
    return data.request;
  },

  requestAccountDeletion: async (password: string): Promise<AccountDeletionStatus> => {
    const response = await fetch(`${API_BASE_URL}/users/me/deletion-request`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password }),
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data?.error || 'Could not request account deletion.');
    return data.request;
  },

  cancelAccountDeletion: async (): Promise<AccountDeletionStatus> => {
    const response = await fetch(`${API_BASE_URL}/users/me/deletion-request`, { method: 'DELETE' });
    const data = await response.json();
    if (!response.ok) throw new Error(data?.error || 'Could not cancel account deletion.');
    return data.request;
  },

  listAdminDeletionRequests: async (
    status: AdminDeletionRequest['status'] = 'pending'
  ): Promise<AdminDeletionRequest[]> => {
    const response = await fetch(`${API_BASE_URL}/admin/deletion-requests?status=${encodeURIComponent(status)}`);
    const data = await response.json();
    if (!response.ok) throw new Error(data?.error || 'Could not load privacy requests.');
    return data.requests;
  },

  getAdminPrivacySummary: async (): Promise<AdminPrivacySummary> => {
    const response = await fetch(`${API_BASE_URL}/admin/privacy-summary`);
    const data = await response.json();
    if (!response.ok) throw new Error(data?.error || 'Could not load privacy operations summary.');
    return data.summary;
  },

  reviewAdminDeletionRequest: async (
    requestId: string,
    decision: 'approved' | 'rejected',
    note: string
  ): Promise<AdminDeletionRequest> => {
    const response = await fetch(`${API_BASE_URL}/admin/deletion-requests/${requestId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ decision, note }),
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data?.error || 'Could not review privacy request.');
    return data.request;
  },

  processAdminDeletionRequest: async (requestId: string, confirmation: string): Promise<AdminDeletionRequest> => {
    const response = await fetch(`${API_BASE_URL}/admin/deletion-requests/${requestId}/process`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ confirmation }),
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data?.error || 'Could not process privacy request.');
    return data.request;
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

  // Restore identity only after the backend validates the signed token.
  getCurrentUserFromToken: async (): Promise<User | null> => {
    try {
      const response = await fetch(`${API_BASE_URL}/users/me`);
      if (!response.ok) {
        if (response.status === 401) clearAuthToken();
        return null;
      }
      saveAuthToken();
      return (await response.json()) as User;
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
  
  // Posts a job on the real backend (see backend/src/routes/jobs.ts) so it's
  // actually saved and visible to other users hitting the same backend.
  // Falls back to the old in-memory mock if there's no signed-in backend
  // session, or the backend simply can't be reached - same pattern as
  // createEngineer/createCompany above.
  postJob: async (jobData: any): Promise<Job> => {
    const token = getAuthToken();
    if (token) {
      try {
        const response = await fetch(`${API_BASE_URL}/jobs`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
          body: JSON.stringify(jobData),
        });
        const data = await response.json();
        if (!response.ok) {
          throw new Error(data?.error || 'Could not post job.');
        }
        return data as Job;
      } catch (error: any) {
        if (!isNetworkError(error)) throw error;
        // Backend unreachable - fall through to the mock below.
      }
    }

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

  // Submits the application on the real backend (see
  // backend/src/routes/jobs.ts POST /:jobId/apply) so it persists and the
  // posting company can see it. Falls back to the old in-memory mock the
  // same way postJob does above.
  applyForJob: async (jobId: string, engineerId: string) => {
    const token = getAuthToken();
    if (token) {
      try {
        const response = await fetch(`${API_BASE_URL}/jobs/${jobId}/apply`, {
          method: 'POST',
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await response.json();
        if (!response.ok) {
          throw new Error(data?.error || 'Could not submit application.');
        }
        return data;
      } catch (error: any) {
        if (!isNetworkError(error)) throw error;
        // Backend unreachable - fall through to the mock below.
      }
    }

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

  // Lists jobs posted on the real backend, so they can be merged into the
  // demo/mock job list on load (see getInitialData above). Returns an
  // empty list rather than throwing if the backend can't be reached, since
  // callers treat the mock data as the baseline either way.
  getBackendJobs: async (): Promise<Job[]> => {
    try {
      const response = await fetch(`${API_BASE_URL}/jobs`);
      if (!response.ok) return [];
      return (await response.json()) as Job[];
    } catch {
      return [];
    }
  },

  // --- CONTRACTS, MILESTONES, TIMESHEETS & INVOICES ---
  // Mirrors backend/src/routes/contracts.ts. Each of these tries the real
  // backend first when there's a signed-in session (a saved token). If
  // there's no session, or the backend can't be reached, they resolve to
  // `null` rather than throwing - callers treat `null` as "no real backend
  // to reconcile with, keep the optimistic local update as final", the
  // same fallback shape used throughout this file.

  createContract: async (contract: Contract): Promise<Contract> => {
    const token = getAuthToken();
    if (token) {
      try {
        const response = await fetch(`${API_BASE_URL}/contracts`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
          body: JSON.stringify({
            jobId: contract.jobId,
            engineerId: contract.engineerId,
            jobTitle: contract.jobTitle,
            type: contract.type,
            description: contract.description,
            amount: contract.amount,
            currency: contract.currency,
            milestones: contract.milestones.map(({ status, ...m }) => m),
            supervisionOverrideReason: contract.supervisionOverrideReason,
          }),
        });
        const data = await response.json();
        if (!response.ok) throw new Error(data?.error || 'Could not create contract.');
        return data as Contract;
      } catch (error: any) {
        if (!isNetworkError(error)) throw error;
        // Backend unreachable - fall through to the locally-built contract below.
      }
    }

    await simulateDelay(200);
    return contract;
  },

  signContract: async (contractId: string, signatureName: string): Promise<Contract | null> => {
    const token = getAuthToken();
    if (token) {
      try {
        const response = await fetch(`${API_BASE_URL}/contracts/${contractId}/sign`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
          body: JSON.stringify({ signatureName }),
        });
        const data = await response.json();
        if (!response.ok) throw new Error(data?.error || 'Could not save your signature.');
        return data as Contract;
      } catch (error: any) {
        if (!isNetworkError(error)) throw error;
      }
    }
    await simulateDelay(200);
    return null;
  },

  fundMilestone: async (contractId: string, milestoneId: string): Promise<Contract | null> => {
    const token = getAuthToken();
    if (token) {
      try {
        const response = await fetch(`${API_BASE_URL}/contracts/${contractId}/milestones/${milestoneId}/fund`, {
          method: 'PATCH',
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await response.json();
        if (!response.ok) throw new Error(data?.error || 'Could not fund milestone.');
        return data as Contract;
      } catch (error: any) {
        if (!isNetworkError(error)) throw error;
      }
    }
    await simulateDelay(200);
    return null;
  },

  submitMilestoneForApproval: async (contractId: string, milestoneId: string): Promise<Contract | null> => {
    const token = getAuthToken();
    if (token) {
      try {
        const response = await fetch(`${API_BASE_URL}/contracts/${contractId}/milestones/${milestoneId}/submit`, {
          method: 'PATCH',
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await response.json();
        if (!response.ok) throw new Error(data?.error || 'Could not submit milestone for approval.');
        return data as Contract;
      } catch (error: any) {
        if (!isNetworkError(error)) throw error;
      }
    }
    await simulateDelay(200);
    return null;
  },

  approveMilestone: async (contractId: string, milestoneId: string): Promise<Contract | null> => {
    const token = getAuthToken();
    if (token) {
      try {
        const response = await fetch(`${API_BASE_URL}/contracts/${contractId}/milestones/${milestoneId}/approve`, {
          method: 'PATCH',
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await response.json();
        if (!response.ok) throw new Error(data?.error || 'Could not approve milestone.');
        return data as Contract;
      } catch (error: any) {
        if (!isNetworkError(error)) throw error;
      }
    }
    await simulateDelay(200);
    return null;
  },

  submitTimesheet: async (
    contractId: string,
    timesheetData: { period: string; days: number }
  ): Promise<Contract | null> => {
    const token = getAuthToken();
    if (token) {
      try {
        const response = await fetch(`${API_BASE_URL}/contracts/${contractId}/timesheets`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
          body: JSON.stringify(timesheetData),
        });
        const data = await response.json();
        if (!response.ok) throw new Error(data?.error || 'Could not submit timesheet.');
        return data as Contract;
      } catch (error: any) {
        if (!isNetworkError(error)) throw error;
      }
    }
    await simulateDelay(200);
    return null;
  },

  approveTimesheet: async (contractId: string, timesheetId: string): Promise<Contract | null> => {
    const token = getAuthToken();
    if (token) {
      try {
        const response = await fetch(`${API_BASE_URL}/contracts/${contractId}/timesheets/${timesheetId}/approve`, {
          method: 'PATCH',
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await response.json();
        if (!response.ok) throw new Error(data?.error || 'Could not approve timesheet.');
        return data as Contract;
      } catch (error: any) {
        if (!isNetworkError(error)) throw error;
      }
    }
    await simulateDelay(200);
    return null;
  },

  generateInvoice: async (contractId: string, paymentTerms: PaymentTerms): Promise<Invoice | null> => {
    const token = getAuthToken();
    if (token) {
      try {
        const response = await fetch(`${API_BASE_URL}/contracts/${contractId}/invoices`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
          body: JSON.stringify({ paymentTerms }),
        });
        const data = await response.json();
        if (!response.ok) throw new Error(data?.error || 'Could not generate invoice.');
        return data as Invoice;
      } catch (error: any) {
        if (!isNetworkError(error)) throw error;
      }
    }
    await simulateDelay(200);
    return null;
  },

  // Lists contracts/invoices belonging to the signed-in user on the real
  // backend, so they can be merged into the demo/mock lists on load (see
  // getInitialData above). Returns an empty list (rather than throwing) if
  // there's no session or the backend can't be reached.
  getBackendContracts: async (): Promise<Contract[]> => {
    const token = getAuthToken();
    if (!token) return [];
    try {
      const response = await fetch(`${API_BASE_URL}/contracts/me`, { headers: { Authorization: `Bearer ${token}` } });
      if (!response.ok) return [];
      return (await response.json()) as Contract[];
    } catch {
      return [];
    }
  },

  getBackendInvoices: async (): Promise<Invoice[]> => {
    const token = getAuthToken();
    if (!token) return [];
    try {
      const response = await fetch(`${API_BASE_URL}/invoices/me`, { headers: { Authorization: `Bearer ${token}` } });
      if (!response.ok) return [];
      return (await response.json()) as Invoice[];
    } catch {
      return [];
    }
  },

  // --- CONVERSATIONS & MESSAGES ---
  // Mirrors backend/src/routes/conversations.ts. There's no WebSocket
  // server here, so "real-time" is done by short polling (see
  // getBackendMessagesForConversation, called on an interval from
  // components/ChatWindow.tsx) rather than a persistent push connection -
  // simple, and it fits the same request/response backend as everything
  // else in this file.

  // Starts a conversation with another user, or returns the existing one
  // if they already have one (see the "find first" step context/
  // InteractionContext.tsx already does against local state before even
  // calling this). Falls back to `null` (no session/unreachable - caller
  // keeps its optimistic local conversation) rather than throwing.
  startOrGetConversation: async (otherUserId: string): Promise<Conversation | null> => {
    const token = getAuthToken();
    if (token) {
      try {
        const response = await fetch(`${API_BASE_URL}/conversations`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
          body: JSON.stringify({ otherUserId }),
        });
        const data = await response.json();
        if (!response.ok) throw new Error(data?.error || 'Could not start conversation.');
        return data as Conversation;
      } catch (error: any) {
        if (!isNetworkError(error)) throw error;
      }
    }
    await simulateDelay(200);
    return null;
  },

  sendMessage: async (conversationId: string, text: string): Promise<Message | null> => {
    const token = getAuthToken();
    if (token) {
      try {
        const response = await fetch(`${API_BASE_URL}/conversations/${conversationId}/messages`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
          body: JSON.stringify({ text }),
        });
        const data = await response.json();
        if (!response.ok) throw new Error(data?.error || 'Could not send message.');
        return data as Message;
      } catch (error: any) {
        if (!isNetworkError(error)) throw error;
      }
    }
    await simulateDelay(200);
    return null;
  },

  // Lists conversations belonging to the signed-in user, so they can be
  // merged into the demo/mock list on load (see getInitialData above).
  // Empty array (not an error) when there's no session or the backend
  // can't be reached, same as getBackendJobs/getBackendContracts.
  getBackendConversations: async (): Promise<Conversation[]> => {
    const token = getAuthToken();
    if (!token) return [];
    try {
      const response = await fetch(`${API_BASE_URL}/conversations/me`, { headers: { Authorization: `Bearer ${token}` } });
      if (!response.ok) return [];
      return (await response.json()) as Conversation[];
    } catch {
      return [];
    }
  },

  // Fetches the full message history for one conversation. Returns `null`
  // (rather than an empty array) when there's no session or the backend
  // can't be reached, so callers can tell "genuinely no messages yet" apart
  // from "couldn't check" and avoid wiping out locally-held messages by
  // mistake - see refreshConversationMessages in InteractionContext.tsx.
  getBackendMessagesForConversation: async (conversationId: string): Promise<Message[] | null> => {
    const token = getAuthToken();
    if (!token) return null;
    try {
      const response = await fetch(`${API_BASE_URL}/conversations/${conversationId}/messages`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!response.ok) return null;
      return (await response.json()) as Message[];
    } catch {
      return null;
    }
  },
};

export default apiService;
