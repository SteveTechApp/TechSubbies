import React from 'react';
import { Compliance } from '../../types/index.ts';
import { SectionWrapper } from './SectionWrapper.tsx';
import { ShieldCheck } from '../Icons.tsx';
import { FileUploadInput } from '../FileUploadInput.tsx';
import { CompetencySlider } from '../CompetencySlider.tsx';

interface WorkReadinessSectionProps {
    complianceData: Compliance;
    setComplianceData: React.Dispatch<React.SetStateAction<Compliance>>;
}

export const WorkReadinessSection = ({ complianceData, setComplianceData }: WorkReadinessSectionProps) => {

    const handleInsuranceChange = (field: 'professionalIndemnity' | 'publicLiability', subField: string, value: any) => {
        setComplianceData(prev => ({
            ...prev,
            [field]: {
                ...prev[field],
                [subField]: value,
            }
        }));
    };

    const handleCompetencyChange = (field: 'powerToolCompetency' | 'accessEquipmentTrained', value: number) => {
        setComplianceData(prev => ({ ...prev, [field]: value }));
    };

    const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, checked } = e.target;
        setComplianceData(prev => ({ ...prev, [name]: checked }));
    };

    const Checkbox = ({ name, label }: { name: keyof Compliance, label: string }) => (
        <label className="flex items-center p-3 border rounded-lg cursor-pointer hover:bg-gray-50 has-[:checked]:bg-blue-50 has-[:checked]:border-blue-500">
            <input
                type="checkbox"
                name={name}
                checked={!!complianceData[name]}
                onChange={handleCheckboxChange}
                className="h-5 w-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <span className="ml-3 text-sm font-medium text-gray-700">{label}</span>
        </label>
    );

    return (
        <SectionWrapper title="Work Readiness" icon={ShieldCheck}>
            <p className="text-sm text-gray-500 mb-4">Provide detailed information about your insurance, competencies, and equipment to build trust with companies.</p>
            
            <div className="space-y-6">
                {/* Insurance Section */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Professional Indemnity */}
                    <div className="space-y-3 p-4 border rounded-lg">
                        <label className="flex items-center font-medium">
                            <input
                                type="checkbox"
                                checked={complianceData.professionalIndemnity.hasCoverage}
                                onChange={e => handleInsuranceChange('professionalIndemnity', 'hasCoverage', e.target.checked)}
                                className="h-5 w-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500 mr-3"
                            />
                            Professional Indemnity Insurance
                        </label>
                        {complianceData.professionalIndemnity?.hasCoverage && (
                             <div className="space-y-3 pl-8 animate-fade-in-up">
                                <div>
                                    <label className="block text-sm font-medium mb-1">Coverage Amount (£)</label>
                                    <input
                                        type="number"
                                        value={complianceData.professionalIndemnity.amount || ''}
                                        onChange={e => handleInsuranceChange('professionalIndemnity', 'amount', Number(e.target.value))}
                                        className="w-full border p-2 rounded"
                                    />
                                </div>
                                <FileUploadInput
                                    label="Upload Certificate"
                                    fileUrl={complianceData.professionalIndemnity.certificateUrl}
                                    isVerified={complianceData.professionalIndemnity.isVerified}
                                    onFileChange={url => handleInsuranceChange('professionalIndemnity', 'certificateUrl', url)}
                                />
                            </div>
                        )}
                    </div>
                    {/* Public Liability */}
                     <div className="space-y-3 p-4 border rounded-lg">
                         <label className="flex items-center font-medium">
                            <input
                                type="checkbox"
                                checked={complianceData.publicLiability.hasCoverage}
                                onChange={e => handleInsuranceChange('publicLiability', 'hasCoverage', e.target.checked)}
                                className="h-5 w-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500 mr-3"
                            />
                            Public Liability Insurance
                        </label>
                        {complianceData.publicLiability?.hasCoverage && (
                            <div className="space-y-3 pl-8 animate-fade-in-up">
                                <div>
                                    <label className="block text-sm font-medium mb-1">Coverage Amount (£)</label>
                                    <input
                                        type="number"
                                        value={complianceData.publicLiability.amount || ''}
                                        onChange={e => handleInsuranceChange('publicLiability', 'amount', Number(e.target.value))}
                                        className="w-full border p-2 rounded"
                                    />
                                </div>
                                <FileUploadInput
                                    label="Upload Certificate"
                                    fileUrl={complianceData.publicLiability.certificateUrl}
                                    isVerified={complianceData.publicLiability.isVerified}
                                    onFileChange={url => handleInsuranceChange('publicLiability', 'certificateUrl', url)}
                                />
                            </div>
                        )}
                    </div>
                </div>

                 {/* Competency Section */}
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <CompetencySlider label="Power Tool Competency" value={complianceData.powerToolCompetency} onChange={val => handleCompetencyChange('powerToolCompetency', val)} />
                    <CompetencySlider label="Access Equipment Training" value={complianceData.accessEquipmentTrained} onChange={val => handleCompetencyChange('accessEquipmentTrained', val)} />
                 </div>
                
                 {/* Other Checkboxes */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 pt-4 border-t">
                    <Checkbox name="hasOwnTransport" label="Own Transport" />
                    <Checkbox name="hasOwnTools" label="Own Tools" />
                    <Checkbox name="ownPPE" label="Own PPE" />
                    <Checkbox name="cscsCard" label="CSCS Card" />
                    <Checkbox name="siteSafe" label="Site Safe / SSSTS" />
                    <Checkbox name="firstAidTrained" label="First Aid Trained" />
                    <Checkbox name="carriesSpares" label="Carries Spares" />
                </div>
            </div>
        </SectionWrapper>
    );
};