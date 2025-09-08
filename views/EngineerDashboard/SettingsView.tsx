
import React, { useState } from 'react';
import { EngineerProfile } from '../../types';
import { Save, ArrowLeft, ShieldCheck, AlertTriangle } from '../../components/Icons';
import { useAppContext } from '../../context/AppContext';

interface SettingsViewProps {
    profile: EngineerProfile;
    onSave: (updatedProfile: Partial<EngineerProfile>) => void;
    setActiveView: (view: string) => void;
}

export const SettingsView = ({ profile, onSave, setActiveView }: SettingsViewProps) => {
    const { reactivateProfile } = useAppContext();
    const [formData, setFormData] = useState({
        jobDigestOptIn: profile.jobDigestOptIn ?? false,
        jobAlertsEnabled: profile.jobAlertsEnabled ?? false,
        status: profile.status
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, checked } = e.target;
        setFormData(prev => ({ ...prev, [name]: checked }));
    };

    const handleDeactivate = () => {
        if (window.confirm("Are you sure you want to deactivate your profile? You will be hidden from search results but can reactivate at any time.")) {
            onSave({ status: 'inactive' });
            setFormData(prev => ({ ...prev, status: 'inactive' }));
        }
    };
    
    const handleReactivate = () => {
        reactivateProfile();
        setFormData(prev => ({ ...prev, status: 'active' }));
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave({
            jobDigestOptIn: formData.jobDigestOptIn,
            jobAlertsEnabled: formData.jobAlertsEnabled,
        });
        alert("Settings saved successfully!");
    };

    return (
        <div>
            <button 
                onClick={() => setActiveView('Dashboard')} 
                className="flex items-center mb-4 px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300"
            >
                <ArrowLeft size={16} className="mr-2" />
                Back to Dashboard
            </button>
            <h1 className="text-3xl font-bold mb-4">Account Settings</h1>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                    <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow space-y-6">
                        <div>
                            <h2 className="text-xl font-bold flex items-center mb-4">
                                <ShieldCheck size={22} className="mr-2 text-blue-600" />
                                Privacy & Notifications
                            </h2>
                            <div className="space-y-4">
                                <div className="relative flex items-start">
                                    <div className="flex items-center h-5">
                                        <input
                                            id="jobDigestOptIn"
                                            name="jobDigestOptIn"
                                            type="checkbox"
                                            checked={formData.jobDigestOptIn}
                                            onChange={handleChange}
                                            className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300 rounded"
                                        />
                                    </div>
                                    <div className="ml-3 text-sm">
                                        <label htmlFor="jobDigestOptIn" className="font-medium text-gray-700">Weekly Job Digest</label>
                                        <p className="text-gray-500">Receive a weekly email with top-matching jobs based on your skills.</p>
                                    </div>
                                </div>
                                <div className="relative flex items-start">
                                    <div className="flex items-center h-5">
                                        <input
                                            id="jobAlertsEnabled"
                                            name="jobAlertsEnabled"
                                            type="checkbox"
                                            checked={formData.jobAlertsEnabled}
                                            onChange={handleChange}
                                            className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300 rounded"
                                        />
                                    </div>
                                    <div className="ml-3 text-sm">
                                        <label htmlFor="jobAlertsEnabled" className="font-medium text-gray-700">Instant Job Alerts</label>
                                        <p className="text-gray-500">Get notified as soon as a new high-match job is posted.</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="flex justify-end pt-6 border-t">
                            <button
                                type="submit"
                                className="flex items-center px-6 py-2 bg-blue-600 text-white font-bold rounded-md hover:bg-blue-700"
                            >
                                <Save size={18} className="mr-2" />
                                Save Preferences
                            </button>
                        </div>
                    </form>
                </div>
                <div className="lg:col-span-1 space-y-6">
                     <div className="bg-white p-6 rounded-lg shadow">
                         <h3 className="text-lg font-bold mb-2">Profile Status</h3>
                         {formData.status === 'active' ? (
                            <>
                                <p className="text-sm text-gray-600 mb-3">Your profile is currently active and visible in search results.</p>
                                <button onClick={handleDeactivate} className="w-full px-4 py-2 bg-yellow-500 text-yellow-900 font-semibold rounded-md hover:bg-yellow-600">Deactivate Profile</button>
                            </>
                         ) : (
                             <>
                                <p className="text-sm text-gray-600 mb-3">Your profile is inactive and hidden from searches.</p>
                                <button onClick={handleReactivate} className="w-full px-4 py-2 bg-green-500 text-white font-semibold rounded-md hover:bg-green-600">Reactivate Profile</button>
                            </>
                         )}
                    </div>
                     <div className="bg-red-50 p-6 rounded-lg shadow border border-red-200">
                         <h3 className="text-lg font-bold mb-2 text-red-800 flex items-center">
                            <AlertTriangle size={20} className="mr-2"/>
                            Danger Zone
                         </h3>
                         <p className="text-sm text-red-700 mb-3">This action is irreversible and will permanently delete your account and all associated data.</p>
                         <button onClick={() => alert("This is a demo. Account deletion is not implemented.")} className="w-full px-4 py-2 bg-red-600 text-white font-semibold rounded-md hover:bg-red-700">Delete My Account</button>
                    </div>
                </div>
            </div>
        </div>
    );
};