import React, { createContext, useContext, useState, ReactNode } from 'react';
import { GoogleGenAI, Type } from "@google/genai";
import { PoundSterling, DollarSign } from '../components/Icons.tsx';

// --- SIMULATED PRE-AUTHENTICATION ---
// In a real application, this would come from an authentication service (e.g., Firebase Auth, Auth0)
// *before* the user reaches the role selection screen. For this demo, we mock the signed-in user.
export const PRE_AUTH_USER = {
    email: 'SteveGoodwin1972@gmail.com',
    name: 'Steve Goodwin',
};


// --- Inlined from types.ts ---
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

// --- NEW: Detailed, rated skills for job roles ---
export interface RatedSkill {
    name: string;
    rating: number; // 1-100
}

// --- NEW: Structure for a selected job role with ratings ---
export interface SelectedJobRole {
    roleName: string;
    skills: RatedSkill[];
    overallScore: number;
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
    trialEndDate?: Date; // NEW: For managing Job Profile trials

    // New fields from image
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
    companyId: string;
    title: string;
    description: string;
    location: string;
    dayRate: string;
    currency: Currency;
    duration: string;
    postedDate: Date;
    startDate: Date | null;
}

export interface Application {
    jobId: string;
    engineerId: string;
    date: Date;
}


// --- Inlined from constants.ts ---
export const APP_NAME = "TechSubbies.com";
export const CURRENCY_ICONS: { [key in Currency]: React.ComponentType<any> } = {
    [Currency.GBP]: PoundSterling,
    [Currency.USD]: DollarSign,
};


// --- NEW: Comprehensive Job Role Database ---
export interface JobRoleDefinition {
  name: string;
  category: 'AV' | 'IT' | 'Management';
  skills: string[];
}

