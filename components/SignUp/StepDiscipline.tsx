import React from 'react';
import { Discipline } from '../../types/index.ts';

interface StepDisciplineProps {
    data: { discipline: Discipline, location: string, experience: number };
    onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
}

export const StepDiscipline = ({ data, onChange }: StepDisciplineProps) => (
    <div className="fade-in-up">
        <h2 className="text-xl font-semibold mb-4">Step 2: Your Discipline</h2>
        <div className="space-y-4">
            <div>
                <label className="block font-medium mb-2">What is your primary discipline?</label>
                <div className="space-y-2">
                    <label className="flex items-center p-3 border rounded-lg cursor-pointer hover:bg-gray-50 has-[:checked]:bg-blue-50 has-[:checked]:border-blue-500">
                        <input type="radio" name="discipline" value={Discipline.AV} checked={data.discipline === Discipline.AV} onChange={onChange} className="h-5 w-5 text-blue-600 focus:ring-blue-500" />
                        <span className="ml-3 text-gray-700">{Discipline.AV}</span>
                    </label>
                    <label className="flex items-center p-3 border rounded-lg cursor-pointer hover:bg-gray-50 has-[:checked]:bg-blue-50 has-[:checked]:border-blue-500">
                        <input type="radio" name="discipline" value={Discipline.IT} checked={data.discipline === Discipline.IT} onChange={onChange} className="h-5 w-5 text-blue-600 focus:ring-blue-500" />
                        <span className="ml-3 text-gray-700">{Discipline.IT}</span>
                    </label>
                    <label className="flex items-center p-3 border rounded-lg cursor-pointer hover:bg-gray-50 has-[:checked]:bg-blue-50 has-[:checked]:border-blue-500">
                        <input type="radio" name="discipline" value={Discipline.BOTH} checked={data.discipline === Discipline.BOTH} onChange={onChange} className="h-5 w-5 text-blue-600 focus:ring-blue-500" />
                        <span className="ml-3 text-gray-700">{Discipline.BOTH}</span>
                    </label>
                </div>
            </div>
            <div>
                <label className="block font-medium mb-1">Location</label>
                <input type="text" name="location" value={data.location} onChange={onChange} placeholder="e.g., London, UK" className="w-full border p-2 rounded" />
            </div>
            <div>
                <label className="block font-medium mb-1">Years of General Experience</label>
                <input type="number" name="experience" value={data.experience} onChange={onChange} className="w-full border p-2 rounded" />
            </div>
        </div>
    </div>
);
