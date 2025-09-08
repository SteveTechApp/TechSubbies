import React from 'react';
import { useAppContext } from '../context/AppContext';
import { Role } from '../types';
import { Logo } from './Logo';
import { NavLink } from './NavLink';
import {
    LayoutDashboard,
    User,
    Search,
    CalendarDays,
    BarChart2,
    Lightbulb,
    MessageCircle,
    Briefcase,
    DollarSign,
    Settings,
    ShieldCheck,
    Users,
    Layers,
    ClipboardList,
    KanbanSquare,
    Clapperboard,
    LifeBuoy,
    Gift,
    Handshake
} from './Icons';

interface DashboardSidebarProps {
    activeView: string;
    setActiveView: (view: string) => void;
}

const ENGINEER_LINKS = [
    { label: 'Dashboard', icon: LayoutDashboard },
    { label: 'Manage Profile', icon: User },
    { label: 'Job Search', icon: Search },
    { label: 'My Network', icon: Users },
    { label: 'Find a Partner', icon: Handshake },
    { label: 'Availability', icon: CalendarDays },
    { label: 'Contracts', icon: Briefcase },
    { label: 'Invoices', icon: DollarSign },
    { label: 'Messages', icon: MessageCircle },
    { label: 'AI Tools', icon: Lightbulb },
    { label: 'AI Coach', icon: ShieldCheck },
    { label: 'Storyboard Creator', icon: Clapperboard },
    { label: 'Analytics', icon: BarChart2 },
    { label: 'Forum', icon: MessageCircle },
    { label: 'Billing', icon: DollarSign },
    { label: 'Loyalty Program', icon: Gift },
    { label: 'Settings', icon: Settings },
];

const COMPANY_LINKS = [
    { label: 'Dashboard', icon: LayoutDashboard },
    { label: 'Post a Job', icon: Briefcase },
    { label: 'My Jobs', icon: Layers },
    { label: 'Find Talent', icon: Search },
    { label: 'Project Planner', icon: KanbanSquare },
    { label: 'Project Tracking', icon: ClipboardList },
    { label: 'Contracts', icon: Briefcase },
    { label: 'Invoices', icon: DollarSign },
    { label: 'Messages', icon: MessageCircle },
    { label: 'Settings', icon: Settings },
];

const RESOURCING_LINKS = [
    { label: 'Dashboard', icon: LayoutDashboard },
    { label: 'Manage Engineers', icon: Users },
    { label: 'Find Jobs', icon: Search },
    { label: 'Contracts', icon: Briefcase },
    { label: 'Invoices', icon: DollarSign },
    { label: 'Messages', icon: MessageCircle },
    { label: 'Settings', icon: Settings },
];

const ADMIN_LINKS = [
    { label: 'Dashboard', icon: LayoutDashboard },
    { label: 'Manage Users', icon: Users },
    { label: 'Manage Jobs', icon: Briefcase },
    { label: 'Monetization', icon: DollarSign },
    { label: 'Platform Settings', icon: Settings },
];

export const DashboardSidebar = ({ activeView, setActiveView }: DashboardSidebarProps) => {
    const { user, logout } = useAppContext();
    
    if (!user) return null;

    let links;
    switch (user.role) {
        case Role.ENGINEER:
            links = ENGINEER_LINKS;
            break;
        case Role.COMPANY:
            links = COMPANY_LINKS;
            break;
        case Role.RESOURCING_COMPANY:
            links = RESOURCING_LINKS;
            break;
        case Role.ADMIN:
            links = ADMIN_LINKS;
            break;
        default:
            links = [];
    }

    const commonLinks = [
        { label: 'Help Center', icon: LifeBuoy }
    ];

    if(user.role !== Role.ENGINEER) {
        // links = [...links, ...commonLinks.filter(l => l.label !== 'Messages')];
    }

    return (
        <aside className="w-64 bg-white flex-shrink-0 flex flex-col border-r shadow-lg">
            <div className="p-4 border-b">
                <Logo className="h-10" />
            </div>
            <nav className="flex-grow p-2 overflow-y-auto custom-scrollbar">
                <ul>
                    {links.map(link => (
                        <NavLink key={link.label} {...link} activeView={activeView} setActiveView={setActiveView} />
                    ))}
                </ul>
                 <div className="mt-4 pt-4 border-t">
                    <ul>
                         {commonLinks.map(link => (
                            <NavLink key={link.label} {...link} activeView={activeView} setActiveView={setActiveView} />
                        ))}
                    </ul>
                </div>
            </nav>
            <div className="p-4 border-t mt-auto">
                <p className="text-xs text-gray-500 mb-2">Signed in as</p>
                <p className="font-semibold text-gray-800 truncate">{user.profile.name}</p>
                <button
                    onClick={logout}
                    className="w-full mt-3 text-left text-sm text-red-600 hover:underline"
                >
                    Logout
                </button>
            </div>
        </aside>
    );
};