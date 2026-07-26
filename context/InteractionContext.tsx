import React, { createContext, useContext, ReactNode, useState } from 'react';
import { useAuth } from './AuthContext';
import { useData } from './DataContext';
import { useSettings } from './SettingsContext';
// FIX: Import useNavigation to access navigation-related context.
import { useNavigation } from './NavigationContext';
import { geminiService } from '../services/geminiService';
import { realtimeService } from '../services/realtimeService';
import apiService from '../services/apiService';
import {
    User, Role, EngineerProfile, CompanyProfile, Job, Application, Review, Conversation, Message,
    Contract, Transaction, Project, ForumPost, ForumComment, Notification, CollaborationPost, ResourcingCompanyProfile,
    // FIX: Added missing TimesheetStatus and Product-related imports.
    Invoice, ApplicationStatus, ContractStatus, MilestoneStatus, Timesheet, PaymentTerms, InvoiceStatus, TimesheetStatus, Product, ProductFeatures,
} from '../types';

interface InteractionContextType extends ReturnType<typeof useData>, ReturnType<typeof useSettings> {
    user: User | null;
    // FIX: Added currentPageContext to the type definition.
    currentPageContext: string;
    // --- Profile Management ---
    updateEngineerProfile: (profileData: Partial<EngineerProfile>) => Promise<void>;
    updateCompanyProfile: (profileData: Partial<CompanyProfile>) => Promise<void>;
    boostProfile: () => void;
    addSkillsToProfile: (skills: any[]) => void;
    reactivateProfile: () => void;
    // --- Job & Application Management ---
    postJob: (jobData: any) => Promise<Job>;
    applyForJob: (jobId: string, engineerId: string) => void;
    applyForJobWithCredit: (jobId: string) => void;
    sendOffer: (jobId: string, engineerId: string) => void;
    inviteEngineerToJob: (jobId: string, engineerId: string) => void;
    // --- Contract & Payment Management ---
    createContract: (contract: any) => void;
    signContract: (contractId: string, signatureName: string) => void;
    fundMilestone: (contractId: string, milestoneId: string) => void;
    submitMilestoneForApproval: (contractId: string, milestoneId: string) => void;
    approveMilestone: (contractId: string, milestoneId: string) => void;
    submitTimesheet: (contractId: string, timesheetData: Omit<Timesheet, 'id' | 'contractId' | 'engineerId' | 'status'>) => void;
    approveTimesheet: (contractId: string, timesheetId: string) => void;
    generateInvoice: (contractId: string, paymentTerms: PaymentTerms) => void;
    // --- Communication ---
    startConversationAndNavigate: (otherPartyProfileId: string, navigateCallback: () => void) => void;
    sendMessage: (conversationId: string, text: string) => Promise<void>;
    // Polls the real backend for any new messages in a conversation and
    // merges them in - used by ChatWindow while a conversation is open,
    // since there's no push/WebSocket connection (see apiService.ts).
    refreshConversationMessages: (conversationId: string) => void;
    // --- AI & Gemini ---
    getApplicantDeepDive: (job: Job, engineer: EngineerProfile) => Promise<any>;
    // FIX: Add missing method definition
    analyzeProductForFeatures: (product: Product) => Promise<ProductFeatures | { error: string }>;
    // --- Admin ---
    toggleUserStatus: (profileId: string) => void;
    toggleJobStatus: (jobId: string) => void;
    // --- Resourcing ---
    createManagedEngineer: (resourcingCompanyId: string, engineerData: any) => void;
    // --- Project Planner ---
    createProject: (projectData: Omit<Project, 'id'>) => void;
    assignEngineerToProjectRole: (roleId: string, engineerId: string) => void;
    // --- Forum ---
    createForumPost: (postData: { title: string; content: string; tags: string[] }) => Promise<void>;
    voteOnPost: (postId: string, voteType: 'up' | 'down') => void;
    addForumComment: (commentData: { postId: string; parentId: string | null; content: string }) => void;
    voteOnComment: (commentId: string, voteType: 'up' | 'down') => void;
    // --- Notifications ---
    markNotificationsAsRead: (userId: string) => void;
    // --- Collaboration ---
    postCollaboration: (postData: any) => void;
    proposeCollaboration: (targetEngineerId: string, navigateCallback: () => void) => void;
    // --- Misc ---
    purchasePlatformCredits: (amount: number) => void;
    redeemLoyaltyPoints: (points: number) => void;
    saveStoryboardAsCaseStudy: (title: string, panels: any[]) => void;
    applicantForDeepDive: { job: Job, engineer: EngineerProfile } | null;
    setApplicantForDeepDive: React.Dispatch<React.SetStateAction<{ job: Job, engineer: EngineerProfile } | null>>;
    // FIX: Added missing user creation methods from AuthContext.
    createAndLoginCompany: (data: any) => Promise<void>;
    createAndLoginResourcingCompany: (data: any) => Promise<void>;
    createAndLoginEngineer: (data: any) => Promise<void>;
}

