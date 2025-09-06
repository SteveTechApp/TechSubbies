import React, { useState, useEffect } from 'react';
import { DashboardSidebar } from '../components/DashboardSidebar';
// FIX: Corrected module import to remove file extension.
import { DashboardView } from './AdminDashboard/DashboardView';
import { UserManagementView } from './AdminDashboard/UserManagementView';
import { JobManagementView } from './AdminDashboard/JobManagementView';
import { PlatformSettingsView } from './AdminDashboard/PlatformSettingsView';
import { MonetizationView } from './AdminDashboard/MonetizationView';
import { useAppContext } from '../context/AppContext';

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
            <main className="flex-grow p-2 bg-gray-50 overflow-y-auto custom-scrollbar">
                {renderActiveView()}
            </main>
        </div>
    );
};