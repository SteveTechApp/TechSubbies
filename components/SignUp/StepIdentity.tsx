import React from 'react';
import { IdentityVerification } from '../../types/index.ts';
import { FileUploadInput } from '../FileUploadInput.tsx';

interface StepIdentityProps {
    data: IdentityVerification;
    setData: React.Dispatch<React.SetStateAction<any>>;
}

export const StepIdentity = ({ data, setData }: StepIdentityProps) => {

    const handleIdentityChange = (field: keyof IdentityVerification, value: any) => {
        setData((prev: any) => ({
            ...prev,
            identity: {
                ...prev.identity,
                [field]: value
            }
        }));
    };

    return (
        <div className="fade-in-up">
            <h2 className="text-xl font-semibold mb-4">Step 3: Identity Verification</h2>
            <p className="text-sm text-gray-500 mb-4">Uploading a form of ID helps verify your profile and builds trust with companies. This is optional but highly recommended.</p>
            
            <div className="space-y-4 p-4 border rounded-lg bg-gray-50">
                <div>
                    <label className="block font-medium mb-1">Type of ID</label>
                     <select 
                        value={data.documentType} 
                        onChange={e => handleIdentityChange('documentType', e.target.value)} 
                        className="w-full border p-2 rounded bg-white"
                    >
                        <option value="none">-- Select a document type --</option>
                        <option value="passport">Passport</option>
                        <option value="drivers_license">Driver's License</option>
                    </select>
                </div>
                {data.documentType !== 'none' && (
                    <div className="animate-fade-in-up">
                        <FileUploadInput 
                            label="Upload Document"
                            fileUrl={data.documentUrl}
                            isVerified={data.isVerified}
                            onFileChange={url => handleIdentityChange('documentUrl', url)}
                        />
                         <p className="text-xs text-gray-500 mt-2">Your ID will be securely stored and only used for verification purposes.</p>
                    </div>
                )}
            </div>
        </div>
    );
};