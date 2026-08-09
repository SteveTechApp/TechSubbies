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
    Invoice, ApplicationStatus, ContractStatus, MilestoneStatus, Timesheet, InvoiceStatus, TimesheetStatus, Product, ProductFeatures,
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
    createContract: (contract: any) => Promise<any>;
    signContract: (contractId: string, signatureName: string) => void;
    completeContract: (contractId: string) => Promise<any>;
    fundMilestone: (contractId: string, milestoneId: string) => void;
    submitMilestoneForApproval: (contractId: string, milestoneId: string) => void;
    approveMilestone: (contractId: string, milestoneId: string) => void;
    submitTimesheet: (contractId: string, timesheetData: Omit<Timesheet, 'id' | 'contractId' | 'engineerId' | 'status'>) => Promise<any>;
    approveTimesheet: (contractId: string, timesheetId: string) => Promise<any>;
    // --- Communication ---
    startConversationAndNavigate: (otherPartyProfileId: string, navigateCallback: () => void) => void;
    sendMessage: (conversationId: string, text: string) => Promise<void>;
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
        try {
            const saved = await apiService.updateEngineerProfile(user.profile.id, profileData);
            auth.setUser(prevUser => prevUser?.role === Role.ENGINEER ? { ...prevUser, profile: saved } : prevUser);
            setAppData(prev => ({ ...prev, engineers: prev.engineers.map(e => e.id === user.profile.id ? saved : e) }));
            alert('Profile saved!');
        } catch (error: any) { alert(error.message || 'Profile could not be saved.'); }
    };
    
    const updateCompanyProfile = async (profileData: Partial<CompanyProfile>) => {
        if (!user || (user.role !== Role.COMPANY && user.role !== Role.RESOURCING_COMPANY)) return;
        try {
            const saved = await apiService.updateCompanyProfile(user.profile.id, profileData);
            auth.setUser(prevUser => prevUser && (prevUser.role === Role.COMPANY || prevUser.role === Role.RESOURCING_COMPANY) ? { ...prevUser, profile: saved } : prevUser);
            setAppData(prev => ({ ...prev, companies: prev.companies.map(c => c.id === user.profile.id ? saved : c) }));
        } catch (error: any) { alert(error.message || 'Company profile could not be saved.'); }
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

    const applyForJob = async (jobId: string, engineerId: string) => {
        try {
            const newApp = await apiService.applyForJob(jobId, engineerId);
            setAppData(prev => ({ ...prev, applications: [...prev.applications, newApp] }));
            alert('Application submitted!');
        } catch (error: any) { alert(error.message || 'Could not submit application.'); }
    };
    
    const applyForJobWithCredit = (jobId: string) => {
        if (!user || user.role !== Role.ENGINEER) return;
        const profile = user.profile as EngineerProfile;
        if(profile.platformCredits > 0){
            updateEngineerProfile({ platformCredits: profile.platformCredits - 1 });
            applyForJob(jobId, user.profile.id);
        }
    };
    
    const sendOffer = async (jobId: string, engineerId: string) => {
        const application: any = data.applications.find(app => app.jobId === jobId && app.engineerId === engineerId);
        if (!application?.id) return alert('This application must be persisted before an offer can be sent.');
        const updated = await apiService.updateApplicationStatus(application.id, 'Offered');
        setAppData(prev => ({ ...prev, applications: prev.applications.map((app: any) => app.id === application.id ? updated : app) }));
    };

    const inviteEngineerToJob = (jobId: string, engineerId: string) => {
        console.log(`Inviting engineer ${engineerId} to job ${jobId}`);
        alert('Invite sent!');
    };

    const createContract = async (contract: Contract) => {
        const application: any = data.applications.find(app => app.jobId === contract.jobId && app.engineerId === contract.engineerId);
        if (!application?.id) throw new Error('Select a persisted application before creating a contract.');
        try {
            const saved = await apiService.createMarketplaceContract(application.id, contract.description, (contract as any).overrideExclusionReason, contract.type);
            setAppData(prev => ({...prev, contracts: [...prev.contracts, saved]}));
            setAppData(prev => ({...prev, applications: prev.applications.map((item:any)=>item.id===application.id?{...item,status:'Offered'}:item)}));
            return saved;
        } catch (error: any) { throw new Error(error.message || 'Could not create contract.'); }
    };
    const signContract = async (contractId: string, signatureName: string) => {
        try {
            const saved = await apiService.signMarketplaceContract(contractId);
            setAppData(prev => ({ ...prev, contracts: prev.contracts.map(c => c.id === contractId ? saved : c) }));
            return saved;
        } catch (error: any) { alert(error.message || 'Could not sign contract.'); }
    };
    const completeContract = async (contractId: string) => {
        try {
            const saved = await apiService.completeMarketplaceContract(contractId);
            setAppData(prev => ({ ...prev, contracts: prev.contracts.map(c => c.id === contractId ? saved : c) }));
            return saved;
        } catch (error: any) { alert(error.message || 'Could not complete contract.'); }
    };
    const fundMilestone = (contractId: string, milestoneId: string) => {
        setAppData(prev => ({ ...prev, contracts: prev.contracts.map(c => c.id === contractId ? { ...c, milestones: c.milestones.map(m => m.id === milestoneId ? {...m, status: MilestoneStatus.FUNDED_IN_PROGRESS} : m) } : c) }));
    };
    const submitMilestoneForApproval = (contractId: string, milestoneId: string) => {
        setAppData(prev => ({ ...prev, contracts: prev.contracts.map(c => c.id === contractId ? { ...c, milestones: c.milestones.map(m => m.id === milestoneId ? {...m, status: MilestoneStatus.SUBMITTED_FOR_APPROVAL} : m) } : c) }));
    };
    const approveMilestone = (contractId: string, milestoneId: string) => {
        setAppData(prev => ({ ...prev, contracts: prev.contracts.map(c => c.id === contractId ? { ...c, milestones: c.milestones.map(m => m.id === milestoneId ? {...m, status: MilestoneStatus.APPROVED_PENDING_INVOICE} : m) } : c) }));
    };

    const submitTimesheet = async (contractId: string, timesheetData: Omit<Timesheet, 'id' | 'contractId' | 'engineerId' | 'status'>) => {
        try {
            const saved = await apiService.submitTimesheet(contractId, { period: timesheetData.period, hours: timesheetData.hours || (timesheetData.days || 0) * 8, days:timesheetData.days, workSummary: timesheetData.workSummary || 'Work completed' });
            setAppData(prev => ({ ...prev, contracts: prev.contracts.map(c => c.id === contractId ? { ...c, timesheets: [...(c.timesheets || []), saved] } : c) }));
            return saved;
        } catch (error: any) { alert(error.message || 'Could not submit timesheet.'); }
    };

    const approveTimesheet = async (contractId: string, timesheetId: string) => {
         try {
             const saved = await apiService.reviewTimesheet(timesheetId, 'approved');
             setAppData(prev => ({ ...prev, contracts: prev.contracts.map(c => c.id === contractId ? { ...c, timesheets: (c.timesheets || []).map(ts => ts.id === timesheetId ? saved : ts) } : c) }));
             return saved;
         } catch (error: any) { alert(error.message || 'Could not approve timesheet.'); }
    };
    
    const startConversationAndNavigate = (otherPartyProfileId: string, navigateCallback: () => void) => {
        alert(`Starting conversation with ${otherPartyProfileId}`);
        navigateCallback();
    };

    const sendMessage = async (conversationId: string, text: string) => {
        await new Promise(resolve => setTimeout(resolve, 500));
        const newMessage = { id: `msg-${Date.now()}`, conversationId, senderId: user!.id, text, timestamp: new Date(), isRead: false };
        setAppData(prev => ({...prev, messages: [...prev.messages, newMessage]}));
        realtimeService.simulateNewMessage(conversationId, newMessage); // Simulate push
    };

    const getApplicantDeepDive = async (job: Job, engineer: EngineerProfile) => {const shortlist=await apiService.getJobShortlist(job.id);const candidate=shortlist.candidates.find((item)=>item.engineerId===engineer.id);if(!candidate)throw new Error('This engineer has not applied for the selected job.');const probes=candidate.risks;return{analysis:{summary:`${candidate.outcome} candidate with an explainable suitability score of ${candidate.score}/100. This assessment uses declared profile and application data only.`,strengths:candidate.reasons,areas_to_probe:probes,interview_questions:probes.length?probes.map((risk)=>`Please provide practical evidence addressing: ${risk}`):['Describe the most comparable assignment you delivered and the evidence available.']}};};
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
        completeContract,
        fundMilestone,
        submitMilestoneForApproval,
        approveMilestone,
        submitTimesheet,
        approveTimesheet,
        startConversationAndNavigate,
        sendMessage,
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
