import React, { useState } from 'react';
import { EngineerProfile } from '../../types';
import { useAppContext } from '../../context/InteractionContext';
import { ArrowLeft, CreditCard, DollarSign, Zap, Save } from '../../components/Icons';

interface PaymentsViewProps {
    profile: EngineerProfile;
    setActiveView: (view: string) => void;
}

export const PaymentsView = ({ profile, setActiveView }: PaymentsViewProps) => {
    const { purchasePlatformCredits } = useAppContext();
    const [creditsToBuy, setCreditsToBuy] = useState(5);

    const handlePurchase = () => {
        // In a real app, this would open a payment modal (e.g., Stripe Checkout)
        purchasePlatformCredits(creditsToBuy);
        alert(`${creditsToBuy} credits purchased successfully!`);
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
            <h1 className="text-3xl font-bold mb-4">Billing & Subscriptions</h1>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-6">
                    <div className="bg-white p-6 rounded-lg shadow">
                        <h2 className="text-xl font-bold mb-4 flex items-center"><CreditCard className="mr-3 text-blue-600"/> My Subscription</h2>
                        <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg flex justify-between items-center">
                            <div>
                                <p className="text-sm text-blue-700 font-semibold">Current Plan</p>
                                <p className="text-2xl font-bold text-blue-900">{profile.profileTier} Plan</p>
                            </div>
                            <button className="px-6 py-2 bg-blue-600 text-white font-bold rounded-md hover:bg-blue-700">Manage Subscription</button>
                        </div>
                    </div>
                    
                    <div className="bg-white p-6 rounded-lg shadow">
                        <h2 className="text-xl font-bold mb-4 flex items-center"><DollarSign className="mr-3 text-green-600"/> Payment Methods</h2>
                        <p className="text-center text-gray-500 py-8">Payment method management coming soon.</p>
                    </div>
                </div>

                <div className="lg:col-span-1 bg-white p-6 rounded-lg shadow">
                    <h2 className="text-xl font-bold mb-4 flex items-center"><Zap className="mr-3 text-purple-600"/> Platform Credits</h2>
                    <div className="text-center p-4 bg-purple-50 border-2 border-dashed border-purple-200 rounded-lg">
                        <p className="text-sm font-semibold text-purple-800">Your Balance</p>
                        <p className="text-5xl font-extrabold text-purple-900 my-2">{profile.platformCredits}</p>
                        <p className="text-xs text-purple-700">Credits are used for Profile Boosts or applying to jobs above your plan's day rate.</p>
                    </div>
                    <div className="mt-6">
                        <h3 className="font-bold mb-2">Buy More Credits</h3>
                        <p className="text-sm text-gray-500 mb-3">£1.00 per credit</p>
                        <div className="flex items-center gap-2 mb-4">
                            <input
                                type="range"
                                min="1"
                                max="20"
                                value={creditsToBuy}
                                onChange={e => setCreditsToBuy(Number(e.target.value))}
                                className="w-full"
                            />
                            <span className="font-bold text-lg w-12 text-center">{creditsToBuy}</span>
                        </div>
                        <button onClick={handlePurchase} className="w-full bg-purple-600 text-white font-bold py-2 rounded-lg hover:bg-purple-700">
                            Buy {creditsToBuy} Credit(s) for £{creditsToBuy.toFixed(2)}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};
