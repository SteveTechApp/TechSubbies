import React from 'react';
import { useAppContext } from '../context/InteractionContext';
import { FileText, DollarSign, Clock } from '../components/Icons';
import { InvoiceStatus } from '../types';
import { formatDisplayDate } from '../utils/dateFormatter';

const getStatusClass = (status: InvoiceStatus) => {
    switch (status) {
        case InvoiceStatus.PAID: return 'bg-green-100 text-green-800';
        case InvoiceStatus.SENT: return 'bg-blue-100 text-blue-800';
        case InvoiceStatus.OVERDUE: return 'bg-red-100 text-red-800';
        default: return 'bg-gray-100 text-gray-800';
    }
};

export const InvoicesView = () => {
    const { user, invoices, findUserByProfileId } = useAppContext();

    if (!user) return null;

    const myInvoices = invoices.filter(
        inv => inv.engineerId === user.profile.id || inv.companyId === user.profile.id
    );

    return (
        <div>
            <h1 className="text-3xl font-bold mb-6 flex items-center">
                <FileText size={30} className="mr-3 text-blue-600" />
                Invoices
            </h1>
            
            <div className="bg-white rounded-lg shadow overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Invoice ID</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                {user.role === 'Engineer' ? 'Client' : 'Contractor'}
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Amount</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Due Date</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                            <th className="relative px-6 py-3"><span className="sr-only">Actions</span></th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {myInvoices.map(invoice => {
                            const otherPartyId = user.role === 'Engineer' ? invoice.companyId : invoice.engineerId;
                            const otherParty = findUserByProfileId(otherPartyId);
                            return (
                                <tr key={invoice.id}>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{invoice.id}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">{otherParty?.profile.name || '...'}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-800">£{invoice.total.toFixed(2)}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{formatDisplayDate(invoice.dueDate)}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusClass(invoice.status)}`}>
                                            {invoice.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                        <button className="text-blue-600 hover:text-blue-900">View</button>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    );
};
