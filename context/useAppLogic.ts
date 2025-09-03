import { useState, useMemo, useEffect } from 'react';
import { PoundSterling, DollarSign } from '../components/Icons.tsx';
// FIX: Added Invoice to the type import to support the new `invoices` state.
import { Role, EngineerProfile, User, Job, Application, Currency, Conversation, Message, Review, CompanyProfile, ApplicationStatus, Notification, NotificationType, AppContextType, ForumPost, ForumComment, ProfileTier, Contract, ContractStatus, ContractType, Milestone, MilestoneStatus, Transaction, TransactionType, Timesheet, Compliance, IdentityVerification, Discipline, JobSkillRequirement, Badge, Project, ProjectRole, Invoice } from '../types/index.ts';
import { MOCK_JOBS, MOCK_ENGINEERS, MOCK_USERS, MOCK_USER_FREE_ENGINEER, ALL_MOCK_USERS, MOCK_CONVERSATIONS, MOCK_MESSAGES, MOCK_APPLICATIONS, MOCK_REVIEWS, MOCK_COMPANIES, MOCK_NOTIFICATIONS, MOCK_FORUM_POSTS, MOCK_FORUM_COMMENTS, MOCK_CONTRACTS, MOCK_TRANSACTIONS, MOCK_PROJECTS } from '../data/mockData.ts';
import { geminiService } from '../services/geminiService.ts';
import type { Chat } from '@google/genai';
import { eSignatureService } from '../services/eSignatureService.ts';
import { BADGES } from '../data/badges.ts';

// --- CONSTANTS ---
export const APP_NAME = "TechSubbies.com";
export const CURRENCY_ICONS: { [key in Currency]: React.ComponentType<any> } = {
    [Currency.GBP]: PoundSterling,
    [Currency.USD]: DollarSign,
};
const PLATFORM_FEE_PERCENTAGE = 0.05; // 5%

const TIER_PRICES: { [key in ProfileTier]?: number } = {
    [ProfileTier.PROFESSIONAL]: 7.00,
    [ProfileTier.SKILLS]: 15.00,
    [ProfileTier.BUSINESS]: 35.00,
};

const ROLE_CREDIT_PRICES = {
    1: 2.00,
    3: 5.00,
    5: 7.00,
}

const generateUniqueId = () => Math.random().toString(36).substring(2, 9);


/**
 * A custom hook containing all the business logic for the application.
 * This centralizes state management and actions, cleaning up the AppProvider component.
 */
