import React, { useState, useMemo } from 'react';
import { EngineerProfile, SelectedJobRole, CaseStudy, Discipline } from '../../types/index.ts';
import { JOB_ROLE_DEFINITIONS } from '../../data/jobRoles.ts';
import { Plus, Trash2, Edit, Clapperboard } from '../../components/Icons.tsx';
import { EditSkillProfileModal } from '../../components/EditSkillProfileModal.tsx';

const generateUniqueId = () => `id-${Math.random().toString(36).substring(2, 10)}`;

interface ProfileManagementViewProps {
    profile: EngineerProfile;
    onSave: (updatedProfile: Partial<EngineerProfile>) => void;
    setActiveView: (view: string) => void;
}

const UpgradeCta = () => (
    <div className="text-center p-8 bg-gray-100 rounded-lg border-2 border-dashed">
        <h3 className="text-xl font-bold text-gray-800">This is a Premium Feature</h3>
        <p className="text-gray-600 mt-2">Upgrade to a "Skills Profile" to add specialist roles and showcase your detailed expertise to top companies.</p>
        <button className="mt-4 bg-blue-600 text-white font-bold py-2 px-5 rounded-lg hover:bg-blue-700">Upgrade Now</button>
    </div>
);


export const ProfileManagementView = ({ profile, onSave, setActiveView }: ProfileManagementViewProps) => {
    // Merged state from SettingsView
    const [formData, setFormData] = useState<Partial<EngineerProfile>>(profile);
    const [contactData, setContactData] = useState(profile.contact);

    // Existing states
    const [roles, setRoles] = useState<SelectedJobRole[]>(profile.selectedJobRoles || []);
    const [caseStudies, setCaseStudies] = useState<CaseStudy[]>(profile.caseStudies || []);
    const [isSkillModalOpen, setIsSkillModalOpen] = useState(false);
    const [editingRole, setEditingRole] = useState<{ role: SelectedJobRole, index: number } | null>(null);

     // Merged handlers from SettingsView
    const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: name === 'experience' ? parseInt(value, 10) : value }));
    };
    const handleContactChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setContactData(prev => ({ ...prev, [name]: value }));
    };

    // --- Specialist Roles Logic ---
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
        const newRoles = [...roles];
        if (editingRole !== null) {
            // Editing existing role
            newRoles[editingRole.index] = newOrUpdatedRole;
        } else {
            // Adding new role
            newRoles.push(newOrUpdatedRole);
        }
        setRoles(newRoles);
    };

    const removeRole = (index: number) => setRoles(roles.filter((_, i) => i !== index));
    
    // --- Case Studies Logic ---
    const addCaseStudy = () => setCaseStudies([...caseStudies, { id: generateUniqueId(), name: 'Project Name', url: 'https://' }]);
    const removeCaseStudy = (id: string) => setCaseStudies(caseStudies.filter(cs => cs.id !== id));
    const handleCaseStudyChange = (id: string, field: 'name' | 'url', value: string) => {
        setCaseStudies(caseStudies.map(cs => cs.id === id ? { ...cs, [field]: value } : cs));
    };

    // --- Save Logic ---
    const handleSaveChanges = () => {
        onSave({ 
            ...formData,
            contact: contactData,
            selectedJobRoles: roles, 
            caseStudies 
        });
    };

    return (
        <form onSubmit={(e) => { e.preventDefault(); handleSaveChanges(); }}>
            <div className="flex justify-between items-center mb-4">
                <h1 className="text-3xl font-bold">Manage Profile Details</h1>
                <button 
                    type="submit"
                    className="px-6 py-3 bg-green-600 text-white font-bold rounded-lg hover:bg-green-700 text-lg"
                >
                    Save All Changes
                </button>
            </div>
            
            <div className="bg-white p-5 rounded-lg shadow mb-6 space-y-6">
                 <div>
                    <h2 className="text-2xl font-bold border-b pb-2 mb-4">Core Information</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                         <div>
                            <label className="block font-medium mb-1">Full Name</label>
                            <input type="text" name="name" value={formData.name || ''} onChange={handleProfileChange} className="w-full border p-2 rounded" />
                        </div>
                        <div>
                            <label className="block font-medium mb-1">Discipline</label>
                            <select name="discipline" value={formData.discipline || ''} onChange={handleProfileChange} className="w-full border p-2 rounded bg-white">
                                <option value={Discipline.AV}>{Discipline.AV}</option>
                                <option value={Discipline.IT}>{Discipline.IT}</option>
                                <option value={Discipline.BOTH}>{Discipline.BOTH}</option>
                            </select>
                        </div>
                        <div>
                            <label className="block font-medium mb-1">Location</label>
                            <input type="text" name="location" value={formData.location || ''} onChange={handleProfileChange} className="w-full border p-2 rounded" />
                        </div>
                         <div>
                            <label className="block font-medium mb-1">Years of Experience</label>
                            <input type="number" name="experience" value={formData.experience || 0} onChange={handleProfileChange} className="w-full border p-2 rounded" />
                        </div>
                         <div className="md:col-span-2">
                            <label className="block font-medium mb-1">Bio / Description</label>
                            <textarea name="description" value={formData.description || ''} onChange={handleProfileChange} rows={4} className="w-full border p-2 rounded" />
                        </div>
                    </div>
                </div>

                <div>
                    <h2 className="text-2xl font-bold border-b pb-2 mb-4">Contact Details</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block font-medium mb-1">Email Address</label>
                            <input type="email" name="email" value={contactData.email || ''} onChange={handleContactChange} className="w-full border p-2 rounded" />
                        </div>
                        <div>
                            <label className="block font-medium mb-1">Mobile Phone</label>
                            <input type="tel" name="phone" value={contactData.phone || ''} onChange={handleContactChange} className="w-full border p-2 rounded" />
                        </div>
                        <div>
                            <label className="block font-medium mb-1">Website</label>
                            <input type="url" name="website" value={contactData.website || ''} onChange={handleContactChange} className="w-full border p-2 rounded" />
                        </div>
                        <div>
                            <label className="block font-medium mb-1">LinkedIn Profile</label>
                            <input type="url" name="linkedin" value={contactData.linkedin || ''} onChange={handleContactChange} className="w-full border p-2 rounded" />
                        </div>
                    </div>
                </div>
            </div>

            <div className="bg-white p-5 rounded-lg shadow mb-6">
                 <div className="flex justify-between items-center mb-4">
                    <h2 className="text-2xl font-bold">Specialist Job Roles</h2>
                    {profile.profileTier === 'paid' && availableRoles.length > 0 && (
                        <button 
                            type="button"
                            onClick={handleOpenAddModal}
                            className="flex items-center px-4 py-2 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700"
                        >
                            <Plus size={18} className="mr-2" />
                            Add Role
                        </button>
                    )}
                </div>

                {profile.profileTier === 'free' ? <UpgradeCta /> : (
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
                                <p className="text-sm text-gray-600">
                                    Top skills: {role.skills.sort((a,b) => b.rating - a.rating).slice(0, 3).map(s => s.name).join(', ')}.
                                </p>
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
            </div>

            <div className="bg-white p-5 rounded-lg shadow mb-6">
                <h2 className="text-2xl font-bold mb-4">Case Studies / Portfolio</h2>
                 <div className="space-y-4">
                    {caseStudies.map(cs => (
                        <div key={cs.id} className="flex items-center gap-2">
                            <input type="text" placeholder="Project Name" value={cs.name} onChange={e => handleCaseStudyChange(cs.id, 'name', e.target.value)} className="w-1/3 border p-2 rounded" />
                            <input type="text" placeholder="https://example.com/project" value={cs.url} onChange={e => handleCaseStudyChange(cs.id, 'url', e.target.value)} className="w-2/3 border p-2 rounded" />
                            <button type="button" onClick={() => removeCaseStudy(cs.id)} className="text-red-500 hover:text-red-700"><Trash2 size={18} /></button>
                        </div>
                    ))}
                    <button type="button" onClick={addCaseStudy} className="flex items-center text-blue-600 font-semibold hover:text-blue-800 pt-2">
                        <Plus size={18} className="mr-1" /> Add Case Study
                    </button>
                 </div>
            </div>

            <div className="bg-white p-5 rounded-lg shadow mb-6">
                <h2 className="text-2xl font-bold mb-4 flex items-center">
                    <Clapperboard size={24} className="mr-3 text-blue-600"/>
                    Visual Case Studies (Storyboards)
                </h2>
                {profile.profileTier === 'free' ? <UpgradeCta /> : (
                    <div>
                        <p className="text-gray-600 mb-4">Create engaging, step-by-step visual stories of your projects to impress potential clients. This is a great way to showcase complex installations or project lifecycles.</p>
                        
                        <div className="space-y-3 mb-4">
                            <div className="p-3 border rounded-md flex justify-between items-center bg-gray-50">
                                <div>
                                    <p className="font-semibold">Corporate HQ AV Integration</p>
                                    <p className="text-xs text-gray-500">Last updated: 3 days ago</p>
                                </div>
                                <div>
                                    <button type="button" onClick={() => setActiveView('Create Storyboard')} className="text-blue-600 hover:underline text-sm font-semibold p-2">View/Edit</button>
                                    <button type="button" onClick={() => alert("Delete functionality not implemented.")} className="text-red-600 hover:underline text-sm font-semibold p-2">Delete</button>
                                </div>
                            </div>
                        </div>

                        <button
                            type="button"
                            onClick={() => setActiveView('Create Storyboard')}
                            className="flex items-center px-4 py-2 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700"
                        >
                            <Plus size={18} className="mr-2" />
                            Create New Storyboard
                        </button>
                    </div>
                )}
            </div>

            <EditSkillProfileModal 
                isOpen={isSkillModalOpen}
                onClose={() => setIsSkillModalOpen(false)}
                onSave={handleSaveRole}
                availableRoles={availableRoles}
                initialRole={editingRole?.role}
            />
        </form>
    );
};