import React, { useState } from 'react';
import { Contract } from '../types';
import { X, FileText, CheckCircle, Loader } from './Icons';
import { eSignatureService } from '../services/eSignatureService';

interface SignContractModalProps {
    isOpen: boolean;
    onClose: () => void;
    contract: Contract;
    onSubmit: (signatureName: string) => void;
}

export const SignContractModal = ({ isOpen, onClose, contract, onSubmit }: SignContractModalProps) => {
    const [agreed, setAgreed] = useState(false);
    const [isSigning, setIsSigning] = useState(false);
    const [signUrl, setSignUrl] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);

    if (!isOpen) return null;

    const handleSign = async () => {
        if (!agreed) return;
        setIsSigning(true);
        setError(null);
        try {
            const session = await eSignatureService.createSigningSession(contract.id);
            if (session.provider === 'local') {
                await onSubmit(session.signerName);
                onClose();
                return;
            }
            if (!session.signUrl) throw new Error('The signing provider did not return a signing URL.');
            setSignUrl(session.signUrl);
        } catch (nextError) {
            setError(nextError instanceof Error ? nextError.message : 'Could not open secure signing.');
        } finally {
            setIsSigning(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50 p-4" onClick={onClose}>
            <div
                className="bg-white rounded-lg m-4 max-w-4xl w-full relative transform transition-all duration-300 max-h-[94vh] flex flex-col"
                onClick={e => e.stopPropagation()}
            >
                <header className="flex-shrink-0 p-4 border-b flex justify-between items-center">
                    <h2 className="text-xl font-bold flex items-center"><FileText className="mr-3"/> Review & Sign Contract</h2>
                    <button onClick={onClose} className="text-gray-500 hover:text-gray-800" aria-label="Close signing window"><X size={24} /></button>
                </header>

                {signUrl ? (
                    <main className="min-h-[70vh] flex flex-col">
                        <div className="px-5 py-3 bg-blue-50 border-b text-sm text-blue-900">
                            Complete the secure signature below. TechSubbies updates the contract only after the signing provider confirms the signature.
                        </div>
                        <iframe
                            src={signUrl}
                            title="Secure contract signing"
                            className="w-full flex-1 min-h-[68vh] border-0"
                            allow="clipboard-write"
                        />
                        <div className="p-4 border-t flex justify-end">
                            <button onClick={onClose} className="px-5 py-2 bg-gray-900 text-white font-semibold rounded-md hover:bg-gray-800">
                                Close signing window
                            </button>
                        </div>
                    </main>
                ) : (
                    <>
                        <main className="flex-grow overflow-y-auto custom-scrollbar p-6">
                            <h3 className="font-bold text-lg mb-2">{contract.jobTitle}</h3>
                            <p className="text-sm text-gray-500 mb-4">Contract ID: {contract.id}</p>
                            <div className="p-4 bg-gray-50 border rounded-md max-h-64 overflow-y-auto">
                                <p className="whitespace-pre-wrap text-sm">{contract.description}</p>
                            </div>
                            <p className="mt-4 text-sm text-gray-600">
                                Production signatures are completed through the secure e-signature provider. A typed name is not used as the legal signature.
                            </p>
                            {error && <div role="alert" className="mt-4 p-3 rounded-md bg-red-50 border border-red-200 text-sm text-red-700">{error}</div>}
                        </main>
                        <footer className="flex-shrink-0 p-6 bg-gray-50 border-t">
                            <div className="flex items-start mb-4">
                                <input
                                    type="checkbox"
                                    id="agree-terms"
                                    checked={agreed}
                                    onChange={e => setAgreed(e.target.checked)}
                                    className="h-5 w-5 mt-0.5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                />
                                <label htmlFor="agree-terms" className="ml-3 text-sm font-medium">
                                    I have reviewed the contract and want to continue to the secure signing process.
                                </label>
                            </div>
                            <div className="flex justify-end">
                                <button
                                    onClick={handleSign}
                                    disabled={!agreed || isSigning}
                                    className="flex items-center justify-center px-6 py-2 bg-green-600 text-white font-bold rounded-md hover:bg-green-700 disabled:bg-gray-400"
                                >
                                    {isSigning ? <Loader size={18} className="mr-2 animate-spin" /> : <CheckCircle size={18} className="mr-2" />}
                                    {isSigning ? 'Opening secure signing...' : 'Continue to Secure Signing'}
                                </button>
                            </div>
                        </footer>
                    </>
                )}
            </div>
        </div>
    );
};
