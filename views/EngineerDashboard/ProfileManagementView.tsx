import React, { useState } from 'react';
import { EngineerProfile } from '../../types/index.ts';
import { ArrowLeft, User, Star, Award, Briefcase, Save, Mail, Link as LinkIcon, ShieldCheck } from '../../components/Icons.tsx';
import { AccordionSection } from '../../components/AccordionSection.tsx';
import { SkillsAndRolesSection } from '../../components/ProfileManagement/SkillsAndRolesSection.tsx';
import { ProfileEssentials } from '../../components/ProfileManagement/ProfileEssentials.tsx';
import { ProfileCertifications } from '../../components/ProfileManagement/ProfileCertifications.tsx';
import { ProfilePortfolio } from '../../components/ProfileManagement/ProfilePortfolio.tsx';
import { ProfileContact } from '../../components/ProfileManagement/ProfileContact.tsx';
import { ProfileSocials } from '../../components/ProfileManagement/ProfileSocials.tsx';
import { ProfileCompliance } from '../../components/ProfileManagement/ProfileCompliance.tsx';

interface ProfileManagementViewProps {
    profile: EngineerProfile;
    onSave: (updatedProfile: Partial<EngineerProfile>) => void;
    setActiveView: (view: string) => void;
}

export const ProfileManagementView = ({ profile, onSave, setActiveView }: ProfileManagementViewProps) => {
    const [profileData, setProfileData] = useState<EngineerProfile>(profile);

    const handleSave = () => {
        onSave(profileData);
        alert('Profile changes saved!');
    };

    return (
        <div>
             <header className="flex justify-between items-center mb-4">
                <button 
                    type="button"
                    onClick={() => setActiveView('Dashboard')} 
                    className="flex items-center px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300"
                >
                    <ArrowLeft size={16} className="mr-2" />
                    Back to Dashboard
                </button>
                <button
                    onClick={handleSave}
                    className="flex items-center px-6 py-2 bg-blue-600 text-white font-bold rounded-md hover:bg-blue-700"
                >
                    <Save size={18} className="mr-2" />
                    Save Changes
                </button>
             </header>
            <h1 className="text-3xl font-bold mb-2">Manage Profile</h1>
            <p className="text-gray-500 mb-6">Edit each section of your profile. Click 'Save Changes' when you're done.</p>
            
            <div className="bg-white p-4 sm:p-6 rounded-lg shadow-md space-y-2">
                <AccordionSection title="Profile Essentials" icon={User} startOpen={true}>
                    <ProfileEssentials 
                        formData={profileData}
                        setFormData={setProfileData}
                    />
                </AccordionSection>

                <AccordionSection title="Contact Information" icon={Mail}>
                    <ProfileContact 
                        formData={profileData}
                        setFormData={setProfileData}
                    />
                </AccordionSection>

                <AccordionSection title="Social Media Links" icon={LinkIcon}>
                    <ProfileSocials
                        formData={profileData}
                        setFormData={setProfileData}
                    />
                </AccordionSection>

                <AccordionSection title="Skills & Specialist Roles" icon={Star}>
                    <SkillsAndRolesSection 
                        profile={profile}
                        formData={profileData}
                        setFormData={setProfileData}
                        setActiveView={setActiveView}
                    />
                </AccordionSection>

                <AccordionSection title="Certifications" icon={Award}>
                    <ProfileCertifications
                        profile={profile}
                        formData={profileData}
                        setFormData={setProfileData}
                    />
                </AccordionSection>
                
                <AccordionSection title="Compliance Details" icon={ShieldCheck}>
                    <ProfileCompliance
                        formData={profileData}
                        setFormData={setProfileData}
                    />
                </AccordionSection>

                <AccordionSection title="Portfolio & Case Studies" icon={Briefcase}>
                    <ProfilePortfolio 
                        formData={profileData}
                        setFormData={setProfileData}
                    />
                </AccordionSection>
            </div>
        </div>
    );
};