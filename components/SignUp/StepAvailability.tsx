import React from 'react';

interface StepAvailabilityProps {
    data: { availability: string };
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export const StepAvailability = ({ data, onChange }: StepAvailabilityProps) => (
    <div className="fade-in-up">
        <h2 className="text-xl font-semibold mb-4">Step 5: Availability</h2>
        <div>
            <label className="block font-medium mb-1">Available for new projects from:</label>
            <input type="date" name="availability" value={data.availability} onChange={onChange} className="w-full border p-2 rounded" />
            <p className="text-xs text-gray-500 mt-1">This date will be visible to companies searching for talent. You can update it any time from your dashboard.</p>
        </div>
    </div>
);
