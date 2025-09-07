import { useState, useCallback, useMemo, useEffect } from 'react';
import {
    User, Role, EngineerProfile, CompanyProfile, Job, Application, Review, Conversation, Message, Contract, Transaction,
    ProfileTier, ApplicationStatus, ContractStatus, MilestoneStatus, ContractType, Page, ForumPost, ForumComment, Notification,
    NotificationType, Project, ProjectRole, Invoice, InvoiceStatus, PaymentTerms, Language, Currency, Country, TimesheetStatus,
    Timesheet, Insight, TransactionType, InvoiceItem
} from '../types';
// FIX: Added missing mock data imports to resolve reference errors.
import { ALL_MOCK_USERS, MOCK_JOBS, MOCK_APPLICATIONS, MOCK_REVIEWS, MOCK_CONVERSATIONS, MOCK_MESSAGES, MOCK_CONTRACTS, MOCK_TRANSACTIONS, MOCK_PROJECTS, MOCK_FORUM_POSTS, MOCK_FORUM_COMMENTS, MOCK_NOTIFICATIONS } from '../data/mockData';
import { eSignatureService } from '../services/eSignatureService';
import { geminiService } from '../services/geminiService';

const generateUniqueId = () => `id-${Math.random().toString(36).substring(2, 10)}`;

