import React, { useState } from 'react';
import { CompanyProfile } from '../../types';
import { Save } from '../../components/Icons';

interface SettingsViewProps {
    profile: CompanyProfile;
    onSave: (updatedProfile: Partial<CompanyProfile>) => void;
}

export const SettingsView = ({ profile, onSave }: SettingsViewProps) => {
    const [formData, setFormData] = useState<Partial<CompanyProfile>>(profile);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };
    
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave(formData);
        alert("Settings saved successfully!");
    };

    return (
        <div>
            <h1 className="text-3xl font-bold mb-4">Company Settings</h1>
            <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow max-w-2xl">
                <div className="space-y-6">
                    <div>
                        <label htmlFor="name" className="block text-sm font-medium text-gray-700">Company Name</label>
                        <input
                            type="text"
                            name="name"
                            id="name"
                            value={formData.name || ''}
                            onChange={handleChange}
                            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm p-2"
                        />
                    </div>
                    <div>
                        <label htmlFor="website" className="block text-sm font-medium text-gray-700">Website</label>
                        <input
                            type="url"
                            name="website"
                            id="website"
                            value={formData.website || ''}
                            onChange={handleChange}
                            placeholder="https://your-company.com"
                            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm p-2"
                        />
                    </div>
                    <div className="relative flex items-start">
                        <div className="flex items-center h-5">
                            <input
                                id="consentToFeature"
                                name="consentToFeature"
                                type="checkbox"
                                checked={formData.consentToFeature || false}
                                onChange={handleChange}
                                className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300 rounded"
                            />
                        </div>
                        <div className="ml-3 text-sm">
                            <label htmlFor="consentToFeature" className="font-medium text-gray-700">Feature on Homepage</label>
                            {/* FIX: Corrected branding from Wingman to TechSubbies.com. */}
                            <p className="text-gray-500">Allow TechSubbies.com to feature your company logo on our landing page.</p>
                        </div>
                    </div>
                </div>

                <div className="flex justify-end pt-6 mt-6 border-t">
                     <button
                        type="submit"
                        className="flex items-center px-6 py-2 bg-blue-600 text-white font-bold rounded-md hover:bg-blue-700"
                    >
                        <Save size={18} className="mr-2" />
                        Save Settings
                    </button>
                </div>
            </form>
        </div>
    );
};