export const JOB_ROLE_DEFINITIONS: JobRoleDefinition[] = [
    // --- AV Roles ---
    { name: 'AV Commissioning Engineer', category: 'AV', skills: ['System Commissioning', 'Crestron Toolbox', 'Biamp Tesira', 'Q-SYS Designer', 'Dante Level 3', 'Network Troubleshooting', 'Final Handover'] },
    { name: 'Lead AV Installer', category: 'AV', skills: ['Rack Building & Wiring', 'Reading Schematics', 'Cable Termination', 'Team Leadership', 'Health & Safety (H&S)', 'On-site Problem Solving'] },
    { name: 'AV Service Engineer', category: 'AV', skills: ['Fault Finding', 'Preventative Maintenance', 'Client Communication', 'RMAs & Ticketing', 'Remote Diagnostics', 'Firmware Management'] },
    { name: 'Rack Builder / Wirer', category: 'AV', skills: ['Wiring to Schematic', 'Cable Looming', 'Soldering', 'Neat Patching', 'Metalwork Fabrication', 'Rack Elevation Accuracy'] },
    { name: 'Crestron Programmer', category: 'AV', skills: ['SIMPL Windows', 'C# (for SIMPL#)', 'Crestron HTML5 UI', 'DM NVX Configuration', 'System Architecture', 'API Integration'] },
    { name: 'Q-SYS Programmer', category: 'AV', skills: ['Q-SYS Designer Software', 'Lua Scripting', 'UCI Design', 'Core Manager', 'AES67/Dante Integration', 'Telephony/VoIP'] },
    { name: 'Live Events Technician', category: 'AV', skills: ['Live Sound Mixing', 'Vision Mixing (vMix/Blackmagic)', 'LED Wall Configuration', 'Power Distribution', 'Projection Mapping', 'Client Facing Skills'] },
    { name: 'Video Conference Specialist', category: 'AV', skills: ['MS Teams Rooms', 'Zoom Rooms', 'Cisco Webex Devices', 'Poly Studio Series', 'Device Provisioning', 'End-User Training'] },
    { name: 'AV System Designer', category: 'AV', skills: ['AutoCAD/Visio', 'System Flow Diagrams', 'Acoustic Modelling', 'Bill of Materials (BoM)', 'Product Knowledge', 'Tender Response'] },
    { name: 'Digital Signage Specialist', category: 'AV', skills: ['CMS Platforms (e.g., BrightSign)', 'Content Scheduling', 'Player Hardware', 'Network Configuration', 'Video Wall Setup', 'API Integration'] },
    
    // --- IT Roles ---
    { name: 'Network Engineer', category: 'IT', skills: ['Cisco iOS/NX-OS', 'Routing (BGP/OSPF)', 'Switching (VLANs/STP)', 'Firewall Management', 'Network Monitoring', 'Wi-Fi Surveys'] },
    { name: 'IT Support Engineer', category: 'IT', skills: ['Active Directory', 'Microsoft 365 Admin', 'Hardware Troubleshooting', 'Windows/macOS Support', 'Basic Networking', 'Ticketing Systems'] },
    { name: 'Cloud Engineer (AWS/Azure)', category: 'IT', skills: ['AWS EC2/Azure VMs', 'VPC/VNet Networking', 'IAM/Azure AD', 'CloudFormation/Terraform', 'Serverless Functions', 'Cloud Monitoring'] },
    { name: 'Cybersecurity Analyst', category: 'IT', skills: ['SIEM Tools (e.g., Splunk)', 'Vulnerability Scanning', 'Firewall Policy Analysis', 'Incident Response', 'Phishing Analysis', 'Penetration Testing Concepts'] },
    { name: 'Unified Comms (UC) Engineer', category: 'IT', skills: ['MS Teams Telephony', 'Cisco CUCM', 'SBC Configuration (e.g., Ribbon/AudioCodes)', 'PowerShell', 'SIP Trunking', 'Voice Gateway Management'] },
    { name: 'Solutions Architect', category: 'IT', skills: ['High-Level Design', 'Technical Documentation', 'Stakeholder Management', 'Cloud Architecture', 'Cost Analysis', 'Proof of Concept Dev'] },
    { name: 'DevOps Engineer', category: 'IT', skills: ['CI/CD Pipelines (Jenkins/GitLab)', 'Docker & Kubernetes', 'Infrastructure as Code (IaC)', 'Scripting (Bash/Python)', 'Configuration Management', 'Monitoring & Logging'] },
    { name: 'Database Administrator (DBA)', category: 'IT', skills: ['SQL Server/PostgreSQL', 'Backup & Recovery', 'Performance Tuning', 'Database Security', 'Query Optimization', 'High Availability Setup'] },

    // --- Management Roles ---
    { name: 'AV Project Manager', category: 'Management', skills: ['Project Scoping', 'Gantt Charts (MS Project)', 'Budget Management', 'Client Communication', 'Risk Assessment', 'Change Order Management'] },
    { name: 'IT Project Manager', category: 'Management', skills: ['Agile/Scrum Methodology', 'Jira/Confluence', 'Resource Planning', 'Vendor Management', 'Status Reporting', 'Risk Mitigation'] },
    { name: 'Technical Sales / Pre-Sales', category: 'Management', skills: ['Requirement Gathering', 'Solution Demonstration', 'Proposal Writing', 'Client Relationship', 'Technical Presentations', 'Competitive Analysis'] },
];

const generateUniqueId = () => Math.random().toString(36).substring(2, 10);