export const useAppLogic = () => {
    // --- STATE MANAGEMENT ---
    const [user, setUser] = useState<User | null>(null);
    const [allUsers, setAllUsers] = useState<User[]>(ALL_MOCK_USERS);
    const [engineers, setEngineers] = useState<EngineerProfile[]>(allUsers.filter(u => u.role === Role.ENGINEER).map(u => u.profile as EngineerProfile));
    const [companies, setCompanies] = useState<CompanyProfile[]>(allUsers.filter(u => u.role === Role.COMPANY || u.role === Role.RESOURCING_COMPANY).map(u => u.profile as CompanyProfile));
    const [jobs, setJobs] = useState<Job[]>(MOCK_JOBS);
    const [applications, setApplications] = useState<Application[]>(MOCK_APPLICATIONS);
    const [reviews, setReviews] = useState<Review[]>(MOCK_REVIEWS);
    const [conversations, setConversations] = useState<Conversation[]>(MOCK_CONVERSATIONS);
    const [messages, setMessages] = useState<Message[]>(MOCK_MESSAGES);
    const [contracts, setContracts] = useState<Contract[]>(MOCK_CONTRACTS);
    const [transactions, setTransactions] = useState<Transaction[]>(MOCK_TRANSACTIONS);
    const [projects, setProjects] = useState<Project[]>(MOCK_PROJECTS);
    const [invoices, setInvoices] = useState<Invoice[]>([]);
    const [forumPosts, setForumPosts] = useState<ForumPost[]>(MOCK_FORUM_POSTS);
    const [forumComments, setForumComments] = useState<ForumComment[]>(MOCK_FORUM_COMMENTS);
    const [notifications, setNotifications] = useState<Notification[]>(MOCK_NOTIFICATIONS);
    
    const [selectedConversationId, setSelectedConversationId] = useState<string | null>(null);
    const [isAiReplying, setIsAiReplying] = useState(false);
    
    // --- INTERNATIONALIZATION ---
    const [language, setLanguage] = useState<Language>(Language.ENGLISH);
    const [currency, setCurrency] = useState<Currency>(Currency.GBP);
    // Add translations as needed
    const translations: Record<string, Record<string, string>> = {
        [Language.ENGLISH]: {
            signed_in_as: 'Signed in as',
            logout: 'Logout',
            // Pricing Page
            pricing_title: 'Simple, Powerful Pricing',
            pricing_subtitle: 'Choose the plan that fits your career goals. No hidden fees, cancel anytime.',
            for_engineers: 'For Engineers',
            for_companies_resourcing: 'For Companies & Resourcing',
            // Tiers
            bronze_tier: 'Bronze Profile',
            bronze_desc: 'The essentials to get you started and visible on the platform.',
            free: 'Free',
            forever: 'Forever',
            get_started: 'Get Started',
            bronze_feat_1: 'Basic Professional Profile',
            bronze_feat_2: 'Set your availability',
            bronze_feat_3: 'Apply for any job',
            bronze_feat_4: 'Direct messaging with companies',

            silver_tier: 'Silver Profile',
            silver_desc: 'Unlock premium tools to showcase your skills and get noticed.',
            choose_silver: 'Choose Silver',
            month: 'month',
            silver_feat_1: 'All Bronze features, plus:',
            silver_feat_2: 'Detailed Skills Profile',
            silver_feat_3: 'AI Profile & Skill Tools',
            silver_feat_4: '{count} Profile Boost Credit / month',
            silver_feat_5: 'AI Career Coach',
            silver_feat_6: 'Higher search ranking',
            silver_feat_7: 'Security Net Guarantee',

            gold_tier: 'Gold Profile',
            gold_desc: 'For the serious freelancer. Maximize your visibility and unlock advanced features.',
            start_free_trial: 'Start Free Trial',
            gold_feat_1: 'All Silver features, plus:',
            gold_feat_2: '{count} Profile Boost Credits / month',
            gold_feat_3: 'Storyboard Case Studies',
            
            platinum_tier: 'Platinum Profile',
            platinum_desc: 'The ultimate toolkit for freelance professionals and business owners.',
            choose_platinum: 'Choose Platinum',
            platinum_feat_1: 'All Gold features, plus:',
            platinum_feat_2: '{count} Profile Boost Credits / month',
            platinum_feat_3: 'Advanced Profile Analytics',
            platinum_feat_4: 'Priority Support',
            platinum_feat_5: 'Early access to new features',

            for_companies: 'For Companies',
            free_forever: 'Free, Forever.',
            company_pricing_desc: "Our model is simple: it's free for companies to post jobs and find talent. This creates a vibrant marketplace that attracts the best engineers, who then subscribe for premium tools to showcase their skills for your projects.",
            company_feat_1: 'Post unlimited jobs',
            company_feat_2: 'Search entire talent pool',
            company_feat_3: 'AI Smart Match applicants',
            company_feat_4: 'Integrated contracts',
            company_feat_5: 'Direct messaging',
            post_job_free: 'Post a Job for Free',
            
            agency_plan: 'Agency Plan',
            agency_desc: 'Manage your talent roster, find jobs on their behalf, and streamline your workflow.',
            agency_feat_1: 'Manage up to {count} engineers',
            agency_feat_2: 'Unified dashboard for all talent',
            agency_feat_3: 'Apply for jobs on behalf of engineers',
            agency_feat_4: 'Centralized messaging',
            agency_feat_5: 'Track all placements & contracts',
            agency_feat_6: 'Consolidated reporting',
            agency_feat_7: 'Additional engineers only {price}/mo each',
        },
        [Language.SPANISH]: {
             signed_in_as: 'Sesión iniciada como',
            logout: 'Cerrar sesión',
            pricing_title: 'Precios Simples y Potentes',
            pricing_subtitle: 'Elige el plan que se ajuste a tus metas profesionales. Sin comisiones ocultas, cancela cuando quieras.',
            for_engineers: 'Para Ingenieros',
            for_companies_resourcing: 'Para Empresas y Agencias',
            bronze_tier: 'Perfil Bronce',
            bronze_desc: 'Lo esencial para empezar y ser visible en la plataforma.',
            free: 'Gratis',
            forever: 'Para siempre',
            get_started: 'Comenzar',
            bronze_feat_1: 'Perfil Profesional Básico',
            bronze_feat_2: 'Establece tu disponibilidad',
            bronze_feat_3: 'Aplica a cualquier trabajo',
            bronze_feat_4: 'Mensajería directa con empresas',
            silver_tier: 'Perfil Plata',
            silver_desc: 'Desbloquea herramientas premium para mostrar tus habilidades y destacar.',
            choose_silver: 'Elegir Plata',
            month: 'mes',
            silver_feat_1: 'Todo lo de Bronce, y además:',
            silver_feat_2: 'Perfil de Habilidades Detallado',
            silver_feat_3: 'Herramientas de IA para Perfil y Habilidades',
            silver_feat_4: '{count} Crédito de Profile Boost / mes',
            silver_feat_5: 'Asistente de Carrera con IA',
            silver_feat_6: 'Ranking más alto en búsquedas',
            silver_feat_7: 'Garantía "Security Net"',
            gold_tier: 'Perfil Oro',
            gold_desc: 'Para el freelancer serio. Maximiza tu visibilidad y desbloquea funciones avanzadas.',
            start_free_trial: 'Iniciar Prueba Gratuita',
            gold_feat_1: 'Todo lo de Plata, y además:',
            gold_feat_2: '{count} Créditos de Profile Boost / mes',
            gold_feat_3: 'Estudios de Caso Visuales (Storyboard)',
            platinum_tier: 'Perfil Platino',
            platinum_desc: 'El conjunto de herramientas definitivo para profesionales y dueños de negocios.',
            choose_platinum: 'Elegir Platino',
            platinum_feat_1: 'Todo lo de Oro, y además:',
            platinum_feat_2: '{count} Créditos de Profile Boost / mes',
            platinum_feat_3: 'Analíticas de Perfil Avanzadas',
            platinum_feat_4: 'Soporte Prioritario',
            platinum_feat_5: 'Acceso anticipado a nuevas funciones',
            for_companies: 'Para Empresas',
            free_forever: 'Gratis, Para Siempre.',
            company_pricing_desc: 'Nuestro modelo es simple: es gratis para las empresas publicar trabajos y encontrar talento. Esto crea un mercado vibrante que atrae a los mejores ingenieros, quienes luego se suscriben a herramientas premium para mostrar sus habilidades para tus proyectos.',
            company_feat_1: 'Publica trabajos ilimitados',
            company_feat_2: 'Busca en todo el pool de talento',
            company_feat_3: 'Postulantes con "AI Smart Match"',
            company_feat_4: 'Contratos integrados',
            company_feat_5: 'Mensajería directa',
            post_job_free: 'Publica un Trabajo Gratis',
            agency_plan: 'Plan Agencia',
            agency_desc: 'Gestiona tu lista de talentos, encuentra trabajos en su nombre y optimiza tu flujo de trabajo.',
            agency_feat_1: 'Gestiona hasta {count} ingenieros',
            agency_feat_2: 'Panel unificado para todo el talento',
            agency_feat_3: 'Aplica a trabajos en nombre de ingenieros',
            agency_feat_4: 'Mensajería centralizada',
            agency_feat_5: 'Seguimiento de todas las colocaciones y contratos',
            agency_feat_6: 'Informes consolidados',
            agency_feat_7: 'Ingenieros adicionales solo {price}/mes cada uno',
        }
    };

    const t = useCallback((key: string, options?: any) => {
        let translation = translations[language]?.[key] || translations[Language.ENGLISH][key] || key;
        if (options && typeof options === 'object') {
            Object.keys(options).forEach(optionKey => {
                translation = translation.replace(`{${optionKey}}`, options[optionKey]);
            });
        }
        return translation;
    }, [language]);

    const getRegionalPrice = useCallback((basePriceGBP: number) => {
        const multipliers: Record<string, number> = { [Country.UK]: 1, [Country.USA]: 1.2, [Country.IRELAND]: 1.1, [Country.GERMANY]: 1.1, [Country.FRANCE]: 1.1, 'in': 0.5 };
        const exchangeRates: Record<Currency, number> = { [Currency.GBP]: 1, [Currency.USD]: 1.25, [Currency.EUR]: 1.18 };
        
        let multiplier = 1;
        if (user?.profile?.country) {
            multiplier = multipliers[user.profile.country] || 1;
        } else {
            // Infer from currency for guests
            if (currency === Currency.USD) multiplier = multipliers[Country.USA];
            if (currency === Currency.EUR) multiplier = multipliers[Country.GERMANY];
        }

        const regionalPriceGBP = basePriceGBP * multiplier;
        const finalAmount = regionalPriceGBP * exchangeRates[currency];

        return { amount: finalAmount, symbol: currency };
    }, [user, currency]);
    
    // --- AI CHAT ---
    const [currentPageContext, setCurrentPageContext] = useState<string>('Landing Page');
    const chatSession = useMemo(() => geminiService.startChat(), []);
    
    // --- AUTH & USER MANAGEMENT ---
    const login = useCallback((userToLogin: User) => {
        if (userToLogin.profile.isBanned) {
            const banEndDate = userToLogin.profile.banEndDate;
            if (banEndDate && new Date(banEndDate) > new Date()) {
                alert(`Your account is suspended. Access will be restored on ${new Date(banEndDate).toLocaleDateString()}.`);
                return;
            } else {
                 // Ban expired, reactivate account
                const updatedProfile = { ...userToLogin.profile, isBanned: false, warnings: 0, status: 'active' as const };
                const updatedUser = { ...userToLogin, profile: updatedProfile };
                setAllUsers(prev => prev.map(u => u.id === updatedUser.id ? updatedUser : u));
                setUser(updatedUser);
                alert("Welcome back! Your account suspension has ended. Please adhere to the platform's code of conduct.");
                return;
            }
        }
        setUser(userToLogin);
    }, []);

    const logout = useCallback(() => setUser(null), []);

    const findUserById = useCallback((userId: string) => allUsers.find(u => u.id === userId), [allUsers]);
    const findUserByProfileId = useCallback((profileId: string) => allUsers.find(u => u.profile.id === profileId), [allUsers]);
    
     const createAndLoginUser = (role: Role, formData: any) => {
        const country = formData.country;
        const emailTld = formData.email.split('.').pop()?.toLowerCase();
        
        const countryTldMap: Record<string, string> = { 'uk': Country.UK, 'com': Country.USA, 'de': Country.GERMANY, 'fr': Country.FRANCE, 'ie': Country.IRELAND };
        const expectedCountry = countryTldMap[emailTld as string];

        let alertMessage = `Account created for ${formData.email}!`;
        if (expectedCountry && expectedCountry !== country) {
            alertMessage += `\n\n[Admin Alert] Potential region mismatch detected. User registered in ${country} but email TLD suggests ${expectedCountry}. Manual review may be required.`;
        }

        const newUser: User = {
            id: `user-${generateUniqueId()}`,
            role,
            profile: {
                id: `${role === Role.ENGINEER ? 'eng' : 'comp'}-${generateUniqueId()}`,
                name: role === Role.ENGINEER ? formData.name : formData.companyName,
                avatar: `https://i.pravatar.cc/150?u=${formData.email}`,
                status: 'active',
                language: language,
                currency: currency,
                ...formData,
                ...(role === Role.ENGINEER && {
                    profileTier: ProfileTier.BASIC,
                    skills: [],
                    certifications: [],
                    caseStudies: [],
                    socials: [],
                    isBoosted: false,
                    joinDate: new Date(),
                    profileViews: 0,
                    searchAppearances: 0,
                    jobInvites: 0,
                    reputation: 50,
                    complianceScore: 50,
                    badges: [],
                    contact: { email: formData.email, phone: '' },
                }),
                ...(role !== Role.ENGINEER && {
                    contact: { email: formData.email, phone: 'N/A' },
                    logo: `https://logo.clearbit.com/${formData.website}`,
                    consentToFeature: false,
                    country: formData.country,
                }),
                warnings: 0,
                isBanned: false,
                banHistory: [],
            }
        };
        setAllUsers(prev => [...prev, newUser]);
        if (newUser.role === Role.ENGINEER) setEngineers(prev => [...prev, newUser.profile as EngineerProfile]);
        else setCompanies(prev => [...prev, newUser.profile as CompanyProfile]);
        
        login(newUser);
        alert(alertMessage);
    };

    const createAndLoginEngineer = (formData: any) => createAndLoginUser(Role.ENGINEER, formData);
    const createAndLoginCompany = (formData: any) => createAndLoginUser(Role.COMPANY, formData);
    const createAndLoginResourcingCompany = (formData: any) => createAndLoginUser(Role.RESOURCING_COMPANY, formData);
    
    const updateEngineerProfile = useCallback((updatedProfile: Partial<EngineerProfile>) => {
        if (!user || user.role !== Role.ENGINEER) return;
        
        const newProfile = { ...user.profile, ...updatedProfile } as EngineerProfile;
        const newUser = { ...user, profile: newProfile };
        
        setUser(newUser);
        setEngineers(prev => prev.map(e => e.id === newProfile.id ? newProfile : e));
        setAllUsers(prev => prev.map(u => u.id === user.id ? newUser : u));
    }, [user]);

    const updateCompanyProfile = useCallback((updatedProfile: Partial<CompanyProfile>) => {
        if (!user || user.role === Role.ENGINEER) return;
        
        const newProfile = { ...user.profile, ...updatedProfile } as CompanyProfile;
        const newUser = { ...user, profile: newProfile };
        
        setUser(newUser);
        setCompanies(prev => prev.map(c => c.id === newProfile.id ? newProfile : c));
        setAllUsers(prev => prev.map(u => u.id === user.id ? newUser : u));
    }, [user]);

    const postJob = useCallback((jobData: any): Job | null => {
        if(!user || user.role === Role.ENGINEER) return null;
        
        const newJob: Job = {
            id: `job-${generateUniqueId()}`,
            companyId: user.profile.id,
            ...jobData,
            postedDate: new Date(),
            status: 'active'
        };
        setJobs(prev => [newJob, ...prev]);
        return newJob;
    }, [user]);

     const reportUser = useCallback((profileId: string) => {
        setAllUsers(prevUsers => {
            const userToUpdate = prevUsers.find(u => u.profile.id === profileId);
            if (!userToUpdate) return prevUsers;

            const newWarnings = (userToUpdate.profile.warnings || 0) + 1;
            let isBanned = userToUpdate.profile.isBanned || false;
            let banEndDate = userToUpdate.profile.banEndDate;
            const newBanHistory = [...(userToUpdate.profile.banHistory || [])];

            if (newWarnings >= 3 && !isBanned) {
                const previousBan = newBanHistory.length > 0 ? newBanHistory[newBanHistory.length - 1] : null;
                const newBanDuration = previousBan ? previousBan.duration * 3 : 30; // 30 days for first ban
                
                const endDate = new Date();
                endDate.setDate(endDate.getDate() + newBanDuration);

                isBanned = true;
                banEndDate = endDate.toISOString();
                newBanHistory.push({ date: new Date().toISOString(), duration: newBanDuration });
                
                alert(`${userToUpdate.profile.name} has received their third strike and has been banned for ${newBanDuration} days.`);
            } else if (!isBanned) {
                 alert(`${userToUpdate.profile.name} has been reported. This is warning number ${newWarnings}.`);
            }
// FIX: Added 'as const' to 'suspended' to ensure the correct literal type is inferred by TypeScript, resolving the type mismatch error for the 'status' property.
            const updatedProfile = { ...userToUpdate.profile, warnings: newWarnings, isBanned, banEndDate, banHistory: newBanHistory, status: isBanned ? 'suspended' as const : userToUpdate.profile.status };
            return prevUsers.map(u => u.profile.id === profileId ? { ...u, profile: updatedProfile } : u);
        });
    }, []);

    const sendMessage = useCallback(async (conversationId: string, text: string) => {
        if (!user) return;
        const convo = conversations.find(c => c.id === conversationId);
        if (!convo) return;
        const otherParticipant = findUserById(convo.participantIds.find(id => id !== user.id)!);
        if (!otherParticipant) return;

        const userMessage: Message = { id: `msg-${generateUniqueId()}`, conversationId, senderId: user.id, text, timestamp: new Date(), isRead: false };
        setMessages(prev => [...prev, userMessage]);
        
        setIsAiReplying(true);
        const currentHistory = [...messages.filter(m => m.conversationId === conversationId), userMessage];
        const aiResponseText = await geminiService.generateChatResponse(currentHistory, user, otherParticipant);
        const translatedText = await geminiService.translateText(aiResponseText, otherParticipant.profile.language, user.profile.language);

        const aiMessage: Message = { id: `msg-${generateUniqueId()}`, conversationId, senderId: otherParticipant.id, text: translatedText, originalText: aiResponseText, timestamp: new Date(), isRead: false };
        setMessages(prev => [...prev, aiMessage]);
        setConversations(prev => prev.map(c => c.id === conversationId ? { ...c, lastMessageText: translatedText, lastMessageTimestamp: new Date() } : c));
        setIsAiReplying(false);
    }, [user, conversations, messages, findUserById]);
    
    const applyForJob = useCallback((jobId: string, engineerId?: string, isSupercharged: boolean = false) => {
        if (!user || user.role !== Role.ENGINEER) return;
        const engId = engineerId || user.profile.id;

        // Check if already applied
        if (applications.some(app => app.jobId === jobId && app.engineerId === engId)) {
            alert("You have already applied for this job.");
            return;
        }

        const newApplication: Application = {
            jobId,
            engineerId: engId,
            date: new Date(),
            status: ApplicationStatus.APPLIED,
            reviewed: false,
            isSupercharged,
        };

        setApplications(prev => [newApplication, ...prev]);
        
        if (isSupercharged) {
            const newTransaction: Transaction = {
                id: `txn-${generateUniqueId()}`,
                userId: user.id,
                type: TransactionType.SUPERCHARGE,
                description: `Supercharged application for job ID: ${jobId}`,
                amount: -1.99,
                date: new Date(),
            };
            setTransactions(prev => [...prev, newTransaction]);
            alert('Application Supercharged for £1.99! Your application will be highlighted to the company.');
        } else {
            alert('Application submitted successfully!');
        }
    }, [user, applications]);

    const superchargeApplication = useCallback((job: Job) => {
        if (!user || user.role !== Role.ENGINEER || (user.profile as EngineerProfile).profileTier !== ProfileTier.BASIC) {
            return;
        }
        if (window.confirm(`Are you sure you want to Supercharge your application for "${job.title}" for £1.99? This will make your application stand out and place it at the top of the list for the company.`)) {
            // In a real app, this would trigger a payment modal. For this demo, we apply directly.
            applyForJob(job.id, user.profile.id, true);
        }
    }, [user, applyForJob]);

    const generateInvoice = useCallback((contractId: string, paymentTerms: PaymentTerms) => {
        const contract = contracts.find(c => c.id === contractId);
        if (!contract || !user) return;

        const approvedMilestones = contract.milestones.filter(m => m.status === MilestoneStatus.APPROVED_PENDING_INVOICE);
        if (approvedMilestones.length === 0) {
            alert("No approved milestones to invoice.");
            return;
        }

        const items: InvoiceItem[] = approvedMilestones.map(m => ({
            description: `Milestone: ${m.description}`,
            amount: m.amount,
        }));

        const total = items.reduce((sum, item) => sum + item.amount, 0);

        const getDueDate = (terms: PaymentTerms): Date => {
            const date = new Date();
            switch (terms) {
                case PaymentTerms.NET7: date.setDate(date.getDate() + 7); break;
                case PaymentTerms.NET14: date.setDate(date.getDate() + 14); break;
                case PaymentTerms.NET30: date.setDate(date.getDate() + 30); break;
            }
            return date;
        };

        const newInvoice: Invoice = {
            id: `inv-${generateUniqueId()}`,
            contractId,
            companyId: contract.companyId,
            engineerId: contract.engineerId,
            issueDate: new Date(),
            dueDate: getDueDate(paymentTerms),
            items,
            total,
            status: InvoiceStatus.SENT,
            paymentTerms
        };
        setInvoices(prev => [...prev, newInvoice]);

        // Update milestone statuses to Paid
        const approvedMilestoneIds = new Set(approvedMilestones.map(m => m.id));
        setContracts(prevContracts => prevContracts.map(c => {
            if (c.id === contractId) {
                return {
                    ...c,
                    milestones: c.milestones.map(m =>
                        approvedMilestoneIds.has(m.id) ? { ...m, status: MilestoneStatus.COMPLETED_PAID } : m
                    )
                };
            }
            return c;
        }));

        alert(`Invoice #${newInvoice.id.slice(-6)} for £${total.toFixed(2)} generated and sent!`);
    }, [contracts, user]);
    
    const isPremium = (profile: EngineerProfile) => profile.profileTier !== ProfileTier.BASIC;

    const getCareerCoaching = async (): Promise<{ insights?: Insight[]; error?: string; }> => {
        if (!user || user.role !== Role.ENGINEER) {
            return { error: 'User is not an engineer.' };
        }
        const profile = user.profile as EngineerProfile;
        // Mock trending skills for the demo
        const trendingSkills = ['DM NVX', 'Q-SYS', 'Cloud Architecture', 'Cybersecurity for AV', 'MS Teams Rooms Certified'];
        return geminiService.getCareerCoaching(profile, trendingSkills);
    };

    return {
        user, login, logout, allUsers, engineers, companies, jobs, applications, reviews, conversations, messages,
        contracts, transactions, projects, forumPosts, forumComments, notifications, invoices,
        selectedConversationId, setSelectedConversationId, sendMessage, isAiReplying, findUserById, findUserByProfileId,
        updateEngineerProfile, updateCompanyProfile, postJob, reportUser, createAndLoginEngineer, createAndLoginCompany,
        createAndLoginResourcingCompany,
        startConversationAndNavigate: (otherPartyProfileId: string, navigate: () => void) => { console.log('startConversationAndNavigate called'); navigate(); },
        startTrial: () => alert('Starting 14-day free trial of Gold tier!'),
        boostProfile: () => alert('Profile Boosted!'),
        purchaseDayPass: () => alert('Day Pass purchased!'),
        claimSecurityNetGuarantee: () => alert('Security Net claimed!'),
        upgradeSubscription: (profileId: string, newTier: ProfileTier) => alert(`Upgraded ${profileId} to ${newTier}`),
        reactivateProfile: () => alert('Profile reactivated!'),
        toggleUserStatus: (profileId: string) => alert(`Toggled status for ${profileId}`),
        toggleJobStatus: (jobId: string) => alert(`Toggled status for ${jobId}`),
        applyForJob,
        superchargeApplication,
        acceptOffer: (jobId: string, engineerId: string) => alert(`Accepted offer for job ${jobId}`),
        declineOffer: (jobId: string, engineerId: string) => alert(`Declined offer for job ${jobId}`),
        submitReview: (reviewData) => console.log('Review submitted', reviewData),
        sendContractForSignature: async (contract) => { 
            await eSignatureService.createSignatureRequest(contract.id, 'mock@email.com');
            setContracts(prev => prev.map(c => c.id === contract.id ? {...c, status: ContractStatus.PENDING_SIGNATURE} : c));
            alert('Contract sent for signature!');
        },
        signContract: (contractId: string, signatureName: string) => {
            setContracts(prev => prev.map(c => {
                if(c.id === contractId) {
                    if (user?.role === Role.ENGINEER) return {...c, engineerSignature: {name: signatureName, date: new Date()}, status: ContractStatus.SIGNED};
                    if (user?.role === Role.COMPANY || user?.role === Role.ADMIN) return {...c, companySignature: {name: signatureName, date: new Date()}, status: ContractStatus.ACTIVE};
                }
                return c;
            }));
            alert('Contract signed!');
        },
        fundMilestone: (contractId, milestoneId) => {
            setContracts(prev => prev.map(c => c.id === contractId ? {...c, milestones: c.milestones.map(m => m.id === milestoneId ? {...m, status: MilestoneStatus.FUNDED_IN_PROGRESS} : m)} : c));
        },
        submitMilestoneForApproval: (contractId, milestoneId) => {
             setContracts(prev => prev.map(c => c.id === contractId ? {...c, milestones: c.milestones.map(m => m.id === milestoneId ? {...m, status: MilestoneStatus.SUBMITTED_FOR_APPROVAL} : m)} : c));
        },
        approveMilestone: (contractId, milestoneId) => {
            setContracts(prev => prev.map(c => c.id === contractId ? {...c, milestones: c.milestones.map(m => m.id === milestoneId ? {...m, status: MilestoneStatus.APPROVED_PENDING_INVOICE} : m)} : c));
        },
        submitTimesheet: (contractId, timesheetData) => {
            const newTimesheet = { ...timesheetData, id: generateUniqueId(), contractId, engineerId: user!.profile.id, status: TimesheetStatus.SUBMITTED };
            setContracts(prev => prev.map(c => c.id === contractId ? { ...c, timesheets: [...(c.timesheets || []), newTimesheet] } : c));
        },
        approveTimesheet: (contractId, timesheetId) => {
             setContracts(prev => prev.map(c => c.id === contractId ? { ...c, timesheets: (c.timesheets || []).map(ts => ts.id === timesheetId ? {...ts, status: TimesheetStatus.APPROVED} : ts) } : c));
        },
        payInvoice: (invoiceId) => setInvoices(prev => prev.map(i => i.id === invoiceId ? {...i, status: InvoiceStatus.PAID} : i)),
        generateInvoice,
        inviteEngineerToJob: (jobId: string, engineerId: string) => alert(`Invited engineer ${engineerId} to job ${jobId}`),
        assignEngineerToProjectRole: (projectId, roleId, engineerId) => {
            setProjects(prev => prev.map(p => p.id === projectId ? {...p, roles: p.roles.map(r => r.id === roleId ? {...r, assignedEngineerId: engineerId} : r) } : p));
        },
        createForumPost: async (postData) => {
            const moderation = await geminiService.moderateForumPost(postData);
            if (moderation?.decision === 'reject') {
                alert(`Post rejected by AI moderation: ${moderation.reason}`);
                return;
            }
            const newPost: ForumPost = { ...postData, id: generateUniqueId(), authorId: user!.profile.id, timestamp: new Date(), upvotes: 0, downvotes: 0, status: 'approved' };
            setForumPosts(prev => [newPost, ...prev]);
             alert('Post submitted and approved!');
        },
        addForumComment: (commentData) => {
            const newComment: ForumComment = { ...commentData, id: generateUniqueId(), authorId: user!.profile.id, timestamp: new Date(), upvotes: 0, downvotes: 0 };
            setForumComments(prev => [...prev, newComment]);
        },
        voteOnPost: (postId, vote) => {
            setForumPosts(prev => prev.map(p => p.id === postId ? {...p, [vote === 'up' ? 'upvotes' : 'downvotes']: p[vote === 'up' ? 'upvotes' : 'downvotes'] + 1} : p));
        },
        voteOnComment: (commentId, vote) => {
             setForumComments(prev => prev.map(c => c.id === commentId ? {...c, [vote === 'up' ? 'upvotes' : 'downvotes']: c[vote === 'up' ? 'upvotes' : 'downvotes'] + 1} : c));
        },
        markNotificationsAsRead: (userId) => {
            setNotifications(prev => prev.map(n => n.userId === userId ? {...n, isRead: true} : n));
        },
        chatSession,
        currentPageContext, setCurrentPageContext,
        geminiService,
        isPremium,
        getCareerCoaching,
        language, setLanguage, currency, setCurrency, t, getRegionalPrice,
    };
};