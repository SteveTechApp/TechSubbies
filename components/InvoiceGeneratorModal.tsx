import React, { useState } from 'react';
import { InvoiceItem, PaymentTerms } from '../types/index.ts';
import { X, FileText } from './Icons.tsx';

interface InvoiceGeneratorModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (paymentTerms: PaymentTerms) => void;
    items: InvoiceItem[];
}

export const InvoiceGeneratorModal = ({ isOpen, onClose, onSubmit, items }: InvoiceGeneratorModalProps) => {
    const [paymentTerms, setPaymentTerms] = useState<PaymentTerms>(PaymentTerms.NET14);

    if (!isOpen) return null;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit(paymentTerms);
        onClose();
    };
    
    const totalAmount = items.reduce((sum, item) => sum + item.amount, 0);

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
                <h2 className="text-2xl font-bold mb-4 flex items-center">
                    <FileText className="mr-2" /> Generate Invoice
                </h2>

                <div className="space-y-4">
                    <div>
                        <h3 className="font-semibold mb-2">Invoice Items:</h3>
                        <div className="p-3 bg-gray-50 border rounded-md space-y-2">
                            {items.map((item, index) => (
                                <div key={index} className="flex justify-between text-sm">
                                    <span>{item.description}</span>
                                    <span className="font-medium">£{item.amount.toFixed(2)}</span>
                                </div>
                            ))}
                            <div className="flex justify-between font-bold pt-2 border-t">
                                <span>Total</span>
                                <span>£{totalAmount.toFixed(2)}</span>
                            </div>
                        </div>
                    </div>
                    <div>
                        <label htmlFor="paymentTerms" className="block text-sm font-medium text-gray-700 mb-1">
                            Payment Terms
                        </label>
                        <select
                            id="paymentTerms"
                            value={paymentTerms}
                            onChange={e => setPaymentTerms(e.target.value as PaymentTerms)}
                            className="w-full border p-2 rounded bg-white"
                        >
                            {Object.values(PaymentTerms).map(term => (
                                <option key={term} value={term}>{term}</option>
                            ))}
                        </select>
                    </div>
                </div>

                <div className="flex justify-end space-x-4 mt-6 pt-4 border-t">
                    <button type="button" onClick={onClose} className="px-6 py-2 bg-gray-200 rounded-md hover:bg-gray-300">
                        Cancel
                    </button>
                    <button type="submit" className="px-6 py-2 bg-blue-600 text-white font-bold rounded-md hover:bg-blue-700">
                        Generate & Send Invoice
                    </button>
                </div>
            </form>
        </div>
    );
};