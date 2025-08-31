import React from 'react';
import { EngineerProfile } from '../../types/index.ts';
import { 
    Edit, User, CalendarDays, Search, BrainCircuit, CreditCard, 
    Clapperboard, Rocket, Star, CheckCircle, ArrowRight, TrendingUp, Mail, ShieldCheck
} from '../../components/Icons.tsx';
import { useAppContext } from '../../context/AppContext.tsx';

interface DashboardPanelProps {
    icon: React.ComponentType<any>;
    title: string;
    description: string;
    onClick: () => void;
    disabled?: boolean;
    isFeatured?: boolean;
}

const DashboardPanel = ({ icon: Icon, title, description, onClick, disabled = false, isFeatured = false }: DashboardPanelProps) => {
    const baseClasses = "flex flex-col justify-between p-5 bg-white rounded-lg shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300 text-left h-full";
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

const ProfileStrength = ({ score }: { score: number }) => (
    <div className="bg-white p-5 rounded-lg shadow">
        <h3 className="font-bold text-lg mb-2">Profile Strength</h3>
        <div className="flex items-center gap-4">
            <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div className="bg-green-500 h-2.5 rounded-full" style={{ width: `${score}%` }}></div>
            </div>
            <span className="font-bold text-green-600">{score}%</span>
        </div>
        <p className="text-xs text-gray-500 mt-2">A complete profile attracts more high-quality job offers.</p>
    </div>
);

const StatBox = ({ value, label, icon: Icon }: { value: string, label: string, icon: React.ComponentType<any> }) => (
    <div className="bg-white p-4 rounded-lg shadow flex items-center gap-4">
        <Icon size={24} className="text-blue-500" />
        <div>
            <p className="text-2xl font-bold">{value}</p>
            <p className="text-sm text-gray-500">{label}</p>
        </div>
    </div>
);

const ActionableInsight = ({ profile, onUpgrade, onNavigate }: { profile: EngineerProfile, onUpgrade: () => void, onNavigate: (view: string) => void }) => {
    let insight = {
        icon: CheckCircle,
        title: "Profile Looking Good!",
        description: "Your profile is well-structured. Keep your availability updated to attract the best roles.",
        actionText: "Check Availability",
        action: () => onNavigate('Availability'),
        bgColor: 'bg-green-50',
        textColor: 'text-green-800'
    };

    if (profile.profileTier === 'free') {
        insight = {
            icon: Star,
            title: "Unlock Your Potential",
            description: "Upgrade to a Skills Profile to add specialist roles, showcase your expertise, and appear higher in searches for high-value contracts.",
            actionText: "Upgrade to Premium",
            action: onUpgrade,
            bgColor: 'bg-yellow-50',
            textColor: 'text-yellow-800'
        };
    } else if (!profile.selectedJobRoles || profile.selectedJobRoles.length === 0) {
        insight = {
            icon: Edit,
            title: "Showcase Your Expertise",
            description: "Add specialist job roles to your profile to highlight your detailed skills to companies.",
            actionText: "Add Specialist Roles",
            action: () => onNavigate('Manage Profile'),
            bgColor: 'bg-blue-50',
            textColor: 'text-blue-800'
        };
    }

    return (
        <div className={`${insight.bgColor} ${insight.textColor} p-5 rounded-lg shadow`}>
            <div className="flex items-start gap-3">
                <insight.icon size={24} className="flex-shrink-0 mt-1" />
                <div>
                    <h3 className="font-bold text-lg">{insight.title}</h3>
                    <p className="text-sm opacity-90">{insight.description}</p>
                    <button onClick={insight.action} className="font-bold text-sm mt-3 flex items-center gap-1 hover:underline">
                        {insight.actionText} <ArrowRight size={14} />
                    </button>
                </div>
            </div>
        </div>
    );
};

interface DashboardViewProps {
    engineerProfile: EngineerProfile;
    onUpgradeTier: () => void;
    setActiveView: (view: string) => void;
    boostProfile: () => void;
}

export const DashboardView = ({ engineerProfile, onUpgradeTier, setActiveView, boostProfile }: DashboardViewProps) => {
    const { reactivateProfile } = useAppContext();
    const isPremium = engineerProfile.profileTier === 'paid';
    const firstName = engineerProfile.name.split(' ')[0];

    const calculateProfileScore = () => {
        let score = 0;
        if (isPremium) {
            if (engineerProfile.description) score += 15;
            if (engineerProfile.skills && engineerProfile.skills.length > 0) score += 10;
            if (engineerProfile.contact.phone || engineerProfile.contact.linkedin) score += 15;
            if (engineerProfile.selectedJobRoles && engineerProfile.selectedJobRoles.length > 0) score += 35;
            if (engineerProfile.caseStudies && engineerProfile.caseStudies.length > 0) score += 25;
        } else {
            if (engineerProfile.description) score += 50;
            if (engineerProfile.contact.phone || engineerProfile.contact.linkedin) score += 25;
            if (engineerProfile.availability) score += 25;
        }
        return Math.min(score, 100);
    };

    const profileScore = calculateProfileScore();

    return (
        <div>
            <h1 className="text-3xl font-bold mb-1">Welcome back, {firstName}!</h1>
            <p className="text-gray-500 mb-6">This is your command center for managing your freelance career.</p>

            {engineerProfile.status === 'inactive' && (
                 <div className="p-4 mb-6 bg-orange-100 border-l-4 border-orange-500 text-orange-700">
                    <div className="flex">
                        <div className="py-1"><svg className="fill-current h-6 w-6 text-orange-500 mr-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M2.93 17.07A10 10 0 1 1 17.07 2.93 10 10 0 0 1 2.93 17.07zM9 5v6h2V5H9zm0 8v2h2v-2H9z"/></svg></div>
                        <div>
                            <p className="font-bold">Your Profile is Inactive</p>
                            <p className="text-sm">Your profile is currently hidden from search results. Reactivate it to become visible to companies again.</p>
                             <button onClick={reactivateProfile} className="mt-2 px-3 py-1 bg-orange-500 text-white text-sm font-bold rounded hover:bg-orange-600">Reactivate Profile</button>
                        </div>
                    </div>
                </div>
            )}
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                
                {/* Main content */}
                <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                    <DashboardPanel icon={Edit} title="Manage Profile" description="Update your roles, bio, and case studies." onClick={() => setActiveView('Manage Profile')} />
                    <DashboardPanel icon={User} title="View Public Profile" description="See your Stats Card as companies see it." onClick={() => setActiveView('View Public Profile')} />
                    <DashboardPanel icon={CalendarDays} title="Set Availability" description="Update your calendar to get relevant offers." onClick={() => setActiveView('Availability')} />
                    <DashboardPanel icon={Search} title="Find Work" description="Search and apply for freelance contracts." onClick={() => setActiveView('Job Search')} />
                    <DashboardPanel icon={BrainCircuit} title="AI Tools" description="Discover skills and get training suggestions." onClick={() => setActiveView('AI Tools')} />
                    <DashboardPanel icon={CreditCard} title="Billing" description="Manage subscriptions and purchase Boosts." onClick={() => setActiveView('Billing')} />
                    <div className="sm:col-span-2 md:col-span-1">
                         <DashboardPanel icon={Clapperboard} title="Visual Case Studies" description="Create engaging stories of your projects." onClick={() => setActiveView('Create Storyboard')} disabled={!isPremium} />
                    </div>
                     <div className="sm:col-span-2">
                        {isPremium ? (
                            <DashboardPanel icon={Rocket} title="Boost Profile" description="Get to the top of search results for 12 hours." onClick={boostProfile} isFeatured={true} />
                        ) : (
                            <DashboardPanel icon={Star} title="Upgrade to Premium" description="For £15/mo, unlock specialist roles, Boosts, and appear higher in searches." onClick={onUpgradeTier} isFeatured={true} />
                        )}
                    </div>
                </div>

                {/* Sidebar */}
                <div className="lg:col-span-1 space-y-6">
                    <ProfileStrength score={profileScore} />
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-4">
                        <StatBox value="142" label="Profile Views (7d)" icon={TrendingUp} />
                        <StatBox value="3" label="Job Invites" icon={Mail} />
                    </div>
                    <ActionableInsight profile={engineerProfile} onUpgrade={onUpgradeTier} onNavigate={setActiveView} />
                </div>
            </div>
        </div>
    );
};