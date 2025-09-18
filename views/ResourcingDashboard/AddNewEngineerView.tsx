import React, { useState } from 'react';
import { Currency, Discipline, ExperienceLevel, Country } from '../../types';
import { useAppContext } from '../../context/InteractionContext';
import { Save, ArrowLeft } from '../../components/Icons';

interface AddNewEngineerViewProps {
    resourcingCompanyId: string;
    onEngineerAdded: () => void;
}

export const AddNewEngineerView = ({ resourcingCompanyId, onEngineerAdded }: AddNewEngineerViewProps) => {
    const { createManagedEngineer } = useAppContext();
    const [formData, setFormData] = useState({
        name: '',
        discipline: Discipline.AV,
        location: 'London, UK',
        experience: 5,
        experienceLevel: ExperienceLevel.MID_LEVEL,
        country: Country.UK,
        minDayRate: 300,
        maxDayRate: 400,
        currency: Currency.GBP,
        availability: new Date().toISOString().split('T')[0],
        email: '',
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        createManagedEngineer(resourcingCompanyId, formData);
        alert(`${formData.name} has been added to your roster.`);
        onEngineerAdded();
    };

    return (
        <div>
            <button 
                onClick={onEngineerAdded} 
                className="flex items-center mb-4 px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300"
            >
                <ArrowLeft size={16} className="mr-2" />
                Back to Roster
            </button>
            <h1 className="text-3xl font-bold mb-4">Add New Engineer</h1>
            <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow max-w-2xl">
                <div className="space-y-4">
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block font-medium mb-1 text-sm">Full Name</label>
                            <input type="text" name="name" value={formData.name} onChange={handleChange} className="w-full border p-2 rounded" required />
                        </div>
                        <div>
                            <label className="block font-medium mb-1 text-sm">Email Address</label>
                            <input type="email" name="email" value={formData.email} onChange={handleChange} className="w-full border p-2 rounded" required />
                        </div>
                    </div>
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block font-medium mb-1 text-sm">Primary Discipline</label>
                            <select name="discipline" value={formData.discipline} onChange={handleChange} className="w-full border p-2 rounded bg-white h-[42px]">
                                {Object.values(Discipline).map(d => <option key={d} value={d}>{d}</option>)}
                            </select>
                        </div>
                        <div>
                            <label className="block font-medium mb-1 text-sm">Location</label>
                            <input type="text" name="location" value={formData.location} onChange={handleChange} className="w-full border p-2 rounded" />
                        </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block font-medium mb-1 text-sm">Day Rate Range ({formData.currency})</label>
                            <div className="flex gap-2">
                                <input type="number" name="minDayRate" value={formData.minDayRate} onChange={handleChange} className="w-1/2 border p-2 rounded" placeholder="Min" />
                                <input type="number" name="maxDayRate" value={formData.maxDayRate} onChange={handleChange} className="w-1/2 border p-2 rounded" placeholder="Max" />
                            </div>
                        </div>
                        <div>
                            <label className="block font-medium mb-1 text-sm">Available From</label>
                            <input type="date" name="availability" value={formData.availability} onChange={handleChange} className="w-full border p-2 rounded" />
                        </div>
                    </div>
                </div>
                 <div className="flex justify-end pt-6 mt-6 border-t">
                    <button type="submit" className="flex items-center px-6 py-2 bg-blue-600 text-white font-bold rounded-md hover:bg-blue-700">
                        <Save size={18} className="mr-2" /> Save Engineer
                    </button>
                </div>
            </form>
        </div>
    );
};
