import React, { useMemo } from 'react';
import { useAppContext } from '../../context/InteractionContext';
import { BarChart2, DollarSign, Star, Briefcase } from '../../components/Icons';
import { Contract, ContractStatus, Review } from '../../types';

const StatCard = ({ icon: Icon, value, label, color }: { icon: React.ComponentType<any>, value: string, label: string, color: string }) => (
    <div className="bg-white p-4 rounded-lg shadow">
        <div className="flex items-start justify-between">
            <div>
                <p className="text-sm font-medium text-gray-500">{label}</p>
                <p className="text-4xl font-bold text-gray-800">{value}</p>
            </div>
            <Icon size={24} className={color} />
        </div>
    </div>
);


export const AnalyticsView = () => {
    const { user, contracts, reviews } = useAppContext();

    const { totalEarnings, completedJobs, averageRating } = useMemo(() => {
        if (!user) return { totalEarnings: 0, completedJobs: 0, averageRating: 0 };
        
        const myContracts = contracts.filter(c => c.engineerId === user.profile.id);

        const earnings = myContracts.reduce((sum, c) => {
            if (typeof c.amount === 'string') {
                // For day rate, this is an estimate as we don't track total days worked
                return sum + (parseFloat(c.amount) || 0) * 20; // Assume 20 days for estimation
            }
            return sum + (c.amount || 0);
        }, 0);
        
        const completed = myContracts.filter(c => c.status === ContractStatus.COMPLETED).length;
        
        const myReviews = reviews.filter(r => r.engineerId === user.profile.id);
        const avgRating = myReviews.length > 0
            ? myReviews.reduce((sum, r) => sum + (r.peerRating + r.customerRating) / 2, 0) / myReviews.length
            : 0;

        return {
            totalEarnings: earnings,
            completedJobs: completed,
            averageRating: avgRating
        };

    }, [user, contracts, reviews]);


    return (
        <div>
            <h1 className="text-3xl font-bold mb-6 flex items-center">
                <BarChart2 size={30} className="mr-3 text-blue-600"/>
                My Analytics
            </h1>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <StatCard icon={DollarSign} value={`£${totalEarnings.toLocaleString()}`} label="Estimated Total Earnings" color="text-green-500" />
                <StatCard icon={Briefcase} value={String(completedJobs)} label="Completed Contracts" color="text-blue-500" />
                <StatCard icon={Star} value={averageRating.toFixed(1)} label="Average Rating" color="text-yellow-500" />
            </div>
            
            <div className="mt-6 bg-white p-6 rounded-lg shadow">
                <h2 className="text-xl font-bold mb-4">Performance Overview</h2>
                <p className="text-center text-gray-500 py-12">More charts and detailed analytics coming soon!</p>
            </div>
        </div>
    );
};
