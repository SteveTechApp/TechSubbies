import React from 'react';
import { Footer } from '../components/Footer.tsx';
import { Header } from '../components/Header.tsx';
import { Page, ProfileTier } from '../types/index.ts';
import { CheckCircle, Award, Star, BarChart, X } from '../components/Icons.tsx';

interface PricingPageProps {
    onNavigate: (page: Page) => void;
    onHowItWorksClick: () => void;
}

const FeatureListItem = ({ children, included = true }: { children: React.ReactNode, included?: boolean }) => (
    <li className={`flex items-start ${included ? '' : 'text-gray-400'}`}>
        {included 
            ? <CheckCircle className="w-5 h-5 text-green-500 mr-3 mt-1 flex-shrink-0" />
            : <X className="w-5 h-5 text-gray-400 mr-3 mt-1 flex-shrink-0" />
        }
        <span>{children}</span>
    </li>
);

interface TierStyle {
    border: string;
    titleText: string;
    buttonBg: string;
    buttonHoverBg: string;
    badgeBg: string;
    shadow?: string;
}

interface TierCardProps {
    tier: ProfileTier;
    title: string;
    description: string;
    price: string;
    period?: string;
    features: { text: React.ReactNode, included: boolean }[];
    ctaText: string;
    onCtaClick: () => void;
    isFeatured?: boolean;
    styles: TierStyle;
}

const TierCard = ({ title, description, price, period, features, ctaText, onCtaClick, isFeatured, styles }: TierCardProps) => (
    <div className={`border-2 rounded-lg p-6 bg-white flex flex-col relative transition-all duration-300 ${isFeatured ? `${styles.border} ${styles.shadow || 'shadow-2xl'} transform scale-105` : `border-gray-200 shadow-lg ${styles.border}`}`}>
        {isFeatured && <span className={`absolute top-0 -translate-y-1/2 ${styles.badgeBg} text-white text-xs font-bold uppercase px-3 py-1 rounded-full self-center`}>Most Popular</span>}
        <h3 className={`text-2xl font-bold ${styles.titleText}`}>{title}</h3>
        <p className="text-gray-500 mt-2 mb-4 flex-grow">{description}</p>
        <div className="my-4">
            <span className="text-5xl font-extrabold text-gray-800">{price}</span>
            {period && <span className="text-xl font-medium text-gray-500">{period}</span>}
        </div>
        <ul className="space-y-3 mb-6 text-sm">
            {features.map((feature, index) => <FeatureListItem key={index} included={feature.included}>{feature.text}</FeatureListItem>)}
        </ul>
        <button
            onClick={onCtaClick}
            className={`w-full mt-auto font-bold py-3 px-6 rounded-lg text-white transition-colors ${styles.buttonBg} ${styles.buttonHoverBg}`}
        >
            {ctaText}
        </button>
    </div>
);


