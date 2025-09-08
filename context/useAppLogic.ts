import { useState, useMemo, useEffect } from 'react';
import {
    User, Page, Role, EngineerProfile, CompanyProfile, ResourcingCompanyProfile, Job,
    Application, Review, Conversation, Message, Contract, Transaction, Project,
    ForumPost, ForumComment, Notification, ProfileTier, Language, Currency, ApplicationStatus,
    ContractStatus, Invoice, InvoiceStatus, PaymentTerms, Timesheet, Insight,
    // FIX: Added missing type imports for enums and product-related types.
    MilestoneStatus, TimesheetStatus, Product, ProductFeatures, CaseStudy,
    // FIX: Added CollaborationPost to the import list to support partner-finding features.
    CollaborationPost,
} from '../types';
import {
    MOCK_USERS, MOCK_ENGINEERS, MOCK_COMPANIES, MOCK_JOBS,
    MOCK_APPLICATIONS, MOCK_REVIEWS, ALL_MOCK_USERS,
    MOCK_CONVERSATIONS, MOCK_MESSAGES, MOCK_CONTRACTS,
    MOCK_TRANSACTIONS, MOCK_PROJECTS, MOCK_FORUM_POSTS, MOCK_FORUM_COMMENTS,
    // FIX: Imported collaboration posts mock data to initialize the new state.
    MOCK_NOTIFICATIONS, MOCK_COLLABORATION_POSTS
} from '../data/mockData';
import { geminiService } from '../services/geminiService';
import i18n from '@/i18n';
import { Chat } from '@google/genai';

// Helper to generate a unique ID
const generateUniqueId = () => Math.random().toString(36).substring(2, 10);

