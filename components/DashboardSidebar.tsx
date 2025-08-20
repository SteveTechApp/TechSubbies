
import React from 'react';
import { Role } from '../types';
import { LayoutDashboard, Search, Briefcase, User, Calendar, DollarSign, Settings, Users, Ticket, BarChart } from 'lucide-react';

interface NavItemProps {
    icon: React.ElementType;
    label: string;
    isActive: boolean;
}

const NavItem: React.FC<NavItemProps> = ({ icon: Icon, label, isActive }) => {
    const activeClasses = 'bg-blue-100 text-blue-600';
    const inactiveClasses = 'text-gray-600 hover:bg-gray-100 hover:text-gray-900';
    
    return (
        <a href="#" className={`flex items-center px-3 py-2.5 text-sm font-medium rounded-md transition-colors ${isActive ? activeClasses : inactiveClasses}`}>
            <Icon className="h-5 w-5 mr-3" />
            <span>{label}</span>
        </a>
    );
};

interface DashboardSidebarProps {
    role: Role;
}

export const DashboardSidebar: React.FC<DashboardSidebarProps> = ({ role }) => {
    let navItems = [];

    switch (role) {
        case Role.COMPANY:
            navItems = [
                { icon: Search, label: 'Find Engineers', active: true },
                { icon: Briefcase, label: 'My Jobs', active: false },
                { icon: Users, label: 'Team Members', active: false },
                { icon: DollarSign, label: 'Billing', active: false },
                { icon: Settings, label: 'Settings', active: false },
            ];
            break;
        case Role.ENGINEER:
            navItems = [
                { icon: LayoutDashboard, label: 'Dashboard', active: true },
                { icon: Briefcase, label: 'Job Offers', active: false },
                { icon: Calendar, label: 'Availability', active: false },
                { icon: User, label: 'My Profile', active: false },
                { icon: Settings, label: 'Settings', active: false },
            ];
            break;
        case Role.ADMIN:
            navItems = [
                { icon: LayoutDashboard, label: 'Overview', active: true },
                { icon: Users, label: 'Users', active: false },
                { icon: Briefcase, label: 'Jobs', active: false },
                { icon: Ticket, label: 'Support', active: false },
                { icon: BarChart, label: 'Platform Stats', active: false },
            ];
            break;
        default:
            break;
    }

    return (
        <aside className="w-64 bg-white flex-shrink-0 border-r border-gray-200 hidden md:block">
            <div className="sticky top-[58px] h-[calc(100vh-58px)] overflow-y-auto p-4">
                <nav className="flex flex-col space-y-1">
                    {navItems.map((item, index) => (
                        <NavItem key={index} icon={item.icon} label={item.label} isActive={item.active} />
                    ))}
                </nav>
            </div>
        </aside>
    );
};
