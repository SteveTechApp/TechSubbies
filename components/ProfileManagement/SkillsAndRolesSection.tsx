import React, { useState, useMemo } from 'react';
import { EngineerProfile, SelectedJobRole, Skill, ProfileTier } from '../../types/index.ts';
import { JOB_ROLE_DEFINITIONS } from '../../data/jobRoles.ts';
import { SectionWrapper } from './SectionWrapper.tsx';
import { Plus, Trash2, Edit, X } from '../Icons.tsx';
import { EditSkillProfileModal } from '../EditSkillProfileModal.tsx';

const UpgradeCta = ({ requiredTier, onUpgradeClick }: { requiredTier: string, onUpgradeClick: () => void }) => (
    <div className="text-center p-8 bg-gray-100 rounded-lg border-2 border-dashed">
        <h3 className="text-xl font-bold text-gray-800">This is a Premium Feature</h3>
        <p className="text-gray-600 mt-2">Upgrade to a "{requiredTier}" profile to unlock this feature and showcase your detailed expertise to top companies.</p>
        <button type="button" onClick={onUpgradeClick} className="mt-4 bg-blue-600 text-white font-bold py-2 px-5 rounded-lg hover:bg-blue-700">Upgrade Now</button>
    </div>
);

interface SkillsAndRolesSectionProps {
    profile: EngineerProfile;
    formData: Partial<EngineerProfile>;
    setFormData: React.Dispatch<React.SetStateAction<Partial<EngineerProfile>>>;
    setActiveView: (view: string) => void;
}

export const SkillsAndRolesSection = ({ profile, formData, setFormData, setActiveView }: SkillsAndRolesSectionProps) => {
    const [skillInput, setSkillInput] = useState('');
    const [isSkillModalOpen, setIsSkillModalOpen] = useState(false);
    const [editingRole, setEditingRole] = useState<{ role: SelectedJobRole, index: number } | null>(null);

    const skills = useMemo(() => formData.skills?.map(s => s.name) || [], [formData.skills]);
    const roles = useMemo(() => formData.selectedJobRoles || [], [formData.selectedJobRoles]);

    const canUseCoreSkills = profile.profileTier !== ProfileTier.BASIC;
    const canUseSpecialistRoles = profile.profileTier === ProfileTier.SKILLS || profile.profileTier === ProfileTier.BUSINESS;

    const handleAddSkill = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter' && skillInput.trim()) {
            e.preventDefault();
            const newSkillName = skillInput.trim();
            if (!skills.includes(newSkillName)) {
                const newSkill: Skill = { name: newSkillName, rating: 50 };
                setFormData(prev => ({ ...prev, skills: [...(prev.skills || []), newSkill] }));
            }
            setSkillInput('');
        }
    };

    const handleRemoveSkill = (skillToRemove: string) => {
        setFormData(prev => ({ ...prev, skills: prev.skills?.filter(s => s.name !== skillToRemove) }));
    };
    
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
            <SectionWrapper title="Core Skills (Tags)">
                {canUseCoreSkills ? (
                    <div>
                        <p className="text-sm text-gray-500 mb-3">Add keywords that companies can use to find you (e.g., "Crestron", "Cisco"). Press Enter to add a skill.</p>
                        <div className="flex flex-wrap gap-2 items-center p-2 border rounded-md">
                            {skills.map(skill => (
                                <div key={skill} className="flex items-center gap-1 bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
                                    <span>{skill}</span>
                                    <button type="button" onClick={() => handleRemoveSkill(skill)} className="font-bold hover:text-red-500"><X size={14} /></button>
                                </div>
                            ))}
                            <input type="text" value={skillInput} onChange={e => setSkillInput(e.target.value)} onKeyDown={handleAddSkill} placeholder="Type a skill and press Enter" className="flex-grow p-1 outline-none bg-transparent" />
                        </div>
                    </div>
                ) : <UpgradeCta requiredTier="Professional" onUpgradeClick={() => setActiveView('Billing')} />}
            </SectionWrapper>

            <SectionWrapper title="Specialist Job Roles">
                 <div className="flex justify-between items-center mb-4">
                    <p className="text-sm text-gray-500 flex-grow">Add detailed, rated expertise for high-demand roles.</p>
                    {canUseSpecialistRoles && availableRoles.length > 0 && (
                        <button type="button" onClick={handleOpenAddModal} className="flex items-center px-4 py-2 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700">
                            <Plus size={18} className="mr-2" /> Add Role
                        </button>
                    )}
                </div>
                {!canUseSpecialistRoles ? <UpgradeCta requiredTier="Skills" onUpgradeClick={() => setActiveView('Billing')} /> : (
                    <div className="space-y-4">
                        {roles.map((role, rIndex) => (
                            <div key={rIndex} className="p-4 border rounded-lg bg-gray-50/50">
                                <div className="flex justify-between items-center mb-2">
                                    <h3 className="text-xl font-bold text-gray-800">{role.roleName}</h3>
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
                        {roles.length === 0 && (
                            <div className="text-center py-6 border-2 border-dashed rounded-lg">
                                <p className="text-gray-500">No specialist roles added yet.</p>
                                <p className="text-sm text-gray-400">Click "Add Role" to showcase your expertise.</p>
                            </div>
                        )}
                    </div>
                )}
            </SectionWrapper>
            
            <EditSkillProfileModal isOpen={isSkillModalOpen} onClose={() => setIsSkillModalOpen(false)} onSave={handleSaveRole} availableRoles={availableRoles} initialRole={editingRole?.role} />
        </>
    );
};
