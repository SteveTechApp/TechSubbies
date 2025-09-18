// --- ENUMS ---

export enum Role {
    ENGINEER = 'Engineer',
    COMPANY = 'Company',
    RESOURCING_COMPANY = 'Resourcing Company',
    ADMIN = 'Admin'
}

// FIX: Added missing page types to the enum to resolve navigation errors across the application.
export enum Page {
    LANDING = 'landing',
    LOGIN = 'login',
    ENGINEER_SIGNUP = 'engineerSignUp',
    COMPANY_SIGNUP = 'companySignUp',
    RESOURCING_SIGNUP = 'resourcingCompanySignUp',
    ENGINEER_DASHBOARD = 'engineerDashboard',
    COMPANY_DASHBOARD = 'companyDashboard',
    FOR_ENGINEERS = 'forEngineers',
    FOR_COMPANIES = 'forCompanies',
    FOR_RESOURCING = 'forResourcingCompanies',
    PRICING = 'pricing',
    ABOUT_US = 'aboutUs',
    INVESTORS = 'investors',
    TUTORIALS = 'tutorials',
    HELP = 'help',
    LEGAL = 'legal',
    ACCESSIBILITY = 'accessibility',
    HOW_IT_WORKS = 'how-it-works',
}

export enum ProfileTier {
    BASIC = 'Bronze',
    PROFESSIONAL = 'Silver',
    SKILLS = 'Gold',
    BUSINESS = 'Platinum',
}

export enum Currency {
    GBP = 'GBP',
    USD = 'USD',
    EUR = 'EUR',
}

export enum Discipline {
    AV = 'AV Engineer',
    IT = 'IT Engineer',
    BOTH = 'AV & IT Engineer',
    SALES = 'Sales Engineer'
}

export enum Country {
    UK = 'United Kingdom',
    USA = 'United States',
    IRELAND = 'Ireland',
}

export enum ExperienceLevel {
    JUNIOR = 'Junior (0-2 years)',
    MID_LEVEL = 'Mid-level (2-5 years)',
    SENIOR = 'Senior (5-10 years)',
    EXPERT = 'Expert (10+ years)',
}

export enum ApplicationStatus {
    APPLIED = 'Applied',
    VIEWED = 'Viewed',
    SHORTLISTED = 'Shortlisted',
    OFFERED = 'Offered',
    ACCEPTED = 'Accepted',
    DECLINED = 'Declined',
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
    FUNDED_IN_PROGRESS = 'Funded & In Progress',
    SUBMITTED_FOR_APPROVAL = 'Submitted for Approval',
    APPROVED_PENDING_INVOICE = 'Approved - Pending Invoice',
    COMPLETED_PAID = 'Completed & Paid',
}

export enum TimesheetStatus {
    SUBMITTED = 'submitted',
    APPROVED = 'approved',
    PAID = 'paid',
    REJECTED = 'rejected',
}

export enum NotificationType {
    NEW_JOB_MATCH = 'NEW_JOB_MATCH',
    JOB_OFFER = 'JOB_OFFER',
    MESSAGE = 'MESSAGE',
    CONTRACT_UPDATE = 'CONTRACT_UPDATE',
}

export enum TransactionType {
    SUBSCRIPTION = 'Subscription',
    PLATFORM_FEE = 'Platform Fee',
    ESCROW_FUNDING = 'Escrow Funding',
    PAYOUT = 'Payout',
    PLATFORM_CREDIT_PURCHASE = 'Platform Credit Purchase',
    AI_DEEP_DIVE_PURCHASE = 'AI Deep Dive Purchase',
}

export enum PaymentTerms {
    NET14 = 'Net 14 Days',
    NET30 = 'Net 30 Days',
    UPON_RECEIPT = 'Due Upon Receipt',
}

export enum InvoiceStatus {
    DRAFT = 'Draft',
    SENT = 'Sent',
    PAID = 'Paid',
    OVERDUE = 'Overdue',
    DISPUTED = 'Disputed',
}

export enum Language {
    ENGLISH = 'English',
    FRENCH = 'French',
    SPANISH = 'Spanish',
}

