import React, { useState } from 'react';
import { EngineerProfile, JobRoleSkills, CaseStudy } from '../../context/AppContext.tsx';
import { Plus, Trash2 } from '../../components/Icons.tsx';

const generateUniqueId = () => `id-${Math.random().toString(36).substring(2, 10)}`;

interface ProfileManagementViewProps {
    profile: EngineerProfile;
    onSave: (updatedProfile: Partial<EngineerProfile>) => void;
}

const UpgradeCta = () => (
    <div className="text-center p-8 bg-gray-100 rounded-lg border-2 border-dashed">
        <h3 className="text-xl font-bold text-gray-800">This is a Premium Feature</h3>
        <p className="text-gray-600 mt-2">Upgrade to a "Job Profile" to add specialist roles and showcase your detailed expertise to top companies.</p>
        <button className="mt-4 bg-blue-600 text-white font-bold py-2 px-5 rounded-lg hover:bg-blue-700">Upgrade Now</button>
    </div>
);


export const ProfileManagementView = ({ profile, onSave }: ProfileManagementViewProps) => {
    const [roles, setRoles] = useState<JobRoleSkills[]>(profile.specialistJobRoles || []);
    const [caseStudies, setCaseStudies] = useState<CaseStudy[]>(profile.caseStudies || []);

    // --- Specialist Roles Logic ---
    const addRole = () => setRoles([...roles, { roleName: 'New Role', skills: [{ name: '', rating: 80 }] }]);
    const removeRole = (index: number) => setRoles(roles.filter((_, i) => i !== index));
    const handleRoleChange = (index: number, value: string) => {
        const newRoles = [...roles];
        newRoles[index].roleName = value;
        setRoles(newRoles);
    };
    const addSkillToRole = (roleIndex: number) => {
        const newRoles = [...roles];
        newRoles[roleIndex].skills.push({ name: '', rating: 80 });
        setRoles(newRoles);
    };
    const removeSkillFromRole = (roleIndex: number, skillIndex: number) => {
        const newRoles = [...roles];
        newRoles[roleIndex].skills = newRoles[roleIndex].skills.filter((_, i) => i !== skillIndex);
        setRoles(newRoles);
    };
    const handleSkillChange = (roleIndex: number, skillIndex: number, field: 'name' | 'rating', value: string | number) => {
        const newRoles = [...roles];
        (newRoles[roleIndex].skills[skillIndex] as any)[field] = value;
        setRoles(newRoles);
    };
    
    // --- Case Studies Logic ---
    const addCaseStudy = () => setCaseStudies([...caseStudies, { id: generateUniqueId(), name: 'Project Name', url: 'https://' }]);
    const removeCaseStudy = (id: string) => setCaseStudies(caseStudies.filter(cs => cs.id !== id));
    const handleCaseStudyChange = (id: string, field: 'name' | 'url', value: string) => {
        setCaseStudies(caseStudies.map(cs => cs.id === id ? { ...cs, [field]: value } : cs));
    };

    // --- Save Logic ---
    const handleSaveChanges = () => {
        onSave({ specialistJobRoles: roles, caseStudies });
    };

    return (
        <div>
            <h1 className="text-3xl font-bold mb-6">Manage Profile Details</h1>
            
            <div className="bg-white p-6 rounded-lg shadow mb-8">
                <h2 className="text-2xl font-bold mb-4">Specialist Job Roles</h2>
                {profile.profileTier === 'free' ? <UpgradeCta /> : (
                    <div className="space-y-6">
                        {roles.map((role, rIndex) => (
                            <div key={rIndex} className="p-4 border rounded-md">
                                <div className="flex justify-between items-center mb-4">
                                    <input type="text" value={role.roleName} onChange={e => handleRoleChange(rIndex, e.target.value)} className="text-lg font-bold w-1/2 border-b-2 p-1" />
                                    <button onClick={() => removeRole(rIndex)} className="text-red-500 hover:text-red-700"><Trash2 size={18} /></button>
                                </div>
                                <div className="space-y-2">
                                    {role.skills.map((skill, sIndex) => (
                                        <div key={sIndex} className="flex items-center gap-2">
                                            <input type="text" placeholder="Skill Name" value={skill.name} onChange={e => handleSkillChange(rIndex, sIndex, 'name', e.target.value)} className="w-full border p-2 rounded" />
                                            <input type="range" min="0" max="100" value={skill.rating} onChange={e => handleSkillChange(rIndex, sIndex, 'rating', parseInt(e.target.value))} className="w-48" />
                                            <span className="w-12 text-center font-semibold">{skill.rating}</span>
                                            <button onClick={() => removeSkillFromRole(rIndex, sIndex)} className="text-red-500 hover:text-red-700"><Trash2 size={18} /></button>
                                        </div>
                                    ))}
                                    <button onClick={() => addSkillToRole(rIndex)} className="flex items-center text-blue-600 font-semibold hover:text-blue-800 pt-2">
                                        <Plus size={18} className="mr-1" /> Add Skill
                                    </button>
                                </div>
                            </div>
                        ))}
                         <button onClick={addRole} className="flex items-center text-white font-semibold bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-md">
                            <Plus size={18} className="mr-1" /> Add Job Role
                        </button>
                    </div>
                )}
            </div>

            <div className="bg-white p-6 rounded-lg shadow mb-8">
                <h2 className="text-2xl font-bold mb-4">Case Studies / Portfolio</h2>
                 <div className="space-y-4">
                    {caseStudies.map(cs => (
                        <div key={cs.id} className="flex items-center gap-2">
                            <input type="text" placeholder="Project Name" value={cs.name} onChange={e => handleCaseStudyChange(cs.id, 'name', e.target.value)} className="w-1/3 border p-2 rounded" />
                            <input type="text" placeholder="https://example.com/project" value={cs.url} onChange={e => handleCaseStudyChange(cs.id, 'url', e.target.value)} className="w-2/3 border p-2 rounded" />
                            <button onClick={() => removeCaseStudy(cs.id)} className="text-red-500 hover:text-red-700"><Trash2 size={18} /></button>
                        </div>
                    ))}
                    <button onClick={addCaseStudy} className="flex items-center text-blue-600 font-semibold hover:text-blue-800 pt-2">
                        <Plus size={18} className="mr-1" /> Add Case Study
                    </button>
                 </div>
            </div>

            <div className="flex justify-end">
                <button 
                    onClick={handleSaveChanges} 
                    className="px-6 py-3 bg-green-600 text-white font-bold rounded-lg hover:bg-green-700 text-lg"
                >
                    Save All Changes
                </button>
            </div>
        </div>
    );
};
