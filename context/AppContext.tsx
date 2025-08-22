import React, { createContext, useContext, useState, ReactNode } from 'react';
import { GoogleGenAI, Type } from "@google/genai";
import { PoundSterling, DollarSign } from '../components/Icons.tsx';

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

export interface Skill {
    name: string;
    rating: number; // 0-100 (represents general proficiency for basic skills)
}

export interface DetailedSkill {
    name: string;
    rating: number; // 0-100 (represents specific knowledge for specialist skills)
}

export interface JobRoleSkills {
    roleName: string;
    skills: DetailedSkill[];
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
    tagline: string;
    location: string;
    currency: Currency;
    dayRate: number;
    experience: number; // years
    availability: Date;
    description: string;
    skills: Skill[]; // Basic skills for free tier
    specialistJobRoles?: JobRoleSkills[]; // Detailed skills for paid tier
    certifications: Certification[];
    contact: Contact;
    profileTier: 'free' | 'paid';

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
}

export type UserProfile = EngineerProfile | CompanyProfile;

export interface User {
    id: string;
    role: Role;
    profile: UserProfile;
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

// --- Inlined from mockDataGenerator.ts ---
// PAID AV Engineer
const MOCK_ENGINEER_1: EngineerProfile = {
    id: 'eng-1',
    name: 'Neil Bishop',
    firstName: 'Neil',
    surname: 'Bishop',
    title: 'Mr',
    tagline: 'Lead AV Commissioning Engineer',
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
    specialistJobRoles: [
        {
            roleName: 'Lead AV Commissioning Engineer',
            skills: [
                { name: 'Crestron DM NVX Commissioning', rating: 95 }, 
                { name: 'Biamp Tesira Server Configuration', rating: 90 }, 
                { name: 'Q-SYS Core Programming', rating: 85 }, 
                { name: 'Dante Level 3 Troubleshooting', rating: 98 }, 
                { name: 'Shure MXA920 Setup', rating: 93 },
                { name: 'Complex System Fault Finding', rating: 100 }
            ]
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
    caseStudies: [
        { id: 'cs-1', name: 'Corporate HQ Audiovisual Integration', url: 'https://example.com/case-study-1' },
        { id: 'cs-2', name: 'Luxury Residential Smart Home System', url: 'https://example.com/case-study-2' },
    ],
};

// FREE IT Engineer
const MOCK_ENGINEER_2: EngineerProfile = {
    id: 'eng-2',
    name: 'Samantha Greene',
    firstName: 'Samantha',
    surname: 'Greene',
    tagline: 'IT Support Specialist',
    avatar: 'https://i.pravatar.cc/150?u=samanthagreene',
    location: 'Manchester, UK',
    currency: Currency.GBP,
    dayRate: 350,
    experience: 8,
    availability: new Date('2024-07-20'),
    description: "Microsoft Certified support specialist focusing on SME infrastructure, Office 365, and user support. Passionate about creating efficient and secure IT environments.",
    profileTier: 'free',
    skills: [ // Only basic skills, no specialist roles
        { name: 'Microsoft 365 Admin', rating: 92 }, 
        { name: 'Active Directory', rating: 90 }, 
        { name: 'Network Troubleshooting', rating: 88 }, 
        { name: 'Hardware Support', rating: 85 },
    ],
    certifications: [
        { name: 'Microsoft 365 Certified: Modern Desktop Administrator Associate', verified: true }, 
    ],
    contact: { email: 'sam.greene@example.com', phone: '01234 567891', website: 'https://sgreene.com', linkedin: 'https://linkedin.com/in/samanthagreene' },
    caseStudies: [],
};

// PAID IT Engineer
const MOCK_ENGINEER_3: EngineerProfile = {
    id: 'eng-3',
    name: 'David Chen',
    firstName: 'David',
    surname: 'Chen',
    tagline: 'Cloud & Network Engineer',
    avatar: 'https://i.pravatar.cc/150?u=davidchen',
    location: 'Birmingham, UK',
    currency: Currency.GBP,
    dayRate: 600,
    experience: 10,
    availability: new Date('2024-09-15'),
    description: "AWS Certified Solutions Architect with a deep background in Cisco networking. Specializes in designing and implementing scalable, secure cloud infrastructure and hybrid networks.",
    profileTier: 'paid',
    skills: [ // Summary skills for card view
        { name: 'Cloud Architecture (AWS)', rating: 95 },
        { name: 'Network Engineering', rating: 94 },
        { name: 'Cybersecurity', rating: 88 },
    ],
    specialistJobRoles: [
        {
            roleName: 'Cloud Engineer',
            skills: [
                { name: 'AWS EC2 & S3 Configuration', rating: 98 },
                { name: 'AWS VPC Peering', rating: 92 },
                { name: 'Infrastructure as Code (Terraform)', rating: 90 },
                { name: 'Azure Active Directory', rating: 85 },
            ]
        },
        {
            roleName: 'Network Engineer',
            skills: [
                { name: 'Cisco Router/Switch CLI', rating: 95 },
                { name: 'BGP & OSPF Routing Protocols', rating: 93 },
                { name: 'Palo Alto Firewall Policy', rating: 89 },
                { name: 'VPN Configuration (IPSec)', rating: 91 },
            ]
        }
    ],
    certifications: [
        { name: 'AWS Certified Solutions Architect - Professional', verified: true },
        { name: 'Cisco Certified Network Professional (CCNP)', verified: true },
    ],
    contact: { email: 'david.chen@example.com', phone: '07111222333', website: 'https://chencloud.dev', linkedin: 'https://linkedin.com/in/davidchen' },
    caseStudies: [],
};


export const MOCK_ENGINEERS = [MOCK_ENGINEER_1, MOCK_ENGINEER_2, MOCK_ENGINEER_3];

export const MOCK_COMPANIES: CompanyProfile[] = [
    { id: 'comp-1', name: 'Innovate AV Ltd.', avatar: 'https://i.pravatar.cc/150?u=innovate' },
    { id: 'comp-2', name: 'Future Systems Inc.', avatar: 'https://i.pravatar.cc/150?u=future' },
];

export const MOCK_USERS: { [key in Role]: User } = {
    [Role.ENGINEER]: { id: 'user-1', role: Role.ENGINEER, profile: MOCK_ENGINEER_1 },
    [Role.COMPANY]: { id: 'user-2', role: Role.COMPANY, profile: MOCK_COMPANIES[0] },
    [Role.RESOURCING_COMPANY]: { id: 'user-3', role: Role.RESOURCING_COMPANY, profile: { id: 'res-1', name: 'AV Placements', avatar: 'https://i.pravatar.cc/150?u=resourcing' } },
    [Role.ADMIN]: { id: 'user-4', role: Role.ADMIN, profile: { id: 'admin-1', name: 'Admin User', avatar: 'https://i.pravatar.cc/150?u=admin' } },
};

export const MOCK_JOBS: Job[] = [
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

const generateUniqueId = () => Math.random().toString(36).substring(2, 10);

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
const geminiService = {
    generateDescriptionForProfile: async (profile: EngineerProfile) => {
        const prompt = `Generate a compelling but brief professional bio (around 50-70 words) for a freelance Tech engineer. Here are their details:\n- Name: ${profile.name}\n- Role/Tagline: ${profile.tagline}\n- Experience: ${profile.experience} years\n- Key Skills: ${profile.skills.slice(0, 5).map(s => s.name).join(', ')}\n\nWrite a professional, first-person summary.`;
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
        - Role: ${engineerProfile.tagline}
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
    upgradeUserTier: () => void;
    geminiService: typeof geminiService;
    applications: Application[];
    applyForJob: (jobId: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const [jobs, setJobs] = useState<Job[]>(MOCK_JOBS);
    const [engineers, setEngineers] = useState<EngineerProfile[]>(MOCK_ENGINEERS);
    const [applications, setApplications] = useState<Application[]>([]);

    const login = (role: Role) => {
        if (MOCK_USERS[role]) {
            setUser(MOCK_USERS[role]);
        }
    };

    const logout = () => {
        setUser(null);
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

    const upgradeUserTier = () => {
        if (user && 'skills' in user.profile) {
            updateEngineerProfile({ profileTier: 'paid' });
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

    const applyForJob = (jobId: string) => {
        if (user && user.role === Role.ENGINEER) {
            if (applications.some(app => app.jobId === jobId && app.engineerId === user.profile.id)) {
                alert("You have already applied for this job.");
                return;
            }
            const newApplication: Application = {
                jobId,
                engineerId: user.profile.id,
                date: new Date(),
            };
            setApplications(prev => [newApplication, ...prev]);
            alert("Application submitted successfully!");
        }
    };


    const value = { user, jobs, engineers, login, logout, updateEngineerProfile, postJob, upgradeUserTier, geminiService, applications, applyForJob };

    return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useAppContext = (): AppContextType => {
    const context = useContext(AppContext);
    if (context === undefined) {
        throw new Error('useAppContext must be used within an AppProvider');
    }
    return context;
};
