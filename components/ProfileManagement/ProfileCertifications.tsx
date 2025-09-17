import React from 'react';
import { EngineerProfile, ProfileTier, CertificationDocument } from '../../types';
import { Plus, Trash2, CheckCircle, Upload, FileText } from '../Icons';

interface ProfileCertificationsProps {
    profile: EngineerProfile;
    formData: EngineerProfile;
    setFormData: React.Dispatch<React.SetStateAction<EngineerProfile>>;
}

export const ProfileCertifications = ({ profile, formData, setFormData }: ProfileCertificationsProps) => {
    const canVerifyCerts = profile.profileTier !== ProfileTier.BASIC;

    const addCertification = () => {
        setFormData(prev => ({ ...prev, certifications: [...(prev.certifications || []), { name: '', verified: false, documents: [] }] }));
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
    
    const handleAddDocument = (certIndex: number) => {
        const newDoc: CertificationDocument = {
            id: `doc-${Date.now()}`,
            name: `document_${Date.now()}.pdf`, // Mock file name
            url: '#',
            verified: false,
        };
        setFormData(prev => {
            const certs = [...(prev.certifications || [])];
            const currentDocs = certs[certIndex].documents || [];
            certs[certIndex] = { ...certs[certIndex], documents: [...currentDocs, newDoc] };
            return { ...prev, certifications: certs };
        });
    };
    
    const handleRemoveDocument = (certIndex: number, docId: string) => {
        setFormData(prev => {
            const certs = [...(prev.certifications || [])];
            const currentDocs = certs[certIndex].documents || [];
            certs[certIndex] = { ...certs[certIndex], documents: currentDocs.filter(d => d.id !== docId) };
            return { ...prev, certifications: certs };
        });
    };

    return (
        <div className="space-y-3">
            {!canVerifyCerts && (
                <div className="text-center p-3 bg-yellow-50 border border-yellow-200 text-yellow-800 rounded-md text-sm">
                    Upgrade to a <strong>Silver Profile</strong> to get your certifications verified by our team.
                </div>
            )}
            {(formData.certifications || []).map((cert, index) => (
                <div key={index} className="p-3 border rounded-md bg-gray-50/50 space-y-3">
                    <div className="flex items-center gap-2">
                        <input
                            type="text"
                            placeholder="e.g., Crestron Certified Programmer"
                            value={cert.name}
                            onChange={e => handleCertChange(index, e.target.value)}
                            className="flex-grow border p-2 rounded"
                        />
                        {cert.verified ? (
                            <span className="flex items-center px-3 py-2 bg-green-100 text-green-700 font-semibold rounded-md text-sm whitespace-nowrap">
                                <CheckCircle size={16} className="mr-1.5" /> Verified
                            </span>
                        ) : (
                            <button
                                type="button"
                                disabled={!canVerifyCerts}
                                onClick={() => handleVerifyClick(index)}
                                className="px-3 py-2 bg-blue-100 text-blue-700 font-semibold rounded-md text-sm hover:bg-blue-200 disabled:bg-gray-200 disabled:text-gray-400 disabled:cursor-not-allowed whitespace-nowrap"
                            >
                                {canVerifyCerts ? 'Mark as Verified' : 'Verification Disabled'}
                            </button>
                        )}
                        <button type="button" onClick={() => removeCertification(index)} className="text-red-500 hover:text-red-700 p-2"><Trash2 size={18} /></button>
                    </div>
                    
                    <div>
                        <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Verification Documents</h4>
                        {(cert.documents || []).map(doc => (
                            <div key={doc.id} className="flex items-center gap-2 text-sm bg-white p-1.5 rounded-md border mb-1">
                                <FileText size={14} className="text-gray-500 flex-shrink-0" />
                                <span className="flex-grow truncate">{doc.name}</span>
                                <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${doc.verified ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                                    {doc.verified ? 'Verified' : 'Pending'}
                                </span>
                                <button type="button" onClick={() => handleRemoveDocument(index, doc.id)} className="text-red-500 hover:text-red-700"><Trash2 size={14} /></button>
                            </div>
                        ))}
                        <button
                            type="button"
                            onClick={() => handleAddDocument(index)}
                            className="w-full flex items-center justify-center text-sm mt-1 px-3 py-2 border-2 border-dashed border-gray-300 text-gray-500 rounded-md hover:border-blue-500 hover:text-blue-600 transition-colors"
                        >
                            <Upload size={16} className="mr-2" />
                            Upload Document
                        </button>
                    </div>
                </div>
            ))}
            <button type="button" onClick={addCertification} className="flex items-center text-blue-600 font-semibold hover:text-blue-800 pt-3 mt-3 border-t w-full">
                <Plus size={18} className="mr-1" /> Add Certification
            </button>
        </div>
    );
};