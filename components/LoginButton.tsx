import React from 'react';
import { Role } from '../types/index.ts';

interface LoginButtonProps {
    role: Role;
    label: string;
    icon: React.ComponentType<any>;
    description: string;
    onLogin: (role: Role) => void;
}

export const LoginButton = ({ role, label, icon: Icon, description, onLogin }: LoginButtonProps) => (
    <button
        onClick={() => onLogin(role)}
        className="fade-in-up text-left w-full p-6 bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-xl hover:border-blue-500 transition-all duration-300 transform hover:-translate-y-1"
    >
        <div className="flex items-center mb-3">
            <Icon className="w-8 h-8 text-blue-500 mr-4" />
            <h2 className="text-2xl font-bold text-gray-800">{label}</h2>
        </div>
        <p className="text-gray-600">{description}</p>
    </button>
);