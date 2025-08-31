import React from 'react';
import { Compliance } from '../../types/index.ts';
import { SectionWrapper } from './SectionWrapper.tsx';
import { ShieldCheck } from '../Icons.tsx';
import { CheckboxInput } from '../SignUp/CheckboxInput.tsx';

interface WorkReadinessSectionProps {
    complianceData?: Partial<Compliance>;
    onComplianceChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export const WorkReadinessSection = ({ complianceData = {}, onComplianceChange }: WorkReadinessSectionProps) => (
    <SectionWrapper title="Work Readiness" icon={ShieldCheck}>
        <p className="text-sm text-gray-500 mb-4">Let companies know you're ready for site work by confirming your compliance and equipment status.</p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            <CheckboxInput label="Professional Indemnity Insurance" name="professionalIndemnity" checked={complianceData.professionalIndemnity || false} onChange={onComplianceChange} />
            <CheckboxInput label="Public Liability Insurance" name="publicLiability" checked={complianceData.publicLiability || false} onChange={onComplianceChange} />
            <CheckboxInput label="Own Transport" name="hasOwnTransport" checked={complianceData.hasOwnTransport || false} onChange={onComplianceChange} />
            <CheckboxInput label="Own Tools" name="hasOwnTools" checked={complianceData.hasOwnTools || false} onChange={onComplianceChange} />
            <CheckboxInput label="Own PPE" name="ownPPE" checked={complianceData.ownPPE || false} onChange={onComplianceChange} />
            <CheckboxInput label="CSCS Card" name="cscsCard" checked={complianceData.cscsCard || false} onChange={onComplianceChange} />
            <CheckboxInput label="Site Safe / SSSTS" name="siteSafe" checked={complianceData.siteSafe || false} onChange={onComplianceChange} />
            <CheckboxInput label="Access Eqpt. (IPAF/PASMA)" name="accessEquipmentTrained" checked={complianceData.accessEquipmentTrained || false} onChange={onComplianceChange} />
            <CheckboxInput label="First Aid Trained" name="firstAidTrained" checked={complianceData.firstAidTrained || false} onChange={onComplianceChange} />
            <CheckboxInput label="Power Tool Competency" name="powerToolCompetency" checked={complianceData.powerToolCompetency || false} onChange={onComplianceChange} />
            <CheckboxInput label="Carries Spares/Consumables" name="carriesSpares" checked={complianceData.carriesSpares || false} onChange={onComplianceChange} />
        </div>
    </SectionWrapper>
);
