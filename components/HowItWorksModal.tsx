import React from 'react';
import { X, PenSquare, Search, Handshake, Users, Briefcase, Star } from './Icons.tsx';
import { Page } from '../types/index.ts';

interface StepProps {
    icon: React.ComponentType<any>;
    title: string;
    description: string;
}

const Step = ({ icon: Icon, title, description }: StepProps) => (
    <div className="flex flex-col items-center text-center">
        <div className="bg-blue-100 text-blue-600 rounded-full p-4 mb-3"><Icon size={32} /></div>
        <h3 className="font-bold text-lg mb-1">{title}</h3>
        <p className="text-gray-600 text-sm">{description}</p>
    </div>
);

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
                className="bg-white rounded-lg p-8 m-4 max-w-5xl w-full relative transform transition-all duration-300 scale-100"
                onClick={(e) => e.stopPropagation()}
            >
                <button onClick={onClose} className="absolute top-4 right-4 text-gray-500 hover:text-gray-800">
                    <X size={24} />
                </button>
                <h2 className="text-3xl font-bold text-center mb-2">How TechSubbies Works</h2>
                <p className="text-center text-gray-500 mb-8">A streamlined process for companies and engineers.</p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-12">
                    <div className="border-r-0 md:border-r pr-0 md:pr-8">
                        <h3 className="text-2xl font-semibold text-center text-blue-600 mb-6">For Companies</h3>
                        <div className="space-y-8">
                            <Step icon={PenSquare} title="1. Post a Job (Free)" description="Describe your project and the skills you need. It takes minutes and costs nothing." />
                            <Step icon={Search} title="2. Find Talent Instantly" description="Search our database and filter by skills, availability, and day rate. Look for engineers with a premium 'Skills Profile' for the most detailed information." />
                            <Step icon={Handshake} title="3. Engage Directly" description="Connect with the right talent. No middlemen, no placement fees." />
                        </div>
                    </div>
                    <div>
                        <h3 className="text-2xl font-semibold text-center text-green-600 mb-6">For Engineers</h3>
                        <div className="space-y-8">
                            <Step 
                                icon={Users} 
                                title="1. Join the Network (Free)" 
                                description="Create a free Basic Profile to get visibility for entry-level and support roles. It's the perfect way for junior engineers to find positions (under £195/day) and gain valuable on-site experience." 
                            />
                            <Step 
                                icon={Star} 
                                title="2. Build Your Skills Profile" 
                                description="Upgrade to a premium Skills Profile to showcase your specialist expertise. Add detailed job roles, rated skills, and case studies to attract high-value contracts and command top rates." 
                            />
                            <Step 
                                icon={Briefcase} 
                                title="3. Connect & Get Hired Directly" 
                                description="Companies find your profile and contact you directly for projects. No recruitment fees, just direct opportunities to keep your calendar full." 
                            />
                        </div>
                    </div>
                </div>
                
                <div className="mt-10 pt-6 border-t text-center">
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