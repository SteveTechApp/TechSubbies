import React, { useState } from 'react';
import { Page } from '../types';
import { CheckCircle, User, Briefcase } from '../components/Icons';

interface ForEngineersPageProps {
  onNavigate: (page: Page) => void;
}

const PRICING_PLANS = [
    {
        name: "Basic Profile",
        tier: "Bronze",
        price: "£0",
        priceDetails: "/ month",
        description: "Get started on the network, find jobs, and build your reputation.",
        features: [
            "Appear in standard search results",
            "Apply for jobs up to £195/day",
            "Build your contract history & reviews",
            "Standard profile",
        ],
        cta: "Sign Up For Free",
        isFeatured: false,
    },
    {
        name: "Professional Profile",
        tier: "Silver",
        price: "£7",
        priceDetails: "/ month",
        description: "Stand out from the crowd and unlock AI-powered tools.",
        features: [
            "Everything in Basic, plus:",
            "Detailed 'Skills Profile'",
            "AI Skill Discovery",
            "AI Training Recommendations",
            "Higher ranking in search results",
        ],
        cta: "Choose Silver",
        isFeatured: false,
    },
    {
        name: "Skills Profile",
        tier: "Gold",
        price: "£15",
        priceDetails: "/ month",
        description: "The ultimate toolkit for the serious freelance professional.",
        features: [
            "Everything in Silver, plus:",
            "Apply to all jobs (no day rate cap)",
            "AI Cost-Effectiveness Analysis",
            "AI Career Coach",
            "1 FREE Profile Boost per month",
        ],
        cta: "Get Started Now",
        isFeatured: true,
    },
    {
        name: "Business Profile",
        tier: "Platinum",
        price: "£35",
        priceDetails: "/ month",
        description: "For established freelancers running a business.",
        features: [
            "Everything in Gold, plus:",
            "Company profile features",
            "Add up to 3 team members",
            "Priority support",
            "Featured profile opportunities",
        ],
        cta: "Choose Platinum",
        isFeatured: false,
    },
];

