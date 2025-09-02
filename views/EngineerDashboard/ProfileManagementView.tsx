import React, { useState, useCallback } from 'react';
import { EngineerProfile, ProfileTier } from '../../types/index.ts';
import { ArrowLeft, User, Briefcase, ShieldCheck, Mail } from '../../components/Icons.tsx';
import { ProfileSectionPanel } from '../../components/ProfileManagement/ProfileSectionPanel.tsx';
import { EditProfileSectionModal } from '../../components/ProfileManagement/EditProfileSectionModal.tsx';
import { formatDisplayDate } from '../../utils/dateFormatter.ts';

interface ProfileManagementViewProps {
    profile: EngineerProfile;
    onSave: (updatedProfile: Partial<EngineerProfile>) => void;
    setActiveView: (view: string) => void;
}

type EditableSection = 'essentials' | 'skills' | 'compliance' | 'notifications' | null;

const calculateProfileStrength = (profile: Partial<EngineerProfile>): number => {
    let score = 10;
    if (profile.description && profile.description.length > 50) score += 15;
    if (profile.contact?.phone && profile.contact?.linkedin) score += 10;
    if (profile.compliance?.professionalIndemnity?.hasCoverage && profile.compliance?.publicLiability?.hasCoverage) score += 15;
    if (profile.identity?.isVerified) score += 10;
    if (profile.certifications && profile.certifications.length > 0) score += 10;
    if (profile.selectedJobRoles && profile.selectedJobRoles.length > 0) score += 20;
    if (profile.caseStudies && profile.caseStudies.length > 0) score += 10;
    return Math.min(100, score);
};


export const ProfileManagementView = ({ profile, onSave, setActiveView }: ProfileManagementViewProps) => {
    const [editingSection, setEditingSection] = useState<EditableSection>(null);
    const [profileData, setProfileData] = useState<EngineerProfile>(profile);
    
    const profileStrength = calculateProfileStrength(profileData);

    const handleDataChange = (updatedData: Partial<EngineerProfile>) => {
        setProfileData(prev => ({ ...prev, ...updatedData }));
    };

    const handleSaveAndClose = () => {
        onSave(profileData);
        setEditingSection(null);
    };

    const renderSummary = (section: EditableSection) => {
        switch(section) {
            case 'essentials':
                return (
                    <div className="text-sm text-gray-600 space-y-1">
                        <p><strong>Name:</strong> {profileData.name}</p>
                        <p><strong>Discipline:</strong> {profileData.discipline}</p>
                        <p><strong>Rate:</strong> {profileData.currency}{profileData.minDayRate} - {profileData.currency}{profileData.maxDayRate}</p>
                    </div>
                );
            case 'skills':
                 return (
                    <div className="text-sm text-gray-600 space-y-1">
                        <p><strong>Specialist Roles:</strong> {profileData.selectedJobRoles?.length || 0}</p>
                        <p><strong>Certifications:</strong> {profileData.certifications?.length || 0}</p>
                        <p><strong>Portfolio Items:</strong> {profileData.caseStudies?.length || 0}</p>
                    </div>
                );
            case 'compliance':
                 return (
                    <div className="text-sm text-gray-600 space-y-1">
                        <p><strong>Insurance:</strong> {profileData.compliance?.professionalIndemnity?.hasCoverage && profileData.compliance?.publicLiability?.hasCoverage ? "Active" : "Incomplete"}</p>
                        <p><strong>ID Verified:</strong> {profileData.identity?.isVerified ? "Yes" : "No"}</p>
                    </div>
                );
            case 'notifications':
                 return (
                    <div className="text-sm text-gray-600 space-y-1">
                        <p><strong>Weekly Digest:</strong> {profileData.jobDigestOptIn ? "Enabled" : "Disabled"}</p>
                    </div>
                );
            default:
                return null;
        }
    };

    return (
        <div>
             <button 
                type="button"
                onClick={() => setActiveView('Dashboard')} 
                className="flex items-center mb-4 px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300"
            >
                <ArrowLeft size={16} className="mr-2" />
                Back to Dashboard
            </button>
            <h1 className="text-3xl font-bold mb-2">Manage Profile Hub</h1>
            <p className="text-gray-500 mb-6">Edit each section of your profile. Your changes are saved automatically.</p>
            
             {/* Profile Strength Meter */}
            <div className="mb-6 bg-white p-5 rounded-lg shadow">
                <h3 className="font-bold text-lg mb-2">Profile Strength</h3>
                <div className="flex items-center gap-4">
                    <div className="w-full bg-gray-200 rounded-full h-4">
                        <div className="bg-green-500 h-4 rounded-full transition-all duration-500" style={{ width: `${profileStrength}%` }}></div>
                    </div>
                    <span className="font-bold text-green-600 text-lg">{profileStrength}%</span>
                </div>
                <p className="text-xs text-gray-500 mt-2">A complete profile attracts more high-quality job offers. Aim for 100%!</p>
            </div>

            {/* Profile Section Panels */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <ProfileSectionPanel title="Profile Essentials" icon={User} onEdit={() => setEditingSection('essentials')}>
                    {renderSummary('essentials')}
                </ProfileSectionPanel>
                <ProfileSectionPanel title="Skills & Portfolio" icon={Briefcase} onEdit={() => setEditingSection('skills')}>
                    {renderSummary('skills')}
                </ProfileSectionPanel>
                <ProfileSectionPanel title="Compliance & Verification" icon={ShieldCheck} onEdit={() => setEditingSection('compliance')}>
                    {renderSummary('compliance')}
                </ProfileSectionPanel>
                <ProfileSectionPanel title="Notification Settings" icon={Mail} onEdit={() => setEditingSection('notifications')}>
                    {renderSummary('notifications')}
                </ProfileSectionPanel>
            </div>
            
            {editingSection && (
                <EditProfileSectionModal
                    isOpen={!!editingSection}
                    onClose={() => setEditingSection(null)}
                    onSave={handleSaveAndClose}
                    section={editingSection}
                    profile={profileData}
                    setProfileData={setProfileData}
                    setActiveView={setActiveView}
                />
            )}
        </div>
    );
};