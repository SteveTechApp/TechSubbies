import React, { useState, useEffect } from 'react';
import { SelectedJobRole, JobRoleDefinition, RatedSkill } from '../types/index.ts';
import { JOB_ROLE_DEFINITIONS } from '../data/jobRoles.ts';
import { X, Save } from './Icons.tsx';

interface EditSkillProfileModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (role: SelectedJobRole) => void;
    availableRoles: JobRoleDefinition[];
    // `initialRole` is optional. If provided, we're in "edit" mode.
    // Otherwise, we're in "add" mode.
    initialRole?: SelectedJobRole;
}

// --- START: UI Enhancement Helpers ---
// This new helper provides a comprehensive style object for the rating.
const getRatingStyles = (rating: number): { bg: string; text: string; accent: string; descriptor: string } => {
    if (rating < 25) return { bg: 'bg-gray-100', text: 'text-gray-700', accent: 'accent-gray-500', descriptor: 'Novice' };
    if (rating < 50) return { bg: 'bg-yellow-100', text: 'text-yellow-800', accent: 'accent-yellow-500', descriptor: 'Competent' };
    if (rating < 75) return { bg: 'bg-blue-100', text: 'text-blue-800', accent: 'accent-blue-500', descriptor: 'Proficient' };
    return { bg: 'bg-green-100', text: 'text-green-800', accent: 'accent-green-500', descriptor: 'Expert' };
};
// --- END: UI Enhancement Helpers ---


