

import React, { useState, useEffect } from 'react';
import { SkillProfile, Skill, Currency } from '../types';
import { X, Star, Trash2, Plus } from 'lucide-react';
import { SKILL_ROLES } from '../constants';

interface EditSkillProfileModalProps {
  profile: SkillProfile;
  onClose: () => void;
  onSave: (profile: SkillProfile) => void;
  currency: string;
}

const EditableRating: React.FC<{ rating: number; onRatingChange: (rating: number) => void }> = ({ rating, onRatingChange }) => (
    <div className="flex items-center">
        {[...Array(5)].map((_, i) => (
             <button type="button" key={i} onClick={() => onRatingChange(i + 1)} aria-label={`Set rating to ${i + 1}`}>
                <Star className={`h-5 w-5 cursor-pointer ${i < rating ? 'text-yellow-400' : 'text-gray-300 hover:text-yellow-300'}`} fill="currentColor" />
             </button>
        ))}
    </div>
);


export const EditSkillProfileModal: React.FC<EditSkillProfileModalProps> = ({ profile, onClose, onSave, currency }) => {
    const [draftProfile, setDraftProfile] = useState<SkillProfile>({ ...profile, skills: [...profile.skills], customSkills: [...profile.customSkills] });
    const isNewProfile = !profile.roleTitle; // New profiles are initialized with an empty title

    useEffect(() => {
        // Deep copy to prevent mutation of original state
        const deepCopiedProfile = JSON.parse(JSON.stringify(profile));
        setDraftProfile(deepCopiedProfile);
    }, [profile]);
    
    const handleSkillChange = (index: number, field: 'name' | 'rating', value: string | number) => {
        const newSkills = [...draftProfile.skills];
        // @ts-ignore
        newSkills[index][field] = value;
        setDraftProfile(prev => ({ ...prev, skills: newSkills }));
    };

    const addSkill = () => {
        const newSkill: Skill = { id: `new_${Date.now()}`, name: '', rating: 1 };
        setDraftProfile(prev => ({ ...prev, skills: [...prev.skills, newSkill] }));
    };

    const removeSkill = (index: number) => {
        const newSkills = draftProfile.skills.filter((_, i) => i !== index);
        setDraftProfile(prev => ({ ...prev, skills: newSkills }));
    };

    const handleSave = () => {
        onSave(draftProfile);
    };

    return (
        <div 
          className="fixed inset-0 bg-black bg-opacity-60 z-50 flex items-center justify-center p-4" 
          aria-labelledby="edit-profile-title" 
          role="dialog" 
          aria-modal="true"
          onClick={onClose}
        >
          <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl transform transition-all" onClick={(e) => e.stopPropagation()}>
            <div className="flex justify-between items-center p-5 border-b border-gray-200">
              <h2 id="edit-profile-title" className="text-xl font-bold text-gray-800">
                  {isNewProfile ? 'Add New Skill Profile' : 'Edit Skill Profile'}
              </h2>
              <button onClick={onClose} className="text-gray-400 hover:text-gray-600" aria-label="Close">
                <X size={24} />
              </button>
            </div>
    
            <div className="p-6 space-y-6 max-h-[70vh] overflow-y-auto">
                {/* General Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                     <div>
                        <label htmlFor="roleTitle" className="block text-sm font-medium text-gray-700 mb-1">Role Title</label>
                        <select
                            id="roleTitle"
                            value={draftProfile.roleTitle}
                            onChange={(e) => setDraftProfile(prev => ({ ...prev, roleTitle: e.target.value }))}
                            className="w-full p-2 border border-gray-300 rounded-md bg-white"
                        >
                            <option value="" disabled>Select a role...</option>
                            {SKILL_ROLES.map(role => (
                                <option key={role} value={role}>{role}</option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label htmlFor="dayRate" className="block text-sm font-medium text-gray-700 mb-1">Day Rate ({currency})</label>
                         <div className="relative">
                            <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-500">{currency}</span>
                            <input
                                type="number"
                                id="dayRate"
                                value={draftProfile.dayRate}
                                onChange={(e) => setDraftProfile(prev => ({ ...prev, dayRate: parseInt(e.target.value, 10) || 0 }))}
                                className="w-full p-2 pl-7 border border-gray-300 rounded-md"
                            />
                        </div>
                    </div>
                </div>

                {/* Skills Section */}
                <div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">Self-Assessed Skills</h3>
                    <div className="space-y-3 p-3 bg-gray-50 rounded-md border">
                        {draftProfile.skills.map((skill, index) => (
                            <div key={index} className="grid grid-cols-12 gap-2 items-center">
                                <input
                                    type="text"
                                    value={skill.name}
                                    onChange={(e) => handleSkillChange(index, 'name', e.target.value)}
                                    placeholder="Skill Name (e.g., Cable Lacing)"
                                    className="col-span-6 p-2 border border-gray-300 rounded-md"
                                />
                                <div className="col-span-5">
                                    <EditableRating rating={skill.rating} onRatingChange={(r) => handleSkillChange(index, 'rating', r)} />
                                </div>
                                <button onClick={() => removeSkill(index)} className="col-span-1 text-red-500 hover:text-red-700 flex justify-center items-center">
                                    <Trash2 size={20} />
                                </button>
                            </div>
                        ))}
                         <button onClick={addSkill} className="flex items-center text-sm text-blue-600 font-semibold hover:text-blue-800 mt-2">
                            <Plus size={16} className="mr-1"/> Add Skill
                         </button>
                    </div>
                </div>
            </div>
    
            <div className="flex justify-end items-center p-5 border-t border-gray-200 bg-gray-50 rounded-b-lg">
                <button onClick={onClose} className="px-4 py-2 text-sm font-semibold text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 mr-3">
                    Cancel
                </button>
                <button onClick={handleSave} className="px-6 py-2 text-sm font-semibold text-white bg-blue-600 rounded-md hover:bg-blue-700">
                    Save Changes
                </button>
            </div>
          </div>
        </div>
      );
};