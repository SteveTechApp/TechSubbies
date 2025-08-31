import React from 'react';
import { User, Briefcase, PoundSterling, Calendar, ShieldCheck } from '../Icons.tsx';

const STEPS = [
    { num: 1, title: 'Account', icon: User },
    { num: 2, title: 'Discipline', icon: Briefcase },
    { num: 3, title: 'Readiness', icon: ShieldCheck },
    { num: 4, title: 'Rate', icon: PoundSterling },
    { num: 5, title: 'Availability', icon: Calendar },
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

    return (
        <div className="flex items-center">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${circleClass}`}>
                {isCompleted ? '✓' : step}
            </div>
            <span className={`ml-3 font-semibold ${isActive || isCompleted ? 'text-gray-800' : 'text-gray-400'}`}>{title}</span>
        </div>
    );
};

export const ProgressTracker = ({ currentStep }: { currentStep: number }) => (
    <div className="flex justify-between items-center">
        {STEPS.map((s, index) => (
            <React.Fragment key={s.num}>
                <ProgressStep step={s.num} currentStep={currentStep} title={s.title} />
                {index < STEPS.length - 1 && <div className="flex-grow border-t-2 mx-4 border-gray-300"></div>}
            </React.Fragment>
        ))}
    </div>
);
