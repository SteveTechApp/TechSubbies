

import React, { useEffect, useState } from 'react';
import { JobSkillRequirement, SkillImportance } from '../../types';
import { Save, Loader, Sparkles } from '../Icons';
import { useAppContext } from '../../context/AppContext';

interface JobPostStep2Props {
    jobDetails: any;
    skillRequirements: JobSkillRequirement[];
    // FIX: Corrected the type definition to allow for state setter callbacks, which is the standard for React's useState setters.
    setSkillRequirements: React.Dispatch<React.SetStateAction<JobSkillRequirement[]>>;
    onBack: () => void;
    onSubmit: () => void;
}

const SkillRequirementSelector = ({ skill, selection, onSelect }: { skill: JobSkillRequirement, selection: SkillImportance | 'N/A', onSelect: (importance: SkillImportance | 'N/A') => void }) => {
    const getButtonClass = (value: SkillImportance | 'N/A') => {
        let base = 'px-3 py-1 text-xs font-bold rounded-full';
        if (value === selection) {
            if (value === 'essential') return `${base} bg-yellow-400 text-yellow-900`;
            if (value === 'desirable') return `${base} bg-blue-200 text-blue-800`;
            return `${base} bg-gray-400 text-white`;
        }
        return `${base} bg-gray-200 text-gray-600 hover:bg-gray-300`;
    };

    return (
        <div className="flex items-center justify-between p-2 bg-white rounded-md">
            <span className="font-medium text-gray-700 text-sm">{skill.name}</span>
            <div className="flex items-center gap-2">
                <button type="button" onClick={() => onSelect('essential')} className={getButtonClass('essential')}>Essential</button>
                <button type="button" onClick={() => onSelect('desirable')} className={getButtonClass('desirable')}>Desirable</button>
                <button type="button" onClick={() => onSelect('N/A')} className={getButtonClass('N/A')}>N/A</button>
            </div>
        </div>
    );
};

export const JobPostStep2 = ({ jobDetails, skillRequirements, setSkillRequirements, onBack, onSubmit }: JobPostStep2Props) => {
    const { geminiService } = useAppContext();
    const [isLoading, setIsLoading] = useState(false);
    const [aiSuggestedSkills, setAiSuggestedSkills] = useState<JobSkillRequirement[] | null>(null);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchSkills = async () => {
            if (!jobDetails.jobRole) return;
            setIsLoading(true);
            setError('');
            setAiSuggestedSkills(null);

            const result = await geminiService.suggestSkillsForJobRole(jobDetails.jobRole);
            
            if (result.error) {
                setError(result.error);
            } else if (result.skills) {
                setAiSuggestedSkills(result.skills);
                setSkillRequirements(result.skills); // Pre-populate with AI suggestions
            } else {
                setError("An unexpected error occurred while fetching skills.");
            }
            setIsLoading(false);
        };

        fetchSkills();
    }, [jobDetails.jobRole, geminiService, setSkillRequirements]);

    const handleSkillSelectionChange = (skillName: string, newImportance: SkillImportance | 'N/A') => {
        setSkillRequirements(prevReqs => {
            const existingIndex = prevReqs.findIndex(s => s.name === skillName);

            if (newImportance === 'N/A') {
                return existingIndex > -1 ? prevReqs.filter(s => s.name !== skillName) : prevReqs;
            }
            
            if (existingIndex > -1) {
                const updatedReqs = [...prevReqs];
                updatedReqs[existingIndex].importance = newImportance;
                return updatedReqs;
            }
            
            return [...prevReqs, { name: skillName, importance: newImportance }];
        });
    };
    
    const getSkillSelection = (skillName: string): SkillImportance | 'N/A' => {
        const skill = skillRequirements.find(s => s.name === skillName);
        return skill ? skill.importance : 'N/A';
    };


    return (
        <>
            <h2 className="text-2xl font-bold mb-2 flex items-center"><Sparkles className="mr-2 text-purple-600"/> Step 2: AI-Powered Skill Selection</h2>
            <p className="text-gray-500 mb-4">We've suggested key skills for a <strong>{jobDetails.jobRole}</strong>. Refine the list to match your exact needs.</p>
            
            <div className="space-y-2 max-h-[50vh] overflow-y-auto custom-scrollbar pr-2 p-4 bg-gray-50 rounded-lg border">
                {isLoading && (
                    <div className="flex items-center justify-center p-8">
                        <Loader className="animate-spin w-8 h-8 text-blue-600 mr-3" />
                        <span className="font-semibold text-gray-700">Generating skill suggestions...</span>
                    </div>
                )}
                {error && <p className="text-red-500 text-center">{error}</p>}
                {aiSuggestedSkills && (
                     <div className="space-y-2">
                        {aiSuggestedSkills.map(skill => (
                           <SkillRequirementSelector
                                key={skill.name}
                                skill={skill}
                                selection={getSkillSelection(skill.name)}
                                onSelect={(importance) => handleSkillSelectionChange(skill.name, importance)}
                            />
                        ))}
                    </div>
                )}
            </div>
            
            <div className="flex justify-between items-center mt-6 pt-4 border-t">
                <button onClick={onBack} className="px-6 py-2 bg-gray-200 rounded-md hover:bg-gray-300">Back</button>
                <button onClick={onSubmit} className="flex items-center px-6 py-2 bg-green-600 text-white font-bold rounded-md hover:bg-green-700">
                    <Save size={18} className="mr-2" /> Post Job
                </button>
            </div>
        </>
    );
};