import React, { useState } from 'react';
import { useAppContext } from '../context/InteractionContext';
import { Logo } from '../components/Logo';
import { ArrowLeft } from '../components/Icons';
import { Country } from '../types';

interface ResourcingCompanySignUpWizardProps {
    onCancel: () => void;
}

export const ResourcingCompanySignUpWizard = ({ onCancel }: ResourcingCompanySignUpWizardProps) => {
    const { createAndLoginResourcingCompany } = useAppContext();
    const [formData, setFormData] = useState({
        contactName: '',
        email: '',
        password: '',
        companyName: '',
        website: '',
        country: Country.UK,
        location: 'London, UK',
    });
    const [error, setError] = useState('');

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        setError('');
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        for (const key in formData) {
            if (!formData[key as keyof typeof formData]) {
                setError('All fields are required.');
                return;
            }
        }
        createAndLoginResourcingCompany(formData);
    };

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
            <div className="w-full max-w-lg">
                 <button onClick={onCancel} className="flex items-center text-gray-600 hover:text-gray-900 font-semibold transition-colors mb-4">
                    <ArrowLeft size={18} className="mr-2" />
                    Back to Login
                </button>
                 <div className="bg-white rounded-lg shadow-xl p-8">
                    <Logo className="mb-4 h-16" />
                    <h1 className="text-2xl font-bold text-gray-800">Resourcing Partner Signup</h1>
                    <p className="text-gray-500 mb-6">Join the platform to manage your talent and find placements.</p>
                     <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block font-medium text-sm mb-1">Your Name</label>
                                <input type="text" name="contactName" value={formData.contactName} onChange={handleChange} className="w-full border p-2 rounded" />
                            </div>
                            <div>
                                <label className="block font-medium text-sm mb-1">Company Email</label>
                                <input type="email" name="email" value={formData.email} onChange={handleChange} className="w-full border p-2 rounded" />
                            </div>
                        </div>
                        <div>
                            <label className="block font-medium text-sm mb-1">Password</label>
                            <input type="password" name="password" value={formData.password} onChange={handleChange} className="w-full border p-2 rounded" />
                        </div>
                         <div>
                            <label className="block font-medium text-sm mb-1">Agency Name</label>
                            <input type="text" name="companyName" value={formData.companyName} onChange={handleChange} className="w-full border p-2 rounded" />
                        </div>
                         <div>
                            <label className="block font-medium text-sm mb-1">Agency Website</label>
                            <input type="url" name="website" value={formData.website} onChange={handleChange} className="w-full border p-2 rounded" />
                        </div>
                        
                        {error && <p className="text-sm text-red-600">{error}</p>}
                        
                        <div className="pt-4">
                            <button type="submit" className="w-full py-3 bg-indigo-600 text-white font-bold rounded-lg hover:bg-indigo-700">
                                Create Agency Account
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};
