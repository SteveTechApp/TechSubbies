import React, { useState } from 'react';
import { Timesheet, Contract, Role } from '../types/index.ts';
import { useAppContext } from '../context/AppContext.tsx';
import { Loader } from './Icons.tsx';

interface TimesheetRowProps {
    timesheet: Timesheet;
    contract: Contract;
    userRole: Role;
}

const StatusBadge = ({ status }: { status: string }) => {
    const STATUS_INFO: Record<string, { text: string, color: string }> = {
        submitted: { text: 'Submitted', color: 'bg-yellow-100 text-yellow-800' },
        approved: { text: 'Approved', color: 'bg-blue-100 text-blue-800' },
        paid: { text: 'Paid', color: 'bg-green-100 text-green-800' },
    };
    const info = STATUS_INFO[status] || { text: status, color: 'bg-gray-200 text-gray-800' };
    return <span className={`px-3 py-1 text-xs font-bold rounded-full ${info.color}`}>{info.text}</span>;
};


export const TimesheetRow = ({ timesheet, contract, userRole }: TimesheetRowProps) => {
    const { approveTimesheet } = useAppContext();
    const [isLoading, setIsLoading] = useState(false);
    
    const totalAmount = Number(contract.amount) * timesheet.days;

    const handleApprove = async () => {
        setIsLoading(true);
        await new Promise(resolve => setTimeout(resolve, 500)); // Simulate API call
        approveTimesheet(contract.id, timesheet.id);
        setIsLoading(false);
    };

    const renderAction = () => {
        if (isLoading) return <Loader className="animate-spin w-5 h-5 text-gray-500"/>;
        if ((userRole === Role.COMPANY || userRole === Role.ADMIN) && timesheet.status === 'submitted') {
            return (
                <button onClick={handleApprove} className="px-3 py-1 text-sm bg-green-600 text-white rounded hover:bg-green-700">
                    Approve & Pay
                </button>
            );
        }
        return null;
    };

    return (
        <div className="flex justify-between items-center p-3 bg-gray-50 rounded-md border">
            <div>
                <p className="font-semibold">{timesheet.period}</p>
                <p className="text-sm text-gray-600">{timesheet.days} days at {contract.currency}{contract.amount}/day = <span className="font-bold">{contract.currency}{totalAmount.toFixed(2)}</span></p>
            </div>
            <div className="flex items-center gap-4">
                <StatusBadge status={timesheet.status} />
                <div className="w-28 text-right">
                    {renderAction()}
                </div>
            </div>
        </div>
    );
};