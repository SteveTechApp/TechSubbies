import React from 'react';
import { EngineerProfile, ProfileTier } from '../../types';
import { useAppContext } from '../../context/InteractionContext';
import { Gift, Star, Zap, Briefcase } from '../../components/Icons';

const REWARDS = [
    { points: 500, name: '1 FREE Profile Boost', icon: Zap, tier: ProfileTier.PROFESSIONAL },
    { points: 1000, name: '2 FREE Profile Boosts', icon: Zap, tier: ProfileTier.SKILLS },
    { points: 2500, name: '1 Month FREE Gold Subscription', icon: Star, tier: ProfileTier.BUSINESS },
    { points: 5000, name: 'TechSubbies Merch Pack', icon: Briefcase, tier: ProfileTier.BUSINESS },
];

const LoyaltyRewardCard = ({ points, name, icon: Icon, tier, userPoints, onRedeem }: { points: number, name: string, icon: React.ComponentType<any>, tier: ProfileTier, userPoints: number, onRedeem: () => void }) => {
    const canAfford = userPoints >= points;
    return (
        <div className={`p-4 border rounded-lg flex flex-col h-full ${canAfford ? 'bg-white shadow' : 'bg-gray-100 text-gray-500'}`}>
            <div className="flex items-center mb-2">
                <Icon size={24} className={canAfford ? 'text-green-500' : 'text-gray-400'} />
                <h3 className={`ml-3 text-lg font-bold ${canAfford ? 'text-gray-800' : ''}`}>{name}</h3>
            </div>
            <p className="text-sm flex-grow">{tier} tier and above.</p>
            <div className="flex justify-between items-center mt-4 pt-4 border-t">
                <span className={`font-bold text-xl ${canAfford ? 'text-green-600' : ''}`}>{points.toLocaleString()} pts</span>
                <button
                    onClick={onRedeem}
                    disabled={!canAfford}
                    className="px-4 py-2 bg-green-600 text-white font-semibold rounded-md text-sm hover:bg-green-700 disabled:bg-gray-400"
                >
                    Redeem
                </button>
            </div>
        </div>
    );
};


export const LoyaltyView = ({ profile, setActiveView }: { profile: EngineerProfile, setActiveView: (view: string) => void }) => {
    const { redeemLoyaltyPoints } = useAppContext();

    const handleRedeem = (points: number, rewardName: string) => {
        if(window.confirm(`Are you sure you want to redeem ${points} points for "${rewardName}"?`)) {
            redeemLoyaltyPoints(points);
        }
    };

    return (
        <div>
            <h1 className="text-3xl font-bold mb-6 flex items-center">
                <Gift size={30} className="mr-3 text-green-600"/>
                Loyalty & Rewards Program
            </h1>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-1 space-y-6">
                     <div className="bg-white p-6 rounded-lg shadow text-center">
                        <h2 className="text-lg font-semibold text-gray-600">Your Points Balance</h2>
                        <p className="text-6xl font-extrabold text-green-600 my-2">{profile.loyaltyPoints.toLocaleString()}</p>
                    </div>
                     <div className="bg-white p-6 rounded-lg shadow">
                        <h3 className="font-bold mb-3">How to Earn Points</h3>
                        <ul className="space-y-2 text-sm text-gray-700">
                            <li className="flex justify-between"><span>Complete a contract</span> <span className="font-semibold">+100 pts</span></li>
                            <li className="flex justify-between"><span>Receive a 5-star review</span> <span className="font-semibold">+50 pts</span></li>
                            <li className="flex justify-between"><span>Monthly subscription</span> <span className="font-semibold">+25 pts</span></li>
                            <li className="flex justify-between"><span>Refer a new engineer</span> <span className="font-semibold">+200 pts</span></li>
                        </ul>
                    </div>
                </div>

                <div className="lg:col-span-2 bg-white p-6 rounded-lg shadow">
                     <h2 className="text-xl font-bold mb-4">Available Rewards</h2>
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {REWARDS.map(reward => (
                            <LoyaltyRewardCard 
                                key={reward.name}
                                {...reward}
                                userPoints={profile.loyaltyPoints}
                                onRedeem={() => handleRedeem(reward.points, reward.name)}
                            />
                        ))}
                     </div>
                </div>
            </div>
        </div>
    );
};
