// FIX: Created the `useAppLogic` hook to resolve the "not a module" error and centralize app state.
import { useState, useCallback, useMemo } from 'react';
import {
    User, Role, Page, EngineerProfile, CompanyProfile, Job, Application, Review, Conversation,
    Message, Contract, Transaction, ForumPost, ForumComment, Notification, ProfileTier,
    ApplicationStatus, ContractStatus, Invoice, InvoiceStatus, PaymentTerms, MilestoneStatus, Timesheet,
    // FIX: Imported the `Insight` type to resolve a "Cannot find name" error.
    Insight,
    ResourcingCompanyProfile
} from '../types';
import { geminiService } from '../services/geminiService';
import {
    MOCK_USERS, MOCK_USER_FREE_ENGINEER, ALL_MOCK_USERS,
    MOCK_ENGINEERS, MOCK_COMPANIES, MOCK_JOBS, MOCK_APPLICATIONS,
    MOCK_REVIEWS, MOCK_CONVERSATIONS, MOCK_MESSAGES, MOCK_CONTRACTS, MOCK_TRANSACTIONS,
    MOCK_FORUM_POSTS, MOCK_FORUM_COMMENTS, MOCK_NOTIFICATIONS, MOCK_PROJECTS
} from '../data/mockData';
import { eSignatureService } from '../services/eSignatureService';

