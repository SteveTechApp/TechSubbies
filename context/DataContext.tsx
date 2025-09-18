import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { EngineerProfile, CompanyProfile, Job, Application, Review, User, Conversation, Message, Contract, Transaction, Project, ForumPost, ForumComment, Notification, CollaborationPost, ResourcingCompanyProfile, Invoice } from '../types';
import apiService from '../services/apiService';

const initialAppState = {
    engineers: [], companies: [], jobs: [], applications: [], reviews: [], allUsers: [],
    conversations: [], messages: [], contracts: [], transactions: [], projects: [],
    forumPosts: [], forumComments: [], notifications: [], collaborationPosts: [],
    invoices: [],
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
    invoices: Invoice[];
    setAppData: React.Dispatch<React.SetStateAction<typeof initialAppState>>;
    findUserById: (userId: string) => User | undefined;
    findUserByProfileId: (profileId: string) => User | undefined;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider = ({ children }: { children: ReactNode }) => {
    const [isLoading, setIsLoading] = useState(true);
    const [appData, setAppData] = useState(initialAppState);

    useEffect(() => {
        const loadData = async () => {
            setIsLoading(true);
            const data = await apiService.getInitialData();
            setAppData(data as any); // Cast as any to handle potential missing keys in mock setup
            setIsLoading(false);
        };
        loadData();
    }, []);
    
    const findUserById = (userId: string) => appData.allUsers.find(u => u.id === userId);
    const findUserByProfileId = (profileId: string) => appData.allUsers.find(u => u.profile.id === profileId);

    return (
        <DataContext.Provider value={{ ...appData, isLoading, setAppData, findUserById, findUserByProfileId } as DataContextType}>
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
