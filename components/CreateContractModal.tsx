import React, { useState, useEffect } from 'react';
import { useAppContext } from '../context/AppContext';
import { Job, EngineerProfile, Contract, ContractType, ContractStatus, Currency, Milestone, MilestoneStatus } from '../types';
import { X, FileText, Plus, Trash2 } from './Icons';

interface CreateContractModalProps {
    isOpen: boolean;
    onClose: () => void;
    job: Job;
    engineer: EngineerProfile;
    onSendForSignature: (contract: Contract) => void;
}

const getBoilerplate = (type: ContractType, companyName: string, engineerName: string) => {
    const common = `This Agreement is made between ${companyName} ("the Client") and ${engineerName} ("the Contractor"). The Contractor agrees to provide services as described herein. This platform, TechSubbies.com, is a facilitator and is not a party to this agreement. Any disputes must be resolved directly between the Client and the Contractor.`;
    if (type === ContractType.SOW) {
        return `${common}\n\nStatement of Work (SOW): The Contractor will complete the milestones as defined in this contract. Payment will be released from escrow upon successful completion and approval of each milestone.`;
    }
    return `${common}\n\nDay Rate Agreement: The Contractor will provide services on a day-rate basis. The Contractor will submit timesheets for approval, and payment will be made based on the agreed day rate.`;
};

export const CreateContractModal = ({ isOpen, onClose, job, engineer, onSendForSignature }: CreateContractModalProps) => {
    const { companies } = useAppContext();
    const company = companies.find(c => c.id === job.companyId);
    const companyName = company ? company.name : 'The Client';

    const [type, setType] = useState<ContractType>(ContractType.SOW);
    const [description, setDescription] = useState(getBoilerplate(type, companyName, engineer.name));
    const [amount, setAmount] = useState(job.dayRate);
    const [milestones, setMilestones] = useState<Omit<Milestone, 'status'>[]>([{ id: `ms-${generateUniqueId()}`, description: 'Initial Milestone', amount: Number(job.dayRate) }]);
    
    useEffect(() => {
        if(isOpen) {
            const initialType = ContractType.SOW;
            setType(initialType);
            setDescription(getBoilerplate(initialType, companyName, engineer.name));
            setAmount(job.dayRate);
            setMilestones([{ id: `ms-${generateUniqueId()}`, description: 'Initial Milestone', amount: Number(job.dayRate) }]);
        }
    }, [isOpen, job, companyName, engineer.name]);

    if (!isOpen) return null;
    
    function generateUniqueId() { return Math.random().toString(36).substring(2, 9); }

    const handleTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const newType = e.target.value as ContractType;
        setType(newType);
        setDescription(getBoilerplate(newType, companyName, engineer.name));
    };

    // Milestone handlers
    const addMilestone = () => {
        setMilestones([...milestones, { id: `ms-${generateUniqueId()}`, description: '', amount: 0 }]);
    };
    const removeMilestone = (id: string) => {
        setMilestones(milestones.filter(m => m.id !== id));
    };
    const handleMilestoneChange = (id: string, field: 'description' | 'amount', value: string | number) => {
        setMilestones(milestones.map(m => m.id === id ? { ...m, [field]: value } : m));
    };
    
    const totalMilestoneAmount = milestones.reduce((sum, m) => sum + Number(m.amount), 0);

    const handleSend = () => {
        const finalAmount = type === ContractType.SOW ? totalMilestoneAmount : amount;
        const finalMilestones = type === ContractType.SOW ? milestones.map(m => ({ ...m, status: MilestoneStatus.AWAITING_FUNDING })) : [];

        const newContract: Contract = {
            id: `contract-${generateUniqueId()}`,
            jobId: job.id, companyId: job.companyId, engineerId: engineer.id,
            type, description, amount: finalAmount, currency: job.currency,
            status: ContractStatus.DRAFT,
            engineerSignature: null, companySignature: null,
            milestones: finalMilestones,
            jobTitle: job.title,
        };
        onSendForSignature(newContract);
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50 p-4" onClick={onClose}>
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

                    {type === ContractType.DAY_RATE && (
                        <div>
                            <label className="block font-medium mb-1">Day Rate ({job.currency})</label>
                            <input type="number" value={amount} onChange={e => setAmount(e.target.value)} className="w-full border p-2 rounded" />
                        </div>
                    )}

                    {type === ContractType.SOW && (
                        <div>
                            <h3 className="font-medium mb-2">Project Milestones</h3>
                            <div className="space-y-2 p-3 bg-gray-50 border rounded-md">
                                {milestones.map((m, index) => (
                                    <div key={m.id} className="flex items-center gap-2">
                                        <input type="text" placeholder={`Milestone ${index + 1} Description`} value={m.description} onChange={e => handleMilestoneChange(m.id, 'description', e.target.value)} className="flex-grow border p-2 rounded" />
                                        <input type="number" placeholder="Amount" value={m.amount} onChange={e => handleMilestoneChange(m.id, 'amount', Number(e.target.value))} className="w-32 border p-2 rounded" />
                                        <button onClick={() => removeMilestone(m.id)} className="text-red-500 hover:text-red-700 p-2"><Trash2 size={18}/></button>
                                    </div>
                                ))}
                                <button onClick={addMilestone} className="text-sm flex items-center text-blue-600 font-semibold hover:underline"><Plus size={16} className="mr-1"/> Add Milestone</button>
                            </div>
                            <div className="text-right font-bold mt-2">Total Project Value: {job.currency}{totalMilestoneAmount}</div>
                        </div>
                    )}
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

                <div className="flex justify-end space-x-4 mt-6 pt-4 border-t">
                    <button onClick={onClose} className="px-6 py-2 bg-gray-200 rounded-md hover:bg-gray-300">Cancel</button>
                    <button
                        onClick={handleSend}
                        className="px-6 py-2 bg-blue-600 text-white font-bold rounded-md hover:bg-blue-700"
                    >
                        Send for Signature
                    </button>
                </div>
            </div>
        </div>
    );
};
