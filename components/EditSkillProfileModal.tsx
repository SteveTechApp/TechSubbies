import React, { useState, useEffect } from 'react';
import { X, Trash2, Plus } from 'lucide-react';
import { EngineerProfile } from '../context/AppContext.tsx';

interface EditSkillProfileModalProps {
    isOpen: boolean;
    onClose: () => void;
    userProfile: EngineerProfile;
    onSave: (profile: EngineerProfile) => void;
}

export const EditSkillProfileModal = ({ isOpen, onClose, userProfile, onSave }: EditSkillProfileModalProps) => {
    const [editedProfile, setEditedProfile] = useState<EngineerProfile>(userProfile);

    useEffect(() => {
        setEditedProfile(userProfile);
    }, [userProfile]);

    if (!isOpen || !editedProfile) return null;

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setEditedProfile(prev => ({ ...prev, [name]: value }));
    };

    const handleSkillChange = (index: number, field: string, value: string | number) => {
        const newSkills = [...editedProfile.skills];
        newSkills[index] = { ...newSkills[index], [field]: value };
        setEditedProfile(prev => ({ ...prev, skills: newSkills }));
    };

    const addSkill = () => {
        setEditedProfile(prev => ({
            ...prev,
            skills: [...prev.skills, { name: '', rating: 3 }]
        }));
    };

    const removeSkill = (index: number) => {
        setEditedProfile(prev => ({
            ...prev,
            skills: prev.skills.filter((_, i) => i !== index)
        }));
    };

    const handleSave = () => {
        onSave(editedProfile);
        onClose();
    };

    return (
        <div className='fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50'>
            <div className='bg-white rounded-lg p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto'>
                <div className='flex justify-between items-center mb-6'>
                    <h2 className='text-2xl font-bold'>Edit Profile</h2>
                    <button onClick={onClose}><X className='text-gray-500' /></button>
                </div>
                <div className='space-y-4'>
                    <div>
                        <label className='block font-medium mb-1'>Full Name</label>
                        <input type='text' name='name' value={editedProfile.name} onChange={handleInputChange} className='w-full border p-2 rounded' />
                    </div>
                    <div>
                        <label className='block font-medium mb-1'>Tagline / Role</label>
                        <input type='text' name='tagline' value={editedProfile.tagline} onChange={handleInputChange} className='w-full border p-2 rounded' />
                    </div>
                    <div>
                        <label className='block font-medium mb-1'>Bio / Description</label>
                        <textarea name='description' value={editedProfile.description} onChange={handleInputChange} rows={4} className='w-full border p-2 rounded' />
                    </div>
                    <h3 className='text-xl font-bold pt-4 border-t'>Skills</h3>
                    {editedProfile.skills.map((skill, index) => (
                        <div key={index} className='flex items-center space-x-2'>
                            <input type='text' placeholder='Skill Name' value={skill.name} onChange={(e) => handleSkillChange(index, 'name', e.target.value)} className='w-full border p-2 rounded' />
                            <input type='range' min='1' max='5' value={skill.rating} onChange={(e) => handleSkillChange(index, 'rating', parseInt(e.target.value))} className='w-32' />
                            <span className='w-8 text-center'>{skill.rating}</span>
                            <button onClick={() => removeSkill(index)} className='text-red-500'><Trash2 size={18} /></button>
                        </div>
                    ))}
                    <button onClick={addSkill} className='flex items-center text-blue-600'>
                        <Plus size={18} className='mr-1' /> Add Skill
                    </button>
                    <div className='flex justify-end space-x-4 pt-6'>
                        <button onClick={onClose} className='px-4 py-2 bg-gray-200 rounded'>Cancel</button>
                        <button onClick={handleSave} className='px-4 py-2 bg-blue-600 text-white rounded'>Save Changes</button>
                    </div>
                </div>
            </div>
        </div>
    );
};
