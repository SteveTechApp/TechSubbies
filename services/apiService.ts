import { MOCK_ENGINEERS, MOCK_COMPANIES, MOCK_JOBS, MOCK_APPLICATIONS, MOCK_REVIEWS, MOCK_CONVERSATIONS, MOCK_MESSAGES, MOCK_CONTRACTS, MOCK_TRANSACTIONS, MOCK_PROJECTS, ALL_MOCK_USERS, MOCK_FORUM_POSTS, MOCK_FORUM_COMMENTS, MOCK_NOTIFICATIONS, MOCK_COLLABORATION_POSTS, MOCK_INVOICES } from '../data/mockData';
import { MOCK_RESOURCING_COMPANY_1, MOCK_ADMIN_PROFILE, MOCK_FREE_ENGINEER, MOCK_ENGINEER_STEVE } from '../data/modules/mockStaticProfiles';
import { ApplicationStatus, EngineerProfile, ProfileTier, Role, User, ContractStatus, MilestoneStatus, Timesheet, TimesheetStatus, PaymentTerms, InvoiceStatus, ForumPost, Notification, CollaborationPost, CompanyProfile, ResourcingCompanyProfile, Job, Discipline, Currency, Country, ExperienceLevel } from '../types';

// --- API Service Simulation ---
// This service mimics a real backend API. All functions are async and return promises.
// It includes error simulation to test frontend error handling.

const simulateDelay = (ms: number = 500) => new Promise(res => setTimeout(res, ms));

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

  // FIX: Added missing user creation and profile update methods
  // --- USER CREATION ---
  createEngineer: async (data: any): Promise<User> => {
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
  },

  createCompany: async (data: any): Promise<User> => {
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
  },
  
  createResourcingCompany: async (data: any): Promise<User> => {
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