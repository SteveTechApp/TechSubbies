import React from 'react';
import { Compliance } from '../../types/index.ts';
import { CheckboxInput } from './CheckboxInput.tsx';

interface StepReadinessProps {
    data: Compliance;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export const StepReadiness = ({ data, onChange }: StepReadinessProps) => (
    <div className="fade-in-up">
        <h2 className="text-xl font-semibold mb-4">Step 3: Work Readiness</h2>
        <p className="text-sm text-gray-500 mb-4">Let companies know you're ready for site-based work. Tick all that apply.</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <CheckboxInput label="Prof. Indemnity Insurance" name="professionalIndemnity" checked={data.professionalIndemnity} onChange={onChange} />
            <CheckboxInput label="Public Liability Insurance" name="publicLiability" checked={data.publicLiability} onChange={onChange} />
            <CheckboxInput label="Own Transport" name="hasOwnTransport" checked={data.hasOwnTransport} onChange={onChange} />
            <CheckboxInput label="Own Tools" name="hasOwnTools" checked={data.hasOwnTools} onChange={onChange} />
            <CheckboxInput label="Own PPE" name="ownPPE" checked={data.ownPPE} onChange={onChange} />
            <CheckboxInput label="CSCS Card" name="cscsCard" checked={data.cscsCard} onChange={onChange} />
            <CheckboxInput label="Site Safe / SSSTS" name="siteSafe" checked={data.siteSafe} onChange={onChange} />
            <CheckboxInput label="Access Eqpt. (IPAF/PASMA)" name="accessEquipmentTrained" checked={data.accessEquipmentTrained} onChange={onChange} />
            <CheckboxInput label="First Aid Trained" name="firstAidTrained" checked={data.firstAidTrained} onChange={onChange} />
            <CheckboxInput label="Power Tool Competency" name="powerToolCompetency" checked={data.powerToolCompetency} onChange={onChange} />
        </div>
    </div>
);
