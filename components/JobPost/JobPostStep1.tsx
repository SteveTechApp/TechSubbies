import React, { useState } from 'react';
import { JobType, ExperienceLevel } from '../../types';
import { JOB_ROLE_DEFINITIONS } from '../../data/jobRoles';
import { ArrowRight, Sparkles } from '../Icons';
import { AIJobHelper } from '../AIJobHelper';

interface JobPostStep1Props {
    jobDetails: any;
    setJobDetails: (details: any) => void;
    onNext: () => void;
}

export const JobPostStep1 = ({ jobDetails, setJobDetails, onNext }: JobPostStep1Props) => {
    const [showAiHelper, setShowAiHelper] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setJobDetails((prev: any) => ({ ...prev, [name]: value }));
    };

    const handleRoleSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const roleName = e.target.value;
        setJobDetails((prev: any) => ({ ...prev, jobRole: roleName, title: roleName }));
    };

    return (
        <>
            <h2 className="text-2xl font-bold mb-4">Step 1: Basic Contract Details</h2>
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
                    <label className="block text-sm font-medium text-gray-700">Contract Title</label>
                    <input name="title" value={jobDetails.title} placeholder="e.g., Lead AV Engineer" onChange={handleChange} className="w-full border p-2 rounded" />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Project Description</label>
                    <textarea name="description" value={jobDetails.description} placeholder="Describe the project, responsibilities, etc..." onChange={handleChange} rows={4} className="w-full border p-2 rounded" />
                     <div className="mt-2">
                        <button type="button" onClick={() => setShowAiHelper(!showAiHelper)} className="text-sm font-semibold text-purple-600 hover:underline flex items-center">
                            <Sparkles size={16} className="mr-1.5" />
                            {showAiHelper ? 'Hide AI Assistant' : 'Improve with AI Assistant'}
                        </button>
                    </div>
                    {showAiHelper && <AIJobHelper jobDetails={jobDetails} setJobDetails={setJobDetails} />}
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Location</label>
                        <input name="location" value={jobDetails.location} onChange={handleChange} className="w-full border p-2 rounded" />
                    </div>
                     <div>
                        <label className="block text-sm font-medium text-gray-700">Day Rate ({jobDetails.currency})</label>
                        <input type="number" name="dayRate" value={jobDetails.dayRate} onChange={handleChange} className="w-full border p-2 rounded" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Estimated Duration</label>
                        <input name="duration" value={jobDetails.duration} onChange={handleChange} placeholder="e.g., 4 weeks" className="w-full border p-2 rounded" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Start Date</label>
                        <input type="date" name="startDate" value={jobDetails.startDate} onChange={handleChange} className="w-full border p-2 rounded" />
                    </div>
                </div>
            </div>
            <div className="flex justify-end mt-6">
                <button onClick={onNext} disabled={!jobDetails.jobRole} className="flex items-center px-6 py-2 bg-blue-600 text-white font-bold rounded-md hover:bg-blue-700 disabled:bg-blue-300">
                    Next: Define Skills <ArrowRight size={18} className="ml-2" />
                </button>
            </div>
        </>
    );
};