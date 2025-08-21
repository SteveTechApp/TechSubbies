export enum Role {
    ENGINEER = "engineer",
    COMPANY = "company",
    ADMIN = "admin",
    RESOURCING_COMPANY = "resourcing_company",
    NONE = "none",
}

export enum Currency {
    GBP = "£",
    USD = "$",
}

export interface Skill {
    name: string;
    rating: number;
}

export interface Certification {
    name: string;
    verified: boolean;
}

export interface Contact {
    email: string;
    phone: string;
    website: string;
    linkedin: string;
}

export interface EngineerProfile {
    id: string;
    name: string;
    tagline: string;
    location: string;
    currency: Currency;
    dayRate: number;
    experience: number;
    availability: Date;
    skills: Skill[];
    description: string;
    avatar: string;
    certifications: Certification[];
    contact: Contact;
}

export interface CompanyProfile {
    id: string;
    name: string;
    location: string;
    logo: string;
    bio: string;
    website: string;
}

export interface Job {
    id: string;
    companyId: string;
    title: string;
    location: string;
    postedDate: Date;
    startDate: Date | null;
    duration: string;
    dayRate: number;
    currency: Currency;
    description: string;
    requiredSkills: string[];
}

export interface User {
    id: string;
    role: Role;
    profile: any; // Can be EngineerProfile, CompanyProfile, etc.
}
