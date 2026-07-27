import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ResourcingCompanyProfile } from '../../types';
import { Save, ShieldCheck } from '../../components/Icons';

interface SettingsViewProps {
    profile: ResourcingCompanyProfile;
    onSave: (updatedProfile: Partial<ResourcingCompanyProfile>) => Promise<void>;
}

export const SettingsView = ({ profile, onSave }: SettingsViewProps) => {
    const [formData, setFormData] = useState<Partial<ResourcingCompanyProfile>>(profile);
    const [isSaving, setIsSaving] = useState(false);
    const [saveMessage, setSaveMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };
    
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSaving(true);
        setSaveMessage(null);
        try {
            await onSave(formData);
            setSaveMessage({ type: 'success', text: 'Settings saved successfully.' });
        } catch (error: any) {
            setSaveMessage({ type: 'error', text: error?.message || 'Could not save settings.' });
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div>
            <h1 className="text-3xl font-bold mb-4">Resourcing Agency Settings</h1>
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
                </div>

                <div className="flex justify-end pt-6 mt-6 border-t">
                     {saveMessage && (
                        <p
                            role="status"
                            className={`mr-auto text-sm font-semibold ${saveMessage.type === 'success' ? 'text-green-700' : 'text-red-700'}`}
                        >
                            {saveMessage.text}
                        </p>
                     )}
                     <button
                        type="submit"
                        disabled={isSaving}
                        className="flex items-center px-6 py-2 bg-blue-600 text-white font-bold rounded-md hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-gray-400"
                    >
                        <Save size={18} className="mr-2" />
                        {isSaving ? 'Saving…' : 'Save Settings'}
                    </button>
                </div>
            </form>
            <section className="mt-6 max-w-2xl rounded-lg border border-blue-200 bg-blue-50 p-6 shadow-sm">
                <h2 className="flex items-center text-lg font-bold text-blue-900">
                    <ShieldCheck size={20} className="mr-2" />
                    Account security and privacy
                </h2>
                <p className="mt-2 text-sm text-blue-800">
                    Manage your password, active sessions, data export, and account deletion request.
                </p>
                <Link to="/account/security" className="mt-4 inline-block rounded-md bg-blue-700 px-4 py-2 font-semibold text-white hover:bg-blue-800">
                    Open Account Security
                </Link>
            </section>
        </div>
    );
};