// --- Inlined from mockDataGenerator.ts ---
// PAID AV Engineer (Independent)
const MOCK_ENGINEER_1: EngineerProfile = {
    id: 'eng-1',
    name: 'Neil Bishop',
    firstName: 'Neil',
    middleName: 'John',
    surname: 'Bishop',
    title: 'Mr',
    discipline: Discipline.AV,
    avatar: 'https://i.imgur.com/8Qtm93t.jpeg',
    location: 'London, UK',
    currency: Currency.GBP,
    dayRate: 550,
    experience: 15,
    availability: new Date('2024-08-01'),
    description: "Senior AV commissioning engineer with 15+ years' experience specializing in corporate and residential projects. Expert in Crestron, Biamp, and Q-SYS ecosystems, ensuring flawless system integration and performance.",
    companyName: 'AV Innovations',
    travelRadius: '< 500 miles',
    profileTier: 'paid',
    skills: [ // Summary skills for card view
        { name: 'AV Commissioning', rating: 98 }, 
        { name: 'Control Systems', rating: 95 }, 
        { name: 'DSP Programming', rating: 92 },
    ],
    selectedJobRoles: [
        {
            roleName: 'AV Commissioning Engineer',
            skills: [
                { name: 'System Commissioning', rating: 98 },
                { name: 'Crestron Toolbox', rating: 95 },
                { name: 'Biamp Tesira', rating: 92 },
                { name: 'Q-SYS Designer', rating: 88 },
                { name: 'Dante Level 3', rating: 96 },
                { name: 'Network Troubleshooting', rating: 90 },
            ],
            overallScore: 93
        },
        {
            roleName: 'Crestron Programmer',
            skills: [
                { name: 'SIMPL Windows', rating: 94 },
                { name: 'C# (for SIMPL#)', rating: 78 },
                { name: 'Crestron HTML5 UI', rating: 82 },
                { name: 'DM NVX Configuration', rating: 95 },
                { name: 'System Architecture', rating: 90 },
                { name: 'API Integration', rating: 85 },
            ],
            overallScore: 87
        }
    ],
    certifications: [
        { name: 'Crestron Certified Programmer', verified: true }, 
        { name: 'Biamp TesiraFORTE Certified', verified: true }, 
        { name: 'Dante Certification Level 3', verified: true }
    ],
    contact: {
        email: 'neil.bishop@example.com',
        phone: '07123456789',
        website: 'www.neilbishop.com',
        linkedin: 'linkedin.com/in/nelib',
    },
    socials: [
        { name: 'Social 1', url: 'social 1' },
        { name: 'Social 2', url: 'social 2' },
        { name: 'Social 3', url: 'social 3' },
    ],
    associates: [
        { name: 'Associate', value: 'John Smith' },
        { name: 'Associate 2', value: 'Jane Doe' },
    ],
    compliance: {
        professionalIndemnity: true,
        publicLiability: true,
        siteSafe: true,
        ownPPE: true,
        accessEquipmentTrained: false,
        firstAidTrained: true,
    },
    generalAvailability: 'Medium',
    caseStudies: [
        { id: 'cs-1', name: 'Corporate HQ Audiovisual Integration', url: 'https://example.com/case-study-1' },
        { id: 'cs-2', name: 'Luxury Residential Smart Home System', url: 'https://example.com/case-study-2' },
    ],
    customerRating: 5,
    peerRating: 5,
};

// FREE IT Engineer (Managed by AV Placements)
const MOCK_ENGINEER_2: EngineerProfile = {
    id: 'eng-2',
    name: 'Samantha Greene',
    firstName: 'Samantha',
    surname: 'Greene',
    title: 'Ms',
    discipline: Discipline.IT,
    avatar: 'https://i.pravatar.cc/150?u=samanthagreene',
    location: 'Manchester, UK',
    currency: Currency.GBP,
    dayRate: 350,
    experience: 8,
    availability: new Date('2024-07-20'),
    description: "Microsoft Certified support specialist focusing on SME infrastructure, Office 365, and user support. Passionate about creating efficient and secure IT environments.",
    companyName: 'Greene IT Solutions',
    travelRadius: '< 100 miles',
    profileTier: 'free',
    resourcingCompanyId: 'res-1', // Managed by AV Placements
    skills: [ // Only basic skills, no specialist roles
        { name: 'Microsoft 365 Admin', rating: 92 }, 
        { name: 'Active Directory', rating: 90 }, 
        { name: 'Network Troubleshooting', rating: 88 }, 
        { name: 'Hardware Support', rating: 85 },
    ],
    certifications: [
        { name: 'Microsoft 365 Certified: Modern Desktop Administrator Associate', verified: true }, 
    ],
    contact: { 
        email: 'sam.greene@example.com', 
        phone: '01234 567891', 
        website: 'https://sgreene.com', 
        linkedin: 'https://linkedin.com/in/samanthagreene' 
    },
    socials: [
        { name: 'Social 1', url: 'social 1 link' }
    ],
    associates: [
        { name: 'Associate 1', value: 'Managed by AV Placements' }
    ],
    compliance: {
        professionalIndemnity: true,
        publicLiability: true,
        siteSafe: false,
        ownPPE: true,
        accessEquipmentTrained: false,
        firstAidTrained: false,
    },
    generalAvailability: 'High',
    caseStudies: [
      { id: 'cs-3', name: 'SME Office 365 Migration', url: 'https://example.com/case-study-3'}
    ],
    customerRating: 4,
    peerRating: 5,
    googleCalendarLink: '#',
};

