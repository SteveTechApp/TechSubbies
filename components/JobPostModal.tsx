import React, { useState } from 'react';
import { useAppContext } from '../context/AppContext.tsx';
import { Currency, JobType, ExperienceLevel } from '../types/index.ts';
import { X, Lightbulb } from './Icons.tsx';

interface JobPostModalProps {
    isOpen: boolean;
    onClose: () => void;
    onPostJob: (jobData: any) => void;
}

interface SuggestedTeamMember {
    role: string;
    skills: string[];
}

export const JobPostModal = ({ isOpen, onClose, onPostJob }: JobPostModalProps) => {
  const [jobDetails, setJobDetails] = useState({
    title: '', description: '', location: '', dayRate: '500', duration: '4 weeks', currency: Currency.GBP, startDate: '',
    jobType: JobType.CONTRACT, experienceLevel: ExperienceLevel.MID_LEVEL,
  });
  const [suggestedTeam, setSuggestedTeam] = useState<SuggestedTeamMember[] | null>(null);
  const [isSuggesting, setIsSuggesting] = useState(false);
  const { geminiService } = useAppContext();

  if (!isOpen) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setJobDetails(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = () => {
    onPostJob(jobDetails);
    onClose();
  };

  const handleSuggestTeam = async () => {
    if (!jobDetails.description) return;
    setIsSuggesting(true);
    const result = await geminiService.suggestTeamForProject(jobDetails.description);
    setSuggestedTeam(result?.team || null);
    setIsSuggesting(false);
  };

  const suggestButtonText = isSuggesting ? 'Thinking...' : 'Suggest Roles';

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4">
      <div className="bg-white rounded-lg p-8 max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Post a New Job</h2>
          <button onClick={onClose}><X className="text-gray-500" /></button>
        </div>
        <div className="space-y-4">
          <div> 
            <label className="block text-sm font-medium text-gray-700">Job Title</label>
            <input name="title" placeholder="e.g., Lead AV Engineer" onChange={handleChange} className="w-full border p-2 rounded" />
          </div>
          <div> 
            <label className="block text-sm font-medium text-gray-700">Job Description</label>
            <textarea name="description" placeholder="Describe the project, responsibilities, and required skills..." onChange={handleChange} rows={6} className="w-full border p-2 rounded" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Location</label>
              <input name="location" placeholder="e.g., London, UK" onChange={handleChange} className="w-full border p-2 rounded" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Duration</label>
              <input name="duration" placeholder="e.g., 6 weeks" onChange={handleChange} className="w-full border p-2 rounded" />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
                <label className="block text-sm font-medium text-gray-700">Job Type</label>
                <select name="jobType" value={jobDetails.jobType} onChange={handleChange} className="w-full border p-2 rounded bg-white h-[42px]">
                    {Object.values(JobType).map(type => <option key={type} value={type}>{type}</option>)}
                </select>
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-700">Experience Level</label>
                <select name="experienceLevel" value={jobDetails.experienceLevel} onChange={handleChange} className="w-full border p-2 rounded bg-white h-[42px]">
                    {Object.values(ExperienceLevel).map(level => <option key={level} value={level}>{level}</option>)}
                </select>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Currency</label>
              <select name="currency" onChange={handleChange} className="w-full border p-2 rounded bg-white h-[42px]">
                <option value={Currency.GBP}>GBP (£)</option>
                <option value={Currency.USD}>USD ($)</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Day Rate</label>
              <input type="number" name="dayRate" placeholder="e.g., 550" onChange={handleChange} className="w-full border p-2 rounded" />
            </div>
             <div>
              <label className="block text-sm font-medium text-gray-700">Start Date</label>
              <input type="date" name="startDate" value={jobDetails.startDate} onChange={handleChange} className="w-full border p-2 rounded h-[42px]" />
            </div>
          </div>
          <div className="p-4 bg-blue-50 border border-blue-200 rounded-md">
            <h3 className="font-bold text-blue-800 mb-2 flex items-center"><Lightbulb className="w-5 h-5 mr-2" /> AI Team Suggestion</h3>
            <p className="text-sm text-gray-600 mb-3">Based on your job description, let AI suggest the roles you might need to hire.</p>
            <button onClick={handleSuggestTeam} disabled={isSuggesting || !jobDetails.description} className="px-4 py-2 text-sm bg-blue-600 text-white rounded disabled:bg-blue-300"> 
              {suggestButtonText}
            </button>
            {suggestedTeam && (
                <div className="mt-4">
                    <h4 className="font-semibold">Suggested Team Structure:</h4>
                    <ul className="list-disc pl-5 mt-2"> 
                        {suggestedTeam.map(member => (
                            <li key={member.role}> 
                                <strong>{member.role}: </strong>
                                {member.skills.join(', ')}
                            </li>
                        ))}
                    </ul>
                </div>
            )}
          </div>
        </div>
        <div className="flex justify-end space-x-4 mt-6">
          <button onClick={onClose} className="px-6 py-2 bg-gray-200 rounded">Cancel</button>
          <button onClick={handleSubmit} className="px-6 py-2 bg-blue-600 text-white rounded">Post Job</button>
        </div>
      </div>
    </div>
  );
};