import React, { useState } from 'react';
import { X, PenSquare, Search, Handshake, Users, Briefcase, Star } from './Icons.tsx';
import { Page } from '../types/index.ts';

interface StepProps {
    icon: React.ComponentType<any>;
    title: string;
    description: string;
}

const Step = ({ icon: Icon, title, description }: StepProps) => (
    <div className="flex flex-col items-center text-center p-4">
        <div className="bg-blue-100 text-blue-600 rounded-full p-4 mb-3"><Icon size={32} /></div>
        <h3 className="font-bold text-lg mb-1">{title}</h3>
        <p className="text-gray-600 text-sm max-w-xs mx-auto">{description}</p>
    </div>
);

interface HowItWorksModalProps {
    isOpen: boolean;
    onClose: () => void;
    onNavigate: (page: Page) => void;
}

type ActiveTab = 'engineers' | 'companies' | 'resourcing';

export const HowItWorksModal = ({ isOpen, onClose, onNavigate }: HowItWorksModalProps) => {
    if (!isOpen) return null;

    const [activeTab, setActiveTab] = useState<ActiveTab>('engineers');

    const handleNavigate = (page: Page) => {
        onNavigate(page);
        onClose();
    };
    
    const getTabClass = (tabName: ActiveTab) => {
        return `py-3 px-6 font-semibold border-b-2 transition-colors duration-200 ${
            activeTab === tabName 
            ? 'border-blue-600 text-blue-600' 
            : 'border-transparent text-gray-500 hover:text-gray-800 hover:bg-gray-100'
        }`;
    };

    const renderContent = () => {
        switch (activeTab) {
            case 'engineers':
                return (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-x-4 gap-y-8">
                        <Step 
                            icon={Users} 
                            title="1. Join the Network (Free)" 
                            description="Create your free Basic Profile for immediate visibility in entry-level and support roles. Perfect for gaining experience on contracts under £195/day." 
                        />
                        <Step 
                            icon={Star} 
                            title="2. Build Your Skills Profile" 
                            description="Upgrade to a premium Skills Profile to showcase your specialist expertise. Add detailed job roles and rated skills to attract high-value contracts." 
                        />
                        <Step 
                            icon={Briefcase} 
                            title="3. Connect & Get Hired Directly" 
                            description="Companies find your profile and contact you directly. No recruitment fees, just direct opportunities to keep your calendar full." 
                        />
                    </div>
                );
            case 'companies':
                return (
                     <div className="grid grid-cols-1 md:grid-cols-3 gap-x-4 gap-y-8">
                        <Step icon={PenSquare} title="1. Post a Job (Free)" description="Describe your project and the skills you need in minutes. It costs nothing to post jobs and search for talent." />
                        <Step icon={Search} title="2. Find Talent Instantly" description="Search our database and filter by skills, availability, and day rate. Look for 'Skills Profiles' for detailed expertise." />
                        <Step icon={Handshake} title="3. Engage Directly" description="Connect with the right talent. No middlemen, no placement fees. Just direct, efficient hiring." />
                    </div>
                );
            case 'resourcing':
                return (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-x-4 gap-y-8">
                        <Step icon={Users} title="1. Build Your Roster" description="Add your managed engineers to the platform to keep their availability and details in one central place." />
                        <Step icon={Search} title="2. Find Jobs For Them" description="Search the job board for contracts that match your engineers' skills and apply on their behalf." />
                        <Step icon={Handshake} title="3. Streamline Bookings" description="Use our platform to manage communications and streamline the hiring process for your entire talent pool." />
                    </div>
                );
        }
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
                     <button onClick={onClose} className="absolute top-4 right-4 text-gray-500 hover:text-gray-800">
                        <X size={24} />
                    </button>
                    <h2 className="text-3xl font-bold">How TechSubbies Works</h2>
                    <p className="text-gray-500 mt-1">A streamlined process for every role in the industry.</p>
                </div>
                
                {/* Tabs */}
                <div className="flex-shrink-0 flex justify-center border-b">
                    <button onClick={() => setActiveTab('engineers')} className={getTabClass('engineers')}>For Engineers</button>
                    <button onClick={() => setActiveTab('companies')} className={getTabClass('companies')}>For Companies</button>
                    <button onClick={() => setActiveTab('resourcing')} className={getTabClass('resourcing')}>For Resourcing</button>
                </div>

                {/* Content */}
                <div className="flex-grow p-8 overflow-y-auto custom-scrollbar">
                    {renderContent()}
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
