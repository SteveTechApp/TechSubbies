import React from 'react';
import { EngineerProfile } from '../../types/index.ts';

interface ProfileEssentialsProps {
    formData: EngineerProfile;
    setFormData: React.Dispatch<React.SetStateAction<EngineerProfile>>;
}

export const ProfileEssentials = ({ formData, setFormData }: ProfileEssentialsProps) => {
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    return (
        <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label className="block font-medium mb-1 text-sm">Full Name</label>
                    <input type="text" name="name" value={formData.name || ''} onChange={handleChange} className="w-full border p-2 rounded" />
                </div>
                <div>
                    <label className="block font-medium mb-1 text-sm">Location</label>
                    <input type="text" name="location" value={formData.location || ''} onChange={handleChange} className="w-full border p-2 rounded" />
                </div>
            </div>
            <div>
                <label className="block font-medium mb-1 text-sm">Profile Bio / Description</label>
                <textarea name="description" value={formData.description || ''} onChange={handleChange} rows={4} className="w-full border p-2 rounded" />
            </div>
        </div>
    );
};
