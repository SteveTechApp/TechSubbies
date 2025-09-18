import React, { useState, useMemo } from 'react';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';
import { DashboardSidebar } from '../components/DashboardSidebar';
import { Role, EngineerProfile, Contract, ResourcingCompanyProfile } from '../types';
import { DashboardView } from './ResourcingDashboard/DashboardView';
import { ManageEngineersView } from './ResourcingDashboard/ManageEngineersView';
import { FindJobsView } from './ResourcingDashboard/FindJobsView';
import { SettingsView } from './ResourcingDashboard/SettingsView';
import { AddNewEngineerView } from './ResourcingDashboard/AddNewEngineerView';
import { MessagesView } from '../views/MessagesView';
import { PlacementsView } from './ResourcingDashboard/PlacementsView';
import { AnalyticsView } from './ResourcingDashboard/AnalyticsView';

export const ResourcingDashboard = () => {
    const { user } = useAuth();
    const { engineers, applications, contracts } = useData();
    const [activeView, setActiveView] = useState('Dashboard');
    
    if (!user || user.role !== Role.RESOURCING_COMPANY) {
        return <div>Access Denied.</div>;
    }

    const resourcingProfile = user.profile as ResourcingCompanyProfile;
    const managedEngineerIds = new Set(resourcingProfile.managedEngineerIds || []);

    const managedEngineers = useMemo(() => {
        return engineers.filter(e => managedEngineerIds.has(e.id));
    }, [engineers, managedEngineerIds]);
    
    const managedContracts = useMemo(() => {
        return contracts.filter(c => managedEngineerIds.has(c.engineerId));
    }, [contracts, managedEngineerIds]);

    const handleEngineerAdded = () => {
        setActiveView('Manage Engineers');
    };

    const renderView = () => {
        switch (activeView) {
            case 'Dashboard':
                return <DashboardView managedEngineers={managedEngineers} applications={applications} activePlacements={managedContracts.filter(c => c.status === 'Active')} setActiveView={setActiveView} />;
            case 'Manage Engineers':
                return <ManageEngineersView managedEngineers={managedEngineers} setActiveView={setActiveView} />;
            case 'Find Jobs':
                return <FindJobsView managedEngineers={managedEngineers} setActiveView={setActiveView} />;
            case 'Contracts':
                return <PlacementsView managedContracts={managedContracts} setActiveView={setActiveView} />;
            case 'Messages':
                return <MessagesView />;
            case 'Analytics':
                return <AnalyticsView />;
            case 'Settings':
                return <SettingsView profile={resourcingProfile} onSave={() => {}} />;
            case 'Add New Engineer':
                return <AddNewEngineerView resourcingCompanyId={user.profile.id} onEngineerAdded={handleEngineerAdded} />;
            default:
                return <div>View not found</div>;
        }
    };

    return (
        <div className="flex h-screen bg-gray-100">
            <DashboardSidebar activeView={activeView} setActiveView={setActiveView} />
            <main className="flex-1 p-8 overflow-y-auto">
                {renderView()}
            </main>
        </div>
    );
};