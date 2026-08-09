import React, { useState } from 'react';
import { ExperienceLevel, JobPostDraft } from '../../types';
import { canonicalRoleRegistry } from '../../data/canonicalRoleRegistry';
import { ArrowRight, Sparkles } from '../Icons';
import { AIJobHelper } from '../AIJobHelper';
import { requiresLeadSupervision, hasLeadSupervisionConfirmed } from '../../utils/leadSupervision';

interface JobPostStep1Props {
    jobDetails: JobPostDraft;
    setJobDetails: React.Dispatch<React.SetStateAction<JobPostDraft>>;
    onNext: () => void;
}

export const JobPostStep1 = ({ jobDetails, setJobDetails, onNext }: JobPostStep1Props) => {
    const [showAiHelper, setShowAiHelper] = useState(false);
    const needsLead = requiresLeadSupervision(jobDetails);
    const leadConfirmed = hasLeadSupervisionConfirmed(jobDetails);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setJobDetails(prev => ({ ...prev, [name]: value }));
    };

    const handleRoleSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const roleId = e.target.value;
        const role = canonicalRoleRegistry.find((item) => item.id === roleId);
        if (!role) return;
        setJobDetails(prev => ({
            ...prev,
            canonicalRoleId: role.id,
            jobRole: role.title,
            title: prev.title && prev.canonicalRoleId ? prev.title : role.title,
            deliveryContext: role.level === 'lead'
                ? 'lead'
                : role.level === 'entry'
                    ? 'assisted'
                    : (prev.deliveryContext || 'independent'),
        }));
    };

    const handleLeadAccepted = (e: React.ChangeEvent<HTMLInputElement>) => {
        setJobDetails(prev => ({ ...prev, supervisionDisclaimerAccepted: e.target.checked }));
    };

    const handleNext = () => {
        if (!jobDetails.canonicalRoleId) {
            alert('Please select a Specialist Role to continue.');
            return;
        }

        if (needsLead && !leadConfirmed) {
            alert('This support role must confirm that a qualified engineer, named lead engineer or site supervisor will be present.');
            return;
        }

        onNext();
    };

    return (
        <>
            <h2 className="text-2xl font-bold mb-4">Step 1: Basic Contract Details</h2>
            <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Specialist Role</label>
                        <select name="canonicalRoleId" value={jobDetails.canonicalRoleId || ''} onChange={handleRoleSelect} className="w-full border p-2 rounded bg-white h-[42px]">
                            <option value="" disabled>-- Select a role to define skills --</option>
                            {canonicalRoleRegistry.map(role => (
                                <option key={role.id} value={role.id}>{role.title}</option>
                            ))}
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

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 rounded-lg border border-blue-100 bg-blue-50 p-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Delivery context</label>
                        <select name="deliveryContext" value={jobDetails.deliveryContext || 'independent'} onChange={handleChange} className="w-full border p-2 rounded bg-white h-[42px]">
                            <option value="assisted">Assisted / working under a lead</option>
                            <option value="independent">Independent delivery</option>
                            <option value="lead">Lead / responsible engineer</option>
                        </select>
                        <p className="mt-1 text-xs text-gray-500">Stored with completed-job evidence so future matches can distinguish assisted experience from independent or lead delivery.</p>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Project scale</label>
                        <select name="projectScale" value={jobDetails.projectScale || 'medium'} onChange={handleChange} className="w-full border p-2 rounded bg-white h-[42px]">
                            <option value="small">Small — single task / room</option>
                            <option value="medium">Medium — normal project / several rooms</option>
                            <option value="large">Large — complex site / major deployment</option>
                            <option value="programme">Programme — multi-site / phased rollout</option>
                        </select>
                        <p className="mt-1 text-xs text-gray-500">Project scale is evidence context only; it does not automatically increase a skill rating.</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Supervision arrangement</label>
                        <select name="supervisionArrangement" value={jobDetails.supervisionArrangement || ''} onChange={handleChange} className="w-full border p-2 rounded bg-white h-[42px]">
                            <option value="">Not specified</option>
                            <option value="unsupervised">Engineer working independently</option>
                            <option value="supervised">Supervised / under lead</option>
                            <option value="lead_engineer_present">Named lead engineer present</option>
                            <option value="qualified_engineer_present">Qualified engineer present</option>
                        </select>
                    </div>
                </div>
                {needsLead && (
                    <div className="rounded-lg border border-amber-300 bg-amber-50 p-4 text-sm text-amber-900">
                        <p className="font-bold">Support role supervision disclaimer</p>
                        <p className="mt-1">This role requires a qualified engineer, named lead engineer or site supervisor to be present. The support engineer should assist under direction and should not be given technical ownership of the work.</p>
                        <label className="mt-3 flex items-start gap-2 font-semibold">
                            <input type="checkbox" checked={Boolean(jobDetails.supervisionDisclaimerAccepted)} onChange={handleLeadAccepted} className="mt-1" />
                            <span>I confirm suitable supervision will be provided.</span>
                        </label>
                    </div>
                )}
            </div>
            <div className="flex justify-end mt-6">
                <button onClick={handleNext} disabled={!jobDetails.canonicalRoleId || (needsLead && !leadConfirmed)} className="flex items-center px-6 py-2 bg-blue-600 text-white font-bold rounded-md hover:bg-blue-700 disabled:bg-blue-300">
                    Next: Define Skills <ArrowRight size={18} className="ml-2" />
                </button>
            </div>
        </>
    );
};
