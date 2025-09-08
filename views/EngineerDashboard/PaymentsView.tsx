// FIX: Created the `PaymentsView` component to resolve the "not a module" error.
import React from 'react';
import { EngineerProfile, ProfileTier } from '../../types';
import { ArrowLeft, CheckCircle, Star, Zap, CreditCard } from '../../components/Icons';
import { useAppContext } from '../../context/AppContext';

interface PaymentsViewProps {
    profile: EngineerProfile;
    setActiveView: (view: string) => void;
}

const PRICING_PLANS = [
    { name: "Basic Profile", tier: ProfileTier.BASIC, price: "£0/mo", features: ["Appear in standard search results", "Apply for jobs up to £195/day", "Build your contract history & reviews"] },
    { name: "Professional Profile", tier: ProfileTier.PROFESSIONAL, price: "£7/mo", features: ["Everything in Basic", "Detailed 'Skills Profile'", "AI Skill Discovery & Training", "Higher search ranking"], isFeatured: false },
    { name: "Skills Profile", tier: ProfileTier.SKILLS, price: "£15/mo", features: ["Everything in Gold", "Apply to all jobs (no day rate cap)", "AI Career Coach & Cost Analysis", "1 FREE Platform Credit per month"], isFeatured: true },
    { name: "Business Profile", tier: ProfileTier.BUSINESS, price: "£35/mo", features: ["Everything in Gold", "Add up to 3 team members", "Priority support", "Featured profile opportunities"], isFeatured: false }
];

export const PaymentsView = ({ profile, setActiveView }: PaymentsViewProps) => {
    const { upgradeProfileTier, purchasePlatformCredits } = useAppContext();

    const handleUpgrade = (tier: ProfileTier) => {
        if (window.confirm(`Are you sure you want to upgrade to the ${tier} plan?`)) {
            upgradeProfileTier(profile.id, tier);
            alert(`Successfully upgraded to ${tier}!`);
        }
    };

    const CREDIT_BUNDLES = [
        { amount: 1, price: 1.99, popular: false },
        { amount: 5, price: 8.99, popular: true },
        { amount: 10, price: 15.99, popular: false },
    ];

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
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                 {/* Subscriptions */}
                <div className="bg-white p-6 rounded-lg shadow">
                     <h2 className="text-xl font-bold mb-4">Subscription Plans</h2>
                     {PRICING_PLANS.map(plan => {
                        const isCurrentPlan = profile.profileTier === plan.tier;
                        const canUpgradeTo = PRICING_PLANS.findIndex(p => p.tier === profile.profileTier) < PRICING_PLANS.findIndex(p => p.tier === plan.tier);
                        return (
                            <div key={plan.tier} className={`p-3 border rounded-md mb-3 ${isCurrentPlan ? 'border-blue-500 bg-blue-50' : ''}`}>
                                <div className="flex justify-between items-center">
                                    <div>
                                        <h3 className="font-bold">{plan.name} <span className="text-sm font-normal text-gray-500">{plan.price}</span></h3>
                                        <p className="text-xs text-gray-600">{plan.features.slice(1,3).join(' • ')}</p>
                                    </div>
                                    {isCurrentPlan ? (
                                        <span className="px-3 py-1 bg-green-200 text-green-800 text-xs font-bold rounded-full">Current Plan</span>
                                    ) : canUpgradeTo ? (
                                        <button onClick={() => handleUpgrade(plan.tier as ProfileTier)} className="px-3 py-1 bg-blue-600 text-white text-xs font-bold rounded-md hover:bg-blue-700">Upgrade</button>
                                    ) : ( <span className="text-xs text-gray-400"></span>)}
                                </div>
                            </div>
                        )
                    })}
                </div>

                {/* Platform Credits */}
                <div className="bg-white p-6 rounded-lg shadow">
                    <h2 className="text-xl font-bold mb-2 flex items-center"><CreditCard className="mr-2 text-green-500"/> Platform Credits</h2>
                    <p className="text-sm text-gray-600 mb-4">Use credits for one-off premium actions like featuring your job applications.</p>
                    <div className="p-4 bg-gray-100 rounded-lg text-center mb-4">
                        <p className="text-sm text-gray-500">Your current balance</p>
                        <p className="text-4xl font-bold text-gray-800">{profile.platformCredits}</p>
                        <p className="text-sm text-gray-500">Credits</p>
                    </div>
                     <div className="space-y-3">
                        {CREDIT_BUNDLES.map(bundle => (
                            <div key={bundle.amount} className={`p-3 border rounded-md flex justify-between items-center ${bundle.popular ? 'border-green-500 bg-green-50' : ''}`}>
                                <div>
                                    <h3 className="font-bold">{bundle.amount} Credit{bundle.amount > 1 ? 's' : ''}</h3>
                                    <p className="text-xs text-gray-600">Price: £{bundle.price}</p>
                                </div>
                                <button onClick={() => purchasePlatformCredits(bundle.amount)} className="px-3 py-1 bg-green-600 text-white text-xs font-bold rounded-md hover:bg-green-700">Purchase</button>
                            </div>
                        ))}
                    </div>
                </div>

            </div>
        </div>
    );
};