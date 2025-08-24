import React from 'react';
import { EngineerProfile, Application } from '../../context/AppContext.tsx';
import { Users, UserCheck, Briefcase } from '../../components/Icons.tsx';

interface DashboardViewProps {
    managedEngineers: EngineerProfile[];
    applications: Application[];
}

export const DashboardView = ({ managedEngineers, applications }: DashboardViewProps) => {
    const managedEngineerIds = new Set(managedEngineers.map(e => e.id));
    const applicationsByManaged = applications.filter(app => managedEngineerIds.has(app.engineerId));

    const availableEngineers = managedEngineers.filter(e => e.availability <= new Date());

    return (
        <div>
            <h1 className="text-3xl font-bold mb-6">Resourcing Dashboard</h1>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                <div className="bg-white p-6 rounded-lg shadow flex items-start">
                    <div className="p-3 bg-blue-100 rounded-full mr-4">
                        <Users className="w-8 h-8 text-blue-500" />
                    </div>
                    <div>
                        <h2 className="font-bold text-xl text-gray-600">Managed Engineers</h2>
                        <p className="text-4xl font-extrabold text-blue-600">{managedEngineers.length}</p>
                    </div>
                </div>
                <div className="bg-white p-6 rounded-lg shadow flex items-start">
                    <div className="p-3 bg-green-100 rounded-full mr-4">
                        <UserCheck className="w-8 h-8 text-green-500" />
                    </div>
                    <div>
                        <h2 className="font-bold text-xl text-gray-600">Currently Available</h2>
                        <p className="text-4xl font-extrabold text-green-600">{availableEngineers.length}</p>
                    </div>
                </div>
                <div className="bg-white p-6 rounded-lg shadow flex items-start">
                    <div className="p-3 bg-yellow-100 rounded-full mr-4">
                        <Briefcase className="w-8 h-8 text-yellow-500" />
                    </div>
                    <div>
                        <h2 className="font-bold text-xl text-gray-600">Jobs Applied To</h2>
                        <p className="text-4xl font-extrabold text-yellow-600">{applicationsByManaged.length}</p>
                    </div>
                </div>
            </div>
            <div className="bg-white p-6 rounded-lg shadow">
                <h2 className="text-xl font-bold mb-4">Activity Feed</h2>
                <p className="text-gray-500">The activity feed showing recent applications and job matches is coming soon.</p>
            </div>
        </div>
    );
};