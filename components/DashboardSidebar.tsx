import React from 'react';
import { useAppContext, Role } from '../context/AppContext.tsx';
import { NavLink } from './NavLink.tsx';
import { 
    LayoutDashboard, User, CalendarDays, Search, Settings, PlusCircle, Briefcase, 
    Users, Building, BarChart2, SlidersHorizontal, Edit
} from './Icons.tsx';

interface DashboardSidebarProps {
    activeView: string;
    setActiveView: (view: string) => void;
}

const getLinksForRole = (role: Role) => {
    switch (role) {
        case Role.ENGINEER:
            return [
                { label: 'Dashboard', icon: LayoutDashboard }, 
                { label: 'Manage Profile', icon: Edit },
                { label: 'View Public Profile', icon: User }, 
                { label: 'Availability', icon: CalendarDays }, 
                { label: 'Job Search', icon: Search }, 
                { label: 'Settings', icon: Settings },
            ];
        case Role.COMPANY:
            return [
                { label: 'Dashboard', icon: LayoutDashboard }, { label: 'Post a Job', icon: PlusCircle }, { label: 'Find Talent', icon: Search }, { label: 'My Jobs', icon: Briefcase }, { label: 'Settings', icon: Settings },
            ];
        case Role.RESOURCING_COMPANY:
             return [
                { label: 'Dashboard', icon: LayoutDashboard }, { label: 'Manage Engineers', icon: Users }, { label: 'Find Jobs', icon: Search }, { label: 'Settings', icon: Settings },
            ];
        case Role.ADMIN:
            return [
                { label: 'Dashboard', icon: BarChart2 }, { label: 'Manage Users', icon: Users }, { label: 'Manage Jobs', icon: Briefcase }, { label: 'Platform Settings', icon: SlidersHorizontal },
            ];
        default:
            return [];
    }
};

export const DashboardSidebar = ({ activeView, setActiveView }: DashboardSidebarProps) => {
    const { user } = useAppContext();

    if (!user) return null;

    const links = getLinksForRole(user.role);

    return (
        <aside className="w-64 bg-gray-100 p-4 border-r border-gray-200 flex flex-col">
            <nav className="flex-grow">
              <ul>
                  {links.map(link => (
                    <NavLink 
                        key={link.label} 
                        {...link} 
                        activeView={activeView} 
                        setActiveView={setActiveView} 
                    />
                  ))}
              </ul>
            </nav>
        </aside>
    );
};