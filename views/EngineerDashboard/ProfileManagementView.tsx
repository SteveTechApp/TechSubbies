import React, { useState, useMemo } from 'react';
import { EngineerProfile, SelectedJobRole, CaseStudy, JOB_ROLE_DEFINITIONS } from '../../context/AppContext.tsx';
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
    const [roles, setRoles] = useState<SelectedJobRole[]>(profile.selectedJobRoles || []);
    const [caseStudies, setCaseStudies] = useState<CaseStudy[]>(profile.caseStudies || []);

    // --- Specialist Roles Logic ---
    const availableRoles = useMemo(() => {
        const selectedRoleNames = new Set(roles.map(r => r.roleName));
        return JOB_ROLE_DEFINITIONS.filter(def => !selectedRoleNames.has(def.name));
    }, [roles]);

    const addRole = (roleName: string) => {
        const roleDef = JOB_ROLE_DEFINITIONS.find(def => def.name === roleName);
        if (!roleDef) return;

        const newRole: SelectedJobRole = {
            roleName: roleDef.name,
            skills: roleDef.skills.map(skillName => ({ name: skillName, rating: 50 })),
            overallScore: 50
        };
        setRoles([...roles, newRole]);
    };

    const removeRole = (index: number) => setRoles(roles.filter((_, i) => i !== index));
    
    const handleSkillChange = (roleIndex: number, skillIndex: number, value: string) => {
        const newRoles = [...roles];
        const rating = parseInt(value, 10);
        newRoles[roleIndex].skills[skillIndex].rating = rating;
        
        const totalScore = newRoles[roleIndex].skills.reduce((acc, skill) => acc + skill.rating, 0);
        newRoles[roleIndex].overallScore = Math.round(totalScore / newRoles[roleIndex].skills.length);
        
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
        onSave({ selectedJobRoles: roles, caseStudies });
    };

    return (
        <div>
            <h1 className="text-3xl font-bold mb-4">Manage Profile Details</h1>
            
            <div className="bg-white p-5 rounded-lg shadow mb-6">
                <h2 className="text-2xl font-bold mb-4">Specialist Job Roles</h2>
                {profile.profileTier === 'free' ? <UpgradeCta /> : (
                    <div className="space-y-4">
                        {roles.map((role, rIndex) => (
                            <div key={rIndex} className="p-4 border rounded-lg bg-gray-50/50">
                                <div className="flex justify-between items-center mb-4">
                                    <h3 className="text-xl font-bold text-gray-800">{role.roleName}</h3>
                                    <div className="flex items-center gap-4">
                                        <div className="text-right">
                                            <span className="text-2xl font-bold text-blue-600">{role.overallScore}</span>
                                            <span className="text-sm text-gray-500 block">Overall Score</span>
                                        </div>
                                        <button onClick={() => removeRole(rIndex)} className="text-red-500 hover:text-red-700 p-2 bg-red-100 rounded-full"><Trash2 size={18} /></button>
                                    </div>
                                </div>
                                <div className="space-y-3">
                                    {role.skills.map((skill, sIndex) => (
                                        <div key={sIndex} className="grid grid-cols-12 items-center gap-4">
                                            <label className="col-span-4 font-medium text-gray-700">{skill.name}</label>
                                            <input type="range" min="1" max="100" value={skill.rating} onChange={e => handleSkillChange(rIndex, sIndex, e.target.value)} className="col-span-7 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer" />
                                            <span className="col-span-1 text-center font-semibold text-blue-600 w-12">{skill.rating}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                        {availableRoles.length > 0 && (
                            <div className="flex items-center gap-2 pt-4 border-t">
                                <select 
                                    onChange={(e) => addRole(e.target.value)} 
                                    value=""
                                    className="block w-full max-w-xs border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm p-2 bg-white"
                                >
                                    <option value="" disabled>-- Select a role to add --</option>
                                    {availableRoles.map(def => <option key={def.name} value={def.name}>{def.name}</option>)}
                                </select>
                            </div>
                        )}
                    </div>
                )}
            </div>

            <div className="bg-white p-5 rounded-lg shadow mb-6">
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