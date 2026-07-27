import React, { useEffect, useState } from 'react';
import { useAppContext } from '../context/InteractionContext';
import { FileText, X } from '../components/Icons';
import { Invoice, InvoiceStatus } from '../types';
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
    const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);

    useEffect(() => {
        if (!selectedInvoice) return;
        const closeOnEscape = (event: KeyboardEvent) => {
            if (event.key === 'Escape') setSelectedInvoice(null);
        };
        window.addEventListener('keydown', closeOnEscape);
        return () => window.removeEventListener('keydown', closeOnEscape);
    }, [selectedInvoice]);

    if (!user) return null;

    const myInvoices = invoices.filter(
        invoice => invoice.engineerId === user.profile.id || invoice.companyId === user.profile.id
    );
    const getOtherParty = (invoice: Invoice) => {
        const otherPartyId = user.role === 'Engineer' ? invoice.companyId : invoice.engineerId;
        return findUserByProfileId(otherPartyId);
    };

    return (
        <div>
            <h1 className="mb-6 flex items-center text-3xl font-bold">
                <FileText size={30} className="mr-3 text-blue-600" />
                Invoices
            </h1>

            {myInvoices.length === 0 ? (
                <div className="rounded-lg border border-dashed border-gray-300 bg-white p-10 text-center shadow-sm">
                    <FileText size={40} className="mx-auto text-gray-400" />
                    <h2 className="mt-3 font-bold text-gray-900">No invoices yet</h2>
                    <p className="mt-1 text-sm text-gray-600">
                        Invoices will appear here when approved work is ready for payment.
                    </p>
                </div>
            ) : (
                <>
                    <div className="hidden overflow-x-auto rounded-lg bg-white shadow md:block">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium uppercase text-gray-500">Invoice ID</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium uppercase text-gray-500">
                                        {user.role === 'Engineer' ? 'Client' : 'Contractor'}
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium uppercase text-gray-500">Amount</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium uppercase text-gray-500">Due Date</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium uppercase text-gray-500">Status</th>
                                    <th className="relative px-6 py-3"><span className="sr-only">Actions</span></th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200 bg-white">
                                {myInvoices.map(invoice => (
                                    <tr key={invoice.id}>
                                        <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-gray-900">{invoice.id}</td>
                                        <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-800">{getOtherParty(invoice)?.profile.name || 'TechSubbies member'}</td>
                                        <td className="whitespace-nowrap px-6 py-4 text-sm font-semibold text-gray-800">£{invoice.total.toFixed(2)}</td>
                                        <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">{formatDisplayDate(invoice.dueDate)}</td>
                                        <td className="whitespace-nowrap px-6 py-4 text-sm">
                                            <span className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 ${getStatusClass(invoice.status)}`}>
                                                {invoice.status}
                                            </span>
                                        </td>
                                        <td className="whitespace-nowrap px-6 py-4 text-right text-sm font-medium">
                                            <button onClick={() => setSelectedInvoice(invoice)} className="text-blue-600 hover:text-blue-900">
                                                View details
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    <div className="space-y-3 md:hidden">
                        {myInvoices.map(invoice => (
                            <article key={invoice.id} className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
                                <div className="flex items-start justify-between gap-3">
                                    <div>
                                        <p className="font-bold text-gray-900">{invoice.id}</p>
                                        <p className="mt-1 text-sm text-gray-600">{getOtherParty(invoice)?.profile.name || 'TechSubbies member'}</p>
                                    </div>
                                    <span className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold ${getStatusClass(invoice.status)}`}>
                                        {invoice.status}
                                    </span>
                                </div>
                                <div className="mt-4 flex items-end justify-between gap-3 border-t border-gray-100 pt-3">
                                    <div>
                                        <p className="text-lg font-bold text-gray-900">£{invoice.total.toFixed(2)}</p>
                                        <p className="text-xs text-gray-500">Due {formatDisplayDate(invoice.dueDate)}</p>
                                    </div>
                                    <button onClick={() => setSelectedInvoice(invoice)} className="rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white">
                                        View details
                                    </button>
                                </div>
                            </article>
                        ))}
                    </div>
                </>
            )}

            {selectedInvoice && (
                <div
                    className="fixed inset-0 z-[70] flex items-end justify-center bg-black/50 p-0 sm:items-center sm:p-4"
                    onMouseDown={event => {
                        if (event.target === event.currentTarget) setSelectedInvoice(null);
                    }}
                >
                    <section
                        role="dialog"
                        aria-modal="true"
                        aria-labelledby="invoice-details-title"
                        className="max-h-[90vh] w-full overflow-y-auto rounded-t-xl bg-white p-5 shadow-2xl sm:max-w-2xl sm:rounded-xl sm:p-6"
                    >
                        <div className="flex items-start justify-between gap-4">
                            <div>
                                <p className="text-sm font-semibold text-blue-600">Invoice {selectedInvoice.id}</p>
                                <h2 id="invoice-details-title" className="mt-1 text-2xl font-bold text-gray-900">Invoice details</h2>
                            </div>
                            <button
                                type="button"
                                aria-label="Close invoice details"
                                onClick={() => setSelectedInvoice(null)}
                                className="rounded-md p-2 text-gray-500 hover:bg-gray-100"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        <dl className="mt-6 grid grid-cols-2 gap-4 rounded-lg bg-gray-50 p-4 text-sm">
                            <div>
                                <dt className="text-gray-500">Contract</dt>
                                <dd className="mt-1 break-all font-semibold text-gray-900">{selectedInvoice.contractId}</dd>
                            </div>
                            <div>
                                <dt className="text-gray-500">{user.role === 'Engineer' ? 'Client' : 'Contractor'}</dt>
                                <dd className="mt-1 font-semibold text-gray-900">{getOtherParty(selectedInvoice)?.profile.name || 'TechSubbies member'}</dd>
                            </div>
                            <div>
                                <dt className="text-gray-500">Issued</dt>
                                <dd className="mt-1 font-semibold text-gray-900">{formatDisplayDate(selectedInvoice.issueDate)}</dd>
                            </div>
                            <div>
                                <dt className="text-gray-500">Due</dt>
                                <dd className="mt-1 font-semibold text-gray-900">{formatDisplayDate(selectedInvoice.dueDate)}</dd>
                            </div>
                        </dl>

                        <div className="mt-6">
                            <h3 className="font-bold text-gray-900">Line items</h3>
                            <div className="mt-2 divide-y divide-gray-200 rounded-lg border border-gray-200">
                                {selectedInvoice.items.map((item, index) => (
                                    <div key={`${item.description}-${index}`} className="flex justify-between gap-4 p-3 text-sm">
                                        <span className="text-gray-700">{item.description}</span>
                                        <span className="whitespace-nowrap font-semibold text-gray-900">£{item.amount.toFixed(2)}</span>
                                    </div>
                                ))}
                                <div className="flex justify-between gap-4 bg-gray-50 p-3 font-bold text-gray-900">
                                    <span>Total</span>
                                    <span>£{selectedInvoice.total.toFixed(2)}</span>
                                </div>
                            </div>
                        </div>

                        <div className="mt-6 flex flex-col-reverse gap-2 sm:flex-row sm:justify-between">
                            <span className={`w-fit rounded-full px-3 py-2 text-sm font-semibold ${getStatusClass(selectedInvoice.status)}`}>
                                {selectedInvoice.status}
                            </span>
                            <div className="flex gap-2">
                                <button onClick={() => window.print()} className="rounded-md border border-gray-300 px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50">
                                    Print / save PDF
                                </button>
                                <button onClick={() => setSelectedInvoice(null)} className="rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700">
                                    Done
                                </button>
                            </div>
                        </div>
                    </section>
                </div>
            )}
        </div>
    );
};
