import React from 'react';
import { EngineerProfile, Certification } from '../../types';
import { Plus, Trash2, FileText } from '../Icons';
import { FileUploadInput } from '../FileUploadInput';

interface ProfileCertificationsProps {
    formData: EngineerProfile;
    setFormData: React.Dispatch<React.SetStateAction<EngineerProfile>>;
}

const generateUniqueId = () => `doc-${Math.random().toString(36).substring(2, 10)}`;

export const ProfileCertifications = ({ formData, setFormData }: ProfileCertificationsProps) => {

    const certs = formData.certifications || [];

    const addCertification = () => {
        const newCert: Certification = { name: '', verified: false, documents: [] };
        setFormData(prev => ({ ...prev, certifications: [...(prev.certifications || []), newCert] }));
    };

    const removeCertification = (index: number) => {
        setFormData(prev => ({ ...prev, certifications: prev.certifications?.filter((_, i) => i !== index) }));
    };

    const handleCertChange = (index: number, field: keyof Certification, value: any) => {
        const newCerts = [...certs];
        (newCerts[index] as any)[field] = value;
        setFormData(prev => ({ ...prev, certifications: newCerts }));
    };

    const addDocument = (certIndex: number) => {
        const newCerts = [...certs];
        if (!newCerts[certIndex].documents) {
            newCerts[certIndex].documents = [];
        }
        newCerts[certIndex].documents!.push({ id: generateUniqueId(), name: 'New Document', url: '', verified: false });
        setFormData(prev => ({ ...prev, certifications: newCerts }));
    };
    
    const handleDocumentChange = (certIndex: number, docId: string, fileUrl: string) => {
        const newCerts = [...certs];
        const doc = newCerts[certIndex].documents?.find(d => d.id === docId);
        if (doc) {
            doc.url = fileUrl;
             // Extract filename from URL for display
            doc.name = fileUrl.split('/').pop() || 'document.pdf';
        }
        setFormData(prev => ({...prev, certifications: newCerts}));
    };


    return (
        <div className="space-y-4">
            <p className="text-sm text-gray-500">List your industry-relevant certifications. Uploading supporting documents can lead to a 'Verified' badge on your profile.</p>
            {certs.map((cert, index) => (
                <div key={index} className="p-3 border rounded-lg bg-gray-50/50 space-y-3">
                    <div className="flex items-center gap-2">
                        <input
                            type="text"
                            placeholder="Certification Name (e.g., CTS-I)"
                            value={cert.name}
                            onChange={e => handleCertChange(index, 'name', e.target.value)}
                            className="flex-grow border p-2 rounded"
                        />
                        <button type="button" onClick={() => removeCertification(index)} className="text-red-500 hover:text-red-700 p-2"><Trash2 size={18} /></button>
                    </div>
                    <div className="pl-4">
                        {cert.documents?.map(doc => (
                             <div key={doc.id} className="mt-2">
                                <FileUploadInput 
                                    label="Supporting Document"
                                    fileUrl={doc.url}
                                    isVerified={doc.verified}
                                    onFileChange={(url) => handleDocumentChange(index, doc.id, url)}
                                />
                            </div>
                        ))}
                        <button type="button" onClick={() => addDocument(index)} className="text-xs flex items-center text-blue-600 font-semibold hover:underline mt-2">
                            <FileText size={14} className="mr-1"/> Add Document
                        </button>
                    </div>
                </div>
            ))}

            <button
                type="button"
                onClick={addCertification}
                className="flex items-center text-blue-600 font-semibold hover:text-blue-800 pt-3 mt-3 border-t w-full"
            >
                <Plus size={18} className="mr-1" /> Add Certification
            </button>
        </div>
    );
};