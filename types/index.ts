import type { Chat } from '@google/genai';
import type { Dispatch, SetStateAction } from 'react';
import { geminiService } from '../services/geminiService.ts';

// --- Type definition for our AI service ---
export type GeminiServiceType = typeof geminiService;

// --- Enums and Interfaces ---
export enum Role {
    ENGINEER = 'engineer',
    COMPANY = 'company',
    RESOURCING_COMPANY = 'resourcing_company',
    ADMIN = 'admin',
}

export enum Currency {
    GBP = '£',
    USD = '$',
}

export enum Discipline {
    AV = 'AV Engineer',
    IT = 'IT Engineer',
    BOTH = 'AV & IT Engineer',
}

export enum JobType {
    CONTRACT = 'Contract',
    FULL_TIME = 'Full-time',
    PART_TIME = 'Part-time',
}

export enum ExperienceLevel {
    JUNIOR = 'Junior',
    MID_LEVEL = 'Mid-level',
    SENIOR = 'Senior',
    EXPERT = 'Expert',
}

export enum ProfileTier {
    BASIC = 'BASIC',
    PROFESSIONAL = 'PROFESSIONAL',
    SKILLS = 'SKILLS',
    BUSINESS = 'BUSINESS',
}


export interface Skill {
    name: string;
    rating: number; // 0-100 (represents general proficiency for basic skills)
}

export interface RatedSkill {
    name:string;
    rating: number; // 1-100
}

export interface SelectedJobRole {
    roleName: string;
    skills: RatedSkill[];
    overallScore: number;
}

export interface JobRoleDefinition {
  name: string;
  category: 'Audio Visual & Media Technology' | 
    'Software Development' |
    'Networking & Infrastructure' |
    'Cybersecurity' |
    'Database Administration' |
    'Project Management & Leadership';
  skillCategories: {
    category: string;
    skills: { name: string; description: string; }[];
  }[];
}

export interface Certification {
    name: string;
    verified: boolean;
}

export interface Contact {
    email: string;
    telephone?: string;
    phone: string; // Mobile
    website: string;
    linkedin: string;
}

export interface SocialLink {
    name: string;
    url: string;
}

export interface Associate {
    name: string;
    value: string;
    url?: string;
}

export interface CaseStudy {
    id: string; // Added for easier management
    name: string;
    url: string;
}

export interface InsuranceDetail {
    hasCoverage: boolean;
    amount?: number;
    certificateUrl?: string;
    isVerified: boolean;
}

export interface Compliance {
    professionalIndemnity: InsuranceDetail;
    publicLiability: InsuranceDetail;
    siteSafe: boolean; // Site safety certifications like SSSTS
    cscsCard: boolean; // CSCS Card
    ownPPE: boolean;
    hasOwnTransport: boolean;
    hasOwnTools: boolean;
    powerToolCompetency: number; // 0-100 rating
    accessEquipmentTrained: number; // 0-100 rating
    firstAidTrained: boolean;
    carriesSpares: boolean; // Carries spares and consumables
}

export interface IdentityVerification {
    documentType: 'passport' | 'drivers_license' | 'none';
    documentUrl?: string;
    isVerified: boolean;
}

interface BaseProfile {
    id: string;
    name: string;
    avatar: string;
    status: 'active' | 'suspended' | 'inactive';
}

// FIX: Added ConditionContext type for badge logic
export type ConditionContext = {
    completedContracts: number;
    forumScore: number;
};

export interface Badge {
    id: string;
    name: string;
    description: string;
    icon: React.ComponentType<any>;
    color: string;
    // FIX: Added condition property to Badge type
    condition: (profile: EngineerProfile, context: ConditionContext) => boolean;
}

export interface EngineerProfile extends BaseProfile {
    discipline: Discipline;
    location: string;
    currency: Currency;
    minDayRate: number;
    maxDayRate: number;
    experience: number; // years
    availability: Date;
    description: string;
    skills?: Skill[]; // Basic skills/tags for paid tier only
    selectedJobRoles?: SelectedJobRole[]; // Detailed skills for paid tier
    certifications: Certification[];
    contact: Contact;
    profileTier: ProfileTier;
    resourcingCompanyId?: string; // ID of the managing resourcing company
    trialEndDate?: Date; // NEW: For managing Skills Profile trials
    subscriptionEndDate?: Date; // NEW: For Security Net Guarantee
    securityNetCreditsUsed?: number; // NEW: For Security Net Guarantee
    jobDigestOptIn?: boolean; // NEW: For personalized job digests
    title?: string;
    firstName: string;
    middleName?: string;
    surname: string;
    companyName?: string;
    travelRadius?: string;
    socials?: SocialLink[];
    associates?: Associate[];
    compliance: Compliance;
    identity: IdentityVerification;
    generalAvailability?: string; // e.g., 'Medium'
    customerRating?: number; // 1-5
    peerRating?: number; // 1-5
    googleCalendarLink?: string;
    caseStudies?: CaseStudy[];
    otherLinks?: SocialLink[];
    rightColumnLinks?: { label: string, value: string, url: string }[];
    isBoosted?: boolean;
    boostEndDate?: Date;
    profileViews: number;
    searchAppearances: number;
    jobInvites: number;
    calendarSyncUrl?: string;
    matchScore?: number;
    joinDate: Date;
    badges: Badge[];
}


