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
}

const TierCard = ({ title, description, price, period, features, ctaText, onCtaClick, isFeatured }: TierCardProps) => (
    <div className={`border rounded-lg p-6 bg-white flex flex-col ${isFeatured ? 'border-2 border-blue-600 shadow-2xl' : 'border-gray-200 shadow-lg'}`}>
        {isFeatured && <span className="absolute top-0 -translate-y-1/2 bg-blue-600 text-white text-xs font-bold uppercase px-3 py-1 rounded-full self-center">Most Popular</span>}
        <h3 className={`text-2xl font-bold ${isFeatured ? 'text-blue-600' : 'text-gray-800'}`}>{title}</h3>
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
            className={`w-full mt-auto font-bold py-3 px-6 rounded-lg transition-colors ${isFeatured ? 'bg-blue-600 text-white hover:bg-blue-700' : 'bg-gray-200 text-gray-800 hover:bg-gray-300'}`}
        >
            {ctaText}
        </button>
    </div>
);


export const PricingPage = ({ onNavigate, onHowItWorksClick }: PricingPageProps) => {

    const TIERS = [
        {
            tier: ProfileTier.BASIC,
            title: "Basic",
            description: "The essential on-ramp for visibility in entry-level and support roles.",
            price: "Free",
            period: " / Forever",
            ctaText: "Get Started",
            isFeatured: false,
            features: [
                { text: "Public Professional Profile", included: true },
                { text: "Appear in General Searches", included: true },
                { text: "Set Availability Calendar", included: true },
                { text: "Search and Apply for Jobs", included: true },
                { text: "Core Skills (Tags)", included: false },
                { text: "Verified Certifications", included: false },
                { text: "Specialist Roles & Skill Ratings", included: false },
                { text: "AI-Powered Tools", included: false },
                { text: "Priority Search Ranking", included: false },
                { text: "Visual Case Studies (Storyboards)", included: false },
                { text: "Profile Analytics", included: false },
            ]
        },
        {
            tier: ProfileTier.PROFESSIONAL,
            title: "Professional",
            description: "For the growing professional who needs to stand out with proven credentials.",
            price: "£7",
            period: " / mo",
            ctaText: "Choose Professional",
            isFeatured: false,
            features: [
                { text: "Public Professional Profile", included: true },
                { text: "Appear in General Searches", included: true },
                { text: "Set Availability Calendar", included: true },
                { text: "Search and Apply for Jobs", included: true },
                { text: "Core Skills (Tags)", included: true },
                { text: "Verified Certifications", included: true },
                { text: "Specialist Roles & Skill Ratings", included: false },
                { text: "AI-Powered Tools", included: false },
                { text: "Priority Search Ranking", included: false },
                { text: "Visual Case Studies (Storyboards)", included: false },
                { text: "Profile Analytics", included: false },
            ]
        },
        {
            tier: ProfileTier.SKILLS,
            title: "Skills",
            description: "Our core offering for the established specialist who needs to showcase deep expertise and command top rates.",
            price: "£15",
            period: " / mo",
            ctaText: "Start Free Trial",
            isFeatured: true,
            features: [
                { text: "Everything in Professional, plus:", included: true },
                { text: "Specialist Roles & Skill Ratings", included: true },
                { text: "AI-Powered Tools", included: true },
                { text: "Priority Search Ranking", included: true },
                { text: "Visual Case Studies (Storyboards)", included: true },
                { text: "Profile Analytics", included: false },
            ]
        },
        {
            tier: ProfileTier.BUSINESS,
            title: "Business",
            description: "For the elite freelancer or small business owner who needs advanced tools and maximum visibility.",
            price: "£35",
            period: " / mo",
            ctaText: "Choose Business",
            isFeatured: false,
            features: [
                { text: "Everything in Skills, plus:", included: true },
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
                <section className="py-16 bg-gray-50">
                    <div className="container mx-auto px-4 max-w-7xl">
                        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-stretch">
                           {TIERS.map(tier => (
                               <TierCard 
                                   key={tier.title}
                                   {...tier}
                                   onCtaClick={() => onNavigate('engineerSignUp')}
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
