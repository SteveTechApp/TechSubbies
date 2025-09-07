import React from 'react';
import { User, Briefcase, PoundSterling, Calendar, ShieldCheck, FileText } from '../Icons';

const STEPS = [
    { num: 1, title: 'Core Info', icon: User },
    { num: 2, title: 'Work Readiness', icon: ShieldCheck },
    { num: 3, title: 'Identity', icon: FileText },
    { num: 4, title: 'Rate & Availability', icon: PoundSterling },
];

interface ProgressStepProps {
    step: number;
    currentStep: number;
    title: string;
}

const ProgressStep = ({ step, currentStep, title }: ProgressStepProps) => {
    const isActive = step === currentStep;
    const isCompleted = step < currentStep;

    const circleClass = isCompleted 
        ? 'bg-blue-600 text-white' 
        : isActive 
        ? 'border-2 border-blue-600 text-blue-600' 
        : 'border-2 border-gray-300 text-gray-400';
    
    const textClass = `ml-2 text-xs font-semibold hidden sm:inline ${isActive || isCompleted ? 'text-gray-800' : 'text-gray-400'}`;

    return (
        <div className="flex items-center">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm flex-shrink-0 ${circleClass}`}>
                {isCompleted ? '✓' : step}
            </div>
            <span className={textClass}>{title}</span>
        </div>
    );
};

export const ProgressTracker = ({ currentStep }: { currentStep: number }) => (
    <div className="flex justify-between items-center">
        {STEPS.map((s, index) => (
            <React.Fragment key={s.num}>
                <ProgressStep step={s.num} currentStep={currentStep} title={s.title} />
                {index < STEPS.length - 1 && <div className="flex-grow border-t-2 mx-1 sm:mx-2 border-gray-300"></div>}
            </React.Fragment>
        ))}
    </div>
);
