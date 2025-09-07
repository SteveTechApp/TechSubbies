import React from 'react';
import { ProfileTier } from '../types';

// Define props for the component
interface RevenueSimulatorProps {
    subscriberNumbers: {
        [ProfileTier.PROFESSIONAL]: number;
        [ProfileTier.SKILLS]: number;
        [ProfileTier.BUSINESS]: number;
    };
    onSliderChange: (tier: ProfileTier, value: number) => void;
    totalArr: number;
}

// Helper to format currency
const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-GB', {
        style: 'currency',
        currency: 'GBP',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    }).format(value);
};

// The rebuilt component
export const RevenueSimulator = ({ subscriberNumbers, onSliderChange, totalArr }: RevenueSimulatorProps) => {

    const tiersToSimulate = [
        { tier: ProfileTier.PROFESSIONAL, label: 'Silver Subscribers', max: 5000, color: 'accent-slate-500' },
        { tier: ProfileTier.SKILLS, label: 'Gold Subscribers', max: 2500, color: 'accent-yellow-500' },
        { tier: ProfileTier.BUSINESS, label: 'Platinum Subscribers', max: 1000, color: 'accent-indigo-700' },
    ];

    return (
        <div className="max-w-4xl mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
                {tiersToSimulate.map(({ tier, label, max, color }) => (
                    <div key={tier} className="bg-gray-50 p-4 rounded-lg border">
                        <label htmlFor={`${tier}-slider`} className="block font-semibold text-gray-700">{label}</label>
                        <p className="text-3xl font-bold text-blue-600 my-2">{subscriberNumbers[tier].toLocaleString()}</p>
                        <input
                            id={`${tier}-slider`}
                            type="range"
                            min="0"
                            max={max}
                            step={tier === ProfileTier.BUSINESS ? 10 : 50}
                            value={subscriberNumbers[tier]}
                            onChange={(e) => onSliderChange(tier, parseInt(e.target.value, 10))}
                            className={`w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer ${color}`}
                        />
                        <div className="flex justify-between text-xs text-gray-500 mt-1">
                            <span>0</span>
                            <span>{max.toLocaleString()}</span>
                        </div>
                    </div>
                ))}
            </div>
            <div className="text-center bg-blue-600 text-white p-6 rounded-lg shadow-xl">
                <h4 className="text-lg font-semibold uppercase tracking-wider text-blue-200">Projected Annual Recurring Revenue (ARR)</h4>
                <p className="text-5xl font-extrabold my-2">{formatCurrency(totalArr)}</p>
                <p className="text-blue-200">Adjust the sliders to see how subscriber numbers impact revenue potential.</p>
            </div>
        </div>
    );
};