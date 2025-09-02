import React from 'react';
import { EngineerProfile, ProfileTier } from '../../types/index.ts';
import { Plus, Trash2, CheckCircle } from '../Icons.tsx';

interface CertificationsSectionProps {
    profile: EngineerProfile;
    formData: Partial<EngineerProfile>;
    setFormData: React.Dispatch<React.SetStateAction<Partial<EngineerProfile>>>;
    setActiveView: (view: string) => void;
}

export const CertificationsSection = ({ profile, formData, setFormData, setActiveView }: CertificationsSectionProps) => {
    
    const canVerify = profile.profileTier !== ProfileTier.BASIC;
    const certifications = formData.certifications || [];

    const addCertification = () => {
        setFormData(prev => ({ ...prev, certifications: [...(prev.certifications || []), { name: '', verified: false }] }));
    };

    const removeCertification = (index: number) => {
        setFormData(prev => ({ ...prev, certifications: prev.certifications?.filter((_, i) => i !== index) }));
    };

    const handleCertChange = (index: number, value: string) => {
        setFormData(prev => ({ ...prev, certifications: prev.certifications?.map((cert, i) => i === index ? { ...cert, name: value } : cert) }));
    };

    const handleVerifyClick = (index: number) => {
        setFormData(prev => ({ ...prev, certifications: prev.certifications?.map((cert, i) => i === index ? { ...cert, verified: true } : cert) }));
    };

    return (
        <div>
            {!canVerify && (
                 <div className="text-center p-4 bg-gray-100 rounded-lg border-2 border-dashed mb-4">
                    <p className="text-gray-600">Upgrade to a "Professional" profile to get your certifications verified.</p>
                    <button type="button" onClick={() => setActiveView('Billing')} className="mt-2 text-blue-600 font-bold hover:underline">Upgrade Now</button>
                </div>
            )}
            <div className="space-y-3">
                {certifications.map((cert, index) => (
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
                                disabled={!canVerify}
                                onClick={() => handleVerifyClick(index)}
                                className="px-3 py-2 bg-blue-100 text-blue-700 font-semibold rounded-md text-sm hover:bg-blue-200 disabled:bg-gray-200 disabled:text-gray-400 disabled:cursor-not-allowed"
                            >
                                Verify
                            </button>
                        )}
                        <button type="button" onClick={() => removeCertification(index)} className="text-red-500 hover:text-red-700 p-2"><Trash2 size={18} /></button>
                    </div>
                ))}
            </div>
            <button type="button" onClick={addCertification} className="flex items-center text-blue-600 font-semibold hover:text-blue-800 pt-3 mt-3 border-t w-full">
                <Plus size={18} className="mr-1" /> Add Certification
            </button>
        </div>
    );
};