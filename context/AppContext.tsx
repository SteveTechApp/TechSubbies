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
    rating: number; // 1-5
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
    skills: Skill[];
    certifications: Certification[];
    contact: Contact;
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

// --- Inlined from constants.ts ---
export const APP_NAME = "TechSubbies.com";
export const CURRENCY_ICONS: { [key in Currency]: React.ComponentType<any> } = {
    [Currency.GBP]: PoundSterling,
    [Currency.USD]: DollarSign,
};

// --- Inlined from mockDataGenerator.ts ---
const MOCK_ENGINEER_1: EngineerProfile = {
    id: 'eng-1',
    name: 'Alex Wolfe',
    tagline: 'Senior AV & Network Engineer',
    avatar: 'https://i.pravatar.cc/150?u=alexwolfe',
    location: 'London, UK',
    currency: Currency.GBP,
    dayRate: 550,
    experience: 12,
    availability: new Date('2024-08-01'),
    description: "A highly experienced AV and network engineer with over a decade of experience in designing, implementing, and supporting complex AV systems for corporate and live event environments. Proven ability to lead projects and deliver exceptional results.",
    skills: [
        { name: 'Crestron', rating: 5 }, { name: 'Cisco CCNA', rating: 4 }, { name: 'Dante Level 3', rating: 5 }, { name: 'AutoCAD', rating: 3 }, { name: 'Project Management', rating: 4 }
    ],
    certifications: [
        { name: 'Crestron Certified Programmer', verified: true }, { name: 'Cisco CCNA', verified: true }, { name: 'Dante Certification Level 3', verified: true }
    ],
    contact: { email: 'alex.wolfe@example.com', phone: '01234 567890', website: 'https://alexwolfe.dev', linkedin: 'https://linkedin.com/in/alexwolfe' }
};

const MOCK_ENGINEER_2: EngineerProfile = {
    id: 'eng-2',
    name: 'Samantha Greene',
    tagline: 'Unified Communications Specialist',
    avatar: 'https://i.pravatar.cc/150?u=samanthagreene',
    location: 'Manchester, UK',
    currency: Currency.GBP,
    dayRate: 480,
    experience: 8,
    availability: new Date('2024-07-20'),
    description: "Microsoft Certified Unified Communications specialist focusing on Teams, Zoom, and large-scale video conferencing deployments. Passionate about creating seamless collaboration experiences for global enterprises.",
    skills: [
        { name: 'Microsoft Teams Rooms', rating: 5 }, { name: 'Zoom Rooms', rating: 5 }, { name: 'Polycom', rating: 4 }, { name: 'SIP/H.323', rating: 4 }, { name: 'PowerShell', rating: 3 }
    ],
    certifications: [
        { name: 'Microsoft 365 Certified: Teams Administrator Associate', verified: true }, { name: 'Zoom Certified Integrator', verified: true }
    ],
    contact: { email: 'sam.greene@example.com', phone: '01234 567891', website: 'https://sgreene.com', linkedin: 'https://linkedin.com/in/samanthagreene' }
};

export const MOCK_ENGINEERS = [MOCK_ENGINEER_1, MOCK_ENGINEER_2];

export const MOCK_COMPANIES: CompanyProfile[] = [
    { id: 'comp-1', name: 'Innovate Solutions Ltd.', avatar: 'https://i.pravatar.cc/150?u=innovate' },
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
];

const generateUniqueId = () => Math.random().toString(36).substring(2, 10);

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
const geminiService = {
    generateDescriptionForProfile: async (profile: EngineerProfile) => {
        const prompt = `Generate a compelling but brief professional bio (around 50-70 words) for a freelance tech engineer. Here are their details:\n- Name: ${profile.name}\n- Role/Tagline: ${profile.tagline}\n- Experience: ${profile.experience} years\n- Key Skills: ${profile.skills.slice(0, 5).map(s => s.name).join(', ')}\n\nWrite a professional, first-person summary.`;
        try {
            const response = await ai.models.generateContent({ model: 'gemini-2.5-flash', contents: prompt });
            return String(response.text).trim();
        } catch (error) {
            console.error("Error generating description:", error);
            return profile.description;
        }
    },
    generateSkillsForRole: async (role: string) => {
        const prompt = `Based on the job title "${role}", suggest 5 to 7 key technical skills. For each skill, provide a "rating" from 3 to 5, where 3 is proficient, 4 is advanced, and 5 is expert. This rating should reflect the typical proficiency expected for someone in that role.`;
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
        const prompt = `Based on this project description, suggest a small team of freelance specialists that would be required. For each role, list 2-3 key skills needed.\n\nProject Description: "${description}"`;
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
        const prompt = `Analyze the cost-effectiveness of hiring a freelance engineer for a project.
        Project Description: "${jobDescription}"
        Engineer Profile:
        - Role: ${engineerProfile.tagline}
        - Experience: ${engineerProfile.experience} years
        - Day Rate: ${engineerProfile.currency}${engineerProfile.dayRate}
        - Key Skills: ${engineerProfile.skills.map(s => `${s.name} (rated ${s.rating}/5)`).join(', ')}
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
    updateUserProfile: (updatedProfile: Partial<EngineerProfile>) => void;
    postJob: (jobData: any) => void;
    geminiService: typeof geminiService;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const [jobs, setJobs] = useState<Job[]>(MOCK_JOBS);
    const [engineers, setEngineers] = useState<EngineerProfile[]>(MOCK_ENGINEERS);

    const login = (role: Role) => {
        if (MOCK_USERS[role]) {
            setUser(MOCK_USERS[role]);
        }
    };

    const logout = () => {
        setUser(null);
    };

    const updateUserProfile = (updatedProfile: Partial<EngineerProfile>) => {
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

    const value = { user, jobs, engineers, login, logout, updateUserProfile, postJob, geminiService };

    return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useAppContext = (): AppContextType => {
    const context = useContext(AppContext);
    if (context === undefined) {
        throw new Error('useAppContext must be used within an AppProvider');
    }
    return context;
};