
import React, { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import { Currency, Discipline, Compliance, IdentityVerification, Country } from '../types';
import { Logo } from '../components/Logo';
import { ArrowLeft } from '../components/Icons';
import { ProgressTracker } from '../components/SignUp/ProgressTracker';
import { StepCoreInfo } from '../components/SignUp/StepCoreInfo';
import { StepWorkReadiness } from '../components/SignUp/StepWorkReadiness';
import { StepIdentity } from '../components/SignUp/StepIdentity';
import { StepRateAndAvailability } from '../components/SignUp/StepRateAndAvailability';

interface EngineerSignUpWizardProps {
    onCancel: () => void;
}

const WIZARD_STEPS = 4;

export const EngineerSignUpWizard = ({ onCancel }: EngineerSignUpWizardProps) => {
    const { createAndLoginEngineer } = useAppContext();
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState({
        name: '', email: '', discipline: Discipline.AV, location: '', experience: 5,
        country: Country.UK, // Add country to initial state
        minDayRate: 150, maxDayRate: 180, currency: Currency.GBP, availability: new Date().toISOString().split('T')[0],
        compliance: {
            professionalIndemnity: { hasCoverage: false, isVerified: false, amount: 1000000 },
            publicLiability: { hasCoverage: false, isVerified: false, amount: 2000000 },
            siteSafe: false, cscsCard: false, ownPPE: true, hasOwnTransport: false, hasOwnTools: false,
            powerToolCompetency: 0, accessEquipmentTrained: 0, firstAidTrained: false, carriesSpares: false,
        } as Compliance,
        identity: {
            documentType: 'none', isVerified: false,
        } as IdentityVerification,
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        const isNumberField = ['experience', 'minDayRate', 'maxDayRate'].includes(name);
        setFormData(prev => ({ ...prev, [name]: isNumberField ? parseInt(value, 10) || 0 : value }));
    };

    const nextStep = () => setStep(s => Math.min(s + 1, WIZARD_STEPS));
    const prevStep = () => setStep(s => Math.max(s - 1, 1));
    
    const handleSubmit = () => {
        createAndLoginEngineer(formData);
    };
    
    const renderStep = () => {
        switch (step) {
            case 1: return <StepCoreInfo data={formData} setData={setFormData} />;
            case 2: return <StepWorkReadiness data={formData.compliance} setData={setFormData} />;
            case 3: return <StepIdentity data={formData.identity} setData={setFormData} />;
            case 4: return <StepRateAndAvailability data={formData} onChange={handleChange} />;
            default: return null;
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-2 sm:p-4">
             <div className="w-full max-w-2xl">
                 <button onClick={onCancel} className="flex items-center text-gray-600 hover:text-gray-900 font-semibold transition-colors mb-4">
                    <ArrowLeft size={18} className="mr-2" />
                    Back to Login
                </button>

                <div className="bg-white rounded-lg shadow-xl p-6 sm:p-8">
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