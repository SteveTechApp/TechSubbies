

import React from 'react';
// FIX: Corrected import path for types.
import { User, Job, EngineerProfile, Application } from '../../types';
import { StatCard } from '../../components/StatCard';
// FIX: Corrected import path for icons.
import { Briefcase, Users, PlusCircle, Search } from '../../components/Icons';

interface DashboardViewProps {
    user: User;
    myJobs: Job[];
    engineers: EngineerProfile[];
    applications: Application[];
    setActiveView: (view: string) => void;
}

export const DashboardView = ({ user, myJobs, engineers, applications, setActiveView }: DashboardViewProps) => {
    
    const totalApplicants = applications.filter(app => myJobs.some(j => j.id === app.jobId)).length;
    
    const recentApplicants = applications
        .filter(app => myJobs.some(j => j.id === app.jobId))
        .sort((a,b) => b.date.getTime() - a.date.getTime())
        .slice(0, 5)
        .map(app => ({
            application: app,
            engineer: engineers.find(eng => eng.id === app.engineerId),
            job: myJobs.find(j => j.id === app.jobId)
        }))
        .filter(item => item.engineer && item.job);

    return (
        <div>
            <h1 className="text-3xl font-bold mb-4">Welcome, {user.profile.name}!</h1>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <StatCard icon={Briefcase} value={myJobs.length.toString()} label="Active Jobs" colorClass="bg-blue-500" />
                <StatCard icon={Users} value={totalApplicants.toString()} label="Total Applicants" colorClass="bg-green-500" />
                <StatCard icon={Users} value={engineers.length.toString()} label="Engineers in Network" colorClass="bg-indigo-500" />
            </div>

            <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 bg-white p-6 rounded-lg shadow">
                    <h2 className="text-xl font-bold mb-4">Recent Applicants</h2>
                    {recentApplicants.length > 0 ? (
                        <div className="space-y-4">
                            {recentApplicants.map(({ application, engineer, job }) => (
                                <div key={application.jobId + application.engineerId} className="flex items-center p-3 bg-gray-50 rounded-md">
                                    <img src={engineer!.avatar} alt={engineer!.name} className="w-12 h-12 rounded-full mr-4"/>
                                    <div className="flex-grow">
                                        <p><span className="font-bold">{engineer!.name}</span> applied for</p>
                                        <p className="text-blue-600 font-semibold">{job!.title}</p>
                                    </div>
                                    <button onClick={() => setActiveView('My Jobs')} className="text-sm bg-blue-100 text-blue-700 px-3 py-1 rounded-full hover:bg-blue-200">View</button>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-gray-500 text-center py-4">No recent applicants.</p>
                    )}
                </div>

                <div className="bg-white p-6 rounded-lg shadow">
                    <h2 className="text-xl font-bold mb-4">Quick Actions</h2>
                    <div className="space-y-3">
                        <button onClick={() => setActiveView('Post a Job')} className="w-full flex items-center p-4 bg-green-100 rounded-lg hover:bg-green-200 transition-colors">
                            <PlusCircle className="w-6 h-6 text-green-700 mr-3"/>
                            <span className="font-semibold text-green-800">Post a New Job</span>
                        </button>
                         <button onClick={() => setActiveView('Find Talent')} className="w-full flex items-center p-4 bg-blue-100 rounded-lg hover:bg-blue-200 transition-colors">
                            <Search className="w-6 h-6 text-blue-700 mr-3"/>
                            <span className="font-semibold text-blue-800">Search for Talent</span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};
