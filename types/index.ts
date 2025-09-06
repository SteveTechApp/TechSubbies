import { Chat } from "@google/genai";

// --- ENUMS ---

export enum Role {
    ENGINEER = 'Engineer',
    COMPANY = 'Company',
    RESOURCING_COMPANY = 'Resourcing Company',
    ADMIN = 'Admin'
}

export enum ProfileTier {
    BASIC = 'Bronze',
    PROFESSIONAL = 'Silver',
    SKILLS = 'Gold',
    BUSINESS = 'Platinum'
}

export enum Discipline {
    AV = 'AV Engineer',
    IT = 'IT Engineer',
    BOTH = 'AV & IT Engineer'
}

export enum Currency {
    GBP = '£',
    USD = '$',
    EUR = '€'
}

export enum Language {
    ENGLISH = 'English',
    SPANISH = 'Spanish',
    FRENCH = 'French',
    GERMAN = 'German'
}

export enum Country {
    UK = 'United Kingdom',
    USA = 'United States',
    IRELAND = 'Ireland',
    GERMANY = 'Germany',
    FRANCE = 'France'
}

export enum ExperienceLevel {
    JUNIOR = 'Junior',
    MID_LEVEL = 'Mid-level',
    SENIOR = 'Senior',
    EXPERT = 'Expert'
}

export enum JobType {
    CONTRACT = 'Contract',
    PERMANENT = 'Permanent',
    TEMP_TO_PERM = 'Temp-to-Perm'
}

export enum ApplicationStatus {
    APPLIED = 'Applied',
    OFFERED = 'Offered',
    ACCEPTED = 'Accepted',
    REJECTED = 'Rejected',
    COMPLETED = 'Completed'
}

export enum ContractStatus {
    DRAFT = 'Draft',
    PENDING_SIGNATURE = 'Pending Signature',
    SIGNED = 'Signed by Engineer',
    ACTIVE = 'Active',
    COMPLETED = 'Completed',
    CANCELLED = 'Cancelled'
}

export enum ContractType {
    SOW = 'Statement of Work',
    DAY_RATE = 'Day Rate'
}

export enum MilestoneStatus {
    AWAITING_FUNDING = 'Awaiting Funding',
    FUNDED_IN_PROGRESS = 'In Progress',
    SUBMITTED_FOR_APPROVAL = 'Submitted for Approval',
    APPROVED_PENDING_INVOICE = 'Approved - Pending Invoice',
    COMPLETED_PAID = 'Paid'
}

export enum TimesheetStatus {
    SUBMITTED = 'submitted',
    APPROVED = 'approved',
    PAID = 'paid',
}

export enum TransactionType {
    SUBSCRIPTION = 'Subscription',
    ESCROW_FUNDING = 'Escrow Funding',
    PAYOUT = 'Payout',
    PLATFORM_FEE = 'Platform Fee',
    BOOST_PURCHASE = 'Boost Purchase',
    SUPERCHARGE = 'Supercharge Application',
    AD_REVENUE = 'Ad Revenue',
    INVOICE_PAYMENT = 'Invoice Payment'
}

export enum NotificationType {
    MESSAGE = 'Message',
    JOB_OFFER = 'Job Offer',
    NEW_JOB_MATCH = 'New Job Match',
    CONTRACT_UPDATE = 'Contract Update',
    JOB_ALERT = 'Job Alert',
}

export enum PaymentTerms {
    IMMEDIATE = 'Due Immediately',
    NET7 = 'Net 7',
    NET14 = 'Net 14',
    NET30 = 'Net 30',
}

export enum InvoiceStatus {
    DRAFT = 'Draft',
    SENT = 'Sent',
    PAID = 'Paid',
    OVERDUE = 'Overdue',
    DISPUTED = 'Disputed'
}

// --- PROFILES & USERS ---

