import React from 'react';
import { useAppContext } from '../../context/AppContext.tsx';
import { Users, User, Building, Briefcase, Star, BarChart2 } from '../../components/Icons.tsx';
// FIX: Add ProfileTier to imports for type-safe comparison.
import { ProfileTier } from '../../types/index.ts';

const StatCard = ({ icon: Icon, value, label, colorClass }: { icon: React.ComponentType<any>, value: string | number, label:string, colorClass: string }) => (
    <div className="bg-white p-6 rounded-lg shadow flex items-start">
        <div className={`p-3 rounded-full mr-4 ${colorClass}`}>
            <Icon className="w-8 h-8 text-white" />
        </div>
        <div>
            <p className="text-4xl font-extrabold text-gray-800">{value}</p>
            <h2 className="font-bold text-lg text-gray-500">{label}</h2>
        </div>
    </div>
);


export const DashboardView = () => {
    const { allUsers, engineers, jobs } = useAppContext();

    const totalCompanies = allUsers.filter(u => u.role === 'company' || u.role === 'resourcing_company').length;
    const totalEngineers = engineers.length;
    const totalUsers = totalCompanies + totalEngineers;
    // FIX: Compare against ProfileTier enum instead of string literal.
    const premiumEngineers = engineers.filter(e => e.profileTier !== ProfileTier.BASIC).length;

    return (
        <div>
            <h1 className="text-3xl font-bold mb-6 flex items-center">
                <BarChart2 size={30} className="mr-3"/>
                Platform Analytics
            </h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                <StatCard icon={Users} value={totalUsers} label="Total Users" colorClass="bg-blue-500" />
                <StatCard icon={User} value={totalEngineers} label="Engineers" colorClass="bg-green-500" />
                <StatCard icon={Building} value={totalCompanies} label="Companies" colorClass="bg-indigo-500" />
                <StatCard icon={Briefcase} value={jobs.length} label="Jobs Posted" colorClass="bg-sky-500" />
                <StatCard icon={Star} value={premiumEngineers} label="Premium Subscriptions" colorClass="bg-yellow-500" />
            </div>

            <div className="mt-8 bg-white p-6 rounded-lg shadow">
                <h2 className="text-xl font-bold mb-4">Activity Graphs</h2>
                <p className="text-gray-500">Charts showing user sign-ups, job posting trends, and revenue over time would be displayed here.</p>
                {/* In a real app, this would be a chart component library like Recharts or Chart.js */}
                <div className="h-64 bg-gray-100 mt-4 rounded-md flex items-center justify-center">
                    <p className="text-gray-400 font-semibold">Chart Area Placeholder</p>
                </div>
            </div>
        </div>
    );
};