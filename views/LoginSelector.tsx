
import React from 'react';
import { useAppContext } from '../context/AppContext';
import { Role } from '../types';
import { ArrowLeft } from 'lucide-react';

export const LoginSelector: React.FC<{ roleToLogin: Role }> = ({ roleToLogin }) => {
    const { login, engineers, companies, setRole } = useAppContext();

    const isCompanyLogin = roleToLogin === Role.COMPANY;
    const list = isCompanyLogin ? companies : engineers;
    const title = isCompanyLogin ? "Login as a Company" : "Login as an Engineer";

    return (
        <div className="container mx-auto max-w-2xl px-4 sm:px-6 lg:px-8 py-12 text-center">
            <button 
                onClick={() => setRole(Role.NONE)} 
                className="flex items-center text-sm font-semibold text-gray-600 hover:text-gray-800 mb-8"
            >
                <ArrowLeft size={16} className="mr-2"/>
                Back to Home
            </button>
            <h1 className="text-3xl font-bold text-gray-900 mb-8">{title}</h1>
            <div className="space-y-4">
                {list.map(item => (
                    <div key={item.id} className="bg-white rounded-lg shadow-md p-4 flex items-center justify-between border border-gray-200">
                        <div className="flex items-center space-x-4">
                            {/* @ts-ignore */}
                            <img src={isCompanyLogin ? item.logoUrl : item.profileImageUrl} alt={item.name} className="h-12 w-12 rounded-full object-cover" />
                            <span className="font-semibold text-lg text-gray-800">{item.name}</span>
                        </div>
                        <button
                            onClick={() => login(roleToLogin, item.id)}
                            className="bg-blue-600 text-white font-bold py-2 px-6 rounded-lg hover:bg-blue-700 transition-colors"
                        >
                            Login
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
};
