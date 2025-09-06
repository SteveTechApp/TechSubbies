import React from 'react';
import { useAppContext } from '../../context/AppContext.tsx';
import { StatCard } from '../../components/StatCard.tsx';
import { Role, TransactionType } from '../../types/index.ts';
import { Users, Briefcase, DollarSign, UserCheck } from '../../components/Icons.tsx';

export const DashboardView = ({ setActiveView }: { setActiveView: (view: string) => void }) => {
    const { allUsers, jobs, transactions } = useAppContext();

    const userCounts = allUsers.reduce((acc, user) => {
        acc[user.role] = (acc[user.role] || 0) + 1;
        return acc;
    }, {} as Record<Role, number>);

    const totalRevenue = transactions.reduce((sum, t) => sum + Math.abs(t.amount), 0);
    const activeJobs = jobs.filter(j => j.status === 'active').length;

    return (
        <div>
            <h1 className="text-xl font-bold mb-4">Admin Dashboard</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
                <StatCard icon={Users} value={allUsers.length.toString()} label="Total Users" colorClass="bg-blue-500" />
                <StatCard icon={UserCheck} value={(userCounts[Role.ENGINEER] || 0).toString()} label="Engineers" colorClass="bg-green-500" />
                <StatCard icon={Briefcase} value={activeJobs.toString()} label="Active Jobs" colorClass="bg-indigo-500" />
                <StatCard icon={DollarSign} value={`£${totalRevenue.toLocaleString()}`} label="Total Transaction Volume" colorClass="bg-yellow-500" />
            </div>

            <div className="mt-4 grid grid-cols-1 lg:grid-cols-2 gap-3">
                 <div className="bg-white p-4 rounded-lg shadow">
                    <h2 className="text-base font-bold mb-4">Quick Actions</h2>
                    <div className="grid grid-cols-2 gap-4">
                       <button onClick={() => setActiveView('Manage Users')} className="p-4 bg-gray-50 rounded-lg text-center hover:bg-gray-100 transition-colors">
                            <Users className="w-8 h-8 mx-auto text-gray-600 mb-2"/>
                            <span className="font-semibold text-gray-800 text-sm">Manage Users</span>
                        </button>
                         <button onClick={() => setActiveView('Manage Jobs')} className="p-4 bg-gray-50 rounded-lg text-center hover:bg-gray-100 transition-colors">
                            <Briefcase className="w-8 h-8 mx-auto text-gray-600 mb-2"/>
                            <span className="font-semibold text-gray-800 text-sm">Manage Jobs</span>
                        </button>
                    </div>
                </div>

                <div className="bg-white p-4 rounded-lg shadow">
                    <h2 className="text-base font-bold mb-4">Platform Health</h2>
                    <ul className="space-y-3 text-sm">
                        <li className="flex justify-between"><span>Companies:</span> <span className="font-bold">{userCounts[Role.COMPANY] || 0}</span></li>
                        <li className="flex justify-between"><span>Resourcing Companies:</span> <span className="font-bold">{userCounts[Role.RESOURCING_COMPANY] || 0}</span></li>
                        <li className="flex justify-between"><span>Total Jobs Posted:</span> <span className="font-bold">{jobs.length}</span></li>
                        <li className="flex justify-between"><span>Total Transactions:</span> <span className="font-bold">{transactions.length}</span></li>
                    </ul>
                </div>
            </div>
        </div>
    );
};