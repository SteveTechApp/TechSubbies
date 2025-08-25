import React from 'react';
import { EngineerProfile } from '../../types/index.ts';
import { 
    Edit, User, CalendarDays, Search, BrainCircuit, CreditCard, 
    Clapperboard, Rocket, Star
} from '../../components/Icons.tsx';

interface DashboardPanelProps {
    icon: React.ComponentType<any>;
    title: string;
    description: string;
    onClick: () => void;
    disabled?: boolean;
    isFeatured?: boolean;
}

const DashboardPanel = ({ icon: Icon, title, description, onClick, disabled = false, isFeatured = false }: DashboardPanelProps) => {
    const baseClasses = "flex flex-col justify-between p-5 bg-white rounded-lg shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300 text-left";
    const disabledClasses = "bg-gray-100 text-gray-400 cursor-not-allowed hover:shadow-md hover:-translate-y-0";
    const featuredClasses = "bg-gradient-to-br from-yellow-300 to-orange-400 text-orange-900";
    
    const finalClasses = `${baseClasses} ${disabled ? disabledClasses : ''} ${isFeatured ? featuredClasses : ''}`;

    return (
        <button onClick={onClick} disabled={disabled} className={finalClasses}>
            <div>
                <div className={`p-3 rounded-full inline-block mb-3 ${isFeatured ? 'bg-white/30' : 'bg-blue-100'}`}>
                    <Icon size={28} className={isFeatured ? 'text-white' : 'text-blue-600'} />
                </div>
                <h3 className={`text-xl font-bold ${isFeatured ? 'text-white' : 'text-gray-800'}`}>{title}</h3>
                <p className={`mt-1 text-sm ${isFeatured ? 'text-orange-900/80' : 'text-gray-600'}`}>{description}</p>
            </div>
        </button>
    );
};

interface DashboardViewProps {
    engineerProfile: EngineerProfile;
    onUpgradeTier: () => void;
    setActiveView: (view: string) => void;
    boostProfile: () => void;
}

export const DashboardView = ({ engineerProfile, onUpgradeTier, setActiveView, boostProfile }: DashboardViewProps) => {
    
    const isPremium = engineerProfile.profileTier === 'paid';

    return (
        <div>
            <h1 className="text-3xl font-bold mb-6">Engineer Control Panel</h1>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                
                <DashboardPanel
                    icon={Edit}
                    title="Manage Profile"
                    description="Update your core details, specialist skills, and case studies."
                    onClick={() => setActiveView('Manage Profile')}
                />
                <DashboardPanel
                    icon={User}
                    title="View Public Profile"
                    description="See your Stats Card as companies see it."
                    onClick={() => setActiveView('View Public Profile')}
                />
                <DashboardPanel
                    icon={CalendarDays}
                    title="Set Availability"
                    description="Update your calendar to get relevant offers and sync with your tools."
                    onClick={() => setActiveView('Availability')}
                />
                <DashboardPanel
                    icon={Search}
                    title="Find Work"
                    description="Search and apply for freelance contracts from top companies."
                    onClick={() => setActiveView('Job Search')}
                />
                <DashboardPanel
                    icon={BrainCircuit}
                    title="AI Tools"
                    description="Discover new skills and get personalized training recommendations."
                    onClick={() => setActiveView('AI Tools')}
                />
                <DashboardPanel
                    icon={CreditCard}
                    title="Billing & Subscription"
                    description="Manage your Skills Profile subscription and purchase Boosts."
                    onClick={() => setActiveView('Billing')}
                />
                <DashboardPanel
                    icon={Clapperboard}
                    title="Visual Case Studies"
                    description="Create engaging, step-by-step visual stories of your projects."
                    onClick={() => setActiveView('Create Storyboard')}
                    disabled={!isPremium}
                />
                
                {isPremium ? (
                    <DashboardPanel
                        icon={Rocket}
                        title="Boost Profile"
                        description="Get to the top of search results for 24 hours. (1 Credit)"
                        onClick={boostProfile}
                        isFeatured={true}
                    />
                ) : (
                    <DashboardPanel
                        icon={Star}
                        title="Upgrade to Premium"
                        description="Unlock specialist roles, Boosts, and appear higher in searches."
                        onClick={onUpgradeTier}
                        isFeatured={true}
                    />
                )}
            </div>
        </div>
    );
};