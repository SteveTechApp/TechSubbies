import React, { useState, useEffect } from 'react';
import { useAppContext } from '../context/AppContext';
import { EngineerProfile, ProfileTier, Skill } from '../types';
import { DashboardSidebar } from '../components/DashboardSidebar';
import { DashboardView } from './EngineerDashboard/DashboardView';
import { ProfileManagementView } from './EngineerDashboard/ProfileManagementView';
import { JobSearchView } from './EngineerDashboard/JobSearchView';
import { AvailabilityView } from './EngineerDashboard/AvailabilityView';
import { MyNetworkView } from './EngineerDashboard/MyNetworkView';
import { AIToolsView } from './EngineerDashboard/AIToolsView';
import { StoryboardCreatorView } from './EngineerDashboard/StoryboardCreatorView';
// FIX: `PaymentsView` was not a module. It has been created and is now imported correctly.
import { PaymentsView } from './EngineerDashboard/PaymentsView';
import { MessagesView } from './MessagesView';
import { AnalyticsView } from './EngineerDashboard/AnalyticsView';
import { ForumView } from './ForumView';
import { ContractsView } from './ContractsView';
import { InvoicesView } from './InvoicesView';
import { AICoachView } from './EngineerDashboard/AICoachView';
import { LoyaltyView } from './EngineerDashboard/LoyaltyView';
import { SettingsView } from './EngineerDashboard/SettingsView';
import { FindPartnerView } from './EngineerDashboard/FindPartnerView';

export const EngineerDashboard = () => {
    const { user, updateEngineerProfile, setCurrentPageContext, boostProfile } = useAppContext();
    const [activeView, setActiveView] = useState('Dashboard');
    const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);

    useEffect(() => {
        setCurrentPageContext(`Engineer Dashboard: ${activeView}`);
    }, [activeView, setCurrentPageContext]);


    const handleSaveProfile = (updatedProfile: Partial<EngineerProfile>) => {
        if (user) {
            updateEngineerProfile(user.profile.id, updatedProfile);
        }
    };

    const handleSkillsAdded = (newSkills: Skill[]) => {
        if (user) {
            const currentProfile = user.profile as EngineerProfile;
            const existingSkills = currentProfile.skills || [];
            const updatedSkills = [...existingSkills];
            newSkills.forEach(newSkill => {
                if (!existingSkills.some(s => s.name.toLowerCase() === newSkill.name.toLowerCase())) {
                    updatedSkills.push(newSkill);
                }
            });
            handleSaveProfile({ skills: updatedSkills });
            alert(`${newSkills.length} skills added to your profile! For best results, add these skills to a Specialist Role in the 'Manage Profile' section.`);
            setActiveView('Manage Profile');
        }
    };
    
    const handleBoostProfile = () => {
        if (user && (user.profile as EngineerProfile).profileTier !== ProfileTier.BASIC) {
            boostProfile();
            alert("Profile Boosted for 12 hours!");
        } else {
             alert("Profile Boosts are a premium feature. Please upgrade your profile.");
             setActiveView('Billing');
        }
    }


    const renderActiveView = () => {
        if (!user || !user.profile) return <div>Loading...</div>;
        const engineerProfile = user.profile as EngineerProfile;

        switch(activeView) {
            case 'Dashboard':
                return <DashboardView engineerProfile={engineerProfile} onUpgradeTier={() => {}} setActiveView={setActiveView} boostProfile={handleBoostProfile} />;
            case 'Manage Profile':
                return <ProfileManagementView profile={engineerProfile} onSave={handleSaveProfile} setActiveView={setActiveView} />;
            case 'Job Search':
                return <JobSearchView setActiveView={setActiveView} />;
            case 'My Network':
                return <MyNetworkView setActiveView={setActiveView} />;
            case 'Find a Partner':
                return <FindPartnerView setActiveView={setActiveView} />;
            case 'Availability':
                return <AvailabilityView profile={engineerProfile} onUpdateAvailability={(date) => handleSaveProfile({ availability: date })} setActiveView={setActiveView} />;
            case 'AI Tools':
                return <AIToolsView profile={engineerProfile} onSkillsAdded={handleSkillsAdded} setActiveView={setActiveView} />;
            case 'AI Coach':
                return <AICoachView profile={engineerProfile} setActiveView={setActiveView} />;
            case 'Storyboard Creator':
                 return <StoryboardCreatorView profile={engineerProfile} setActiveView={setActiveView} />;
            case 'Analytics':
                return <AnalyticsView />;
            case 'Forum':
                return <ForumView setActiveView={setActiveView} />;
            case 'Contracts':
                return <ContractsView setActiveView={setActiveView} />;
            case 'Invoices':
                return <InvoicesView />;
            case 'Messages':
                return <MessagesView />;
            case 'Billing':
                return <PaymentsView profile={engineerProfile} setActiveView={setActiveView} />;
            case 'Loyalty Program':
                return <LoyaltyView profile={engineerProfile} setActiveView={setActiveView} />;
            case 'Settings':
                 return <SettingsView profile={engineerProfile} onSave={handleSaveProfile} setActiveView={setActiveView} />;
            default:
                return <div>View not found</div>;
        }
    };

    return (
        <div className="flex h-screen bg-gray-100">
            <DashboardSidebar activeView={activeView} setActiveView={setActiveView} />
            <main className="flex-grow p-6 overflow-y-auto custom-scrollbar">
                {renderActiveView()}
            </main>
        </div>
    );
};