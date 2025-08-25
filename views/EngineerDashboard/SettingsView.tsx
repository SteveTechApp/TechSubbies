import React, { useState } from 'react';
import { EngineerProfile, Discipline } from '../../types/index.ts';

interface SettingsViewProps {
    profile: EngineerProfile;
    onSave: (updatedProfile: Partial<EngineerProfile>) => void;
}

export const SettingsView = ({ profile, onSave }: SettingsViewProps) => {
    const [formData, setFormData] = useState<Partial<EngineerProfile>>(profile);
    const [contactData, setContactData] = useState(profile.contact);

    const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleContactChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setContactData(prev => ({ ...prev, [name]: value }));
    };
    
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave({ ...formData, contact: contactData });
    };

    return (
        <div>
            <h1 className="text-3xl font-bold mb-4">Settings</h1>
            <form onSubmit={handleSubmit} className="bg-white p-5 rounded-lg shadow space-y-6">
                
                <div>
                    <h2 className="text-xl font-bold border-b pb-2 mb-4">Core Information</h2>
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
                    <h2 className="text-xl font-bold border-b pb-2 mb-4">Contact Details</h2>
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

                <div className="flex justify-end pt-4">
                    <button type="submit" className="px-6 py-3 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 text-lg">
                        Save Settings
                    </button>
                </div>
            </form>
        </div>
    );
};