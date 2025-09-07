import React, { useState } from 'react';
import { Contract, Timesheet } from '../types';
import { X } from './Icons';

interface TimesheetSubmitModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (timesheet: Omit<Timesheet, 'id' | 'contractId' | 'engineerId' | 'status'>) => void;
    contract: Contract;
}

export const TimesheetSubmitModal = ({ isOpen, onClose, onSubmit, contract }: TimesheetSubmitModalProps) => {
    const [period, setPeriod] = useState('');
    const [days, setDays] = useState(0);

    if (!isOpen) return null;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!period.trim() || days <= 0) {
            alert("Please enter a valid work period and number of days.");
            return;
        }
        onSubmit({ period, days });
    };
    
    const totalAmount = (Number(contract.amount) || 0) * days;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50 p-4" onClick={onClose}>
            <form
                onSubmit={handleSubmit}
                className="bg-white rounded-lg p-6 m-4 max-w-lg w-full relative transform transition-all duration-300"
                onClick={e => e.stopPropagation()}
            >
                <button type="button" onClick={onClose} className="absolute top-4 right-4 text-gray-500 hover:text-gray-800">
                    <X size={24} />
                </button>

                <h2 className="text-2xl font-bold mb-4">Submit Timesheet</h2>
                <p className="text-gray-600 mb-6">For contract: {contract.jobTitle}</p>
                
                <div className="space-y-4">
                    <div>
                        <label htmlFor="period" className="block font-medium mb-1">Work Period</label>
                        <input
                            id="period"
                            type="text"
                            value={period}
                            onChange={e => setPeriod(e.target.value)}
                            placeholder="e.g., Week ending 2024-08-09"
                            className="w-full border p-2 rounded-md focus:ring-2 focus:ring-blue-500"
                            required
                        />
                    </div>
                     <div>
                        <label htmlFor="days" className="block font-medium mb-1">Number of Days Worked</label>
                        <input
                            id="days"
                            type="number"
                            value={days}
                            min="0.5"
                            step="0.5"
                            onChange={e => setDays(parseFloat(e.target.value) || 0)}
                            className="w-full border p-2 rounded-md focus:ring-2 focus:ring-blue-500"
                            required
                        />
                    </div>
                     <div className="p-3 bg-gray-50 border rounded-md text-right">
                        <span className="text-sm text-gray-500">Day Rate: {contract.currency}{contract.amount}</span>
                        <p className="font-bold text-lg">Total Amount: {contract.currency}{totalAmount.toFixed(2)}</p>
                    </div>
                </div>

                <div className="flex justify-end space-x-4 mt-6 pt-4 border-t">
                    <button type="button" onClick={onClose} className="px-6 py-2 bg-gray-200 rounded-md hover:bg-gray-300">Cancel</button>
                    <button
                        type="submit"
                        className="px-6 py-2 bg-blue-600 text-white font-bold rounded-md hover:bg-blue-700"
                    >
                        Submit for Approval
                    </button>
                </div>
            </form>
        </div>
    );
};