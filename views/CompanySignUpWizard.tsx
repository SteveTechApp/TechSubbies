import React, { useState } from 'react';
import { useAppContext } from '../context/InteractionContext';
import { BrandLogo } from '../components/BrandLogo';
import { ArrowLeft } from '../components/Icons';
import { Country } from '../types';
import { LocationAutocomplete } from '../components/LocationAutocomplete';

interface CompanySignUpWizardProps {
    onCancel: () => void;
}

export const CompanySignUpWizard = ({ onCancel }: CompanySignUpWizardProps) => {
    const { createAndLoginCompany } = useAppContext();

    const [formData, setFormData] = useState({
        contactName: '',
        email: '',
        password: '',
        companyName: '',
        website: '',
        regNumber: '',
        country: Country.UK,
        location: 'London, UK',
    });

    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const inputClass = 'mt-2 w-full rounded-xl border border-white/10 bg-slate-950 px-4 py-3 text-white outline-none placeholder:text-slate-600 transition focus:border-cyan-300 focus:ring-2 focus:ring-cyan-300/10';
    const labelClass = 'block text-sm font-semibold text-slate-200';

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        setError('');
    };

    const handleLocationChange = (value: string) => {
        setFormData(prev => ({ ...prev, location: value }));
    };

    const handleCancel = () => {
        if (window.confirm('Are you sure? This will return you to the start of the signup process.')) {
            onCancel();
        }
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

        const freeEmailProviders = /@(gmail|yahoo|hotmail|outlook|aol)\.com$/i;

        if (freeEmailProviders.test(formData.email)) {
            setError('Please use a commercial email address, for example you@yourcompany.com.');
            return;
        }

        setIsLoading(true);
        try {
            await createAndLoginCompany(formData);
        } catch (err: any) {
            setError(err.message || 'Could not create the account. Please try again.');
            setIsLoading(false);
        }
    };

    return (
        <div className="relative min-h-screen overflow-hidden bg-slate-950 text-white">
            <div className="pointer-events-none absolute inset-x-0 top-0 h-80 bg-[radial-gradient(circle_at_top_left,rgba(34,211,238,0.14),transparent_52%)]" />
            <main className="relative mx-auto flex min-h-screen w-full max-w-5xl flex-col justify-center px-5 py-10 sm:py-14">
                <div className="w-full">
                    <button
                        type="button"
                        onClick={handleCancel}
                        className="mb-5 flex items-center rounded-xl px-1 py-2 font-semibold text-slate-400 transition-colors hover:text-cyan-200"
                    >
                        <ArrowLeft size={18} className="mr-2" />
                        Back to Login
                    </button>

                    <div className="overflow-hidden rounded-3xl border border-cyan-300/20 bg-slate-900 shadow-2xl shadow-cyan-950/30">
                        <header className="border-b border-white/10 bg-slate-900/80 px-6 py-7 sm:px-9">
                            <BrandLogo />
                            <p className="mt-7 text-xs font-bold uppercase tracking-[0.28em] text-cyan-300">Company account</p>
                            <h1 className="mt-3 text-3xl font-bold tracking-tight text-white sm:text-4xl">
                                Client company signup
                            </h1>
                            <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-400 sm:text-base">
                                Create your company account to post projects and connect with suitable technical specialists.
                            </p>
                        </header>

                        <form onSubmit={handleSubmit} className="space-y-5 px-6 py-7 sm:px-9 sm:py-9">
                            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                                <div>
                                    <label className={labelClass}>Your full name</label>
                                    <input
                                        type="text"
                                        name="contactName"
                                        value={formData.contactName}
                                        onChange={handleChange}
                                        placeholder="e.g. Alex Smith"
                                        className={inputClass}
                                        autoComplete="name"
                                    />
                                </div>

                                <div>
                                    <label className={labelClass}>Company email</label>
                                    <input
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        placeholder="alex@yourcompany.com"
                                        className={inputClass}
                                        autoComplete="email"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className={labelClass}>Password</label>
                                <input
                                    type="password"
                                    name="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    placeholder="••••••••"
                                    className={inputClass}
                                    autoComplete="new-password"
                                />
                            </div>

                            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                                <div>
                                    <label className={labelClass}>Official company name</label>
                                    <input
                                        type="text"
                                        name="companyName"
                                        value={formData.companyName}
                                        onChange={handleChange}
                                        placeholder="e.g. Pro AV Solutions Ltd"
                                        className={inputClass}
                                        autoComplete="organization"
                                    />
                                </div>

                                <div>
                                    <label className={labelClass}>Company website</label>
                                    <input
                                        type="url"
                                        name="website"
                                        value={formData.website}
                                        onChange={handleChange}
                                        placeholder="https://proavsolutions.com"
                                        className={inputClass}
                                        autoComplete="url"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                                <div>
                                    <label className={labelClass}>Country</label>
                                    <select
                                        name="country"
                                        value={formData.country}
                                        onChange={handleChange}
                                        className={`${inputClass} appearance-none`}
                                    >
                                        {Object.values(Country).map(c => (
                                            <option key={c} value={c}>{c}</option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <label className={labelClass}>Location</label>
                                    <LocationAutocomplete
                                        value={formData.location}
                                        onValueChange={handleLocationChange}
                                        variant="dark"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className={labelClass}>Company registration / VAT number</label>
                                <input
                                    type="text"
                                    name="regNumber"
                                    value={formData.regNumber}
                                    onChange={handleChange}
                                    placeholder="Enter your registration number"
                                    className={inputClass}
                                />
                                <p className="mt-2 text-xs text-slate-500">
                                    This helps us verify your organisation.
                                </p>
                            </div>

                            {error && (
                                <div role="alert" className="rounded-xl border border-red-300/30 bg-red-300/10 px-4 py-3 text-sm text-red-100">
                                    {error}
                                </div>
                            )}

                            <div className="border-t border-white/10 pt-6">
                                <button
                                    type="submit"
                                    disabled={isLoading}
                                    className="w-full rounded-xl bg-cyan-300 px-5 py-3.5 font-bold text-slate-950 transition hover:bg-cyan-200 disabled:cursor-not-allowed disabled:opacity-60"
                                >
                                    {isLoading ? 'Verifying...' : 'Create Client Company Account'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </main>
        </div>
    );
};
