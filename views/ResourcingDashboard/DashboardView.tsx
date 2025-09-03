import React from 'react';
import { EngineerProfile, Application, Contract } from '../../types/index.ts';
import { Users, UserCheck, Briefcase } from '../../components/Icons.tsx';
import { StatCard } from '../../components/StatCard.tsx';

interface DashboardViewProps {
    managedEngineers: EngineerProfile[];
    applications: Application[];
    activePlacements: Contract[];
    setActiveView: (view: string) => void;
}

export const DashboardView = ({ managedEngineers, activePlacements, setActiveView }: DashboardViewProps) => {
    const availableEngineersCount = managedEngineers.filter(e => e.availability <= new Date()).length;

    return (
        <div>
            <h1 className="text-3xl font-bold mb-4">Resourcing Dashboard</h1>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                <StatCard 
                    icon={Users} 
                    value={managedEngineers.length} 
                    label="Managed Engineers" 
                    colorClass="bg-blue-500" 
                    onClick={() => setActiveView('Manage Engineers')} 
                />
                <StatCard 
                    icon={UserCheck} 
                    value={availableEngineersCount} 
                    label="Currently Available" 
                    colorClass="bg-green-500" 
                    onClick={() => setActiveView('Manage Engineers')} 
                />
                <StatCard 
                    icon={Briefcase} 
                    value={activePlacements.length} 
                    label="Active Placements" 
                    colorClass="bg-indigo-500" 
                    onClick={() => setActiveView('Contracts')} 
                />
            </div>
            <div className="bg-white p-5 rounded-lg shadow">
                <h2 className="text-xl font-bold mb-4">Activity Feed</h2>
                <p className="text-gray-500 text-center py-8">The activity feed showing recent applications and job matches is coming soon.</p>
            </div>
        </div>
    );
};
