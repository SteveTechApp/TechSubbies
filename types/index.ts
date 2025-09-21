// --- Enums ---

export enum Page {
  LANDING = 'landing',
  LOGIN = 'login',
  ENGINEER_SIGNUP = 'engineerSignUp',
  COMPANY_SIGNUP = 'companySignUp',
  RESOURCING_SIGNUP = 'resourcingSignUp',
  ENGINEER_DASHBOARD = 'engineerDashboard',
  COMPANY_DASHBOARD = 'companyDashboard',
  FOR_ENGINEERS = 'forEngineers',
  FOR_COMPANIES = 'forCompanies',
  FOR_RESOURCING = 'forResourcing',
  ABOUT_US = 'aboutUs',
  INVESTORS = 'investors',
  PRICING = 'pricing',
  LEGAL = 'legal',
  ACCESSIBILITY = 'accessibility',
  HELP = 'help',
  TUTORIALS = 'tutorials',
}

export enum Role {
  ENGINEER = 'Engineer',
  COMPANY = 'Company',
  RESOURCING_COMPANY = 'Resourcing Company',
  ADMIN = 'Admin',
}

export enum ProfileTier {
  BASIC = 'Bronze',
  PROFESSIONAL = 'Silver', // For AISkillDiscovery, TrainingRecommendations
  SKILLS = 'Gold',       // For applying to all jobs, AI tools
  BUSINESS = 'Platinum',     // For multi-user accounts
}

export enum Currency {
  GBP = '£',
  USD = '$',
}

export enum Country {
    UK = 'United Kingdom',
    US = 'United States',
}

export enum Discipline {
    AV = 'AV Engineer',
    IT = 'IT Engineer',
    BOTH = 'AV & IT Engineer',
    SALES = 'Sales Engineer'
}

export enum ExperienceLevel {
    JUNIOR = 'Junior',
    MID_LEVEL = 'Mid-level',
    SENIOR = 'Senior',
    EXPERT = 'Expert',
}

export enum JobType {
    CONTRACT = 'Contract',
    PERMANENT = 'Permanent',
}

export enum ApplicationStatus {
    APPLIED = 'Applied',
    VIEWED = 'Viewed',
    OFFERED = 'Offered',
    HIRED = 'Hired',
    REJECTED = 'Rejected',
    COMPLETED = 'Completed',
}

export enum ContractStatus {
    DRAFT = 'Draft',
    PENDING_SIGNATURE = 'Pending Signature',
    SIGNED = 'Signed by Engineer',
    ACTIVE = 'Active',
    COMPLETED = 'Completed',
    CANCELLED = 'Cancelled',
}

export enum ContractType {
    SOW = 'Statement of Work',
    DAY_RATE = 'Day Rate',
}

export enum MilestoneStatus {
    AWAITING_FUNDING = 'Awaiting Funding',
    FUNDED_IN_PROGRESS = 'In Progress',
    SUBMITTED_FOR_APPROVAL = 'Submitted for Approval',
    APPROVED_PENDING_INVOICE = 'Approved - Pending Invoice',
    COMPLETED_PAID = 'Completed & Paid',
}

export enum TimesheetStatus {
    SUBMITTED = 'submitted',
    APPROVED = 'approved',
    PAID = 'paid',
}

export enum InvoiceStatus {
    DRAFT = 'Draft',
    SENT = 'Sent',
    PAID = 'Paid',
    OVERDUE = 'Overdue',
}

export enum PaymentTerms {
    NET14 = 'Net 14 Days',
    NET30 = 'Net 30 Days',
    NET60 = 'Net 60 Days',
}

export enum NotificationType {
    MESSAGE = 'message',
    NEW_JOB_MATCH = 'new_job_match',
    JOB_OFFER = 'job_offer',
    CONTRACT_UPDATE = 'contract_update',
}

export enum Language {
    ENGLISH = 'English',
    FRENCH = 'French',
    SPANISH = 'Spanish',
}

export enum SkillImportance {
    ESSENTIAL = 'essential',
    DESIRABLE = 'desirable',
}


// --- Core Interfaces ---
// FIX: Added missing Certification and Document type definitions.
export interface Document {
    id: string;
    name: string;
    url: string;
    verified: boolean;
}

export interface Certification {
    name: string;
    verified: boolean;
    documents?: Document[];
}

export interface UserProfile {
    id: string;
    name: string;
    avatar: string;
    role: Role;
    status: 'active' | 'inactive' | 'suspended';
    location: string;
    website?: string;
    contact: {
        name?: string;
        email: string;
        phone?: string;
        linkedin?: string;
        website?: string;
    };
}

export interface EngineerProfile extends UserProfile {
    discipline: Discipline;
    country: Country;
    description: string;
    experience: number;
    experienceLevel: ExperienceLevel;
    profileTier: ProfileTier;
    minDayRate: number;
    maxDayRate: number;
    currency: Currency;
    availability: Date;
    selectedJobRoles?: SelectedJobRole[]; // Detailed skills profiles
    cv?: {
        fileName: string;
        fileUrl: string;
        isSearchable: boolean;
    };
    certifications?: Certification[];
    compliance: Partial<Compliance>;
    identity: Partial<IdentityVerification>;
    profileViews: number;
    searchAppearances: number;
    jobInvites: number;
    reputation: number;
    complianceScore: number;
    calendarSyncUrl: string;
    badges: Badge[];
    platformCredits: number;
    loyaltyPoints: number;
    referralCode?: string;
    isBoosted?: boolean;
    hasReceivedCompletionBonus?: boolean;
    lastMonthlyCreditDate?: Date;
    jobDigestOptIn?: boolean;
    jobAlertsEnabled?: boolean;
    resourcingCompanyId?: string;
    caseStudies?: CaseStudy[];
    matchScore?: number;
}

