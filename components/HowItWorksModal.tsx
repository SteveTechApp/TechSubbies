import React, { useState } from 'react';
import { X, User, Building, FileText, DollarSign, Search, Sparkles, Users, Handshake, CheckCircle } from './Icons.tsx';
import { Page } from '../types/index.ts';

interface HowItWorksModalProps {
    isOpen: boolean;
    onClose: () => void;
    onNavigate: (page: Page) => void;
}

const Step = ({ icon: Icon, title, description }: { icon: React.ComponentType<any>, title: string, description: string }) => (
    <div className="flex items-start gap-4">
        <div className="flex-shrink-0 bg-blue-100 p-3 rounded-full">
            <Icon className="w-6 h-6 text-blue-600" />
        </div>
        <div>
            <h4 className="font-bold text-lg text-gray-800">{title}</h4>
            <p className="text-gray-600">{description}</p>
        </div>
    </div>
);

export const HowItWorksModal = ({ isOpen, onClose, onNavigate }: HowItWorksModalProps) => {
    if (!isOpen) return null;
    const [activeTab, setActiveTab] = useState('engineers');

    const handleNavigate = (page: Page) => {
        onNavigate(page);
        onClose();
    };
    
    const getTabClass = (tabName: string) => `w-1/2 py-3 text-center font-semibold border-b-2 transition-colors flex items-center justify-center gap-2 ${ activeTab === tabName ? 'border-blue-600 text-blue-600' : 'border-gray-200 text-gray-500 hover:bg-gray-100' }`;

    return (
        <div
            className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50 p-4"
            onClick={onClose}
        >
            <div
                className="bg-white rounded-lg m-4 max-w-2xl w-full relative transform transition-all duration-300 flex flex-col max-h-[90vh]"
                onClick={(e) => e.stopPropagation()}
            >
                <header className="flex-shrink-0 p-6 border-b text-center relative">
                     <button onClick={onClose} className="absolute top-4 right-4 text-gray-500 hover:text-gray-800" aria-label="Close modal">
                        <X size={24} />
                    </button>
                    <h2 className="text-3xl font-bold">How It Works</h2>
                    <p className="text-gray-500 mt-1">The complete journey, from search to secure payment.</p>
                </header>
                
                <nav className="flex-shrink-0 flex">
                    <button onClick={() => setActiveTab('engineers')} className={getTabClass('engineers')}>
                        <User /> For Engineers
                    </button>
                    <button onClick={() => setActiveTab('companies')} className={getTabClass('companies')}>
                        <Building /> For Companies
                    </button>
                </nav>

                <main className="flex-grow p-6 sm:p-8 overflow-y-auto custom-scrollbar">
                    {activeTab === 'engineers' && (
                        <div className="space-y-6 fade-in-up">
                            <Step icon={User} title="1. Create Your Profile" description="Build a free professional profile. Upgrade to a premium 'Skills Profile' to add specialist roles and showcase your deep expertise." />
                            <Step icon={Search} title="2. Find & Apply for Jobs" description="Search our exclusive job board and apply for contracts that match your skills and availability." />
                            <Step icon={FileText} title="3. Sign Contracts Securely" description="Receive job offers and sign contracts directly on the platform with e-signatures. No more chasing paperwork." />
                            <Step icon={DollarSign} title="4. Get Paid Your Way" description="For milestone projects, clients can fund an escrow for security. For all jobs, once work is approved, you receive an official invoice to send to the client for direct payment based on the agreed terms." />
                            <Step icon={Users} title="5. Build Your Network" description="Every completed contract adds a permanent connection to your 'My Connections' page, helping you build a valuable network of clients for future work." />
                        </div>
                    )}

                     {activeTab === 'companies' && (
                        <div className="space-y-6 fade-in-up">
                            <Step icon={Sparkles} title="1. Find Talent Instantly" description="Post jobs for free and use our 'AI Smart Match' to get a ranked list of the best-fit engineers based on their detailed skills." />
                            <Step icon={Handshake} title="2. Hire with Confidence" description="Send a contract directly through the platform. Choose between a milestone-based Statement of Work (SOW) or a simple Day Rate agreement." />
                            <Step icon={CheckCircle} title="3. Approve Work" description="Review submitted milestones or timesheets. With a single click, you can approve the work, which then allows for an invoice to be generated." />
                            <Step icon={DollarSign} title="4. Pay Directly & Securely" description="Generate an invoice with flexible terms (Net 7, 14, 30). Pay the engineer directly. For added security on milestone projects, you have the option to fund a secure escrow account." />
                            <Step icon={Users} title="5. Build Your Talent Pool" description="After a successful contract, add your best freelancers to a 'Talent Pool'. This creates a curated list of trusted experts you can directly invite to future projects." />
                        </div>
                    )}
                </main>

                <footer className="flex-shrink-0 mt-auto p-6 border-t bg-gray-50 rounded-b-lg text-center">
                    <h3 className="text-xl font-bold text-gray-800">Ready to Get Started?</h3>
                    <p className="text-gray-600 my-2">Join the network and take control of your freelance career today.</p>
                    <button 
                        onClick={() => handleNavigate('engineerSignUp')} 
                        className="bg-blue-600 text-white font-bold py-3 px-8 rounded-lg hover:bg-blue-700 transition-transform transform hover:scale-105 mt-2"
                    >
                        Create Your Profile Now
                    </button>
                </footer>
            </div>
        </div>
    );
};