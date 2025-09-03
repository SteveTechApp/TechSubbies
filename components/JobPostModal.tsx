import React, { useState, useEffect } from 'react';
import { Currency, JobType, ExperienceLevel, JobSkillRequirement, Job } from '../types/index.ts';
import { X } from './Icons.tsx';
import { JobPostStep1 } from './JobPost/JobPostStep1.tsx';
import { JobPostStep2 } from './JobPost/JobPostStep2.tsx';

interface JobPostModalProps {
    isOpen: boolean;
    onClose: () => void;
    onPostJob: (jobData: Omit<Job, 'id' | 'companyId' | 'postedDate' | 'status'>) => void;
}

const initialJobDetails = {
    title: '',
    description: '',
    location: 'London, UK',
    dayRate: '500',
    duration: '4 weeks',
    currency: Currency.GBP,
    startDate: new Date().toISOString().split('T')[0],
    jobType: JobType.CONTRACT,
    experienceLevel: ExperienceLevel.MID_LEVEL,
    jobRole: ''
};

export const JobPostModal = ({ isOpen, onClose, onPostJob }: JobPostModalProps) => {
    const [step, setStep] = useState(1);
    const [jobDetails, setJobDetails] = useState(initialJobDetails);
    const [skillRequirements, setSkillRequirements] = useState<JobSkillRequirement[]>([]);

    useEffect(() => {
        if (!isOpen) {
            const timer = setTimeout(() => {
                setStep(1);
                setJobDetails(initialJobDetails);
                setSkillRequirements([]);
            }, 300); // Delay reset for closing animation
            return () => clearTimeout(timer);
        }
    }, [isOpen]);

    const handleNextStep = () => {
        if (jobDetails.jobRole) {
            setStep(2);
        } else {
            alert("Please select a Specialist Role to continue.");
        }
    };

    const handleSubmit = () => {
        onPostJob({
            ...jobDetails,
            skillRequirements,
            startDate: jobDetails.startDate ? new Date(jobDetails.startDate) : null,
        });
        onClose();
    };
    
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50 p-4">
            <div className="bg-white rounded-lg p-8 max-w-3xl w-full relative transform transition-all duration-300 flex flex-col" onClick={e => e.stopPropagation()}>
                <button onClick={onClose} className="absolute top-4 right-4 text-gray-500 hover:text-gray-800" aria-label="Close modal"><X /></button>
                
                {step === 1 && (
                    <JobPostStep1 
                        jobDetails={jobDetails}
                        setJobDetails={setJobDetails}
                        onNext={handleNextStep}
                    />
                )}
                
                {step === 2 && (
                     <JobPostStep2
                        jobDetails={jobDetails}
                        skillRequirements={skillRequirements}
                        setSkillRequirements={setSkillRequirements}
                        onBack={() => setStep(1)}
                        onSubmit={handleSubmit}
                    />
                )}
            </div>
        </div>
    );
};
