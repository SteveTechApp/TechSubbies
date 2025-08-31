import type { Chat } from '@google/genai';
import type { Dispatch, SetStateAction } from 'react';

// --- SIMULATED PRE-AUTHENTICATION ---
// In a real application, this would come from an authentication service (e.g., Firebase Auth, Auth0)
// *before* the user reaches the role selection screen. For this demo, we mock the signed-in user.
export const PRE_AUTH_USER = {
    email: 'SteveGoodwin1972@gmail.com',
    name: 'Steve Goodwin',
};


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
  category: 'AV' | 'IT' | 'Management';
  skills: string[];
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

export interface Compliance {
    professionalIndemnity: boolean;
    publicLiability: boolean;
    siteSafe: boolean; // Site safety certifications like SSSTS
    cscsCard: boolean; // CSCS Card
    ownPPE: boolean;
    hasOwnTransport: boolean;
    hasOwnTools: boolean;
    powerToolCompetency: boolean;
    accessEquipmentTrained: boolean; // e.g., IPAF, PASMA
    firstAidTrained: boolean;
    carriesSpares: boolean; // Carries spares and consumables
}

interface BaseProfile {
    id: string;
    name: string;
    avatar: string;
    status: 'active' | 'suspended' | 'inactive';
}

export interface EngineerProfile extends BaseProfile {
    discipline: Discipline;
    location: string;
    currency: Currency;
    dayRate: number;
    experience: number; // years
    availability: Date;
    description: string;
    skills?: Skill[]; // Basic skills/tags for paid tier only
    selectedJobRoles?: SelectedJobRole[]; // Detailed skills for paid tier
    certifications: Certification[];
    contact: Contact;
    profileTier: 'free' | 'paid';
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
    generalAvailability?: string; // e.g., 'Medium'
    customerRating?: number; // 1-5
    peerRating?: number; // 1-5
    googleCalendarLink?: string;
    caseStudies?: CaseStudy[];
    otherLinks?: SocialLink[];
    rightColumnLinks?: { label: string, value: string, url: string }[];
    isBoosted?: boolean;
    matchScore?: number;
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


export type Page = 'landing' | 'login' | 'forEngineers' | 'forCompanies' | 'engineerSignUp' | 'companySignUp' | 'resourcingCompanySignUp' | 'investors' | 'aboutUs' | 'terms' | 'privacy' | 'pricing' | 'howItWorks';

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
    postJob: (jobData: any) => void;
    startTrial: () => void;
    geminiService: any;
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
    // NEW: Forum context
    forumPosts: ForumPost[];
    forumComments: ForumComment[];
    createForumPost: (post: { title: string; content: string; tags: string[] }) => Promise<void>;
    addForumComment: (comment: { postId: string; parentId: string | null; content: string }) => void;
    voteOnPost: (postId: string, voteType: 'up' | 'down') => void;
    voteOnComment: (commentId: string, voteType: 'up' | 'down') => void;
}