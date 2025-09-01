import React from 'react';
import { IdentityVerification } from '../../types/index.ts';
import { SectionWrapper } from './SectionWrapper.tsx';
import { User } from '../Icons.tsx';
import { FileUploadInput } from '../FileUploadInput.tsx';

interface IdentitySectionProps {
    identityData: IdentityVerification;
    setIdentityData: React.Dispatch<React.SetStateAction<IdentityVerification>>;
}

export const IdentitySection = ({ identityData, setIdentityData }: IdentitySectionProps) => {

    const handleIdentityChange = (field: keyof IdentityVerification, value: any) => {
        setIdentityData(prev => ({ ...prev, [field]: value }));
    };

    return (
        <SectionWrapper title="Identity Verification" icon={User}>
            <p className="text-sm text-gray-500 mb-4">Verifying your identity helps build trust with companies and may be required for certain projects.</p>
            <div className="space-y-4">
                <div>
                    <label className="block font-medium mb-1">Type of ID</label>
                    <select 
                        value={identityData.documentType} 
                        onChange={e => handleIdentityChange('documentType', e.target.value)} 
                        className="w-full border p-2 rounded bg-white"
                    >
                        <option value="none">-- Select a document type --</option>
                        <option value="passport">Passport</option>
                        <option value="drivers_license">Driver's License</option>
                    </select>
                </div>
                {identityData.documentType !== 'none' && (
                     <div className="animate-fade-in-up">
                        <FileUploadInput 
                            label="Upload Document"
                            fileUrl={identityData.documentUrl}
                            isVerified={identityData.isVerified}
                            onFileChange={url => handleIdentityChange('documentUrl', url)}
                        />
                         <p className="text-xs text-gray-500 mt-2">Your ID will be securely stored and only used for verification purposes.</p>
                    </div>
                )}
            </div>
        </SectionWrapper>
    );
};