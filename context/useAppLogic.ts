import { useState, useMemo, useEffect } from 'react';
import { PoundSterling, DollarSign } from '../components/Icons.tsx';
import { Role, EngineerProfile, User, Job, Application, Currency, Conversation, Message, Review, CompanyProfile, ApplicationStatus, Notification, NotificationType, AppContextType, ForumPost, ForumComment, ProfileTier, Contract, ContractStatus, ContractType, Milestone, MilestoneStatus, Transaction, TransactionType, Timesheet, Compliance, IdentityVerification, Discipline, JobSkillRequirement } from '../types/index.ts';
import { MOCK_JOBS, MOCK_ENGINEERS, MOCK_USERS, MOCK_USER_FREE_ENGINEER, ALL_MOCK_USERS, MOCK_CONVERSATIONS, MOCK_MESSAGES, MOCK_APPLICATIONS, MOCK_REVIEWS, MOCK_COMPANIES, MOCK_NOTIFICATIONS, MOCK_FORUM_POSTS, MOCK_FORUM_COMMENTS, MOCK_CONTRACTS, MOCK_TRANSACTIONS } from '../data/mockData.ts';
import { geminiService } from '../services/geminiService.ts';
import type { Chat } from '@google/genai';
import { eSignatureService } from '../services/eSignatureService.ts';

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

    // --- UTILITY FUNCTIONS ---
    const findUserById = (userId: string) => allUsers.find(u => u.id === userId);
    const findUserByProfileId = (profileId: string) => allUsers.find(u => u.profile.id === profileId);
    
    // --- NOTIFICATION LOGIC ---
    const createNotification = (userId: string, type: NotificationType, text: string, link?: string) => {
        const newNotification: Notification = {
            id: `notif-${generateUniqueId()}`, userId, type, text, link, isRead: false, timestamp: new Date(),
        };
        setNotifications(prev => [newNotification, ...prev]);
    };

    // --- SIMULATED REAL-TIME NOTIFICATIONS ---
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


    const markNotificationsAsRead = (userId: string) => {
        setNotifications(prev => prev.map(n => (n.userId === userId ? { ...n, isRead: true } : n)));
    };

    // --- AUTH LOGIC ---
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
            id: `eng-${generateUniqueId()}`,
            name: data.name,
            status: 'active',
            firstName: firstName,
            surname: lastNameParts.join(' ') || ' ',
            avatar: `https://i.pravatar.cc/150?u=${data.name.replace(' ', '')}`,
            profileTier: ProfileTier.BASIC,
            certifications: [],
            caseStudies: [],
            skills: [],
            discipline: data.discipline,
            location: data.location,
            experience: data.experience,
            currency: data.currency,
            minDayRate: data.minDayRate,
            maxDayRate: data.maxDayRate,
            availability: new Date(data.availability),
            compliance: data.compliance,
            identity: data.identity,
            contact: {
                email: data.email,
                phone: '',
                website: '',
                linkedin: '',
            },
            description: `Newly joined freelance ${data.discipline} with ${data.experience} years of experience, based in ${data.location}. Ready for new opportunities starting ${new Date(data.availability).toLocaleDateString()}.`,
            profileViews: 0,
            searchAppearances: 0,
            jobInvites: 0,
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
            id: `comp-${generateUniqueId()}`, name: data.companyName, status: 'active',
            avatar: `https://logo.clearbit.com/${websiteDomain}`, logo: `https://logo.clearbit.com/${websiteDomain}`,
            website: data.website, companyRegNumber: data.regNumber, isVerified: isVerified,
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
            id: `res-${generateUniqueId()}`, name: data.companyName, status: 'active',
            avatar: `https://logo.clearbit.com/${websiteDomain}`, logo: `https://logo.clearbit.com/${websiteDomain}`,
            website: data.website, companyRegNumber: data.regNumber, isVerified: isVerified,
        };
        setCompanies(prev => [newCompany, ...prev]);
        const newUser: User = { id: `user-${generateUniqueId()}`, role: Role.RESOURCING_COMPANY, profile: newCompany };
        setAllUsers(prev => [...prev, newUser]);
        setUser(newUser);
    };

    // --- PROFILE & USER MANAGEMENT ---
    const updateEngineerProfile = (updatedProfile: Partial<EngineerProfile>) => {
        if (user && user.role === Role.ENGINEER) {
            const profileId = ('skills' in user.profile) ? user.profile.id : null;
            if (profileId) {
                 const newUser = { ...user, profile: { ...user.profile, ...updatedProfile } } as User;
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
             const newUser = { ...user, profile: { ...user.profile, ...updatedProfile } } as User;
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
            const subscriptionEndDate = new Date(trialEndDate);
            
            updateEngineerProfile({ 
                profileTier: ProfileTier.SKILLS,
                trialEndDate: trialEndDate,
                subscriptionEndDate: subscriptionEndDate,
                securityNetCreditsUsed: 0,
            });
            alert("30-Day Skills Profile trial started! You now have access to all premium features.");
        }
    };

    const boostProfile = () => {
        if (user && user.role === Role.ENGINEER && 'profileTier' in user.profile && user.profile.profileTier !== ProfileTier.BASIC) {
            updateEngineerProfile({ isBoosted: true });
            alert("Your profile has been boosted! You'll appear at the top of relevant searches for 12 hours.");
        } else {
            alert("Profile Boost is a premium feature. Please upgrade to a Skills Profile first.");
        }
    };
    
    const claimSecurityNetGuarantee = () => {
        if (!user || user.role !== Role.ENGINEER || !('profileTier' in user.profile)) return;
        
        const profile = user.profile as EngineerProfile;
        if (profile.profileTier === ProfileTier.BASIC) {
            alert("The Security Net Guarantee is only for paid Skills Profile subscribers.");
            return;
        }

        const creditsUsed = profile.securityNetCreditsUsed ?? 0;
        if (creditsUsed >= 3) {
            alert("You have already used all of your Security Net credits.");
            return;
        }

        const companyUserIds = new Set(allUsers.filter(u => u.role === Role.COMPANY).map(u => u.id));
        const hasCompanyConversations = conversations.some(c => 
            c.participantIds.includes(user.id) && c.participantIds.some(pId => companyUserIds.has(pId))
        );

        if (hasCompanyConversations) {
            alert("Our records show you have been in contact with companies. If you believe this is an error, please contact support.");
            return;
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
        setAllUsers(prev => prev.map(u => u.profile.id === profileId ? { ...u, profile: { ...u.profile, status: newStatus } } : u));
        
        if (userToUpdate.role === Role.ENGINEER) {
            setEngineers(prev => prev.map(e => e.id === profileId ? { ...e, status: newStatus } : e));
        } else if (userToUpdate.role === Role.COMPANY || userToUpdate.role === Role.RESOURCING_COMPANY) {
            setCompanies(prev => prev.map(c => c.id === profileId ? { ...c, status: newStatus } : c));
        }
    };
    
    // --- JOB & APPLICATION LOGIC ---
    const postJob = (jobData: Omit<Job, 'id' | 'companyId' | 'postedDate' | 'status'>) => {
        if (user && user.profile) {
            const newJob: Job = {
                ...jobData,
                id: `job-${generateUniqueId()}`,
                companyId: user.profile.id,
                postedDate: new Date(),
                startDate: jobData.startDate ? new Date(jobData.startDate) : null,
                status: 'active',
            };
            setJobs(prevJobs => [newJob, ...prevJobs]);

            const matchingEngineers = engineers.filter(e => e.profileTier !== ProfileTier.BASIC && e.status === 'active').slice(0, 3);
            matchingEngineers.forEach(eng => {
                const engUser = findUserByProfileId(eng.id);
                if (engUser) {
                    createNotification(engUser.id, NotificationType.NEW_JOB_MATCH, `A new job, '${newJob.title}', matches your skills.`, 'Job Search');
                }
            });
        }
    };

    const applyForJob = (jobId: string, engineerId?: string) => {
        let applyingEngineerId: string | undefined = engineerId;
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

        const newApplication: Application = { jobId, engineerId: applyingEngineerId, date: new Date(), status: ApplicationStatus.APPLIED };
        setApplications(prev => [newApplication, ...prev]);
        alert(`Application for ${engineers.find(e => e.id === applyingEngineerId)?.name} submitted successfully!`);
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
        
        const newPeerRating = parseFloat((totalPeer / engineerReviews.length).toFixed(1));
        const newCustomerRating = parseFloat((totalCustomer / engineerReviews.length).toFixed(1));

        updateEngineerProfile({ id: reviewData.engineerId, peerRating: newPeerRating, customerRating: newCustomerRating });
        setApplications(prev => prev.map(app => 
            (app.jobId === reviewData.jobId && app.engineerId === reviewData.engineerId)
            ? { ...app, status: ApplicationStatus.COMPLETED, reviewed: true }
            : app
        ));
        alert("Review submitted successfully!");
    };
    
    // --- MESSAGING LOGIC ---
    const sendMessage = async (conversationId: string, text: string) => {
        if (!user || isAiReplying) return;

        const newMessage: Message = {
            id: `msg-${generateUniqueId()}`, conversationId, senderId: user.id, text,
            timestamp: new Date(), isRead: true, // User's own message is read by them
        };
        
        const updatedMessagesWithUser = [...messages, newMessage];
        setMessages(updatedMessagesWithUser);

        const conversation = conversations.find(c => c.id === conversationId);
        if (!conversation) return;

        setConversations(prev => prev.map(c => 
            c.id === conversationId ? { ...c, lastMessageText: text, lastMessageTimestamp: newMessage.timestamp } : c
        ));
        
        setIsAiReplying(true);

        try {
            const recipientId = conversation.participantIds.find(id => id !== user.id);
            if (recipientId) {
                const otherParticipant = findUserById(recipientId);
                if (otherParticipant) {
                    await new Promise(resolve => setTimeout(resolve, 1200 + Math.random() * 800));
                    
                    const conversationHistory = updatedMessagesWithUser.filter(m => m.conversationId === conversationId);
                    const aiResponseText = await geminiService.generateChatResponse(conversationHistory, user, otherParticipant);
                    
                    const aiMessage: Message = {
                        id: `msg-${generateUniqueId()}`, conversationId, senderId: otherParticipant.id,
                        text: aiResponseText, timestamp: new Date(), isRead: false,
                    };
                    
                    setMessages(prev => [...prev, aiMessage]);
                    setConversations(prev => prev.map(c => 
                        c.id === conversationId ? { ...c, lastMessageText: aiResponseText, lastMessageTimestamp: aiMessage.timestamp } : c
                    ));

                    createNotification(user.id, NotificationType.MESSAGE, `You have a new message from ${otherParticipant.profile.name}.`, 'Messages');
                }
            }
        } catch (error) {
            console.error("Error generating AI response:", error);
            const aiErrorMessage: Message = {
                id: `msg-${generateUniqueId()}`, conversationId,
                senderId: conversation.participantIds.find(id => id !== user.id)!,
                text: "Sorry, I encountered an error and cannot respond right now.",
                timestamp: new Date(), isRead: false,
            };
            setMessages(prev => [...prev, aiErrorMessage]);
        } finally {
            setIsAiReplying(false);
        }
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
        let conversation = conversations.find(c =>
            c.participantIds.includes(user.id) && c.participantIds.includes(otherParticipant.id)
        );
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
    
    // --- FORUM LOGIC ---
    const createForumPost = async (post: { title: string; content: string; tags: string[] }) => {
        if (!user) { alert("You must be logged in to create a post."); return; }
        const moderationResult = await geminiService.moderateForumPost(post);
        const decision = moderationResult?.decision || 'reject';
        const reason = moderationResult?.reason || 'AI moderation failed.';
        if (decision === 'reject') { alert(`Post rejected by AI moderator: ${reason}`); return; }
        const newPost: ForumPost = {
            ...post, id: `post-${generateUniqueId()}`, authorId: user.id,
            timestamp: new Date(), upvotes: 0, downvotes: 0, status: 'approved',
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
        setForumPosts(prev => prev.map(post => 
            post.id === postId ? { ...post, upvotes: voteType === 'up' ? post.upvotes + 1 : post.upvotes, downvotes: voteType === 'down' ? post.downvotes + 1 : post.downvotes } : post
        ));
    };
    
    const voteOnComment = (commentId: string, voteType: 'up' | 'down') => {
        setForumComments(prev => prev.map(comment => 
            comment.id === commentId ? { ...comment, upvotes: voteType === 'up' ? comment.upvotes + 1 : comment.upvotes, downvotes: voteType === 'down' ? comment.downvotes + 1 : comment.downvotes } : comment
        ));
    };

    // --- CONTRACT & PAYMENT LOGIC ---
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

        let contractToUpdate: Contract | undefined;

        setContracts(prev => prev.map(c => {
            if (c.id === contractId) {
                contractToUpdate = c;
                return {
                    ...c,
                    milestones: c.milestones.map(m => m.id === milestoneId ? { ...m, status: MilestoneStatus.FUNDED_IN_PROGRESS } : m)
                };
            }
            return c;
        }));

        if(contractToUpdate) {
            const milestone = contractToUpdate.milestones.find(m => m.id === milestoneId);
            if(milestone) {
                 const newTransaction: Transaction = {
                    id: `txn-${generateUniqueId()}`,
                    userId: user.id,
                    contractId: contractId,
                    type: TransactionType.ESCROW_FUNDING,
                    description: `Funded Milestone: ${milestone.description}`,
                    amount: -milestone.amount,
                    date: new Date()
                };
                setTransactions(prev => [newTransaction, ...prev]);
            }
        }
    };

    const submitMilestoneForApproval = (contractId: string, milestoneId: string) => {
        setContracts(prev => prev.map(c => c.id === contractId ? {
            ...c,
            milestones: c.milestones.map(m => m.id === milestoneId ? { ...m, status: MilestoneStatus.SUBMITTED_FOR_APPROVAL } : m)
        } : c));
    };

    const approveMilestonePayout = (contractId: string, milestoneId: string) => {
         if(!user) return;
        let contractToUpdate: Contract | undefined;
        let engineerUser: User | undefined;

         setContracts(prev => prev.map(c => {
            if (c.id === contractId) {
                contractToUpdate = c;
                engineerUser = findUserByProfileId(c.engineerId);
                return {
                    ...c,
                    milestones: c.milestones.map(m => m.id === milestoneId ? { ...m, status: MilestoneStatus.COMPLETED_PAID } : m)
                };
            }
            return c;
        }));

        if (contractToUpdate && engineerUser) {
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
        }
    };

    const submitTimesheet = (contractId: string, timesheet: Omit<Timesheet, 'id' | 'status'>) => {
        const newTimesheet: Timesheet = { ...timesheet, id: `ts-${generateUniqueId()}`, status: 'submitted' };
        setContracts(prev => prev.map(c => c.id === contractId ? { ...c, timesheets: [...(c.timesheets || []), newTimesheet] } : c));
    };

    const approveTimesheet = (contractId: string, timesheetId: string) => {
        setContracts(prev => prev.map(c => c.id === contractId ? { ...c, timesheets: c.timesheets?.map(ts => ts.id === timesheetId ? { ...ts, status: 'approved' } : ts) } : c));
    };

    const upgradeSubscription = (profileId: string, toTier: ProfileTier) => {
        if (!user || user.role !== Role.ENGINEER) return;

        const price = TIER_PRICES[toTier];
        if (price === undefined) return;

        const subscriptionEndDate = new Date();
        subscriptionEndDate.setDate(subscriptionEndDate.getDate() + 30);

        updateEngineerProfile({
            id: profileId,
            profileTier: toTier,
            subscriptionEndDate,
            trialEndDate: undefined // Clear trial if upgrading
        });
        
        const newTransaction: Transaction = {
            id: `txn-${generateUniqueId()}`,
            userId: user.id,
            type: TransactionType.SUBSCRIPTION,
            description: `Subscription to ${toTier} tier`,
            amount: -price,
            date: new Date(),
        };
        setTransactions(prev => [newTransaction, ...prev]);
        alert(`Successfully upgraded to ${toTier} Profile!`);
    };

    // --- CONTEXT EXPORT ---
    return useMemo(() => ({
        user, allUsers, jobs, companies, engineers, login, loginAsSteve, logout, 
        updateEngineerProfile, updateCompanyProfile, postJob, startTrial, geminiService, 
        applications, applyForJob, createAndLoginEngineer, createAndLoginCompany, 
        createAndLoginResourcingCompany, boostProfile, claimSecurityNetGuarantee, 
        reactivateProfile, chatSession, conversations, messages, selectedConversationId, 
        setSelectedConversationId, findUserById, findUserByProfileId, sendMessage, 
        startConversationAndNavigate, reviews, submitReview, toggleUserStatus, toggleJobStatus, 
        notifications, markNotificationsAsRead, offerJob, acceptOffer, declineOffer,
        isAiReplying,
        forumPosts, forumComments, createForumPost, addForumComment, voteOnPost, voteOnComment,
        contracts, sendContractForSignature, signContract,
        transactions, fundMilestone, submitMilestoneForApproval, approveMilestonePayout,
        submitTimesheet, approveTimesheet, upgradeSubscription
    }), [user, allUsers, jobs, companies, engineers, applications, conversations, messages, selectedConversationId, reviews, notifications, isAiReplying, forumPosts, forumComments, contracts, transactions]);
};