export interface CompanyProfile extends BaseProfile {
    website?: string;
    consentToFeature?: boolean;
    logo?: string;
    companyRegNumber?: string;
    isVerified?: boolean;
}

export type UserProfile = EngineerProfile | CompanyProfile;

export interface User {
    id: string;
    role: Role;
    profile: UserProfile;
}

export type SkillImportance = 'desirable' | 'essential';

export interface JobSkillRequirement {
    name: string;
    importance: SkillImportance;
}

export interface Job {
    id:string;
    companyId: string; // This is a profile ID
    title: string;
    description: string;
    location: string;
    dayRate: string;
    currency: Currency;
    duration: string;
    postedDate: Date;
    startDate: Date | null;
    status: 'active' | 'inactive';
    jobType: JobType;
    experienceLevel: ExperienceLevel;
    jobRole: string; // The selected JobRoleDefinition name
    skillRequirements?: JobSkillRequirement[];
}

export enum ApplicationStatus {
    APPLIED = 'Applied',
    VIEWED = 'Viewed',
    OFFERED = 'Offered',
    ACCEPTED = 'Accepted',
    DECLINED = 'Declined',
    COMPLETED = 'Completed',
}

export interface Application {
    jobId: string;
    engineerId: string;
    date: Date;
    status: ApplicationStatus;
    reviewed?: boolean;
}

export interface Review {
    id: string;
    jobId: string;
    companyId: string;
    engineerId: string;
    peerRating: number; // Technical skill
    customerRating: number; // Communication
    comment: string;
    date: Date;
}

export interface TrainingProvider {
    name: string;
    url: string;
    specialties: string[]; // e.g., ['Crestron', 'Cisco', 'AWS']
}

export interface Message {
    id: string;
    conversationId: string;
    senderId: string; // user.id
    text: string;
    timestamp: Date;
    isRead: boolean;
}

export interface Conversation {
    id: string;
    participantIds: string[]; // array of user.id
    lastMessageTimestamp: Date;
    lastMessageText: string;
}

export enum NotificationType {
    NEW_JOB_MATCH = 'new_job_match',
    JOB_OFFER = 'job_offer',
    MESSAGE = 'message',
    APPLICATION_UPDATE = 'application_update',
    JOB_INVITE = 'job_invite',
}

export interface Notification {
    id: string;
    userId: string;
    type: NotificationType;
    text: string;
    link?: string; // e.g., path to job or message view
    isRead: boolean;
    timestamp: Date;
}

// --- NEW: Forum Types ---
export interface ForumPost {
    id: string;
    authorId: string; // user.id
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
    authorId: string; // user.id
    parentId: string | null; // For nested comments
    content: string;
    timestamp: Date;
    upvotes: number;
    downvotes: number;
}

// --- NEW: Contract, Milestone, Timesheet, and Transaction Types ---
export enum ContractType {
    SOW = 'Statement of Work',
    DAY_RATE = 'Day Rate Agreement',
}

export enum ContractStatus {
    DRAFT = 'Draft',
    PENDING_SIGNATURE = 'Pending Signature',
    SIGNED = 'Signed by Engineer',
    ACTIVE = 'Active',
    COMPLETED = 'Completed',
    CANCELLED = 'Cancelled',
}

export enum MilestoneStatus {
    AWAITING_FUNDING = 'Awaiting Funding',
    FUNDED_IN_PROGRESS = 'Funded & In Progress',
    SUBMITTED_FOR_APPROVAL = 'Submitted for Approval',
    COMPLETED_PAID = 'Completed & Paid',
}

export enum TransactionType {
    SUBSCRIPTION = 'Subscription',
    BOOST_PURCHASE = 'Boost Purchase',
    ESCROW_FUNDING = 'Escrow Funding',
    PAYOUT = 'Payout',
    PLATFORM_FEE = 'Platform Fee',
}

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
    period: string; // e.g., "Week ending 2024-08-02"
    days: number;
    status: 'submitted' | 'approved' | 'paid';
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
    engineerSignature: Signature | null;
    companySignature: Signature | null;
    milestones: Milestone[];
    timesheets?: Timesheet[];
    jobTitle?: string;
}

