import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { EngineerProfile, CompanyProfile, Job, Application, Review, User, Conversation, Message, Contract, Transaction, Project, ForumPost, ForumComment, Notification, CollaborationPost, ResourcingCompanyProfile } from '../types';
import apiService from '../services/apiService';
import { useAuth } from './AuthContext';

interface AppData {
    engineers: EngineerProfile[];
    companies: (CompanyProfile | ResourcingCompanyProfile)[];
    jobs: Job[];
    applications: Application[];
    reviews: Review[];
    allUsers: User[];
    conversations: Conversation[];
    messages: Message[];
    contracts: Contract[];
    transactions: Transaction[];
    projects: Project[];
    forumPosts: ForumPost[];
    forumComments: ForumComment[];
    notifications: Notification[];
    collaborationPosts: CollaborationPost[];
}

const initialAppState: AppData = {
    engineers: [], companies: [], jobs: [], applications: [], reviews: [], allUsers: [],
    conversations: [], messages: [], contracts: [], transactions: [], projects: [],
    forumPosts: [], forumComments: [], notifications: [], collaborationPosts: [],
};

interface DataContextType {
    isLoading: boolean;
    engineers: EngineerProfile[];
    companies: (CompanyProfile | ResourcingCompanyProfile)[];
    jobs: Job[];
    applications: Application[];
    reviews: Review[];
    allUsers: User[];
    conversations: Conversation[];
    messages: Message[];
    contracts: Contract[];
    transactions: Transaction[];
    projects: Project[];
    forumPosts: ForumPost[];
    forumComments: ForumComment[];
    notifications: Notification[];
    collaborationPosts: CollaborationPost[];
    setAppData: React.Dispatch<React.SetStateAction<AppData>>;
    findUserById: (userId: string) => User | undefined;
    findUserByProfileId: (profileId: string) => User | undefined;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider = ({ children }: { children: ReactNode }) => {
    const { user, isAuthLoading } = useAuth();
    const [isLoading, setIsLoading] = useState(true);
    const [appData, setAppData] = useState(initialAppState);

    useEffect(() => {
        if (isAuthLoading) return;

        const loadData = async () => {
            setIsLoading(true);
            const data = await apiService.getInitialData(user?.role);
            setAppData(data);
            setIsLoading(false);
        };
        loadData();
    }, [isAuthLoading, user?.role]);
    
    const findUserById = (userId: string) => appData.allUsers.find(u => u.id === userId);
    const findUserByProfileId = (profileId: string) => appData.allUsers.find(u => u.profile.id === profileId);

    return (
        <DataContext.Provider value={{ ...appData, isLoading, setAppData, findUserById, findUserByProfileId }}>
            {children}
        </DataContext.Provider>
    );
};

export const useData = (): DataContextType => {
    const context = useContext(DataContext);
    if (!context) {
        throw new Error('useData must be used within a DataProvider');
    }
    return context;
};
