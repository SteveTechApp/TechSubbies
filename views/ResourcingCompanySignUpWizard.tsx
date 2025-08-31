import React, { useState } from 'react';
import { useAppContext } from '../context/AppContext.tsx';
import { Logo } from '../components/Logo.tsx';
import { ArrowLeft } from '../components/Icons.tsx';

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
        regNumber: '',
    });
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        setError('');
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        // 1. Basic Validation
        for (const key in formData) {
            if (!formData[key as keyof typeof formData]) {
                setError('All fields are required.');
                return;
            }
        }

        // 2. Commercial Email Check
        const freeEmailProviders = /@(gmail|yahoo|hotmail|outlook|aol)\.com$/i;
        if (freeEmailProviders.test(formData.email)) {
            setError('Please use a commercial email address (e.g., you@yourcompany.com).');
            return;
        }

        setIsLoading(true);
        
        // Context function handles verification logic and login
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
                    <h1 className="text-2xl font-bold text-gray-800">Create Your Resourcing Account</h1>
                    <p className="text-gray-500 mb-6">Let's get you set up to manage your talent roster and find them work.</p>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block font-medium text-sm mb-1">Your Full Name</label>
                                <input type="text" name="contactName" value={formData.contactName} onChange={handleChange} placeholder="e.g., Alex Smith" className="w-full border p-2 rounded" />
                            </div>
                            <div>
                                <label className="block font-medium text-sm mb-1">Company Email</label>
                                <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="alex@yourcompany.com" className="w-full border p-2 rounded" />
                            </div>
                        </div>
                        <div>
                            <label className="block font-medium text-sm mb-1">Password</label>
                            <input type="password" name="password" value={formData.password} onChange={handleChange} placeholder="••••••••" className="w-full border p-2 rounded" />
                        </div>
                         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                             <div>
                                <label className="block font-medium text-sm mb-1">Official Company Name</label>
                                <input type="text" name="companyName" value={formData.companyName} onChange={handleChange} placeholder="e.g., AV Placements Ltd" className="w-full border p-2 rounded" />
                            </div>
                            <div>
                                <label className="block font-medium text-sm mb-1">Company Website</label>
                                <input type="url" name="website" value={formData.website} onChange={handleChange} placeholder="https://avplacements.com" className="w-full border p-2 rounded" />
                            </div>
                        </div>
                         <div>
                            <label className="block font-medium text-sm mb-1">Company Reg / VAT Number</label>
                            <input type="text" name="regNumber" value={formData.regNumber} onChange={handleChange} placeholder="Enter your registration number" className="w-full border p-2 rounded" />
                            <p className="text-xs text-gray-500 mt-1">This helps us verify your organization. (Try starting with "VALID")</p>
                        </div>

                        {error && <p className="text-sm text-red-600">{error}</p>}
                        
                        <div className="pt-4">
                            <button type="submit" disabled={isLoading} className="w-full py-3 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 disabled:bg-blue-300">
                                {isLoading ? 'Verifying...' : 'Create Account & Login'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};