import React, { useState } from 'react';
import { EngineerProfile, ProfileTier } from '../../types';
import { ArrowLeft, User, Star, Award, Briefcase, Save, Mail, Link as LinkIcon, ShieldCheck, FileText, Upload, Trash2 } from '../../components/Icons';
import { AccordionSection } from '../../components/AccordionSection';
import { SkillsAndRolesSection } from '../../components/ProfileManagement/SkillsAndRolesSection';
import { ProfileEssentials } from '../../components/ProfileManagement/ProfileEssentials';
import { ProfileCertifications } from '../../components/ProfileManagement/ProfileCertifications';
import { ProfilePortfolio } from '../../components/ProfileManagement/ProfilePortfolio';
import { ProfileContact } from '../../components/ProfileManagement/ProfileContact';
import { ProfileSocials } from '../../components/ProfileManagement/ProfileSocials';
import { ProfileCompliance } from '../../components/ProfileManagement/ProfileCompliance';
import { ProfileCompletionIndicator } from '../../components/ProfileCompletionIndicator';

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
    
    const handleCVUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setProfileData(prev => ({
                ...prev,
                cv: {
                    fileName: file.name,
                    fileUrl: `/mock-cv/${file.name.replace(/\s/g, '_')}`, // Mocked URL
                    isSearchable: prev.profileTier !== ProfileTier.BASIC
                }
            }));
        }
    };

    const handleRemoveCV = () => {
        setProfileData(prev => {
            const { cv, ...rest } = prev;
            return rest as EngineerProfile;
        });
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
            
            <ProfileCompletionIndicator profile={profile} />
            
            <div className="bg-white p-4 sm:p-6 rounded-lg shadow-md md:grid md:grid-cols-2 md:gap-x-8">
                <div className="md:col-span-2">
                    <AccordionSection title="Profile Essentials" icon={User} startOpen={true}>
                        <ProfileEssentials 
                            formData={profileData}
                            setFormData={setProfileData}
                        />
                    </AccordionSection>
                </div>
                
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

                <div className="md:col-span-2">
                     <AccordionSection title="CV / Resume" icon={FileText}>
                        <div className="space-y-4">
                            <p className="text-sm text-gray-500">Upload your latest CV or resume. While all members can upload a file, only members with a Silver Profile or higher will have their CV made searchable to clients.</p>
                            {profileData.cv ? (
                                <div className="flex items-center justify-between p-3 bg-gray-100 rounded-md border">
                                    <div className="flex items-center gap-3">
                                        <FileText size={20} className="text-blue-600" />
                                        <span className="font-semibold">{profileData.cv.fileName}</span>
                                    </div>
                                    <button type="button" onClick={handleRemoveCV} className="px-3 py-1.5 text-sm bg-red-100 text-red-700 rounded-md hover:bg-red-200 font-semibold flex items-center gap-2">
                                        <Trash2 size={14} /> Remove
                                    </button>
                                </div>
                            ) : (
                                <div className="relative">
                                    <button
                                        type="button"
                                        onClick={() => document.getElementById('cv-upload-input')?.click()}
                                        className="w-full flex items-center justify-center py-4 border-2 border-dashed rounded-md text-gray-500 hover:border-blue-500 hover:text-blue-600"
                                    >
                                        <Upload size={20} className="mr-2" /> Upload CV
                                    </button>
                                    <input
                                        id="cv-upload-input"
                                        type="file"
                                        accept=".pdf,.doc,.docx"
                                        className="sr-only"
                                        onChange={handleCVUpload}
                                    />
                                </div>
                            )}
                            {profile.profileTier === ProfileTier.BASIC && (
                                <div className="text-center p-3 bg-yellow-50 border border-yellow-200 text-yellow-800 rounded-md text-sm">
                                    Upgrade to a <strong>Silver Profile</strong> to make your CV searchable and appear in more client searches.
                                </div>
                            )}
                        </div>
                    </AccordionSection>
                </div>

                <div className="md:col-span-2">
                    <AccordionSection title="Skills & Specialist Roles" icon={Star}>
                        <SkillsAndRolesSection 
                            profile={profile}
                            formData={profileData}
                            setFormData={setProfileData}
                            setActiveView={setActiveView}
                        />
                    </AccordionSection>
                </div>

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

                <div className="md:col-span-2">
                    <AccordionSection title="Portfolio & Case Studies" icon={Briefcase}>
                        <ProfilePortfolio 
                            formData={profileData}
                            setFormData={setProfileData}
                        />
                    </AccordionSection>
                </div>
            </div>
        </div>
    );
};