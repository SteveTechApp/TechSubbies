import React, { useState, useEffect } from 'react';
import { useAppContext } from '../context/AppContext';
// FIX: Corrected module imports to remove file extensions.
import { EngineerProfile, Skill, ProfileTier } from '../types';
import { EngineerProfileView } from './EngineerProfileView';
import { DashboardView } from './EngineerDashboard/DashboardView';
import { AvailabilityView } from './EngineerDashboard/AvailabilityView';
import { JobSearchView } from './EngineerDashboard/JobSearchView';
import { ProfileManagementView } from './EngineerDashboard/ProfileManagementView';
import { StoryboardCreatorView } from './EngineerDashboard/StoryboardCreatorView';
import { PaymentsView } from './EngineerDashboard/PaymentsView';
import { AIToolsView } from './EngineerDashboard/AIToolsView';
import { MyNetworkView } from './EngineerDashboard/MyNetworkView';
import { MessagesView } from './MessagesView';
import { ArrowLeft } from '../components/Icons';
import { DashboardSidebar } from '../components/DashboardSidebar';
import { AnalyticsView } from './EngineerDashboard/AnalyticsView';
import { ContractsView } from './ContractsView';
import { ForumView } from './ForumView';
import { AICoachView } from './EngineerDashboard/AICoachView';
import { InvoicesView } from './InvoicesView';
import { SettingsView } from './EngineerDashboard/SettingsView';


export const EngineerDashboard = () => {
    const { user, updateEngineerProfile, startTrial, boostProfile, setCurrentPageContext } = useAppContext();
    const [activeView, setActiveView] = useState('Dashboard');

    useEffect(() => {
        setCurrentPageContext(`Engineer Dashboard: ${activeView}`);
    }, [activeView, setCurrentPageContext]);

    if (!user || !('skills' in user.profile)) {
        return <div>Loading...</div>;
    }
    const engineerProfile = user.profile as EngineerProfile;

    const handleProfileSave = (updatedProfile: Partial<EngineerProfile>) => {
        updateEngineerProfile(updatedProfile);
    };

    const addSkillsFromAI = (newSkills: Skill[]) => {
        const currentSkillNames = (engineerProfile.skills || []).map((s: Skill) => s.name.toLowerCase());
        const uniqueNewSkills = newSkills.filter(ns => !currentSkillNames.includes(ns.name.toLowerCase()));
        
        updateEngineerProfile({
            skills: [...(engineerProfile.skills || []), ...uniqueNewSkills]
        });
    };

    const handleUpdateAvailability = (newDate: Date) => {
        updateEngineerProfile({ availability: newDate });
    };

    const renderActiveView = () => {
        switch(activeView) {
            case 'Dashboard':
                return (
                    <DashboardView
                        engineerProfile={engineerProfile}
                        onUpgradeTier={startTrial}
                        setActiveView={setActiveView}
                        boostProfile={boostProfile}
                    />
                );
            case 'Manage Profile':
                 return (
                    <ProfileManagementView 
                        profile={engineerProfile} 
                        onSave={handleProfileSave} 
                        setActiveView={setActiveView}
                    />
                );
            case 'View Public Profile':
                return (
                    <div>
                        <button 
                            onClick={() => setActiveView('Dashboard')} 
                            className="flex items-center mb-4 px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300"
                        >
                            <ArrowLeft size={16} className="mr-2" />
                            Back to Dashboard
                        </button>
                        <EngineerProfileView profile={engineerProfile} isEditable={true} onEdit={() => setActiveView('Manage Profile')} />
                    </div>
                );
            case 'Availability':
                 return (
                    <AvailabilityView 
                        profile={engineerProfile} 
                        onUpdateAvailability={handleUpdateAvailability} 
                        setActiveView={setActiveView}
                    />
                 );
            case 'Job Search':
                return <JobSearchView setActiveView={setActiveView} />;
            case 'AI Tools':
                return <AIToolsView profile={engineerProfile} onSkillsAdded={addSkillsFromAI} setActiveView={setActiveView} />;
            case 'AI Coach':
                return <AICoachView profile={engineerProfile} setActiveView={setActiveView} />;
            case 'Billing':
                return <PaymentsView profile={engineerProfile} setActiveView={setActiveView} />;
            case 'My Network':
                return <MyNetworkView setActiveView={setActiveView} />;
            case 'Messages':
                return <MessagesView />;
            case 'Contracts':
                return <ContractsView setActiveView={setActiveView} />;
            case 'Invoices':
                return <InvoicesView />;
            case 'Forum':
                return <ForumView setActiveView={setActiveView} />;
            case 'Settings':
                return <SettingsView profile={engineerProfile} onSave={handleProfileSave} setActiveView={setActiveView} />;
            case 'Analytics':
                 if (engineerProfile.profileTier === ProfileTier.BUSINESS) {
                    return <AnalyticsView />;
                 }
                 return (
                    <div>
                        <h2 className="text-xl font-bold">Analytics</h2>
                        <p>This feature is available for Platinum subscribers.</p>
                        <button onClick={() => setActiveView('Billing')} className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md">Upgrade Now</button>
                    </div>
                 );
            default:
                return (
                    <div>
                        <h1 className="text-2xl font-bold">{activeView} - Coming Soon</h1>
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