import { useState, useMemo, useEffect } from 'react';
import { PoundSterling, DollarSign } from '../components/Icons.tsx';
// FIX: Added Invoice and TimesheetStatus to the type import to support the new `invoices` state and fix enum errors.
import { Role, EngineerProfile, User, Job, Application, Currency, Conversation, Message, Review, CompanyProfile, ApplicationStatus, Notification, NotificationType, AppContextType, ForumPost, ForumComment, ProfileTier, Contract, ContractStatus, ContractType, Milestone, MilestoneStatus, Transaction, TransactionType, Timesheet, Compliance, IdentityVerification, Discipline, JobSkillRequirement, Badge, Project, ProjectRole, Invoice, Insight, Language, LocalizationFunction, Country, InvoiceItem, PaymentTerms, TimesheetStatus, InvoiceStatus } from '../types/index.ts';
import { MOCK_JOBS, MOCK_ENGINEERS, MOCK_USERS, MOCK_USER_FREE_ENGINEER, ALL_MOCK_USERS, MOCK_CONVERSATIONS, MOCK_MESSAGES, MOCK_APPLICATIONS, MOCK_REVIEWS, MOCK_COMPANIES, MOCK_NOTIFICATIONS, MOCK_FORUM_POSTS, MOCK_FORUM_COMMENTS, MOCK_CONTRACTS, MOCK_TRANSACTIONS, MOCK_PROJECTS } from '../data/mockData.ts';
import { geminiService } from '../services/geminiService.ts';
import type { Chat } from '@google/genai';
import { eSignatureService } from '../services/eSignatureService.ts';
import { BADGES } from '../data/badges.ts';

