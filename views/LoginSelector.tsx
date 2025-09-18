import React from 'react';
import { Page, Role } from '../types';
import { useAuth } from '../context/AuthContext';
import { Logo } from '../components/Logo';
import { User, Building, Users } from '../components/Icons';

interface LoginSelectorProps {
    onNavigate: (page: Page) => void;
}

export const LoginSelector = ({ onNavigate }: LoginSelectorProps) => {
    const { login } = useAuth();

    const handleLogin = (role: Role) => {
        login(role);
        // Navigation will be handled by the App component detecting a logged-in user
    };

    return (
        <div className="min-h-screen bg-gray-100 flex flex-col justify-center items-center p-4">
            <div className="max-w-md w-full text-center mb-8">
                <Logo className="h-16 mx-auto mb-4" />
                <h1 className="text-3xl font-bold text-gray-800">Welcome Back</h1>
                <p className="text-gray-500">Please select your role to login or sign up.</p>
            </div>

            <div className="max-w-md w-full bg-white rounded-lg shadow-xl p-8 space-y-4">
                <button
                    onClick={() => handleLogin(Role.ENGINEER)}
                    className="w-full flex items-center p-4 border rounded-lg hover:bg-blue-50 hover:border-blue-500 transition-all"
                >
                    <User className="w-8 h-8 text-blue-600 mr-4" />
                    <div>
                        <h2 className="text-lg font-bold text-left">I'm an Engineer</h2>
                        <p className="text-sm text-gray-500 text-left">Find work, manage contracts, and build your profile.</p>
                    </div>
                </button>
                
                 <button
                    onClick={() => handleLogin(Role.COMPANY)}
                    className="w-full flex items-center p-4 border rounded-lg hover:bg-green-50 hover:border-green-500 transition-all"
                >
                    <Building className="w-8 h-8 text-green-600 mr-4" />
                    <div>
                        <h2 className="text-lg font-bold text-left">I'm a Company</h2>
                        <p className="text-sm text-gray-500 text-left">Post jobs for free and find specialist talent.</p>
                    </div>
                </button>

                 <button
                    onClick={() => handleLogin(Role.RESOURCING_COMPANY)}
                    className="w-full flex items-center p-4 border rounded-lg hover:bg-indigo-50 hover:border-indigo-500 transition-all"
                >
                    <Users className="w-8 h-8 text-indigo-600 mr-4" />
                    <div>
                        <h2 className="text-lg font-bold text-left">I'm a Resourcing Agency</h2>
                        <p className="text-sm text-gray-500 text-left">Manage your talent roster and find them placements.</p>
                    </div>
                </button>
            </div>

            <div className="mt-6 text-center text-sm">
                <p className="text-gray-500">Don't have an account?</p>
                <div className="space-x-4 mt-2">
                    <button onClick={() => onNavigate(Page.ENGINEER_SIGNUP)} className="font-semibold text-blue-600 hover:underline">Sign up as Engineer</button>
                    <button onClick={() => onNavigate(Page.COMPANY_SIGNUP)} className="font-semibold text-green-600 hover:underline">Sign up as Company</button>
                </div>
            </div>
        </div>
    );
};
