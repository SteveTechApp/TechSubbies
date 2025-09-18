import React, { useState } from 'react';
import { Contract } from '../types';
import { X, FileText, CheckCircle } from './Icons';
import { eSignatureService } from '../services/eSignatureService';

interface SignContractModalProps {
    isOpen: boolean;
    onClose: () => void;
    contract: Contract;
    onSubmit: (signatureName: string) => void;
}

export const SignContractModal = ({ isOpen, onClose, contract, onSubmit }: SignContractModalProps) => {
    const [signatureName, setSignatureName] = useState('');
    const [agreed, setAgreed] = useState(false);
    const [isSigning, setIsSigning] = useState(false);

    if (!isOpen) return null;

    const handleSign = async () => {
        if (!agreed || !signatureName.trim()) {
            alert("Please agree to the terms and type your full name to sign.");
            return;
        }
        setIsSigning(true);
        // Simulate an e-signature API call
        await eSignatureService.createSignatureRequest(contract.description, signatureName, 'test@example.com');
        setIsSigning(false);
        onSubmit(signatureName);
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50 p-4" onClick={onClose}>
            <div
                className="bg-white rounded-lg m-4 max-w-3xl w-full relative transform transition-all duration-300 max-h-[90vh] flex flex-col"
                onClick={e => e.stopPropagation()}
            >
                <header className="flex-shrink-0 p-4 border-b flex justify-between items-center">
                    <h2 className="text-xl font-bold flex items-center"><FileText className="mr-3"/> Review & Sign Contract</h2>
                    <button onClick={onClose} className="text-gray-500 hover:text-gray-800"><X size={24} /></button>
                </header>
                <main className="flex-grow overflow-y-auto custom-scrollbar p-6">
                    <h3 className="font-bold text-lg mb-2">{contract.jobTitle}</h3>
                    <p className="text-sm text-gray-500 mb-4">Contract ID: {contract.id}</p>
                    <div className="p-4 bg-gray-50 border rounded-md max-h-64 overflow-y-auto">
                        <p className="whitespace-pre-wrap text-sm">{contract.description}</p>
                    </div>
                </main>
                <footer className="flex-shrink-0 p-6 bg-gray-50 border-t">
                    <div className="flex items-center mb-4">
                        <input
                            type="checkbox"
                            id="agree-terms"
                            checked={agreed}
                            onChange={e => setAgreed(e.target.checked)}
                            className="h-5 w-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                        <label htmlFor="agree-terms" className="ml-3 text-sm font-medium">
                            I have read and agree to the terms of this contract. I understand this is a legally binding agreement.
                        </label>
                    </div>
                    <div className="flex flex-col sm:flex-row gap-3">
                        <input
                            type="text"
                            value={signatureName}
                            onChange={e => setSignatureName(e.target.value)}
                            placeholder="Type your full name to sign"
                            className="w-full border p-2 rounded"
                            disabled={!agreed}
                        />
                        <button
                            onClick={handleSign}
                            disabled={!agreed || !signatureName.trim() || isSigning}
                            className="flex items-center justify-center px-6 py-2 bg-green-600 text-white font-bold rounded-md hover:bg-green-700 disabled:bg-gray-400"
                        >
                           <CheckCircle size={18} className="mr-2" /> {isSigning ? 'Signing...' : 'Sign Contract'}
                        </button>
                    </div>
                </footer>
            </div>
        </div>
    );
};
