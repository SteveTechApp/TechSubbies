import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
// FIX: Replaced incorrect context hook 'useInteractions' with the correct hook 'useAppContext'.
import { useAppContext } from '../context/InteractionContext';
import { DashboardSidebar } from '../components/DashboardSidebar';
import { EngineerProfile } from '../types';
import { DashboardView } from './EngineerDashboard/DashboardView';
import { ProfileManagementView } from './EngineerDashboard/ProfileManagementView';
import { JobSearchView } from './EngineerDashboard/JobSearchView';
import { AvailabilityView } from './EngineerDashboard/AvailabilityView';
import { MessagesView } from './MessagesView';
import { AIToolsView } from './EngineerDashboard/AIToolsView';
import { MyNetworkView } from './EngineerDashboard/MyNetworkView';
import { SettingsView } from './EngineerDashboard/SettingsView';
import { AICoachView } from './EngineerDashboard/AICoachView';
import { StoryboardCreatorView } from './EngineerDashboard/StoryboardCreatorView';
import { AnalyticsView } from './EngineerDashboard/AnalyticsView';
import { ContractsView } from './ContractsView';
import { FindPartnerView } from './EngineerDashboard/FindPartnerView';
import { InvoicesView } from './InvoicesView';
import { ForumView } from './ForumView';
import { PaymentsView } from './EngineerDashboard/PaymentsView';
import { LoyaltyView } from './EngineerDashboard/LoyaltyView';

export const EngineerDashboard = () => {
    const { user } = useAuth();
    const { updateEngineerProfile, boostProfile, addSkillsToProfile } = useAppContext();
    const [activeView, setActiveView] = useState('Dashboard');
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    if (!user || user.role !== 'Engineer') {
        return <div>Error: Not an engineer user.</div>;
    }

    const engineerProfile = user.profile as EngineerProfile;

    const renderView = () => {
        switch (activeView) {
            case 'Dashboard':
                return <DashboardView engineerProfile={engineerProfile} onUpgradeTier={() => setActiveView('Billing')} setActiveView={setActiveView} boostProfile={boostProfile} />;
            case 'Manage Profile':
                return <ProfileManagementView profile={engineerProfile} onSave={updateEngineerProfile} setActiveView={setActiveView} />;
            case 'Job Search':
                 return <JobSearchView setActiveView={setActiveView} />;
            case 'Find a Partner':
                return <FindPartnerView setActiveView={setActiveView} />;
            case 'My Network':
                 return <MyNetworkView setActiveView={setActiveView} />;
            case 'Availability':
                return <AvailabilityView profile={engineerProfile} onUpdateAvailability={(date) => updateEngineerProfile({ id: engineerProfile.id, availability: date })} setActiveView={setActiveView} />;
            case 'Contracts':
                return <ContractsView setActiveView={setActiveView} />;
            case 'Invoices':
                return <InvoicesView />;
            case 'Messages':
                return <MessagesView />;
            case 'AI Tools':
                return <AIToolsView profile={engineerProfile} onSkillsAdded={addSkillsToProfile} setActiveView={setActiveView} />;
            case 'AI Coach':
                return <AICoachView profile={engineerProfile} setActiveView={setActiveView} />;
            case 'Storyboard Creator':
                return <StoryboardCreatorView profile={engineerProfile} setActiveView={setActiveView} />;
            case 'Analytics':
                return <AnalyticsView />;
            case 'Forum':
                return <ForumView setActiveView={setActiveView} />;
            case 'Billing':
                return <PaymentsView profile={engineerProfile} setActiveView={setActiveView} />;
            case 'Loyalty Program':
                return <LoyaltyView profile={engineerProfile} setActiveView={setActiveView} />;
            case 'Settings':
                return <SettingsView profile={engineerProfile} onSave={updateEngineerProfile} setActiveView={setActiveView} />;
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