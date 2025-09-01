import React from 'react';
import { EngineerProfile, ProfileTier, Transaction } from '../../types/index.ts';
import { CreditCard, Download, Star, Rocket, ArrowLeft, ShieldCheck } from '../../components/Icons.tsx';
import { useAppContext } from '../../context/AppContext.tsx';

interface PaymentsViewProps {
    profile: EngineerProfile;
    setActiveView: (view: string) => void;
}

const TransactionHistoryItem = ({ transaction }: { transaction: Transaction }) => {
    const isCredit = transaction.amount > 0;
    const amountColor = isCredit ? 'text-green-600' : 'text-red-600';
    const sign = isCredit ? '+' : '-';
    
    return (
        <div className="flex justify-between items-center py-3 border-b last:border-b-0">
            <div>
                <p className="font-medium text-gray-800">{transaction.description}</p>
                <p className="text-sm text-gray-500">{new Date(transaction.date).toLocaleDateString()}</p>
            </div>
            <div className="flex items-center gap-4">
                <span className={`font-semibold ${amountColor}`}>{sign} £{Math.abs(transaction.amount).toFixed(2)}</span>
                <button className="text-gray-400 hover:text-blue-600" title="Download Invoice"><Download size={18} /></button>
            </div>
        </div>
    );
};

