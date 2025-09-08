import React from 'react';

// Enums and simple types first
export type Page = 
    | 'landing' | 'forEngineers' | 'forCompanies' | 'pricing' | 'investors' | 'aboutUs'
    | 'login' | 'engineerSignUp' | 'companySignUp' | 'resourcingCompanySignUp'
    | 'engineerDashboard' | 'companyDashboard' | 'adminDashboard' | 'resourcingDashboard'
    | 'terms' | 'privacy' | 'security' | 'helpCenter' | 'investorRelations' | 'userGuide';

export enum Role {
    ENGINEER = 'Engineer',
    COMPANY = 'Company',
    RESOURCING_COMPANY = 'Resourcing Company',
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
}

export enum Language {
    ENGLISH = 'English (UK)',
    SPANISH = 'Español',
    FRENCH = 'Français',
}

export enum JobType {
    CONTRACT = 'Contract',
    PERMANENT = 'Permanent',
}

export enum ExperienceLevel {
    JUNIOR = 'Junior',
    MID_LEVEL = 'Mid-level',
    SENIOR = 'Senior',
    EXPERT = 'Expert',
}

export enum Discipline {
    AV = 'AV Engineer',
    IT = 'IT Engineer',
    BOTH = 'AV & IT Engineer',
}

export enum Country {
    UK = 'United Kingdom',
    US = 'United States',
    CA = 'Canada',
    DE = 'Germany',
}

export enum ApplicationStatus {
    APPLIED = 'Applied',
    VIEWED = 'Viewed',
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

export enum TransactionType {
    SUBSCRIPTION = 'Subscription',
    ESCROW_FUNDING = 'Escrow Funding',
    PAYOUT = 'Payout',
    PLATFORM_FEE = 'Platform Fee',
    PLATFORM_CREDIT_PURCHASE = 'Platform Credit Purchase',
    AI_DEEP_DIVE_PURCHASE = 'AI Deep Dive Purchase',
}

export enum NotificationType {
    NEW_JOB_MATCH = 'NEW_JOB_MATCH',
    JOB_OFFER = 'JOB_OFFER',
    MESSAGE = 'MESSAGE',
    CONTRACT_UPDATE = 'CONTRACT_UPDATE',
}

export enum PaymentTerms {
    NET7 = 'Net 7',
    NET14 = 'Net 14',
    NET30 = 'Net 30',
}

export enum InvoiceStatus {
    DRAFT = 'Draft',
    SENT = 'Sent',
    PAID = 'Paid',
    OVERDUE = 'Overdue',
    DISPUTED = 'Disputed',
}

export type SkillImportance = 'essential' | 'desirable';

// Interfaces

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

export interface JobRoleSkill {
    name: string;
    description: string;
}

export interface JobRoleSkillCategory {
    category: string;
    skills: JobRoleSkill[];
}

export interface JobRoleDefinition {
    name: string;
    category: string;
    skillCategories: JobRoleSkillCategory[];
}

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
    jobRole: string;
    skillRequirements: JobSkillRequirement[];
}

export interface ContactDetails {
    email: string;
    phone?: string;
    website?: string;
    linkedin?: string;
}

export interface Insurance {
    hasCoverage: boolean;
    amount?: number;
    certificateUrl?: string;
    isVerified: boolean;
}

export interface Compliance {
    professionalIndemnity: Insurance;
    publicLiability: Insurance;
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
    documentUrl?: string;
    isVerified: boolean;
}

export interface Badge {
    id: string;
    name: string;
    description: string;
    icon: React.ComponentType<any>;
    color: string;
}

export interface CaseStudy {
    id: string;
    name: string;
    url: string;
}

export interface Certification {
    name: string;
    verified: boolean;
}

export interface UserProfile {
    id: string;
    name: string;
    avatar: string;
    status: 'active' | 'inactive';
    role: Role;
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
    skills: Skill[];
    selectedJobRoles?: SelectedJobRole[];
    certifications?: Certification[];
    compliance: Compliance;
    identity: IdentityVerification;
    profileViews: number;
    searchAppearances: number;
    jobInvites: number;
    reputation: number; // 0-100
    complianceScore: number; // 0-100
    resourcingCompanyId?: string;
    calendarSyncUrl: string;
    badges: Badge[];
    contact: ContactDetails;
    caseStudies?: CaseStudy[];
    isBoosted?: boolean;
    platformCredits: number;
    loyaltyPoints: number;
    hasReceivedCompletionBonus?: boolean;
    lastMonthlyCreditDate?: Date;
    referralCode?: string;
    jobDigestOptIn?: boolean;
    jobAlertsEnabled?: boolean;
    matchScore?: number;
}

export interface CompanyProfile extends UserProfile {
    website: string;
    logo?: string;
    contact: { name: string; email: string; };
    consentToFeature?: boolean;
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
    peerRating: number; // 1-5
    customerRating: number; // 1-5
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

export interface Transaction {
    id: string;
    userId: string;
    contractId?: string;
    type: TransactionType;
    description: string;
    amount: number;
    date: Date;
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

export interface Project {
    id: string;
    companyId: string;
    name: string;
    description: string;
    status: 'planning' | 'in-progress' | 'completed';
    roles: ProjectRole[];
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
        view: string; // A view name from the app
    };
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
    link: string; // View name to navigate to
    isRead: boolean;
    timestamp: Date;
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
    paymentTerms: PaymentTerms;
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

// Opaque type for the return value of useAppLogic
export type AppContextType = ReturnType<typeof import('../context/useAppLogic').useAppLogic>;