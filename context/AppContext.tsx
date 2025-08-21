import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Role, User, Job, EngineerProfile } from '../types.ts';
import { MOCK_USERS, MOCK_JOBS, MOCK_ENGINEERS } from '../services/mockDataGenerator.ts';

const generateUniqueId = () => Math.random().toString(36).substring(2, 10);

interface AppContextType {
    user: User | null;
    jobs: Job[];
    engineers: EngineerProfile[];
    login: (role: Role) => void;
    logout: () => void;
    updateUserProfile: (updatedProfile: Partial<EngineerProfile>) => void;
    postJob: (jobData: any) => void;
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
        if (user) {
            const newUser = {
                ...user,
                profile: {
                    ...user.profile,
                    ...updatedProfile,
                }
            };
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

    const value = { user, jobs, engineers, login, logout, updateUserProfile, postJob };

    return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useAppContext = (): AppContextType => {
    const context = useContext(AppContext);
    if (context === undefined) {
        throw new Error('useAppContext must be used within an AppProvider');
    }
    return context;
};
