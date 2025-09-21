import React, { useState, useMemo } from 'react';
import { EngineerProfile, SelectedJobRole, ProfileTier } from '../../types';
import { JOB_ROLE_DEFINITIONS } from '../../data/jobRoles';
import { Plus, Trash2, Edit } from '../Icons';
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
    const [isSkillModalOpen, setIsSkillModalOpen] = useState(false);
    const [editingRole, setEditingRole] = useState<{ role: SelectedJobRole, index: number } | null>(null);
    const [roleToAdd, setRoleToAdd] = useState<SelectedJobRole | null>(null);
    const [roleSearchTerm, setRoleSearchTerm] = useState('');

    const roles = useMemo(() => formData.selectedJobRoles || [], [formData.selectedJobRoles]);
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
    
    const availableRoles = useMemo(() => {
        const selectedRoleNames = new Set(roles.map(r => r.roleName));
        return JOB_ROLE_DEFINITIONS.filter(def => !selectedRoleNames.has(def.name));
    }, [roles]);

    const roleSearchResults = useMemo(() => {
        if (!roleSearchTerm.trim()) {
            return [];
        }
        const lowercasedTerm = roleSearchTerm.toLowerCase();
        return availableRoles.filter(def => 
            def.name.toLowerCase().includes(lowercasedTerm) ||
            def.category.toLowerCase().includes(lowercasedTerm) ||
            def.skillCategories.some(cat => cat.skills.some(skill => 
                skill.name.toLowerCase().includes(lowercasedTerm) ||
                skill.description.toLowerCase().includes(lowercasedTerm)
            ))
        ).slice(0, 5); // Limit to 5 results for UI
    }, [roleSearchTerm, availableRoles]);
    
    const handleSelectRoleForAdd = (roleName: string) => {
        const roleDef = JOB_ROLE_DEFINITIONS.find(r => r.name === roleName);
        if (!roleDef) return;

        const newRole: SelectedJobRole = {
            roleName: roleDef.name,
            skills: [],
            overallScore: 0,
        };
        
        setEditingRole(null);
        setRoleToAdd(newRole);
        setIsSkillModalOpen(true);
        setRoleSearchTerm('');
    };

    const handleOpenEditModal = (role: SelectedJobRole, index: number) => {
        setRoleToAdd(null);
        setEditingRole({ role, index });
        setIsSkillModalOpen(true);
    };

    const handleSaveRole = (roleData: SelectedJobRole) => {
        if (editingRole) {
            const updatedRoles = [...roles];
            updatedRoles[editingRole.index] = roleData;
            setFormData(prev => ({ ...prev, selectedJobRoles: updatedRoles }));
        } else if (roleToAdd) {
            setFormData(prev => ({ ...prev, selectedJobRoles: [...(prev.selectedJobRoles || []), roleData] }));
        }
    };

    const removeRole = (index: number) => {
        setFormData(prev => ({ ...prev, selectedJobRoles: prev.selectedJobRoles?.filter((_, i) => i !== index) }));
    };

    return (
        <>
            <div>
                <h3 className="text-xl font-bold mb-3">Specialist Job Roles</h3>
                <p className="text-sm text-gray-500 mb-4">Add detailed, rated expertise for high-demand roles to showcase your value and justify higher day rates. You can add {roleLimit} role(s) on your current plan.</p>
                {!canUseSpecialistRoles ? <UpgradeCta requiredTier="Silver" onUpgradeClick={() => setActiveView('Billing')} message="Add specialist roles to showcase your deep expertise." /> : (
                    <div className="space-y-4">
                        {canAddMoreRoles && availableRoles.length > 0 && (
                            <div className="relative">
                                <label className="block font-medium text-sm mb-1">Search to add a new role:</label>
                                <input 
                                    type="text" 
                                    value={roleSearchTerm}
                                    onChange={e => setRoleSearchTerm(e.target.value)}
                                    placeholder="e.g., Crestron, Designer, Network"
                                    className="w-full border p-2 rounded"
                                />
                                {roleSearchResults.length > 0 && (
                                    <div className="absolute z-10 w-full border border-t-0 rounded-b-md bg-white shadow-lg">
                                        {roleSearchResults.map(def => (
                                            <button 
                                                key={def.name}
                                                type="button"
                                                onClick={() => handleSelectRoleForAdd(def.name)}
                                                className="w-full text-left px-3 py-2 hover:bg-gray-100"
                                            >
                                                {def.name} <span className="text-xs text-gray-500">({def.category})</span>
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>
                        )}
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
                                <p className="text-sm text-gray-400">Use the search bar above to add your first role.</p>
                            </div>
                        )}
                    </div>
                )}
            </div>
            
            <EditSkillProfileModal 
                isOpen={isSkillModalOpen} 
                onClose={() => {
                    setIsSkillModalOpen(false);
                    setEditingRole(null);
                    setRoleToAdd(null);
                }} 
                onSave={handleSaveRole} 
                availableRoles={availableRoles} 
                initialRole={editingRole?.role || roleToAdd || undefined}
            />
        </>
    );
};