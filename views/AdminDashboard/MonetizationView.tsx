import React from 'react';
import { useAppContext } from '../../context/AppContext';
import { StatCard } from '../../components/StatCard';
import { TransactionType } from '../../types';
import { DollarSign, Star, Zap, Megaphone, PlusCircle, Save, Image, TrendingUp } from '../../components/Icons';

// Mock data for this simulation
const MOCK_AD_CAMPAIGNS = [
    { id: 'ad-1', company: 'Crestron', title: 'New DM NVX+ Launch', budget: 5000, spend: 2340, status: 'Active', placement: 'Engineer Dashboard' },
    { id: 'ad-2', company: 'Cisco', title: 'CCNP Certification Drive', budget: 7500, spend: 7120, status: 'Active', placement: 'Job Search Results' },
    { id: 'ad-3', company: 'AVIXA', title: 'CTS Prep Course Promo', budget: 3000, spend: 3000, status: 'Completed', placement: 'Forum Sidebar' },
];

export const MonetizationView = () => {
    const { transactions } = useAppContext();
    
    // Calculate revenue streams from transactions
    const subscriptionRevenue = transactions.filter(t => t.type === TransactionType.SUBSCRIPTION).reduce((sum, t) => sum + Math.abs(t.amount), 0);
    const boostRevenue = transactions.filter(t => t.type === TransactionType.BOOST_PURCHASE).reduce((sum, t) => sum + Math.abs(t.amount), 0);
    const superchargeRevenue = transactions.filter(t => t.type === TransactionType.SUPERCHARGE).reduce((sum, t) => sum + Math.abs(t.amount), 0);
    const adRevenue = MOCK_AD_CAMPAIGNS.reduce((sum, ad) => sum + ad.spend, 0);

    const totalRevenue = subscriptionRevenue + boostRevenue + superchargeRevenue + adRevenue;

    return (
        <div>
            <h1 className="text-3xl font-bold mb-6 flex items-center">
                <DollarSign size={30} className="mr-3"/>
                Monetization Overview
            </h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard icon={TrendingUp} value={`£${totalRevenue.toLocaleString()}`} label="Total Revenue" colorClass="bg-green-500" />
                <StatCard icon={Star} value={`£${subscriptionRevenue.toLocaleString()}`} label="Subscription Revenue" colorClass="bg-blue-500" />
                <StatCard icon={Zap} value={`£${(boostRevenue + superchargeRevenue).toLocaleString()}`} label="Microtransaction Revenue" colorClass="bg-purple-500" />
                <StatCard icon={Megaphone} value={`£${adRevenue.toLocaleString()}`} label="Advertising Revenue" colorClass="bg-orange-500" />
            </div>

            <div className="mt-8 bg-white p-6 rounded-lg shadow">
                 <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-bold flex items-center"><Megaphone size={22} className="mr-3 text-orange-500"/> Ad Campaign Manager</h2>
                    <button className="flex items-center px-4 py-2 bg-green-600 text-white font-semibold rounded-md hover:bg-green-700">
                        <PlusCircle size={18} className="mr-2" /> New Campaign
                    </button>
                </div>
                
                 <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Advertiser</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Campaign Title</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Budget / Spend</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {MOCK_AD_CAMPAIGNS.map(ad => (
                                <tr key={ad.id}>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{ad.company}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{ad.title}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        £{ad.spend.toLocaleString()} / £{ad.budget.toLocaleString()}
                                        <div className="w-full bg-gray-200 rounded-full h-1.5 mt-1"><div className="bg-blue-600 h-1.5 rounded-full" style={{width: `${(ad.spend / ad.budget) * 100}%`}}></div></div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap"><span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${ad.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>{ad.status}</span></td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

             <div className="mt-8 bg-white p-6 rounded-lg shadow">
                <h2 className="text-xl font-bold mb-4">Create New Ad Campaign (Simulation)</h2>
                 <form className="space-y-4 max-w-2xl">
                    <div>
                        <label className="block text-sm font-medium">Advertiser Name</label>
                        <input type="text" placeholder="e.g., Crestron" className="w-full border p-2 rounded bg-gray-100" readOnly />
                    </div>
                     <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium">Placement Area</label>
                            <select className="w-full border p-2 rounded bg-gray-100"><option>Engineer Dashboard Sidebar</option></select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium">Budget (£)</label>
                            <input type="number" placeholder="5000" className="w-full border p-2 rounded bg-gray-100" readOnly />
                        </div>
                    </div>
                     <div>
                        <label className="block text-sm font-medium">Ad Creative</label>
                         <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                             <div className="space-y-1 text-center"><Image size={40} className="mx-auto text-gray-400" /><p className="text-sm text-gray-600">Upload an image or video</p></div>
                        </div>
                    </div>
                     <div className="flex justify-end pt-4 border-t">
                        <button type="button" className="flex items-center px-6 py-2 bg-blue-600 text-white font-bold rounded-md disabled:bg-blue-300" disabled>
                            <Save size={18} className="mr-2" /> Save Campaign
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};