export interface Transaction {
    id: string;
    userId: string; // User this transaction belongs to
    contractId?: string;
    type: TransactionType;
    description: string;
    amount: number; // Positive for income, negative for expense
    date: Date;
}

// --- NEW: Project Planner Types ---
export interface ProjectRole {
  id: string;
  title: string;
  discipline: Discipline;
  startDate: Date;
  endDate: Date;
  assignedEngineerId: string | null;
  hotelCovered?: boolean;
  travelCovered?: boolean;
  mealsCovered?: boolean;
}

export interface Project {
  id: string;
  companyId: string;
  name: string;
  description: string;
  roles: ProjectRole[];
  status: 'planning' | 'active' | 'completed';
}


export type Page = 'landing' | 'login' | 'forEngineers' | 'forCompanies' | 'engineerSignUp' | 'companySignUp' | 'resourcingCompanySignUp' | 'investors' | 'aboutUs' | 'terms' | 'privacy' | 'pricing' | 'howItWorks' | 'userGuide' | 'security';

export interface AppContextType {
    user: User | null;
    allUsers: User[];
    jobs: Job[];
    companies: CompanyProfile[];
    engineers: EngineerProfile[];
    login: (role: Role, isFreeTier?: boolean) => void;
    loginAsSteve: () => void;
    logout: () => void;
    updateEngineerProfile: (updatedProfile: Partial<EngineerProfile>) => void;
    updateCompanyProfile: (updatedProfile: Partial<CompanyProfile>) => void;
    postJob: (jobData: Omit<Job, 'id' | 'companyId' | 'postedDate' | 'status'>) => Job | undefined;
    startTrial: () => void;
    geminiService: GeminiServiceType;
    applications: Application[];
    applyForJob: (jobId: string, engineerId?: string) => void;
    createAndLoginEngineer: (data: any) => void;
    createAndLoginCompany: (data: any) => void;
    createAndLoginResourcingCompany: (data: any) => void;
    boostProfile: () => void;
    claimSecurityNetGuarantee: () => void;
    reactivateProfile: () => void;
    chatSession: Chat | null;
    conversations: Conversation[];
    messages: Message[];
    selectedConversationId: string | null;
    setSelectedConversationId: Dispatch<SetStateAction<string | null>>;
    findUserById: (userId: string) => User | undefined;
    findUserByProfileId: (profileId: string) => User | undefined;
    sendMessage: (conversationId: string, text: string) => void;
    startConversationAndNavigate: (otherParticipantProfileId: string, navigateToMessages: () => void) => void;
    reviews: Review[];
    submitReview: (reviewData: Omit<Review, 'id' | 'date'>) => void;
    toggleUserStatus: (profileId: string) => void;
    toggleJobStatus: (jobId: string) => void;
    notifications: Notification[];
    markNotificationsAsRead: (userId: string) => void;
    offerJob: (jobId: string, engineerId: string) => void;
    acceptOffer: (jobId: string, engineerId: string) => void;
    declineOffer: (jobId: string, engineerId: string) => void;
    inviteEngineerToJob: (jobId: string, engineerId: string) => void;
    isAiReplying: boolean;
    // NEW: Forum context
    forumPosts: ForumPost[];
    forumComments: ForumComment[];
    createForumPost: (post: { title: string; content: string; tags: string[] }) => Promise<void>;
    addForumComment: (comment: { postId: string; parentId: string | null; content: string }) => void;
    voteOnPost: (postId: string, voteType: 'up' | 'down') => void;
    voteOnComment: (commentId: string, voteType: 'up' | 'down') => void;
    // NEW: Contract context
    contracts: Contract[];
    sendContractForSignature: (contract: Contract) => void;
    signContract: (contractId: string, signatureName: string) => void;
    // NEW: Milestone & Payment Context
    transactions: Transaction[];
    fundMilestone: (contractId: string, milestoneId: string) => void;
    submitMilestoneForApproval: (contractId: string, milestoneId: string) => void;
    approveMilestonePayout: (contractId: string, milestoneId: string) => void;
    submitTimesheet: (contractId: string, timesheet: Omit<Timesheet, 'id' | 'contractId' | 'engineerId' | 'status'>) => void;
    approveTimesheet: (contractId: string, timesheetId: string) => void;
    upgradeSubscription: (profileId: string, toTier: ProfileTier) => void;
    // NEW: Project Planner context
    projects: Project[];
    createProject: (name: string, description: string) => Project;
    addRoleToProject: (projectId: string, role: Omit<ProjectRole, 'id' | 'assignedEngineerId'>) => void;
    assignEngineerToRole: (projectId: string, roleId: string, engineerId: string) => void;
}