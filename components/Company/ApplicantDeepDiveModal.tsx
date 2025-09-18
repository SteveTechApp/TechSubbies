import React, { useState, useEffect } from 'react';
// FIX: Corrected import path for types.
import { Job, EngineerProfile } from '../../types';
import { X, BrainCircuit, Loader, CheckCircle, AlertTriangle, Lightbulb } from '../Icons';
// FIX: Corrected import path for useAppContext to resolve 'not a module' error.
import { useAppContext } from '../../context/InteractionContext';

interface ApplicantDeepDiveModalProps {
    isOpen: boolean;
    onClose: () => void;
    job: Job;
    engineer: EngineerProfile;
}

interface Analysis {
    summary: string;
    strengths: string[];
    areas_to_probe: string[];
    interview_questions: string[];
}

export const ApplicantDeepDiveModal = ({ isOpen, onClose, job, engineer }: ApplicantDeepDiveModalProps) => {
    const { getApplicantDeepDive } = useAppContext();
    const [analysis, setAnalysis] = useState<Analysis | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [isPaid, setIsPaid] = useState(false); // Simulate payment

    useEffect(() => {
        // Reset state when modal opens for a new applicant
        if (isOpen) {
            setAnalysis(null);
            setIsLoading(false);
            setError('');
            setIsPaid(false);
        }
    }, [isOpen, engineer]);

    const handlePurchaseAndAnalyze = async () => {
        setIsLoading(true);
        setError('');
        
        // Simulate payment API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        setIsPaid(true);

        const result = await getApplicantDeepDive(job, engineer);
        if (result.error) {
            setError(result.error);
        } else if (result.analysis) {
            setAnalysis(result.analysis);
        }
        setIsLoading(false);
    };

    const renderContent = () => {
        if (isLoading) {
            return (
                <div className="text-center py-12">
                    <Loader className="animate-spin w-10 h-10 text-blue-600 mx-auto mb-4" />
                    <p className="font-semibold">{isPaid ? 'Generating AI Analysis...' : 'Processing Payment...'}</p>
                </div>
            );
        }
        if (error) {
            return <p className="text-red-500 text-center py-12">{error}</p>;
        }
        if (analysis) {
            return (
                <div className="space-y-4 text-sm">
                    <p className="italic text-gray-700">{analysis.summary}</p>
                    <div>
                        <h4 className="font-bold text-green-700 flex items-center"><CheckCircle size={16} className="mr-2"/> Strengths</h4>
                        <ul className="list-disc list-inside pl-2 text-gray-600">
                            {analysis.strengths.map((s, i) => <li key={i}>{s}</li>)}
                        </ul>
                    </div>
                     <div>
                        <h4 className="font-bold text-yellow-700 flex items-center"><AlertTriangle size={16} className="mr-2"/> Areas to Probe</h4>
                        <ul className="list-disc list-inside pl-2 text-gray-600">
                            {analysis.areas_to_probe.map((s, i) => <li key={i}>{s}</li>)}
                        </ul>
                    </div>
                     <div>
                        <h4 className="font-bold text-blue-700 flex items-center"><Lightbulb size={16} className="mr-2"/> Suggested Interview Questions</h4>
                        <ol className="list-decimal list-inside pl-2 text-gray-600">
                            {analysis.interview_questions.map((s, i) => <li key={i}>{s}</li>)}
                        </ol>
                    </div>
                </div>
            );
        }
        // Initial state: Payment prompt
        return (
            <div className="text-center py-8">
                <BrainCircuit size={40} className="mx-auto text-purple-500 mb-4" />
                <h3 className="text-xl font-bold">Unlock In-Depth Analysis</h3>
                <p className="text-gray-600 my-2">Get an AI-powered deep dive into this candidate's suitability, including strengths, potential weaknesses, and tailored interview questions.</p>
                <button onClick={handlePurchaseAndAnalyze} className="mt-4 px-6 py-3 bg-purple-600 text-white font-bold rounded-lg hover:bg-purple-700">
                    Pay £5.00 to Continue
                </button>
            </div>
        );
    }

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50 p-4" onClick={onClose}>
            <div
                className="bg-gray-50 rounded-lg m-4 max-w-2xl w-full relative transform transition-all duration-300 max-h-[90vh] flex flex-col"
                onClick={e => e.stopPropagation()}
            >
                <header className="flex-shrink-0 p-4 bg-white border-b flex justify-between items-center">
                     <div>
                        <h2 className="text-xl font-bold">AI Applicant Deep Dive</h2>
                        <p className="text-sm text-gray-500">Candidate: {engineer.name}</p>
                    </div>
                    <button onClick={onClose} className="text-gray-500 hover:text-gray-800" aria-label="Close modal"><X size={24} /></button>
                </header>
                <main className="flex-grow overflow-y-auto custom-scrollbar p-6">
                    {renderContent()}
                </main>
            </div>
        </div>
    );
};