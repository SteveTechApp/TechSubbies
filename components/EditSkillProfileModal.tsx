import React, { useState, useEffect, useRef } from 'react';
import { SelectedJobRole, JobRoleDefinition, RatedSkill } from '../types/index.ts';
import { JOB_ROLE_DEFINITIONS } from '../data/jobRoles.ts';
import { X, Save, Plus, Trash2 } from './Icons.tsx';

interface EditSkillProfileModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (role: SelectedJobRole) => void;
    availableRoles: JobRoleDefinition[];
    initialRole?: SelectedJobRole;
}

const getRatingStyles = (rating: number): { bg: string; text: string; accent: string; descriptor: string } => {
    if (rating < 25) return { bg: 'bg-gray-100', text: 'text-gray-700', accent: 'accent-gray-500', descriptor: 'Novice' };
    if (rating < 50) return { bg: 'bg-yellow-100', text: 'text-yellow-800', accent: 'accent-yellow-500', descriptor: 'Competent' };
    if (rating < 75) return { bg: 'bg-blue-100', text: 'text-blue-800', accent: 'accent-blue-500', descriptor: 'Proficient' };
    return { bg: 'bg-green-100', text: 'text-green-800', accent: 'accent-green-500', descriptor: 'Expert' };
};

export const EditSkillProfileModal = ({ isOpen, onClose, onSave, availableRoles, initialRole }: EditSkillProfileModalProps) => {
    const [selectedRoleDef, setSelectedRoleDef] = useState<JobRoleDefinition | null>(null);
    const [currentRole, setCurrentRole] = useState<SelectedJobRole | null>(initialRole || null);
    const [openAddMenu, setOpenAddMenu] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const addMenuRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!isOpen) return;

        if (initialRole) {
            const roleDef = JOB_ROLE_DEFINITIONS.find(def => def.name === initialRole.roleName);
            setSelectedRoleDef(roleDef || null);
            setCurrentRole(initialRole);
        } else {
            setCurrentRole(null);
            setSelectedRoleDef(null);
        }
        setOpenAddMenu(null);
        setSearchTerm('');
    }, [isOpen, initialRole]);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (addMenuRef.current && !addMenuRef.current.contains(event.target as Node)) {
                setOpenAddMenu(null);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    if (!isOpen) return null;

    const handleRoleSelect = (roleName: string) => {
        const roleDef = JOB_ROLE_DEFINITIONS.find(r => r.name === roleName);
        if (roleDef) {
            setSelectedRoleDef(roleDef);
            const newRole: SelectedJobRole = {
                roleName: roleDef.name,
                skills: [],
                overallScore: 0
            };
            setCurrentRole(newRole);
        }
    };
    
    const recalculateScore = (skills: RatedSkill[]) => {
        const totalScore = skills.reduce((acc, skill) => acc + skill.rating, 0);
        return skills.length > 0 ? Math.round(totalScore / skills.length) : 0;
    }

    const handleSkillChange = (skillName: string, value: string) => {
        if (!currentRole) return;
        const newRating = parseInt(value, 10) || 0;
        const newSkills = currentRole.skills.map(skill => 
            skill.name === skillName ? { ...skill, rating: newRating } : skill
        );
        const newOverallScore = recalculateScore(newSkills);
        setCurrentRole({ ...currentRole, skills: newSkills, overallScore: newOverallScore });
    };

    const addSkill = (skillDef: { name: string; description: string }) => {
        if (!currentRole) return;
        const newSkill: RatedSkill = { name: skillDef.name, rating: 50 };
        const newSkills = [...currentRole.skills, newSkill];
        const newOverallScore = recalculateScore(newSkills);
        setCurrentRole({ ...currentRole, skills: newSkills, overallScore: newOverallScore });
        setOpenAddMenu(null);
        setSearchTerm('');
    };

    const removeSkill = (skillName: string) => {
        if (!currentRole) return;
        const newSkills = currentRole.skills.filter(s => s.name !== skillName);
        const newOverallScore = recalculateScore(newSkills);
        setCurrentRole({ ...currentRole, skills: newSkills, overallScore: newOverallScore });
    };


    const handleSave = () => {
        if (currentRole) {
            onSave(currentRole);
            onClose();
        }
    };
    
    const canSave = currentRole && currentRole.skills.length > 0;
    const overallScore = currentRole?.overallScore ?? 0;
    const overallScoreStyles = getRatingStyles(overallScore);

    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50 p-4" onClick={onClose}>
            <div className="bg-white rounded-lg m-4 max-w-4xl w-full relative transform transition-all duration-300 max-h-[90vh] flex flex-col" onClick={e => e.stopPropagation()}>
                <header className="flex-shrink-0 p-6 border-b">
                    <button onClick={onClose} className="absolute top-4 right-4 text-gray-500 hover:text-gray-800" aria-label="Close modal">
                        <X size={24} />
                    </button>
                    <h2 className="text-2xl font-bold">{initialRole ? `Edit Role: ${initialRole.roleName}` : 'Add a Specialist Role'}</h2>
                </header>
                
                <main className="flex-grow overflow-y-auto custom-scrollbar p-6">
                    {!initialRole && !currentRole && (
                        <div className="fade-in-up">
                            <label htmlFor="role-select" className="block font-medium mb-2">1. Select a role from the list:</label>
                            <select
                                id="role-select"
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
                            {!initialRole && <p className="font-medium">2. Add skills and rate your competency:</p>}
                            
                            <div className="space-y-4">
                                {selectedRoleDef.skillCategories.map(category => {
                                    const categorySkillsInRole = currentRole.skills.filter(s => category.skills.some(cs => cs.name === s.name));
                                    const availableSkills = category.skills
                                        .filter(skillDef => !currentRole.skills.some(s => s.name === skillDef.name))
                                        .filter(skillDef => skillDef.name.toLowerCase().includes(searchTerm.toLowerCase()));

                                    return (
                                        <div key={category.category} className="p-4 bg-gray-50 rounded-lg border">
                                            <h3 className="font-bold text-lg text-blue-700 mb-3 border-b pb-2">{category.category}</h3>
                                            <div className="divide-y divide-gray-200">
                                                {categorySkillsInRole.map(skill => {
                                                    const skillDef = category.skills.find(cs => cs.name === skill.name)!;
                                                    const ratingStyles = getRatingStyles(skill.rating);
                                                    
                                                    return (
                                                        <div key={skillDef.name} className="py-3">
                                                            <div className="flex justify-between items-center mb-1">
                                                                <div className="flex items-center gap-4">
                                                                    <button type="button" onClick={() => removeSkill(skillDef.name)} className="text-red-500 hover:text-red-700"><Trash2 size={16}/></button>
                                                                    <div className="block font-medium text-gray-700 text-sm tooltip-container">
                                                                        {skillDef.name}
                                                                        <span className="tooltip-text">{skillDef.description}</span>
                                                                    </div>
                                                                </div>
                                                                <div className={`flex items-baseline gap-2 flex-shrink-0 px-2.5 py-1 rounded-full transition-colors duration-200 min-w-[120px] justify-center ${ratingStyles.bg}`}>
                                                                    <span className={`text-lg font-bold ${ratingStyles.text}`}>{skill.rating}</span>
                                                                    <span className={`text-xs font-semibold ${ratingStyles.text}`}>{ratingStyles.descriptor}</span>
                                                                </div>
                                                            </div>
                                                            <input
                                                                type="range"
                                                                min="0"
                                                                max="100"
                                                                step="5"
                                                                value={skill.rating}
                                                                onChange={(e) => handleSkillChange(skillDef.name, e.target.value)}
                                                                className={`w-full h-2 rounded-lg appearance-none cursor-pointer ${ratingStyles.accent}`}
                                                            />
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                            <div className="relative mt-2" ref={addMenuRef}>
                                                <button type="button" onClick={() => setOpenAddMenu(openAddMenu === category.category ? null : category.category)} className="text-sm font-semibold text-blue-600 hover:underline flex items-center">
                                                    <Plus size={16} className="mr-1"/> Add a skill from {category.category}
                                                </button>
                                                {openAddMenu === category.category && (
                                                    <div className="absolute z-10 mt-1 w-full bg-white border rounded-md shadow-lg max-h-48 overflow-y-auto">
                                                        <input type="text" placeholder="Search skills..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="w-full p-2 border-b" />
                                                        {availableSkills.map(skillDef => (
                                                            <button key={skillDef.name} type="button" onClick={() => addSkill(skillDef)} className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">{skillDef.name}</button>
                                                        ))}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    )}
                </main>
                
                <footer className="flex-shrink-0 p-6 border-t bg-gray-50 flex justify-between items-center">
                    <div className={`flex items-baseline gap-2 px-3 py-1.5 rounded-full ${overallScoreStyles.bg}`}>
                        <span className="text-xs font-semibold">Overall Score:</span>
                        <span className={`text-xl font-bold ${overallScoreStyles.text}`}>{overallScore}</span>
                        <span className={`text-sm font-semibold ${overallScoreStyles.text}`}>{overallScoreStyles.descriptor}</span>
                    </div>
                    <button
                        onClick={handleSave}
                        disabled={!canSave}
                        className="flex items-center px-6 py-2 bg-green-600 text-white font-bold rounded-md hover:bg-green-700 disabled:bg-gray-400"
                    >
                        <Save size={18} className="mr-2" />
                        Save Role
                    </button>
                </footer>
            </div>
        </div>
    );
};