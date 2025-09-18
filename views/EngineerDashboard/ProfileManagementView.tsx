import React, { useState } from 'react';
import { EngineerProfile } from '../../types';
import { useAppContext } from '../../context/InteractionContext';
import { Save, ArrowLeft, User, MessageCircle, ShieldCheck, Star, Briefcase, FileText } from '../../components/Icons';
import { AccordionSection } from '../../components/AccordionSection';
import { ProfileCompletionIndicator } from '../../components/ProfileCompletionIndicator';
import { ProfileEssentials } from '../../components/ProfileManagement/ProfileEssentials';
import { ProfileContact } from '../../components/ProfileManagement/ProfileContact';
import { ProfileCompliance } from '../../components/ProfileManagement/ProfileCompliance';
import { SkillsAndRolesSection } from '../../components/ProfileManagement/SkillsAndRolesSection';
import { ProfileCertifications } from '../../components/ProfileManagement/ProfileCertifications';
import { ProfilePortfolio } from '../../components/ProfileManagement/ProfilePortfolio';

interface ProfileManagementViewProps {
    profile: EngineerProfile;
    onSave: (updatedProfile: Partial<EngineerProfile>) => void;
    setActiveView: (view: string) => void;
}

export const ProfileManagementView = ({ profile, onSave, setActiveView }: ProfileManagementViewProps) => {
    const [formData, setFormData] = useState<EngineerProfile>(profile);

    const handleSave = () => {
        onSave(formData);
    };

    return (
        <div>
            <div className="flex flex-col sm:flex-row justify-between sm:items-center mb-4 gap-3">
                 <button 
                    onClick={() => setActiveView('Dashboard')} 
                    className="flex items-center px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 self-start"
                >
                    <ArrowLeft size={16} className="mr-2" />
                    Back to Dashboard
                </button>
                <h1 className="text-3xl font-bold order-first sm:order-none">Manage Profile</h1>
                <button
                    onClick={handleSave}
                    className="flex items-center justify-center px-6 py-2 bg-blue-600 text-white font-bold rounded-md hover:bg-blue-700"
                >
                    <Save size={18} className="mr-2" />
                    Save Changes
                </button>
            </div>

            <ProfileCompletionIndicator profile={formData} />

            <div className="bg-white p-6 rounded-lg shadow-md">
                <AccordionSection icon={User} title="Profile Essentials" startOpen>
                    <ProfileEssentials formData={formData} setFormData={setFormData} />
                </AccordionSection>
                 <AccordionSection icon={MessageCircle} title="Contact Information">
                    <ProfileContact formData={formData} setFormData={setFormData} />
                </AccordionSection>
                 <AccordionSection icon={ShieldCheck} title="Work Readiness & Compliance">
                    <ProfileCompliance formData={formData} setFormData={setFormData} />
                </AccordionSection>
                <AccordionSection icon={Star} title="Skills & Specialist Roles">
                    <SkillsAndRolesSection profile={profile} formData={formData} setFormData={setFormData} setActiveView={setActiveView} />
                </AccordionSection>
                <AccordionSection icon={FileText} title="Certifications">
                    <ProfileCertifications formData={formData} setFormData={setFormData} />
                </AccordionSection>
                <AccordionSection icon={Briefcase} title="Portfolio & Case Studies">
                    <ProfilePortfolio formData={formData} setFormData={setFormData} />
                </AccordionSection>
            </div>
        </div>
    );
};