export interface CompanyProfile extends UserProfile {
    logo?: string;
    consentToFeature?: boolean;
    regNumber?: string;
}

export interface ResourcingCompanyProfile extends CompanyProfile {
    managedEngineerIds: string[];
}

export interface AdminProfile extends UserProfile {
    permissions: string[];
}

export interface User {
    id: string;
    role: Role;
    profile: EngineerProfile | CompanyProfile | ResourcingCompanyProfile | AdminProfile;
}

// --- Skills & Roles ---

export interface Skill {
    name: string;
    rating: number;
}

export interface RatedSkill extends Skill {}

export interface SelectedJobRole {
    roleName: string;
    skills: RatedSkill[];
    overallScore: number;
}

export interface JobRoleDefinition {
    name: string;
    category: string;
    skillCategories: {
        category: string;
        skills: { name: string; description: string }[];
    }[];
}


// --- Jobs & Applications ---

export interface JobSkillRequirement {
    name: string;
    importance: SkillImportance;
}

export interface Job {
    id: string;
    companyId: string;
    title: string;
    description: string;
    location: string;
    dayRate: string;
    duration: string;
    currency: Currency;
    startDate: Date | null;
    postedDate: Date;
    jobType: JobType;
    experienceLevel: ExperienceLevel;
    jobRole: string;
    skillRequirements: JobSkillRequirement[];
    status: 'active' | 'closed' | 'filled';
}

export interface Application {
    jobId: string;
    engineerId: string;
    date: Date;
    status: ApplicationStatus;
    reviewed: boolean;
    isFeatured?: boolean;
}

// --- Interactions ---

export interface Review {
    id: string;
    jobId: string;
    companyId: string;
    engineerId: string;
    peerRating: number; // Renamed from technicalRating
    customerRating: number; // Renamed from communicationRating
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
}

// --- Contracts & Payments ---

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
    companyId: string;
    engineerId: string;
    jobTitle?: string;
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

export enum TransactionType {
    SUBSCRIPTION = 'subscription',
    ESCROW_FUNDING = 'escrow_funding',
    PAYOUT = 'payout',
    PLATFORM_FEE = 'platform_fee',
    PLATFORM_CREDIT_PURCHASE = 'platform_credit_purchase',
    AI_DEEP_DIVE_PURCHASE = 'ai_deep_dive_purchase',
}

export interface Transaction {
    id: string;
    userId: string;
    contractId?: string;
    type: TransactionType;
    description: string;
    amount: number; // Negative for debits, positive for credits
    date: Date;
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
    items: InvoiceItem[];
    total: number;
    issueDate: Date;
    dueDate: Date;
    status: InvoiceStatus;
}


// --- Other ---
export interface ProjectRole {
    id: string;
    title: string;
    discipline: Discipline;
    startDate: Date;
    endDate: Date;
    assignedEngineerId: string | null;
    phase?: string; // Add phase for grouping in timeline
}

export interface Project {
    id: string;
    companyId: string;
    name: string;
    description: string;
    status: 'planning' | 'active' | 'completed';
    roles: ProjectRole[];
}

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

export interface Notification {
    id: string;
    userId: string;
    type: NotificationType;
    text: string;
    link: string;
    isRead: boolean;
    timestamp: Date;
}

export interface CollaborationPost {
    id: string;
    postedByEngineerId: string;
    title: string;
    description: string;
    location: string;
    rate: string;
    currency: Currency;
    duration: string;
    startDate: Date;
    postedDate: Date;
    status: 'open' | 'closed';
}

export interface Badge {
    id: string;
    name: string;
    description: string;
    icon: React.ComponentType<any>;
    color: string;
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

export interface StoryboardPanelData {
    id: number;
    image: string | null;
    description: string;
    notes1: string;
    notes2: string;
}

export interface CaseStudy {
    id: string;
    name: string;
    url: string;
    panels?: StoryboardPanelData[];
}

export interface Compliance {
    professionalIndemnity: { hasCoverage: boolean, isVerified: boolean, amount?: number, certificateUrl?: string };
    publicLiability: { hasCoverage: boolean, isVerified: boolean, amount?: number, certificateUrl?: string };
    siteSafe: boolean;
    cscsCard: boolean;
    ownPPE: boolean;
    hasOwnTransport: boolean;
    hasOwnTools: boolean;
    powerToolCompetency: number;
    accessEquipmentTrained: number;
    firstAidTrained: boolean;
    carriesSpares: boolean;
}

export interface IdentityVerification {
    documentType: 'passport' | 'drivers_license' | 'none';
    documentUrl?: string;
    isVerified: boolean;
}

// --- Product & Sales Engineering ---

export interface IOPort {
    count: number;
    type: string;
}

export interface ProductFeatures {
    maxResolution: string;
    ioPorts: {
        inputs: IOPort[];
        outputs: IOPort[];
    };
    keyFeatures: string[];
    idealApplication: string;
}

export interface Product {
    sku: string;
    name: string;
    description: string;
    category: string;
    subCategory: string;
    matchScore?: number;
}
