import React, { useState, useEffect } from 'react';
import { DashboardSidebar } from '../components/DashboardSidebar.tsx';
import { DashboardView } from './AdminDashboard/DashboardView.tsx';
import { UserManagementView } from './AdminDashboard/UserManagementView.tsx';
import { JobManagementView } from './AdminDashboard/JobManagementView.tsx';
import { PlatformSettingsView } from './AdminDashboard/PlatformSettingsView.tsx';
import { MonetizationView } from './AdminDashboard/MonetizationView.tsx';
import { useAppContext } from '../context/AppContext.tsx';

export const AdminDashboard = () => {
    const { setCurrentPageContext } = useAppContext();
    const [activeView, setActiveView] = useState('Dashboard');

    useEffect(() => {
        setCurrentPageContext(`Admin Dashboard: ${activeView}`);
    }, [activeView, setCurrentPageContext]);

    const renderActiveView = () => {
        switch(activeView) {
            case 'Dashboard':
                return <DashboardView setActiveView={setActiveView} />;
            case 'Manage Users':
                return <UserManagementView />;
            case 'Manage Jobs':
                return <JobManagementView setActiveView={setActiveView} />;
            case 'Monetization':
                return <MonetizationView />;
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
            <main className="flex-grow p-6 bg-gray-50 overflow-y-auto custom-scrollbar">
                {renderActiveView()}
            </main>
        </div>
    );
};