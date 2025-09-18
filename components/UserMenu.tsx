import React, { useState, useEffect, useRef } from 'react';
import { LogOut } from './Icons';
import { User, Role, CompanyProfile } from '../types';
import { Notifications } from './Notifications';
import { useSettings } from '../context/SettingsContext';

interface UserMenuProps {
    user: User | null;
    logout: () => void;
}

export const UserMenu = ({ user, logout }: UserMenuProps) => {
    const { t } = useSettings();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setIsMenuOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);
    
    if (!user) return null;

    const isCompany = user.role === Role.COMPANY || user.role === Role.RESOURCING_COMPANY || user.role === Role.ADMIN;
    const companyProfile = user.profile as CompanyProfile;
    const displayImage = isCompany && companyProfile.logo ? companyProfile.logo : user.profile.avatar;
    
    const imageClass = `w-10 h-10 rounded-full border-2 transition-all duration-200 ${isMenuOpen ? 'border-blue-700 ring-2 ring-blue-300' : 'border-blue-500'} ${isCompany && companyProfile.logo ? 'object-contain bg-white p-0.5' : 'object-cover'}`;

    return (
        <div className="flex items-center space-x-4">
            <Notifications />
            <div className="relative" ref={menuRef}>
                <button 
                    onClick={() => setIsMenuOpen(!isMenuOpen)} 
                    aria-label="Open user menu" 
                    aria-haspopup="true"
                    aria-expanded={isMenuOpen}
                    className="block rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                    <img 
                        src={displayImage} 
                        alt="User Avatar or Company Logo" 
                        className={imageClass} 
                    />
                </button>
                {isMenuOpen && (
                    <div 
                        role="menu"
                        aria-orientation="vertical"
                        aria-labelledby="user-menu-button"
                        className="absolute top-full right-0 mt-2 w-56 bg-white rounded-md shadow-lg border border-gray-200 z-50 fade-in-up" 
                        style={{animationDuration: '0.2s'}}
                    >
                        <div className="px-4 py-3 border-b">
                            <p className="text-sm text-gray-500" id="user-menu-button">{t('signed_in_as')}</p>
                            <p className="text-sm font-semibold text-gray-800 truncate">{user.profile.name}</p>
                        </div>
                        <div className="py-1" role="none">
                            <button
                                onClick={logout}
                                role="menuitem"
                                className="w-full text-left flex items-center px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                            >
                                <LogOut className="w-4 h-4 mr-2" />
                                <span>{t('logout')}</span>
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};