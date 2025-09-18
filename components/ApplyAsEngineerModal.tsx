import React, { useState } from 'react';
// FIX: Corrected import path for types.
import { Job, EngineerProfile } from '../types';
import { X, MessageCircle } from './Icons';

interface ApplyAsEngineerModalProps {
    isOpen: boolean;
    onClose: () => void;
    job: Job;
    managedEngineers: EngineerProfile[];
    onSubmit: (jobId: string, engineerId: string) => void;
}

export const ApplyAsEngineerModal = ({ isOpen, onClose, job, managedEngineers, onSubmit }: ApplyAsEngineerModalProps) => {
    const [selectedEngineerId, setSelectedEngineerId] = useState<string>('');

    if (!isOpen) return null;

    const handleSubmit = () => {
        if (selectedEngineerId) {
            onSubmit(job.id, selectedEngineerId);
        } else {
            alert("Please select an engineer.");
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4">
            <div className="bg-white rounded-lg p-8 max-w-lg w-full">
                <header className="flex justify-between items-center mb-4">
                    <h2 className="text-2xl font-bold">Apply for Job</h2>
                    <button onClick={onClose} aria-label="Close modal"><X className="text-gray-500" /></button>
                </header>
                
                <p className="mb-2">You are applying for the role:</p>
                <h3 className="text-lg font-semibold text-blue-700 mb-6">{job.title}</h3>

                <div>
                    <label htmlFor="engineerSelect" className="block text-sm font-medium text-gray-700 mb-2">
                        Select an engineer to apply on behalf of:
                    </label>
                    <select
                        id="engineerSelect"
                        value={selectedEngineerId}
                        onChange={(e) => setSelectedEngineerId(e.target.value)}
                        className="w-full border p-2 rounded bg-white h-[42px] focus:ring-2 focus:ring-blue-500"
                    >
                        <option value="" disabled>-- Choose an engineer --</option>
                        {managedEngineers.map(eng => (
                            <option key={eng.id} value={eng.id}>
                                {eng.name} - ({eng.discipline})
                            </option>
                        ))}
                    </select>
                </div>

                <footer className="flex justify-end space-x-4 mt-8">
                    <button type="button" onClick={onClose} className="px-6 py-2 bg-gray-200 rounded-md hover:bg-gray-300">Cancel</button>
                    <button 
                        type="button"
                        onClick={handleSubmit} 
                        disabled={!selectedEngineerId}
                        className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-blue-300"
                    >
                        Submit Application
                    </button>
                </footer>
            </div>
        </div>
    );
};
