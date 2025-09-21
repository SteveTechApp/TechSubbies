import React from 'react';
import { X, User, Building, Sparkles, Handshake } from './Icons';
// FIX: Corrected import path for types.
import { Page } from '../types';

interface HowItWorksModalProps {
    isOpen: boolean;
    onClose: () => void;
    onNavigate: (page: Page) => void;
}

export const HowItWorksModal = ({ isOpen, onClose, onNavigate }: HowItWorksModalProps) => {
    if (!isOpen) return null;

    const handleNavigate = (page: Page) => {
        onNavigate(page);
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50 p-4" onClick={onClose}>
            <div 
                className="bg-white rounded-lg m-4 max-w-4xl w-full relative transform transition-all duration-300" 
                onClick={e => e.stopPropagation()}
            >
                <button onClick={onClose} className="absolute top-4 right-4 text-gray-500 hover:text-gray-800" aria-label="Close modal">
                    <X size={24} />
                </button>
                <div className="p-8">
                    <h2 className="text-3xl font-bold text-center mb-8">How TechSubbies.com Works</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {/* For Engineers */}
                        <div className="p-6 border rounded-lg bg-gray-50">
                            <h3 className="text-2xl font-bold mb-4 flex items-center text-blue-700"><User className="mr-3" /> For Engineers</h3>
                            <ul className="space-y-4">
                                <li className="flex items-start">
                                    <Sparkles className="w-6 h-6 mr-3 mt-1 text-blue-500 flex-shrink-0" />
                                    <div>
                                        <h4 className="font-semibold">Showcase Your Skills</h4>
                                        <p className="text-gray-600">Create a detailed Skills Profile to let our AI match you with the perfect high-value contracts.</p>
                                    </div>
                                </li>
                                <li className="flex items-start">
                                    <Handshake className="w-6 h-6 mr-3 mt-1 text-blue-500 flex-shrink-0" />
                                    <div>
                                        <h4 className="font-semibold">Connect Directly</h4>
                                        <p className="text-gray-600">Apply for jobs with one click and communicate directly with hiring managers—no recruiters involved.</p>
                                    </div>
                                </li>
                            </ul>
                            {/* FIX: Replaced string literal with Page enum for type safety. */}
                            <button onClick={() => handleNavigate(Page.FOR_ENGINEERS)} className="mt-6 text-blue-600 font-bold hover:underline">Learn More &rarr;</button>
                        </div>

                        {/* For Companies */}
                        <div className="p-6 border rounded-lg bg-gray-50">
                            <h3 className="text-2xl font-bold mb-4 flex items-center text-green-700"><Building className="mr-3" /> For Companies</h3>
                            <ul className="space-y-4">
                                <li className="flex items-start">
                                    <Sparkles className="w-6 h-6 mr-3 mt-1 text-green-500 flex-shrink-0" />
                                    <div>
                                        <h4 className="font-semibold">Get AI-Powered Matches</h4>
                                        <p className="text-gray-600">Post a job for free and our AI instantly gives you a ranked shortlist of the best engineers for your role.</p>
                                    </div>
                                </li>
                                <li className="flex items-start">
                                    <Handshake className="w-6 h-6 mr-3 mt-1 text-green-500 flex-shrink-0" />
                                    <div>
                                        <h4 className="font-semibold">Hire in Hours, Not Weeks</h4>
                                        <p className="text-gray-600">No placement fees. Just direct access to elite, vetted talent so you can hire with confidence and speed.</p>
                                    </div>
                                </li>
                            </ul>
                            {/* FIX: Replaced string literal with Page enum for type safety. */}
                            <button onClick={() => handleNavigate(Page.FOR_COMPANIES)} className="mt-6 text-green-600 font-bold hover:underline">Learn More &rarr;</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};