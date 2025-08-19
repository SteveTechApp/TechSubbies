
export enum Role {
  ENGINEER = 'engineer',
  COMPANY = 'company',
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

export interface Engineer {
  id: string;
  name: string;
  location: string;
  radius: number; // in miles/km
  transport: string;
  insurance: boolean;
  profileImageUrl: string;
  tagline: string;
  reviews: { count: number; rating: number };
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