// PAID IT Engineer (Managed by AV Placements)
const MOCK_ENGINEER_3: EngineerProfile = {
    id: 'eng-3',
    name: 'David Chen',
    firstName: 'David',
    surname: 'Chen',
    discipline: Discipline.IT,
    avatar: 'https://i.pravatar.cc/150?u=davidchen',
    location: 'Birmingham, UK',
    currency: Currency.GBP,
    dayRate: 600,
    experience: 10,
    availability: new Date('2024-09-15'),
    description: "AWS Certified Solutions Architect with a deep background in Cisco networking. Specializes in designing and implementing scalable, secure cloud infrastructure and hybrid networks.",
    profileTier: 'paid',
    resourcingCompanyId: 'res-1', // Managed by AV Placements
    skills: [ // Summary skills for card view
        { name: 'Cloud Architecture (AWS)', rating: 95 },
        { name: 'Network Engineering', rating: 94 },
        { name: 'Cybersecurity', rating: 88 },
    ],
    selectedJobRoles: [
        {
            roleName: 'Cloud Engineer (AWS/Azure)',
            skills: [
                { name: 'AWS EC2/Azure VMs', rating: 98 },
                { name: 'VPC/VNet Networking', rating: 92 },
                { name: 'IAM/Azure AD', rating: 94 },
                { name: 'CloudFormation/Terraform', rating: 90 },
                { name: 'Serverless Functions', rating: 85 },
                { name: 'Cloud Monitoring', rating: 88 },
            ],
            overallScore: 91
        },
        {
            roleName: 'Network Engineer',
            skills: [
                { name: 'Cisco iOS/NX-OS', rating: 96 },
                { name: 'Routing (BGP/OSPF)', rating: 94 },
                { name: 'Switching (VLANs/STP)', rating: 95 },
                { name: 'Firewall Management', rating: 89 },
                { name: 'Network Monitoring', rating: 90 },
                { name: 'Wi-Fi Surveys', rating: 85 },
            ],
            overallScore: 92
        }
    ],
    certifications: [
        { name: 'AWS Certified Solutions Architect - Professional', verified: true },
        { name: 'Cisco Certified Network Professional (CCNP)', verified: true },
    ],
    contact: { email: 'david.chen@example.com', phone: '07111222333', website: 'https://chencloud.dev', linkedin: 'https://linkedin.com/in/davidchen' },
    caseStudies: [],
};

// --- START: Programmatic Data Generation for Scale ---
const FIRST_NAMES = ['Aiden', 'Bella', 'Charlie', 'Daisy', 'Ethan', 'Freya', 'George', 'Hannah', 'Isaac', 'Jasmine', 'Leo', 'Mia', 'Noah', 'Olivia', 'Poppy', 'Riley', 'Sophia', 'Thomas', 'William', 'Zoe'];
const LAST_NAMES = ['Smith', 'Jones', 'Taylor', 'Brown', 'Williams', 'Wilson', 'Johnson', 'Roberts', 'Walker', 'Wright', 'Thompson', 'White', 'Harris', 'Clark', 'Lewis', 'Hall'];
const LOCATIONS = ['London', 'Manchester', 'Birmingham', 'Leeds', 'Glasgow', 'Bristol', 'Edinburgh', 'Liverpool', 'Sheffield', 'Cardiff', 'Belfast', 'Newcastle', 'Nottingham'];
const COMPANY_NAMES = ['Innovate', 'Synergy', 'Apex', 'Pinnacle', 'Fusion', 'Quantum', 'Starlight', 'Nexus', 'Momentum', 'Digital', 'Vision', 'Core', 'Link', 'Signal'];
const COMPANY_SUFFIXES = ['Solutions', 'Systems', 'Integrations', 'AV', 'IT Services', 'Group', 'Ltd', 'Pro', 'Tech', 'Networks'];

const getRandom = (arr: any[]) => arr[Math.floor(Math.random() * arr.length)];
const getRandomInt = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1)) + min;

