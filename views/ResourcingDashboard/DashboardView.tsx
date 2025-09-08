
import React from 'react';
import { EngineerProfile, Application, Contract } from '../../types';
import { StatCard } from '../../components/StatCard';
import { Users, Search, Briefcase, PlusCircle } from '../../components/Icons';

interface DashboardViewProps {
    managedEngineers: EngineerProfile[];
    applications: Application[];
    activePlacements: Contract[];
    setActiveView: (view: string) => void;
}

export const DashboardView = ({ managedEngineers, applications, activePlacements, setActiveView }: DashboardViewProps) => {

    const managedEngineerIds = new Set(managedEngineers.map(e => e.id));
    const totalApplications = applications.filter(app => managedEngineerIds.has(app.engineerId)).length;

    return (
        <div>
            <h1 className="text-3xl font-bold mb-4">Resourcing Dashboard</h1>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <StatCard icon={Users} value={managedEngineers.length.toString()} label="Managed Engineers" colorClass="bg-blue-500" />
                <StatCard icon={Briefcase} value={activePlacements.length.toString()} label="Active Placements" colorClass="bg-green-500" />
                <StatCard icon={Search} value={totalApplications.toString()} label="Total Applications Sent" colorClass="bg-indigo-500" />
            </div>

            <div className="mt-8 bg-white p-6 rounded-lg shadow">
                <h2 className="text-xl font-bold mb-4">Quick Actions</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                     <button onClick={() => setActiveView('Manage Engineers')} className="w-full flex items-center p-4 bg-blue-100 rounded-lg hover:bg-blue-200 transition-colors">
                        <Users className="w-6 h-6 text-blue-700 mr-3"/>
                        <span className="font-semibold text-blue-800">Manage My Engineers</span>
                    </button>
                     <button onClick={() => setActiveView('Find Jobs')} className="w-full flex items-center p-4 bg-green-100 rounded-lg hover:bg-green-200 transition-colors">
                        <Search className="w-6 h-6 text-green-700 mr-3"/>
                        <span className="font-semibold text-green-800">Find Jobs for Talent</span>
                    </button>
                    <button className="w-full flex items-center p-4 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors">
                        <PlusCircle className="w-6 h-6 text-gray-700 mr-3"/>
                        <span className="font-semibold text-gray-800">Add New Engineer</span>
                    </button>
                </div>
            </div>
        </div>
    );
};