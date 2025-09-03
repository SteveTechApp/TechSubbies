import React from 'react';
import { LogOut } from './Icons.tsx';
import { User, Role, CompanyProfile } from '../types/index.ts';
import { Notifications } from './Notifications.tsx';

interface UserMenuProps {
    user: User | null;
    logout: () => void;
}

export const UserMenu = ({ user, logout }: UserMenuProps) => {
    if (!user) return null;

    const isCompany = user.role === Role.COMPANY || user.role === Role.RESOURCING_COMPANY || user.role === Role.ADMIN;
    const companyProfile = user.profile as CompanyProfile;
    const displayImage = isCompany && companyProfile.logo ? companyProfile.logo : user.profile.avatar;
    
    const imageClass = `w-10 h-10 rounded-full border-2 border-blue-500 ${isCompany && companyProfile.logo ? 'object-contain bg-white p-0.5' : 'object-cover'}`;

    return (
        <div className="flex items-center space-x-4">
            <Notifications />
            <span className="text-gray-700 hidden sm:block text-xs">Welcome, {user.profile.name}</span>
            <img 
                src={displayImage} 
                alt="User Avatar or Company Logo" 
                className={imageClass} 
            />
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
};
