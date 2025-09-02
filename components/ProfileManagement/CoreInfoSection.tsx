import React from 'react';
import { EngineerProfile, Discipline } from '../../types/index.ts';

interface CoreInfoSectionProps {
    formData: Partial<EngineerProfile>;
    onProfileChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
}

export const CoreInfoSection = ({ formData, onProfileChange }: CoreInfoSectionProps) => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
            <label className="block font-medium mb-1">Full Name</label>
            <input type="text" name="name" value={formData.name || ''} onChange={onProfileChange} className="w-full border p-2 rounded" />
        </div>
        <div>
            <label className="block font-medium mb-1">Discipline</label>
            <select name="discipline" value={formData.discipline || ''} onChange={onProfileChange} className="w-full border p-2 rounded bg-white">
                <option value={Discipline.AV}>{Discipline.AV}</option>
                <option value={Discipline.IT}>{Discipline.IT}</option>
                <option value={Discipline.BOTH}>{Discipline.BOTH}</option>
            </select>
        </div>
        <div>
            <label className="block font-medium mb-1">Location</label>
            <input type="text" name="location" value={formData.location || ''} onChange={onProfileChange} className="w-full border p-2 rounded" />
        </div>
        <div>
            <label className="block font-medium mb-1">Years of Experience</label>
            <input type="number" name="experience" value={formData.experience || 0} onChange={onProfileChange} className="w-full border p-2 rounded" />
        </div>
        <div className="md:col-span-2">
            <label className="block font-medium mb-1">Bio / Description</label>
            <textarea name="description" value={formData.description || ''} onChange={onProfileChange} rows={4} className="w-full border p-2 rounded" />
        </div>
    </div>
);