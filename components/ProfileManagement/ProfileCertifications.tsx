import React from 'react';
import { EngineerProfile, ProfileTier } from '../../types/index.ts';
import { Plus, Trash2, CheckCircle } from '../Icons.tsx';

interface ProfileCertificationsProps {
    profile: EngineerProfile;
    formData: EngineerProfile;
    setFormData: React.Dispatch<React.SetStateAction<EngineerProfile>>;
}

export const ProfileCertifications = ({ profile, formData, setFormData }: ProfileCertificationsProps) => {
    const canVerifyCerts = profile.profileTier !== ProfileTier.BASIC;

    const addCertification = () => {
        setFormData(prev => ({ ...prev, certifications: [...(prev.certifications || []), { name: '', verified: false }] }));
    };

    const removeCertification = (index: number) => {
        setFormData(prev => ({ ...prev, certifications: prev.certifications?.filter((_, i) => i !== index) }));
    };

    const handleCertChange = (index: number, value: string) => {
        setFormData(prev => ({ ...prev, certifications: (prev.certifications || []).map((cert, i) => i === index ? { ...cert, name: value } : cert) }));
    };

    const handleVerifyClick = (index: number) => {
        // In a real app, this would trigger a verification flow. Here we just toggle it.
        setFormData(prev => ({ ...prev, certifications: (prev.certifications || []).map((cert, i) => i === index ? { ...cert, verified: !cert.verified } : cert) }));
    };

    return (
        <div className="space-y-3">
            {!canVerifyCerts && (
                <div className="text-center p-3 bg-yellow-50 border border-yellow-200 text-yellow-800 rounded-md text-sm">
                    Upgrade to a <strong>Silver Profile</strong> to get your certifications verified by our team.
                </div>
            )}
            {(formData.certifications || []).map((cert, index) => (
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
            <button type="button" onClick={addCertification} className="flex items-center text-blue-600 font-semibold hover:text-blue-800 pt-3 mt-3 border-t w-full">
                <Plus size={18} className="mr-1" /> Add Certification
            </button>
        </div>
    );
};
