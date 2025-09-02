import React, { useState } from 'react';
import { X, CreditCard, StripeLogo, Loader } from './Icons.tsx';

interface PaymentModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
    amount: number;
    currency: string;
    paymentDescription: string;
}

export const PaymentModal = ({ isOpen, onClose, onSuccess, amount, currency, paymentDescription }: PaymentModalProps) => {
    const [isProcessing, setIsProcessing] = useState(false);

    if (!isOpen) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsProcessing(true);
        // Simulate API call to Stripe
        await new Promise(resolve => setTimeout(resolve, 1500));
        setIsProcessing(false);
        onSuccess();
    };
    
    const formatCurrency = (value: number, curr: string) => {
        return new Intl.NumberFormat('en-GB', { style: 'currency', currency: curr }).format(value);
    }

    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50 p-4" onClick={onClose}>
            <div
                className="bg-white rounded-lg m-4 max-w-md w-full relative transform transition-all duration-300 flex flex-col"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="flex-shrink-0 p-6 border-b text-center">
                    <button onClick={onClose} className="absolute top-4 right-4 text-gray-500 hover:text-gray-800">
                        <X size={24} />
                    </button>
                    <StripeLogo className="mx-auto mb-3" />
                    <h2 className="text-lg font-medium text-gray-800">{paymentDescription}</h2>
                    <p className="text-3xl font-bold text-gray-900 mt-1">
                        {formatCurrency(amount, currency)}
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Cardholder Name</label>
                        <input type="text" placeholder="Jane Doe" className="mt-1 block w-full border-gray-300 rounded-md shadow-sm p-2" required />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Card Details</label>
                        <div className="mt-1 relative rounded-md shadow-sm">
                             <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <CreditCard className="h-5 w-5 text-gray-400" />
                            </div>
                            <input type="text" placeholder="0000 0000 0000 0000" className="w-full border-gray-300 rounded-md p-2 pl-10" required />
                        </div>
                    </div>
                     <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Expiry Date</label>
                            <input type="text" placeholder="MM / YY" className="mt-1 block w-full border-gray-300 rounded-md shadow-sm p-2" required />
                        </div>
                         <div>
                            <label className="block text-sm font-medium text-gray-700">CVC</label>
                            <input type="text" placeholder="123" className="mt-1 block w-full border-gray-300 rounded-md shadow-sm p-2" required />
                        </div>
                    </div>

                    <div className="pt-2">
                        <button
                            type="submit"
                            disabled={isProcessing}
                            className="w-full flex justify-center items-center px-4 py-3 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 disabled:bg-blue-300 transition-colors"
                        >
                            {isProcessing ? (
                                <>
                                    <Loader className="animate-spin w-5 h-5 mr-2" />
                                    Processing...
                                </>
                            ) : `Pay ${formatCurrency(amount, currency)}`}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};