export const EditSkillProfileModal = ({ isOpen, onClose, onSave, availableRoles, initialRole }: EditSkillProfileModalProps) => {
    const [selectedRoleDef, setSelectedRoleDef] = useState<JobRoleDefinition | null>(null);
    const [currentRole, setCurrentRole] = useState<SelectedJobRole | null>(initialRole || null);

    useEffect(() => {
        // Reset state when modal is opened for adding a new role
        if (isOpen && !initialRole) {
            setCurrentRole(null);
            setSelectedRoleDef(null);
            return;
        }
        
        // Set state if opened for editing, and synchronize skills
        if (isOpen && initialRole) {
            const roleDef = JOB_ROLE_DEFINITIONS.find(def => def.name === initialRole.roleName);
            setSelectedRoleDef(roleDef || null);
    
            if (roleDef) {
                // Synchronize the user's saved skills with the canonical list from the definition.
                // This handles cases where new skills have been added to a role definition since the user last saved it.
                const allCanonicalSkills = roleDef.skillCategories.flatMap(category => category.skills);
                const userSkillsMap = new Map(initialRole.skills.map(skill => [skill.name, skill.rating]));
    
                const synchronizedSkills: RatedSkill[] = allCanonicalSkills.map(canonicalSkill => ({
                    name: canonicalSkill.name,
                    // Use the user's saved rating if it exists, otherwise default to 1 to prompt them to rate it.
                    rating: userSkillsMap.get(canonicalSkill.name) || 1,
                }));
    
                // Recalculate the overall score based on the potentially updated skill list.
                const totalScore = synchronizedSkills.reduce((acc, skill) => acc + skill.rating, 0);
                const newOverallScore = synchronizedSkills.length > 0 ? Math.round(totalScore / synchronizedSkills.length) : 0;
    
                setCurrentRole({
                    ...initialRole,
                    skills: synchronizedSkills,
                    overallScore: newOverallScore,
                });
            } else {
                // Fallback if the role definition is not found for some reason
                setCurrentRole(initialRole);
            }
        }
    }, [isOpen, initialRole]);

    if (!isOpen) return null;

    const handleRoleSelect = (roleName: string) => {
        const roleDef = JOB_ROLE_DEFINITIONS.find(r => r.name === roleName);
        if (roleDef) {
            setSelectedRoleDef(roleDef);
            const allSkills = roleDef.skillCategories.flatMap(category => category.skills);
            const newRole: SelectedJobRole = {
                roleName: roleDef.name,
                skills: allSkills.map(skill => ({ name: skill.name, rating: 50 })), // Default rating 50
                overallScore: 50
            };
            setCurrentRole(newRole);
        }
    };
    
    const handleSkillChange = (skillName: string, value: string) => {
        if (!currentRole) return;

        const newSkills = currentRole.skills.map(skill => 
            skill.name === skillName ? { ...skill, rating: parseInt(value, 10) } : skill
        );

        const totalScore = newSkills.reduce((acc, skill) => acc + skill.rating, 0);
        const newOverallScore = newSkills.length > 0 ? Math.round(totalScore / newSkills.length) : 0;

        setCurrentRole({
            ...currentRole,
            skills: newSkills,
            overallScore: newOverallScore,
        });
    };

    const handleSave = () => {
        if (currentRole) {
            onSave(currentRole);
            onClose();
        }
    };
    
    const canSave = currentRole && currentRole.skills.every(s => s.rating > 0);
    
    const overallScore = currentRole?.overallScore ?? 0;
    const overallScoreStyles = getRatingStyles(overallScore);

    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50 p-4" onClick={onClose}>
            <div className="bg-white rounded-lg m-4 max-w-4xl w-full relative transform transition-all duration-300 max-h-[90vh] flex flex-col" onClick={e => e.stopPropagation()}>
                <div className="flex-shrink-0 p-6 border-b">
                    <button onClick={onClose} className="absolute top-4 right-4 text-gray-500 hover:text-gray-800">
                        <X size={24} />
                    </button>
                    <h2 className="text-2xl font-bold">{initialRole ? `Edit Role: ${initialRole.roleName}` : 'Add a Specialist Role'}</h2>
                </div>
                
                <div className="flex-grow overflow-y-auto custom-scrollbar p-6">
                    {!initialRole && !currentRole && (
                        <div className="fade-in-up">
                            <label className="block font-medium mb-2">1. Select a role from the list:</label>
                            <select
                                onChange={(e) => handleRoleSelect(e.target.value)}
                                value=""
                                className="w-full border p-2 rounded bg-white focus:ring-2 focus:ring-blue-500"
                            >
                                <option value="" disabled>-- Choose a Specialist Role --</option>
                                {availableRoles.map(def => (
                                    <option key={def.name} value={def.name}>{def.name}</option>
                                ))}
                            </select>
                        </div>
                    )}
                    
                    {currentRole && selectedRoleDef && (
                        <div className="fade-in-up space-y-4">
                            {!initialRole && <p className="font-medium">2. Rate your competency for each skill (hover for info):</p>}
                            
                            <div className="space-y-4">
                                {selectedRoleDef.skillCategories.map(category => (
                                    <div key={category.category} className="p-4 bg-gray-50 rounded-lg border">
                                        <h3 className="font-bold text-lg text-blue-700 mb-3 border-b pb-2">{category.category}</h3>
                                        <div className="divide-y divide-gray-200">
                                            {category.skills.map(skillDef => {
                                                const skill = currentRole.skills.find(s => s.name === skillDef.name);
                                                if (!skill) return null;
                                                const ratingStyles = getRatingStyles(skill.rating);
                                                
                                                return (
                                                    <div key={skillDef.name} className="py-3">
                                                         <div className="flex justify-between items-center mb-1">
                                                            <div className="block font-medium text-gray-700 text-sm tooltip-container">
                                                                {skillDef.name}
                                                                <span className="tooltip-text">{skillDef.description}</span>
                                                            </div>
                                                            <div className={`flex items-baseline gap-2 flex-shrink-0 px-2.5 py-1 rounded-full transition-colors duration-200 min-w-[120px] justify-center ${ratingStyles.bg}`}>
                                                                <span className={`text-lg font-bold ${ratingStyles.text}`}>{skill.rating}</span>
                                                                <span className={`text-xs font-semibold ${ratingStyles.text}`}>{ratingStyles.descriptor}</span>
                                                            </div>
                                                        </div>
                                                        <input 
                                                            type="range" 
                                                            min="1" max="100" 
                                                            value={skill.rating} 
                                                            onChange={e => handleSkillChange(skillDef.name, e.target.value)} 
                                                            className={`w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer ${ratingStyles.accent}`}
                                                        />
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
                
                <div className="flex-shrink-0 flex justify-between items-center space-x-4 p-6 border-t bg-gray-50 rounded-b-lg">
                    {currentRole && (
                        <div className="flex items-center gap-3">
                            <span className="text-sm font-semibold text-gray-600">Overall Role Score:</span>
                            <div className={`flex items-baseline gap-2 px-3 py-1 rounded-full transition-colors duration-200 ${overallScoreStyles.bg}`}>
                                <span className={`text-xl font-bold ${overallScoreStyles.text}`}>{overallScore}</span>
                                <span className={`text-xs font-semibold ${overallScoreStyles.text}`}>{overallScoreStyles.descriptor}</span>
                            </div>
                        </div>
                    )}
                    <div className="flex-grow"></div>
                    <button onClick={onClose} className="px-6 py-2 bg-gray-200 rounded-md hover:bg-gray-300">Cancel</button>
                    <button 
                        onClick={handleSave}
                        disabled={!canSave}
                        className="flex items-center px-6 py-2 bg-blue-600 text-white font-bold rounded-md hover:bg-blue-700 disabled:bg-blue-300 disabled:cursor-not-allowed"
                    >
                        <Save size={18} className="mr-2" />
                        {initialRole ? 'Save Changes' : 'Add Role to Profile'}
                    </button>
                </div>
            </div>
        </div>
    );
};