const generateMockEngineers = (count: number): EngineerProfile[] => {
    const engineers: EngineerProfile[] = [];
    const disciplines = [Discipline.AV, Discipline.IT, Discipline.BOTH];

    for (let i = 0; i < count; i++) {
        const profileTier = Math.random() > 0.6 ? 'paid' : 'free';
        const jobRoleDef = getRandom(JOB_ROLE_DEFINITIONS);
        const firstName = getRandom(FIRST_NAMES);
        const lastName = getRandom(LAST_NAMES);
        const name = `${firstName} ${lastName}`;
        const discipline = getRandom(disciplines);
        
        const summarySkills: Skill[] = jobRoleDef.skills.slice(0, 3).map(skillName => ({
            name: skillName,
            rating: getRandomInt(70, 98)
        }));

        const engineer: EngineerProfile = {
            id: `gen-eng-${i}`,
            name: name,
            firstName: firstName,
            surname: lastName,
            discipline: discipline,
            avatar: `https://i.pravatar.cc/150?u=${name.replace(' ', '')}`,
            location: `${getRandom(LOCATIONS)}, UK`,
            currency: Currency.GBP,
            dayRate: getRandomInt(13, 30) * 25, // 325 to 750 in 25 increments
            experience: getRandomInt(3, 20),
            availability: new Date(new Date().getTime() + getRandomInt(1, 90) * 24 * 60 * 60 * 1000),
            description: `A highly skilled ${discipline} with ${name.length % 10 + 5} years of experience in the field. Proficient in various technologies and dedicated to delivering high-quality results.`,
            profileTier: profileTier,
            skills: summarySkills,
            certifications: [],
            contact: {
                email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}@example.com`,
                phone: `07${getRandomInt(100000000, 999999999)}`,
                website: `www.${firstName.toLowerCase()}${lastName.toLowerCase()}.com`,
                linkedin: `linkedin.com/in/${firstName.toLowerCase()}${lastName.toLowerCase()}`
            },
            caseStudies: [],
            // 10% of generated engineers are managed by AV Placements
            resourcingCompanyId: Math.random() < 0.1 ? 'res-1' : undefined,
        };

        if (profileTier === 'paid') {
            const ratedSkills: RatedSkill[] = jobRoleDef.skills.map(skillName => ({
                name: skillName,
                rating: getRandomInt(65, 99)
            }));
            const totalScore = ratedSkills.reduce((acc, skill) => acc + skill.rating, 0);
            const overallScore = Math.round(totalScore / ratedSkills.length);
            
            engineer.selectedJobRoles = [{
                roleName: jobRoleDef.name,
                skills: ratedSkills,
                overallScore: overallScore
            }];
        }
        
        engineers.push(engineer);
    }
    return engineers;
};

const generateMockCompanies = (count: number): CompanyProfile[] => {
    const companies: CompanyProfile[] = [];
    for (let i = 0; i < count; i++) {
        const name = `${getRandom(COMPANY_NAMES)} ${getRandom(COMPANY_SUFFIXES)}`;
        companies.push({
            id: `gen-comp-${i}`,
            name: name,
            avatar: `https://i.pravatar.cc/150?u=${name.replace(/\s/g, '')}`,
            website: `www.${name.replace(/\s/g, '').toLowerCase()}.com`,
            consentToFeature: Math.random() < 0.2, // ~20% of companies consent to be featured
        });
    }
    return companies;
};

const DURATIONS = ['2 weeks', '1 month', '6 weeks', '3 months', '6 months', '12 months', 'Ongoing'];

const generateMockJobs = (count: number, companies: CompanyProfile[]): Job[] => {
    const jobs: Job[] = [];
    if (companies.length === 0) return [];

    for (let i = 0; i < count; i++) {
        const roleDef = getRandom(JOB_ROLE_DEFINITIONS);
        const company = getRandom(companies);

        const job: Job = {
            id: `gen-job-${i}`,
            companyId: company.id,
            title: roleDef.name,
            description: `We are looking for a skilled ${roleDef.name} for an upcoming project. The ideal candidate will have strong experience in ${roleDef.skills.slice(0, 3).join(', ')}. This is a contract role with potential for extension. Please apply if you have the relevant skills and are available to start soon.`,
            location: Math.random() > 0.2 ? `${getRandom(LOCATIONS)}, UK` : 'Remote (UK Based)',
            dayRate: String(getRandomInt(13, 30) * 25),
            currency: Currency.GBP,
            duration: getRandom(DURATIONS),
            postedDate: new Date(new Date().getTime() - getRandomInt(1, 60) * 24 * 60 * 60 * 1000), // Posted in the last 60 days
            startDate: new Date(new Date().getTime() + getRandomInt(7, 90) * 24 * 60 * 60 * 1000), // Starts in the next 7-90 days
        };
        jobs.push(job);
    }
    return jobs;
};


// --- END: Programmatic Data Generation ---

const EXISTING_COMPANIES: CompanyProfile[] = [
    { id: 'comp-1', name: 'Innovate AV Ltd.', avatar: 'https://i.pravatar.cc/150?u=innovate', consentToFeature: true },
    { id: 'comp-2', name: 'Future Systems Inc.', avatar: 'https://i.pravatar.cc/150?u=future', consentToFeature: true },
];

