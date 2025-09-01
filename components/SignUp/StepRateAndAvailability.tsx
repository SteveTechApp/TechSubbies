import React from 'react';
import { Currency } from '../../types/index.ts';

interface StepRateAndAvailabilityProps {
    data: { currency: Currency, dayRate: number, availability: string };
    onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
}

export const StepRateAndAvailability = ({ data, onChange }: StepRateAndAvailabilityProps) => (
    <div className="fade-in-up">
        <h2 className="text-xl font-semibold mb-4">Step 4: Rate & Availability</h2>
        <div className="space-y-4">
            <div>
                <label className="block font-medium mb-1">Your Rate</label>
                <div className="flex gap-4">
                    <div className="w-1/3">
                        <label className="block text-sm font-medium text-gray-500">Currency</label>
                        <select name="currency" value={data.currency} onChange={onChange} className="w-full border p-2 rounded bg-white h-[42px]">
                            <option value={Currency.GBP}>GBP (£)</option>
                            <option value={Currency.USD}>USD ($)</option>
                        </select>
                    </div>
                    <div className="w-2/3">
                         <label className="block text-sm font-medium text-gray-500">Target Day Rate</label>
                        <input type="number" name="dayRate" value={data.dayRate} step="10" onChange={onChange} className="w-full border p-2 rounded" />
                    </div>
                </div>
                {Number(data.dayRate) > 195 && (
                    <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 text-yellow-800 rounded-md text-sm">
                        <strong>Note:</strong> Rates above £195 are typically for engineers with a detailed <strong>Skills Profile</strong>. You can upgrade after setup to maximize your visibility for higher-paid roles.
                    </div>
                )}
            </div>

            <div>
                <label className="block font-medium mb-1">Availability</label>
                <input type="date" name="availability" value={data.availability} onChange={onChange} className="w-full border p-2 rounded" />
                <p className="text-xs text-gray-500 mt-1">This date will be visible to companies searching for talent. You can update it any time from your dashboard.</p>
            </div>
        </div>
    </div>
);