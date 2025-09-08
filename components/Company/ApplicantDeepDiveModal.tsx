
// FIX: Created the `ApplicantDeepDiveModal` component to resolve the "not a module" error.
import React from 'react';
import { Job, EngineerProfile } from '../../types';
import { X } from '../Icons';
import { EngineerProfileView } from '../../views/EngineerProfileView';
import { AIEngineerCostAnalysis } from '../AIEngineerCostAnalysis';

interface ApplicantDeepDiveModalProps {
    isOpen: boolean;
    onClose: () => void;
    job: Job;
    engineer: EngineerProfile;
}

export const ApplicantDeepDiveModal = ({ isOpen, onClose, job, engineer }: ApplicantDeepDiveModalProps) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50 p-4" onClick={onClose}>
            <div
                className="bg-gray-50 rounded-lg m-4 max-w-4xl w-full relative transform transition-all duration-300 max-h-[90vh] flex flex-col"
                onClick={e => e.stopPropagation()}
            >
                <header className="flex-shrink-0 p-4 bg-white border-b flex justify-between items-center">
                     <div>
                        <h2 className="text-xl font-bold">Applicant Deep Dive</h2>
                        <p className="text-sm text-gray-500">Analysis for role: {job.title}</p>
                    </div>
                    <button onClick={onClose} className="text-gray-500 hover:text-gray-800" aria-label="Close modal"><X size={24} /></button>
                </header>

                <main className="flex-grow overflow-y-auto custom-scrollbar p-2 sm:p-4">
                     <div className="bg-white p-4 rounded-lg shadow-md mb-4">
                        <AIEngineerCostAnalysis job={job} engineer={engineer} />
                    </div>
                    <EngineerProfileView profile={engineer} isEditable={false} onEdit={() => {}} />
                </main>

                <footer className="flex-shrink-0 p-4 border-t bg-white flex justify-end gap-4">
                    <button onClick={onClose} className="px-6 py-2 bg-gray-200 rounded-md hover:bg-gray-300">Close</button>
                    <button className="px-6 py-2 bg-blue-600 text-white font-bold rounded-md hover:bg-blue-700">Hire & Send Contract</button>
                </footer>
            </div>
        </div>
    );
};
