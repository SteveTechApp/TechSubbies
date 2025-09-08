import React from 'react';
import { EngineerProfile } from '../../types';
import { Plus, Trash2 } from '../Icons';

interface ProfilePortfolioProps {
    formData: EngineerProfile;
    setFormData: React.Dispatch<React.SetStateAction<EngineerProfile>>;
}

const generateUniqueId = () => `cs-${Math.random().toString(36).substring(2, 10)}`;

export const ProfilePortfolio = ({ formData, setFormData }: ProfilePortfolioProps) => {

    const addCaseStudy = () => {
        setFormData(prev => ({...prev, caseStudies: [...(prev.caseStudies || []), { id: generateUniqueId(), name: 'New Project', url: 'https://' }]}));
    };

    const removeCaseStudy = (id: string) => {
        setFormData(prev => ({ ...prev, caseStudies: prev.caseStudies?.filter(cs => cs.id !== id) }));
    };

    const handleCaseStudyChange = (id: string, field: 'name' | 'url', value: string) => {
        setFormData(prev => ({ ...prev, caseStudies: (prev.caseStudies || []).map(cs => cs.id === id ? { ...cs, [field]: value } : cs) }));
    };

    const caseStudies = formData.caseStudies || [];

    return (
        <div className="space-y-4">
            <p className="text-sm text-gray-500">Add links to your portfolio, project descriptions, or display your visual case studies created with the Storyboard tool.</p>
            {caseStudies.length > 0 && caseStudies.map(cs => {
                const isStoryboard = cs.url.startsWith('techsubbies://storyboard');
                return (
                    <div key={cs.id} className="flex items-center gap-2">
                        <input 
                            type="text" 
                            placeholder="Project Name" 
                            value={cs.name} 
                            onChange={isStoryboard ? undefined : e => handleCaseStudyChange(cs.id, 'name', e.target.value)} 
                            readOnly={isStoryboard}
                            className={`w-1/3 border p-2 rounded ${isStoryboard ? 'bg-gray-100 font-semibold' : ''}`}
                        />
                        <input 
                            type="url" 
                            placeholder="https://example.com/project-case-study" 
                            value={isStoryboard ? 'Internal Storyboard Case Study' : cs.url}
                            onChange={isStoryboard ? undefined : e => handleCaseStudyChange(cs.id, 'url', e.target.value)} 
                            readOnly={isStoryboard}
                            className={`w-2/3 border p-2 rounded ${isStoryboard ? 'bg-gray-100 italic' : ''}`}
                        />
                        <button type="button" onClick={() => removeCaseStudy(cs.id)} className="text-red-500 hover:text-red-700 p-2">
                            <Trash2 size={18} />
                        </button>
                    </div>
                );
            })}
            <button 
                type="button" 
                onClick={addCaseStudy} 
                className="flex items-center text-blue-600 font-semibold hover:text-blue-800 pt-3 mt-3 border-t w-full"
            >
                <Plus size={18} className="mr-1" /> Add External Portfolio Link
            </button>
        </div>
    );
};