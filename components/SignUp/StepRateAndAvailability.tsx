import React from 'react';
import { Currency } from '../../types/index.ts';

interface StepRateAndAvailabilityProps {
    data: { currency: Currency, minDayRate: number, maxDayRate: number, availability: string };
    onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
}

export const StepRateAndAvailability = ({ data, onChange }: StepRateAndAvailabilityProps) => {

    const handleMaxRateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = parseInt(e.target.value, 10);
        if (value > 195) {
            e.target.value = '195';
        }
        onChange(e);
    };

    return (
        <div className="fade-in-up">
            <h2 className="text-xl font-semibold mb-4">Step 4: Rate & Availability</h2>
            <div className="space-y-4">
                <div>
                    <label className="block font-medium mb-1">Your Day Rate Range</label>
                    <div className="flex gap-4">
                        <div className="w-1/3">
                            <label className="block text-sm font-medium text-gray-500">Currency</label>
                            <select name="currency" value={data.currency} onChange={onChange} className="w-full border p-2 rounded bg-white h-[42px]">
                                <option value={Currency.GBP}>GBP (£)</option>
                                <option value={Currency.USD}>USD ($)</option>
                            </select>
                        </div>
                        <div className="w-1/3">
                            <label className="block text-sm font-medium text-gray-500">Minimum</label>
                            <input type="number" name="minDayRate" value={data.minDayRate} step="5" onChange={onChange} className="w-full border p-2 rounded" />
                        </div>
                        <div className="w-1/3">
                            <label className="block text-sm font-medium text-gray-500">Maximum</label>
                            <input type="number" name="maxDayRate" value={data.maxDayRate} step="5" onChange={handleMaxRateChange} max="195" className="w-full border p-2 rounded" />
                        </div>
                    </div>
                     <div className="mt-2 p-3 bg-blue-50 border border-blue-200 text-blue-800 rounded-md text-sm">
                        For your free <strong>Basic Profile</strong>, the maximum day rate is capped at £195. You can set a higher rate range after upgrading to a premium profile.
                    </div>
                </div>

                <div>
                    <label className="block font-medium mb-1">Availability</label>
                    <input type="date" name="availability" value={data.availability} onChange={onChange} className="w-full border p-2 rounded" />
                    <p className="text-xs text-gray-500 mt-1">This date will be visible to companies searching for talent. You can update it any time from your dashboard.</p>
                </div>
            </div>
        </div>
    );
};