export const PricingPage = ({ onNavigate }: ForEngineersPageProps) => {
    const [activeTab, setActiveTab] = useState('engineers');

    const getTabClass = (tabName: string) => `w-1/2 py-4 text-center font-bold border-b-4 transition-colors flex items-center justify-center gap-2 text-lg ${ activeTab === tabName ? 'border-blue-600 text-blue-600' : 'border-gray-200 text-gray-500 hover:bg-gray-100' }`;

    return (
        <div className="bg-gray-50">
            {/* Header */}
            <div className="text-center py-16 px-4 bg-white">
                <h1 className="text-4xl md:text-5xl font-extrabold text-gray-800">Find the Perfect Plan</h1>
                <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
                    Choose the plan that's right for you, whether you're an individual engineer or a resourcing agency.
                </p>
            </div>
            
            <div className="max-w-xl mx-auto bg-white rounded-t-lg shadow-md mt-[-2rem] relative z-10">
                <nav className="flex">
                    <button onClick={() => setActiveTab('engineers')} className={getTabClass('engineers')}>
                        <User /> For Engineers
                    </button>
                    <button onClick={() => setActiveTab('resourcing')} className={getTabClass('resourcing')}>
                        <Briefcase /> For Resourcing
                    </button>
                </nav>
            </div>


            {/* Pricing Grid */}
            <div className="py-16 px-4">
                 {activeTab === 'engineers' && (
                    <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-4 gap-8 animate-fade-in-up">
                        {PRICING_PLANS.map(plan => (
                            <div key={plan.name} className={`rounded-lg p-8 border ${plan.isFeatured ? 'bg-gray-800 text-white border-blue-500 shadow-2xl transform lg:scale-105' : 'bg-white border-gray-200 shadow-lg'}`}>
                                <h2 className={`font-bold text-sm uppercase tracking-wider ${plan.isFeatured ? 'text-blue-400' : 'text-blue-600'}`}>{plan.tier}</h2>
                                <h3 className={`text-2xl font-bold mt-2 ${plan.isFeatured ? 'text-white' : 'text-gray-800'}`}>{plan.name}</h3>
                                <div className="mt-4">
                                    <span className={`text-5xl font-extrabold ${plan.isFeatured ? 'text-white' : 'text-gray-800'}`}>{plan.price}</span>
                                    <span className={`ml-1 text-lg font-medium ${plan.isFeatured ? 'text-gray-300' : 'text-gray-500'}`}>{plan.priceDetails}</span>
                                </div>
                                <p className={`mt-4 text-sm h-16 ${plan.isFeatured ? 'text-gray-300' : 'text-gray-600'}`}>{plan.description}</p>
                                
                                {/* FIX: Replaced string literal with Page enum for type safety. */}
                                <button onClick={() => onNavigate(Page.ENGINEER_SIGNUP)} className={`w-full py-3 mt-6 font-bold rounded-lg transition-colors ${plan.isFeatured ? 'bg-blue-600 text-white hover:bg-blue-700' : 'bg-blue-100 text-blue-700 hover:bg-blue-200'}`}>
                                    {plan.cta}
                                </button>

                                <ul className="mt-8 space-y-3 text-sm">
                                    {plan.features.map((feature, index) => (
                                        <li key={index} className="flex items-start">
                                            <CheckCircle className={`w-5 h-5 mr-2 flex-shrink-0 ${plan.isFeatured ? 'text-blue-400' : 'text-blue-600'}`} />
                                            <span className={plan.isFeatured ? 'text-gray-300' : 'text-gray-600'}>{feature}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </div>
                )}
                {activeTab === 'resourcing' && (
                    <div className="max-w-3xl mx-auto flex justify-center animate-fade-in-up">
                        <div className="rounded-lg p-8 border bg-white border-blue-500 shadow-2xl w-full">
                            <h2 className="font-bold text-sm uppercase tracking-wider text-blue-600">Resourcing Partner</h2>
                            <h3 className="text-2xl font-bold mt-2 text-gray-800">Agency Plan</h3>
                            <div className="mt-4">
                                <span className="text-5xl font-extrabold text-gray-800">£50</span>
                                <span className="ml-1 text-lg font-medium text-gray-500">/ month</span>
                            </div>
                             <p className="mt-2 text-2xl font-bold text-gray-700">+ £5 <span className="text-base font-medium text-gray-500">/ engineer / month</span></p>
                            <p className="mt-4 text-sm h-16 text-gray-600">The complete solution for managing your roster of freelance talent and finding them work on the platform.</p>
                            {/* FIX: Replaced string literal with Page enum for type safety. */}
                            <button onClick={() => onNavigate(Page.RESOURCING_SIGNUP)} className="w-full py-3 mt-6 font-bold rounded-lg transition-colors bg-blue-600 text-white hover:bg-blue-700">
                                Get Started
                            </button>
                            <ul className="mt-8 space-y-3 text-sm">
                                <li className="flex items-start"><CheckCircle className="w-5 h-5 mr-2 flex-shrink-0 text-blue-600" /><span className="text-gray-600">Manage <strong>unlimited</strong> engineers</span></li>
                                <li className="flex items-start"><CheckCircle className="w-5 h-5 mr-2 flex-shrink-0 text-blue-600" /><span className="text-gray-600">Apply to jobs on behalf of your talent</span></li>
                                <li className="flex items-start"><CheckCircle className="w-5 h-5 mr-2 flex-shrink-0 text-blue-600" /><span className="text-gray-600">Centralized contract management</span></li>
                                <li className="flex items-start"><CheckCircle className="w-5 h-5 mr-2 flex-shrink-0 text-blue-600" /><span className="text-gray-600">Unified dashboard for all placements</span></li>
                                <li className="flex items-start"><CheckCircle className="w-5 h-5 mr-2 flex-shrink-0 text-blue-600" /><span className="text-gray-600">Team collaboration tools</span></li>
                                <li className="flex items-start"><CheckCircle className="w-5 h-5 mr-2 flex-shrink-0 text-blue-600" /><span className="text-gray-600">Priority support</span></li>
                            </ul>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};