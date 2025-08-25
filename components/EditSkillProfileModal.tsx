import React, { useState, useEffect } from 'react';
import { SelectedJobRole, JobRoleDefinition } from '../types/index.ts';
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

export const EditSkillProfileModal = ({ isOpen, onClose, onSave, availableRoles, initialRole }: EditSkillProfileModalProps) => {
    const [selectedRoleDef, setSelectedRoleDef] = useState<JobRoleDefinition | null>(null);
    const [currentRole, setCurrentRole] = useState<SelectedJobRole | null>(initialRole || null);

    useEffect(() => {
        // Reset state when modal is opened for adding a new role
        if (isOpen && !initialRole) {
            setCurrentRole(null);
            setSelectedRoleDef(null);
        }
        // Set state if opened for editing
        if (isOpen && initialRole) {
            setCurrentRole(initialRole);
            const roleDef = JOB_ROLE_DEFINITIONS.find(def => def.name === initialRole.roleName);
            setSelectedRoleDef(roleDef || null);
        }
    }, [isOpen, initialRole]);

    if (!isOpen) return null;

    const handleRoleSelect = (roleName: string) => {
        const roleDef = JOB_ROLE_DEFINITIONS.find(r => r.name === roleName);
        if (roleDef) {
            setSelectedRoleDef(roleDef);
            const newRole: SelectedJobRole = {
                roleName: roleDef.name,
                skills: roleDef.skills.map(skillName => ({ name: skillName, rating: 50 })),
                overallScore: 50
            };
            setCurrentRole(newRole);
        }
    };
    
    const handleSkillChange = (skillIndex: number, value: string) => {
        if (!currentRole) return;
        const newRole = { ...currentRole };
        const rating = parseInt(value, 10);
        newRole.skills[skillIndex].rating = rating;
        
        const totalScore = newRole.skills.reduce((acc, skill) => acc + skill.rating, 0);
        newRole.overallScore = Math.round(totalScore / newRole.skills.length);
        
        setCurrentRole(newRole);
    };

    const handleSave = () => {
        if (currentRole) {
            onSave(currentRole);
            onClose();
        }
    };
    
    const canSave = currentRole && currentRole.skills.every(s => s.rating > 0);
    
    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50 p-4" onClick={onClose}>
            <div className="bg-white rounded-lg p-6 m-4 max-w-2xl w-full relative transform transition-all duration-300 max-h-[90vh] overflow-y-auto custom-scrollbar" onClick={e => e.stopPropagation()}>
                <button onClick={onClose} className="absolute top-4 right-4 text-gray-500 hover:text-gray-800">
                    <X size={24} />
                </button>
                <h2 className="text-2xl font-bold mb-4">{initialRole ? `Edit Role: ${initialRole.roleName}` : 'Add a Specialist Role'}</h2>
                
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
                
                {currentRole && (
                    <div className="fade-in-up space-y-4">
                         {!initialRole && <p className="font-medium">2. Rate your competency for each skill:</p>}
                         <div className="p-4 bg-gray-50 rounded-lg space-y-3">
                            {currentRole.skills.map((skill, sIndex) => (
                                <div key={sIndex} className="grid grid-cols-12 items-center gap-4">
                                    <label className="col-span-12 sm:col-span-4 font-medium text-gray-700">{skill.name}</label>
                                    <input 
                                        type="range" 
                                        min="1" max="100" 
                                        value={skill.rating} 
                                        onChange={e => handleSkillChange(sIndex, e.target.value)} 
                                        className="col-span-10 sm:col-span-7 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                                    />
                                    <span className="col-span-2 sm:col-span-1 text-center font-semibold text-blue-600 w-12">{skill.rating}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
                
                <div className="flex justify-end space-x-4 mt-6 pt-4 border-t">
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