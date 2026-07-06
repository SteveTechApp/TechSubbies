import React, { useEffect, useState } from 'react';
import { JobSkillRequirement, SkillImportance } from '../../types';
import { Save, Loader, Sparkles, X } from '../Icons';
import { useAppContext } from '../../context/InteractionContext';
import { getSkillBand } from '../../utils/skillBands';

interface JobPostStep2Props {
    jobDetails: any;
    skillRequirements: JobSkillRequirement[];
    setSkillRequirements: React.Dispatch<React.SetStateAction<JobSkillRequirement[]>>;
    onBack: () => void;
    onSubmit: () => void;
}

// A required level of 60+ ("Excellent" or above) is treated as essential
// for anything still reading the older importance flag; below that is
// desirable. Keeps older consumers (AI prompts, mock data readers) working
// without needing to understand the new numeric scale.
function levelToImportance(level: number): SkillImportance {
    return level >= 60 ? SkillImportance.ESSENTIAL : SkillImportance.DESIRABLE;
}

const SkillRequirementSlider = ({
    skill,
    level,
    onLevelChange,
    onRemove,
}: {
    skill: JobSkillRequirement;
    level: number;
    onLevelChange: (level: number) => void;
    onRemove: () => void;
}) => {
    const band = getSkillBand(level);

    return (
        <div className="p-3 bg-white rounded-md">
            <div className="flex items-center justify-between mb-1">
                <span className="font-medium text-gray-700 text-sm">{skill.name}</span>
                <div className="flex items-center gap-2">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${band.bg} ${band.text}`}>
                        {level} · {band.label}
                    </span>
                    <button type="button" onClick={onRemove} className="text-gray-400 hover:text-red-500" aria-label={`Remove ${skill.name}`}>
                        <X size={16} />
                    </button>
                </div>
            </div>
            <input
                type="range"
                min={0}
                max={100}
                step={5}
                value={level}
                onChange={(e) => onLevelChange(Number(e.target.value))}
                className={`w-full h-2 rounded-lg appearance-none cursor-pointer ${band.accent}`}
            />
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

    const handleLevelChange = (skillName: string, newLevel: number) => {
        setSkillRequirements(prevReqs => {
            const existingIndex = prevReqs.findIndex(s => s.name === skillName);
            const updated: JobSkillRequirement = { name: skillName, requiredLevel: newLevel, importance: levelToImportance(newLevel) };

            if (existingIndex > -1) {
                const updatedReqs = [...prevReqs];
                updatedReqs[existingIndex] = updated;
                return updatedReqs;
            }

            return [...prevReqs, updated];
        });
    };

    const handleRemoveSkill = (skillName: string) => {
        setSkillRequirements(prevReqs => prevReqs.filter(s => s.name !== skillName));
    };

    const getSkillLevel = (skillName: string): number => {
        const skill = skillRequirements.find(s => s.name === skillName);
        if (!skill) return 35; // Not currently required - default if re-added.
        return typeof skill.requiredLevel === 'number' ? skill.requiredLevel : (skill.importance === SkillImportance.ESSENTIAL ? 60 : 35);
    };


    const removedSuggestions = (aiSuggestedSkills || []).filter(
        s => !skillRequirements.some(req => req.name === s.name)
    );

    return (
        <>
            <h2 className="text-2xl font-bold mb-2 flex items-center"><Sparkles className="mr-2 text-purple-600"/> Step 2: Required Skill Levels</h2>
            <p className="text-gray-500 mb-4">We've suggested key skills for a <strong>{jobDetails.jobRole}</strong>. Set the minimum level (0-100) you need for each - only engineers meeting that level will be treated as a strong match.</p>

            <div className="space-y-2 max-h-[50vh] overflow-y-auto custom-scrollbar pr-2 p-4 bg-gray-50 rounded-lg border">
                {isLoading && (
                    <div className="flex items-center justify-center p-8">
                        <Loader className="animate-spin w-8 h-8 text-blue-600 mr-3" />
                        <span className="font-semibold text-gray-700">Generating skill suggestions...</span>
                    </div>
                )}
                {error && <p className="text-red-500 text-center">{error}</p>}
                {skillRequirements.length > 0 && (
                     <div className="space-y-2">
                        {skillRequirements.map(skill => (
                           <SkillRequirementSlider
                                key={skill.name}
                                skill={skill}
                                level={getSkillLevel(skill.name)}
                                onLevelChange={(level) => handleLevelChange(skill.name, level)}
                                onRemove={() => handleRemoveSkill(skill.name)}
                            />
                        ))}
                    </div>
                )}
                {removedSuggestions.length > 0 && (
                    <div className="pt-2">
                        <p className="text-xs font-semibold text-gray-500 mb-1">Removed - click to add back:</p>
                        <div className="flex flex-wrap gap-2">
                            {removedSuggestions.map(skill => (
                                <button
                                    key={skill.name}
                                    type="button"
                                    onClick={() => handleLevelChange(skill.name, 35)}
                                    className="px-3 py-1 text-xs font-semibold bg-gray-200 text-gray-600 rounded-full hover:bg-gray-300"
                                >
                                    + {skill.name}
                                </button>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            <div className="flex justify-between items-center mt-6 pt-4 border-t">
                <button onClick={onBack} className="px-6 py-2 bg-gray-200 rounded-md hover:bg-gray-300">Back</button>
                <button onClick={onSubmit} className="flex items-center px-6 py-2 bg-green-600 text-white font-bold rounded-md hover:bg-green-700">
                    <Save size={18} className="mr-2" />
                    Post Job
                </button>
            </div>
        </>
    );
};
