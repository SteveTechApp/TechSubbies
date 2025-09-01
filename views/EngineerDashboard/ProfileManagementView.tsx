import React, { useState, useEffect, useRef, useCallback } from 'react';
import { EngineerProfile } from '../../types/index.ts';
import { ArrowLeft, Save, Loader, CheckCircle } from '../../components/Icons.tsx';
import { CoreInfoSection } from '../../components/ProfileManagement/CoreInfoSection.tsx';
import { ContactSection } from '../../components/ProfileManagement/ContactSection.tsx';
import { WorkReadinessSection } from '../../components/ProfileManagement/WorkReadinessSection.tsx';
import { SkillsAndRolesSection } from '../../components/ProfileManagement/SkillsAndRolesSection.tsx';
import { PortfolioSection } from '../../components/ProfileManagement/PortfolioSection.tsx';
import { NotificationSettingsSection } from '../../components/ProfileManagement/NotificationSettingsSection.tsx';
import { CertificationsSection } from '../../components/ProfileManagement/CertificationsSection.tsx';
import { IdentitySection } from '../../components/ProfileManagement/IdentitySection.tsx';

interface ProfileManagementViewProps {
    profile: EngineerProfile;
    onSave: (updatedProfile: Partial<EngineerProfile>) => void;
    setActiveView: (view: string) => void;
}

type SaveStatus = 'unsaved' | 'saving' | 'saved';

const SaveStatusIndicator = ({ status }: { status: SaveStatus }) => {
    switch (status) {
        case 'saving':
            return <div className="flex items-center text-sm text-gray-500"><Loader className="animate-spin w-4 h-4 mr-2" /> Saving...</div>;
        case 'saved':
            return <div className="flex items-center text-sm text-green-600"><CheckCircle className="w-4 h-4 mr-2" /> All changes saved</div>;
        case 'unsaved':
            return <div className="flex items-center text-sm text-yellow-600">Unsaved changes</div>;
        default:
            return null;
    }
};

export const ProfileManagementView = ({ profile, onSave, setActiveView }: ProfileManagementViewProps) => {
    const [formData, setFormData] = useState<Partial<EngineerProfile>>(profile);
    const [contactData, setContactData] = useState(profile.contact);
    const [complianceData, setComplianceData] = useState(profile.compliance);
    const [identityData, setIdentityData] = useState(profile.identity);

    const [saveStatus, setSaveStatus] = useState<SaveStatus>('saved');
    const debounceTimeout = useRef<number | null>(null);
    const isInitialMount = useRef(true);

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
    
    const handleSaveChanges = useCallback(() => {
        setSaveStatus('saving');
        onSave({
            ...formData,
            contact: contactData,
            compliance: complianceData,
            identity: identityData,
        });
        setTimeout(() => {
            setSaveStatus('saved');
        }, 500);
    }, [onSave, formData, contactData, complianceData, identityData]);

    useEffect(() => {
        if (isInitialMount.current) {
            isInitialMount.current = false;
            return;
        }

        setSaveStatus('unsaved');

        if (debounceTimeout.current) {
            clearTimeout(debounceTimeout.current);
        }

        debounceTimeout.current = window.setTimeout(() => {
            handleSaveChanges();
        }, 2500);

        return () => {
            if (debounceTimeout.current) {
                clearTimeout(debounceTimeout.current);
            }
        };
    }, [formData, contactData, complianceData, identityData, handleSaveChanges]);

    const handleManualSave = (e: React.FormEvent) => {
        e.preventDefault();
        if (debounceTimeout.current) {
            clearTimeout(debounceTimeout.current);
        }
        handleSaveChanges();
    };

    return (
        <form onSubmit={handleManualSave}>
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
                <div className="flex items-center gap-4">
                    <SaveStatusIndicator status={saveStatus} />
                    <button 
                        type="submit"
                        className="flex items-center px-6 py-3 bg-green-600 text-white font-bold rounded-lg hover:bg-green-700 text-lg disabled:bg-green-300"
                        disabled={saveStatus === 'saving'}
                    >
                        <Save size={20} className="mr-2"/>
                        Save All Changes
                    </button>
                </div>
            </div>
            
            <div className="space-y-6">
                <CoreInfoSection formData={formData} onProfileChange={handleProfileChange} />
                <ContactSection contactData={contactData} onContactChange={handleContactChange} />
                <WorkReadinessSection complianceData={complianceData} setComplianceData={setComplianceData} />
                <IdentitySection identityData={identityData} setIdentityData={setIdentityData} />
                <NotificationSettingsSection profile={profile} formData={formData} onProfileChange={handleProfileChange} />
                <CertificationsSection profile={profile} formData={formData} setFormData={setFormData} setActiveView={setActiveView} />
                <SkillsAndRolesSection profile={profile} formData={formData} setFormData={setFormData} setActiveView={setActiveView} />
                <PortfolioSection profile={profile} formData={formData} setFormData={setFormData} setActiveView={setActiveView} />
            </div>
        </form>
    );
};