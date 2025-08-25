import React from 'react';
import { LogOut } from './Icons.tsx';
import { User } from '../types/index.ts';

interface UserMenuProps {
    user: User | null;
    logout: () => void;
}

export const UserMenu = ({ user, logout }: UserMenuProps) => (
    <div className="flex items-center space-x-4">
        <span className="text-gray-700 hidden sm:block text-xs">Welcome, {user?.profile?.name}</span>
        <img src={user?.profile?.avatar} alt="User Avatar" className="w-10 h-10 rounded-full border-2 border-blue-500" />
        <button
            onClick={logout}
            className="flex items-center px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors text-xs"
            aria-label="Logout"
        >
            <LogOut className="w-4 h-4 mr-2" />
            Logout
        </button>
    </div>
);