import React, { useState, useEffect } from 'react';
import { Currency, JobType, ExperienceLevel, JobRoleDefinition, JobSkillRequirement, SkillImportance, Job } from '../types/index.ts';
import { X, ArrowRight, Save } from './Icons.tsx';
import { JOB_ROLE_DEFINITIONS } from '../data/jobRoles.ts';

interface JobPostModalProps {
    isOpen: boolean;
    onClose: () => void;
    onPostJob: (jobData: Omit<Job, 'id' | 'companyId' | 'postedDate' | 'status'>) => void;
}

export const JobPostModal = ({ isOpen, onClose, onPostJob }: JobPostModalProps) => {
    const [step, setStep] = useState(1);
    const [jobDetails, setJobDetails] = useState({
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
    });
    const [skillRequirements, setSkillRequirements] = useState<JobSkillRequirement[]>([]);
    const [selectedRoleDef, setSelectedRoleDef] = useState<JobRoleDefinition | null>(null);

    // Effect to dynamically load and configure skills based on the selected role, experience level, and job type.
    useEffect(() => {
        if (!isOpen || !jobDetails.jobRole) {
            setSkillRequirements([]);
            setSelectedRoleDef(null);
            return;
        }

        const roleDef = JOB_ROLE_DEFINITIONS.find(r => r.name === jobDetails.jobRole);
        if (roleDef) {
            setSelectedRoleDef(roleDef);

            const experience = jobDetails.experienceLevel;
            const isFullTime = jobDetails.jobType === JobType.FULL_TIME;
            const expertThreshold = isFullTime ? 0.6 : 0.4; // More essentials for full-time
            const seniorThreshold = isFullTime ? 3 : 2; // More essentials for full-time

            let newReqs: JobSkillRequirement[] = [];

            roleDef.skillCategories.forEach(category => {
                let skillsForCategory = [...category.skills];

                // For juniors, we only present a subset of the most fundamental skills.
                if (experience === ExperienceLevel.JUNIOR) {
                    skillsForCategory = skillsForCategory.slice(0, Math.ceil(skillsForCategory.length * 0.6));
                }
                
                // Set default importance based on experience and job type.
                const categoryReqs = skillsForCategory.map((skillDef, index) => {
                    let importance: SkillImportance = 'desirable';
                    if (experience === ExperienceLevel.SENIOR && index < seniorThreshold) {
                        importance = 'essential';
                    } else if (experience === ExperienceLevel.EXPERT && index < Math.ceil(skillsForCategory.length * expertThreshold)) {
                        importance = 'essential';
                    }
                    // FIX: The skill object contains name and description. We only need the name for the requirement.
                    return { name: skillDef.name, importance };
                });

                newReqs.push(...categoryReqs);
            });

            setSkillRequirements(newReqs);
        }
    }, [isOpen, jobDetails.jobRole, jobDetails.experienceLevel, jobDetails.jobType]);


    // Reset state when modal is closed for a clean slate
    useEffect(() => {
        if (!isOpen) {
            setTimeout(() => {
                setStep(1);
                setJobDetails({
                    title: '', description: '', location: 'London, UK', dayRate: '500', duration: '4 weeks', currency: Currency.GBP,
                    startDate: new Date().toISOString().split('T')[0], jobType: JobType.CONTRACT, experienceLevel: ExperienceLevel.MID_LEVEL, jobRole: ''
                });
            }, 300);
        }
    }, [isOpen]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setJobDetails(prev => ({ ...prev, [name]: value }));
    };

    const handleRoleSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const roleName = e.target.value;
        setJobDetails(prev => ({ ...prev, jobRole: roleName, title: roleName }));
    };

    const handleNextStep = () => {
        if (jobDetails.jobRole) {
            setStep(2);
        } else {
            alert("Please select a Specialist Role to continue.");
        }
    };
    
    const handleImportanceToggle = (skillName: string) => {
        setSkillRequirements(prev => prev.map(skill => 
            skill.name === skillName
            ? { ...skill, importance: skill.importance === 'desirable' ? 'essential' : 'desirable' }
            : skill
        ));
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

    const renderStepOne = () => (
        <>
            <h2 className="text-2xl font-bold mb-4">Step 1: Basic Job Details</h2>
            <div className="space-y-4">
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Specialist Role</label>
                        <select name="jobRole" value={jobDetails.jobRole} onChange={handleRoleSelect} className="w-full border p-2 rounded bg-white h-[42px]">
                            <option value="" disabled>-- Select a role to define skills --</option>
                            {JOB_ROLE_DEFINITIONS.map(def => <option key={def.name} value={def.name}>{def.name}</option>)}
                        </select>
                    </div>
                     <div>
                        <label className="block text-sm font-medium text-gray-700">Experience Level</label>
                        <select name="experienceLevel" value={jobDetails.experienceLevel} onChange={handleChange} className="w-full border p-2 rounded bg-white h-[42px]">
                            {Object.values(ExperienceLevel).map(level => <option key={level} value={level}>{level}</option>)}
                        </select>
                    </div>
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Job Title</label>
                    <input name="title" value={jobDetails.title} placeholder="e.g., Lead AV Engineer" onChange={handleChange} className="w-full border p-2 rounded" />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Job Description</label>
                    <textarea name="description" value={jobDetails.description} placeholder="Describe the project, responsibilities, etc..." onChange={handleChange} rows={4} className="w-full border p-2 rounded" />
                </div>
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Location</label>
                        <input name="location" value={jobDetails.location} onChange={handleChange} className="w-full border p-2 rounded" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Job Type</label>
                        <select name="jobType" value={jobDetails.jobType} onChange={handleChange} className="w-full border p-2 rounded bg-white h-[42px]">
                            {Object.values(JobType).map(type => <option key={type} value={type}>{type}</option>)}
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Day Rate ({jobDetails.currency})</label>
                        <input type="number" name="dayRate" value={jobDetails.dayRate} onChange={handleChange} className="w-full border p-2 rounded" />
                    </div>
                     <div>
                        <label className="block text-sm font-medium text-gray-700">Start Date</label>
                        <input type="date" name="startDate" value={jobDetails.startDate} onChange={handleChange} className="w-full border p-2 rounded" />
                    </div>
                </div>
            </div>
             <div className="flex justify-end mt-6">
                <button onClick={handleNextStep} disabled={!jobDetails.jobRole} className="flex items-center px-6 py-2 bg-blue-600 text-white font-bold rounded-md hover:bg-blue-700 disabled:bg-blue-300">
                    Next: Define Skills <ArrowRight size={18} className="ml-2" />
                </button>
            </div>
        </>
    );

    const renderStepTwo = () => (
        <>
            <h2 className="text-2xl font-bold mb-2">Step 2: Define Skill Importance</h2>
            <p className="text-gray-500 mb-4">Mark skills as 'Essential' or 'Desirable'. This will power the AI matching.</p>
            <div className="space-y-4 max-h-[50vh] overflow-y-auto custom-scrollbar pr-2">
                {selectedRoleDef?.skillCategories.map(category => (
                    <div key={category.category} className="p-4 bg-gray-50 rounded-lg border">
                        <h3 className="font-bold text-lg text-blue-700 mb-3 border-b pb-2">{category.category}</h3>
                        <div className="space-y-2">
                            {/* FIX: Check for skill name within the skill definition object array. */}
                            {skillRequirements.filter(skillReq => category.skills.some(skillDef => skillDef.name === skillReq.name)).map(skill => {
                                const isEssential = skill.importance === 'essential';
                                return (
                                    <div key={skill.name} className="flex items-center justify-between p-2 bg-white rounded-md">
                                        <span className="font-medium text-gray-700 text-sm">{skill.name}</span>
                                        <div className="flex items-center gap-2">
                                            <button type="button" onClick={() => handleImportanceToggle(skill.name)} className={`px-3 py-1 text-xs font-bold rounded-full ${!isEssential ? 'bg-blue-200 text-blue-800' : 'bg-gray-200 text-gray-600'}`}>Desirable</button>
                                            <button type="button" onClick={() => handleImportanceToggle(skill.name)} className={`px-3 py-1 text-xs font-bold rounded-full ${isEssential ? 'bg-yellow-400 text-yellow-900' : 'bg-gray-200 text-gray-600'}`}>Essential</button>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                ))}
            </div>
             <div className="flex justify-between items-center mt-6 pt-4 border-t">
                <button onClick={() => setStep(1)} className="px-6 py-2 bg-gray-200 rounded-md hover:bg-gray-300">Back</button>
                <button onClick={handleSubmit} className="flex items-center px-6 py-2 bg-green-600 text-white font-bold rounded-md hover:bg-green-700">
                    <Save size={18} className="mr-2" />
                    Post Job
                </button>
            </div>
        </>
    );


    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50 p-4">
            <div className="bg-white rounded-lg p-8 max-w-3xl w-full relative transform transition-all duration-300 flex flex-col" onClick={e => e.stopPropagation()}>
                <button onClick={onClose} className="absolute top-4 right-4 text-gray-500 hover:text-gray-800"><X /></button>
                {step === 1 ? renderStepOne() : renderStepTwo()}
            </div>
        </div>
    );
};