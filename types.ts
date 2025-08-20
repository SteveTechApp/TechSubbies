

export enum Role {
  ENGINEER = 'engineer',
  COMPANY = 'company',
  ADMIN = 'admin',
  NONE = 'none',
}

export enum Currency {
  GBP = '£',
  USD = '$',
}

export interface Skill {
  id: string;
  name: string;
  rating: number; // 0-5
}

export interface SkillProfile {
  id: string;
  roleTitle: string;
  dayRate: number;
  skills: Skill[];
  customSkills: string[];
  isPremium: boolean;
}

export interface Certification {
  id: string;
  name: string;
  achieved: boolean;
  proofUrl?: string;
}

export interface Engineer {
  id:string;
  // Personal Details from image
  title: string;
  firstName: string;
  middleName: string;
  surname: string;
  companyName: string;
  travelRadius: string;
  bio: string;
  tagline: string; // Job title e.g. "AV Technician"
  yearsOfExperience: number;

  // Contact Details from image
  email: string;
  telephone?: string;
  mobile: string;
  website: string;
  linkedin: string;
  social1?: string;
  social2?: string;
  social3?: string;
  
  // Compliance & Ratings from image
  professionalIndemnityInsurance: boolean;
  publicLiabilityInsurance: boolean;
  siteSafe: boolean;
  ownPPE: boolean;
  accessEquipmentTrained: boolean;
  firstAidTrained: boolean;
  customerRating: number;
  peerRating: number;
  associates: { name: string; link?: string }[];
  caseStudies: { title: string; link: string }[];
  certifications: Certification[];
  
  // Original fields for app logic
  name: string; // Full name, will be constructed
  location: string;
  radius: number; // in miles/km (for filtering)
  transport: string;
  insurance: boolean; // General flag, can be derived
  profileImageUrl: string;
  reviews: { count: number; rating: number }; // Kept for potential other uses, but UI will prefer new ratings
  baseDayRate: number;
  skillProfiles: SkillProfile[];
  availability: string[]; // array of ISO date strings
}

export interface Job {
  id:string;
  title: string;
  companyId: string;
  location: string;
  startDate: string;
  endDate: string;
  description: string;
  requiredSkills: string[];
  dayRate: number;
  roleTitle: string;
}

export interface Company {
  id: string;
  name: string;
  logoUrl: string;
}

export interface Admin {
    id: string;
    name: string;
    email: string;
}

export interface SupportRequest {
    id: string;
    userId: string;
    userName: string;
    userRole: Role;
    subject: string;
    message: string;
    date: string; // ISO string
    status: 'Open' | 'Resolved';
}

// For AI Skill Discovery
export interface GeneratedSkill {
    name: string;
    description: string;
}

export interface SkillDiscoveryResult {
    suggestedJobTitles: string[];
    nicheSkills: GeneratedSkill[];
}