import React from 'react';
import { Discipline } from '../../types/index.ts';

interface StepCoreInfoProps {
    data: { name: string, email: string, discipline: Discipline, location: string, experience: number };
    setData: (data: any) => void;
}

export const StepCoreInfo = ({ data, setData }: StepCoreInfoProps) => {

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setData((prev: any) => ({ ...prev, [name]: value }));
    };

    return (
        <div className="fade-in-up">
            <h2 className="text-xl font-semibold mb-4">Step 1: Core Information</h2>
            <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block font-medium mb-1">Full Name</label>
                        <input type="text" name="name" value={data.name} onChange={handleChange} placeholder="e.g., Jane Doe" className="w-full border p-2 rounded" />
                    </div>
                    <div>
                        <label className="block font-medium mb-1">Email Address</label>
                        <input type="email" name="email" value={data.email} onChange={handleChange} placeholder="you@company.com" className="w-full border p-2 rounded" />
                    </div>
                </div>

                <div>
                    <label className="block font-medium mb-2">Primary Discipline</label>
                     <select name="discipline" value={data.discipline} onChange={handleChange} className="w-full border p-2 rounded bg-white">
                        <option value={Discipline.AV}>{Discipline.AV}</option>
                        <option value={Discipline.IT}>{Discipline.IT}</option>
                        <option value={Discipline.BOTH}>{Discipline.BOTH}</option>
                    </select>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block font-medium mb-1">Location</label>
                        <input type="text" name="location" value={data.location} onChange={handleChange} placeholder="e.g., London, UK" className="w-full border p-2 rounded" />
                    </div>
                    <div>
                        <label className="block font-medium mb-1">Years of Experience</label>
                        <input type="number" name="experience" value={data.experience} onChange={handleChange} className="w-full border p-2 rounded" />
                    </div>
                </div>
            </div>
        </div>
    );
};