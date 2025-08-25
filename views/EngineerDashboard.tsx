import React, { useState } from 'react';
import { useAppContext } from '../context/AppContext.tsx';
import { EngineerProfile, Skill } from '../types/index.ts';
import { EngineerProfileView } from './EngineerProfileView.tsx';
import { DashboardView } from './EngineerDashboard/DashboardView.tsx';
import { AvailabilityView } from './EngineerDashboard/AvailabilityView.tsx';
import { JobSearchView } from './EngineerDashboard/JobSearchView.tsx';
import { ProfileManagementView } from './EngineerDashboard/ProfileManagementView.tsx';
import { StoryboardCreatorView } from './EngineerDashboard/StoryboardCreatorView.tsx';
import { PaymentsView } from './EngineerDashboard/PaymentsView.tsx';
import { AIToolsView } from './EngineerDashboard/AIToolsView.tsx';
import { MessagesView } from './MessagesView.tsx';
import { ArrowLeft } from '../components/Icons.tsx';


export const EngineerDashboard = () => {
    const { user, updateEngineerProfile, startTrial, boostProfile } = useAppContext();
    const [activeView, setActiveView] = useState('Dashboard');

    if (!user || !('skills' in user.profile)) {
        return <div>Loading...</div>; // or a proper loading spinner
    }
    const engineerProfile = user.profile as EngineerProfile;

    const handleProfileSave = (updatedProfile: Partial<EngineerProfile>) => {
        updateEngineerProfile(updatedProfile);
        alert("Profile updated successfully!");
    };

    const addSkillsFromAI = (newSkills: Skill[]) => {
        const currentSkillNames = engineerProfile.skills.map((s: Skill) => s.name.toLowerCase());
        const uniqueNewSkills = newSkills.filter(ns => !currentSkillNames.includes(ns.name.toLowerCase()));
        
        updateEngineerProfile({
            skills: [...engineerProfile.skills, ...uniqueNewSkills]
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
                        <EngineerProfileView profile={engineerProfile} isEditable={false} onEdit={() => {}} />
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
            case 'Billing':
                return <PaymentsView profile={engineerProfile} setActiveView={setActiveView} />;
            case 'Messages':
                return <MessagesView />;
            case 'Create Storyboard':
                return <StoryboardCreatorView profile={engineerProfile} setActiveView={setActiveView} />;
            default:
                return (
                    <div>
                        <h1 className="text-2xl font-bold">{activeView} - Coming Soon</h1>
                        <p>The functionality for "{activeView}" is under construction.</p>
                    </div>
                );
        }
    };

    return (
        <main className="p-8 bg-gray-50 min-h-screen">
            {renderActiveView()}
        </main>
    );
};