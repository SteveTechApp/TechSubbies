import React from 'react';
import { EngineerProfile, Currency, ProfileTier } from '../../types/index.ts';
import { X, Save, PoundSterling } from '../Icons.tsx';
import { CoreInfoSection } from './CoreInfoSection.tsx';
import { ContactSection } from './ContactSection.tsx';
import { WorkReadinessSection } from './WorkReadinessSection.tsx';
import { SkillsAndRolesSection } from './SkillsAndRolesSection.tsx';
import { PortfolioSection } from './PortfolioSection.tsx';
import { NotificationSettingsSection } from './NotificationSettingsSection.tsx';
import { CertificationsSection } from './CertificationsSection.tsx';
import { IdentitySection } from './IdentitySection.tsx';

type EditableSection = 'essentials' | 'skills' | 'compliance' | 'notifications' | null;

interface EditProfileSectionModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: () => void;
    section: EditableSection;
    profile: EngineerProfile;
    setProfileData: React.Dispatch<React.SetStateAction<EngineerProfile>>;
    setActiveView: (view: string) => void;
}

const SECTION_TITLES: Record<NonNullable<EditableSection>, string> = {
    essentials: 'Profile Essentials',
    skills: 'Skills & Portfolio',
    compliance: 'Compliance & Verification',
    notifications: 'Notification Settings',
};

export const EditProfileSectionModal = ({ isOpen, onClose, onSave, section, profile, setProfileData, setActiveView }: EditProfileSectionModalProps) => {
    if (!isOpen || !section) return null;

    const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;
        let processedValue: any = value;
        if (type === 'checkbox') processedValue = (e.target as HTMLInputElement).checked;
        else if (['experience', 'minDayRate', 'maxDayRate'].includes(name)) processedValue = parseInt(value, 10) || 0;
        setProfileData(prev => ({ ...prev, [name]: processedValue }));
    };

    const handleContactChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setProfileData(prev => ({ ...prev, contact: { ...prev.contact, [e.target.name]: e.target.value } }));
    };

    const handleComplianceChange = (updatedCompliance: any) => {
        setProfileData(prev => ({ ...prev, compliance: updatedCompliance }));
    }

    const handleIdentityChange = (updatedIdentity: any) => {
        setProfileData(prev => ({ ...prev, identity: updatedIdentity }));
    }

    const renderSectionContent = () => {
        switch (section) {
            case 'essentials':
                return (
                    <div className="space-y-6">
                        <CoreInfoSection formData={profile} onProfileChange={handleProfileChange} />
                        <ContactSection contactData={profile.contact} onContactChange={handleContactChange} />
                        <div>
                            <h3 className="text-xl font-bold mb-3">Day Rate</h3>
                            <div className="flex gap-4">
                                <div className="w-1/3"><label className="block text-sm font-medium text-gray-500">Currency</label><select name="currency" value={profile.currency} onChange={handleProfileChange} className="w-full border p-2 rounded bg-white h-[42px]"><option value={Currency.GBP}>GBP (£)</option><option value={Currency.USD}>USD ($)</option></select></div>
                                <div className="w-1/3"><label className="block text-sm font-medium text-gray-500">Minimum</label><input type="number" name="minDayRate" value={profile.minDayRate || ''} step="5" onChange={handleProfileChange} className="w-full border p-2 rounded" /></div>
                                <div className="w-1/3"><label className="block text-sm font-medium text-gray-500">Maximum</label><input type="number" name="maxDayRate" value={profile.maxDayRate || ''} step="5" onChange={handleProfileChange} max={profile.profileTier === ProfileTier.BASIC ? 195 : undefined} className="w-full border p-2 rounded" /></div>
                            </div>
                        </div>
                    </div>
                );
            case 'skills':
                return (
                    <div className="space-y-6">
                        <SkillsAndRolesSection profile={profile} formData={profile} setFormData={setProfileData} setActiveView={setActiveView} />
                        <CertificationsSection profile={profile} formData={profile} setFormData={setProfileData} setActiveView={setActiveView} />
                        <PortfolioSection profile={profile} formData={profile} setFormData={setProfileData} setActiveView={setActiveView} />
                    </div>
                );
            case 'compliance':
                 return (
                    <div className="space-y-6">
                        <WorkReadinessSection complianceData={profile.compliance} setComplianceData={handleComplianceChange} />
                        <IdentitySection identityData={profile.identity} setIdentityData={handleIdentityChange} />
                    </div>
                 );
            case 'notifications':
                return <NotificationSettingsSection profile={profile} formData={profile} onProfileChange={handleProfileChange} />;
            default:
                return null;
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50 p-4" onClick={onClose}>
            <div className="bg-white rounded-lg m-4 max-w-4xl w-full relative transform transition-all duration-300 max-h-[90vh] flex flex-col" onClick={e => e.stopPropagation()}>
                <div className="flex-shrink-0 p-6 border-b flex justify-between items-center">
                    <h2 className="text-2xl font-bold">{SECTION_TITLES[section]}</h2>
                    <button onClick={onClose} className="text-gray-500 hover:text-gray-800"><X size={24} /></button>
                </div>
                
                <div className="flex-grow overflow-y-auto custom-scrollbar p-6">
                    {renderSectionContent()}
                </div>
                
                <div className="flex-shrink-0 flex justify-end space-x-4 p-6 border-t bg-gray-50 rounded-b-lg">
                    <button onClick={onClose} className="px-6 py-2 bg-gray-200 rounded-md hover:bg-gray-300">Cancel</button>
                    <button 
                        onClick={onSave}
                        className="flex items-center px-6 py-2 bg-blue-600 text-white font-bold rounded-md hover:bg-blue-700"
                    >
                        <Save size={18} className="mr-2" />
                        Save & Close
                    </button>
                </div>
            </div>
        </div>
    );
};