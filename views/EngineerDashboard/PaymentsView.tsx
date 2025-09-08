
// FIX: Created the `PaymentsView` component to resolve the "not a module" error.
import React from 'react';
import { EngineerProfile, ProfileTier } from '../../types';
import { ArrowLeft, CheckCircle, Star, Zap } from '../../components/Icons';
import { useAppContext } from '../../context/AppContext';

interface PaymentsViewProps {
    profile: EngineerProfile;
    setActiveView: (view: string) => void;
}

const PRICING_PLANS = [
    { name: "Basic Profile", tier: ProfileTier.BASIC, price: "£0/mo", features: ["Appear in standard search results", "Apply for jobs up to £195/day", "Build your contract history & reviews"] },
    { name: "Professional Profile", tier: ProfileTier.PROFESSIONAL, price: "£7/mo", features: ["Everything in Basic", "Detailed 'Skills Profile'", "AI Skill Discovery & Training", "Higher search ranking"], isFeatured: false },
    { name: "Skills Profile", tier: ProfileTier.SKILLS, price: "£15/mo", features: ["Everything in Silver", "Apply to all jobs (no day rate cap)", "AI Career Coach & Cost Analysis", "1 FREE Profile Boost per month"], isFeatured: true },
    { name: "Business Profile", tier: ProfileTier.BUSINESS, price: "£35/mo", features: ["Everything in Gold", "Add up to 3 team members", "Priority support", "Featured profile opportunities"], isFeatured: false }
];

export const PaymentsView = ({ profile, setActiveView }: PaymentsViewProps) => {
    const { upgradeProfileTier } = useAppContext();

    const handleUpgrade = (tier: ProfileTier) => {
        if (window.confirm(`Are you sure you want to upgrade to the ${tier} plan?`)) {
            upgradeProfileTier(profile.id, tier);
            alert(`Successfully upgraded to ${tier}!`);
        }
    };

    return (
        <div>
            <button
                onClick={() => setActiveView('Dashboard')}
                className="flex items-center mb-4 px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300"
            >
                <ArrowLeft size={16} className="mr-2" />
                Back to Dashboard
            </button>
            <h1 className="text-3xl font-bold mb-2">Billing & Subscriptions</h1>
            <p className="text-gray-600 mb-6">Manage your subscription plan to unlock more powerful features.</p>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                {PRICING_PLANS.map(plan => {
                    const isCurrentPlan = profile.profileTier === plan.tier;
                    const canUpgradeTo = PRICING_PLANS.findIndex(p => p.tier === profile.profileTier) < PRICING_PLANS.findIndex(p => p.tier === plan.tier);

                    return (
                        <div key={plan.tier} className={`rounded-lg p-6 border-2 flex flex-col ${plan.isFeatured ? 'bg-gray-800 text-white border-blue-500 shadow-xl' : 'bg-white border-gray-200'}`}>
                            <h2 className={`font-bold text-sm uppercase tracking-wider ${plan.isFeatured ? 'text-blue-400' : 'text-blue-600'}`}>{plan.tier}</h2>
                            <h3 className={`text-xl font-bold mt-1 ${plan.isFeatured ? 'text-white' : 'text-gray-800'}`}>{plan.name}</h3>
                            <div className="mt-4">
                                <span className={`text-4xl font-extrabold ${plan.isFeatured ? 'text-white' : 'text-gray-800'}`}>{plan.price}</span>
                            </div>
                            
                            <ul className="mt-6 space-y-3 text-sm flex-grow">
                                {plan.features.map((feature, index) => (
                                    <li key={index} className="flex items-start">
                                        <CheckCircle className={`w-5 h-5 mr-2 flex-shrink-0 ${plan.isFeatured ? 'text-blue-400' : 'text-blue-600'}`} />
                                        <span className={plan.isFeatured ? 'text-gray-300' : 'text-gray-600'}>{feature}</span>
                                    </li>
                                ))}
                            </ul>

                            <div className="mt-6">
                                {isCurrentPlan ? (
                                    <button disabled className="w-full py-2 font-bold rounded-lg bg-green-200 text-green-800">Current Plan</button>
                                ) : canUpgradeTo ? (
                                    <button onClick={() => handleUpgrade(plan.tier as ProfileTier)} className={`w-full py-2 font-bold rounded-lg transition-colors ${plan.isFeatured ? 'bg-blue-600 text-white hover:bg-blue-700' : 'bg-blue-100 text-blue-700 hover:bg-blue-200'}`}>
                                        Upgrade
                                    </button>
                                ) : (
                                    <button disabled className="w-full py-2 font-bold rounded-lg bg-gray-200 text-gray-500 cursor-not-allowed">
                                        {plan.tier === ProfileTier.BASIC ? 'Free Tier' : 'Downgrade'}
                                    </button>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};
