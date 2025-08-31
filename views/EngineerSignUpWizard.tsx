import React, { useState } from 'react';
import { useAppContext } from '../context/AppContext.tsx';
import { Currency, Discipline } from '../types/index.ts';
import { Logo } from '../components/Logo.tsx';
import { ArrowLeft } from '../components/Icons.tsx';
import { ProgressTracker } from '../components/SignUp/ProgressTracker.tsx';
import { StepAccount } from '../components/SignUp/StepAccount.tsx';
import { StepDiscipline } from '../components/SignUp/StepDiscipline.tsx';
import { StepReadiness } from '../components/SignUp/StepReadiness.tsx';
import { StepRate } from '../components/SignUp/StepRate.tsx';
import { StepAvailability } from '../components/SignUp/StepAvailability.tsx';

interface EngineerSignUpWizardProps {
    onCancel: () => void;
}

const WIZARD_STEPS = 5;

export const EngineerSignUpWizard = ({ onCancel }: EngineerSignUpWizardProps) => {
    const { createAndLoginEngineer } = useAppContext();
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState({
        name: '', email: '', discipline: Discipline.AV, location: '', experience: 5,
        dayRate: 180, currency: Currency.GBP, skills: [], availability: new Date().toISOString().split('T')[0],
        compliance: {
            professionalIndemnity: false, publicLiability: false, siteSafe: false, cscsCard: false,
            ownPPE: false, hasOwnTransport: false, hasOwnTools: false, powerToolCompetency: false,
            accessEquipmentTrained: false, firstAidTrained: false, carriesSpares: false,
        }
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleComplianceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            compliance: { ...prev.compliance, [name]: checked }
        }));
    };

    const nextStep = () => setStep(s => Math.min(s + 1, WIZARD_STEPS));
    const prevStep = () => setStep(s => Math.max(s - 1, 1));
    
    const handleSubmit = () => {
        // Free profiles are created with an empty skills array
        const finalData = { ...formData, skills: [] };
        createAndLoginEngineer(finalData);
    };
    
    const renderStep = () => {
        switch (step) {
            case 1: return <StepAccount data={formData} onChange={handleChange} />;
            case 2: return <StepDiscipline data={formData} onChange={handleChange} />;
            case 3: return <StepReadiness data={formData.compliance} onChange={handleComplianceChange} />;
            case 4: return <StepRate data={formData} onChange={handleChange} />;
            case 5: return <StepAvailability data={formData} onChange={handleChange} />;
            default: return null;
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
             <div className="w-full max-w-2xl">
                 <button onClick={onCancel} className="flex items-center text-gray-600 hover:text-gray-900 font-semibold transition-colors mb-4">
                    <ArrowLeft size={18} className="mr-2" />
                    Back to Login
                </button>

                <div className="bg-white rounded-lg shadow-xl p-8">
                    <div className="mb-8">
                         <Logo className="mb-4 h-16" />
                        <h1 className="text-2xl font-bold text-gray-800">Create Your Engineer Profile</h1>
                        <p className="text-gray-500">Let's get you set up to find your next contract.</p>
                    </div>

                    <ProgressTracker currentStep={step} />

                    <div className="space-y-6 mt-8">
                        {renderStep()}
                    </div>
                    
                    <div className="flex justify-between mt-8 pt-6 border-t">
                        <button onClick={prevStep} disabled={step === 1} className="px-6 py-2 bg-gray-200 rounded-md hover:bg-gray-300 disabled:opacity-50">Back</button>
                        {step < WIZARD_STEPS ? (
                            <button onClick={nextStep} className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">Next</button>
                        ) : (
                            <button onClick={handleSubmit} className="px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700">Finish & Create Profile</button>
                        )}
                    </div>

                </div>
            </div>
        </div>
    );
};
