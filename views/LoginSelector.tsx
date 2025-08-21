import React from 'react';
import { useAppContext, Role } from '../context/AppContext.tsx';
import { Logo } from '../components/Logo.tsx';
import { LoginButton } from '../components/LoginButton.tsx';
import { User, Building, Users, UserCog } from '../components/Icons.tsx';

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

    return (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex flex-col justify-center items-center z-50 p-4" onClick={onClose}>
            <div className="w-full max-w-4xl" onClick={e => e.stopPropagation()}>
                <div className="text-center mb-12">
                    <Logo className="text-4xl justify-center mb-4 text-white" />
                    <h1 className="text-3xl font-bold text-white">Explore the TechSubbies Demo</h1>
                    <p className="text-lg text-gray-300 mt-2">Please select a role to see the platform features.</p>
                </div>
                <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-8">
                    <LoginButton
                        role={Role.ENGINEER}
                        label="Engineer"
                        icon={User}
                        description="Manage your profile, set your availability, and find your next contract."
                        onLogin={handleLogin}
                    />
                    <LoginButton
                        role={Role.COMPANY}
                        label="Company"
                        icon={Building}
                        description="Post jobs for free, search for expert talent, and build your project teams."
                        onLogin={handleLogin}
                    />
                    <LoginButton
                        role={Role.RESOURCING_COMPANY}
                        label="Resourcing Company"
                        icon={Users}
                        description="Manage multiple engineer profiles and streamline your subcontractor placements."
                        onLogin={handleLogin}
                    />
                    <LoginButton
                        role={Role.ADMIN}
                        label="Platform Admin"
                        icon={UserCog}
                        description="Oversee platform activity, manage users and jobs, and view analytics."
                        onLogin={handleLogin}
                    />
                </div>
            </div>
        </div>
    );
};