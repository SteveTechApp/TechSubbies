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

export interface Skill {
    name: string;
    rating: number; // 0-100 (represents general proficiency for basic skills)
}

export interface RatedSkill {
    name: string;
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
    siteSafe: boolean;
    ownPPE: boolean;
    accessEquipmentTrained: boolean;
    firstAidTrained: boolean;
}

interface BaseProfile {
    id: string;
    name: string;
    avatar: string;
    status: 'active' | 'suspended';
}

export interface EngineerProfile extends BaseProfile {
    discipline: Discipline;
    location: string;
    currency: Currency;
    dayRate: number;
    experience: number; // years
    availability: Date;
    description: string;
    skills: Skill[]; // Basic skills for free tier
    selectedJobRoles?: SelectedJobRole[]; // Replaces specialistJobRoles
    certifications: Certification[];
    contact: Contact;
    profileTier: 'free' | 'paid';
    resourcingCompanyId?: string; // ID of the managing resourcing company
    trialEndDate?: Date; // NEW: For managing Skills Profile trials
    title?: string;
    firstName: string;
    middleName?: string;
    surname: string;
    companyName?: string;
    travelRadius?: string;
    socials?: SocialLink[];
    associates?: Associate[];
    compliance?: Compliance;
    generalAvailability?: string; // e.g., 'Medium'
    customerRating?: number; // 1-5
    peerRating?: number; // 1-5
    googleCalendarLink?: string;
    caseStudies?: CaseStudy[];
    otherLinks?: SocialLink[];
    rightColumnLinks?: { label: string, value: string, url: string }[];
    isBoosted?: boolean;
}


export interface CompanyProfile extends BaseProfile {
    website?: string;
    consentToFeature?: boolean;
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
}

export interface Application {
    jobId: string;
    engineerId: string;
    date: Date;
    completed?: boolean;
    reviewed?: boolean;
}

export interface Review {
    id: string;
    jobId: string;
    companyId: string;
    engineerId: string;
    peerRating: number; // Technical skill
    customerRating: number; // Communication etc.
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


export type Page = 'landing' | 'login' | 'forEngineers' | 'forCompanies' | 'engineerSignUp' | 'investors' | 'aboutUs' | 'terms' | 'privacy' | 'pricing';