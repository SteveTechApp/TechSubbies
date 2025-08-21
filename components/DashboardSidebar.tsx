import React from 'react';
import { useAppContext } from '../context/AppContext.tsx';
import { Role } from '../types.ts';
import { 
    LayoutDashboard, User, CalendarDays, Search, Settings, PlusCircle, Briefcase, 
    Users, Building, BarChart2, SlidersHorizontal, LucideIcon 
} from 'lucide-react';

interface DashboardSidebarProps {
    activeView: string;
    setActiveView: (view: string) => void;
}

export const DashboardSidebar = ({ activeView, setActiveView }: DashboardSidebarProps) => {
    const { user } = useAppContext();

    if (!user) return null;

    const getLinksForRole = (role: Role) => {
        switch (role) {
            case Role.ENGINEER:
                return [
                    { label: 'Dashboard', icon: LayoutDashboard }, { label: 'My Profile', icon: User }, { label: 'Availability', icon: CalendarDays }, { label: 'Job Search', icon: Search }, { label: 'Settings', icon: Settings },
                ];
            case Role.COMPANY:
                return [
                    { label: 'Dashboard', icon: LayoutDashboard }, { label: 'Post a Job', icon: PlusCircle }, { label: 'Find Talent', icon: Search }, { label: 'My Jobs', icon: Briefcase }, { label: 'Settings', icon: Settings },
                ];
            case Role.RESOURCING_COMPANY:
                 return [
                    { label: 'Dashboard', icon: LayoutDashboard }, { label: 'Manage Engineers', icon: Users }, { label: 'Find Jobs', icon: Search }, { label: 'Company Profile', icon: Building }, { label: 'Settings', icon: Settings },
                ];
            case Role.ADMIN:
                return [
                    { label: 'Dashboard', icon: BarChart2 }, { label: 'Manage Users', icon: Users }, { label: 'Manage Jobs', icon: Briefcase }, { label: 'Platform Settings', icon: SlidersHorizontal },
                ];
            default:
                return [];
        }
    };

    const links = getLinksForRole(user.role);

    const NavLink = ({ label, icon: Icon }: { label: string, icon: LucideIcon }) => {
        const isActive = activeView === label;
        return (
            <li>
                <button
                    onClick={() => setActiveView(label)}
                    className={`w-full flex items-center p-3 my-1 text-left rounded-md transition-colors ${isActive ? 'bg-blue-500 text-white shadow' : 'text-gray-600 hover:bg-gray-200 hover:text-gray-800'}`}
                >
                    <Icon className='w-5 h-5 mr-3' />
                    <span className='font-medium'>{label}</span>
                </button>
            </li>
        );
    };

    return (
        <aside className='w-64 bg-gray-100 p-4 border-r border-gray-200 flex flex-col'>
            <div className='flex-grow'>
              <nav>
                  <ul>
                      {links.map(link => <NavLink key={link.label} {...link} />)}
                  </ul>
              </nav>
            </div>
        </aside>
    );
};
