import React from 'react';

interface StepAccountProps {
    data: { name: string, email: string };
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export const StepAccount = ({ data, onChange }: StepAccountProps) => (
    <div className="fade-in-up">
        <h2 className="text-xl font-semibold mb-4">Step 1: Account Setup</h2>
        <div>
            <label className="block font-medium mb-1">Full Name</label>
            <input type="text" name="name" value={data.name} onChange={onChange} placeholder="e.g., Jane Doe" className="w-full border p-2 rounded" />
        </div>
        <div>
            <label className="block font-medium mb-1">Email Address</label>
            <input type="email" name="email" value={data.email} onChange={onChange} placeholder="you@company.com" className="w-full border p-2 rounded" />
        </div>
    </div>
);
