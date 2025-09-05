import React from 'react';
import { useAppContext } from '../../context/AppContext.tsx';
import { Users, User, Building, Briefcase, Star, BarChart2 } from '../../components/Icons.tsx';
import { ProfileTier } from '../../types/index.ts';
import { StatCard } from '../../components/StatCard.tsx';

interface DashboardViewProps {
    setActiveView: (view: string) => void;
}

export const DashboardView = ({ setActiveView }: DashboardViewProps) => {
    const { allUsers, engineers, jobs } = useAppContext();

    const totalCompanies = allUsers.filter(u => u.role === 'company' || u.role === 'resourcing_company').length;
    const totalEngineers = engineers.length;
    const totalUsers = totalCompanies + totalEngineers;
    const premiumEngineers = engineers.filter(e => e.profileTier !== ProfileTier.BASIC).length;

    return (
        <div>
            <h1 className="text-xl font-bold mb-3 flex items-center">
                <BarChart2 size={24} className="mr-2"/>
                Platform Analytics
            </h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-3">
                <StatCard icon={Users} value={totalUsers} label="Total Users" colorClass="bg-blue-500" onClick={() => setActiveView('Manage Users')} />
                <StatCard icon={User} value={totalEngineers} label="Engineers" colorClass="bg-green-500" onClick={() => setActiveView('Manage Users')} />
                <StatCard icon={Building} value={totalCompanies} label="Companies" colorClass="bg-indigo-500" onClick={() => setActiveView('Manage Users')} />
                <StatCard icon={Briefcase} value={jobs.length} label="Jobs Posted" colorClass="bg-sky-500" onClick={() => setActiveView('Manage Jobs')} />
                <StatCard icon={Star} value={premiumEngineers} label="Premium Subs" colorClass="bg-yellow-500" onClick={() => setActiveView('Manage Users')} />
            </div>

            <div className="mt-4 bg-white p-3 rounded-lg shadow">
                <h2 className="text-base font-bold mb-2">Activity Graphs</h2>
                <p className="text-xs text-gray-500">Charts showing user sign-ups, job posting trends, and revenue over time would be displayed here.</p>
                {/* In a real app, this would be a chart component library like Recharts or Chart.js */}
                <div className="h-48 bg-gray-100 mt-2 rounded-md flex items-center justify-center">
                    <p className="text-gray-400 font-semibold text-sm">Chart Area Placeholder</p>
                </div>
            </div>
        </div>
    );
};