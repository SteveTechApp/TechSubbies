
import React from 'react';
import { EngineerProfile, Discipline } from '../../types';
import { LocationAutocomplete } from '../LocationAutocomplete';

interface ProfileEssentialsProps {
    formData: EngineerProfile;
    setFormData: React.Dispatch<React.SetStateAction<EngineerProfile>>;
}

export const ProfileEssentials = ({ formData, setFormData }: ProfileEssentialsProps) => {

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: name === 'experience' ? parseInt(value, 10) || 0 : value
        }));
    };
    
    const handleLocationChange = (value: string) => {
        setFormData(prev => ({ ...prev, location: value }));
    };

    return (
        <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label className="block font-medium mb-1 text-sm">Full Name</label>
                    <input type="text" name="name" value={formData.name} onChange={handleChange} className="w-full border p-2 rounded" />
                </div>
                <div>
                    <label className="block font-medium mb-1 text-sm">Location</label>
                    <LocationAutocomplete value={formData.location} onValueChange={handleLocationChange} />
                </div>
            </div>
             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label className="block font-medium mb-1 text-sm">Primary Discipline</label>
                    <select name="discipline" value={formData.discipline} onChange={handleChange} className="w-full border p-2 rounded bg-white h-[42px]">
                        <option value={Discipline.AV}>{Discipline.AV}</option>
                        <option value={Discipline.IT}>{Discipline.IT}</option>
                        <option value={Discipline.BOTH}>{Discipline.BOTH}</option>
                    </select>
                </div>
                <div>
                    <label className="block font-medium mb-1 text-sm">Years of Experience</label>
                    <input type="number" name="experience" value={formData.experience} onChange={handleChange} className="w-full border p-2 rounded" />
                </div>
            </div>
             <div>
                <label className="block font-medium mb-1 text-sm">Profile Headline / Bio</label>
                <textarea 
                    name="description" 
                    value={formData.description} 
                    onChange={handleChange} 
                    rows={4}
                    placeholder="e.g., Certified Crestron programmer with 10+ years of experience in corporate AV integration..."
                    className="w-full border p-2 rounded"
                />
            </div>
        </div>
    );
};
