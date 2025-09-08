
import { Chat } from "@google/genai";
import React from "react";

// --- Enums ---

export enum Role {
    ENGINEER = 'Engineer',
    COMPANY = 'Company',
    RESOURCING_COMPANY = 'ResourcingCompany',
    ADMIN = 'Admin',
}

export enum ProfileTier {
    BASIC = 'Bronze',
    PROFESSIONAL = 'Silver',
    SKILLS = 'Gold',
    BUSINESS = 'Platinum',
}

export enum Currency {
    GBP = '£',
    USD = '$',
    EUR = '€',
}

export enum Language {
    EN_GB = 'English (UK)',
    EN_US = 'English (US)',
    FR = 'French',
    DE = 'German',
    ES = 'Spanish',
}

export enum Country {
    UK = 'United Kingdom',
    US = 'United States',
    CA = 'Canada',
    FR = 'France',
    DE = 'Germany',
}

export enum JobType {
    CONTRACT = 'Contract',
    PERMANENT = 'Permanent',
    TEMP_TO_PERM = 'Temp-to-Perm',
}

export enum ExperienceLevel {
    JUNIOR = 'Junior',
    MID_LEVEL = 'Mid-level',
    SENIOR = 'Senior',
    EXPERT = 'Expert / Principal',
}

export enum ApplicationStatus {
    APPLIED = 'Applied',
    VIEWED = 'Viewed',
    SHORTLISTED = 'Shortlisted',
    OFFERED = 'Offered',
    ACCEPTED = 'Accepted',
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
    DISPUTED = 'Disputed',
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

export enum TransactionType {
    SUBSCRIPTION = 'Subscription',
    BOOST_PURCHASE = 'Boost Purchase',
    ONE_OFF_PURCHASE = 'One-off Purchase',
    ESCROW_FUNDING = 'Escrow Funding',
    PAYOUT = 'Payout',
    PLATFORM_FEE = 'Platform Fee',
}

export enum NotificationType {
    MESSAGE = 'message',
    JOB_OFFER = 'job_offer',
    NEW_JOB_MATCH = 'new_job_match',
    CONTRACT_UPDATE = 'contract_update',
}

export enum Discipline {
    AV = 'AV Engineer',
    IT = 'IT Engineer',
    BOTH = 'AV & IT Engineer',
}

export enum PaymentTerms {
    NET7 = 'Net 7',
    NET14 = 'Net 14',
    NET30 = 'Net 30',
}

// --- Interfaces & Types ---

export type Page = 
    'landing' | 'login' | 'engineerSignUp' | 'companySignUp' | 'resourcingCompanySignUp' |
    'engineerDashboard' | 'companyDashboard' | 'adminDashboard' | 'resourcingDashboard' |
    'forEngineers' | 'forCompanies' | 'pricing' | 'aboutUs' | 'investors' | 'helpCenter' |
    'terms' | 'privacy' | 'security' | 'investorRelations' | 'userGuide';

export interface User {
    id: string;
    role: Role;
    profile: UserProfile;
}

export type UserProfile = EngineerProfile | CompanyProfile | ResourcingCompanyProfile | AdminProfile;

export interface BaseProfile {
    id: string;
    name: string;
    avatar: string;
    status: 'active' | 'inactive' | 'suspended';
    role: Role;
}

export interface EngineerProfile extends BaseProfile {
    role: Role.ENGINEER;
    discipline: Discipline;
    location: string;
    country: Country;
    description: string;
    experience: number;
    profileTier: ProfileTier;
    minDayRate: number;
    maxDayRate: number;
    currency: Currency;
    availability: Date | string;
    skills?: Skill[];
    selectedJobRoles?: SelectedJobRole[];
    certifications?: Certification[];
    caseStudies?: CaseStudy[];
    reviews?: string[]; // review IDs
    compliance: Compliance;
    identity: IdentityVerification;
    profileViews: number;
    searchAppearances: number;
    jobInvites: number;
    isBoosted?: boolean;
    reputation: number; // 0-100 score
    complianceScore: number; // 0-100 score
    resourcingCompanyId?: string; // ID of the resourcing company managing this engineer
    calendarSyncUrl?: string;
    jobDigestOptIn?: boolean;
    jobAlertsEnabled?: boolean;
    badges: Badge[];
    matchScore?: number; // Added for AI matching
    contact: {
        email: string;
        phone: string;
        website?: string;
        linkedin?: string;
    };
}

export interface CompanyProfile extends BaseProfile {
    role: Role.COMPANY;
    website: string;
    location: string;
    logo?: string;
    consentToFeature?: boolean;
    contact: {
        email: string;
        name: string;
    };
}

// FIX: `ResourcingCompanyProfile` cannot extend `CompanyProfile` due to incompatible `role` literal types.
// It should be a sibling type, also extending a base type if needed, but for simplicity here it will extend `BaseProfile`
// and share the common fields with `CompanyProfile`.
export interface ResourcingCompanyProfile extends BaseProfile {
    role: Role.RESOURCING_COMPANY;
    website: string;
    location: string;
    logo?: string;
    consentToFeature?: boolean;
    contact: {
        email: string;
        name: string;
    };
    managedEngineerIds: string[];
}

export interface AdminProfile extends BaseProfile {
    role: Role.ADMIN;
    permissions: string[];
}

export interface Skill {
    name: string;
    rating: number; // 0-100
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
        skills: {
            name: string;
            description: string;
        }[];
    }[];
}

