import React from 'react';
import { Compliance } from '../../types';
import { FileUploadInput } from '../FileUploadInput';
import { CompetencySlider } from '../CompetencySlider';

interface StepWorkReadinessProps {
    data: Compliance;
    setData: React.Dispatch<React.SetStateAction<any>>;
}

export const StepWorkReadiness = ({ data, setData }: StepWorkReadinessProps) => {

    const handleComplianceChange = (field: keyof Compliance, value: any) => {
        setData((prev: any) => ({
            ...prev,
            compliance: {
                ...prev.compliance,
                [field]: value
            }
        }));
    };

    const handleInsuranceChange = (field: 'professionalIndemnity' | 'publicLiability', subField: string, value: any) => {
        handleComplianceChange(field, { ...data[field], [subField]: value });
    };

    const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, checked } = e.target;
        handleComplianceChange(name as keyof Compliance, checked);
    };

    const Checkbox = ({ name, label }: { name: keyof Compliance, label: string }) => (
        <label className="flex items-center p-3 border rounded-lg cursor-pointer hover:bg-gray-50 has-[:checked]:bg-blue-50 has-[:checked]:border-blue-500">
            <input
                type="checkbox"
                name={name}
                checked={!!data[name]}
                onChange={handleCheckboxChange}
                className="h-5 w-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <span className="ml-3 text-sm font-medium text-gray-700">{label}</span>
        </label>
    );

    return (
        <div className="fade-in-up">
            <h2 className="text-xl font-semibold mb-4">Step 2: Work Readiness</h2>
            <p className="text-sm text-gray-500 mb-4">Provide details about your insurance, competencies, and equipment. This builds trust with companies.</p>

            <div className="space-y-6">
                {/* Insurance Section */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-3 p-4 border rounded-lg">
                        <label className="flex items-center font-medium">
                            <input
                                type="checkbox"
                                checked={data.professionalIndemnity.hasCoverage}
                                onChange={e => handleInsuranceChange('professionalIndemnity', 'hasCoverage', e.target.checked)}
                                className="h-5 w-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500 mr-3"
                            />
                            Professional Indemnity Insurance
                        </label>
                        {data.professionalIndemnity.hasCoverage && (
                            <div className="space-y-3 pl-8 animate-fade-in-up">
                                <div>
                                    <label className="block text-sm font-medium mb-1">Coverage Amount (£)</label>
                                    <input type="number" step="100000" value={data.professionalIndemnity.amount} onChange={e => handleInsuranceChange('professionalIndemnity', 'amount', Number(e.target.value))} className="w-full border p-2 rounded" />
                                </div>
                                <FileUploadInput label="Upload Certificate" fileUrl={data.professionalIndemnity.certificateUrl} onFileChange={url => handleInsuranceChange('professionalIndemnity', 'certificateUrl', url)} />
                            </div>
                        )}
                    </div>
                     <div className="space-y-3 p-4 border rounded-lg">
                        <label className="flex items-center font-medium">
                             <input type="checkbox" checked={data.publicLiability.hasCoverage} onChange={e => handleInsuranceChange('publicLiability', 'hasCoverage', e.target.checked)} className="h-5 w-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500 mr-3" />
                            Public Liability Insurance
                        </label>
                        {data.publicLiability.hasCoverage && (
                            <div className="space-y-3 pl-8 animate-fade-in-up">
                                <div>
                                    <label className="block text-sm font-medium mb-1">Coverage Amount (£)</label>
                                    <input type="number" step="100000" value={data.publicLiability.amount} onChange={e => handleInsuranceChange('publicLiability', 'amount', Number(e.target.value))} className="w-full border p-2 rounded" />
                                </div>
                                <FileUploadInput label="Upload Certificate" fileUrl={data.publicLiability.certificateUrl} onFileChange={url => handleInsuranceChange('publicLiability', 'certificateUrl', url)} />
                            </div>
                        )}
                    </div>
                </div>

                {/* Competency Section */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <CompetencySlider label="Power Tool Competency" value={data.powerToolCompetency} onChange={val => handleComplianceChange('powerToolCompetency', val)} />
                    <CompetencySlider label="Access Equipment Training" value={data.accessEquipmentTrained} onChange={val => handleComplianceChange('accessEquipmentTrained', val)} />
                </div>
                
                {/* Other Checkboxes */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 pt-4 border-t">
                    <Checkbox name="hasOwnTransport" label="Own Transport" />
                    <Checkbox name="hasOwnTools" label="Own Tools" />
                    <Checkbox name="ownPPE" label="Own PPE" />
                    <Checkbox name="cscsCard" label="CSCS Card" />
                    <Checkbox name="siteSafe" label="Site Safe / SSSTS" />
                    <Checkbox name="firstAidTrained" label="First Aid Trained" />
                </div>
            </div>
        </div>
    );
};