export enum JobType {
    CONTRACT = 'Contract',
    PERMANENT = 'Permanent',
}

export enum SkillImportance {
    ESSENTIAL = 'essential',
    DESIRABLE = 'desirable',
}


// --- INTERFACES & TYPES ---

export interface Skill {
    name: string;
    rating: number;
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

export interface JobSkillRequirement {
    name: string;
    importance: SkillImportance;
}

export interface CertificationDocument {
    id: string;
    name: string;
    url: string;
    verified: boolean;
}

export interface Certification {
    name: string;
    verified: boolean;
    documents?: CertificationDocument[];
}

export interface Compliance {
    professionalIndemnity: { hasCoverage: boolean; amount?: number; isVerified: boolean; certificateUrl?: string };
    publicLiability: { hasCoverage: boolean; amount?: number; isVerified: boolean; certificateUrl?: string };
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

export interface CaseStudy {
    id: string;
    name: string;
    url: string;
    panels?: StoryboardPanelData[];
}

export interface StoryboardPanelData {
    id: number;
    image: string | null;
    description: string;
    notes1: string;
    notes2: string;
}

export interface Badge {
    id: string;
    name: string;
    description: string;
    icon: React.ComponentType<any>;
    color: string;
}

export interface UserProfile {
    id: string;
    name: string;
    avatar: string;
    role: Role;
    status: 'active' | 'inactive';
    location: string;
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
    skills?: Skill[];
    selectedJobRoles?: SelectedJobRole[];
    cv?: { fileName: string; fileUrl: string; isSearchable: boolean };
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
    contact: { email: string; phone?: string; website?: string; linkedin?: string };
    platformCredits: number;
    loyaltyPoints: number;
    referralCode?: string;
    hasReceivedCompletionBonus?: boolean;
    lastMonthlyCreditDate?: Date;
    isBoosted?: boolean;
    matchScore?: number;
    caseStudies?: CaseStudy[];
    resourcingCompanyId?: string;
    // FIX: Added missing properties to satisfy type checks in SettingsView.
    jobDigestOptIn?: boolean;
    jobAlertsEnabled?: boolean;
}

export interface CompanyProfile extends UserProfile {
    website: string;
    logo?: string;
    consentToFeature?: boolean;
    contact: { name: string; email: string; };
}

export interface ResourcingCompanyProfile extends CompanyProfile {
    managedEngineerIds: string[];
}

export interface AdminProfile extends UserProfile {
    permissions: ('all' | string)[];
}

export interface User {
    id: string;
    role: Role;
    profile: EngineerProfile | CompanyProfile | ResourcingCompanyProfile | AdminProfile;
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
    status: 'active' | 'inactive' | 'filled';
}

export interface Application {
    jobId: string;
    engineerId: string;
    date: Date;
    status: ApplicationStatus;
    reviewed: boolean;
    isFeatured?: boolean;
}

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
    type: ContractType;
    description: string;
    amount: number | string;
    currency: Currency;
    status: ContractStatus;
    engineerSignature: { name: string; date: Date } | null;
    companySignature: { name: string; date: Date } | null;
    milestones: Milestone[];
    timesheets?: Timesheet[];
    jobTitle?: string;
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

export interface ProjectRole {
    id: string;
    title: string;
    discipline: Discipline;
    startDate: Date;
    endDate: Date;
    assignedEngineerId: string | null;
}

export interface Project {
    id: string;
    companyId: string;
    name: string;
    description: string;
    status: 'planning' | 'in-progress' | 'completed';
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

export interface JobRoleDefinition {
    name: string;
    category: string;
    skillCategories: {
        category: string;
        skills: {
            name: string;
            description: string;
        }[];
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

export interface Product {
    sku: string;
    name: string;
    description: string;
    category: string;
    subCategory: string;
    matchScore?: number;
}

export interface IOPort {
    type: string;
    count: number;
}

export interface ProductFeatures {
    maxResolution: string;
    ioPorts: {
        inputs: IOPort[];
        outputs: IOPort[];
    };
    controlMethods: string[];
    keyFeatures: string[];
    idealApplication: string;
}

export interface AiProductMatch {
    sku: string;
    match_score: number;
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