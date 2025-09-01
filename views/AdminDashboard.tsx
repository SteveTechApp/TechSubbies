import React, { useState } from 'react';
import { DashboardSidebar } from '../components/DashboardSidebar.tsx';
import { DashboardView } from './AdminDashboard/DashboardView.tsx';
import { UserManagementView } from './AdminDashboard/UserManagementView.tsx';
import { JobManagementView } from './AdminDashboard/JobManagementView.tsx';
import { PlatformSettingsView } from './AdminDashboard/PlatformSettingsView.tsx';

export const AdminDashboard = () => {
    const [activeView, setActiveView] = useState('Dashboard');

    const renderActiveView = () => {
        switch(activeView) {
            case 'Dashboard':
                return <DashboardView setActiveView={setActiveView} />;
            case 'Manage Users':
                return <UserManagementView />;
            case 'Manage Jobs':
                return <JobManagementView setActiveView={setActiveView} />;
            case 'Platform Settings':
                return <PlatformSettingsView />;
            default:
                 return (
                    <div>
                        <h1 className="text-2xl font-bold">{activeView} - Coming Soon</h1>
                        <p className="mt-4">This feature is under development.</p>
                    </div>
                );
        }
    };

    return (
        <div className="flex h-screen overflow-hidden">
            <DashboardSidebar activeView={activeView} setActiveView={setActiveView} />
            <main className="flex-grow p-8 bg-gray-50 overflow-y-auto custom-scrollbar">
                {renderActiveView()}
            </main>
        </div>
    );
};