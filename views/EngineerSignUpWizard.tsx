import React, { useState } from 'react';
import { useAppContext, Currency, Discipline } from '../context/AppContext.tsx';
import { Logo } from '../components/Logo.tsx';
import { ArrowLeft, User, Briefcase, PoundSterling, Sparkles, Calendar } from '../components/Icons.tsx';

interface EngineerSignUpWizardProps {
    onCancel: () => void;
}

const ProgressStep = ({ step, currentStep, title }: { step: number; currentStep: number; title: string }) => {
    const isActive = step === currentStep;
    const isCompleted = step < currentStep;

    const circleClass = isCompleted 
        ? 'bg-blue-600 text-white' 
        : isActive 
        ? 'border-2 border-blue-600 text-blue-600' 
        : 'border-2 border-gray-300 text-gray-400';

    return (
        <div className="flex items-center">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${circleClass}`}>
                {isCompleted ? '✓' : step}
            </div>
            <span className={`ml-3 font-semibold ${isActive || isCompleted ? 'text-gray-800' : 'text-gray-400'}`}>{title}</span>
        </div>
    );
};

export const EngineerSignUpWizard = ({ onCancel }: EngineerSignUpWizardProps) => {
    const { createAndLoginEngineer } = useAppContext();
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState({
        name: '', email: '', discipline: Discipline.AV, location: '', experience: 5,
        dayRate: 450, currency: Currency.GBP, skills: ['', '', ''], availability: new Date().toISOString().split('T')[0]
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSkillChange = (index: number, value: string) => {
        const newSkills = [...formData.skills];
        newSkills[index] = value;
        setFormData(prev => ({ ...prev, skills: newSkills }));
    };

    const nextStep = () => setStep(s => s + 1);
    const prevStep = () => setStep(s => s - 1);
    
    const handleSubmit = () => {
        const finalData = {
            ...formData,
            skills: formData.skills.filter(s => s.trim() !== '') // Remove empty skills
        };
        createAndLoginEngineer(finalData);
    };
    
    const STEPS = [
        { num: 1, title: 'Account Setup', icon: User },
        { num: 2, title: 'Your Discipline', icon: Briefcase },
        { num: 3, title: 'Your Rate', icon: PoundSterling },
        { num: 4, title: 'Core Skills', icon: Sparkles },
        { num: 5, title: 'Availability', icon: Calendar },
    ];

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
             <div className="w-full max-w-2xl">
                 <button onClick={onCancel} className="flex items-center text-gray-600 hover:text-gray-900 font-semibold transition-colors mb-4">
                    <ArrowLeft size={18} className="mr-2" />
                    Back to Login
                </button>

                <div className="bg-white rounded-lg shadow-xl p-8">
                    <div className="mb-8">
                         <Logo className="mb-4" />
                        <h1 className="text-2xl font-bold text-gray-800">Create Your Engineer Profile</h1>
                        <p className="text-gray-500">Let's get you set up to find your next contract.</p>
                    </div>

                    {/* Progress Bar */}
                    <div className="flex justify-between items-center mb-8">
                        {STEPS.map((s, index) => (
                             <React.Fragment key={s.num}>
                                <ProgressStep step={s.num} currentStep={step} title={s.title} />
                                {index < STEPS.length -1 && <div className="flex-grow border-t-2 mx-4 border-gray-300"></div>}
                            </React.Fragment>
                        ))}
                    </div>

                    <div className="space-y-6">
                        {step === 1 && (
                            <div className="fade-in-up">
                                <h2 className="text-xl font-semibold mb-4">Step 1: Account Setup</h2>
                                <div>
                                    <label className="block font-medium mb-1">Full Name</label>
                                    <input type="text" name="name" value={formData.name} onChange={handleChange} placeholder="e.g., Jane Doe" className="w-full border p-2 rounded" />
                                </div>
                                <div>
                                    <label className="block font-medium mb-1">Email Address</label>
                                    <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="you@company.com" className="w-full border p-2 rounded" />
                                </div>
                            </div>
                        )}

                        {step === 2 && (
                             <div className="fade-in-up">
                                <h2 className="text-xl font-semibold mb-4">Step 2: Your Discipline</h2>
                                <div className="space-y-4">
                                     <div>
                                        <label className="block font-medium mb-2">What is your primary discipline?</label>
                                        <div className="space-y-2">
                                            <label className="flex items-center p-3 border rounded-lg cursor-pointer hover:bg-gray-50 has-[:checked]:bg-blue-50 has-[:checked]:border-blue-500">
                                                <input type="radio" name="discipline" value={Discipline.AV} checked={formData.discipline === Discipline.AV} onChange={handleChange} className="h-5 w-5 text-blue-600 focus:ring-blue-500" />
                                                <span className="ml-3 text-gray-700">{Discipline.AV}</span>
                                            </label>
                                            <label className="flex items-center p-3 border rounded-lg cursor-pointer hover:bg-gray-50 has-[:checked]:bg-blue-50 has-[:checked]:border-blue-500">
                                                <input type="radio" name="discipline" value={Discipline.IT} checked={formData.discipline === Discipline.IT} onChange={handleChange} className="h-5 w-5 text-blue-600 focus:ring-blue-500" />
                                                <span className="ml-3 text-gray-700">{Discipline.IT}</span>
                                            </label>
                                            <label className="flex items-center p-3 border rounded-lg cursor-pointer hover:bg-gray-50 has-[:checked]:bg-blue-50 has-[:checked]:border-blue-500">
                                                <input type="radio" name="discipline" value={Discipline.BOTH} checked={formData.discipline === Discipline.BOTH} onChange={handleChange} className="h-5 w-5 text-blue-600 focus:ring-blue-500" />
                                                <span className="ml-3 text-gray-700">{Discipline.BOTH}</span>
                                            </label>
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block font-medium mb-1">Location</label>
                                        <input type="text" name="location" value={formData.location} onChange={handleChange} placeholder="e.g., London, UK" className="w-full border p-2 rounded" />
                                    </div>
                                    <div>
                                        <label className="block font-medium mb-1">Years of General Experience</label>
                                        <input type="number" name="experience" value={formData.experience} onChange={handleChange} className="w-full border p-2 rounded" />
                                    </div>
                                </div>
                            </div>
                        )}

                        {step === 3 && (
                            <div className="fade-in-up">
                                <h2 className="text-xl font-semibold mb-4">Step 3: Your Rate</h2>
                                <div className="flex gap-4">
                                    <div className="w-1/3">
                                        <label className="block font-medium mb-1">Currency</label>
                                        <select name="currency" value={formData.currency} onChange={handleChange} className="w-full border p-2 rounded bg-white h-[42px]">
                                            <option value={Currency.GBP}>GBP (£)</option>
                                            <option value={Currency.USD}>USD ($)</option>
                                        </select>
                                    </div>
                                    <div className="w-2/3">
                                        <label className="block font-medium mb-1">Day Rate</label>
                                        <input type="number" name="dayRate" value={formData.dayRate} step="10" onChange={handleChange} className="w-full border p-2 rounded" />
                                    </div>
                                </div>
                            </div>
                        )}
                        
                        {step === 4 && (
                            <div className="fade-in-up">
                                <h2 className="text-xl font-semibold mb-4">Step 4: Core Skills</h2>
                                <p className="text-sm text-gray-500 mb-3">List up to 3 of your top skills to get started. You can add more later.</p>
                                {formData.skills.map((skill, index) => (
                                    <input key={index} type="text" value={skill} onChange={(e) => handleSkillChange(index, e.target.value)} placeholder={`Skill #${index + 1} (e.g., Crestron, Cisco, AWS)`} className="w-full border p-2 rounded mb-2" />
                                ))}
                            </div>
                        )}

                        {step === 5 && (
                             <div className="fade-in-up">
                                <h2 className="text-xl font-semibold mb-4">Step 5: Availability</h2>
                                <div>
                                    <label className="block font-medium mb-1">Available for new projects from:</label>
                                    <input type="date" name="availability" value={formData.availability} onChange={handleChange} className="w-full border p-2 rounded" />
                                </div>
                            </div>
                        )}
                    </div>
                    
                    <div className="flex justify-between mt-8 pt-6 border-t">
                        <button onClick={prevStep} disabled={step === 1} className="px-6 py-2 bg-gray-200 rounded-md hover:bg-gray-300 disabled:opacity-50">Back</button>
                        {step < 5 ? (
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