export interface BaseProfile {
    id: string;
    name: string;
    avatar: string;
    status: 'active' | 'inactive' | 'suspended';
    language: Language;
    currency: Currency;
    country: Country;
    location: string;
    warnings: number;
    isBanned: boolean;
    banEndDate?: string;
    banHistory: { date: string; duration: number }[];
}

export interface EngineerProfile extends BaseProfile {
    description: string;
    discipline: Discipline;
    experience: number;
    profileTier: ProfileTier;
    minDayRate: number;
    maxDayRate: number;
    availability: Date;
    skills: Skill[] | null;
    selectedJobRoles?: SelectedJobRole[];
    certifications: Certification[];
    compliance: Compliance;
    identity: IdentityVerification;
    caseStudies?: CaseStudy[];
    socials?: SocialLink[];
    isBoosted?: boolean;
    joinDate: Date;
    profileViews: number;
    searchAppearances: number;
    jobInvites: number;
    reputation: number;
    complianceScore: number;
    subscriptionEndDate?: Date;
    securityNetCreditsUsed?: number;
    calendarSyncUrl?: string;
    resourcingCompanyId?: string; 
    jobDigestOptIn?: boolean;
    jobAlertsEnabled?: boolean;
    matchScore?: number; 
    badges: Badge[];
    contact: {
        email: string;
        phone: string;
        website?: string;
        linkedin?: string;
    };
}

export interface CompanyProfile extends BaseProfile {
    website: string;
    contact: { email: string; phone: string; };
    logo: string;
    consentToFeature: boolean;
}

export type UserProfile = EngineerProfile | CompanyProfile;

export interface User {
    id: string;
    role: Role;
    profile: UserProfile;
}

// --- PROFILE SUB-TYPES ---

export interface Skill {
    name: string;
    rating: number; // 1-100
}

export interface RatedSkill {
    name: string;
    rating: number;
}

export interface SelectedJobRole {
    roleName: string;
    skills: RatedSkill[];
    overallScore: number;
}

export interface Certification {
    name: string;
    verified: boolean;
}

export interface Compliance {
    professionalIndemnity: { hasCoverage: boolean; isVerified: boolean; amount: number; certificateUrl?: string; };
    publicLiability: { hasCoverage: boolean; isVerified: boolean; amount: number; certificateUrl?: string; };
    siteSafe: boolean;
    cscsCard: boolean;
    ownPPE: boolean;
    hasOwnTransport: boolean;
    hasOwnTools: boolean;
    powerToolCompetency: number; // 0-100
    accessEquipmentTrained: number; // 0-100
    firstAidTrained: boolean;
    carriesSpares: boolean;
}

export interface IdentityVerification {
    documentType: 'passport' | 'drivers_license' | 'none';
    isVerified: boolean;
    documentUrl?: string;
}

export interface CaseStudy {
    id: string;
    name: string;
    url: string;
}

export interface SocialLink {
    name: string;
    url: string;
}

export interface Badge {
    id: string;
    name: string;
    description: string;
    icon: React.ComponentType<any>;
    color: string;
    condition: (profile: EngineerProfile, context: ConditionContext) => boolean;
}

export interface ConditionContext {
    completedContracts: number;
    forumScore: number;
}


// --- JOBS & APPLICATIONS ---

export interface JobSkillRequirement {
    name: string;
    importance: SkillImportance;
}

export type SkillImportance = 'essential' | 'desirable';

export interface Job {
    id: string;
    companyId: string;
    title: string;
    description: string;
    location: string;
    dayRate: string;
    currency: Currency;
    duration: string;
    postedDate: Date;
    startDate: Date | null;
    status: 'active' | 'inactive' | 'completed';
    jobType: JobType;
    experienceLevel: ExperienceLevel;
    jobRole: string;
    skillRequirements: JobSkillRequirement[];
}

export interface Application {
    jobId: string;
    engineerId: string;
    date: Date;
    status: ApplicationStatus;
    reviewed: boolean;
    isSupercharged?: boolean;
}