// --- CONSTANTS ---
export const APP_NAME = "TechSubbies.com";
// FIX: Add missing currency icons to satisfy the Currency enum type.
export const CURRENCY_ICONS: { [key in Currency]: React.ComponentType<any> } = {
    [Currency.GBP]: PoundSterling,
    [Currency.USD]: DollarSign,
    [Currency.EUR]: PoundSterling, // Placeholder, a Euro icon would be better.
    [Currency.AUD]: DollarSign,
    [Currency.INR]: DollarSign, // Placeholder, a Rupee icon would be better.
    [Currency.CAD]: DollarSign,
    [Currency.BRL]: DollarSign,
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
    const [currentPageContext, setCurrentPageContext] = useState<string>('Landing Page');
    const [invoices, setInvoices] = useState<Invoice[]>([]);
    const [language, setLanguageState] = useState<Language>(Language.EN);
    const [currency, setCurrencyState] = useState<Currency>(Currency.GBP);
    
    // --- LOCALIZATION & PRICING ---
    const translations: Record<Language, Record<string, string>> = {
        [Language.EN]: {
            pricing_title: "Flexible Pricing for Every Professional",
            pricing_subtitle: "Choose the plan that best fits your career goals. All plans include direct messaging, contract management, and secure payments.",
            free: "Free",
            forever: "Forever",
            month: "mo",
            get_started: "Get Started",
            choose_silver: "Choose Silver",
            start_free_trial: "Start Free Trial",
            choose_platinum: "Choose Platinum",
            for_engineers: "For Engineers",
            for_companies_resourcing: "For Companies & Resourcing",
            bronze_tier: "Bronze",
            bronze_desc: "The essential on-ramp for visibility in entry-level and support roles.",
            bronze_feat_1: "Public Professional Profile",
            bronze_feat_2: "Appear in General Searches",
            bronze_feat_3: "Set Availability Calendar",
            bronze_feat_4: "Search and Apply for Jobs",
            silver_tier: "Silver",
            silver_desc: "For the growing professional who needs to stand out with proven credentials and access powerful tools.",
            silver_feat_1: "Everything in Bronze, plus:",
            silver_feat_2: "Core Skills (Tags)",
            silver_feat_3: "Verified Certifications",
            silver_feat_4: "{count} Specialist Role",
            silver_feat_5: "AI-Powered Tools",
            silver_feat_6: "Priority Search Ranking",
            silver_feat_7: "Visual Case Studies (Storyboards)",
            gold_tier: "Gold",
            gold_desc: "For the established specialist who needs to showcase a diverse range of deep expertise.",
            gold_feat_1: "Everything in Silver, plus:",
            gold_feat_2: "Up to {count} Specialist Roles",
            gold_feat_3: "Enhanced Search Visibility",
            platinum_tier: "Platinum",
            platinum_desc: "For the elite freelancer or small business owner who needs advanced tools and maximum visibility.",
            platinum_feat_1: "Everything in Gold, plus:",
            platinum_feat_2: "Up to {count} Specialist Roles",
            platinum_feat_3: "Profile Analytics",
            platinum_feat_4: "Advanced Profile Customization",
            platinum_feat_5: "Dedicated Support",
            for_companies: "For Companies",
            free_forever: "Free. Forever.",
            company_pricing_desc: "Our model is simple: we provide free, unlimited access for companies to find talent. This creates a vibrant marketplace that attracts the best engineers, who subscribe for our premium career tools.",
            company_feat_1: "Unlimited Job Posts",
            company_feat_2: "Search Full Engineer Database",
            company_feat_3: "AI Smart Match to find the best talent",
            company_feat_4: "Direct Messaging & Hiring",
            company_feat_5: "Integrated Contracts & Escrow",
            post_job_free: "Post a Job For Free",
            agency_plan: "Agency Plan",
            agency_desc: "A dedicated plan for resourcing companies to manage their talent roster and find contracts on their behalf.",
            agency_feat_1: "Manage up to {count} Engineers",
            agency_feat_2: "Search the full job board",
            agency_feat_3: "Apply for jobs on behalf of engineers",
            agency_feat_4: "Centralized messaging portal",
            agency_feat_5: "Consolidated contract management",
            agency_feat_6: "Roster performance analytics",
            agency_feat_7: "Additional engineers at {price}/mo",
            signed_in_as: "Signed in as",
            logout: "Logout",
        },
        [Language.ES]: {
            pricing_title: "Precios Flexibles para Cada Profesional",
            pricing_subtitle: "Elige el plan que mejor se adapte a tus metas profesionales. Todos los planes incluyen mensajería directa, gestión de contratos y pagos seguros.",
            free: "Gratis",
            forever: "Para Siempre",
            month: "mes",
            get_started: "Comenzar",
            choose_silver: "Elegir Plata",
            start_free_trial: "Iniciar Prueba Gratuita",
            choose_platinum: "Elegir Platino",
            for_engineers: "Para Ingenieros",
            for_companies_resourcing: "Para Empresas y Agencias",
            bronze_tier: "Bronce",
            bronze_desc: "La rampa de acceso esencial para la visibilidad en roles de nivel de entrada y soporte.",
            bronze_feat_1: "Perfil Profesional Público",
            bronze_feat_2: "Aparecer en Búsquedas Generales",
            bronze_feat_3: "Establecer Calendario de Disponibilidad",
            bronze_feat_4: "Buscar y Aplicar a Trabajos",
            silver_tier: "Plata",
            silver_desc: "Para el profesional en crecimiento que necesita destacar con credenciales probadas y acceder a herramientas potentes.",
            silver_feat_1: "Todo en Bronce, más:",
            silver_feat_2: "Habilidades Clave (Etiquetas)",
            silver_feat_3: "Certificaciones Verificadas",
            silver_feat_4: "{count} Rol de Especialista",
            silver_feat_5: "Herramientas con IA",
            silver_feat_6: "Ranking de Búsqueda Prioritario",
            silver_feat_7: "Estudios de Caso Visuales (Storyboards)",
            gold_tier: "Oro",
            gold_desc: "Para el especialista establecido que necesita mostrar una gama diversa de experiencia profunda.",
            gold_feat_1: "Todo en Plata, más:",
            gold_feat_2: "Hasta {count} Roles de Especialista",
            gold_feat_3: "Visibilidad de Búsqueda Mejorada",
            platinum_tier: "Platino",
            platinum_desc: "Para el freelancer de élite o propietario de pequeña empresa que necesita herramientas avanzadas y máxima visibilidad.",
            platinum_feat_1: "Todo en Oro, más:",
            platinum_feat_2: "Hasta {count} Roles de Especialista",
            platinum_feat_3: "Análisis de Perfil",
            platinum_feat_4: "Personalización Avanzada de Perfil",
            platinum_feat_5: "Soporte Dedicado",
            for_companies: "Para Empresas",
            free_forever: "Gratis. Para Siempre.",
            company_pricing_desc: "Nuestro modelo es simple: ofrecemos acceso gratuito e ilimitado para que las empresas encuentren talento. Esto crea un mercado vibrante que atrae a los mejores ingenieros, quienes se suscriben a nuestras herramientas profesionales premium.",
            company_feat_1: "Publicaciones de Trabajo Ilimitadas",
            company_feat_2: "Buscar en la Base de Datos Completa de Ingenieros",
            company_feat_3: "AI Smart Match para encontrar el mejor talento",
            company_feat_4: "Mensajería Directa y Contratación",
            company_feat_5: "Contratos y Depósito de Garantía Integrados",
            post_job_free: "Publicar un Trabajo Gratis",
            agency_plan: "Plan de Agencia",
            agency_desc: "Un plan dedicado para que las empresas de recursos gestionen su lista de talentos y encuentren contratos en su nombre.",
            agency_feat_1: "Gestionar hasta {count} Ingenieros",
            agency_feat_2: "Buscar en la bolsa de trabajo completa",
            agency_feat_3: "Aplicar a trabajos en nombre de los ingenieros",
            agency_feat_4: "Portal de mensajería centralizado",
            agency_feat_5: "Gestión de contratos consolidada",
            agency_feat_6: "Análisis de rendimiento de la lista",
            agency_feat_7: "Ingenieros adicionales a {price}/mes",
            signed_in_as: "Has iniciado sesión como",
            logout: "Cerrar sesión",
        },
        [Language.DE]: { // Using EN as placeholder
            pricing_title: "Flexible Pricing for Every Professional",
            pricing_subtitle: "Choose the plan that best fits your career goals. All plans include direct messaging, contract management, and secure payments.",
            free: "Free",
            forever: "Forever",
            month: "mo",
            get_started: "Get Started",
            choose_silver: "Choose Silver",
            start_free_trial: "Start Free Trial",
            choose_platinum: "Choose Platinum",
            for_engineers: "For Engineers",
            for_companies_resourcing: "For Companies & Resourcing",
            bronze_tier: "Bronze",
            bronze_desc: "The essential on-ramp for visibility in entry-level and support roles.",
            bronze_feat_1: "Public Professional Profile",
            bronze_feat_2: "Appear in General Searches",
            bronze_feat_3: "Set Availability Calendar",
            bronze_feat_4: "Search and Apply for Jobs",
            silver_tier: "Silver",
            silver_desc: "For the growing professional who needs to stand out with proven credentials and access powerful tools.",
            silver_feat_1: "Everything in Bronze, plus:",
            silver_feat_2: "Core Skills (Tags)",
            silver_feat_3: "Verified Certifications",
            silver_feat_4: "{count} Specialist Role",
            silver_feat_5: "AI-Powered Tools",
            silver_feat_6: "Priority Search Ranking",
            silver_feat_7: "Visual Case Studies (Storyboards)",
            gold_tier: "Gold",
            gold_desc: "For the established specialist who needs to showcase a diverse range of deep expertise.",
            gold_feat_1: "Everything in Silver, plus:",
            gold_feat_2: "Up to {count} Specialist Roles",
            gold_feat_3: "Enhanced Search Visibility",
            platinum_tier: "Platinum",
            platinum_desc: "For the elite freelancer or small business owner who needs advanced tools and maximum visibility.",
            platinum_feat_1: "Everything in Gold, plus:",
            platinum_feat_2: "Up to {count} Specialist Roles",
            platinum_feat_3: "Profile Analytics",
            platinum_feat_4: "Advanced Profile Customization",
            platinum_feat_5: "Dedicated Support",
            for_companies: "For Companies",
            free_forever: "Free. Forever.",
            company_pricing_desc: "Our model is simple: we provide free, unlimited access for companies to find talent. This creates a vibrant marketplace that attracts the best engineers, who subscribe for our premium career tools.",
            company_feat_1: "Unlimited Job Posts",
            company_feat_2: "Search Full Engineer Database",
            company_feat_3: "AI Smart Match to find the best talent",
            company_feat_4: "Direct Messaging & Hiring",
            company_feat_5: "Integrated Contracts & Escrow",
            post_job_free: "Post a Job For Free",
            agency_plan: "Agency Plan",
            agency_desc: "A dedicated plan for resourcing companies to manage their talent roster and find contracts on their behalf.",
            agency_feat_1: "Manage up to {count} Engineers",
            agency_feat_2: "Search the full job board",
            agency_feat_3: "Apply for jobs on behalf of engineers",
            agency_feat_4: "Centralized messaging portal",
            agency_feat_5: "Consolidated contract management",
            agency_feat_6: "Roster performance analytics",
            agency_feat_7: "Additional engineers at {price}/mo",
            signed_in_as: "Signed in as",
            logout: "Logout",
        },
        [Language.FR]: { // Using EN as placeholder
            pricing_title: "Flexible Pricing for Every Professional",
            pricing_subtitle: "Choose the plan that best fits your career goals. All plans include direct messaging, contract management, and secure payments.",
            free: "Free",
            forever: "Forever",
            month: "mo",
            get_started: "Get Started",
            choose_silver: "Choose Silver",
            start_free_trial: "Start Free Trial",
            choose_platinum: "Choose Platinum",
            for_engineers: "For Engineers",
            for_companies_resourcing: "For Companies & Resourcing",
            bronze_tier: "Bronze",
            bronze_desc: "The essential on-ramp for visibility in entry-level and support roles.",
            bronze_feat_1: "Public Professional Profile",
            bronze_feat_2: "Appear in General Searches",
            bronze_feat_3: "Set Availability Calendar",
            bronze_feat_4: "Search and Apply for Jobs",
            silver_tier: "Silver",
            silver_desc: "For the growing professional who needs to stand out with proven credentials and access powerful tools.",
            silver_feat_1: "Everything in Bronze, plus:",
            silver_feat_2: "Core Skills (Tags)",
            silver_feat_3: "Verified Certifications",
            silver_feat_4: "{count} Specialist Role",
            silver_feat_5: "AI-Powered Tools",
            silver_feat_6: "Priority Search Ranking",
            silver_feat_7: "Visual Case Studies (Storyboards)",
            gold_tier: "Gold",
            gold_desc: "For the established specialist who needs to showcase a diverse range of deep expertise.",
            gold_feat_1: "Everything in Silver, plus:",
            gold_feat_2: "Up to {count} Specialist Roles",
            gold_feat_3: "Enhanced Search Visibility",
            platinum_tier: "Platinum",
            platinum_desc: "For the elite freelancer or small business owner who needs advanced tools and maximum visibility.",
            platinum_feat_1: "Everything in Gold, plus:",
            platinum_feat_2: "Up to {count} Specialist Roles",
            platinum_feat_3: "Profile Analytics",
            platinum_feat_4: "Advanced Profile Customization",
            platinum_feat_5: "Dedicated Support",
            for_companies: "For Companies",
            free_forever: "Free. Forever.",
            company_pricing_desc: "Our model is simple: we provide free, unlimited access for companies to find talent. This creates a vibrant marketplace that attracts the best engineers, who subscribe for our premium career tools.",
            company_feat_1: "Unlimited Job Posts",
            company_feat_2: "Search Full Engineer Database",
            company_feat_3: "AI Smart Match to find the best talent",
            company_feat_4: "Direct Messaging & Hiring",
            company_feat_5: "Integrated Contracts & Escrow",
            post_job_free: "Post a Job For Free",
            agency_plan: "Agency Plan",
            agency_desc: "A dedicated plan for resourcing companies to manage their talent roster and find contracts on their behalf.",
            agency_feat_1: "Manage up to {count} Engineers",
            agency_feat_2: "Search the full job board",
            agency_feat_3: "Apply for jobs on behalf of engineers",
            agency_feat_4: "Centralized messaging portal",
            agency_feat_5: "Consolidated contract management",
            agency_feat_6: "Roster performance analytics",
            agency_feat_7: "Additional engineers at {price}/mo",
            signed_in_as: "Signed in as",
            logout: "Logout",
        },
        [Language.HI]: { // Using EN as placeholder
            pricing_title: "Flexible Pricing for Every Professional",
            pricing_subtitle: "Choose the plan that best fits your career goals. All plans include direct messaging, contract management, and secure payments.",
            free: "Free",
            forever: "Forever",
            month: "mo",
            get_started: "Get Started",
            choose_silver: "Choose Silver",
            start_free_trial: "Start Free Trial",
            choose_platinum: "Choose Platinum",
            for_engineers: "For Engineers",
            for_companies_resourcing: "For Companies & Resourcing",
            bronze_tier: "Bronze",
            bronze_desc: "The essential on-ramp for visibility in entry-level and support roles.",
            bronze_feat_1: "Public Professional Profile",
            bronze_feat_2: "Appear in General Searches",
            bronze_feat_3: "Set Availability Calendar",
            bronze_feat_4: "Search and Apply for Jobs",
            silver_tier: "Silver",
            silver_desc: "For the growing professional who needs to stand out with proven credentials and access powerful tools.",
            silver_feat_1: "Everything in Bronze, plus:",
            silver_feat_2: "Core Skills (Tags)",
            silver_feat_3: "Verified Certifications",
            silver_feat_4: "{count} Specialist Role",
            silver_feat_5: "AI-Powered Tools",
            silver_feat_6: "Priority Search Ranking",
            silver_feat_7: "Visual Case Studies (Storyboards)",
            gold_tier: "Gold",
            gold_desc: "For the established specialist who needs to showcase a diverse range of deep expertise.",
            gold_feat_1: "Everything in Silver, plus:",
            gold_feat_2: "Up to {count} Specialist Roles",
            gold_feat_3: "Enhanced Search Visibility",
            platinum_tier: "Platinum",
            platinum_desc: "For the elite freelancer or small business owner who needs advanced tools and maximum visibility.",
            platinum_feat_1: "Everything in Gold, plus:",
            platinum_feat_2: "Up to {count} Specialist Roles",
            platinum_feat_3: "Profile Analytics",
            platinum_feat_4: "Advanced Profile Customization",
            platinum_feat_5: "Dedicated Support",
            for_companies: "For Companies",
            free_forever: "Free. Forever.",
            company_pricing_desc: "Our model is simple: we provide free, unlimited access for companies to find talent. This creates a vibrant marketplace that attracts the best engineers, who subscribe for our premium career tools.",
            company_feat_1: "Unlimited Job Posts",
            company_feat_2: "Search Full Engineer Database",
            company_feat_3: "AI Smart Match to find the best talent",
            company_feat_4: "Direct Messaging & Hiring",
            company_feat_5: "Integrated Contracts & Escrow",
            post_job_free: "Post a Job For Free",
            agency_plan: "Agency Plan",
            agency_desc: "A dedicated plan for resourcing companies to manage their talent roster and find contracts on their behalf.",
            agency_feat_1: "Manage up to {count} Engineers",
            agency_feat_2: "Search the full job board",
            agency_feat_3: "Apply for jobs on behalf of engineers",
            agency_feat_4: "Centralized messaging portal",
            agency_feat_5: "Consolidated contract management",
            agency_feat_6: "Roster performance analytics",
            agency_feat_7: "Additional engineers at {price}/mo",
            signed_in_as: "Signed in as",
            logout: "Logout",
        },
        [Language.PT]: { // Using EN as placeholder
            pricing_title: "Flexible Pricing for Every Professional",
            pricing_subtitle: "Choose the plan that best fits your career goals. All plans include direct messaging, contract management, and secure payments.",
            free: "Free",
            forever: "Forever",
            month: "mo",
            get_started: "Get Started",
            choose_silver: "Choose Silver",
            start_free_trial: "Start Free Trial",
            choose_platinum: "Choose Platinum",
            for_engineers: "For Engineers",
            for_companies_resourcing: "For Companies & Resourcing",
            bronze_tier: "Bronze",
            bronze_desc: "The essential on-ramp for visibility in entry-level and support roles.",
            bronze_feat_1: "Public Professional Profile",
            bronze_feat_2: "Appear in General Searches",
            bronze_feat_3: "Set Availability Calendar",
            bronze_feat_4: "Search and Apply for Jobs",
            silver_tier: "Silver",
            silver_desc: "For the growing professional who needs to stand out with proven credentials and access powerful tools.",
            silver_feat_1: "Everything in Bronze, plus:",
            silver_feat_2: "Core Skills (Tags)",
            silver_feat_3: "Verified Certifications",
            silver_feat_4: "{count} Specialist Role",
            silver_feat_5: "AI-Powered Tools",
            silver_feat_6: "Priority Search Ranking",
            silver_feat_7: "Visual Case Studies (Storyboards)",
            gold_tier: "Gold",
            gold_desc: "For the established specialist who needs to showcase a diverse range of deep expertise.",
            gold_feat_1: "Everything in Silver, plus:",
            gold_feat_2: "Up to {count} Specialist Roles",
            gold_feat_3: "Enhanced Search Visibility",
            platinum_tier: "Platinum",
            platinum_desc: "For the elite freelancer or small business owner who needs advanced tools and maximum visibility.",
            platinum_feat_1: "Everything in Gold, plus:",
            platinum_feat_2: "Up to {count} Specialist Roles",
            platinum_feat_3: "Profile Analytics",
            platinum_feat_4: "Advanced Profile Customization",
            platinum_feat_5: "Dedicated Support",
            for_companies: "For Companies",
            free_forever: "Free. Forever.",
            company_pricing_desc: "Our model is simple: we provide free, unlimited access for companies to find talent. This creates a vibrant marketplace that attracts the best engineers, who subscribe for our premium career tools.",
            company_feat_1: "Unlimited Job Posts",
            company_feat_2: "Search Full Engineer Database",
            company_feat_3: "AI Smart Match to find the best talent",
            company_feat_4: "Direct Messaging & Hiring",
            company_feat_5: "Integrated Contracts & Escrow",
            post_job_free: "Post a Job For Free",
            agency_plan: "Agency Plan",
            agency_desc: "A dedicated plan for resourcing companies to manage their talent roster and find contracts on their behalf.",
            agency_feat_1: "Manage up to {count} Engineers",
            agency_feat_2: "Search the full job board",
            agency_feat_3: "Apply for jobs on behalf of engineers",
            agency_feat_4: "Centralized messaging portal",
            agency_feat_5: "Consolidated contract management",
            agency_feat_6: "Roster performance analytics",
            agency_feat_7: "Additional engineers at {price}/mo",
            signed_in_as: "Signed in as",
            logout: "Logout",
        },
    };
    
    const t: LocalizationFunction = (key, replacements) => {
        const langDict = translations[language] || translations[Language.EN];
        let str = langDict[key] || key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
        if (replacements) {
            Object.entries(replacements).forEach(([rKey, value]) => {
                str = str.replace(`{${rKey}}`, String(value));
            });
        }
        return str;
    };
    
    const getRegionalPrice = (basePrice: number) => {
        const multipliers = { [Currency.GBP]: 1, [Currency.USD]: 1.25, [Currency.EUR]: 1.18, [Currency.AUD]: 1.9, [Currency.INR]: 0.5 * 105, [Currency.CAD]: 1.7, [Currency.BRL]: 0.6 * 6.5 }; // Example multipliers
        const symbols = { [Currency.GBP]: '£', [Currency.USD]: '$', [Currency.EUR]: '€', [Currency.AUD]: 'A$', [Currency.INR]: '₹', [Currency.CAD]: 'C$', [Currency.BRL]: 'R$' };
        const amount = basePrice * (multipliers[currency] || 1);
        return { amount, symbol: symbols[currency] || '£' };
    };

     const setLanguage = (lang: Language) => {
        setLanguageState(lang);
        if (user) {
            const updatedProfile = { ...user.profile, language: lang };
            if (user.role === Role.ENGINEER) {
                updateEngineerProfile(updatedProfile as EngineerProfile);
            } else {
                updateCompanyProfile(updatedProfile as CompanyProfile);
            }
        }
    };

    const setCurrency = (curr: Currency) => {
        setCurrencyState(curr);
         if (user) {
            const updatedProfile = { ...user.profile, currency: curr };
            if (user.role === Role.ENGINEER) {
                updateEngineerProfile(updatedProfile as EngineerProfile);
            } else {
                updateCompanyProfile(updatedProfile as CompanyProfile);
            }
        }
    };


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
        
        // On login, set the global language/currency to the user's saved preference.
        setLanguageState(userToLogin.profile.language);
        setCurrencyState(userToLogin.profile.currency);


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
        name: string, email: string, discipline: Discipline, location: string, experience: number, country: Country,
        minDayRate: number, maxDayRate: number, currency: Currency, availability: string,
        compliance: Compliance, identity: IdentityVerification
    }) => {
        // Simulated country verification
        if (data.email.endsWith('.co.uk') && data.country !== Country.UK) {
            alert('Warning: Your email domain suggests you are in the UK, but you have selected a different country. Your account will be flagged for review to ensure correct regional pricing.');
        } else if (data.email.endsWith('.com') && data.country !== Country.USA) {
            // Add more rules as needed
        }

        const [firstName, ...lastNameParts] = data.name.split(' ');
        const newEngineer: EngineerProfile = {
            id: `eng-${generateUniqueId()}`, name: data.name, status: 'active',
            firstName: firstName, surname: lastNameParts.join(' ') || ' ', avatar: `https://i.pravatar.cc/150?u=${data.name.replace(' ', '')}`,
            profileTier: ProfileTier.BASIC, certifications: [], caseStudies: [], skills: [],
            discipline: data.discipline, location: data.location, country: data.country,
            experience: data.experience, currency: currency, // Use context currency
            language: language, // Use context language
            minDayRate: data.minDayRate, maxDayRate: data.maxDayRate, availability: new Date(data.availability),
            compliance: data.compliance, identity: data.identity,
            contact: { email: data.email, phone: '', website: '', linkedin: '' },
            description: `Newly joined freelance ${data.discipline} with ${data.experience} years of experience, based in ${data.location}. Ready for new opportunities starting ${new Date(data.availability).toLocaleDateString()}.`,
            profileViews: 0, searchAppearances: 0, jobInvites: 0, joinDate: new Date(), badges: [],
            warnings: 0, isBanned: false,
        };

        setEngineers(prev => [newEngineer, ...prev]);
        const newUser: User = { id: `user-${generateUniqueId()}`, role: Role.ENGINEER, profile: newEngineer };
        setUser(newUser);
        setAllUsers(prev => [...prev, newUser]);
    };

    const createAndLoginCompany = (data: {
        companyName: string, email: string, website: string, regNumber: string, country: Country, location: string
    }) => {
        // Simulated country verification
        if (data.email.endsWith('.co.uk') && data.country !== Country.UK) {
            alert('Warning: Your email domain suggests you are in the UK, but you have selected a different country. Your account will be flagged for review to ensure correct regional pricing.');
        }

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
            language: language, currency: currency, country: data.country, location: data.location,
            warnings: 0, isBanned: false,
        };
        setCompanies(prev => [newCompany, ...prev]);
        const newUser: User = { id: `user-${generateUniqueId()}`, role: Role.COMPANY, profile: newCompany };
        setAllUsers(prev => [...prev, newUser]);
        setUser(newUser);
    };

    const createAndLoginResourcingCompany = (data: {
        companyName: string, email: string, website: string, regNumber: string, country: Country, location: string
    }) => {
        // Simulated country verification
        if (data.email.endsWith('.co.uk') && data.country !== Country.UK) {
            alert('Warning: Your email domain suggests you are in the UK, but you have selected a different country. Your account will be flagged for review to ensure correct regional pricing.');
        }
        
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
            language: language, currency: currency, country: data.country, location: data.location,
            warnings: 0, isBanned: false,
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

    const superchargeApplication = (job: Job) => {
        if (!user || user.role !== Role.ENGINEER) {
            alert("You must be logged in as an engineer to supercharge an application.");
            return;
        }

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
        
        const recipientId = conversations.find(c => c.id === conversationId)?.participantIds.find(id => id !== user.id);
        const recipient = recipientId ? findUserById(recipientId) : undefined;
        if (!recipient) return;

        const originalText = text;
        const translatedText = await geminiService.translateText(originalText, user.profile.language, recipient.profile.language);
        
        const newMessage: Message = {
            id: `msg-${generateUniqueId()}`, conversationId, senderId: user.id, text: translatedText, originalText: originalText, timestamp: new Date(), isRead: true,
        };
        const updatedMessagesWithUser = [...messages, newMessage];
        setMessages(updatedMessagesWithUser);
        const conversation = conversations.find(c => c.id === conversationId);
        if (!conversation) return;
        setConversations(prev => prev.map(c => c.id === conversationId ? { ...c, lastMessageText: text, lastMessageTimestamp: newMessage.timestamp } : c));
        setIsAiReplying(true);
        try {
            const otherParticipant = recipient;
            if (otherParticipant) {
                await new Promise(resolve => setTimeout(resolve, 1200 + Math.random() * 800));
                const conversationHistory = updatedMessagesWithUser.filter(m => m.conversationId === conversationId);
                const aiResponseText = await geminiService.generateChatResponse(conversationHistory, user, otherParticipant);
                const originalAIResponse = aiResponseText;
                const translatedAIResponse = await geminiService.translateText(originalAIResponse, otherParticipant.profile.language, user.profile.language);

                const aiMessage: Message = {
                    id: `msg-${generateUniqueId()}`, conversationId, senderId: otherParticipant.id, text: translatedAIResponse, originalText: originalAIResponse, timestamp: new Date(), isRead: false,
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

    const approveMilestone = (contractId: string, milestoneId: string) => {
        setContracts(prev => prev.map(c => {
            if (c.id === contractId) {
                return { ...c, milestones: c.milestones.map(m => m.id === milestoneId ? { ...m, status: MilestoneStatus.APPROVED_PENDING_INVOICE } : m) };
            }
            return c;
        }));
        const contract = contracts.find(c => c.id === contractId);
        if (contract) {
            const engineerUser = findUserByProfileId(contract.engineerId);
            if (engineerUser) {
                createNotification(engineerUser.id, NotificationType.APPLICATION_UPDATE, "A milestone has been approved. You can now generate an invoice.", "Invoices");
            }
        }
    };

    const submitTimesheet = (contractId: string, timesheetData: Omit<Timesheet, 'id' | 'contractId' | 'engineerId' | 'status'>) => {
        if (!user || user.role !== Role.ENGINEER) return;
        const newTimesheet: Timesheet = { ...timesheetData, id: `ts-${generateUniqueId()}`, contractId, engineerId: user.profile.id, status: TimesheetStatus.SUBMITTED };
        setContracts(prev => prev.map(c => c.id === contractId ? { ...c, timesheets: [...(c.timesheets || []), newTimesheet] } : c));
    };

    const approveTimesheet = (contractId: string, timesheetId: string) => {
        setContracts(prev => prev.map(c => {
            if (c.id === contractId) {
                return { ...c, timesheets: c.timesheets?.map(ts => ts.id === timesheetId ? { ...ts, status: TimesheetStatus.APPROVED } : ts) };
            }
            return c;
        }));
        const contract = contracts.find(c => c.id === contractId);
        if (contract) {
            const engineerUser = findUserByProfileId(contract.engineerId);
            if (engineerUser) {
                createNotification(engineerUser.id, NotificationType.APPLICATION_UPDATE, `Your timesheet for contract '${contract.jobTitle}' has been approved. You can now generate an invoice.`, 'Invoices');
            }
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

    const getCareerCoaching = async (): Promise<{ insights?: Insight[]; error?: string; }> => {
        if (!user || user.role !== Role.ENGINEER) {
            return { error: "You must be logged in as an engineer." };
        }
    
        const skillCounts: { [key: string]: number } = {};
        jobs.filter(j => j.status === 'active' && j.skillRequirements)
            .forEach(job => {
                job.skillRequirements?.forEach(req => {
                    const weight = req.importance === 'essential' ? 2 : 1;
                    skillCounts[req.name] = (skillCounts[req.name] || 0) + weight;
                });
            });
        const trendingSkills = Object.entries(skillCounts)
            .sort(([, a], [, b]) => b - a)
            .slice(0, 15)
            .map(([name]) => name);
        
        return geminiService.getCareerCoaching(user.profile as EngineerProfile, trendingSkills);
    };

    const generateInvoice = (contractId: string, items: InvoiceItem[], paymentTerms: PaymentTerms, timesheetId?: string) => {
        const contract = contracts.find(c => c.id === contractId);
        if (!contract || !user) return;

        const issueDate = new Date();
        const dueDate = new Date(issueDate);
        let daysToAdd = 0;
        switch(paymentTerms) {
            case PaymentTerms.NET7: daysToAdd = 7; break;
            case PaymentTerms.NET14: daysToAdd = 14; break;
            case PaymentTerms.NET30: daysToAdd = 30; break;
        }
        dueDate.setDate(issueDate.getDate() + daysToAdd);

        const newInvoice: Invoice = {
            id: `inv-${generateUniqueId()}`,
            contractId,
            companyId: contract.companyId,
            engineerId: contract.engineerId,
            issueDate,
            dueDate,
            paymentTerms,
            items,
            total: items.reduce((sum, item) => sum + item.amount, 0),
            status: InvoiceStatus.SENT,
        };

        setInvoices(prev => [newInvoice, ...prev]);

        if (timesheetId) {
            setContracts(prev => prev.map(c => c.id === contractId ? {
                ...c,
                timesheets: c.timesheets?.map(ts => ts.id === timesheetId ? { ...ts, status: TimesheetStatus.INVOICED } : ts)
            } : c));
        }
        
        const engineerUser = findUserByProfileId(contract.engineerId);
        if(engineerUser) {
            createNotification(engineerUser.id, NotificationType.APPLICATION_UPDATE, `You have a new invoice from ${user.profile.name} to review.`, 'Invoices');
        }
    };

    const payInvoice = (invoiceId: string) => {
        const invoice = invoices.find(inv => inv.id === invoiceId);
        if (!invoice || !user) return;

        setInvoices(prev => prev.map(inv => inv.id === invoiceId ? { ...inv, status: InvoiceStatus.PAID } : inv));
        
        const contract = contracts.find(c => c.id === invoice.contractId);
        if (!contract) return;
        
        const engineerUser = findUserByProfileId(contract.engineerId);
        if (!engineerUser) return;

        const totalAmount = invoice.total;
        const payoutAmount = totalAmount * (1 - PLATFORM_FEE_PERCENTAGE);
        const feeAmount = totalAmount * PLATFORM_FEE_PERCENTAGE;

        const payoutTx: Transaction = {
            id: `txn-${generateUniqueId()}`, userId: engineerUser.id, contractId: contract.id, type: TransactionType.PAYOUT,
            description: `Payout for Invoice #${invoice.id.slice(-6)}`, amount: payoutAmount, date: new Date()
        };
        const feeTx: Transaction = {
             id: `txn-${generateUniqueId()}`, userId: user.id, contractId: contract.id, type: TransactionType.PLATFORM_FEE,
            description: `Platform Fee for Invoice #${invoice.id.slice(-6)}`, amount: -feeAmount, date: new Date()
        };
        const paymentTx: Transaction = {
            id: `txn-${generateUniqueId()}`, userId: user.id, contractId: contract.id, type: TransactionType.INVOICE_PAYMENT,
            description: `Payment for Invoice #${invoice.id.slice(-6)}`, amount: -totalAmount, date: new Date()
        };

        setTransactions(prev => [payoutTx, feeTx, paymentTx, ...prev]);

        setContracts(prev => prev.map(c => {
            if (c.id === contract.id) {
                return {
                    ...c,
                    milestones: c.milestones.map(m => m.status === MilestoneStatus.APPROVED_PENDING_INVOICE ? { ...m, status: MilestoneStatus.COMPLETED_PAID } : m),
                    timesheets: c.timesheets?.map(ts => ts.status === TimesheetStatus.INVOICED ? { ...ts, status: TimesheetStatus.PAID } : ts)
                };
            }
            return c;
        }));
        
        createNotification(engineerUser.id, NotificationType.APPLICATION_UPDATE, `Invoice #${invoice.id.slice(-6)} has been paid by ${user.profile.name}.`, "Invoices");
    };

    const reportUser = (profileId: string) => {
        const userToReport = allUsers.find(u => u.profile.id === profileId);
        if (!userToReport) {
            alert("Could not find the user to report.");
            return;
        }
        const newWarnings = (userToReport.profile.warnings || 0) + 1;
        const shouldBeBanned = newWarnings >= 3;

        const updateUser = (profileUpdate: Partial<EngineerProfile> | Partial<CompanyProfile>) => {
            if (userToReport.role === Role.ENGINEER) {
                updateEngineerProfile(profileUpdate as Partial<EngineerProfile>);
            } else {
                updateCompanyProfile(profileUpdate as Partial<CompanyProfile>);
            }
        };
        
        if (shouldBeBanned) {
            const banEndDate = new Date();
            banEndDate.setDate(banEndDate.getDate() + 30);
            updateUser({ id: profileId, warnings: newWarnings, isBanned: true, banEndDate, status: 'suspended' });
            alert(`You have reported ${userToReport.profile.name}. This is their third warning, and their account has been suspended for 30 days.`);
        } else {
            updateUser({ id: profileId, warnings: newWarnings });
            alert(`You have reported ${userToReport.profile.name}. This is warning #${newWarnings}. At 3 warnings, their account will be automatically suspended.`);
        }
    };
    
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
        transactions, fundMilestone, submitMilestoneForApproval,
        submitTimesheet, approveTimesheet, upgradeSubscription, purchaseRoleCredits, useRoleCredit,
        projects, createProject, addRoleToProject, assignEngineerToRole,
        purchaseDayPass,
        purchaseBoostCredits,
        invoices,
        isPremium,
        getCareerCoaching,
        currentPageContext,
        setCurrentPageContext,
        language,
        setLanguage,
        currency,
        setCurrency,
        t,
        getRegionalPrice,
        approveMilestone,
        generateInvoice,
        payInvoice,
        reportUser,
    }), [user, allUsers, jobs, companies, engineers, applications, conversations, messages, selectedConversationId, reviews, notifications, isAiReplying, forumPosts, forumComments, contracts, transactions, projects, invoices, currentPageContext, language, currency]);
};