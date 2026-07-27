import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { DashboardShell } from '../components/DashboardShell';
import { Role } from '../types';
import { DashboardView } from './AdminDashboard/DashboardView';
import { UserManagementView } from './AdminDashboard/UserManagementView';
import { JobManagementView } from './AdminDashboard/JobManagementView';
import { MonetizationView } from './AdminDashboard/MonetizationView';
import { PlatformSettingsView } from './AdminDashboard/PlatformSettingsView';
import { PrivacyRequestsView } from './AdminDashboard/PrivacyRequestsView';

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
            case 'Privacy Requests':
                return <PrivacyRequestsView />;
            case 'Monetization':
                return <MonetizationView />;
            case 'Platform Settings':
                return <PlatformSettingsView />;
            default:
                return <div>Dashboard</div>;
        }
    };

    return (
        <DashboardShell activeView={activeView} setActiveView={setActiveView}>
            {renderView()}
        </DashboardShell>
    );
};
