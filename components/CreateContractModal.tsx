import React, { useState, useEffect } from 'react';
// FIX: Corrected import path for useAppContext to resolve 'not a module' error.
import { useAppContext } from '../context/InteractionContext';
// FIX: Corrected import path for types.
import { Job, EngineerProfile, ContractType } from '../types';
import { X, FileText } from './Icons';

interface CreateContractModalProps {
    isOpen: boolean;
    onClose: () => void;
    job: Job;
    engineer: EngineerProfile;
    onSendForSignature: (contract: { jobId:string; engineerId:string; type:ContractType; description:string }) => Promise<void>;
}

const getBoilerplate = (type: ContractType, companyName: string, engineerName: string) => {
    const common = `This Agreement is made between ${companyName} ("the Client") and ${engineerName} ("the Contractor"). The Contractor agrees to provide services as described herein. This platform, TechSubbies.com, is a facilitator and is not a party to this agreement. Any disputes must be resolved directly between the Client and the Contractor.`;
    if (type === ContractType.SOW) {
        return `${common}\n\nStatement of Work (SOW): The Contractor will deliver the agreed scope and completion evidence. Rates, invoicing and payment are agreed and handled directly between the Client and Contractor, outside TechSubbies.`;
    }
    return `${common}\n\nDay Rate Agreement: The Contractor will provide the agreed services and submit timesheets for approval. Rates, invoicing and payment are agreed and handled directly between the Client and Contractor, outside TechSubbies.`;
};

export const CreateContractModal = ({ isOpen, onClose, job, engineer, onSendForSignature }: CreateContractModalProps) => {
    const { companies } = useAppContext();
    const company = companies.find(c => c.id === job.companyId);
    const companyName = company ? company.name : 'The Client';

    const [type, setType] = useState<ContractType>(ContractType.SOW);
    const [description, setDescription] = useState(getBoilerplate(type, companyName, engineer.name));
    const [isSending, setIsSending] = useState(false);
    const [error, setError] = useState('');
    
    useEffect(() => {
        if(isOpen) {
            const initialType = ContractType.SOW;
            setType(initialType);
            setDescription(getBoilerplate(initialType, companyName, engineer.name));
            setError('');
        }
    }, [isOpen, job, companyName, engineer.name]);

    if (!isOpen) return null;
    
    const handleTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const newType = e.target.value as ContractType;
        setType(newType);
        setDescription(getBoilerplate(newType, companyName, engineer.name));
    };

    const handleSend = async () => {
        if(description.trim().length<40){setError('Add enough scope and terms for the engineer to understand the engagement.');return;}
        setIsSending(true);setError('');
        try{await onSendForSignature({jobId:job.id,engineerId:engineer.id,type,description:description.trim()});onClose();}
        catch(error:any){setError(error.message||'The agreement could not be sent.');}
        finally{setIsSending(false);}
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-[300] p-4" onClick={onClose}>
            <div className="bg-white rounded-lg p-6 m-4 max-w-3xl w-full relative transform transition-all duration-300 max-h-[90vh] overflow-y-auto custom-scrollbar" onClick={e => e.stopPropagation()}>
                <button onClick={onClose} className="absolute top-4 right-4 text-gray-500 hover:text-gray-800">
                    <X size={24} />
                </button>
                <h2 className="text-2xl font-bold mb-2 flex items-center"><FileText className="mr-3" /> Create Contract</h2>
                <p className="text-gray-600 mb-1">For: <span className="font-semibold">{engineer.name}</span></p>
                <p className="text-gray-600 mb-6">Job: <span className="font-semibold">{job.title}</span></p>
                
                <div className="space-y-4">
                    <div>
                        <label className="block font-medium mb-1">Contract Type</label>
                        <select name="type" value={type} onChange={handleTypeChange} className="w-full border p-2 rounded bg-white">
                            <option value={ContractType.SOW}>Statement of Work (Milestones)</option>
                            <option value={ContractType.DAY_RATE}>Day Rate Agreement</option>
                        </select>
                    </div>

                    <div className="rounded-md border border-blue-200 bg-blue-50 p-3 text-sm text-blue-900"><strong>TechSubbies records the agreement and signatures only.</strong> Job rates, invoices and payments are arranged directly between the parties. The platform only bills for TechSubbies membership.</div>
                     <div>
                        <label className="block font-medium mb-1">Agreement Terms & Description</label>
                        <textarea
                            name="description"
                            value={description}
                            onChange={e => setDescription(e.target.value)}
                            rows={6}
                            className="w-full border p-2 rounded text-sm bg-gray-50"
                        />
                    </div>
                </div>
                {error&&<p className="mt-4 rounded-md bg-red-50 p-3 text-sm text-red-700">{error}</p>}

                <div className="flex justify-end space-x-4 mt-6 pt-4 border-t">
                    <button onClick={onClose} className="px-6 py-2 bg-gray-200 rounded-md hover:bg-gray-300">Cancel</button>
                    <button
                        onClick={handleSend} disabled={isSending}
                        className="px-6 py-2 bg-blue-600 text-white font-bold rounded-md hover:bg-blue-700"
                    >
                        {isSending?'Sending…':'Send for Signature'}
                    </button>
                </div>
            </div>
        </div>
    );
};
