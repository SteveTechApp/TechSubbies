import React, { useState } from 'react';
import { useAppContext, EngineerProfile, Skill } from '../context/AppContext.tsx';
import { DashboardSidebar } from '../components/DashboardSidebar.tsx';
import { EngineerProfileView } from './EngineerProfileView.tsx';
import { DashboardView } from './EngineerDashboard/DashboardView.tsx';
import { AvailabilityView } from './EngineerDashboard/AvailabilityView.tsx';
import { JobSearchView } from './EngineerDashboard/JobSearchView.tsx';
import { ProfileManagementView } from './EngineerDashboard/ProfileManagementView.tsx';
import { SettingsView } from './EngineerDashboard/SettingsView.tsx';


export const EngineerDashboard = () => {
    const { user, updateEngineerProfile, geminiService, upgradeUserTier } = useAppContext();
    const [activeView, setActiveView] = useState('Dashboard');
    const [isGeneratingDesc, setIsGeneratingDesc] = useState(false);

    if (!user || !('skills' in user.profile)) {
        return <div>Loading...</div>; // or a proper loading spinner
    }
    const engineerProfile = user.profile as EngineerProfile;

    const handleProfileSave = (updatedProfile: Partial<EngineerProfile>) => {
        updateEngineerProfile(updatedProfile);
        alert("Profile updated successfully!");
    };

    const handleGenerateDescription = async () => {
        setIsGeneratingDesc(true);
        const desc = await geminiService.generateDescriptionForProfile(engineerProfile);
        updateEngineerProfile({ description: desc });
        setIsGeneratingDesc(false);
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
                        user={user}
                        profileDescription={engineerProfile.description}
                        onGenerateDescription={handleGenerateDescription}
                        isGeneratingDesc={isGeneratingDesc}
                        onSkillsAdded={addSkillsFromAI}
                        profileTier={engineerProfile.profileTier}
                        onUpgradeTier={upgradeUserTier}
                    />
                );
            case 'Manage Profile':
                 return (
                    <ProfileManagementView 
                        profile={engineerProfile} 
                        onSave={handleProfileSave} 
                    />
                );
            case 'View Public Profile':
                return <EngineerProfileView profile={engineerProfile} isEditable={false} onEdit={() => {}} />;
            case 'Availability':
                 return (
                    <AvailabilityView 
                        profile={engineerProfile} 
                        onUpdateAvailability={handleUpdateAvailability} 
                    />
                 );
            case 'Job Search':
                return <JobSearchView />;
            case 'Settings':
                return <SettingsView profile={engineerProfile} onSave={handleProfileSave} />;
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
        <div className="flex">
            <DashboardSidebar activeView={activeView} setActiveView={setActiveView} />
            <main className="flex-grow p-8 bg-gray-50 h-screen overflow-y-auto custom-scrollbar">
                {renderActiveView()}
            </main>
        </div>
    );
};
