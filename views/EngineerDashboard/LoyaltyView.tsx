import React, { useState } from 'react';
import { EngineerProfile } from '../../types';
import { ArrowLeft, Gift, ShieldCheck, Zap, Star } from '../../components/Icons';
import { useAppContext } from '../../context/AppContext';

interface LoyaltyViewProps {
    profile: EngineerProfile;
    setActiveView: (view: string) => void;
}

const RewardCard = ({ icon: Icon, title, children, color, action, actionText }: { icon: React.ComponentType<any>, title: string, children: React.ReactNode, color: string, action?: () => void, actionText?: string }) => (
    <div className={`p-6 rounded-lg border-l-4 bg-${color}-50 border-${color}-500`}>
        <div className="flex items-center mb-2">
            <Icon className={`w-8 h-8 mr-3 text-${color}-600`} />
            <h3 className={`text-xl font-bold text-${color}-900`}>{title}</h3>
        </div>
        <div className="text-gray-600 pl-11">
            {children}
            {action && actionText && (
                <button onClick={action} className={`mt-3 font-bold text-${color}-700 hover:text-${color}-900`}>
                    {actionText}
                </button>
            )}
        </div>
    </div>
);

export const LoyaltyView = ({ profile, setActiveView }: LoyaltyViewProps) => {
    const { redeemLoyaltyPoints } = useAppContext();
    const [referralCodeCopied, setReferralCodeCopied] = useState(false);

    const handleRedeem = () => {
        const pointsToRedeem = 100; // Example: redeem 100 points
        if (profile.loyaltyPoints >= pointsToRedeem) {
            redeemLoyaltyPoints(pointsToRedeem);
        } else {
            alert("You need at least 100 points to redeem a credit.");
        }
    };
    
    const handleCopyReferral = () => {
        if(profile.referralCode) {
            navigator.clipboard.writeText(profile.referralCode);
            setReferralCodeCopied(true);
            setTimeout(() => setReferralCodeCopied(false), 2000);
        }
    }

    return (
        <div>
            <button
                onClick={() => setActiveView('Dashboard')}
                className="flex items-center mb-4 px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300"
            >
                <ArrowLeft size={16} className="mr-2" />
                Back to Dashboard
            </button>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <main className="lg:col-span-2 space-y-6">
                    <RewardCard icon={ShieldCheck} title="Security Net Guarantee" color="blue">
                        <p>If you're available for 30 consecutive days and receive no job offers, we'll credit your account with a free month of your current subscription tier. (Max 3 claims/year).</p>
                    </RewardCard>
                     <RewardCard icon={Star} title="Profile Completion Bonus" color="green">
                        <p>Complete your profile by adding at least one Specialist Role and one Certification to earn a one-time bonus of <strong>2 FREE Platform Credits</strong>.</p>
                        {profile.hasReceivedCompletionBonus ? (
                             <p className="font-bold text-green-700 mt-2">Bonus Claimed!</p>
                        ) : (
                             <p className="font-bold text-gray-500 mt-2">You have not claimed this bonus yet.</p>
                        )}
                    </RewardCard>
                    <RewardCard icon={Gift} title="Referral Program" color="red">
                         <p>Refer a friend to TechSubbies! When they sign up and complete their first contract, you'll receive <strong>5 FREE Platform Credits</strong> as a thank you.</p>
                         <div className="mt-3">
                            <p className="text-xs font-semibold text-gray-500">Your Unique Referral Code:</p>
                            <div className="flex items-center gap-2 mt-1">
                                <input type="text" readOnly value={profile.referralCode || 'N/A'} className="font-mono bg-gray-100 p-2 rounded-md w-full sm:w-auto"/>
                                <button onClick={handleCopyReferral} className="px-4 py-2 bg-red-600 text-white text-sm font-semibold rounded-md hover:bg-red-700">
                                    {referralCodeCopied ? 'Copied!' : 'Copy'}
                                </button>
                            </div>
                         </div>
                    </RewardCard>
                </main>
                <aside className="lg:col-span-1 space-y-6">
                    <div className="bg-white p-6 rounded-lg shadow text-center">
                        <h3 className="text-lg font-bold">Loyalty Points</h3>
                        <p className="text-5xl font-extrabold text-purple-600 my-2">{profile.loyaltyPoints}</p>
                        <p className="text-sm text-gray-500 mb-4">Earn points for being an active member of the community.</p>
                        <button onClick={handleRedeem} disabled={profile.loyaltyPoints < 100} className="w-full bg-purple-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-purple-700 disabled:bg-gray-400">
                            Redeem 100 Points for 1 Credit
                        </button>
                    </div>
                     <div className="bg-white p-6 rounded-lg shadow">
                        <h3 className="text-lg font-bold mb-3">How to Earn Points</h3>
                        <ul className="space-y-2 text-sm text-gray-700">
                            <li className="flex justify-between"><span>Daily Login</span> <span className="font-bold text-green-600">+10 Pts</span></li>
                            <li className="flex justify-between"><span>Complete a Contract</span> <span className="font-bold text-green-600">+100 Pts</span></li>
                            <li className="flex justify-between"><span>Receive a 5-Star Review</span> <span className="font-bold text-green-600">+50 Pts</span></li>
                            <li className="flex justify-between"><span>Post in the Forum</span> <span className="font-bold text-green-600">+20 Pts</span></li>
                        </ul>
                    </div>
                </aside>
            </div>
        </div>
    );
};