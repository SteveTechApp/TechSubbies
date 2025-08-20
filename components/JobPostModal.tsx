
import React, { useState } from 'react';
import { generateJobDescription } from '../services/geminiService';
import { SKILL_ROLES } from '../constants';
import { PlusCircle, Sparkles, X } from 'lucide-react';

interface JobPostModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const JobPostForm: React.FC<{onClose: () => void}> = ({onClose}) => {
    const [jobTitle, setJobTitle] = useState('');
    const [keywords, setKeywords] = useState('');
    const [roleTitle, setRoleTitle] = useState('');
    const [description, setDescription] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleGenerateDescription = async () => {
        if (!jobTitle || !keywords) {
            alert("Please provide a Job Title and some Keywords first.");
            return;
        }
        setIsLoading(true);
        try {
            const generatedDesc = await generateJobDescription(jobTitle, keywords);
            setDescription(generatedDesc);
        } catch (error) {
            console.error(error);
            setDescription("Failed to generate description.");
        } finally {
            setIsLoading(false);
        }
    };
    
    const handlePostJob = () => {
        // In a real app, this would submit the form data
        alert("Job posted successfully! (Demo)");
        onClose();
    }

    return (
        <div className="space-y-6">
             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <input type="text" placeholder="Job Title (e.g., Senior AV Technician)" className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500" value={jobTitle} onChange={e => setJobTitle(e.target.value)} />
                <select className="w-full p-3 border border-gray-300 rounded-md bg-white focus:ring-2 focus:ring-blue-500" value={roleTitle} onChange={e => setRoleTitle(e.target.value)}>
                    <option value="" disabled>Select Required Role...</option>
                    {SKILL_ROLES.map(role => <option key={role} value={role}>{role}</option>)}
                </select>
                <input type="text" placeholder="Location" className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500" />
                <input type="text" placeholder="Keywords (e.g., Crestron, Dante, Networking)" className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500" value={keywords} onChange={e => setKeywords(e.target.value)} />
            </div>
            <div>
                 <button onClick={handleGenerateDescription} disabled={isLoading} className="flex items-center justify-center bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors disabled:bg-blue-300">
                     <Sparkles size={16} className="mr-2"/>
                     {isLoading ? 'Generating...' : 'Generate Description with AI'}
                 </button>
            </div>
            <textarea placeholder="Job Description" className="w-full p-3 border border-gray-300 rounded-md h-40 focus:ring-2 focus:ring-blue-500" value={description} onChange={e => setDescription(e.target.value)}></textarea>
            <div className="flex justify-end pt-6 mt-6 border-t border-gray-200">
                <button onClick={onClose} className="px-4 py-2 text-sm font-semibold text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 mr-3">
                    Cancel
                </button>
                <button onClick={handlePostJob} className="bg-blue-600 text-white font-bold py-2 px-6 rounded-lg hover:bg-blue-700 transition-colors">
                    Post Job
                </button>
            </div>
        </div>
    );
};

export const JobPostModal: React.FC<JobPostModalProps> = ({ isOpen, onClose }) => {
    if (!isOpen) return null;

    return (
        <div 
            className="fixed inset-0 bg-black bg-opacity-60 z-50 flex items-center justify-center p-4" 
            aria-labelledby="job-post-title" 
            role="dialog" 
            aria-modal="true"
            onClick={onClose}
        >
            <div className="bg-white rounded-lg shadow-xl w-full max-w-3xl transform transition-all" onClick={(e) => e.stopPropagation()}>
                <div className="flex justify-between items-center p-5 border-b border-gray-200">
                    <h2 id="job-post-title" className="text-xl font-bold text-gray-800 flex items-center">
                        <PlusCircle className="mr-2 text-blue-600"/> Post a New Job
                    </h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600" aria-label="Close">
                        <X size={24} />
                    </button>
                </div>
                <div className="p-6 max-h-[70vh] overflow-y-auto">
                    <JobPostForm onClose={onClose} />
                </div>
            </div>
        </div>
    );
};
