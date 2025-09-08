
// FIX: Created the `LoyaltyView` component to resolve the "not a module" error.
import React from 'react';
import { EngineerProfile, ProfileTier } from '../../types';
import { ArrowLeft, Gift, ShieldCheck, Zap } from '../../components/Icons';

interface LoyaltyViewProps {
    profile: EngineerProfile;
    setActiveView: (view: string) => void;
}

const FeatureCard = ({ icon: Icon, title, children, colorClass }: { icon: React.ComponentType<any>, title: string, children: React.ReactNode, colorClass: string }) => (
    <div className={`p-6 rounded-lg border-l-4 ${colorClass}`}>
        <div className="flex items-center mb-2">
            <Icon className="w-8 h-8 mr-3" />
            <h3 className="text-xl font-bold">{title}</h3>
        </div>
        <p className="text-gray-600">{children}</p>
    </div>
);

export const LoyaltyView = ({ profile, setActiveView }: LoyaltyViewProps) => {

    const canAccess = profile.profileTier !== ProfileTier.BASIC;

    return (
        <div>
            <button
                onClick={() => setActiveView('Dashboard')}
                className="flex items-center mb-4 px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300"
            >
                <ArrowLeft size={16} className="mr-2" />
                Back to Dashboard
            </button>
            <h1 className="text-3xl font-bold mb-2 flex items-center">
                <Gift size={32} className="mr-3 text-red-500" /> Loyalty & Rewards
            </h1>
            <p className="text-gray-600 mb-6">We reward our active and subscribed members. Here's what you have access to.</p>

            {canAccess ? (
                <div className="space-y-6">
                    <FeatureCard icon={ShieldCheck} title="Security Net Guarantee" colorClass="border-blue-500 bg-blue-50 text-blue-900">
                        If you are available for 30 consecutive days and receive no job offers, we will credit your account with a free month of your current subscription tier. This can be claimed up to 3 times per year.
                    </FeatureCard>

                    <FeatureCard icon={Zap} title="Monthly Profile Boost" colorClass="border-purple-500 bg-purple-50 text-purple-900">
                        As a <span className="font-bold">Gold</span> or <span className="font-bold">Platinum</span> member, you receive free Profile Boost credits each month to push your profile to the top of search results.
                        <ul className="list-disc list-inside mt-2 text-sm">
                            <li>Gold Members: 1 Free Boost per month</li>
                            <li>Platinum Members: 3 Free Boosts per month</li>
                        </ul>
                    </FeatureCard>
                </div>
            ) : (
                <div className="mt-6 bg-gradient-to-br from-red-400 to-pink-500 p-8 rounded-lg shadow-lg text-center text-white">
                     <div className="inline-block bg-white/20 p-3 rounded-full mb-4">
                        <Gift size={32} />
                    </div>
                    <h2 className="text-2xl font-bold mb-2">Unlock Exclusive Loyalty Rewards</h2>
                    <p className="max-w-xl mx-auto mb-6">
                        Our loyalty program, including the Security Net Guarantee and free Profile Boosts, is available to all subscribed members. Upgrade your profile to get rewarded for being part of the network.
                    </p>
                    <button
                        onClick={() => setActiveView('Billing')}
                        className="bg-white text-red-600 font-bold py-3 px-8 rounded-lg hover:bg-gray-100 transition-transform transform hover:scale-105 shadow-md"
                    >
                        View Subscription Plans
                    </button>
                </div>
            )}
        </div>
    );
};
