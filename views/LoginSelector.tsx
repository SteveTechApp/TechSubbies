import React from 'react';
import { useAppContext } from '../context/AppContext.tsx';
import { Role } from '../types.ts';
import { Logo } from '../components/Logo.tsx';
import { User, Building, Users, UserCog, type LucideIcon } from 'lucide-react';

interface LoginButtonProps {
    role: Role;
    label: string;
    icon: LucideIcon;
    description: string;
}

interface LoginSelectorProps {
    isOpen: boolean;
    onClose: () => void;
}

export const LoginSelector = ({ isOpen, onClose }: LoginSelectorProps) => {
    const { login } = useAppContext();

    if (!isOpen) return null;

    const handleLogin = (role: Role) => {
        login(role);
        onClose();
    };

    const LoginButton = ({ role, label, icon: Icon, description }: LoginButtonProps) => (
        <button
            onClick={() => handleLogin(role)}
            className='fade-in-up text-left w-full p-6 bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-xl hover:border-blue-500 transition-all duration-300 transform hover:-translate-y-1'
        >
            <div className='flex items-center mb-3'>
                <Icon className='w-8 h-8 text-blue-500 mr-4' />
                <h2 className='text-2xl font-bold text-gray-800'>{label}</h2>
            </div>
            <p className='text-gray-600'>{description}</p>
        </button>
    );

    return (
        <div className='fixed inset-0 bg-black bg-opacity-70 flex flex-col justify-center items-center z-50 p-4' onClick={onClose}>
            <div className='w-full max-w-4xl' onClick={e => e.stopPropagation()}>
                <div className='text-center mb-12'>
                    <Logo className='text-4xl justify-center mb-4 text-white' />
                    <h1 className='text-3xl font-bold text-white'>Explore the TechSubbies Demo</h1>
                    <p className='text-lg text-gray-300 mt-2'>Please select a role to see the platform features.</p>
                </div>
                <div className='w-full grid grid-cols-1 md:grid-cols-2 gap-8'>
                    <LoginButton
                        role={Role.ENGINEER}
                        label='Engineer'
                        icon={User}
                        description='Manage your profile, set your availability, and find your next contract.'
                    />
                    <LoginButton
                        role={Role.COMPANY}
                        label='Company'
                        icon={Building}
                        description='Post jobs for free, search for expert talent, and build your project teams.'
                    />
                    <LoginButton
                        role={Role.RESOURCING_COMPANY}
                        label='Resourcing Company'
                        icon={Users}
                        description='Manage multiple engineer profiles and streamline your subcontractor placements.'
                    />
                    <LoginButton
                        role={Role.ADMIN}
                        label='Platform Admin'
                        icon={UserCog}
                        description='Oversee platform activity, manage users and jobs, and view analytics.'
                    />
                </div>
            </div>
        </div>
    );
};
