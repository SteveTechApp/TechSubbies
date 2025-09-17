import React, { useState, useMemo } from 'react';
import { EngineerProfile, SelectedJobRole, Skill, ProfileTier } from '../../types';
import { JOB_ROLE_DEFINITIONS } from '../../data/jobRoles';
import { Plus, Trash2, Edit, X } from '../Icons';
import { EditSkillProfileModal } from '../EditSkillProfileModal';

const UpgradeCta = ({ requiredTier, onUpgradeClick, message }: { requiredTier: string, onUpgradeClick: () => void, message: string }) => (
    <div className="text-center p-6 bg-gray-100 rounded-lg border-2 border-dashed">
        <h3 className="text-lg font-bold text-gray-800">This is a Premium Feature</h3>
        <p className="text-gray-600 mt-2">{message}</p>
        <button type="button" onClick={onUpgradeClick} className="mt-4 bg-blue-600 text-white font-bold py-2 px-5 rounded-lg hover:bg-blue-700">Upgrade to {requiredTier}</button>
    </div>
);

interface SkillsAndRolesSectionProps {
    profile: EngineerProfile;
    formData: EngineerProfile;
    setFormData: React.Dispatch<React.SetStateAction<EngineerProfile>>;
    setActiveView: (view: string) => void;
}

