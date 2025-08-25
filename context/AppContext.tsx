import React, { createContext, useContext, useState, ReactNode } from 'react';
import { PoundSterling, DollarSign } from '../components/Icons.tsx';
import { Role, EngineerProfile, User, Job, Application, Currency, Conversation, Message, Review, CompanyProfile } from '../types/index.ts';
import { MOCK_JOBS, MOCK_ENGINEERS, MOCK_USERS, MOCK_USER_FREE_ENGINEER, ALL_MOCK_USERS, MOCK_CONVERSATIONS, MOCK_MESSAGES, MOCK_APPLICATIONS, MOCK_REVIEWS, MOCK_COMPANIES } from '../data/mockData.ts';
import { geminiService } from '../services/geminiService.ts';
import type { Chat } from '@google/genai';

// --- CONSTANTS ---
export const APP_NAME = "TechSubbies.com";
export const CURRENCY_ICONS: { [key in Currency]: React.ComponentType<any> } = {
    [Currency.GBP]: PoundSterling,
    [Currency.USD]: DollarSign,
};

const generateUniqueId = () => Math.random().toString(36).substring(2, 9);

// --- CONTEXT ---
interface AppContextType {
    user: User | null;
    allUsers: User[];
    jobs: Job[];
    companies: CompanyProfile[];
    engineers: EngineerProfile[];
    login: (role: Role, isFreeTier?: boolean) => void;
    logout: () => void;
    updateEngineerProfile: (updatedProfile: Partial<EngineerProfile>) => void;
    updateCompanyProfile: (updatedProfile: Partial<CompanyProfile>) => void;
    postJob: (jobData: any) => void;
    startTrial: () => void;
    geminiService: typeof geminiService;
    applications: Application[];
    applyForJob: (jobId: string, engineerId?: string) => void;
    createAndLoginEngineer: (data: any) => void;
    boostProfile: () => void;
    chatSession: Chat | null;
    // Messaging
    conversations: Conversation[];
    messages: Message[];
    selectedConversationId: string | null;
    setSelectedConversationId: (id: string | null) => void;
    findUserById: (userId: string) => User | undefined;
    findUserByProfileId: (profileId: string) => User | undefined;
    sendMessage: (conversationId: string, text: string) => void;
    startConversationAndNavigate: (otherParticipantProfileId: string, navigateToMessages: () => void) => void;
    // Reviews
    reviews: Review[];
    submitReview: (reviewData: Omit<Review, 'id' | 'date'>) => void;
    // Admin
    toggleUserStatus: (profileId: string) => void;
    toggleJobStatus: (jobId: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const [allUsers, setAllUsers] = useState<User[]>(ALL_MOCK_USERS);
    const [jobs, setJobs] = useState<Job[]>(MOCK_JOBS);
    const [engineers, setEngineers] = useState<EngineerProfile[]>(MOCK_ENGINEERS);
    const [companies, setCompanies] = useState<CompanyProfile[]>(MOCK_COMPANIES);
    const [applications, setApplications] = useState<Application[]>(MOCK_APPLICATIONS);
    const [reviews, setReviews] = useState<Review[]>(MOCK_REVIEWS);
    const [chatSession, setChatSession] = useState<Chat | null>(() => geminiService.startChat());
    
    // Messaging State
    const [conversations, setConversations] = useState<Conversation[]>(MOCK_CONVERSATIONS);
    const [messages, setMessages] = useState<Message[]>(MOCK_MESSAGES);
    const [selectedConversationId, setSelectedConversationId] = useState<string | null>(null);

    const findUserById = (userId: string) => allUsers.find(u => u.id === userId);
    const findUserByProfileId = (profileId: string) => allUsers.find(u => u.profile.id === profileId);

    const login = (role: Role, isFreeTier: boolean = false) => {
        let userToLogin: User;
        if (isFreeTier && role === Role.ENGINEER) {
            userToLogin = MOCK_USER_FREE_ENGINEER;
        } else if (MOCK_USERS[role]) {
             userToLogin = { ...MOCK_USERS[role] }; // Make a copy to modify
        } else {
            return;
        }

        if (userToLogin.profile.status === 'suspended') {
            alert("This account has been suspended. Please contact support.");
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
            status: 'active',
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
        setAllUsers(prev => [...prev, newUser]);
    };


    const updateEngineerProfile = (updatedProfile: Partial<EngineerProfile>) => {
        if (user && user.role === Role.ENGINEER) { // Allow update even if not current user (for admin)
            const profileId = ('skills' in user.profile) ? user.profile.id : null;
            if (profileId) {
                 const newUser = {
                    ...user,
                    profile: { ...user.profile, ...updatedProfile }
                } as User;
                setUser(newUser);
            }
        }
         
        const engineerIndex = engineers.findIndex(e => e.id === (updatedProfile.id || user?.profile.id));
        if (engineerIndex !== -1) {
            const updatedEngineers = [...engineers];
            updatedEngineers[engineerIndex] = { ...updatedEngineers[engineerIndex], ...updatedProfile };
            setEngineers(updatedEngineers);
        }
    };
    
    const updateCompanyProfile = (updatedProfile: Partial<CompanyProfile>) => {
        const profileId = updatedProfile.id || user?.profile.id;
        if (!profileId) return;

        if (user && user.profile.id === profileId) {
             const newUser = {
                ...user,
                profile: { ...user.profile, ...updatedProfile }
            } as User;
            setUser(newUser);
        }
         
        const companyIndex = companies.findIndex(c => c.id === profileId);
        if (companyIndex !== -1) {
            const updatedCompanies = [...companies];
            updatedCompanies[companyIndex] = { ...updatedCompanies[companyIndex], ...updatedProfile };
            setCompanies(updatedCompanies);
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
                status: 'active',
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
            alert("Your profile has been boosted! You'll appear at the top of relevant searches for 12 hours.");
        } else {
            alert("Profile Boost is a premium feature. Please upgrade to a Skills Profile first.");
        }
    };

    // --- Messaging Methods ---
    const sendMessage = (conversationId: string, text: string) => {
        if (!user) return;
        const newMessage: Message = {
            id: `msg-${generateUniqueId()}`,
            conversationId,
            senderId: user.id,
            text,
            timestamp: new Date(),
            isRead: false,
        };
        setMessages(prev => [...prev, newMessage]);

        // Update the conversation's last message
        setConversations(prev => prev.map(c => 
            c.id === conversationId 
                ? { ...c, lastMessageText: text, lastMessageTimestamp: newMessage.timestamp } 
                : c
        ));
    };

    const startConversationAndNavigate = (otherParticipantProfileId: string, navigateToMessages: () => void) => {
        if (!user) {
            alert("You must be logged in to send messages.");
            return;
        }

        const otherParticipant = findUserByProfileId(otherParticipantProfileId);
        if (!otherParticipant) {
            alert("Could not find user to message.");
            return;
        }

        if(user.id === otherParticipant.id) {
            alert("You cannot message yourself.");
            return;
        }

        // Check if a conversation already exists
        let conversation = conversations.find(c =>
            c.participantIds.includes(user.id) && c.participantIds.includes(otherParticipant.id)
        );

        // If not, create a new one
        if (!conversation) {
            const newConversation: Conversation = {
                id: `convo-${generateUniqueId()}`,
                participantIds: [user.id, otherParticipant.id],
                lastMessageText: "Conversation started.",
                lastMessageTimestamp: new Date(),
            };
            setConversations(prev => [newConversation, ...prev]);
            conversation = newConversation;
        }
        
        setSelectedConversationId(conversation.id);
        navigateToMessages();
    };
    
    // --- Review Methods ---
    const submitReview = (reviewData: Omit<Review, 'id' | 'date'>) => {
        const newReview: Review = {
            ...reviewData,
            id: `rev-${generateUniqueId()}`,
            date: new Date(),
        };
        
        // Add review to state
        const updatedReviews = [...reviews, newReview];
        setReviews(updatedReviews);

        // Recalculate engineer's average ratings
        const engineerReviews = updatedReviews.filter(r => r.engineerId === reviewData.engineerId);
        const totalPeer = engineerReviews.reduce((sum, r) => sum + r.peerRating, 0);
        const totalCustomer = engineerReviews.reduce((sum, r) => sum + r.customerRating, 0);
        
        const newPeerRating = parseFloat((totalPeer / engineerReviews.length).toFixed(1));
        const newCustomerRating = parseFloat((totalCustomer / engineerReviews.length).toFixed(1));

        updateEngineerProfile({
            id: reviewData.engineerId,
            peerRating: newPeerRating,
            customerRating: newCustomerRating
        });
        
        // Mark application as completed and reviewed
        setApplications(prev => prev.map(app => 
            (app.jobId === reviewData.jobId && app.engineerId === reviewData.engineerId)
            ? { ...app, completed: true, reviewed: true }
            : app
        ));
        
        alert("Review submitted successfully!");
    };
    
    // --- Admin Methods ---
    const toggleUserStatus = (profileId: string) => {
        const userToUpdate = allUsers.find(u => u.profile.id === profileId);
        if (!userToUpdate) return;
        
        const newStatus = userToUpdate.profile.status === 'active' ? 'suspended' : 'active';
        
        setAllUsers(prev => prev.map(u => u.profile.id === profileId ? { ...u, profile: { ...u.profile, status: newStatus } } : u));
        
        if (userToUpdate.role === Role.ENGINEER) {
            setEngineers(prev => prev.map(e => e.id === profileId ? { ...e, status: newStatus } : e));
        } else if (userToUpdate.role === Role.COMPANY || userToUpdate.role === Role.RESOURCING_COMPANY) {
            setCompanies(prev => prev.map(c => c.id === profileId ? { ...c, status: newStatus } : c));
        }
    };
    
    const toggleJobStatus = (jobId: string) => {
        setJobs(prev => prev.map(j => {
            if (j.id === jobId) {
                return { ...j, status: j.status === 'active' ? 'inactive' : 'active' };
            }
            return j;
        }));
    };


    const value = { user, allUsers, jobs, companies, engineers, login, logout, updateEngineerProfile, updateCompanyProfile, postJob, startTrial, geminiService, applications, applyForJob, createAndLoginEngineer, boostProfile, chatSession, conversations, messages, selectedConversationId, setSelectedConversationId, findUserById, findUserByProfileId, sendMessage, startConversationAndNavigate, reviews, submitReview, toggleUserStatus, toggleJobStatus };

    return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useAppContext = (): AppContextType => {
    const context = useContext(AppContext);
    if (context === undefined) {
        throw new Error('useAppContext must be used within an AppProvider');
    }
    return context;
};