export const MOCK_ENGINEERS = [MOCK_ENGINEER_1, MOCK_ENGINEER_2, MOCK_ENGINEER_3, ...generateMockEngineers(997)];
export const MOCK_COMPANIES: CompanyProfile[] = [...EXISTING_COMPANIES, ...generateMockCompanies(98)];


export const MOCK_USERS: { [key in Role]: User } = {
    [Role.ENGINEER]: { id: 'user-1', role: Role.ENGINEER, profile: MOCK_ENGINEER_1 },
    [Role.COMPANY]: { id: 'user-2', role: Role.COMPANY, profile: MOCK_COMPANIES[0] },
    [Role.RESOURCING_COMPANY]: { id: 'user-3', role: Role.RESOURCING_COMPANY, profile: { id: 'res-1', name: 'AV Placements', avatar: 'https://i.pravatar.cc/150?u=resourcing' } },
    [Role.ADMIN]: { id: 'user-4', role: Role.ADMIN, profile: { id: 'admin-1', name: 'Admin User', avatar: 'https://i.pravatar.cc/150?u=admin' } },
};

const EXISTING_JOBS: Job[] = [
    {
        id: 'job-1', companyId: 'comp-1', title: 'Lead AV Commissioning Engineer',
        description: 'We require a lead commissioning engineer for a 6-week corporate office fit-out project in Central London. The ideal candidate will have extensive experience with Crestron DM NVX, Biamp Tesira, and Shure MXA series microphones. Must be able to lead a small team and sign-off on completed rooms.',
        location: 'London, UK', dayRate: '575', currency: Currency.GBP, duration: '6 weeks',
        postedDate: new Date('2024-05-20'), startDate: new Date('2024-07-29'),
    },
     {
        id: 'job-2', companyId: 'comp-2', title: 'Senior Network Engineer (Contract)',
        description: 'Seeking a Senior Network Engineer for a 3-month contract to assist with a Cisco ACI deployment. Must have proven experience with network architecture, BGP, OSPF, and Palo Alto firewalls. CCNP certification is highly desirable.',
        location: 'Remote (UK Based)', dayRate: '500', currency: Currency.GBP, duration: '3 months',
        postedDate: new Date('2024-06-10'), startDate: new Date('2024-08-05'),
    },
];