export const SkillsAndRolesSection = ({ profile, formData, setFormData, setActiveView }: SkillsAndRolesSectionProps) => {
    const [skillInput, setSkillInput] = useState('');
    const [isSkillModalOpen, setIsSkillModalOpen] = useState(false);
    const [editingRole, setEditingRole] = useState<{ role: SelectedJobRole, index: number } | null>(null);

    const roles = useMemo(() => formData.selectedJobRoles || [], [formData.selectedJobRoles]);

    const canUseCoreSkills = profile.profileTier !== ProfileTier.BASIC;
    const canUseSpecialistRoles = profile.profileTier !== ProfileTier.BASIC;

    const ROLE_LIMITS: { [key in ProfileTier]: number } = {
        [ProfileTier.BASIC]: 0,
        [ProfileTier.PROFESSIONAL]: 1,
        [ProfileTier.SKILLS]: 3,
        [ProfileTier.BUSINESS]: 5,
    };
    const roleLimit = ROLE_LIMITS[profile.profileTier];
    const canAddMoreRoles = roles.length < roleLimit;

    const getNextTier = () => {
        if (profile.profileTier === ProfileTier.BASIC) return 'Silver';
        if (profile.profileTier === ProfileTier.PROFESSIONAL) return 'Gold';
        if (profile.profileTier === ProfileTier.SKILLS) return 'Platinum';
        return '';
    };

    // --- Core Skills Handlers ---
    const handleAddSkill = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter' && skillInput.trim()) {
            e.preventDefault();
            const newSkillName = skillInput.trim();
            if (!(formData.skills || []).some(s => s.name.toLowerCase() === newSkillName.toLowerCase())) {
                const newSkill: Skill = { name: newSkillName, rating: 50 };
                setFormData(prev => ({ ...prev, skills: [...(prev.skills || []), newSkill] }));
            }
            setSkillInput('');
        }
    };
    const handleRemoveSkill = (skillToRemove: string) => {
        setFormData(prev => ({ ...prev, skills: prev.skills?.filter(s => s.name !== skillToRemove) }));
    };
    const handleSkillRatingChange = (skillName: string, newRating: number) => {
        setFormData(prev => ({ ...prev, skills: (prev.skills || []).map(s => s.name === skillName ? { ...s, rating: newRating } : s) }));
    };
    
    // --- Specialist Role Handlers ---
    const availableRoles = useMemo(() => {
        const selectedRoleNames = new Set(roles.map(r => r.roleName));
        return JOB_ROLE_DEFINITIONS.filter(def => !selectedRoleNames.has(def.name));
    }, [roles]);

    const handleOpenAddModal = () => {
        setEditingRole(null);
        setIsSkillModalOpen(true);
    };
    const handleOpenEditModal = (role: SelectedJobRole, index: number) => {
        setEditingRole({ role, index });
        setIsSkillModalOpen(true);
    };
    const handleSaveRole = (newOrUpdatedRole: SelectedJobRole) => {
        let newRoles = [...roles];
        if (editingRole !== null) {
            newRoles[editingRole.index] = newOrUpdatedRole;
        } else {
            newRoles.push(newOrUpdatedRole);
        }
        setFormData(prev => ({ ...prev, selectedJobRoles: newRoles }));
    };
    const removeRole = (index: number) => {
        setFormData(prev => ({ ...prev, selectedJobRoles: prev.selectedJobRoles?.filter((_, i) => i !== index) }));
    };

    return (
        <>
            <div className="space-y-6">
                <div>
                    <h3 className="text-xl font-bold mb-3">Core Skills (Tags)</h3>
                    {canUseCoreSkills ? (
                        <div className="space-y-3">
                            <p className="text-sm text-gray-500">Add keywords that companies can use to find you (e.g., "Crestron", "Cisco"). Rate your proficiency from 1-100.</p>
                             <div className="flex flex-wrap gap-2 items-center p-2 border rounded-md">
                                <input type="text" value={skillInput} onChange={e => setSkillInput(e.target.value)} onKeyDown={handleAddSkill} placeholder="Type a skill and press Enter" className="flex-grow p-1 outline-none bg-transparent" />
                            </div>
                            {(formData.skills || []).map(skill => (
                                <div key={skill.name} className="flex items-center gap-3 p-2 border-b last:border-b-0">
                                    <span className="font-semibold text-gray-700 w-48 truncate">{skill.name}</span>
                                    <input type="range" min="1" max="100" value={skill.rating} onChange={(e) => handleSkillRatingChange(skill.name, parseInt(e.target.value))} className="flex-grow" />
                                    <span className="font-bold text-blue-600 w-8 text-center">{skill.rating}</span>
                                    <button type="button" onClick={() => handleRemoveSkill(skill.name)} className="text-red-500 hover:text-red-700"><X size={16} /></button>
                                </div>
                            ))}
                        </div>
                    ) : <UpgradeCta requiredTier="Silver" onUpgradeClick={() => setActiveView('Billing')} message="Add searchable skill tags to appear in more searches." />}
                </div>

                <div>
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="text-xl font-bold">Specialist Job Roles</h3>
                        {canUseSpecialistRoles && canAddMoreRoles && availableRoles.length > 0 && (
                            <button type="button" onClick={handleOpenAddModal} className="flex items-center px-4 py-2 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700">
                                <Plus size={18} className="mr-2" /> Add Role
                            </button>
                        )}
                    </div>
                     <p className="text-sm text-gray-500 mb-4">Add detailed, rated expertise for high-demand roles to showcase your value and justify higher day rates. You can add {roleLimit} role(s) on your current plan.</p>
                    {!canUseSpecialistRoles ? <UpgradeCta requiredTier="Silver" onUpgradeClick={() => setActiveView('Billing')} message="Add specialist roles to showcase your deep expertise." /> : (
                        <div className="space-y-4">
                            {roles.map((role, rIndex) => (
                                <div key={rIndex} className="p-4 border rounded-lg bg-gray-50/50">
                                    <div className="flex justify-between items-center mb-2">
                                        <h4 className="text-lg font-bold text-gray-800">{role.roleName}</h4>
                                        <div className="flex items-center gap-2">
                                            <div className="text-right">
                                                <span className="text-2xl font-bold text-blue-600">{role.overallScore}</span>
                                                <span className="text-sm text-gray-500 block">Overall Score</span>
                                            </div>
                                            <button type="button" onClick={() => handleOpenEditModal(role, rIndex)} className="text-blue-600 hover:text-blue-800 p-2 bg-blue-100 rounded-full"><Edit size={18} /></button>
                                            <button type="button" onClick={() => removeRole(rIndex)} className="text-red-500 hover:text-red-700 p-2 bg-red-100 rounded-full"><Trash2 size={18} /></button>
                                        </div>
                                    </div>
                                    <p className="text-sm text-gray-600">Top skills: {role.skills.sort((a,b) => b.rating - a.rating).slice(0, 3).map(s => s.name).join(', ')}.</p>
                                </div>
                            ))}
                             {!canAddMoreRoles && profile.profileTier !== ProfileTier.BUSINESS && (
                                <UpgradeCta requiredTier={getNextTier()!} onUpgradeClick={() => setActiveView('Billing')} message={`You have reached your limit of ${roleLimit} specialist role(s). Upgrade to add more.`} />
                            )}
                            {roles.length === 0 && (
                                <div className="text-center py-6 border-2 border-dashed rounded-lg">
                                    <p className="text-gray-500">No specialist roles added yet.</p>
                                    <p className="text-sm text-gray-400">Click "Add Role" to showcase your expertise.</p>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
            
            <EditSkillProfileModal isOpen={isSkillModalOpen} onClose={() => setIsSkillModalOpen(false)} onSave={handleSaveRole} availableRoles={availableRoles} initialRole={editingRole?.role} />
        </>
    );
};