const InteractionContext = createContext<InteractionContextType | undefined>(undefined);

export const InteractionProvider = ({ children }: { children: ReactNode }) => {
    // FIX: Destructure all properties from useAuth to make them available.
    const auth = useAuth();
    const { user } = auth;
    const data = useData();
    const settings = useSettings();
    // FIX: Consume useNavigation to get currentPageContext.
    const { currentPageContext } = useNavigation();
    const [applicantForDeepDive, setApplicantForDeepDive] = useState<{ job: Job, engineer: EngineerProfile } | null>(null);

    const { setAppData } = data;

    // --- Profile Management ---
    const updateEngineerProfile = async (profileData: Partial<EngineerProfile>) => {
        if (!user || user.role !== Role.ENGINEER) return;
        // FIX: Correctly update user state with a type guard and cast to prevent type errors.
        auth.setUser(prevUser => {
            if (!prevUser || prevUser.role !== Role.ENGINEER) return prevUser;
            return {
                ...prevUser,
                profile: {
                    ...(prevUser.profile as EngineerProfile),
                    ...profileData,
                },
            };
        });
        setAppData(prev => ({ ...prev, engineers: prev.engineers.map(e => e.id === user.profile.id ? { ...e, ...profileData } : e) }));
        await apiService.updateEngineerProfile(user.profile.id, profileData);
        alert('Profile saved!');
    };
    
    const updateCompanyProfile = async (profileData: Partial<CompanyProfile>) => {
        if (!user || (user.role !== Role.COMPANY && user.role !== Role.RESOURCING_COMPANY)) return;
        // FIX: Correctly update user state with a type guard and cast to prevent type errors.
        auth.setUser(prevUser => {
            if (!prevUser || (prevUser.role !== Role.COMPANY && prevUser.role !== Role.RESOURCING_COMPANY)) return prevUser;
            return {
                ...prevUser,
                profile: {
                    ...(prevUser.profile as CompanyProfile), // Safe cast as ResourcingCompanyProfile extends CompanyProfile
                    ...profileData,
                },
            };
        });
        setAppData(prev => ({ ...prev, companies: prev.companies.map(c => c.id === user.profile.id ? { ...c, ...profileData } : c) }));
        await apiService.updateCompanyProfile(user.profile.id, profileData);
    };

    const boostProfile = () => updateEngineerProfile({ isBoosted: true });
    const addSkillsToProfile = (skills: any[]) => alert(`${skills.length} skills added!`);
    const reactivateProfile = () => updateEngineerProfile({ status: 'active' });

    // --- Job Management ---
    const postJob = async (jobData: any): Promise<Job> => {
        const newJob = await apiService.postJob(jobData);
        setAppData(prev => ({ ...prev, jobs: [newJob, ...prev.jobs] }));
        return newJob;
    };

    const applyForJob = (jobId: string, engineerId: string) => {
        const newApp = { jobId, engineerId, date: new Date(), status: ApplicationStatus.APPLIED, reviewed: false };
        // Optimistic update so the UI responds immediately, then persist to
        // the real backend (see apiService.applyForJob). If the backend
        // rejects it (e.g. already applied, job closed), roll the optimistic
        // entry back out rather than leaving a phantom application in view.
        setAppData(prev => ({ ...prev, applications: [...prev.applications, newApp] }));
        apiService.applyForJob(jobId, engineerId)
            .then(() => alert('Application submitted!'))
            .catch((error: any) => {
                setAppData(prev => ({ ...prev, applications: prev.applications.filter(a => a !== newApp) }));
                alert(error?.message || 'Could not submit application.');
            });
    };
    
    const applyForJobWithCredit = (jobId: string) => {
        if (!user || user.role !== Role.ENGINEER) return;
        const profile = user.profile as EngineerProfile;
        if(profile.platformCredits > 0){
            updateEngineerProfile({ platformCredits: profile.platformCredits - 1 });
            applyForJob(jobId, user.profile.id);
        }
    };
    
    const sendOffer = (jobId: string, engineerId: string) => {
        setAppData(prev => ({ ...prev, applications: prev.applications.map(app => app.jobId === jobId && app.engineerId === engineerId ? { ...app, status: ApplicationStatus.OFFERED } : app) }));
    };

    const inviteEngineerToJob = (jobId: string, engineerId: string) => {
        console.log(`Inviting engineer ${engineerId} to job ${jobId}`);
        alert('Invite sent!');
    };

    // --- Contracts, milestones, timesheets & invoices ---
    // Each of these applies its change locally right away (so the UI feels
    // instant) and then persists it to the real backend in the background
    // (see apiService.ts / backend/src/routes/contracts.ts). If the backend
    // confirms it, the locally-applied change is replaced with the
    // authoritative version it returns; if the backend rejects it (or there
    // simply isn't a signed-in backend session), the earlier
    // optimistic/local state stands - a null response from apiService means
    // "nothing to reconcile with", not "undo this". Failure only rolls back
    // when the backend actively said no. Mirrors the pattern already used
    // for applyForJob above.
    const createContract = (contract: Contract) => {
        setAppData(prev => ({ ...prev, contracts: [...prev.contracts, contract] }));
        apiService.createContract(contract)
            .then(saved => setAppData(prev => ({ ...prev, contracts: prev.contracts.map(c => c.id === contract.id ? saved : c) })))
            .catch((error: any) => {
                setAppData(prev => ({ ...prev, contracts: prev.contracts.filter(c => c.id !== contract.id) }));
                alert(error?.message || 'Could not create contract.');
            });
    };

    const signContract = (contractId: string, signatureName: string) => {
        const previousContracts = data.contracts;
        setAppData(prev => ({ ...prev, contracts: prev.contracts.map(c => {
            if (c.id === contractId) {
                if(user?.role === Role.ENGINEER) return { ...c, status: ContractStatus.SIGNED, engineerSignature: { name: signatureName, date: new Date() } };
                if(user?.role === Role.COMPANY || user?.role === Role.ADMIN) return { ...c, status: ContractStatus.ACTIVE, companySignature: { name: signatureName, date: new Date() } };
            }
            return c;
        })}));
        apiService.signContract(contractId, signatureName)
            .then(updated => {
                if (updated) setAppData(prev => ({ ...prev, contracts: prev.contracts.map(c => c.id === contractId ? updated : c) }));
            })
            .catch((error: any) => {
                setAppData(prev => ({ ...prev, contracts: previousContracts }));
                alert(error?.message || 'Could not save your signature.');
            });
    };
    const fundMilestone = (contractId: string, milestoneId: string) => {
        const previousContracts = data.contracts;
        setAppData(prev => ({ ...prev, contracts: prev.contracts.map(c => c.id === contractId ? { ...c, milestones: c.milestones.map(m => m.id === milestoneId ? {...m, status: MilestoneStatus.FUNDED_IN_PROGRESS} : m) } : c) }));
        apiService.fundMilestone(contractId, milestoneId)
            .then(updated => {
                if (updated) setAppData(prev => ({ ...prev, contracts: prev.contracts.map(c => c.id === contractId ? updated : c) }));
            })
            .catch((error: any) => {
                setAppData(prev => ({ ...prev, contracts: previousContracts }));
                alert(error?.message || 'Could not fund milestone.');
            });
    };
    const submitMilestoneForApproval = (contractId: string, milestoneId: string) => {
        const previousContracts = data.contracts;
        setAppData(prev => ({ ...prev, contracts: prev.contracts.map(c => c.id === contractId ? { ...c, milestones: c.milestones.map(m => m.id === milestoneId ? {...m, status: MilestoneStatus.SUBMITTED_FOR_APPROVAL} : m) } : c) }));
        apiService.submitMilestoneForApproval(contractId, milestoneId)
            .then(updated => {
                if (updated) setAppData(prev => ({ ...prev, contracts: prev.contracts.map(c => c.id === contractId ? updated : c) }));
            })
            .catch((error: any) => {
                setAppData(prev => ({ ...prev, contracts: previousContracts }));
                alert(error?.message || 'Could not submit milestone for approval.');
            });
    };
    const approveMilestone = (contractId: string, milestoneId: string) => {
        const previousContracts = data.contracts;
        setAppData(prev => ({ ...prev, contracts: prev.contracts.map(c => c.id === contractId ? { ...c, milestones: c.milestones.map(m => m.id === milestoneId ? {...m, status: MilestoneStatus.APPROVED_PENDING_INVOICE} : m) } : c) }));
        apiService.approveMilestone(contractId, milestoneId)
            .then(updated => {
                if (updated) setAppData(prev => ({ ...prev, contracts: prev.contracts.map(c => c.id === contractId ? updated : c) }));
            })
            .catch((error: any) => {
                setAppData(prev => ({ ...prev, contracts: previousContracts }));
                alert(error?.message || 'Could not approve milestone.');
            });
    };

    const submitTimesheet = (contractId: string, timesheetData: Omit<Timesheet, 'id' | 'contractId' | 'engineerId' | 'status'>) => {
        const previousContracts = data.contracts;
        const newTimesheet: Timesheet = { ...timesheetData, id: `ts-${Date.now()}`, contractId, engineerId: user!.profile.id, status: TimesheetStatus.SUBMITTED };
        setAppData(prev => ({ ...prev, contracts: prev.contracts.map(c => c.id === contractId ? { ...c, timesheets: [...(c.timesheets || []), newTimesheet] } : c) }));
        apiService.submitTimesheet(contractId, timesheetData)
            .then(updated => {
                if (updated) setAppData(prev => ({ ...prev, contracts: prev.contracts.map(c => c.id === contractId ? updated : c) }));
            })
            .catch((error: any) => {
                setAppData(prev => ({ ...prev, contracts: previousContracts }));
                alert(error?.message || 'Could not submit timesheet.');
            });
    };

    const approveTimesheet = (contractId: string, timesheetId: string) => {
        const previousContracts = data.contracts;
        setAppData(prev => ({ ...prev, contracts: prev.contracts.map(c => c.id === contractId ? { ...c, timesheets: (c.timesheets || []).map(ts => ts.id === timesheetId ? {...ts, status: TimesheetStatus.PAID } : ts) } : c) }));
        apiService.approveTimesheet(contractId, timesheetId)
            .then(updated => {
                if (updated) setAppData(prev => ({ ...prev, contracts: prev.contracts.map(c => c.id === contractId ? updated : c) }));
            })
            .catch((error: any) => {
                setAppData(prev => ({ ...prev, contracts: previousContracts }));
                alert(error?.message || 'Could not approve timesheet.');
            });
    };

    const generateInvoice = (contractId: string, paymentTerms: PaymentTerms) => {
         const contract = data.contracts.find(c => c.id === contractId);
         if (!contract) return;

         const itemsToInvoice = contract.milestones
             .filter(m => m.status === MilestoneStatus.APPROVED_PENDING_INVOICE)
             .map(m => ({ description: `Milestone: ${m.description}`, amount: m.amount }));

         const total = itemsToInvoice.reduce((sum, item) => sum + item.amount, 0);

         const newInvoice: Invoice = {
             id: `inv-${Date.now()}`,
             contractId,
             companyId: contract.companyId,
             engineerId: contract.engineerId,
             items: itemsToInvoice,
             total,
             issueDate: new Date(),
             dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), // Mocking Net 14
             status: InvoiceStatus.SENT
         };

         const previousInvoices = data.invoices;
         const previousContracts = data.contracts;

         setAppData(prev => ({ ...prev, invoices: [...prev.invoices, newInvoice], contracts: prev.contracts.map(c => c.id === contractId ? {...c, milestones: c.milestones.map(m => m.status === MilestoneStatus.APPROVED_PENDING_INVOICE ? {...m, status: MilestoneStatus.COMPLETED_PAID} : m)} : c)}));

         apiService.generateInvoice(contractId, paymentTerms)
            .then(saved => {
                if (saved) setAppData(prev => ({ ...prev, invoices: prev.invoices.map(inv => inv.id === newInvoice.id ? saved : inv) }));
                alert("Invoice generated and sent!");
            })
            .catch((error: any) => {
                setAppData(prev => ({ ...prev, invoices: previousInvoices, contracts: previousContracts }));
                alert(error?.message || 'Could not generate invoice.');
            });
    };
    
    // otherPartyProfileId is a *profile* id (engineer/company), while
    // conversations are keyed by *user* ids - findUserByProfileId bridges
    // the two, same lookup ChatWindow/MessagesView already rely on.
    const startConversationAndNavigate = (otherPartyProfileId: string, navigateCallback: () => void) => {
        const otherUser = data.findUserByProfileId(otherPartyProfileId);
        if (!user || !otherUser) {
            navigateCallback();
            return;
        }

        const existing = data.conversations.find(
            c => c.participantIds.includes(user.id) && c.participantIds.includes(otherUser.id)
        );
        if (existing) {
            navigateCallback();
            return;
        }

        const optimisticConversation: Conversation = {
            id: `convo-${Date.now()}`,
            participantIds: [user.id, otherUser.id],
            lastMessageTimestamp: new Date(),
            lastMessageText: '',
        };
        setAppData(prev => ({ ...prev, conversations: [optimisticConversation, ...prev.conversations] }));
        apiService.startOrGetConversation(otherUser.id)
            .then(saved => {
                if (saved) setAppData(prev => ({ ...prev, conversations: prev.conversations.map(c => c.id === optimisticConversation.id ? saved : c) }));
            })
            .catch((error: any) => {
                setAppData(prev => ({ ...prev, conversations: prev.conversations.filter(c => c.id !== optimisticConversation.id) }));
                alert(error?.message || 'Could not start conversation.');
            });
        navigateCallback();
    };

    const sendMessage = async (conversationId: string, text: string) => {
        const newMessage = { id: `msg-${Date.now()}`, conversationId, senderId: user!.id, text, timestamp: new Date(), isRead: false };
        setAppData(prev => ({
            ...prev,
            messages: [...prev.messages, newMessage],
            conversations: prev.conversations.map(c => c.id === conversationId ? { ...c, lastMessageText: text, lastMessageTimestamp: newMessage.timestamp } : c),
        }));
        realtimeService.simulateNewMessage(conversationId, newMessage); // Simulate push

        try {
            const saved = await apiService.sendMessage(conversationId, text);
            if (saved) {
                setAppData(prev => ({ ...prev, messages: prev.messages.map(m => m.id === newMessage.id ? saved : m) }));
            }
        } catch (error: any) {
            setAppData(prev => ({ ...prev, messages: prev.messages.filter(m => m.id !== newMessage.id) }));
            alert(error?.message || 'Could not send message.');
        }
    };

    // Pulls the latest messages for a conversation from the real backend
    // and merges them in. Called on an interval by ChatWindow while a
    // conversation is open, to approximate real-time delivery without a
    // WebSocket connection. `null` means "no session, or unreachable" - left
    // alone rather than treated as "no messages", so it can never wipe out
    // messages that only exist locally (e.g. no backend running at all).
    const refreshConversationMessages = (conversationId: string) => {
        apiService.getBackendMessagesForConversation(conversationId).then(backendMessages => {
            if (backendMessages === null) return;
            setAppData(prev => {
                const otherConversationsMessages = prev.messages.filter(m => m.conversationId !== conversationId);
                return { ...prev, messages: [...otherConversationsMessages, ...backendMessages] };
            });
        });
    };

    const getApplicantDeepDive = async (job: Job, engineer: EngineerProfile) => ({ analysis: { summary: "This is a mock AI summary.", strengths: ["Good with Crestron"], areas_to_probe: ["Biamp experience"], interview_questions: ["Tell me about your largest project."] }});
    // FIX: Add missing method implementation
    const analyzeProductForFeatures = (product: Product) => {
        return geminiService.analyzeProductForFeatures(product);
    };
    
    const toggleUserStatus = (profileId: string) => alert(`Toggling status for ${profileId}`);
    const toggleJobStatus = (jobId: string) => alert(`Toggling status for ${jobId}`);
    const createManagedEngineer = (resourcingCompanyId: string, engineerData: any) => alert(`Creating engineer for ${resourcingCompanyId}`);
    
    const createProject = (projectData: Omit<Project, 'id'>) => {
        const newProject = { ...projectData, id: `proj-${Date.now()}` } as Project;
        setAppData(prev => ({...prev, projects: [newProject, ...prev.projects]}));
    };
    const assignEngineerToProjectRole = (roleId: string, engineerId: string) => {
        setAppData(prev => ({...prev, projects: prev.projects.map(p => ({...p, roles: p.roles.map(r => r.id === roleId ? {...r, assignedEngineerId: engineerId} : r)}))}));
    };
    
    const createForumPost = async (postData: any) => {
        alert('Post submitted for moderation.');
    };
    const voteOnPost = (postId: string, voteType: 'up' | 'down') => {
        setAppData(prev => ({...prev, forumPosts: prev.forumPosts.map(p => p.id === postId ? {...p, upvotes: p.upvotes + (voteType === 'up' ? 1 : 0), downvotes: p.downvotes + (voteType === 'down' ? 1 : 0)}: p)}));
    };
    const addForumComment = (commentData: any) => {
         const newComment = { ...commentData, id: `comment-${Date.now()}`, authorId: user!.profile.id, timestamp: new Date(), upvotes: 0, downvotes: 0 };
         setAppData(prev => ({...prev, forumComments: [...prev.forumComments, newComment]}));
    };
    const voteOnComment = (commentId: string, voteType: 'up' | 'down') => {
        setAppData(prev => ({...prev, forumComments: prev.forumComments.map(c => c.id === commentId ? {...c, upvotes: c.upvotes + (voteType === 'up' ? 1 : 0), downvotes: c.downvotes + (voteType === 'down' ? 1 : 0)}: c)}));
    };
    
    const markNotificationsAsRead = (userId: string) => {
        setAppData(prev => ({...prev, notifications: prev.notifications.map(n => n.userId === userId ? {...n, isRead: true} : n)}));
    };
    
    const postCollaboration = (postData: any) => alert('Collaboration posted');
    const proposeCollaboration = (targetEngineerId: string, cb: () => void) => {
        alert(`Collaboration proposed to ${targetEngineerId}`);
        cb();
    };
    
    const purchasePlatformCredits = (amount: number) => {
        if(!user || user.role !== Role.ENGINEER) return;
        const currentProfile = user.profile as EngineerProfile;
        updateEngineerProfile({ platformCredits: (currentProfile.platformCredits || 0) + amount });
    };

    const redeemLoyaltyPoints = (points: number) => {
         if(!user || user.role !== Role.ENGINEER) return;
        const currentProfile = user.profile as EngineerProfile;
        if(currentProfile.loyaltyPoints >= points) {
            updateEngineerProfile({ loyaltyPoints: currentProfile.loyaltyPoints - points });
            alert('Reward redeemed!');
        }
    };
    
    const saveStoryboardAsCaseStudy = (title: string, panels: any[]) => {
         if(!user || user.role !== Role.ENGINEER) return;
        const newCaseStudy = { id: `cs-${Date.now()}`, name: title, url: `wingman://storyboard/${Date.now()}`, panels };
        const currentProfile = user.profile as EngineerProfile;
        updateEngineerProfile({ caseStudies: [...(currentProfile.caseStudies || []), newCaseStudy] });
    };
    
    const value: InteractionContextType = {
        user,
        ...data,
        ...settings,
        // Functions
        currentPageContext,
        createAndLoginCompany: auth.createAndLoginCompany,
        createAndLoginResourcingCompany: auth.createAndLoginResourcingCompany,
        createAndLoginEngineer: auth.createAndLoginEngineer,
        updateEngineerProfile,
        updateCompanyProfile,
        boostProfile,
        addSkillsToProfile,
        reactivateProfile,
        postJob,
        applyForJob,
        applyForJobWithCredit,
        sendOffer,
        inviteEngineerToJob,
        createContract,
        signContract,
        fundMilestone,
        submitMilestoneForApproval,
        approveMilestone,
        submitTimesheet,
        approveTimesheet,
        generateInvoice,
        startConversationAndNavigate,
        sendMessage,
        refreshConversationMessages,
        getApplicantDeepDive,
        analyzeProductForFeatures,
        toggleUserStatus,
        toggleJobStatus,
        createManagedEngineer,
        createProject,
        assignEngineerToProjectRole,
        createForumPost,
        voteOnPost,
        addForumComment,
        voteOnComment,
        markNotificationsAsRead,
        postCollaboration,
        proposeCollaboration,
        purchasePlatformCredits,
        redeemLoyaltyPoints,
        saveStoryboardAsCaseStudy,
        applicantForDeepDive, 
        setApplicantForDeepDive,
    };

    return (
        <InteractionContext.Provider value={value}>
            {children}
        </InteractionContext.Provider>
    );
};

export const useAppContext = (): InteractionContextType => {
    const context = useContext(InteractionContext);
    if (!context) {
        throw new Error('useAppContext must be used within an InteractionProvider');
    }
    return context;
};