export const MOCK_JOBS: Job[] = [...EXISTING_JOBS, ...generateMockJobs(123, MOCK_COMPANIES)];

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
const geminiService = {
    generateDescriptionForProfile: async (profile: EngineerProfile) => {
        let prompt: string;

        if (profile.profileTier === 'paid') {
            // Paid users get a detailed bio leveraging their listed skills
            prompt = `Generate a compelling but brief professional bio (around 50-70 words) for a freelance Tech engineer. Here are their details:\n- Name: ${profile.name}\n- Role/Discipline: ${profile.discipline}\n- Experience: ${profile.experience} years\n- Key Skills: ${profile.skills.slice(0, 5).map(s => s.name).join(', ')}\n\nWrite a professional, first-person summary highlighting their expertise based on the provided skills.`;
        } else {
            // Free users get a more general bio to encourage upgrading
            prompt = `Generate a compelling but brief professional bio (around 50-70 words) for a freelance Tech engineer. Do not mention any specific technical skills or technologies from a list. Focus on their general role and years of experience. Here are their details:\n- Name: ${profile.name}\n- Role/Discipline: ${profile.discipline}\n- Experience: ${profile.experience} years\n\nWrite a professional, first-person summary that encourages companies to unlock their full profile to see detailed skills.`;
        }
        
        try {
            const response = await ai.models.generateContent({ model: 'gemini-2.5-flash', contents: prompt });
            return String(response.text).trim();
        } catch (error) {
            console.error("Error generating description:", error);
            return profile.description;
        }
    },
    generateSkillsForRole: async (role: string) => {
        const prompt = `Based on the Tech industry job title "${role}", suggest 5 to 7 key technical skills. For each skill, provide a "rating" from 60 to 95, where 60 is proficient and 95 is expert. This rating should reflect the typical proficiency expected for someone in that role.`;
        try {
            const response = await ai.models.generateContent({
                model: "gemini-2.5-flash", contents: prompt,
                config: {
                    responseMimeType: "application/json",
                    responseSchema: {
                        type: Type.OBJECT,
                        properties: { skills: { type: Type.ARRAY, items: { type: Type.OBJECT, properties: { name: { type: Type.STRING }, rating: { type: Type.INTEGER } }, required: ["name", "rating"] } } }
                    },
                },
            });
            return JSON.parse(String(response.text));
        } catch (error) {
            console.error("Error generating skills:", error);
            return null;
        }
    },
    suggestTeamForProject: async (description: string) => {
        const prompt = `Based on this IT/AV project description, suggest a small team of freelance specialists that would be required. For each role, list 2-3 key skills needed.\n\nProject Description: "${description}"`;
        try {
            const response = await ai.models.generateContent({
                model: "gemini-2.5-flash", contents: prompt,
                config: {
                    responseMimeType: "application/json",
                    responseSchema: {
                        type: Type.OBJECT,
                        properties: { team: { type: Type.ARRAY, items: { type: Type.OBJECT, properties: { role: { type: Type.STRING }, skills: { type: Type.ARRAY, items: { type: Type.STRING } } }, required: ["role", "skills"] } } }
                    },
                },
            });
            return JSON.parse(String(response.text));
        } catch (error) {
            console.error("Error suggesting team:", error);
            return null;
        }
    },
    analyzeEngineerCost: async (jobDescription: string, engineerProfile: EngineerProfile) => {
        const prompt = `Analyze the cost-effectiveness of hiring a freelance tech engineer for a project.
        Project Description: "${jobDescription}"
        Engineer Profile:
        - Role: ${engineerProfile.discipline}
        - Experience: ${engineerProfile.experience} years
        - Day Rate: ${engineerProfile.currency}${engineerProfile.dayRate}
        - Key Skills: ${engineerProfile.skills.map(s => `${s.name} (rated ${s.rating}/100)`).join(', ')}
        Provide a JSON response with:
        1. "skill_match_assessment" (string): A brief sentence on how well their skills match the project.
        2. "rate_justification" (string): A brief sentence justifying if their day rate is fair, high, or low based on their experience and skills for this project.
        3. "overall_recommendation" (string): A concluding recommendation (e.g., "Highly Recommended", "Good Value", "Consider Alternatives").
        4. "confidence_score" (number): A score from 0 to 100 on your confidence in this analysis.`;
        try {
            const response = await ai.models.generateContent({
                model: "gemini-2.5-flash", contents: prompt,
                config: {
                    responseMimeType: "application/json",
                    responseSchema: {
                        type: Type.OBJECT,
                        properties: {
                            skill_match_assessment: { type: Type.STRING },
                            rate_justification: { type: Type.STRING },
                            overall_recommendation: { type: Type.STRING },
                            confidence_score: { type: Type.NUMBER },
                        }, required: ["skill_match_assessment", "rate_justification", "overall_recommendation", "confidence_score"],
                    },
                },
            });
            return JSON.parse(String(response.text));
        } catch (error) {
            console.error("Error analyzing cost:", error);
            return null;
        }
    },
};

interface AppContextType {
    user: User | null;
    jobs: Job[];
    engineers: EngineerProfile[];
    login: (role: Role) => void;
    logout: () => void;
    updateEngineerProfile: (updatedProfile: Partial<EngineerProfile>) => void;
    postJob: (jobData: any) => void;
    startTrial: () => void;
    geminiService: typeof geminiService;
    applications: Application[];
    applyForJob: (jobId: string, engineerId?: string) => void;
    createAndLoginEngineer: (data: any) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const [jobs, setJobs] = useState<Job[]>(MOCK_JOBS);
    const [engineers, setEngineers] = useState<EngineerProfile[]>(MOCK_ENGINEERS);
    const [applications, setApplications] = useState<Application[]>([]);

    const login = (role: Role) => {
        if (MOCK_USERS[role]) {
            let userToLogin = { ...MOCK_USERS[role] }; // Make a copy to modify
            
            // Check for expired trial on login for engineers
            if (userToLogin.role === Role.ENGINEER) {
                const profile = { ...(userToLogin.profile as EngineerProfile) }; // Copy profile
                
                // This logic simulates what a server would do: check trial status and downgrade if needed.
                if (profile.profileTier === 'paid' && profile.trialEndDate && new Date(profile.trialEndDate) < new Date()) {
                    console.log(`Trial for ${profile.name} expired. Downgrading to free tier.`);
                    profile.profileTier = 'free'; // Downgrade the copied profile
                    userToLogin.profile = profile; // Assign the modified profile back

                    // Also update the main engineers list for consistency across the app
                    const engineerIndex = engineers.findIndex(e => e.id === profile.id);
                     if (engineerIndex !== -1) {
                        const updatedEngineers = [...engineers];
                        updatedEngineers[engineerIndex] = profile;
                        setEngineers(updatedEngineers);
                    }
                }
            }
            
            setUser(userToLogin);
        }
    };

