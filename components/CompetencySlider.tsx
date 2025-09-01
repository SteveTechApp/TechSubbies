import React from 'react';

interface CompetencySliderProps {
    label: string;
    value: number;
    onChange: (value: number) => void;
}

const getLevel = (value: number) => {
    if (value < 25) return { name: 'Novice', color: 'bg-gray-400' };
    if (value < 50) return { name: 'Competent', color: 'bg-blue-400' };
    if (value < 75) return { name: 'Proficient', color: 'bg-green-500' };
    return { name: 'Expert', color: 'bg-yellow-500' };
};

export const CompetencySlider = ({ label, value, onChange }: CompetencySliderProps) => {
    const level = getLevel(value);

    return (
        <div className="p-4 border rounded-lg">
            <label className="block font-medium mb-1">{label}</label>
            <div className="flex items-center gap-4">
                <input
                    type="range"
                    min="0"
                    max="100"
                    step="5"
                    value={value}
                    onChange={e => onChange(Number(e.target.value))}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                />
                <div className="flex-shrink-0 w-28 text-center">
                    <span className={`px-3 py-1 text-sm font-bold text-white rounded-full ${level.color}`}>
                        {level.name}
                    </span>
                </div>
            </div>
        </div>
    );
};