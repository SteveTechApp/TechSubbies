import React, { useState, useMemo } from 'react';
import { DashboardSidebar } from '../components/DashboardSidebar.tsx';
import { useAppContext } from '../context/AppContext.tsx';
import { DashboardView } from './ResourcingDashboard/DashboardView.tsx';
import { ManageEngineersView } from './ResourcingDashboard/ManageEngineersView.tsx';
import { FindJobsView } from './ResourcingDashboard/FindJobsView.tsx';
import { SettingsView } from './EngineerDashboard/SettingsView.tsx'; // Re-use settings view for simplicity

export const ResourcingDashboard = () => {
    const { user, engineers, applications } = useAppContext();
    const [activeView, setActiveView] = useState('Dashboard');

    const managedEngineers = useMemo(() => {
        if (!user) return [];
        return engineers.filter(e => e.resourcingCompanyId === user.profile.id);
    }, [user, engineers]);

    const renderActiveView = () => {
        if (!user) return <div>Loading...</div>;

        switch (activeView) {
            case 'Dashboard':
                return <DashboardView managedEngineers={managedEngineers} applications={applications} />;
            case 'Manage Engineers':
                return <ManageEngineersView managedEngineers={managedEngineers} />;
            case 'Find Jobs':
                return <FindJobsView managedEngineers={managedEngineers} />;
            case 'Settings':
                 // In a real app, this would be a dedicated settings view for the resourcing company.
                 // We can show a placeholder or a simplified view for now.
                 return (
                    <div>
                        <h1 className="text-3xl font-bold mb-6">Settings</h1>
                        <div className="bg-white p-6 rounded-lg shadow">
                            <h2 className="text-xl font-bold">Company Settings</h2>
                            <p className="mt-4">Manage your resourcing company profile and notification settings here.</p>
                            <p className="mt-2 text-sm text-gray-500">(This feature is under development)</p>
                        </div>
                    </div>
                );
            default:
                return (
                    <div>
                        <h1 className="text-2xl font-bold">{activeView} - Coming Soon</h1>
                        <p>The functionality for "{activeView}" is under construction.</p>
                    </div>
                );
        }
    };

    return (
        <div className="flex">
            <DashboardSidebar activeView={activeView} setActiveView={setActiveView} />
            <main className="flex-grow p-8 bg-gray-50 h-screen overflow-y-auto custom-scrollbar">
                {renderActiveView()}
            </main>
        </div>
    );
};