export const PaymentsView = ({ profile, setActiveView }: PaymentsViewProps) => {
    const { user, claimSecurityNetGuarantee, transactions } = useAppContext();
    const creditsUsed = profile.securityNetCreditsUsed ?? 0;

    const myTransactions = transactions.filter(t => t.userId === user?.id);

    const TIER_INFO = {
        [ProfileTier.BASIC]: { name: "Basic Profile (Free)", color: "" },
        [ProfileTier.PROFESSIONAL]: { name: "Professional Profile", color: "text-green-700" },
        [ProfileTier.SKILLS]: { name: "Skills Profile", color: "text-blue-700" },
        [ProfileTier.BUSINESS]: { name: "Business Profile", color: "text-purple-700" },
    };
    
    const currentTierInfo = TIER_INFO[profile.profileTier];

    const getUpgradeAction = () => {
        switch (profile.profileTier) {
            case ProfileTier.BASIC:
                return { text: "Upgrade to Professional", action: () => setActiveView('Billing') };
            case ProfileTier.PROFESSIONAL:
                return { text: "Upgrade to Skills", action: () => setActiveView('Billing') };
            case ProfileTier.SKILLS:
                return { text: "Upgrade to Business", action: () => setActiveView('Billing') };
            default:
                return null;
        }
    };
    const upgradeAction = getUpgradeAction();


    return (
        <div>
            <button 
                onClick={() => setActiveView('Dashboard')} 
                className="flex items-center mb-4 px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300"
            >
                <ArrowLeft size={16} className="mr-2" />
                Back to Dashboard
            </button>
            <h1 className="text-3xl font-bold mb-4 flex items-center"><CreditCard size={32} className="mr-3 text-blue-600"/> Payments & Billing</h1>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                
                {/* Left Column */}
                <div className="lg:col-span-1 space-y-6">
                    <div className="bg-white p-5 rounded-lg shadow">
                        <h2 className="text-xl font-bold mb-3 flex items-center">
                            <Star size={20} className="mr-2 text-yellow-500"/>
                            My Subscription
                        </h2>
                        <div>
                            <p className="text-gray-600">You are on the <span className={`font-bold ${currentTierInfo.color}`}>{currentTierInfo.name}</span> plan.</p>
                            {profile.subscriptionEndDate && (
                                <p className="text-sm text-gray-500 mt-2">
                                    Renews on: {new Date(profile.subscriptionEndDate).toLocaleDateString()}
                                </p>
                            )}
                            
                            {upgradeAction && (
                                <button onClick={upgradeAction.action} className="mt-4 w-full text-center px-4 py-2 bg-green-600 text-white font-bold rounded-md hover:bg-green-700">
                                    {upgradeAction.text}
                                </button>
                            )}

                             {profile.profileTier !== ProfileTier.BASIC && (
                                <button onClick={() => alert("Redirecting to subscription management portal...")} className="mt-2 w-full text-center px-4 py-2 bg-red-100 text-red-700 text-sm font-semibold rounded-md hover:bg-red-200">
                                    Manage Subscription
                                </button>
                             )}
                        </div>
                    </div>

                    <div className="bg-white p-5 rounded-lg shadow">
                        <h2 className="text-xl font-bold mb-3 flex items-center">
                            <Rocket size={20} className="mr-2 text-purple-500"/>
                             Profile Boosts
                        </h2>
                        <div className="text-center mb-4">
                            <p className="text-4xl font-bold text-purple-600">3</p>
                            <p className="text-gray-500">Available Credits</p>
                        </div>
                        <p className="text-xs text-center text-gray-500 mb-4">Boosts place your profile at the top of relevant searches for 12 hours.</p>
                        <button disabled={profile.profileTier === ProfileTier.BASIC} className="w-full text-center px-4 py-2 bg-purple-600 text-white font-bold rounded-md hover:bg-purple-700 disabled:bg-gray-300 disabled:cursor-not-allowed">
                            {profile.profileTier !== ProfileTier.BASIC ? 'Purchase More Boosts' : 'Upgrade to Use Boosts'}
                        </button>
                    </div>
                </div>

                {/* Right Column */}
                <div className="lg:col-span-2 space-y-6">
                    {profile.profileTier !== ProfileTier.BASIC ? (
                        <>
                            <div className="bg-white p-5 rounded-lg shadow">
                                <h2 className="text-xl font-bold mb-3 flex items-center">
                                    <ShieldCheck size={20} className="mr-2 text-blue-500"/>
                                    Security Net Guarantee
                                </h2>
                                <div>
                                    <p className="text-gray-600 mb-4">If you're available for over 30 days and don't receive any work offers, we'll credit you with an additional month's subscription, up to 3 times.</p>
                                    <div className="text-center mb-4 p-4 bg-gray-50 rounded-md">
                                        <p className="text-4xl font-bold text-blue-600">{creditsUsed} / 3</p>
                                        <p className="text-gray-500">Credits Used</p>
                                    </div>
                                    <button
                                        onClick={claimSecurityNetGuarantee}
                                        disabled={creditsUsed >= 3}
                                        className="w-full text-center px-4 py-2 bg-blue-600 text-white font-bold rounded-md hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed"
                                    >
                                        {creditsUsed >= 3 ? 'All Credits Used' : 'Claim Free Month'}
                                    </button>
                                </div>
                            </div>

                            <div className="bg-white p-5 rounded-lg shadow">
                                <h2 className="text-xl font-bold mb-3">Transaction History</h2>
                                {myTransactions.length > 0 ? (
                                    <div>
                                        {myTransactions.map(tx => <TransactionHistoryItem key={tx.id} transaction={tx} />)}
                                    </div>
                                ) : (
                                    <p className="text-gray-500 text-center py-4">No transactions yet.</p>
                                )}
                            </div>
                        </>
                    ) : (
                        <div className="bg-white p-8 rounded-lg shadow text-center">
                            <Star size={32} className="mx-auto text-yellow-500 mb-4" />
                            <h2 className="text-2xl font-bold">Unlock Your Financial Dashboard</h2>
                            <p className="text-gray-600 mt-2">Upgrade to a Professional Profile to manage your subscriptions, track payouts from projects, and access premium features like the Security Net Guarantee.</p>
                            <button onClick={() => setActiveView('Billing')} className="mt-6 bg-green-600 text-white font-bold py-3 px-6 rounded-lg hover:bg-green-700">
                                Upgrade My Profile
                            </button>
                        </div>
                    )}
                </div>

            </div>
        </div>
    );
};