import React, { useState } from 'react';
import { EngineerProfile, ProfileTier, Certification, CaseStudy } from '../../types/index.ts';
import { ArrowLeft, User, Briefcase, ShieldCheck, Mail, Award, Image, Save, Plus, Trash2, CheckCircle, Star } from '../../components/Icons.tsx';
import { AccordionSection } from '../../components/AccordionSection.tsx';
import { SkillsAndRolesSection } from '../../components/ProfileManagement/SkillsAndRolesSection.tsx';

interface ProfileManagementViewProps {
    profile: EngineerProfile;
    onSave: (updatedProfile: Partial<EngineerProfile>) => void;
    setActiveView: (view: string) => void;
}

const generateUniqueId = () => `id-${Math.random().toString(36).substring(2, 10)}`;

export const ProfileManagementView = ({ profile, onSave, setActiveView }: ProfileManagementViewProps) => {
    const [profileData, setProfileData] = useState<EngineerProfile>(profile);

    const handleDataChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setProfileData(prev => ({ ...prev, [name]: value }));
    };

    const handleSave = () => {
        onSave(profileData);
        alert('Profile changes saved!');
    };
    
    // --- Certification Handlers ---
    const addCertification = () => {
        setProfileData(prev => ({ ...prev, certifications: [...(prev.certifications || []), { name: '', verified: false }] }));
    };
    const removeCertification = (index: number) => {
        setProfileData(prev => ({ ...prev, certifications: prev.certifications?.filter((_, i) => i !== index) }));
    };
    const handleCertChange = (index: number, value: string) => {
        setProfileData(prev => ({ ...prev, certifications: prev.certifications?.map((cert, i) => i === index ? { ...cert, name: value } : cert) }));
    };
     const handleVerifyClick = (index: number) => {
        // In a real app, this would trigger a verification flow. Here we just toggle it.
        setProfileData(prev => ({ ...prev, certifications: prev.certifications?.map((cert, i) => i === index ? { ...cert, verified: !cert.verified } : cert) }));
    };

    // --- Portfolio Handlers ---
    const addCaseStudy = () => {
        setProfileData(prev => ({...prev, caseStudies: [...(prev.caseStudies || []), { id: generateUniqueId(), name: 'New Project', url: 'https://' }]}));
    };
    const removeCaseStudy = (id: string) => {
        setProfileData(prev => ({ ...prev, caseStudies: prev.caseStudies?.filter(cs => cs.id !== id) }));
    };
    const handleCaseStudyChange = (id: string, field: 'name' | 'url', value: string) => {
        setProfileData(prev => ({ ...prev, caseStudies: prev.caseStudies?.map(cs => cs.id === id ? { ...cs, [field]: value } : cs) }));
    };
    
    const canVerifyCerts = profile.profileTier !== ProfileTier.BASIC;


    return (
        <div>
             <div className="flex justify-between items-center mb-4">
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
             </div>
            <h1 className="text-3xl font-bold mb-2">Manage Profile</h1>
            <p className="text-gray-500 mb-6">Edit each section of your profile. Click 'Save Changes' when you're done.</p>
            
            <div className="bg-white p-4 sm:p-6 rounded-lg shadow-md space-y-2">
                <AccordionSection title="Profile Essentials" icon={User} startOpen={true}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block font-medium mb-1 text-sm">Full Name</label>
                            <input type="text" name="name" value={profileData.name || ''} onChange={handleDataChange} className="w-full border p-2 rounded" />
                        </div>
                         <div>
                            <label className="block font-medium mb-1 text-sm">Location</label>
                            <input type="text" name="location" value={profileData.location || ''} onChange={handleDataChange} className="w-full border p-2 rounded" />
                        </div>
                    </div>
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
                    <div className="space-y-3">
                        {!canVerifyCerts && (
                            <div className="text-center p-3 bg-yellow-50 border border-yellow-200 text-yellow-800 rounded-md text-sm">
                                Upgrade to a <strong>Professional Profile</strong> to get your certifications verified by our team.
                            </div>
                        )}
                        {profileData.certifications?.map((cert, index) => (
                            <div key={index} className="flex items-center gap-2">
                                <input
                                    type="text"
                                    placeholder="e.g., Crestron Certified Programmer"
                                    value={cert.name}
                                    onChange={e => handleCertChange(index, e.target.value)}
                                    className="flex-grow border p-2 rounded"
                                />
                                {cert.verified ? (
                                    <span className="flex items-center px-3 py-2 bg-green-100 text-green-700 font-semibold rounded-md text-sm">
                                        <CheckCircle size={16} className="mr-1.5" /> Verified
                                    </span>
                                ) : (
                                    <button
                                        type="button"
                                        disabled={!canVerifyCerts}
                                        onClick={() => handleVerifyClick(index)}
                                        className="px-3 py-2 bg-blue-100 text-blue-700 font-semibold rounded-md text-sm hover:bg-blue-200 disabled:bg-gray-200 disabled:text-gray-400 disabled:cursor-not-allowed"
                                    >
                                        {canVerifyCerts ? 'Request Verification' : 'Verification Disabled'}
                                    </button>
                                )}
                                <button type="button" onClick={() => removeCertification(index)} className="text-red-500 hover:text-red-700 p-2"><Trash2 size={18} /></button>
                            </div>
                        ))}
                    </div>
                     <button type="button" onClick={addCertification} className="flex items-center text-blue-600 font-semibold hover:text-blue-800 pt-3 mt-3 border-t w-full">
                        <Plus size={18} className="mr-1" /> Add Certification
                    </button>
                </AccordionSection>

                <AccordionSection title="Portfolio & Case Studies" icon={Briefcase}>
                     <div className="space-y-4">
                        {profileData.caseStudies?.map(cs => (
                            <div key={cs.id} className="flex items-center gap-2">
                                <input type="text" placeholder="Project Name" value={cs.name} onChange={e => handleCaseStudyChange(cs.id, 'name', e.target.value)} className="w-1/3 border p-2 rounded" />
                                <input type="text" placeholder="https://example.com/project" value={cs.url} onChange={e => handleCaseStudyChange(cs.id, 'url', e.target.value)} className="w-2/3 border p-2 rounded" />
                                <button type="button" onClick={() => removeCaseStudy(cs.id)} className="text-red-500 hover:text-red-700 p-2"><Trash2 size={18} /></button>
                            </div>
                        ))}
                    </div>
                    <button type="button" onClick={addCaseStudy} className="flex items-center text-blue-600 font-semibold hover:text-blue-800 pt-3 mt-3 border-t w-full">
                        <Plus size={18} className="mr-1" /> Add Case Study
                    </button>
                </AccordionSection>
            </div>
        </div>
    );
};