export const PricingPage = ({ onNavigate, onHowItWorksClick }: PricingPageProps) => {

    const TIER_STYLES: Record<string, TierStyle> = {
        [ProfileTier.BASIC]: { border: 'border-amber-700', titleText: 'text-amber-800', buttonBg: 'bg-amber-700', buttonHoverBg: 'hover:bg-amber-800', badgeBg: 'bg-amber-700' },
        [ProfileTier.PROFESSIONAL]: { border: 'border-slate-400', titleText: 'text-slate-600', buttonBg: 'bg-slate-500', buttonHoverBg: 'hover:bg-slate-600', badgeBg: 'bg-slate-500' },
        [ProfileTier.SKILLS]: { border: 'border-yellow-500', titleText: 'text-yellow-600', buttonBg: 'bg-yellow-500', buttonHoverBg: 'hover:bg-yellow-600', badgeBg: 'bg-yellow-500', shadow: 'shadow-yellow-300/50 shadow-2xl' },
        [ProfileTier.BUSINESS]: { border: 'border-indigo-700', titleText: 'text-indigo-800', buttonBg: 'bg-indigo-700', buttonHoverBg: 'hover:bg-indigo-800', badgeBg: 'bg-indigo-700' }
    };

    const TIERS: TierCardProps[] = [
        {
            tier: ProfileTier.BASIC,
            title: "Bronze",
            description: "The essential on-ramp for visibility in entry-level and support roles.",
            price: "Free",
            period: " / Forever",
            ctaText: "Get Started",
            onCtaClick: () => onNavigate('engineerSignUp'),
            styles: TIER_STYLES[ProfileTier.BASIC],
            features: [
                { text: "Public Professional Profile", included: true },
                { text: "Appear in General Searches", included: true },
                { text: "Set Availability Calendar", included: true },
                { text: "Search and Apply for Jobs", included: true },
                { text: "Core Skills (Tags)", included: false },
                { text: "Verified Certifications", included: false },
                { text: "Specialist Roles", included: false },
                { text: "AI-Powered Tools", included: false },
                { text: "Priority Search Ranking", included: false },
                { text: "Visual Case Studies (Storyboards)", included: false },
                { text: "Profile Analytics", included: false },
            ]
        },
        {
            tier: ProfileTier.PROFESSIONAL,
            title: "Silver",
            description: "For the growing professional who needs to stand out with proven credentials and access powerful tools.",
            price: "£7",
            period: " / mo",
            ctaText: "Choose Silver",
            onCtaClick: () => onNavigate('engineerSignUp'),
            styles: TIER_STYLES[ProfileTier.PROFESSIONAL],
            features: [
                { text: "Everything in Bronze, plus:", included: true },
                { text: "Core Skills (Tags)", included: true },
                { text: "Verified Certifications", included: true },
                { text: <strong>1 Specialist Role</strong>, included: true },
                { text: "AI-Powered Tools", included: true },
                { text: "Priority Search Ranking", included: true },
                { text: "Visual Case Studies (Storyboards)", included: true },
                { text: "Profile Analytics", included: false },
            ]
        },
        {
            tier: ProfileTier.SKILLS,
            title: "Gold",
            description: "For the established specialist who needs to showcase a diverse range of deep expertise.",
            price: "£15",
            period: " / mo",
            ctaText: "Start Free Trial",
            isFeatured: true,
            onCtaClick: () => onNavigate('engineerSignUp'),
            styles: TIER_STYLES[ProfileTier.SKILLS],
            features: [
                { text: "Everything in Silver, plus:", included: true },
                { text: <strong>Up to 3 Specialist Roles</strong>, included: true },
                { text: "Enhanced Search Visibility", included: true },
                { text: "Profile Analytics", included: false },
            ]
        },
        {
            tier: ProfileTier.BUSINESS,
            title: "Platinum",
            description: "For the elite freelancer or small business owner who needs advanced tools and maximum visibility.",
            price: "£35",
            period: " / mo",
            ctaText: "Choose Platinum",
            onCtaClick: () => onNavigate('engineerSignUp'),
            styles: TIER_STYLES[ProfileTier.BUSINESS],
            features: [
                { text: "Everything in Gold, plus:", included: true },
                { text: <strong>Up to 5 Specialist Roles</strong>, included: true },
                { text: "Profile Analytics", included: true },
                { text: "Advanced Profile Customization", included: true },
                { text: "Dedicated Support", included: true },
            ]
        }
    ];

    return (
        <div className="bg-gray-50 flex flex-col min-h-screen">
            <Header onNavigate={onNavigate} onHowItWorksClick={onHowItWorksClick} />
            <main className="flex-grow pt-24">
                {/* Hero Section */}
                <section className="py-12 bg-white text-center">
                    <div className="container mx-auto px-4">
                        <h1 className="text-4xl md:text-5xl font-extrabold text-gray-800 mb-4">A Plan for Every Ambition</h1>
                        <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto">From getting your foot in the door to becoming an industry leader, we have a plan that grows with your career. It's always free for companies to post jobs.</p>
                    </div>
                </section>

                {/* Pricing Section */}
                <section className="py-16 checker-plate-background">
                    <div className="container mx-auto px-4 max-w-7xl">
                        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-end">
                           {TIERS.map(tier => (
                               <TierCard 
                                   key={tier.title}
                                   {...tier}
                               />
                           ))}
                        </div>
                    </div>
                </section>
            </main>
            <Footer onNavigate={onNavigate} onHowItWorksClick={onHowItWorksClick} />
        </div>
    );
};