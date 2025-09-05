import React from 'react';
import { useAppContext } from '../context/AppContext.tsx';
import { Invoice, Role, InvoiceStatus } from '../types/index.ts';
import { CreditCard, Download, AlertTriangle } from '../components/Icons.tsx';
import { PaymentModal } from '../components/PaymentModal.tsx';

const getStatusBadge = (status: InvoiceStatus) => {
    const STATUS_INFO: Record<InvoiceStatus, { text: string, color: string }> = {
        [InvoiceStatus.DRAFT]: { text: 'Draft', color: 'bg-gray-200 text-gray-800' },
        [InvoiceStatus.SENT]: { text: 'Sent', color: 'bg-blue-100 text-blue-800' },
        [InvoiceStatus.PAID]: { text: 'Paid', color: 'bg-green-100 text-green-800' },
        [InvoiceStatus.OVERDUE]: { text: 'Overdue', color: 'bg-red-100 text-red-800' },
        [InvoiceStatus.DISPUTED]: { text: 'Disputed', color: 'bg-yellow-100 text-yellow-800' },
    };
    const info = STATUS_INFO[status];
    return <span className={`px-3 py-1 text-xs font-bold rounded-full ${info.color}`}>{info.text}</span>;
};

const InvoiceRow = ({ invoice, userRole }: { invoice: Invoice; userRole: Role }) => {
    const { findUserByProfileId, payInvoice, reportUser } = useAppContext();
    const [isPaymentModalOpen, setIsPaymentModalOpen] = React.useState(false);
    
    const otherPartyId = userRole === Role.ENGINEER ? invoice.companyId : invoice.engineerId;
    const otherParty = findUserByProfileId(otherPartyId);
    
    const handlePaySuccess = () => {
        payInvoice(invoice.id);
        setIsPaymentModalOpen(false);
    };

    return (
        <>
        {isPaymentModalOpen && (
            <PaymentModal
                isOpen={isPaymentModalOpen}
                onClose={() => setIsPaymentModalOpen(false)}
                onSuccess={handlePaySuccess}
                amount={invoice.total}
                currency="GBP"
                paymentDescription={`Payment for Invoice #${invoice.id.slice(-6)}`}
            />
        )}
        <tr className="bg-white">
            <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">#{invoice.id.slice(-6)}</td>
            <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">{otherParty?.profile.name}</td>
            <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">{invoice.issueDate.toLocaleDateString()}</td>
            <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">{invoice.dueDate.toLocaleDateString()}</td>
            <td className="px-4 py-3 whitespace-nowrap text-sm font-bold text-gray-800">£{invoice.total.toFixed(2)}</td>
            <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">{getStatusBadge(invoice.status)}</td>
            <td className="px-4 py-3 whitespace-nowrap text-right text-sm font-medium space-x-2">
                <button className="text-blue-600 hover:text-blue-800"><Download size={16} /></button>
                {userRole !== Role.ENGINEER && invoice.status !== InvoiceStatus.PAID && (
                    <button onClick={() => setIsPaymentModalOpen(true)} className="px-3 py-1 bg-green-600 text-white rounded-md text-xs hover:bg-green-700">Pay Now</button>
                )}
                 {invoice.status !== InvoiceStatus.PAID && (
                    <button onClick={() => reportUser(otherParty!.profile.id)} className="px-3 py-1 bg-yellow-500 text-yellow-900 rounded-md text-xs hover:bg-yellow-600 flex items-center gap-1.5"><AlertTriangle size={12}/> Report Issue</button>
                )}
            </td>
        </tr>
        </>
    );
};


export const InvoicesView = () => {
    const { user, invoices } = useAppContext();

    if (!user) return null;

    const myInvoices = invoices
        .filter(inv => inv.companyId === user.profile.id || inv.engineerId === user.profile.id)
        .sort((a, b) => b.issueDate.getTime() - a.issueDate.getTime());

    return (
        <div>
            <h1 className="text-3xl font-bold mb-6 flex items-center">
                <CreditCard size={30} className="mr-3 text-green-600" /> Invoices
            </h1>

            <div className="bg-white rounded-lg shadow overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Invoice #</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{user.role === Role.ENGINEER ? 'Client' : 'Contractor'}</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Issued</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Due</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                            <th className="relative px-4 py-3"><span className="sr-only">Actions</span></th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                        {myInvoices.map(invoice => <InvoiceRow key={invoice.id} invoice={invoice} userRole={user.role} />)}
                    </tbody>
                </table>
                 {myInvoices.length === 0 && (
                    <p className="text-center py-8 text-gray-500">No invoices found.</p>
                )}
            </div>
        </div>
    );
};