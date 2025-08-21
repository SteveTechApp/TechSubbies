import React from 'react';
import { X, PenSquare, Search, Handshake, UserCog, CalendarDays, Briefcase, type LucideIcon } from 'lucide-react';

interface StepProps {
    icon: LucideIcon;
    title: string;
    description: string;
}

const Step = ({ icon: Icon, title, description }: StepProps) => (
    <div className='flex flex-col items-center text-center'>
        <div className='bg-blue-100 text-blue-600 rounded-full p-4 mb-3'><Icon size={32} /></div>
        <h3 className='font-bold text-lg mb-1'>{title}</h3>
        <p className='text-gray-600'>{description}</p>
    </div>
);

interface HowItWorksModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export const HowItWorksModal = ({ isOpen, onClose }: HowItWorksModalProps) => {
    if (!isOpen) return null;

    return (
        <div
            className='fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50 p-4'
            onClick={onClose}
        >
            <div
                className='bg-white rounded-lg p-8 m-4 max-w-4xl w-full relative transform transition-all duration-300 scale-100'
                onClick={(e) => e.stopPropagation()}
            >
                <button onClick={onClose} className='absolute top-4 right-4 text-gray-500 hover:text-gray-800'>
                    <X size={24} />
                </button>
                <h2 className='text-3xl font-bold text-center mb-2'>How TechSubbies Works</h2>
                <p className='text-center text-gray-500 mb-8'>A streamlined process for companies and engineers.</p>

                <div className='grid grid-cols-1 md:grid-cols-2 gap-8'>
                    <div className='border-r-0 md:border-r pr-8'>
                        <h3 className='text-2xl font-semibold text-center text-blue-600 mb-6'>For Companies</h3>
                        <div className='space-y-6'>
                            <Step icon={PenSquare} title='1. Post a Job (Free)' description='Describe your project and the skills you need. It takes minutes and costs nothing.' />
                            <Step icon={Search} title='2. Find Talent Instantly' description='Search our database of vetted engineers. Filter by skills, availability, and day rate.' />
                            <Step icon={Handshake} title='3. Engage Directly' description='Connect with the right talent. No middlemen, no placement fees.' />
                        </div>
                    </div>
                    <div>
                        <h3 className='text-2xl font-semibold text-center text-green-600 mb-6'>For Engineers</h3>
                        <div className='space-y-6'>
                            <Step icon={UserCog} title='1. Create Your Profile' description='Showcase your skills, experience, and certifications to stand out.' />
                            <Step icon={CalendarDays} title='2. Set Your Availability' description="Keep your calendar up-to-date so companies know when you're ready for new projects." />
                            <Step icon={Briefcase} title='3. Get Hired' description='Companies apply to you. Receive offers directly and manage your contracts.' />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};