export interface Certification {
    name: string;
    verified: boolean;
    documentUrl?: string;
}

export interface CaseStudy {
    id: string;
    name: string;
    url: string;
}

export interface IdentityVerification {
    documentType: 'passport' | 'drivers_license' | 'none';
    documentUrl?: string;
    isVerified: boolean;
}

export interface Compliance {
    professionalIndemnity: { hasCoverage: boolean; amount?: number; certificateUrl?: string; isVerified: boolean; };
    publicLiability: { hasCoverage: boolean; amount?: number; certificateUrl?: string; isVerified: boolean; };
    siteSafe: boolean; // aka SSSTS
    cscsCard: boolean;
    ownPPE: boolean;
    hasOwnTransport: boolean;
    hasOwnTools: boolean;
    powerToolCompetency: number; // 0-100
    accessEquipmentTrained: number; // 0-100
    firstAidTrained: boolean;
    carriesSpares: boolean;
}

export type SkillImportance = 'essential' | 'desirable';

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
    currency: Currency;
    duration: string;
    postedDate: Date;
    startDate: Date | null;
    status: 'active' | 'inactive' | 'filled';
    jobType: JobType;
    experienceLevel: ExperienceLevel;
    jobRole: string; // From JOB_ROLE_DEFINITIONS
    skillRequirements: JobSkillRequirement[];
}

export interface Application {
    jobId: string;
    engineerId: string;
    date: Date;
    status: ApplicationStatus;
    reviewed: boolean;
}

export interface Review {
    id: string;
    jobId: string;
    companyId: string;
    engineerId: string;
    peerRating: number; // 1-5, for technical skill etc.
    customerRating: number; // 1-5, for communication etc.
    comment: string;
    date: Date;
}

export interface Conversation {
    id: string;
    participantIds: string[]; // user IDs
    lastMessageTimestamp: Date;
    lastMessageText: string;
}

export interface Message {
    id: string;
    conversationId: string;
    senderId: string; // user ID
    text: string;
    originalText?: string;
    timestamp: Date;
    isRead: boolean;
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
    status: TimesheetStatus;
}

export interface Transaction {
    id: string;
    userId: string;
    contractId?: string;
    type: TransactionType;
    description: string;
    amount: number;
    date: Date;
}

export interface Notification {
    id: string;
    userId: string;
    type: NotificationType;
    text: string;
    link?: string; // A view to navigate to
    isRead: boolean;
    timestamp: Date;
}

export interface ForumPost {
    id: string;
    authorId: string; // User ID
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

export interface TrainingProvider {
    name: string;
    url: string;
    specialties: string[];
    type: 'Manufacturer' | 'Industry Standard' | 'Sponsored';
}

export interface Badge {
    id: string;
    name: string;
    description: string;
    icon: React.ComponentType<any>;
    color: string;
}

export interface Project {
    id: string;
    companyId: string;
    name: string;
    description: string;
    status: 'planning' | 'active' | 'completed';
    roles: ProjectRole[];
}

export interface ProjectRole {
    id: string;
    title: string;
    discipline: Discipline;
    startDate: Date;
    endDate: Date;
    assignedEngineerId: string | null;
    phase?: string;
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

export enum InvoiceStatus {
    DRAFT = 'Draft',
    SENT = 'Sent',
    PAID = 'Paid',
    OVERDUE = 'Overdue',
    DISPUTED = 'Disputed',
}

export interface Insight {
    type: 'Upskill' | 'Certification' | 'Profile Enhancement';
    suggestion: string;
    callToAction: {
        text: string;
        view: string; // The view to navigate to
    };
}

// Opaque type for the return value of useAppLogic
export type AppContextType = ReturnType<typeof import('./useAppLogic').useAppLogic>;