    const logout = () => {
        setUser(null);
    };

    const createAndLoginEngineer = (data: any) => {
        const [firstName, ...lastNameParts] = data.name.split(' ');
        const newEngineer: EngineerProfile = {
            id: `eng-${generateUniqueId()}`,
            name: data.name,
            firstName: firstName,
            surname: lastNameParts.join(' ') || ' ',
            avatar: `https://i.pravatar.cc/150?u=${data.name.replace(' ', '')}`,
            profileTier: 'free',
            certifications: [],
            caseStudies: [],
            // From wizard
            discipline: data.discipline,
            location: data.location,
            experience: data.experience,
            currency: data.currency,
            dayRate: data.dayRate,
            availability: new Date(data.availability),
            skills: data.skills.map((s: string) => ({ name: s, rating: 50 })), // default rating
            contact: {
                email: data.email,
                phone: '',
                website: '',
                linkedin: '',
            },
            description: `Newly joined freelance ${data.discipline} with ${data.experience} years of experience, based in ${data.location}. Ready for new opportunities starting ${new Date(data.availability).toLocaleDateString()}.`
        };

        // Add to main list
        setEngineers(prev => [newEngineer, ...prev]);

        // Create user object and log in
        const newUser: User = {
            id: `user-${generateUniqueId()}`,
            role: Role.ENGINEER,
            profile: newEngineer,
        };
        setUser(newUser);
    };


    const updateEngineerProfile = (updatedProfile: Partial<EngineerProfile>) => {
        if (user && 'skills' in user.profile) { // Type guard to ensure it's an engineer
            const newUser = {
                ...user,
                profile: {
                    ...user.profile,
                    ...updatedProfile,
                }
            } as User;
            setUser(newUser);

            const engineerIndex = engineers.findIndex(e => e.id === user.profile.id);
            if (engineerIndex !== -1) {
                const updatedEngineers = [...engineers];
                updatedEngineers[engineerIndex] = { ...updatedEngineers[engineerIndex], ...updatedProfile };
                setEngineers(updatedEngineers);
            }
        }
    };

    const startTrial = () => {
        if (user && 'skills' in user.profile) {
            const trialEndDate = new Date();
            trialEndDate.setDate(trialEndDate.getDate() + 30);
            updateEngineerProfile({ 
                profileTier: 'paid',
                trialEndDate: trialEndDate 
            });
            alert("30-Day Job Profile trial started! You now have access to all premium features.");
        }
    };

    const postJob = (jobData: any) => {
        if (user) {
            const newJob: Job = {
                ...jobData,
                id: `job-${generateUniqueId()}`,
                companyId: user.profile?.id,
                postedDate: new Date(),
                startDate: jobData.startDate ? new Date(jobData.startDate) : null,
            };
            setJobs(prevJobs => [newJob, ...prevJobs]);
        }
    };

    const applyForJob = (jobId: string, engineerId?: string) => {
        let applyingEngineerId: string | undefined = engineerId;

        // If engineerId is not provided, it's an engineer applying for themselves
        if (!applyingEngineerId) {
            if (user && user.role === Role.ENGINEER) {
                applyingEngineerId = user.profile.id;
            } else {
                alert("No engineer specified for application.");
                return;
            }
        }

        if (applications.some(app => app.jobId === jobId && app.engineerId === applyingEngineerId)) {
            alert("This engineer has already applied for this job.");
            return;
        }

        const newApplication: Application = {
            jobId,
            engineerId: applyingEngineerId,
            date: new Date(),
        };
        setApplications(prev => [newApplication, ...prev]);
        alert(`Application for ${engineers.find(e => e.id === applyingEngineerId)?.name} submitted successfully!`);
    };


    const value = { user, jobs, engineers, login, logout, updateEngineerProfile, postJob, startTrial, geminiService, applications, applyForJob, createAndLoginEngineer };

    return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useAppContext = (): AppContextType => {
    const context = useContext(AppContext);
    if (context === undefined) {
        throw new Error('useAppContext must be used within an AppProvider');
    }
    return context;
};
