import React, { useState } from 'react';
import { Contract, Timesheet } from '../types';
import { X } from './Icons';

interface TimesheetSubmitModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (timesheet: Omit<Timesheet, 'id' | 'contractId' | 'engineerId' | 'status'>) => Promise<unknown>;
    contract: Contract;
}

export const TimesheetSubmitModal = ({ isOpen, onClose, onSubmit, contract }: TimesheetSubmitModalProps) => {
    const [period, setPeriod] = useState('');
    const [hours, setHours] = useState(0);
    const [workSummary,setWorkSummary]=useState('');

    if (!isOpen) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!period.trim() || hours <= 0 || !workSummary.trim()) {
            alert("Please enter a valid work period, hours and work summary.");
            return;
        }
        await onSubmit({ period, hours, workSummary:workSummary.trim() });
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-[300] p-4" onClick={onClose}>
            <form
                onSubmit={handleSubmit}
                className="bg-white rounded-lg p-6 m-4 max-w-lg w-full relative transform transition-all duration-300"
                onClick={e => e.stopPropagation()}
            >
                <button type="button" onClick={onClose} className="absolute top-4 right-4 text-gray-500 hover:text-gray-800">
                    <X size={24} />
                </button>

                <h2 className="text-2xl font-bold mb-4">Submit Timesheet</h2>
                <p className="text-gray-600 mb-6">For contract: {contract.jobTitle}</p>
                
                <div className="space-y-4">
                    <div>
                        <label htmlFor="period" className="block font-medium mb-1">Work Period</label>
                        <input
                            id="period"
                            type="text"
                            value={period}
                            onChange={e => setPeriod(e.target.value)}
                            placeholder="e.g., Week ending 2024-08-09"
                            className="w-full border p-2 rounded-md focus:ring-2 focus:ring-blue-500"
                            required
                        />
                    </div>
                     <div>
                        <label htmlFor="hours" className="block font-medium mb-1">Hours Worked</label>
                        <input
                            id="hours"
                            type="number"
                            value={hours}
                            min="0.25"
                            step="0.25"
                            onChange={e => setHours(parseFloat(e.target.value) || 0)}
                            className="w-full border p-2 rounded-md focus:ring-2 focus:ring-blue-500"
                            required
                        />
                    </div>
                    <div><label htmlFor="work-summary" className="block font-medium mb-1">Work completed</label><textarea id="work-summary" value={workSummary} onChange={e=>setWorkSummary(e.target.value)} className="w-full rounded-md border p-2" rows={3} required/></div>
                    <p className="rounded-md bg-blue-50 p-3 text-sm text-blue-900">This timesheet records delivery evidence for client approval. Rates, invoices and payment remain directly between the parties.</p>
                </div>

                <div className="flex justify-end space-x-4 mt-6 pt-4 border-t">
                    <button type="button" onClick={onClose} className="px-6 py-2 bg-gray-200 rounded-md hover:bg-gray-300">Cancel</button>
                    <button
                        type="submit"
                        className="px-6 py-2 bg-blue-600 text-white font-bold rounded-md hover:bg-blue-700"
                    >
                        Submit for Approval
                    </button>
                </div>
            </form>
        </div>
    );
};
