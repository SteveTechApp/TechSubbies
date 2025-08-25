import React from 'react';
import { EngineerProfile } from '../../types/index.ts';
import { CreditCard, Download, Star, Rocket } from '../../components/Icons.tsx';

interface PaymentsViewProps {
    profile: EngineerProfile;
}

const BillingHistoryItem = ({ date, description, amount }: { date: string, description: string, amount: string }) => (
    <div className="flex justify-between items-center py-3 border-b last:border-b-0">
        <div>
            <p className="font-medium text-gray-800">{description}</p>
            <p className="text-sm text-gray-500">{date}</p>
        </div>
        <div className="flex items-center gap-4">
            <span className="font-semibold text-gray-800">{amount}</span>
            <button className="text-gray-400 hover:text-blue-600"><Download size={18} /></button>
        </div>
    </div>
);

export const PaymentsView = ({ profile }: PaymentsViewProps) => {
    const isPremium = profile.profileTier === 'paid';

    return (
        <div>
            <h1 className="text-3xl font-bold mb-4 flex items-center"><CreditCard size={32} className="mr-3 text-blue-600"/> Billing & Subscriptions</h1>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                
                {/* Subscription Management */}
                <div className="lg:col-span-1 space-y-6">
                    <div className="bg-white p-5 rounded-lg shadow">
                        <h2 className="text-xl font-bold mb-3 flex items-center">
                            <Star size={20} className="mr-2 text-yellow-500"/>
                            My Subscription
                        </h2>
                        {isPremium ? (
                            <div>
                                <p className="text-gray-600">You are currently subscribed to the <span className="font-bold text-green-700">Skills Profile (Premium)</span> plan.</p>
                                <p className="text-sm text-gray-500 mt-2">Next billing date: August 25, 2024</p>
                                <button className="mt-4 w-full text-center px-4 py-2 bg-red-100 text-red-700 text-sm font-semibold rounded-md hover:bg-red-200">Cancel Subscription</button>
                            </div>
                        ) : (
                            <div>
                                <p className="text-gray-600">You are on the <span className="font-bold">Basic Profile (Free)</span> plan.</p>
                                <button className="mt-4 w-full text-center px-4 py-2 bg-green-600 text-white font-bold rounded-md hover:bg-green-700">Upgrade to Skills Profile</button>
                            </div>
                        )}
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
                        <p className="text-xs text-center text-gray-500 mb-4">Boosts place your profile at the top of relevant search results for 24 hours.</p>
                        <button disabled={!isPremium} className="w-full text-center px-4 py-2 bg-purple-600 text-white font-bold rounded-md hover:bg-purple-700 disabled:bg-gray-300 disabled:cursor-not-allowed">
                            {isPremium ? 'Purchase More Boosts' : 'Upgrade to Use Boosts'}
                        </button>
                    </div>
                </div>

                {/* Billing History */}
                <div className="lg:col-span-2 bg-white p-5 rounded-lg shadow">
                    <h2 className="text-xl font-bold mb-3">Billing History</h2>
                    <div>
                        <BillingHistoryItem date="July 25, 2024" description="Skills Profile Subscription" amount="£15.00" />
                        <BillingHistoryItem date="July 10, 2024" description="Profile Boost Credits (x5)" amount="£20.00" />
                        <BillingHistoryItem date="June 25, 2024" description="Skills Profile Subscription" amount="£15.00" />
                        <BillingHistoryItem date="May 25, 2024" description="Skills Profile Subscription" amount="£15.00" />
                    </div>
                </div>

            </div>
        </div>
    );
};