// --- INTERACTIONS ---

export interface Review {
    id: string;
    jobId: string;
    companyId: string;
    engineerId: string;
    peerRating: number;
    customerRating: number;
    comment: string;
    date: Date;
}

export interface Conversation {
    id: string;
    participantIds: string[];
    lastMessageTimestamp: Date;
    lastMessageText: string;
}

export interface Message {
    id: string;
    conversationId: string;
    senderId: string;
    text: string;
    timestamp: Date;
    isRead: boolean;
    originalText?: string;
}

export interface Notification {
    id: string;
    userId: string;
    type: NotificationType;
    text: string;
    link?: string; 
    isRead: boolean;
    timestamp: Date;
}


// --- CONTRACTS & PAYMENTS ---
export interface Signature {
    name: string;
    date: Date;
}

export interface Milestone {
    id: string;
    description: string;
    amount: number;
    status: MilestoneStatus;
}

export interface Timesheet {
    id: string;
    contractId: string;
    engineerId: string;
    period: string;
    days: number;
    status: TimesheetStatus;
}

export interface Contract {
    id: string;
    jobId: string;
    jobTitle?: string;
    companyId: string;
    engineerId: string;
    type: ContractType;
    description: string;
    amount: number | string;
    currency: Currency;
    status: ContractStatus;
    engineerSignature: Signature | null;
    companySignature: Signature | null;
    milestones: Milestone[];
    timesheets?: Timesheet[];
}

export interface Transaction {
    id: string;
    userId: string;
    type: TransactionType;
    description: string;
    amount: number;
    date: Date;
    contractId?: string;
}

export interface InvoiceItem {
    description: string;
    amount: number;
}
export interface Invoice {
    id: string;
    contractId: string;
    companyId: string;
    engineerId: string;
    issueDate: Date;
    dueDate: Date;
    items: InvoiceItem[];
    total: number;
    status: InvoiceStatus;
    paymentTerms: PaymentTerms;
}

// --- PLATFORM & APP ---

export type Page = 'landing' | 'forEngineers' | 'forCompanies' | 'pricing' | 'investors' | 'aboutUs' | 'login' | 'engineerSignUp' | 'companySignUp' | 'resourcingCompanySignUp' | 'helpCenter' | 'terms' | 'privacy' | 'security';

export interface JobRoleDefinition {
    name: string;
    category: string;
    skillCategories: {
        category: string;
        skills: { name: string; description: string }[];
    }[];
}

export interface TrainingProvider {
    name: string;
    url: string;
    specialties: string[];
    type: 'Manufacturer' | 'Industry Standard' | 'Sponsored';
}

export interface Insight {
    type: 'Upskill' | 'Certification' | 'Profile Enhancement';
    suggestion: string;
    callToAction: {
        text: string;
        view: string;
    };
}

// --- PROJECT MANAGEMENT ---

export interface ProjectRole {
    id: string;
    title: string;
    discipline: Discipline;
    startDate: Date;
    endDate: Date;
    assignedEngineerId: string | null;
    phase?: string;
}
export interface Project {
    id: string;
    companyId: string;
    name: string;
    description: string;
    status: 'planning' | 'in-progress' | 'completed';
    roles: ProjectRole[];
}

// --- FORUM ---
export interface ForumPost {
    id: string;
    authorId: string;
    title: string;
    content: string;
    tags: string[];
    timestamp: Date;
    upvotes: number;
    downvotes: number;
    status: 'pending' | 'approved' | 'rejected';
}

export interface ForumComment {
    id: string;
    postId: string;
    authorId: string;
    parentId: string | null;
    content: string;
    timestamp: Date;
    upvotes: number;
    downvotes: number;
}


