import React, { useState } from 'react';
import { useAppContext, EngineerProfile, Skill } from '../context/AppContext.tsx';
import { DashboardSidebar } from '../components/DashboardSidebar.tsx';
import { EngineerProfileView } from './EngineerProfileView.tsx';
import { EditSkillProfileModal } from '../components/EditSkillProfileModal.tsx';
import { DashboardView } from './EngineerDashboard/DashboardView.tsx';
import { AvailabilityView } from './EngineerDashboard/AvailabilityView.tsx';

export const EngineerDashboard = () => {
    const { user, updateUserProfile, geminiService, upgradeUserTier } = useAppContext();
    const [activeView, setActiveView] = useState('Dashboard');
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isGeneratingDesc, setIsGeneratingDesc] = useState(false);

    if (!user || !('skills' in user.profile)) {
        return <div>Loading...</div>; // or a proper loading spinner
    }
    const engineerProfile = user.profile as EngineerProfile;

    const handleProfileSave = (updatedProfile: EngineerProfile) => {
        updateUserProfile(updatedProfile);
    };

    const handleGenerateDescription = async () => {
        setIsGeneratingDesc(true);
        const desc = await geminiService.generateDescriptionForProfile(engineerProfile);
        updateUserProfile({ description: desc });
        setIsGeneratingDesc(false);
    };

    const addSkillsFromAI = (newSkills: Skill[]) => {
        const currentSkillNames = engineerProfile.skills.map((s: Skill) => s.name.toLowerCase());
        const uniqueNewSkills = newSkills.filter(ns => !currentSkillNames.includes(ns.name.toLowerCase()));
        
        updateUserProfile({
            skills: [...engineerProfile.skills, ...uniqueNewSkills]
        });
    };

    const handleUpdateAvailability = (newDate: Date) => {
        updateUserProfile({ availability: newDate });
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
            case 'My Profile':
                return (
                    <EngineerProfileView 
                        profile={engineerProfile} 
                        isEditable={true} 
                        onEdit={() => setIsEditModalOpen(true)} 
                    />
                );
            case 'Availability':
                 return (
                    <AvailabilityView 
                        profile={engineerProfile} 
                        onUpdateAvailability={handleUpdateAvailability} 
                    />
                 );
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
            <main className="flex-grow p-8 bg-gray-50">
                {renderActiveView()}
            </main>
            <EditSkillProfileModal
                isOpen={isEditModalOpen}
                onClose={() => setIsEditModalOpen(false)}
                userProfile={engineerProfile}
                onSave={handleProfileSave}
            />
        </div>
    );
};