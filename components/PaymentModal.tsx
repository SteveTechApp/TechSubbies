import React, { useState } from 'react';
import { X, CreditCard, StripeLogo, Loader } from './Icons';

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
    const [error, setError] = useState('');

    if (!isOpen) return null;

    const handlePayment = async () => {
        setIsProcessing(true);
        setError('');
        // Simulate API call to a payment provider like Stripe
        await new Promise(resolve => setTimeout(resolve, 2000));
        // Simulate a successful payment
        setIsProcessing(false);
        onSuccess();
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50 p-4" onClick={onClose}>
            <div className="bg-white rounded-lg p-6 m-4 max-w-md w-full relative transform transition-all duration-300" onClick={e => e.stopPropagation()}>
                 <button onClick={onClose} className="absolute top-4 right-4 text-gray-500 hover:text-gray-800"><X size={24} /></button>
                <div className="text-center">
                    <StripeLogo className="mx-auto mb-4" />
                    <h2 className="text-xl font-bold">Secure Payment</h2>
                    <p className="text-gray-500 mt-1">{paymentDescription}</p>
                    <p className="text-4xl font-extrabold my-4">{currency}{amount.toFixed(2)}</p>
                </div>
                
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium">Card Number</label>
                        <div className="relative">
                            <CreditCard size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                            <input type="text" placeholder="**** **** **** 4242" className="w-full border p-2 rounded pl-10" />
                        </div>
                    </div>
                    <div className="flex gap-4">
                        <div className="flex-1">
                            <label className="block text-sm font-medium">Expiry</label>
                            <input type="text" placeholder="MM / YY" className="w-full border p-2 rounded" />
                        </div>
                        <div className="flex-1">
                            <label className="block text-sm font-medium">CVC</label>
                            <input type="text" placeholder="123" className="w-full border p-2 rounded" />
                        </div>
                    </div>
                </div>

                {error && <p className="text-red-500 text-sm mt-2 text-center">{error}</p>}
                
                <div className="mt-6">
                    <button
                        onClick={handlePayment}
                        disabled={isProcessing}
                        className="w-full flex items-center justify-center py-3 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 disabled:bg-blue-300"
                    >
                        {isProcessing ? <Loader className="animate-spin" /> : `Pay ${currency}${amount.toFixed(2)}`}
                    </button>
                </div>
            </div>
        </div>
    );
};