export const useAppLogic = () => {
    // --- CORE STATE ---
    const [user, setUser] = useState<User | null>(null);
    const [page, setPage] = useState<Page>('landing');
    const [allUsers, setAllUsers] = useState<User[]>(ALL_MOCK_USERS);
    const [engineers, setEngineers] = useState<EngineerProfile[]>(MOCK_ENGINEERS);
    const [companies, setCompanies] = useState<(CompanyProfile | ResourcingCompanyProfile)[]>(MOCK_COMPANIES);
    const [jobs, setJobs] = useState<Job[]>(MOCK_JOBS);
    const [applications, setApplications] = useState<Application[]>(MOCK_APPLICATIONS);
    const [reviews, setReviews] = useState<Review[]>(MOCK_REVIEWS);
    const [contracts, setContracts] = useState<Contract[]>(MOCK_CONTRACTS);
    const [transactions, setTransactions] = useState<Transaction[]>(MOCK_TRANSACTIONS);
    const [projects, setProjects] = useState<Project[]>(MOCK_PROJECTS);
    const [notifications, setNotifications] = useState<Notification[]>(MOCK_NOTIFICATIONS);
    const [invoices, setInvoices] = useState<Invoice[]>([]);
    
    // --- MESSAGING STATE ---
    const [conversations, setConversations] = useState<Conversation[]>(MOCK_CONVERSATIONS);
    const [messages, setMessages] = useState<Message[]>(MOCK_MESSAGES);
    const [selectedConversationId, setSelectedConversationId] = useState<string | null>(null);
    const [isAiReplying, setIsAiReplying] = useState(false);
    
    // --- FORUM STATE ---
    const [forumPosts, setForumPosts] = useState<ForumPost[]>(MOCK_FORUM_POSTS);
    const [forumComments, setForumComments] = useState<ForumComment[]>(MOCK_FORUM_COMMENTS);
    // FIX: Added state for collaboration posts, which was missing.
    const [collaborationPosts, setCollaborationPosts] = useState<CollaborationPost[]>(MOCK_COLLABORATION_POSTS);

    // --- UI/CONTEXT STATE ---
    const [currentPageContext, setCurrentPageContext] = useState<string>('Landing Page');
    const [applicantForDeepDive, setApplicantForDeepDive] = useState<{ job: Job, engineer: EngineerProfile } | null>(null);
    const [language, setLanguage] = useState<Language>(Language.ENGLISH);
    const [currency, setCurrency] = useState<Currency>(Currency.GBP);
    const chatSession: Chat | null = useMemo(() => geminiService.chat, []);


    // --- DERIVED STATE & UTILS ---
    const findUserById = (userId: string) => allUsers.find(u => u.id === userId);
    const findUserByProfileId = (profileId: string) => allUsers.find(u => u.profile.id === profileId);
    const t = (key: string) => i18n[language][key] || key;
    const isPremium = (profile: EngineerProfile) => profile.profileTier !== ProfileTier.BASIC;


    // --- AUTH ACTIONS ---
    const login = (loggedInUser: User) => setUser(loggedInUser);
    const logout = () => { setUser(null); setPage('landing'); };
    const createAndLoginUser = (newUser: User) => {
        setAllUsers(prev => [...prev, newUser]);
        setUser(newUser);
    };

    const createAndLoginEngineer = (formData: any) => {
        const newProfile: EngineerProfile = {
            id: `eng-${generateUniqueId()}`,
            name: formData.name,
            avatar: `https://xsgames.co/randomusers/assets/avatars/male/${Math.floor(Math.random() * 50)}.jpg`,
            status: 'active',
            role: Role.ENGINEER,
            discipline: formData.discipline,
            location: formData.location,
            country: formData.country,
            description: 'Newly registered freelance engineer ready for work.',
            experience: formData.experience,
            // FIX: Added missing 'experienceLevel' property to align with EngineerProfile type.
            experienceLevel: formData.experienceLevel,
            profileTier: ProfileTier.BASIC,
            minDayRate: formData.minDayRate,
            maxDayRate: formData.maxDayRate,
            currency: formData.currency,
            availability: new Date(formData.availability),
            skills: [],
            compliance: formData.compliance,
            identity: formData.identity,
            profileViews: 0, searchAppearances: 0, jobInvites: 0, reputation: 50, complianceScore: 50,
            calendarSyncUrl: `https://techsubbies.com/cal/eng-${generateUniqueId()}.ics`,
            badges: [],
            contact: { email: formData.email },
            platformCredits: 1, loyaltyPoints: 100,
        };
        setEngineers(prev => [...prev, newProfile]);
        createAndLoginUser({ id: `user-${newProfile.id}`, role: Role.ENGINEER, profile: newProfile });
    };

    const createAndLoginCompany = (formData: any) => {
        const newProfile: CompanyProfile = {
            id: `comp-${generateUniqueId()}`,
            name: formData.companyName,
            avatar: `https://robohash.org/${formData.companyName}.png?set=set4`,
            status: 'active',
            role: Role.COMPANY,
            website: formData.website,
            location: formData.location,
            contact: { name: formData.contactName, email: formData.email },
        };
        setCompanies(prev => [...prev, newProfile]);
        createAndLoginUser({ id: `user-${newProfile.id}`, role: Role.COMPANY, profile: newProfile });
    };
    
    const createAndLoginResourcingCompany = (formData: any) => {
        const newProfile: ResourcingCompanyProfile = {
            id: `res-${generateUniqueId()}`,
            name: formData.companyName,
            avatar: `https://robohash.org/${formData.companyName}.png?set=set4&bgset=bg2`,
            status: 'active',
            role: Role.RESOURCING_COMPANY,
            website: formData.website,
            location: formData.location,
            contact: { name: formData.contactName, email: formData.email },
            managedEngineerIds: [],
        };
        setCompanies(prev => [...prev, newProfile]);
        createAndLoginUser({ id: `user-${newProfile.id}`, role: Role.RESOURCING_COMPANY, profile: newProfile });
    };


    // --- PROFILE ACTIONS ---
    const updateEngineerProfile = (id: string, updates: Partial<EngineerProfile>) => {
        setEngineers(prev => prev.map(e => e.id === id ? { ...e, ...updates } : e));
    };
    const updateCompanyProfile = (id: string, updates: Partial<CompanyProfile>) => {
        setCompanies(prev => prev.map(c => c.id === id ? { ...c, ...updates } : c));
    };
    const boostProfile = () => {
        if (!user || user.role !== Role.ENGINEER) return;
        updateEngineerProfile(user.profile.id, { isBoosted: true });
        // Simulate boost ending after a while
        setTimeout(() => updateEngineerProfile(user.profile.id, { isBoosted: false }), 12 * 60 * 60 * 1000);
    };
     const reactivateProfile = () => {
        if (user && user.role === Role.ENGINEER) {
            updateEngineerProfile(user.profile.id, { status: 'active' });
            alert("Your profile has been reactivated and is now visible in searches.");
        }
    };
    // FIX: Implemented the missing 'proposeCollaboration' function.
    const proposeCollaboration = (otherProfileId: string, navigateCallback: () => void) => {
        if (!user) return;
        const otherUser = findUserByProfileId(otherProfileId);
        if (!otherUser) return;

        // Monetization check
        const currentUserProfile = user.profile as EngineerProfile;
        const isPremium = currentUserProfile.profileTier !== ProfileTier.BASIC;
        const hasCredits = currentUserProfile.platformCredits > 0;

        if (!isPremium && !hasCredits) {
            alert("This is a premium feature. Please upgrade your profile or purchase credits to propose collaborations.");
            return;
        }

        if (!isPremium && hasCredits) {
            if (!window.confirm("This action will use one of your Platform Credits. Continue?")) {
                return;
            }
            updateEngineerProfile(currentUserProfile.id, { platformCredits: currentUserProfile.platformCredits - 1 });
        }

        const participantIds = [user.id, otherUser.id].sort();
        let existingConvo = conversations.find(c => c.participantIds.join(',') === participantIds.join(','));
        let convoId: string;

        if (existingConvo) {
            convoId = existingConvo.id;
        } else {
            const newConvo: Conversation = {
                id: `convo-${generateUniqueId()}`,
                participantIds: participantIds,
                lastMessageTimestamp: new Date(),
                lastMessageText: "", // will be updated by the message
            };
            setConversations(prev => [newConvo, ...prev]);
            convoId = newConvo.id;
        }
        
        setSelectedConversationId(convoId);

        const collaborationMessage = `Hi ${otherUser.profile.name.split(' ')[0]}, I saw your profile and I think we could be a good fit for a collaboration on a future project. Let me know if you'd be interested in connecting.`;

        sendMessage(convoId, collaborationMessage);
        
        alert(`Collaboration proposal sent to ${otherUser.profile.name}!`);
        navigateCallback();
    };


    // --- JOB & APPLICATION ACTIONS ---
    const postJob = (jobData: any) => {
        if (!user || user.role === Role.ENGINEER) return null;
        const newJob: Job = {
            ...jobData,
            id: `job-${generateUniqueId()}`,
            companyId: user.profile.id,
            postedDate: new Date(),
            status: 'active',
        };
        setJobs(prev => [newJob, ...prev]);
        return newJob;
    };
    const applyForJob = (jobId: string, engineerId: string) => {
        setApplications(prev => [...prev, { jobId, engineerId, date: new Date(), status: ApplicationStatus.APPLIED, reviewed: false }]);
    };
    const applyForJobWithCredit = (jobId: string) => {
        if (!user || user.role !== Role.ENGINEER) return;
        const engineerProfile = user.profile as EngineerProfile;
        if (engineerProfile.platformCredits > 0) {
            updateEngineerProfile(engineerProfile.id, { platformCredits: engineerProfile.platformCredits - 1 });
            setApplications(prev => [...prev, { jobId, engineerId: engineerProfile.id, date: new Date(), status: ApplicationStatus.APPLIED, reviewed: false, isFeatured: true }]);
            alert(`Successfully applied with 1 credit! Your application will be featured.`);
        }
    };
     const inviteEngineerToJob = (jobId: string, engineerId: string) => {
        console.log(`Inviting engineer ${engineerId} to job ${jobId}`);
        // In a real app, this would create a notification for the engineer.
    };
    const sendOffer = (jobId: string, engineerId: string) => {
        setApplications(prev => prev.map(app => app.jobId === jobId && app.engineerId === engineerId ? { ...app, status: ApplicationStatus.OFFERED } : app));
    };
    const acceptOffer = (jobId: string, engineerId: string) => {
        setApplications(prev => prev.map(app => app.jobId === jobId && app.engineerId === engineerId ? { ...app, status: ApplicationStatus.ACCEPTED } : app));
    };
    const declineOffer = (jobId: string, engineerId: string) => {
        setApplications(prev => prev.map(app => app.jobId === jobId && app.engineerId === engineerId ? { ...app, status: ApplicationStatus.DECLINED } : app));
    };
    // FIX: Implemented the missing 'postCollaboration' function.
    const postCollaboration = (postData: Omit<CollaborationPost, 'id' | 'postedByEngineerId' | 'postedDate' | 'status'>) => {
        if (!user || user.role !== Role.ENGINEER) return;

        const currentUserProfile = user.profile as EngineerProfile;
        if (currentUserProfile.profileTier === ProfileTier.BASIC) {
            alert("Posting collaboration opportunities is a premium feature. Please upgrade your profile.");
            return;
        }

        const newPost: CollaborationPost = {
            id: `collab-${generateUniqueId()}`,
            postedByEngineerId: user.profile.id,
            postedDate: new Date(),
            status: 'open',
            ...postData,
        };
        setCollaborationPosts(prev => [newPost, ...prev]);
        alert('Collaboration post created successfully!');
    };

    // --- CONTRACT & PAYMENT ACTIONS ---
    const createContract = (contractData: Contract) => {
        setContracts(prev => [contractData, ...prev]);
    };
    const signContract = (contractId: string, signatureName: string) => {
        if (!user) return;
        setContracts(prev => prev.map(c => {
            if (c.id === contractId) {
                if (user.role === Role.ENGINEER) {
                    return { ...c, engineerSignature: { name: signatureName, date: new Date() }, status: ContractStatus.SIGNED };
                } else {
                    return { ...c, companySignature: { name: signatureName, date: new Date() }, status: ContractStatus.ACTIVE };
                }
            }
            return c;
        }));
    };
     const fundMilestone = (contractId: string, milestoneId: string) => {
        // FIX: Replaced string literal with enum member `MilestoneStatus.FUNDED_IN_PROGRESS`.
        setContracts(prev => prev.map(c => c.id === contractId ? {
            ...c, milestones: c.milestones.map(m => m.id === milestoneId ? { ...m, status: MilestoneStatus.FUNDED_IN_PROGRESS } : m)
        } : c));
    };
    const submitMilestoneForApproval = (contractId: string, milestoneId: string) => {
        // FIX: Replaced string literal with enum member `MilestoneStatus.SUBMITTED_FOR_APPROVAL`.
         setContracts(prev => prev.map(c => c.id === contractId ? {
            ...c, milestones: c.milestones.map(m => m.id === milestoneId ? { ...m, status: MilestoneStatus.SUBMITTED_FOR_APPROVAL } : m)
        } : c));
    };
    const approveMilestone = (contractId: string, milestoneId: string) => {
        // FIX: Replaced string literal with enum member `MilestoneStatus.APPROVED_PENDING_INVOICE`.
        setContracts(prev => prev.map(c => c.id === contractId ? {
            ...c, milestones: c.milestones.map(m => m.id === milestoneId ? { ...m, status: MilestoneStatus.APPROVED_PENDING_INVOICE } : m)
        } : c));
    };
    const submitTimesheet = (contractId: string, timesheetData: Omit<Timesheet, 'id' | 'contractId' | 'engineerId' | 'status'>) => {
        if(!user || user.role !== Role.ENGINEER) return;
        const newTimesheet: Timesheet = {
            id: `ts-${generateUniqueId()}`,
            contractId,
            engineerId: user.profile.id,
            // FIX: Replaced string literal with enum member `TimesheetStatus.SUBMITTED`.
            status: TimesheetStatus.SUBMITTED,
            ...timesheetData,
        };
        setContracts(prev => prev.map(c => c.id === contractId ? { ...c, timesheets: [...(c.timesheets || []), newTimesheet] } : c));
    };
    const approveTimesheet = (contractId: string, timesheetId: string) => {
        // FIX: Replaced string literal with enum member `TimesheetStatus.APPROVED`.
        setContracts(prev => prev.map(c => c.id === contractId ? {
            ...c, timesheets: c.timesheets?.map(ts => ts.id === timesheetId ? { ...ts, status: TimesheetStatus.APPROVED } : ts)
        } : c));
    };
    const generateInvoice = (contractId: string, paymentTerms: PaymentTerms) => {
        const contract = contracts.find(c => c.id === contractId);
        if (!contract || !user) return;
        const items = contract.milestones
            .filter(m => m.status === MilestoneStatus.APPROVED_PENDING_INVOICE)
            .map(m => ({ description: `Milestone: ${m.description}`, amount: m.amount }));
        
        const total = items.reduce((sum, item) => sum + item.amount, 0);

        const newInvoice: Invoice = {
            id: `inv-${generateUniqueId()}`,
            contractId,
            companyId: contract.companyId,
            engineerId: contract.engineerId,
            items,
            total,
            issueDate: new Date(),
            dueDate: new Date(new Date().setDate(new Date().getDate() + parseInt(paymentTerms.split(' ')[1]))),
            status: InvoiceStatus.SENT,
            paymentTerms,
        };
        setInvoices(prev => [newInvoice, ...prev]);
        // Mark milestones as completed
        setContracts(prev => prev.map(c => c.id === contractId ? {
            ...c, milestones: c.milestones.map(m => m.status === MilestoneStatus.APPROVED_PENDING_INVOICE ? { ...m, status: MilestoneStatus.COMPLETED_PAID } : m)
        } : c));
    };
     const payInvoice = (invoiceId: string) => {
        setInvoices(prev => prev.map(inv => inv.id === invoiceId ? { ...inv, status: InvoiceStatus.PAID } : inv));
    };


    // --- MESSAGING ACTIONS ---
    const startConversationAndNavigate = (otherProfileId: string, navigateCallback: () => void) => {
        if (!user) return;
        const otherUser = findUserByProfileId(otherProfileId);
        if (!otherUser) return;

        const participantIds = [user.id, otherUser.id].sort();
        let existingConvo = conversations.find(c => c.participantIds.join(',') === participantIds.join(','));
        if (existingConvo) {
            setSelectedConversationId(existingConvo.id);
        } else {
            const newConvo: Conversation = {
                id: `convo-${generateUniqueId()}`,
                participantIds: participantIds,
                lastMessageTimestamp: new Date(),
                lastMessageText: "Conversation started.",
            };
            setConversations(prev => [newConvo, ...prev]);
            setSelectedConversationId(newConvo.id);
        }
        navigateCallback();
    };

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
        setConversations(prev => prev.map(c => c.id === conversationId ? { ...c, lastMessageText: text, lastMessageTimestamp: new Date() } : c));

        // Simulate AI auto-reply
        const otherParticipantId = conversations.find(c => c.id === conversationId)?.participantIds.find(id => id !== user.id);
        const otherParticipant = findUserById(otherParticipantId || '');
        if (otherParticipant?.profile.name.includes("Neil")) {
            setIsAiReplying(true);
            setTimeout(() => {
                const replyText = geminiService.getAutoReply(text);
                const replyMessage: Message = {
                    id: `msg-${generateUniqueId()}`,
                    conversationId,
                    senderId: otherParticipant!.id,
                    text: replyText,
                    originalText: text.includes('comment vas tu') ? 'I am doing well, thank you!' : undefined,
                    timestamp: new Date(),
                    isRead: false,
                };
                setMessages(prev => [...prev, replyMessage]);
                setConversations(prev => prev.map(c => c.id === conversationId ? { ...c, lastMessageText: replyText, lastMessageTimestamp: new Date() } : c));
                setIsAiReplying(false);
            }, 2500);
        }
    };
    

    // --- FORUM ACTIONS ---
    const createForumPost = async (postData: Omit<ForumPost, 'id'|'authorId'|'timestamp'|'upvotes'|'downvotes'|'status'>) => {
        if (!user) { alert("You must be logged in to post."); return; }
        const moderationResult = await geminiService.moderateForumPost(postData.title, postData.content);
        if (moderationResult.is_safe) {
            const newPost: ForumPost = {
                id: `post-${generateUniqueId()}`,
                authorId: user.profile.id,
                timestamp: new Date(),
                upvotes: 1,
                downvotes: 0,
                status: 'approved',
                ...postData,
            };
            setForumPosts(prev => [newPost, ...prev]);
            alert("Post submitted and approved!");
        } else {
            alert(`Post rejected by AI moderator. Reason: ${moderationResult.reason}`);
        }
    };
    const addForumComment = (commentData: {postId: string, parentId: string | null, content: string}) => {
        if (!user) return;
        const newComment: ForumComment = {
            id: `comment-${generateUniqueId()}`,
            authorId: user.profile.id,
            timestamp: new Date(),
            upvotes: 1,
            downvotes: 0,
            ...commentData,
        };
        setForumComments(prev => [...prev, newComment]);
    };
     const voteOnPost = (postId: string, voteType: 'up' | 'down') => {
        setForumPosts(prev => prev.map(p => p.id === postId ? { ...p, [voteType === 'up' ? 'upvotes' : 'downvotes']: p[voteType === 'up' ? 'upvotes' : 'downvotes'] + 1 } : p));
    };
    const voteOnComment = (commentId: string, voteType: 'up' | 'down') => {
        setForumComments(prev => prev.map(c => c.id === commentId ? { ...c, [voteType === 'up' ? 'upvotes' : 'downvotes']: c[voteType === 'up' ? 'upvotes' : 'downvotes'] + 1 } : c));
    };

    // --- NOTIFICATION ACTIONS ---
    const markNotificationsAsRead = (userId: string) => {
        setNotifications(prev => prev.map(n => n.userId === userId ? { ...n, isRead: true } : n));
    };
    
    // --- STORYBOARD / CASE STUDY ACTIONS ---
    const saveStoryboardAsCaseStudy = (title: string, panels: any[]) => {
        if (!user || user.role !== Role.ENGINEER) return;

        const newCaseStudy: CaseStudy = {
            id: `sb-${generateUniqueId()}`,
            name: title,
            // In a real app, the panels data would be saved and this URL would point to a viewer page.
            // For this demo, a placeholder URL indicates it's an internal storyboard.
            url: `techsubbies://storyboard/${generateUniqueId()}`
        };

        const currentProfile = user.profile as EngineerProfile;
        const updatedCaseStudies = [...(currentProfile.caseStudies || []), newCaseStudy];
        updateEngineerProfile(currentProfile.id, { caseStudies: updatedCaseStudies });
    };

    // --- AI ACTIONS ---
    const getCareerCoaching = async (profile: EngineerProfile): Promise<{ insights?: Insight[], error?: string }> => {
        if (!profile) return { error: "Profile not available for analysis." };
        return geminiService.getCareerCoaching(profile);
    };
    const getApplicantDeepDive = async (job: Job, engineer: EngineerProfile): Promise<{ analysis?: any, error?: string }> => {
        await new Promise(res => setTimeout(res, 2000));
        return {
            analysis: {
                summary: `Overall, ${engineer.name} appears to be a very strong candidate for the ${job.title} role. Their high overall rating and extensive experience align well with the seniority of the position.`,
                strengths: [
                    "Expert-level competency in core required skills like Crestron and Biamp.",
                    "Excellent reputation score suggests reliability and professionalism.",
                    "Fully compliant with all necessary certifications and insurance.",
                ],
                areas_to_probe: [
                    "While their profile lists Project Management, it would be beneficial to ask for specific examples of projects they have led from start to finish.",
                    "Confirm their availability aligns with the project's start date, as their calendar shows them becoming free shortly after.",
                ],
                interview_questions: [
                    "Can you describe a complex issue you had to troubleshoot on a large-scale AV-over-IP system?",
                    "How do you approach client communication and documentation throughout a project lifecycle?",
                ]
            }
        };
    };
    
    // FIX: Added function to analyze product features. This resolves the error in ProductCard.tsx.
    const analyzeProductForFeatures = async (product: Product): Promise<ProductFeatures | { error: string }> => {
        // Simple wrapper for the geminiService method
        return geminiService.analyzeProductForFeatures(product);
    };

    // --- ADMIN ACTIONS ---
    const toggleUserStatus = (profileId: string) => {
        const updateUserInState = (setter: React.Dispatch<React.SetStateAction<any[]>>, role: Role) => {
             setter((prev: any[]) => prev.map(p => {
                if (p.id === profileId) {
                    return { ...p, status: p.status === 'active' ? 'inactive' : 'active' };
                }
                return p;
            }));
        };
        const userToUpdate = allUsers.find(u => u.profile.id === profileId);
        if(!userToUpdate) return;
        
        switch(userToUpdate.role) {
            case Role.ENGINEER: updateUserInState(setEngineers as any, Role.ENGINEER); break;
            case Role.COMPANY: 
            case Role.RESOURCING_COMPANY: updateUserInState(setCompanies as any, userToUpdate.role); break;
            // Admin status cannot be changed via UI for safety
        }

        setAllUsers(prev => prev.map(u => u.profile.id === profileId ? { ...u, profile: { ...u.profile, status: u.profile.status === 'active' ? 'inactive' : 'active' } } : u));
    };

    const toggleJobStatus = (jobId: string) => {
        setJobs(prev => prev.map(j => j.id === jobId ? { ...j, status: j.status === 'active' ? 'inactive' : 'active' } : j));
    };

    // --- MISC ACTIONS ---
    const upgradeProfileTier = (profileId: string, newTier: ProfileTier) => {
        updateEngineerProfile(profileId, { profileTier: newTier });
    };
     const purchasePlatformCredits = (amount: number) => {
        if (!user || user.role !== Role.ENGINEER) return;
        const engineerProfile = user.profile as EngineerProfile;
        updateEngineerProfile(engineerProfile.id, { platformCredits: engineerProfile.platformCredits + amount });
        alert(`${amount} credits purchased successfully!`);
    };
     const redeemLoyaltyPoints = (points: number) => {
        if (!user || user.role !== Role.ENGINEER) return;
        const engineerProfile = user.profile as EngineerProfile;
        if (engineerProfile.loyaltyPoints >= points) {
            updateEngineerProfile(engineerProfile.id, {
                loyaltyPoints: engineerProfile.loyaltyPoints - points,
                platformCredits: engineerProfile.platformCredits + 1 // e.g., 100 points = 1 credit
            });
            alert(`Redeemed ${points} points for 1 Platform Credit!`);
        }
    };
    const reportUser = (profileId: string) => {
        const reportedUser = findUserByProfileId(profileId);
        alert(`An issue has been reported for user: ${reportedUser?.profile.name}. Our support team will investigate.`);
    };


    return {
        // STATE
        user, page, engineers, companies, jobs, applications, reviews, contracts, allUsers, transactions,
        conversations, messages, selectedConversationId, isAiReplying, forumPosts, forumComments,
        projects, notifications, invoices,
        // FIX: Exposed collaborationPosts state.
        collaborationPosts,
        currentPageContext, applicantForDeepDive, language, currency,
        chatSession,

        // STATE SETTERS
        setPage, setSelectedConversationId, setCurrentPageContext, setApplicantForDeepDive, setLanguage, setCurrency,

        // DERIVED & UTILS
        t, isPremium, findUserById, findUserByProfileId,

        // ACTIONS
        login, logout,
        createAndLoginEngineer, createAndLoginCompany, createAndLoginResourcingCompany,
        // FIX: Exposed proposeCollaboration action.
        updateEngineerProfile, updateCompanyProfile, boostProfile, reactivateProfile, proposeCollaboration,
        // FIX: Exposed postCollaboration action.
        postJob, applyForJob, applyForJobWithCredit, inviteEngineerToJob, sendOffer, acceptOffer, declineOffer, postCollaboration,
        createContract, signContract, fundMilestone, submitMilestoneForApproval, approveMilestone,
        submitTimesheet, approveTimesheet, generateInvoice, payInvoice,
        startConversationAndNavigate, sendMessage,
        createForumPost, addForumComment, voteOnPost, voteOnComment,
        markNotificationsAsRead,
        saveStoryboardAsCaseStudy,
        getCareerCoaching, getApplicantDeepDive, analyzeProductForFeatures,
        toggleUserStatus, toggleJobStatus,
        upgradeProfileTier, purchasePlatformCredits, redeemLoyaltyPoints, reportUser,
        geminiService, // Expose geminiService directly for components that use it
    };
};