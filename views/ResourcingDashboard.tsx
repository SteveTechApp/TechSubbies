import React, { useState, useMemo } from 'react';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';
import { useAppContext } from '../context/InteractionContext';
import { DashboardShell } from '../components/DashboardShell';
import { DashboardHelpCenter } from '../components/DashboardHelpCenter';
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
    const { updateCompanyProfile } = useAppContext();
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
                return <SettingsView profile={resourcingProfile} onSave={updateCompanyProfile} />;
            case 'Add New Engineer':
                return <AddNewEngineerView resourcingCompanyId={user.profile.id} onEngineerAdded={handleEngineerAdded} />;
            case 'Help Center':
                return <DashboardHelpCenter role={user.role} setActiveView={setActiveView} />;
            default:
                return <div>View not found</div>;
        }
    };

    return (
        <DashboardShell activeView={activeView} setActiveView={setActiveView}>
            {renderView()}
        </DashboardShell>
    );
};
