import React, { useState } from 'react';
import { Contract, ContractType } from '../types/index.ts';
import { X, CheckCircle } from './Icons.tsx';
import { useAppContext } from '../context/AppContext.tsx';

interface SignContractModalProps {
    isOpen: boolean;
    onClose: () => void;
    contract: Contract;
    onSubmit: (signatureName: string) => void;
}

export const SignContractModal = ({ isOpen, onClose, contract, onSubmit }: SignContractModalProps) => {
    const { user } = useAppContext();
    const [signatureName, setSignatureName] = useState(user?.profile.name || '');
    const [hasAgreed, setHasAgreed] = useState(false);

    if (!isOpen || !user) return null;

    const handleSubmit = () => {
        if (!signatureName.trim()) {
            alert("Please type your full name to sign.");
            return;
        }
        if (!hasAgreed) {
            alert("You must agree to the terms to sign.");
            return;
        }
        onSubmit(signatureName);
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50 p-4" onClick={onClose}>
            <div className="bg-white rounded-lg p-6 m-4 max-w-xl w-full relative transform transition-all duration-300" onClick={e => e.stopPropagation()}>
                <button onClick={onClose} className="absolute top-4 right-4 text-gray-500 hover:text-gray-800">
                    <X size={24} />
                </button>

                <h2 className="text-2xl font-bold mb-2">Review & Sign Contract</h2>
                <p className="text-gray-600 mb-6">You are about to sign a legally binding agreement.</p>
                
                <div className="p-4 bg-gray-50 border rounded-md mb-4">
                    <h3 className="font-bold">Contract Summary:</h3>
                    <p className="text-sm"><strong>Type:</strong> {contract.type}</p>
                    <p className="text-sm"><strong>Amount:</strong> {contract.currency}{contract.amount} ({contract.type === ContractType.SOW ? 'Total' : '/ day'})</p>
                </div>

                <div className="space-y-4">
                    <div>
                        <label htmlFor="signatureName" className="block font-medium mb-1">Type your full name to sign:</label>
                        <input
                            type="text"
                            id="signatureName"
                            value={signatureName}
                            onChange={(e) => setSignatureName(e.target.value)}
                            className="w-full border p-2 rounded-md font-serif text-lg"
                            placeholder="Your Full Name"
                        />
                    </div>
                     <div className="relative flex items-start">
                        <div className="flex items-center h-5">
                            <input
                                id="agreement"
                                name="agreement"
                                type="checkbox"
                                checked={hasAgreed}
                                onChange={(e) => setHasAgreed(e.target.checked)}
                                className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300 rounded"
                            />
                        </div>
                        <div className="ml-3 text-sm">
                            <label htmlFor="agreement" className="font-medium text-gray-700">
                                I agree that my typed name constitutes my electronic signature and that I am signing a legally binding contract.
                            </label>
                        </div>
                    </div>
                </div>

                <div className="flex justify-end space-x-4 mt-6 pt-4 border-t">
                    <button onClick={onClose} className="px-6 py-2 bg-gray-200 rounded-md hover:bg-gray-300">Cancel</button>
                    <button
                        onClick={handleSubmit}
                        disabled={!signatureName.trim() || !hasAgreed}
                        className="flex items-center px-6 py-2 bg-green-600 text-white font-bold rounded-md hover:bg-green-700 disabled:bg-green-300"
                    >
                        <CheckCircle size={18} className="mr-2" />
                        Sign Agreement
                    </button>
                </div>
            </div>
        </div>
    );
};