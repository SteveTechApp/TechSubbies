import React, { createContext, useContext, useState, ReactNode } from 'react';
import { PoundSterling, DollarSign } from '../components/Icons.tsx';
import { Role, EngineerProfile, User, Job, Application, Currency } from '../types/index.ts';
import { MOCK_JOBS, MOCK_ENGINEERS, MOCK_USERS, MOCK_USER_FREE_ENGINEER } from '../data/mockData.ts';
import { geminiService } from '../services/geminiService.ts';
import type { Chat } from '@google/genai';

// --- CONSTANTS ---
export const APP_NAME = "TechSubbies.com";
export const CURRENCY_ICONS: { [key in Currency]: React.ComponentType<any> } = {
    [Currency.GBP]: PoundSterling,
    [Currency.USD]: DollarSign,
};

const generateUniqueId = () => Math.random().toString(36).substring(2, 10);

// --- CONTEXT ---
interface AppContextType {
    user: User | null;
    jobs: Job[];
    engineers: EngineerProfile[];
    login: (role: Role, isFreeTier?: boolean) => void;
    logout: () => void;
    updateEngineerProfile: (updatedProfile: Partial<EngineerProfile>) => void;
    postJob: (jobData: any) => void;
    startTrial: () => void;
    geminiService: typeof geminiService;
    applications: Application[];
    applyForJob: (jobId: string, engineerId?: string) => void;
    createAndLoginEngineer: (data: any) => void;
    boostProfile: () => void;
    chatSession: Chat | null;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const [jobs, setJobs] = useState<Job[]>(MOCK_JOBS);
    const [engineers, setEngineers] = useState<EngineerProfile[]>(MOCK_ENGINEERS);
    const [applications, setApplications] = useState<Application[]>([]);
    const [chatSession, setChatSession] = useState<Chat | null>(() => geminiService.startChat());


    const login = (role: Role, isFreeTier: boolean = false) => {
        let userToLogin: User;
        if (isFreeTier && role === Role.ENGINEER) {
            userToLogin = MOCK_USER_FREE_ENGINEER;
        } else if (MOCK_USERS[role]) {
             userToLogin = { ...MOCK_USERS[role] }; // Make a copy to modify
        } else {
            return;
        }

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
            alert("30-Day Skills Profile trial started! You now have access to all premium features.");
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

    const boostProfile = () => {
        if (user && user.role === Role.ENGINEER && 'profileTier' in user.profile && user.profile.profileTier === 'paid') {
            updateEngineerProfile({ isBoosted: true });
            alert("Your profile has been boosted! You'll appear at the top of relevant searches for 24 hours.");
        } else {
            alert("Profile Boost is a premium feature. Please upgrade to a Skills Profile first.");
        }
    };


    const value = { user, jobs, engineers, login, logout, updateEngineerProfile, postJob, startTrial, geminiService, applications, applyForJob, createAndLoginEngineer, boostProfile, chatSession };

    return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useAppContext = (): AppContextType => {
    const context = useContext(AppContext);
    if (context === undefined) {
        throw new Error('useAppContext must be used within an AppProvider');
    }
    return context;
};