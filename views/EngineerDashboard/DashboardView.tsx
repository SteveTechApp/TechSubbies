import React from 'react';
import { EngineerProfile, ProfileTier } from '../../types';
import { StatCard } from '../../components/StatCard';
import { User, Search, Star, Rocket, Briefcase, Mail } from '../../components/Icons';
import { useAppContext } from '../../context/AppContext';

interface DashboardViewProps {
    engineerProfile: EngineerProfile;
    onUpgradeTier: () => void;
    setActiveView: (view: string) => void;
    boostProfile: () => void;
}

export const DashboardView = ({ engineerProfile, onUpgradeTier, setActiveView, boostProfile }: DashboardViewProps) => {
    const { applications, reviews } = useAppContext();

    const myApplications = applications.filter(app => app.engineerId === engineerProfile.id);
    const myReviews = reviews.filter(rev => rev.engineerId === engineerProfile.id);
    const averageRating = myReviews.length > 0
        ? myReviews.reduce((sum, r) => sum + (r.peerRating + r.customerRating) / 2, 0) / myReviews.length
        : 0;

    const isBoosted = engineerProfile.isBoosted || false;

    return (
        <div>
            <h1 className="text-3xl font-bold mb-4">Welcome, {engineerProfile.name.split(' ')[0]}!</h1>
            
            {engineerProfile.profileTier === ProfileTier.BASIC && (
                <div className="p-4 bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 mb-6 rounded-md">
                    <h3 className="font-bold">Unlock Your Full Potential!</h3>
                    <p>You're on the free Bronze plan. Upgrade to a <button onClick={() => setActiveView('Billing')} className="font-bold underline">Skills Profile</button> to add specialist roles, get AI-powered tools, and appear higher in search results.</p>
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard icon={User} value={engineerProfile.profileViews.toString()} label="Profile Views" colorClass="bg-blue-500" />
                <StatCard icon={Search} value={engineerProfile.searchAppearances.toString()} label="Search Appearances" colorClass="bg-green-500" />
                <StatCard icon={Briefcase} value={myApplications.length.toString()} label="Jobs Applied For" colorClass="bg-indigo-500" />
                <StatCard icon={Star} value={averageRating.toFixed(1)} label="Average Rating" colorClass="bg-yellow-500" />
            </div>

            <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 bg-white p-6 rounded-lg shadow">
                    <h2 className="text-xl font-bold mb-4">Quick Actions</h2>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        <button onClick={() => setActiveView('Manage Profile')} className="p-4 bg-gray-50 rounded-lg text-center hover:bg-gray-100 transition-colors">
                            <User className="w-8 h-8 mx-auto text-gray-600 mb-2"/>
                            <span className="font-semibold text-gray-800">Edit Profile</span>
                        </button>
                        <button onClick={() => setActiveView('Job Search')} className="p-4 bg-gray-50 rounded-lg text-center hover:bg-gray-100 transition-colors">
                            <Search className="w-8 h-8 mx-auto text-gray-600 mb-2"/>
                            <span className="font-semibold text-gray-800">Find Work</span>
                        </button>
                         <button onClick={() => setActiveView('Messages')} className="p-4 bg-gray-50 rounded-lg text-center hover:bg-gray-100 transition-colors">
                            <Mail className="w-8 h-8 mx-auto text-gray-600 mb-2"/>
                            <span className="font-semibold text-gray-800">My Messages</span>
                        </button>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-lg shadow">
                    <h2 className="text-xl font-bold mb-4 flex items-center">
                        <Rocket className="w-6 h-6 mr-2 text-purple-500" /> Profile Boost
                    </h2>
                    {isBoosted ? (
                        <div className="text-center p-4 bg-purple-100 rounded-md">
                            <p className="font-bold text-purple-800">Your profile is currently boosted!</p>
                            <p className="text-sm text-purple-600">You will appear at the top of relevant searches.</p>
                        </div>
                    ) : (
                         <>
                            <p className="text-gray-600 mb-4">Get seen by more companies. Boost your profile to the top of search results for 12 hours.</p>
                            <button 
                                onClick={boostProfile} 
                                disabled={engineerProfile.profileTier === ProfileTier.BASIC}
                                className="w-full bg-purple-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-purple-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
                            >
                                {engineerProfile.profileTier === ProfileTier.BASIC ? "Upgrade to Use Boosts" : "Use a Boost Credit"}
                            </button>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};