export const useAppLogic = (): AppContextType => {
    // --- STATE MANAGEMENT ---
    const [user, setUser] = useState<User | null>(null);
    const [allUsers, setAllUsers] = useState<User[]>(ALL_MOCK_USERS);
    const [jobs, setJobs] = useState<Job[]>(MOCK_JOBS);
    const [engineers, setEngineers] = useState<EngineerProfile[]>(MOCK_ENGINEERS);
    const [companies, setCompanies] = useState<CompanyProfile[]>(MOCK_COMPANIES);
    const [applications, setApplications] = useState<Application[]>(MOCK_APPLICATIONS);
    const [reviews, setReviews] = useState<Review[]>(MOCK_REVIEWS);
    const [chatSession, setChatSession] = useState<Chat | null>(() => geminiService.startChat());
    const [conversations, setConversations] = useState<Conversation[]>(MOCK_CONVERSATIONS);
    const [messages, setMessages] = useState<Message[]>(MOCK_MESSAGES);
    const [selectedConversationId, setSelectedConversationId] = useState<string | null>(null);
    const [isAiReplying, setIsAiReplying] = useState(false);
    const [notifications, setNotifications] = useState<Notification[]>(MOCK_NOTIFICATIONS);
    const [forumPosts, setForumPosts] = useState<ForumPost[]>(MOCK_FORUM_POSTS);
    const [forumComments, setForumComments] = useState<ForumComment[]>(MOCK_FORUM_COMMENTS);
    const [contracts, setContracts] = useState<Contract[]>(MOCK_CONTRACTS);
    const [transactions, setTransactions] = useState<Transaction[]>(MOCK_TRANSACTIONS);
    const [projects, setProjects] = useState<Project[]>(MOCK_PROJECTS);
    // FIX: Added missing state for invoices to conform to AppContextType.
    const [invoices, setInvoices] = useState<Invoice[]>([]);


    // --- UTILITY FUNCTIONS ---
    const findUserById = (userId: string) => allUsers.find(u => u.id === userId);
    const findUserByProfileId = (profileId: string) => allUsers.find(u => u.profile.id === profileId);
    
    // --- NOTIFICATION & BACKGROUND PROCESSES ---
    const createNotification = (userId: string, type: NotificationType, text: string, link?: string) => {
        const newNotification: Notification = {
            id: `notif-${generateUniqueId()}`, userId, type, text, link, isRead: false, timestamp: new Date(),
        };
        setNotifications(prev => [newNotification, ...prev]);
    };

    const markNotificationsAsRead = (userId: string) => {
        setNotifications(prev => prev.map(n => (n.userId === userId ? { ...n, isRead: true } : n)));
    };

    // SIMULATED REAL-TIME NOTIFICATIONS
    useEffect(() => {
        if (!user) return;
        const interval = setInterval(() => {
            const mockNotifs = [
                { type: NotificationType.NEW_JOB_MATCH, text: "A new job, 'Senior Cloud Engineer', matches your skills." },
                { type: NotificationType.MESSAGE, text: "You have a new message from Starlight Events." },
            ];
            const randomNotif = mockNotifs[Math.floor(Math.random() * mockNotifs.length)];
            createNotification(user.id, randomNotif.type, randomNotif.text);
        }, 25000); // every 25 seconds
        return () => clearInterval(interval);
    }, [user]);

    // DYNAMIC BADGE CALCULATION
     useEffect(() => {
        const calculateBadges = () => {
            setEngineers(currentEngineers => {
                return currentEngineers.map(engineer => {
                    const engineerUser = allUsers.find(u => u.profile.id === engineer.id);
                    const completedContracts = contracts.filter(c => c.engineerId === engineer.id && c.status === ContractStatus.COMPLETED).length;
                    const engineerPosts = forumPosts.filter(p => p.authorId === engineerUser?.id);
                    const engineerComments = forumComments.filter(c => c.authorId === engineerUser?.id);
                    const forumScore = (engineerPosts.length * 5) + engineerComments.length + engineerPosts.reduce((sum, p) => sum + p.upvotes, 0);

                    const earnedBadges: Badge[] = [];
                    BADGES.forEach(badge => {
                        if (badge.condition(engineer, { completedContracts, forumScore })) {
                            earnedBadges.push(badge);
                        }
                    });
                    return { ...engineer, badges: earnedBadges };
                });
            });
        };
        const intervalId = setInterval(calculateBadges, 15000); // Recalculate every 15 seconds
        return () => clearInterval(intervalId);
    }, [contracts, forumPosts, forumComments, allUsers]);

    // SIMULATED PROFILE BOOST EXPIRATION
    useEffect(() => {
        const checkBoosts = () => {
             setEngineers(currentEngineers => {
                let wasChanged = false;
                const updatedEngineers = currentEngineers.map(eng => {
                    if (eng.isBoosted && eng.boostEndDate && new Date(eng.boostEndDate) < new Date()) {
                        wasChanged = true;
                         if (user?.profile.id === eng.id) {
                            createNotification(user.id, NotificationType.APPLICATION_UPDATE, "Your Profile Boost has expired.");
                        }
                        return { ...eng, isBoosted: false, boostEndDate: undefined };
                    }
                    return eng;
                });

                if (wasChanged) {
                    return updatedEngineers;
                }
                return currentEngineers;
            });
        };
       const intervalId = setInterval(checkBoosts, 5000);
       return () => clearInterval(intervalId);
    }, [user]); 

    // --- AUTHENTICATION & USER CREATION ---
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
            
            if (profile.profileTier !== ProfileTier.BASIC && profile.trialEndDate && new Date(profile.trialEndDate) < new Date()) {
                console.log(`Trial for ${profile.name} expired. Downgrading to free tier.`);
                profile.profileTier = ProfileTier.BASIC; 
                userToLogin.profile = profile; 

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

    const loginAsSteve = () => {
        const steveUser = allUsers.find(u => u.profile.id === 'eng-steve');
        if (steveUser) {
            if (steveUser.profile.status === 'suspended') {
                alert("This account has been suspended. Please contact support.");
                return;
            }
            setUser(steveUser);
        } else {
            alert("Could not find Steve's engineer profile.");
        }
    };

    const logout = () => {
        setUser(null);
    };

    const createAndLoginEngineer = (data: {
        name: string, email: string, discipline: Discipline, location: string, experience: number,
        minDayRate: number, maxDayRate: number, currency: Currency, availability: string,
        compliance: Compliance, identity: IdentityVerification
    }) => {
        const [firstName, ...lastNameParts] = data.name.split(' ');
        const newEngineer: EngineerProfile = {
            id: `eng-${generateUniqueId()}`, name: data.name, status: 'active',
            firstName: firstName, surname: lastNameParts.join(' ') || ' ', avatar: `https://i.pravatar.cc/150?u=${data.name.replace(' ', '')}`,
            profileTier: ProfileTier.BASIC, certifications: [], caseStudies: [], skills: [],
            discipline: data.discipline, location: data.location, experience: data.experience, currency: data.currency,
            minDayRate: data.minDayRate, maxDayRate: data.maxDayRate, availability: new Date(data.availability),
            compliance: data.compliance, identity: data.identity,
            contact: { email: data.email, phone: '', website: '', linkedin: '' },
            description: `Newly joined freelance ${data.discipline} with ${data.experience} years of experience, based in ${data.location}. Ready for new opportunities starting ${new Date(data.availability).toLocaleDateString()}.`,
            profileViews: 0, searchAppearances: 0, jobInvites: 0, joinDate: new Date(), badges: [],
        };

        setEngineers(prev => [newEngineer, ...prev]);
        const newUser: User = { id: `user-${generateUniqueId()}`, role: Role.ENGINEER, profile: newEngineer };
        setUser(newUser);
        setAllUsers(prev => [...prev, newUser]);
    };

    const createAndLoginCompany = (data: any) => {
        let isVerified = false;
        const validPrefixes = ['123', 'GB', 'VALID']; 
        if (validPrefixes.some(p => data.regNumber.toUpperCase().startsWith(p)) && data.regNumber.length > 5) {
            isVerified = true;
            alert("Company verified successfully! Welcome to your dashboard.");
        } else {
            isVerified = false;
            alert("Your company profile has been created. However, we could not automatically verify your registration number. Your account may be subject to review. You can now access your dashboard.");
        }
    
        const websiteDomain = data.website.replace('https://','').replace('www.','');
        const newCompany: CompanyProfile = {
            id: `comp-${generateUniqueId()}`, name: data.companyName, status: 'active', avatar: `https://logo.clearbit.com/${websiteDomain}`,
            logo: `https://logo.clearbit.com/${websiteDomain}`, website: data.website, companyRegNumber: data.regNumber, isVerified: isVerified,
        };
        setCompanies(prev => [newCompany, ...prev]);
        const newUser: User = { id: `user-${generateUniqueId()}`, role: Role.COMPANY, profile: newCompany };
        setAllUsers(prev => [...prev, newUser]);
        setUser(newUser);
    };

    const createAndLoginResourcingCompany = (data: any) => {
        let isVerified = false;
        const validPrefixes = ['123', 'GB', 'VALID'];
        if (validPrefixes.some(p => data.regNumber.toUpperCase().startsWith(p)) && data.regNumber.length > 5) {
            isVerified = true;
            alert("Resourcing company verified successfully! Welcome to your dashboard.");
        } else {
            isVerified = false;
            alert("Your company profile has been created. Verification is pending review. You can now access your dashboard.");
        }
    
        const websiteDomain = data.website.replace('https://','').replace('www.','');
        const newCompany: CompanyProfile = {
            id: `res-${generateUniqueId()}`, name: data.companyName, status: 'active', avatar: `https://logo.clearbit.com/${websiteDomain}`,
            logo: `https://logo.clearbit.com/${websiteDomain}`, website: data.website, companyRegNumber: data.regNumber, isVerified: isVerified,
        };
        setCompanies(prev => [newCompany, ...prev]);
        const newUser: User = { id: `user-${generateUniqueId()}`, role: Role.RESOURCING_COMPANY, profile: newCompany };
        setAllUsers(prev => [...prev, newUser]);
        setUser(newUser);
    };

    // --- PROFILE & USER MANAGEMENT ---
    const updateEngineerProfile = (updatedProfile: Partial<EngineerProfile>) => {
        const profileId = updatedProfile.id || user?.profile.id;
        if (!profileId) return;
        if (user && user.profile.id === profileId) {
            setUser({ ...user, profile: { ...user.profile, ...updatedProfile } } as User);
        }
        setEngineers(prev => prev.map(e => e.id === profileId ? { ...e, ...updatedProfile } : e));
        setAllUsers(prev => prev.map(u => u.profile.id === profileId ? { ...u, profile: { ...u.profile, ...updatedProfile } } : u));
    };
    
    const updateCompanyProfile = (updatedProfile: Partial<CompanyProfile>) => {
        const profileId = updatedProfile.id || user?.profile.id;
        if (!profileId) return;
        if (user && user.profile.id === profileId) {
            setUser({ ...user, profile: { ...user.profile, ...updatedProfile } } as User);
        }
        setCompanies(prev => prev.map(c => c.id === profileId ? { ...c, ...updatedProfile } : c));
        setAllUsers(prev => prev.map(u => u.profile.id === profileId ? { ...u, profile: { ...u.profile, ...updatedProfile } } : u));
    };

    const startTrial = () => {
        if (user && 'skills' in user.profile) {
            const trialEndDate = new Date();
            trialEndDate.setDate(trialEndDate.getDate() + 30);
            const subscriptionEndDate = new Date(trialEndDate);
            
            updateEngineerProfile({ 
                profileTier: ProfileTier.PROFESSIONAL, trialEndDate, subscriptionEndDate, securityNetCreditsUsed: 0,
                roleCredits: (user.profile as EngineerProfile).roleCredits || 5 // Give 5 credits on trial start
            });
            alert("30-Day Silver Profile trial started! You now have access to all premium features and have been granted 5 Role Credits.");
        }
    };

    const boostProfile = () => {
        if (user && user.role === Role.ENGINEER && 'profileTier' in user.profile && user.profile.profileTier !== ProfileTier.BASIC) {
            const boostEndDate = new Date(Date.now() + 30000); // 30 seconds for demo
            updateEngineerProfile({ isBoosted: true, boostEndDate });
            alert("Your profile has been boosted! You'll appear at the top of relevant searches for a short period (30s for demo).");
        } else {
            alert("Profile Boost is a premium feature. Please upgrade to a premium profile first.");
        }
    };
    
    const claimSecurityNetGuarantee = () => {
        if (!user || user.role !== Role.ENGINEER || !('profileTier' in user.profile)) return;
        
        const profile = user.profile as EngineerProfile;
        if (profile.profileTier === ProfileTier.BASIC) {
            alert("The Security Net Guarantee is only for paid subscribers."); return;
        }
        const creditsUsed = profile.securityNetCreditsUsed ?? 0;
        if (creditsUsed >= 3) {
            alert("You have already used all of your Security Net credits."); return;
        }
        const companyUserIds = new Set(allUsers.filter(u => u.role === Role.COMPANY).map(u => u.id));
        const hasCompanyConversations = conversations.some(c => c.participantIds.includes(user.id) && c.participantIds.some(pId => companyUserIds.has(pId)));
        if (hasCompanyConversations) {
            alert("Our records show you have been in contact with companies. If you believe this is an error, please contact support."); return;
        }
        
        const newCreditsUsed = creditsUsed + 1;
        const currentSubEnd = profile.subscriptionEndDate ? new Date(profile.subscriptionEndDate) : new Date();
        const newSubEnd = new Date(currentSubEnd.setDate(currentSubEnd.getDate() + 30));

        let newStatus = profile.status;
        let alertMessage = `Your claim has been approved! Your subscription has been extended by one month to ${newSubEnd.toLocaleDateString()}. You have used ${newCreditsUsed} of 3 credits.`;
        if (newCreditsUsed >= 3) {
            newStatus = 'inactive';
            alertMessage += "\n\nYou have now used all available credits. To ensure companies see an active talent pool, your profile has been marked as inactive and will be hidden from search results. You can reactivate it from your dashboard at any time.";
        }
        updateEngineerProfile({ securityNetCreditsUsed: newCreditsUsed, subscriptionEndDate: newSubEnd, status: newStatus });
        alert(alertMessage);
    };

    const reactivateProfile = () => {
        if (user && 'status' in user.profile && user.profile.status === 'inactive') {
            updateEngineerProfile({ status: 'active' });
            alert("Your profile has been reactivated and is now visible in search results.");
        }
    };
    
    const toggleUserStatus = (profileId: string) => {
        const userToUpdate = allUsers.find(u => u.profile.id === profileId);
        if (!userToUpdate) return;
        const newStatus = userToUpdate.profile.status === 'active' ? 'suspended' : 'active';
        updateEngineerProfile({ id: profileId, status: newStatus });
        updateCompanyProfile({ id: profileId, status: newStatus });
    };
    
    // --- JOB & APPLICATION LOGIC ---
    const postJob = (jobData: Omit<Job, 'id' | 'companyId' | 'postedDate' | 'status'>): Job | undefined => {
        if (!user?.profile) return undefined;
        const newJob: Job = {
            ...jobData, id: `job-${generateUniqueId()}`, companyId: user.profile.id, postedDate: new Date(),
            startDate: jobData.startDate ? new Date(jobData.startDate) : null, status: 'active',
        };
        setJobs(prevJobs => [newJob, ...prevJobs]);
        const matchingEngineers = engineers.filter(e => e.profileTier !== ProfileTier.BASIC && e.status === 'active').slice(0, 3);
        matchingEngineers.forEach(eng => {
            const engUser = findUserByProfileId(eng.id);
            if (engUser) {
                createNotification(engUser.id, NotificationType.NEW_JOB_MATCH, `A new job, '${newJob.title}', matches your skills.`, 'Job Search');
            }
        });
        return newJob;
    };

    // FIX: Updated applyForJob to handle supercharged applications and provide better feedback.
    const applyForJob = (jobId: string, engineerId?: string, isSupercharged = false) => {
        let applyingEngineerId: string | undefined = engineerId;
        if (!applyingEngineerId) {
            if (user && user.role === Role.ENGINEER) {
                applyingEngineerId = user.profile.id;
            } else {
                alert("No engineer specified for application."); return;
            }
        }
        if (applications.some(app => app.jobId === jobId && app.engineerId === applyingEngineerId)) {
            alert("This engineer has already applied for this job."); return;
        }
        const newApplication: Application = { jobId, engineerId: applyingEngineerId, date: new Date(), status: ApplicationStatus.APPLIED, isSupercharged };
        setApplications(prev => [newApplication, ...prev]);
        const engineerName = engineers.find(e => e.id === applyingEngineerId)?.name || 'the engineer';
        const alertMessage = isSupercharged 
            ? `Supercharged application for ${engineerName} submitted successfully!`
            : `Application for ${engineerName} submitted successfully!`;
        alert(alertMessage);
    };

    // FIX: Implemented the missing 'superchargeApplication' function.
    const superchargeApplication = (job: Job) => {
        if (!user || user.role !== Role.ENGINEER) {
            alert("You must be logged in as an engineer to supercharge an application.");
            return;
        }

        // In a real app, this would trigger a payment flow.
        // For this demo, we'll simulate the payment and create a transaction.
        const newTransaction: Transaction = {
            id: `txn-${generateUniqueId()}`,
            userId: user.id,
            type: TransactionType.SUPERCHARGE,
            description: `Supercharge application for: ${job.title}`,
            amount: -1.99,
            date: new Date(),
        };
        setTransactions(prev => [newTransaction, ...prev]);
        
        applyForJob(job.id, user.profile.id, true);
    };
    
    const offerJob = (jobId: string, engineerId: string) => {
        setApplications(prev => prev.map(app => 
            app.jobId === jobId && app.engineerId === engineerId ? { ...app, status: ApplicationStatus.OFFERED } : app
        ));
        const engineerUser = findUserByProfileId(engineerId);
        const job = jobs.find(j => j.id === jobId);
        if (engineerUser && job && user) {
            createNotification(engineerUser.id, NotificationType.JOB_OFFER, `${user.profile.name} has offered you the '${job.title}' job.`, 'My Network');
        }
        alert(`Offer sent to engineer for the job: ${job?.title}`);
    };

    const acceptOffer = (jobId: string, engineerId: string) => {
        setApplications(prev => prev.map(app => 
            app.jobId === jobId && app.engineerId === engineerId ? { ...app, status: ApplicationStatus.ACCEPTED } : app
        ));
    };

    const declineOffer = (jobId: string, engineerId: string) => {
         setApplications(prev => prev.map(app => 
            app.jobId === jobId && app.engineerId === engineerId ? { ...app, status: ApplicationStatus.DECLINED } : app
        ));
    };
    
    const toggleJobStatus = (jobId: string) => {
        setJobs(prev => prev.map(j => (j.id === jobId) ? { ...j, status: j.status === 'active' ? 'inactive' : 'active' } : j));
    };

    const submitReview = (reviewData: Omit<Review, 'id' | 'date'>) => {
        const newReview: Review = { ...reviewData, id: `rev-${generateUniqueId()}`, date: new Date() };
        const updatedReviews = [...reviews, newReview];
        setReviews(updatedReviews);
        const engineerReviews = updatedReviews.filter(r => r.engineerId === reviewData.engineerId);
        const totalPeer = engineerReviews.reduce((sum, r) => sum + r.peerRating, 0);
        const totalCustomer = engineerReviews.reduce((sum, r) => sum + r.customerRating, 0);
        
        // FIX: Prevent division by zero if this is the first review, which would create a NaN state.
        const newPeerRating = engineerReviews.length > 0 ? parseFloat((totalPeer / engineerReviews.length).toFixed(1)) : reviewData.peerRating;
        const newCustomerRating = engineerReviews.length > 0 ? parseFloat((totalCustomer / engineerReviews.length).toFixed(1)) : reviewData.customerRating;

        updateEngineerProfile({ id: reviewData.engineerId, peerRating: newPeerRating, customerRating: newCustomerRating });
        setApplications(prev => prev.map(app => (app.jobId === reviewData.jobId && app.engineerId === reviewData.engineerId) ? { ...app, status: ApplicationStatus.COMPLETED, reviewed: true } : app));
        alert("Review submitted successfully!");
    };

    const inviteEngineerToJob = (jobId: string, engineerId: string) => {
        if (!user) return;
        const job = jobs.find(j => j.id === jobId);
        const engineerUser = findUserByProfileId(engineerId);
        if (job && engineerUser && 'jobInvites' in engineerUser.profile) {
            createNotification(engineerUser.id, NotificationType.JOB_INVITE, `${user.profile.name} has invited you to apply for the '${job.title}' role.`, 'Job Search');
            const engineerProfile = engineerUser.profile as EngineerProfile;
            updateEngineerProfile({ id: engineerId, jobInvites: (engineerProfile.jobInvites || 0) + 1 });
        }
    };
    
    // --- MESSAGING ---
    const sendMessage = async (conversationId: string, text: string) => {
        if (!user || isAiReplying) return;
        const newMessage: Message = {
            id: `msg-${generateUniqueId()}`, conversationId, senderId: user.id, text, timestamp: new Date(), isRead: true,
        };
        const updatedMessagesWithUser = [...messages, newMessage];
        setMessages(updatedMessagesWithUser);
        const conversation = conversations.find(c => c.id === conversationId);
        if (!conversation) return;
        setConversations(prev => prev.map(c => c.id === conversationId ? { ...c, lastMessageText: text, lastMessageTimestamp: newMessage.timestamp } : c));
        setIsAiReplying(true);
        try {
            const recipientId = conversation.participantIds.find(id => id !== user.id);
            const otherParticipant = recipientId ? findUserById(recipientId) : undefined;
            if (otherParticipant) {
                await new Promise(resolve => setTimeout(resolve, 1200 + Math.random() * 800));
                const conversationHistory = updatedMessagesWithUser.filter(m => m.conversationId === conversationId);
                const aiResponseText = await geminiService.generateChatResponse(conversationHistory, user, otherParticipant);
                const aiMessage: Message = {
                    id: `msg-${generateUniqueId()}`, conversationId, senderId: otherParticipant.id, text: aiResponseText, timestamp: new Date(), isRead: false,
                };
                setMessages(prev => [...prev, aiMessage]);
                setConversations(prev => prev.map(c => c.id === conversationId ? { ...c, lastMessageText: aiResponseText, lastMessageTimestamp: aiMessage.timestamp } : c));
                createNotification(user.id, NotificationType.MESSAGE, `You have a new message from ${otherParticipant.profile.name}.`, 'Messages');
            }
        } catch (error) {
            console.error("Error generating AI response:", error);
            const aiErrorMessage: Message = {
                id: `msg-${generateUniqueId()}`, conversationId, senderId: conversation.participantIds.find(id => id !== user.id)!,
                text: "Sorry, I encountered an error and cannot respond right now.", timestamp: new Date(), isRead: false,
            };
            setMessages(prev => [...prev, aiErrorMessage]);
        } finally {
            setIsAiReplying(false);
        }
    };

    const startConversationAndNavigate = (otherParticipantProfileId: string, navigateToMessages: () => void) => {
        if (!user) { alert("You must be logged in to send messages."); return; }
        const otherParticipant = findUserByProfileId(otherParticipantProfileId);
        if (!otherParticipant) { alert("Could not find user to message."); return; }
        if (user.id === otherParticipant.id) { alert("You cannot message yourself."); return; }
        let conversation = conversations.find(c => c.participantIds.includes(user.id) && c.participantIds.includes(otherParticipant.id));
        if (!conversation) {
            const newConversation: Conversation = {
                id: `convo-${generateUniqueId()}`, participantIds: [user.id, otherParticipant.id],
                lastMessageText: "Conversation started.", lastMessageTimestamp: new Date(),
            };
            setConversations(prev => [newConversation, ...prev]);
            conversation = newConversation;
        }
        setSelectedConversationId(conversation.id);
        navigateToMessages();
    };
    
    // --- FORUM ---
    const createForumPost = async (post: { title: string; content: string; tags: string[] }) => {
        if (!user) { alert("You must be logged in to create a post."); return; }
        const moderationResult = await geminiService.moderateForumPost(post);
        const decision = moderationResult?.decision || 'reject';
        const reason = moderationResult?.reason || 'AI moderation failed.';
        if (decision === 'reject') { alert(`Post rejected by AI moderator: ${reason}`); return; }
        const newPost: ForumPost = {
            ...post, id: `post-${generateUniqueId()}`, authorId: user.id, timestamp: new Date(),
            upvotes: 0, downvotes: 0, status: 'approved',
        };
        setForumPosts(prev => [newPost, ...prev]);
        alert("Post submitted and approved!");
    };

    const addForumComment = (comment: { postId: string; parentId: string | null; content: string }) => {
        if (!user) { alert("You must be logged in to comment."); return; }
        const newComment: ForumComment = {
            ...comment, id: `comment-${generateUniqueId()}`, authorId: user.id,
            timestamp: new Date(), upvotes: 0, downvotes: 0,
        };
        setForumComments(prev => [...prev, newComment]);
    };

    const voteOnPost = (postId: string, voteType: 'up' | 'down') => {
        setForumPosts(prev => prev.map(post => post.id === postId ? { ...post, upvotes: voteType === 'up' ? post.upvotes + 1 : post.upvotes, downvotes: voteType === 'down' ? post.downvotes + 1 : post.downvotes } : post));
    };
    
    const voteOnComment = (commentId: string, voteType: 'up' | 'down') => {
        setForumComments(prev => prev.map(comment => comment.id === commentId ? { ...comment, upvotes: voteType === 'up' ? comment.upvotes + 1 : comment.upvotes, downvotes: voteType === 'down' ? comment.downvotes + 1 : comment.downvotes } : comment));
    };

    // --- CONTRACTS & PAYMENTS ---
    const sendContractForSignature = async (contract: Contract) => {
        if (!user) return;
        const engineer = findUserByProfileId(contract.engineerId);
        if (!engineer || !('contact' in engineer.profile)) return;
        const engineerProfile = engineer.profile as EngineerProfile;
        await eSignatureService.createSignatureRequest(contract.id, engineerProfile.contact.email);
        const newContract = { ...contract, status: ContractStatus.PENDING_SIGNATURE };
        setContracts(prev => [newContract, ...prev.filter(c => c.id !== newContract.id)]);
        createNotification(engineer.id, NotificationType.APPLICATION_UPDATE, `${user.profile.name} has sent you a contract to sign for the '${contract.jobTitle}' job.`);
        alert(`Contract sent to ${engineer.profile.name} for signature.`);
    };

    const signContract = (contractId: string, signatureName: string) => {
        if (!user) return;
        setContracts(prev => prev.map(c => {
            if (c.id === contractId) {
                const updatedContract = { ...c };
                if (user.role === Role.ENGINEER && !c.engineerSignature) {
                    updatedContract.engineerSignature = { name: signatureName, date: new Date() };
                    updatedContract.status = ContractStatus.SIGNED;
                    const companyUser = findUserByProfileId(c.companyId);
                    if (companyUser) {
                         createNotification(companyUser.id, NotificationType.APPLICATION_UPDATE, `${user.profile.name} has signed the contract for '${c.jobTitle}'. It is now ready for your countersignature.`);
                    }
                } else if ((user.role === Role.COMPANY || user.role === Role.ADMIN || user.role === Role.RESOURCING_COMPANY) && c.engineerSignature && !c.companySignature) {
                    updatedContract.companySignature = { name: signatureName, date: new Date() };
                    updatedContract.status = ContractStatus.ACTIVE;
                    const engineerUser = findUserByProfileId(c.engineerId);
                    if(engineerUser) {
                        createNotification(engineerUser.id, NotificationType.APPLICATION_UPDATE, `The contract for '${c.jobTitle}' has been countersigned and is now active!`);
                    }
                }
                return updatedContract;
            }
            return c;
        }));
    };

    const fundMilestone = (contractId: string, milestoneId: string) => {
        if(!user) return;
        let contractToUpdate = contracts.find(c => c.id === contractId);
        if (!contractToUpdate) return;
        setContracts(prev => prev.map(c => c.id === contractId ? { ...c, milestones: c.milestones.map(m => m.id === milestoneId ? { ...m, status: MilestoneStatus.FUNDED_IN_PROGRESS } : m) } : c));
        const milestone = contractToUpdate.milestones.find(m => m.id === milestoneId);
        if (milestone) {
             const newTransaction: Transaction = {
                id: `txn-${generateUniqueId()}`, userId: user.id, contractId, type: TransactionType.ESCROW_FUNDING,
                description: `Funded Milestone: ${milestone.description}`, amount: -milestone.amount, date: new Date()
            };
            setTransactions(prev => [newTransaction, ...prev]);
        }
    };

    const submitMilestoneForApproval = (contractId: string, milestoneId: string) => {
        setContracts(prev => prev.map(c => c.id === contractId ? { ...c, milestones: c.milestones.map(m => m.id === milestoneId ? { ...m, status: MilestoneStatus.SUBMITTED_FOR_APPROVAL } : m) } : c));
    };

    const approveMilestonePayout = (contractId: string, milestoneId: string) => {
         if(!user) return;
        const contractToUpdate = contracts.find(c => c.id === contractId);
        const engineerUser = contractToUpdate ? findUserByProfileId(contractToUpdate.engineerId) : undefined;
        if (!contractToUpdate || !engineerUser) return;
        setContracts(prev => prev.map(c => c.id === contractId ? { ...c, milestones: c.milestones.map(m => m.id === milestoneId ? { ...m, status: MilestoneStatus.COMPLETED_PAID } : m) } : c));
        const milestone = contractToUpdate.milestones.find(m => m.id === milestoneId);
        if (milestone) {
            const payoutAmount = milestone.amount * (1 - PLATFORM_FEE_PERCENTAGE);
            const feeAmount = milestone.amount * PLATFORM_FEE_PERCENTAGE;
            const payoutTx: Transaction = {
                id: `txn-${generateUniqueId()}`, userId: engineerUser.id, contractId, type: TransactionType.PAYOUT,
                description: `Payout for Milestone: ${milestone.description}`, amount: payoutAmount, date: new Date()
            };
            const feeTx: Transaction = {
                 id: `txn-${generateUniqueId()}`, userId: engineerUser.id, contractId, type: TransactionType.PLATFORM_FEE,
                description: `Platform Fee (5%) for Milestone: ${milestone.description}`, amount: -feeAmount, date: new Date()
            };
            setTransactions(prev => [payoutTx, feeTx, ...prev]);
        }
    };

    const submitTimesheet = (contractId: string, timesheetData: Omit<Timesheet, 'id' | 'contractId' | 'engineerId' | 'status'>) => {
        if (!user || user.role !== Role.ENGINEER) return;
        const newTimesheet: Timesheet = { ...timesheetData, id: `ts-${generateUniqueId()}`, contractId, engineerId: user.profile.id, status: 'submitted' };
        setContracts(prev => prev.map(c => c.id === contractId ? { ...c, timesheets: [...(c.timesheets || []), newTimesheet] } : c));
    };

    const approveTimesheet = (contractId: string, timesheetId: string) => {
        if(!user) return;
        let updatedTimesheet: Timesheet | undefined;
        let contractToUpdate: Contract | undefined;
        let engineerUser: User | undefined;
        setContracts(prev => prev.map(c => {
            if (c.id === contractId) {
                contractToUpdate = c;
                engineerUser = findUserByProfileId(c.engineerId);
                const newTimesheets = c.timesheets?.map(ts => {
                    if (ts.id === timesheetId) { updatedTimesheet = { ...ts, status: 'paid' }; return updatedTimesheet; }
                    return ts;
                });
                return { ...c, timesheets: newTimesheets };
            }
            return c;
        }));
        if (contractToUpdate && engineerUser && updatedTimesheet) {
            // FIX: Hardened this logic to prevent NaN values from corrupting payment calculations.
            const dayRate = parseFloat(String(contractToUpdate.amount)) || 0;
            const totalAmount = dayRate * updatedTimesheet.days;
            const payoutAmount = totalAmount * (1 - PLATFORM_FEE_PERCENTAGE);
            const feeAmount = totalAmount * PLATFORM_FEE_PERCENTAGE;
            const payoutTx: Transaction = {
                id: `txn-${generateUniqueId()}`, userId: engineerUser.id, contractId, type: TransactionType.PAYOUT,
                description: `Payout for Timesheet: ${updatedTimesheet.period}`, amount: payoutAmount, date: new Date()
            };
            const feeTx: Transaction = {
                 id: `txn-${generateUniqueId()}`, userId: user.id, contractId, type: TransactionType.PLATFORM_FEE,
                description: `Platform Fee for Timesheet: ${updatedTimesheet.period}`, amount: -feeAmount, date: new Date()
            };
            setTransactions(prev => [payoutTx, feeTx, ...prev]);
            createNotification(engineerUser.id, NotificationType.APPLICATION_UPDATE, `Your timesheet for '${updatedTimesheet.period}' has been approved and paid!`);
        }
    };

    const upgradeSubscription = (profileId: string, toTier: ProfileTier) => {
        if (!user || user.role !== Role.ENGINEER) return;
        const price = TIER_PRICES[toTier];
        if (price === undefined) return;
        const subscriptionEndDate = new Date();
        subscriptionEndDate.setDate(subscriptionEndDate.getDate() + 30);
        updateEngineerProfile({ id: profileId, profileTier: toTier, subscriptionEndDate, trialEndDate: undefined });
        const newTransaction: Transaction = {
            id: `txn-${generateUniqueId()}`, userId: user.id, type: TransactionType.SUBSCRIPTION,
            description: `Subscription to ${toTier} tier`, amount: -price, date: new Date(),
        };
        setTransactions(prev => [newTransaction, ...prev]);
        alert(`Successfully upgraded to ${toTier} Profile!`);
    };

    const purchaseRoleCredits = (userId: string, numberOfCredits: 1 | 3 | 5) => {
        const price = ROLE_CREDIT_PRICES[numberOfCredits];
        const engineerUser = findUserById(userId);
        if (!engineerUser || engineerUser.role !== Role.ENGINEER) return;

        const currentCredits = (engineerUser.profile as EngineerProfile).roleCredits || 0;
        updateEngineerProfile({ id: engineerUser.profile.id, roleCredits: currentCredits + numberOfCredits });

        const newTransaction: Transaction = {
            id: `txn-${generateUniqueId()}`, userId: userId, type: TransactionType.ROLE_CREDIT_PURCHASE,
            description: `Purchased ${numberOfCredits} Role Credit(s)`, amount: -price, date: new Date(),
        };
        setTransactions(prev => [newTransaction, ...prev]);
        alert(`Successfully purchased ${numberOfCredits} role credit(s)!`);
    };

    const useRoleCredit = (userId: string) => {
        const engineerUser = findUserById(userId);
        if (!engineerUser || engineerUser.role !== Role.ENGINEER) return;
        const currentCredits = (engineerUser.profile as EngineerProfile).roleCredits || 0;
        if (currentCredits > 0) {
            updateEngineerProfile({ id: engineerUser.profile.id, roleCredits: currentCredits - 1 });
        }
    };

    // FIX: Added missing functions required by AppContextType.
    const purchaseDayPass = () => {
        if (!user) return;
        const newTransaction: Transaction = {
            id: `txn-${generateUniqueId()}`,
            userId: user.id,
            type: TransactionType.BOOST_PURCHASE, // No specific day pass type, using boost for demo
            description: '12-Hour Premium Access Day Pass',
            amount: -2.99,
            date: new Date(),
        };
        setTransactions(prev => [newTransaction, ...prev]);
        alert('Day Pass purchased! You have premium access for the next 12 hours.');
    };

    const purchaseBoostCredits = (userId: string, numberOfCredits: number, price: number) => {
        const engineerUser = findUserById(userId);
        if (!engineerUser || engineerUser.role !== Role.ENGINEER) return;

        const currentCredits = (engineerUser.profile as EngineerProfile).boostCredits || 0;
        updateEngineerProfile({ id: engineerUser.profile.id, boostCredits: currentCredits + numberOfCredits });

        const newTransaction: Transaction = {
            id: `txn-${generateUniqueId()}`, userId: userId, type: TransactionType.BOOST_PURCHASE,
            description: `Purchased ${numberOfCredits} Profile Boost Credit(s)`, amount: -price, date: new Date(),
        };
        setTransactions(prev => [newTransaction, ...prev]);
        alert(`Successfully purchased ${numberOfCredits} boost credit(s)!`);
    };

    const isPremium = (profile: EngineerProfile): boolean => {
        return profile.profileTier !== ProfileTier.BASIC;
    };


    // --- PROJECT PLANNER ---
    const createProject = (name: string, description: string): Project => {
        if (!user || user.role !== Role.COMPANY) { throw new Error("Only companies can create projects."); }
        const newProject: Project = {
            id: `proj-${generateUniqueId()}`, companyId: user.profile.id, name, description, roles: [], status: 'planning',
        };
        setProjects(prev => [newProject, ...prev]);
        return newProject;
    };

    const addRoleToProject = (projectId: string, roleData: Omit<ProjectRole, 'id' | 'assignedEngineerId'>) => {
        const newRole: ProjectRole = { ...roleData, id: `role-${generateUniqueId()}`, assignedEngineerId: null };
        setProjects(prev => prev.map(p => p.id === projectId ? { ...p, roles: [...p.roles, newRole] } : p));
    };

    const assignEngineerToRole = (projectId: string, roleId: string, engineerId: string) => {
        setProjects(prev => prev.map(p => p.id === projectId ? { ...p, roles: p.roles.map(r => r.id === roleId ? { ...r, assignedEngineerId: engineerId } : r) } : p));
    };

    // --- CONTEXT EXPORT ---
    // FIX: Added missing properties to the returned context object to resolve the type error.
    return useMemo(() => ({
        user, allUsers, jobs, companies, engineers, login, loginAsSteve, logout, 
        updateEngineerProfile, updateCompanyProfile, postJob, startTrial, geminiService, 
        applications, applyForJob, superchargeApplication, createAndLoginEngineer, createAndLoginCompany, 
        createAndLoginResourcingCompany, boostProfile, claimSecurityNetGuarantee, 
        reactivateProfile, chatSession, conversations, messages, selectedConversationId, 
        setSelectedConversationId, findUserById, findUserByProfileId, sendMessage, 
        startConversationAndNavigate, reviews, submitReview, toggleUserStatus, toggleJobStatus, 
        notifications, markNotificationsAsRead, offerJob, acceptOffer, declineOffer, inviteEngineerToJob,
        isAiReplying, forumPosts, forumComments, createForumPost, addForumComment, voteOnPost, voteOnComment,
        contracts, sendContractForSignature, signContract,
        transactions, fundMilestone, submitMilestoneForApproval, approveMilestonePayout,
        submitTimesheet, approveTimesheet, upgradeSubscription, purchaseRoleCredits, useRoleCredit,
        projects, createProject, addRoleToProject, assignEngineerToRole,
        purchaseDayPass,
        purchaseBoostCredits,
        invoices,
        isPremium,
    }), [user, allUsers, jobs, companies, engineers, applications, conversations, messages, selectedConversationId, reviews, notifications, isAiReplying, forumPosts, forumComments, contracts, transactions, projects, invoices]);
};