// --- App Context ---
export interface AppContextType {
    user: User | null;
    login: (user: User) => void;
    logout: () => void;
    engineers: EngineerProfile[];
    companies: CompanyProfile[];
    allUsers: User[];
    jobs: Job[];
    applications: Application[];
    reviews: Review[];
    conversations: Conversation[];
    messages: Message[];
    contracts: Contract[];
    transactions: Transaction[];
    forumPosts: ForumPost[];
    forumComments: ForumComment[];
    notifications: Notification[];
    projects: Project[];
    invoices: Invoice[];
    selectedConversationId: string | null;
    setSelectedConversationId: (id: string | null) => void;
    sendMessage: (conversationId: string, text: string) => void;
    startConversationAndNavigate: (otherPartyProfileId: string, navigate: () => void) => void;
    isAiReplying: boolean;
    findUserById: (userId: string) => User | undefined;
    findUserByProfileId: (profileId: string) => User | undefined;
    updateEngineerProfile: (updatedProfile: Partial<EngineerProfile>) => void;
    updateCompanyProfile: (updatedProfile: Partial<CompanyProfile>) => void;
    startTrial: () => void;
    boostProfile: () => void;
    purchaseDayPass: () => void;
    claimSecurityNetGuarantee: () => void;
    upgradeSubscription: (profileId: string, newTier: ProfileTier) => void;
    reactivateProfile: () => void;
    toggleUserStatus: (profileId: string) => void;
    toggleJobStatus: (jobId: string) => void;
    postJob: (jobData: any) => Job | null;
    applyForJob: (jobId: string, engineerId?: string, isSupercharged?: boolean) => void;
    superchargeApplication: (job: Job) => void;
    acceptOffer: (jobId: string, engineerId: string) => void;
    declineOffer: (jobId: string, engineerId: string) => void;
    submitReview: (reviewData: Omit<Review, 'id' | 'date'>) => void;
    sendContractForSignature: (contract: Contract) => void;
    signContract: (contractId: string, signatureName: string) => void;
    fundMilestone: (contractId: string, milestoneId: string) => void;
    submitMilestoneForApproval: (contractId: string, milestoneId: string) => void;
    approveMilestone: (contractId: string, milestoneId: string) => void;
    submitTimesheet: (contractId: string, timesheetData: Omit<Timesheet, 'id' | 'contractId' | 'engineerId' | 'status'>) => void;
    approveTimesheet: (contractId: string, timesheetId: string) => void;
    payInvoice: (invoiceId: string) => void;
    reportUser: (profileId: string) => void;
    generateInvoice: (contractId: string, paymentTerms: PaymentTerms) => void;
    createAndLoginEngineer: (formData: any) => void;
    createAndLoginCompany: (formData: any) => void;
    createAndLoginResourcingCompany: (formData: any) => void;
    inviteEngineerToJob: (jobId: string, engineerId: string) => void;
    assignEngineerToProjectRole: (projectId: string, roleId: string, engineerId: string) => void;
    createForumPost: (postData: Omit<ForumPost, 'id' | 'authorId' | 'timestamp' | 'upvotes' | 'downvotes' | 'status'>) => Promise<void>;
    addForumComment: (commentData: Omit<ForumComment, 'id' | 'authorId' | 'timestamp' | 'upvotes' | 'downvotes'>) => void;
    voteOnPost: (postId: string, vote: 'up' | 'down') => void;
    voteOnComment: (commentId: string, vote: 'up' | 'down') => void;
    markNotificationsAsRead: (userId: string) => void;
    chatSession: Chat | null;
    currentPageContext: string;
    setCurrentPageContext: (context: string) => void;
    geminiService: any;
    isPremium: (profile: EngineerProfile) => boolean;
    getCareerCoaching: () => Promise<{ insights?: Insight[]; error?: string; }>;
    language: Language;
    setLanguage: (lang: Language) => void;
    currency: Currency;
    setCurrency: (curr: Currency) => void;
    t: (key: string, options?: any) => string;
    getRegionalPrice: (basePriceGBP: number) => { amount: number, symbol: string };
}