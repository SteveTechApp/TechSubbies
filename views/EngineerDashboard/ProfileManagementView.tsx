import React, { useState } from 'react';
import { EngineerProfile, SelectedJobRole, CaseStudy, Skill, Compliance } from '../../types/index.ts';
import { ArrowLeft } from '../../components/Icons.tsx';
import { CoreInfoSection } from '../../components/ProfileManagement/CoreInfoSection.tsx';
import { ContactSection } from '../../components/ProfileManagement/ContactSection.tsx';
import { WorkReadinessSection } from '../../components/ProfileManagement/WorkReadinessSection.tsx';
import { SkillsAndRolesSection } from '../../components/ProfileManagement/SkillsAndRolesSection.tsx';
import { PortfolioSection } from '../../components/ProfileManagement/PortfolioSection.tsx';
import { NotificationSettingsSection } from '../../components/ProfileManagement/NotificationSettingsSection.tsx';

interface ProfileManagementViewProps {
    profile: EngineerProfile;
    onSave: (updatedProfile: Partial<EngineerProfile>) => void;
    setActiveView: (view: string) => void;
}

export const ProfileManagementView = ({ profile, onSave, setActiveView }: ProfileManagementViewProps) => {
    const [formData, setFormData] = useState<Partial<EngineerProfile>>(profile);
    const [contactData, setContactData] = useState(profile.contact);

    const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;
        if (type === 'checkbox') {
            setFormData(prev => ({ ...prev, [name]: (e.target as HTMLInputElement).checked }));
        } else {
            setFormData(prev => ({ ...prev, [name]: name === 'experience' ? parseInt(value, 10) : value }));
        }
    };

    const handleContactChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setContactData(prev => ({ ...prev, [name]: value }));
    };

    const handleComplianceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            compliance: { ...(prev.compliance || {}), [name]: checked } as Compliance,
        }));
    };
    
    // --- Save Logic ---
    const handleSaveChanges = () => {
        // This function will need to aggregate state from child components if they manage their own
        // For now, we assume all state is managed here and passed down.
        const skillsToSave: Skill[] | undefined = (formData as EngineerProfile).profileTier === 'paid' 
            ? (formData.skills || []).map(s => typeof s === 'string' ? { name: s, rating: 50 } : s)
            : undefined;
        
        onSave({ 
            ...formData,
            contact: contactData,
            skills: skillsToSave,
        });
    };

    return (
        <form onSubmit={(e) => { e.preventDefault(); handleSaveChanges(); }}>
            <button 
                type="button"
                onClick={() => setActiveView('Dashboard')} 
                className="flex items-center mb-4 px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300"
            >
                <ArrowLeft size={16} className="mr-2" />
                Back to Dashboard
            </button>
            <div className="flex justify-between items-center mb-4">
                <h1 className="text-3xl font-bold">Manage Profile Details</h1>
                <button 
                    type="submit"
                    className="px-6 py-3 bg-green-600 text-white font-bold rounded-lg hover:bg-green-700 text-lg"
                >
                    Save All Changes
                </button>
            </div>
            
            <div className="space-y-6">
                <CoreInfoSection formData={formData} onProfileChange={handleProfileChange} />
                <ContactSection contactData={contactData} onContactChange={handleContactChange} />
                <WorkReadinessSection complianceData={formData.compliance} onComplianceChange={handleComplianceChange} />
                <NotificationSettingsSection profile={profile} formData={formData} onProfileChange={handleProfileChange} />
                <SkillsAndRolesSection profile={profile} formData={formData} setFormData={setFormData} setActiveView={setActiveView} />
                <PortfolioSection profile={profile} formData={formData} setFormData={setFormData} setActiveView={setActiveView} />
            </div>
        </form>
    );
};