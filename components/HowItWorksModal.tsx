import React from 'react';
import { X } from './Icons.tsx';
import { Page } from '../types/index.ts';
import { FeatureSlideshow } from './FeatureSlideshow.tsx';

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
        <div
            className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50 p-4"
            onClick={onClose}
        >
            <div
                className="bg-white rounded-lg m-4 max-w-4xl w-full relative transform transition-all duration-300 flex flex-col max-h-[90vh]"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="flex-shrink-0 p-6 text-center border-b">
                     <button onClick={onClose} className="absolute top-4 right-4 text-gray-500 hover:text-gray-800" aria-label="Close modal">
                        <X size={24} />
                    </button>
                    <h2 className="text-3xl font-bold">How It Works</h2>
                    <p className="text-gray-500 mt-1">A smarter connection between expertise and opportunity.</p>
                </div>
                
                {/* Animated Slideshow */}
                <div className="flex-grow p-4 sm:p-8 overflow-hidden">
                    <FeatureSlideshow />
                </div>

                {/* Sticky Footer CTA */}
                <div className="flex-shrink-0 mt-auto p-6 border-t bg-gray-50 rounded-b-lg text-center">
                    <h3 className="text-xl font-bold text-gray-800">Ready to Get Started?</h3>
                    <p className="text-gray-600 my-2">Join the network and take control of your freelance career today.</p>
                    <button 
                        onClick={() => handleNavigate('engineerSignUp')} 
                        className="bg-blue-600 text-white font-bold py-3 px-8 rounded-lg hover:bg-blue-700 transition-transform transform hover:scale-105 mt-2"
                    >
                        Create Your Profile Now
                    </button>
                </div>
            </div>
        </div>
    );
};