export const useAppLogic = () => {
    // --- STATE MANAGEMENT ---
    const [user, setUser] = useState<User | null>(null);
    const [currentPage, setCurrentPage] = useState<Page>('landing');
    const [currentPageContext, setCurrentPageContext] = useState<string>('Landing Page');

    // Mock Database State
    const [allUsers, setAllUsers] = useState<User[]>(ALL_MOCK_USERS);
    const [engineers, setEngineers] = useState<EngineerProfile[]>(MOCK_ENGINEERS);
    // FIX: Changed the state type to a union to correctly handle CompanyProfile and ResourcingCompanyProfile.
    const [companies, setCompanies] = useState<(CompanyProfile | ResourcingCompanyProfile)[]>(MOCK_COMPANIES);
    const [jobs, setJobs] = useState<Job[]>(MOCK_JOBS);
    const [applications, setApplications] = useState<Application[]>(MOCK_APPLICATIONS);
    const [reviews, setReviews] = useState<Review[]>(MOCK_REVIEWS);
    const [conversations, setConversations] = useState<Conversation[]>(MOCK_CONVERSATIONS);
    const [messages, setMessages] = useState<Message[]>(MOCK_MESSAGES);
    const [contracts, setContracts] = useState<Contract[]>(MOCK_CONTRACTS);
    const [transactions, setTransactions] = useState<Transaction[]>(MOCK_TRANSACTIONS);
    const [forumPosts, setForumPosts] = useState<ForumPost[]>(MOCK_FORUM_POSTS);
    const [forumComments, setForumComments] = useState<ForumComment[]>(MOCK_FORUM_COMMENTS);
    const [notifications, setNotifications] = useState<Notification[]>(MOCK_NOTIFICATIONS);
    const [projects, setProjects] = useState<any[]>(MOCK_PROJECTS);
    const [invoices, setInvoices] = useState<Invoice[]>([]);

    const [selectedConversationId, setSelectedConversationId] = useState<string | null>(null);
    const [isAiReplying, setIsAiReplying] = useState(false);

    // --- AUTH ---
    const login = useCallback((user: User) => {
        setUser(user);
    }, []);

    const logout = useCallback(() => {
        setUser(null);
        setCurrentPage('landing');
    }, []);
    
    // --- USER & PROFILE MANAGEMENT ---
    const updateEngineerProfile = useCallback((profileId: string, updates: Partial<EngineerProfile>) => {
        setEngineers(prev => prev.map(p => p.id === profileId ? { ...p, ...updates } : p));
        if (user?.profile.id === profileId) {
            // FIX: Correctly type the updated profile to avoid type mismatch errors when updating the user state.
            setUser(prevUser => {
                if (!prevUser) return null;
                const updatedProfile = { ...prevUser.profile, ...updates } as EngineerProfile;
                return { ...prevUser, profile: updatedProfile };
            });
        }
    }, [user]);

    const updateCompanyProfile = useCallback((profileId: string, updates: Partial<CompanyProfile>) => {
        setCompanies(prev => prev.map(p => p.id === profileId ? { ...p, ...updates } : p));
    }, []);
    
    const boostProfile = useCallback(() => {
         if (user && user.role === Role.ENGINEER) {
            updateEngineerProfile(user.profile.id, { isBoosted: true });
            setTimeout(() => {
                updateEngineerProfile(user.profile.id, { isBoosted: false });
                alert("Your profile boost has expired.");
            }, 12 * 60 * 60 * 1000); // 12 hours
        }
    }, [user, updateEngineerProfile]);

    const findUserById = useCallback((userId: string) => {
        return allUsers.find(u => u.id === userId) || null;
    }, [allUsers]);

    const findUserByProfileId = useCallback((profileId: string) => {
        return allUsers.find(u => u.profile.id === profileId) || null;
    }, [allUsers]);

    // --- JOB & APPLICATION LOGIC ---
    const postJob = useCallback((jobData: any) => {
        if (!user || user.profile.role !== Role.COMPANY) return null;
        const newJob: Job = {
            ...jobData,
            id: `job-${Date.now()}`,
            companyId: user.profile.id,
            postedDate: new Date(),
            status: 'active',
        };
        setJobs(prev => [newJob, ...prev]);
        return newJob;
    }, [user]);

    const applyForJob = useCallback((jobId: string, engineerId: string) => {
        const newApplication: Application = {
            jobId,
            engineerId,
            date: new Date(),
            status: ApplicationStatus.APPLIED,
            reviewed: false,
        };
        setApplications(prev => [...prev, newApplication]);
    }, []);

    const sendOffer = useCallback((jobId: string, engineerId: string) => {
        setApplications(prev => prev.map(app => (app.jobId === jobId && app.engineerId === engineerId) ? { ...app, status: ApplicationStatus.OFFERED } : app));
    }, []);

    const acceptOffer = useCallback((jobId: string, engineerId: string) => {
        setApplications(prev => prev.map(app => (app.jobId === jobId && app.engineerId === engineerId) ? { ...app, status: ApplicationStatus.ACCEPTED } : app));
    }, []);

    const declineOffer = useCallback((jobId: string, engineerId: string) => {
        setApplications(prev => prev.map(app => (app.jobId === jobId && app.engineerId === engineerId) ? { ...app, status: ApplicationStatus.REJECTED } : app));
    }, []);

    // --- MESSAGING ---
    const startConversationAndNavigate = useCallback((otherProfileId: string, navigate: () => void) => {
        if (!user) return;
        const otherUser = findUserByProfileId(otherProfileId);
        if (!otherUser) return;

        const existingConvo = conversations.find(c => c.participantIds.includes(user.id) && c.participantIds.includes(otherUser.id));

        if (existingConvo) {
            setSelectedConversationId(existingConvo.id);
        } else {
            const newConvo: Conversation = {
                id: `convo-${Date.now()}`,
                participantIds: [user.id, otherUser.id],
                lastMessageTimestamp: new Date(),
                lastMessageText: "Conversation started.",
            };
            setConversations(prev => [newConvo, ...prev]);
            setSelectedConversationId(newConvo.id);
        }
        navigate();
    }, [user, conversations, findUserByProfileId]);
    
     const sendMessage = useCallback(async (conversationId: string, text: string) => {
        if (!user) return;

        const newMessage: Message = {
            id: `msg-${Date.now()}`,
            conversationId,
            senderId: user.id,
            text,
            timestamp: new Date(),
            isRead: false,
        };
        setMessages(prev => [...prev, newMessage]);

        const convo = conversations.find(c => c.id === conversationId);
        if (convo) {
            const otherUserId = convo.participantIds.find(id => id !== user.id);
            const otherUser = findUserById(otherUserId!);
            if (otherUser?.profile.role === Role.ENGINEER) {
                 setIsAiReplying(true);
                 await new Promise(resolve => setTimeout(resolve, 1500));
                 
                 const aiResponse: Message = {
                     id: `msg-${Date.now() + 1}`,
                     conversationId,
                     senderId: otherUserId!,
                     text: `This is a simulated AI response to "${text}"`,
                     timestamp: new Date(),
                     isRead: false,
                 };
                 setMessages(prev => [...prev, aiResponse]);
                 setIsAiReplying(false);
            }
        }
    }, [user, conversations, findUserById]);

    // --- CONTRACTS & PAYMENTS ---
    const createContract = useCallback(async (contract: Contract) => {
        const engineerUser = findUserByProfileId(contract.engineerId);
        if(!engineerUser) return;

        const response = await eSignatureService.createSignatureRequest(contract.id, (engineerUser.profile as EngineerProfile).contact.email);
        if (response.success) {
            const newContract = { ...contract, status: ContractStatus.PENDING_SIGNATURE };
            setContracts(prev => [...prev, newContract]);
            alert(`Contract created and sent to ${engineerUser.profile.name} for signature.`);
        } else {
            alert("Failed to send contract for signature.");
        }
    }, [findUserByProfileId]);

    const signContract = useCallback((contractId: string, signatureName: string) => {
        setContracts(prev => prev.map(c => {
            if (c.id === contractId && user) {
                if (user.role === Role.ENGINEER && !c.engineerSignature) {
                    return { ...c, engineerSignature: { name: signatureName, date: new Date() }, status: ContractStatus.SIGNED };
                }
                if ((user.role === Role.COMPANY || user.role === Role.ADMIN) && !c.companySignature) {
                    return { ...c, companySignature: { name: signatureName, date: new Date() }, status: ContractStatus.ACTIVE };
                }
            }
            return c;
        }));
    }, [user]);

    // --- DUMMY IMPLEMENTATIONS FOR MISSING FEATURES ---
    const t = (key: string) => key;
    const isPremium = (profile: EngineerProfile) => profile.profileTier !== ProfileTier.BASIC;

    // --- ADMIN ---
    const toggleUserStatus = (profileId: string) => {
        setEngineers(prev => prev.map(p => p.id === profileId ? { ...p, status: p.status === 'active' ? 'suspended' : 'active' } : p));
        setCompanies(prev => prev.map(p => p.id === profileId ? { ...p, status: p.status === 'active' ? 'suspended' : 'active' } : p));
    };
    const toggleJobStatus = (jobId: string) => {
        setJobs(prev => prev.map(j => j.id === jobId ? { ...j, status: j.status === 'active' ? 'inactive' : 'active' } : j));
    };

    // --- NEW MOCKS & LOGIC ---
    const createAndLoginEngineer = (formData: any) => {
        // In a real app, this would hit a backend to create the user. Here, we just create a mock profile.
        const newProfile: EngineerProfile = {
            id: `eng-${Date.now()}`,
            name: formData.name,
            avatar: `https://xsgames.co/randomusers/assets/avatars/pixel/${Math.floor(Math.random() * 50)}.jpg`,
            status: 'active',
            role: Role.ENGINEER,
            discipline: formData.discipline,
            location: formData.location,
            country: formData.country,
            description: "A newly registered, talented engineer ready for their next challenge.",
            experience: formData.experience,
            profileTier: ProfileTier.BASIC,
            minDayRate: formData.minDayRate,
            maxDayRate: formData.maxDayRate,
            currency: formData.currency,
            availability: new Date(formData.availability),
            skills: [],
            compliance: formData.compliance,
            identity: formData.identity,
            profileViews: 0,
            searchAppearances: 0,
            jobInvites: 0,
            reputation: 70,
            complianceScore: 50,
            calendarSyncUrl: `https://techsubbies.com/cal/${Date.now()}.ics`,
            badges: [],
            contact: { email: formData.email, phone: '07123456789' }
        };
        const newUser: User = { id: `user-${newProfile.id}`, role: Role.ENGINEER, profile: newProfile };
        setEngineers(prev => [...prev, newProfile]);
        setAllUsers(prev => [...prev, newUser]);
        setUser(newUser);
    };

    const createAndLoginCompany = (formData: any) => {
        const newProfile: CompanyProfile = {
            id: `comp-${Date.now()}`,
            name: formData.companyName,
            avatar: `https://robohash.org/${formData.companyName}.png?set=set4`,
            logo: `https://robohash.org/${formData.companyName}.png?set=set4`,
            status: 'active',
            role: Role.COMPANY,
            website: formData.website,
            location: formData.location,
            contact: { name: formData.contactName, email: formData.email }
        };
        const newUser: User = { id: `user-${newProfile.id}`, role: Role.COMPANY, profile: newProfile };
        setCompanies(prev => [...prev, newProfile]);
        setAllUsers(prev => [...prev, newUser]);
        setUser(newUser);
    };

    const createAndLoginResourcingCompany = (formData: any) => {
        // Similar to above, but for resourcing companies
    };
    
    const inviteEngineerToJob = (jobId: string, engineerId: string) => {
        console.log(`Invited engineer ${engineerId} to job ${jobId}`);
        // Here you would create a notification
    };
    
    const voteOnPost = (postId: string, vote: 'up' | 'down') => {
        setForumPosts(posts => posts.map(p => {
            if (p.id === postId) {
                return { ...p, upvotes: p.upvotes + (vote === 'up' ? 1 : 0), downvotes: p.downvotes + (vote === 'down' ? 1 : 0) };
            }
            return p;
        }));
    };
    
    const voteOnComment = (commentId: string, vote: 'up' | 'down') => {
        setForumComments(comments => comments.map(c => {
            if (c.id === commentId) {
                 return { ...c, upvotes: c.upvotes + (vote === 'up' ? 1 : 0), downvotes: c.downvotes + (vote === 'down' ? 1 : 0) };
            }
            return c;
        }));
    };

    const createForumPost = async (postData: { title: string, content: string, tags: string[] }) => {
        if (!user) return;
        // Simulate AI moderation
        await new Promise(resolve => setTimeout(resolve, 1000));
        const newPost: ForumPost = {
            ...postData,
            id: `post-${Date.now()}`,
            authorId: user.profile.id,
            timestamp: new Date(),
            upvotes: 1,
            downvotes: 0,
            status: 'approved',
        };
        setForumPosts(prev => [newPost, ...prev]);
        alert("Post submitted and approved!");
    };
    
    const addForumComment = (commentData: { postId: string, parentId: string | null, content: string }) => {
        if (!user) return;
        const newComment: ForumComment = {
            ...commentData,
            id: `comment-${Date.now()}`,
            authorId: user.profile.id,
            timestamp: new Date(),
            upvotes: 0,
            downvotes: 0,
        };
        setForumComments(prev => [...prev, newComment]);
    };
    
     const markNotificationsAsRead = (userId: string) => {
        setNotifications(prev => prev.map(n => n.userId === userId ? { ...n, isRead: true } : n));
    };

    const fundMilestone = (contractId: string, milestoneId: string) => {
         setContracts(prev => prev.map(c => {
            if (c.id === contractId) {
                return { ...c, milestones: c.milestones.map(m => m.id === milestoneId ? { ...m, status: MilestoneStatus.FUNDED_IN_PROGRESS } : m) };
            }
            return c;
        }));
    };

    const submitMilestoneForApproval = (contractId: string, milestoneId: string) => {
         setContracts(prev => prev.map(c => {
            if (c.id === contractId) {
                return { ...c, milestones: c.milestones.map(m => m.id === milestoneId ? { ...m, status: MilestoneStatus.SUBMITTED_FOR_APPROVAL } : m) };
            }
            return c;
        }));
    };

     const approveMilestone = (contractId: string, milestoneId: string) => {
         setContracts(prev => prev.map(c => {
            if (c.id === contractId) {
                return { ...c, milestones: c.milestones.map(m => m.id === milestoneId ? { ...m, status: MilestoneStatus.APPROVED_PENDING_INVOICE } : m) };
            }
            return c;
        }));
    };

    const submitTimesheet = (contractId: string, timesheetData: Omit<Timesheet, 'id' | 'contractId' | 'engineerId' | 'status'>) => {
        if (!user) return;
        const newTimesheet: Timesheet = {
            id: `ts-${Date.now()}`,
            contractId,
            engineerId: user.profile.id,
            // FIX: Changed string literal 'submitted' to the correct enum value.
            status: TimesheetStatus.SUBMITTED,
            ...timesheetData,
        };
        setContracts(prev => prev.map(c => c.id === contractId ? { ...c, timesheets: [...(c.timesheets || []), newTimesheet] } : c));
    };

    const approveTimesheet = (contractId: string, timesheetId: string) => {
        setContracts(prev => prev.map(c => {
            if (c.id === contractId) {
                // FIX: Changed string literal 'approved' to the correct enum value.
                return { ...c, timesheets: (c.timesheets || []).map(ts => ts.id === timesheetId ? { ...ts, status: TimesheetStatus.APPROVED } : ts) };
            }
            return c;
        }));
    };

     const generateInvoice = (contractId: string, paymentTerms: PaymentTerms) => {
        const contract = contracts.find(c => c.id === contractId);
        if (!contract || !user) return;

        const itemsToInvoice = contract.milestones
            .filter(m => m.status === MilestoneStatus.APPROVED_PENDING_INVOICE)
            .map(m => ({ description: `Milestone: ${m.description}`, amount: m.amount }));
        
        if (itemsToInvoice.length === 0) {
            alert("No approved milestones to invoice.");
            return;
        }

        const total = itemsToInvoice.reduce((sum, item) => sum + item.amount, 0);
        const issueDate = new Date();
        const dueDate = new Date();
        const days = parseInt(paymentTerms.split(' ')[1]);
        dueDate.setDate(issueDate.getDate() + days);

        const newInvoice: Invoice = {
            id: `inv-${Date.now()}`,
            contractId,
            companyId: contract.companyId,
            engineerId: user.profile.id,
            issueDate,
            dueDate,
            items: itemsToInvoice,
            total,
            status: InvoiceStatus.SENT,
            paymentTerms,
        };
        setInvoices(prev => [...prev, newInvoice]);
        // Also update milestone statuses
        setContracts(prev => prev.map(c => {
            if (c.id === contractId) {
                return { ...c, milestones: c.milestones.map(m => m.status === MilestoneStatus.APPROVED_PENDING_INVOICE ? { ...m, status: MilestoneStatus.COMPLETED_PAID } : m) };
            }
            return c;
        }));
    };

     const payInvoice = (invoiceId: string) => {
        setInvoices(prev => prev.map(inv => inv.id === invoiceId ? { ...inv, status: InvoiceStatus.PAID } : inv));
    };

    const reportUser = (profileId: string) => {
        alert(`Issue reported for user ${profileId}. Our team will investigate.`);
    };
    
    const upgradeProfileTier = (profileId: string, tier: ProfileTier) => {
        updateEngineerProfile(profileId, { profileTier: tier });
    };

    const reactivateProfile = () => {
        if (user) updateEngineerProfile(user.profile.id, { status: 'active' });
    };

    const getCareerCoaching = async (): Promise<{ insights?: Insight[], error?: string }> => {
        await new Promise(resolve => setTimeout(resolve, 1500));
        return {
            insights: [
                { type: 'Upskill', suggestion: "Your profile is strong in Crestron, but jobs for 'AV Systems Designer' increasingly require Dante Level 3 certification.", callToAction: { text: "Find Training", view: "AI Tools" } },
                { type: 'Profile Enhancement', suggestion: "Your bio is concise, but could be improved by adding specific project outcomes, such as '...resulting in a 20% reduction in setup time'.", callToAction: { text: "Edit Profile", view: "Manage Profile" } },
                { type: 'Certification', suggestion: "Given your IT experience, obtaining the 'Cisco CCNA' certification would make you a strong candidate for higher-paying converged AV/IT roles.", callToAction: { text: "Explore Certifications", view: "Manage Profile" } },
            ]
        };
    };

    return {
        // State
        user,
        currentPage,
        currentPageContext,
        allUsers,
        engineers,
        companies,
        jobs,
        applications,
        reviews,
        conversations,
        messages,
        contracts,
        transactions,
        forumPosts,
        forumComments,
        notifications,
        projects,
        invoices,
        selectedConversationId,
        isAiReplying,

        // Services
        geminiService,
        t, // i18n placeholder

        // Setters & Actions
        login,
        logout,
        setCurrentPage,
        setCurrentPageContext,
        updateEngineerProfile,
        updateCompanyProfile,
        boostProfile,
        findUserById,
        findUserByProfileId,
        postJob,
        applyForJob,
        sendOffer,
        acceptOffer,
        declineOffer,
        startConversationAndNavigate,
        sendMessage,
        setSelectedConversationId,
        createContract,
        signContract,
        isPremium,
        toggleUserStatus,
        toggleJobStatus,
        createAndLoginEngineer,
        createAndLoginCompany,
        createAndLoginResourcingCompany,
        inviteEngineerToJob,
        voteOnPost,
        voteOnComment,
        createForumPost,
        addForumComment,
        markNotificationsAsRead,
        fundMilestone,
        submitMilestoneForApproval,
        approveMilestone,
        submitTimesheet,
        approveTimesheet,
        generateInvoice,
        payInvoice,
        reportUser,
        upgradeProfileTier,
        reactivateProfile,
        getCareerCoaching,
    };
};