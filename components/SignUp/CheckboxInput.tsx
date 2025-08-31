import React from 'react';

interface CheckboxInputProps {
    label: string;
    name: string;
    checked: boolean;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export const CheckboxInput = ({ label, name, checked, onChange }: CheckboxInputProps) => (
    <label className="flex items-center p-3 border rounded-lg cursor-pointer hover:bg-gray-50 has-[:checked]:bg-blue-50 has-[:checked]:border-blue-500">
        <input
            type="checkbox"
            name={name}
            checked={checked}
            onChange={onChange}
            className="h-5 w-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
        />
        <span className="ml-3 text-sm font-medium text-gray-700">{label}</span>
    </label>
);
