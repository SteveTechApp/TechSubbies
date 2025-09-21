import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { DashboardSidebar } from '../components/DashboardSidebar';
import { Role } from '../types';
import { DashboardView } from './AdminDashboard/DashboardView';
import { UserManagementView } from './AdminDashboard/UserManagementView';
import { JobManagementView } from './AdminDashboard/JobManagementView';
import { MonetizationView } from './AdminDashboard/MonetizationView';
import { PlatformSettingsView } from './AdminDashboard/PlatformSettingsView';

export const AdminDashboard = () => {
    const { user } = useAuth();
    const [activeView, setActiveView] = useState('Dashboard');

    if (!user || user.role !== Role.ADMIN) {
        return <div>Access Denied.</div>;
    }

    const renderView = () => {
        switch (activeView) {
            case 'Dashboard':
                return <DashboardView setActiveView={setActiveView}/>;
            case 'Manage Users':
                return <UserManagementView />;
            case 'Manage Jobs':
                return <JobManagementView setActiveView={setActiveView} />;
            case 'Monetization':
                return <MonetizationView />;
            case 'Platform Settings':
                return <PlatformSettingsView />;
            default:
                return <div>Dashboard</div>;
        }
    };

    return (
        <div className="flex h-screen bg-gray-100">
            <DashboardSidebar activeView={activeView} setActiveView={setActiveView} />
            <main className="flex-1 p-6 overflow-y-auto">
                {renderView()}
            </main>
        </div>
    );
};