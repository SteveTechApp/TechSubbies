import React from 'react';
import { EngineerProfile, ProfileTier } from '../../types/index.ts';
import { 
    Edit, User, CalendarDays, Search, BrainCircuit, CreditCard, 
    Clapperboard, Rocket, Star, CheckCircle, ArrowRight, TrendingUp, Mail
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
    const baseClasses = "flex flex-col p-2 bg-white rounded-lg shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300 text-left h-32";
    const disabledClasses = "bg-gray-100 text-gray-400 cursor-not-allowed hover:shadow-md hover:-translate-y-0";
    const featuredClasses = "bg-gradient-to-br from-yellow-300 to-orange-400 text-white";
    
    const finalClasses = `${baseClasses} ${disabled ? disabledClasses : ''} ${isFeatured ? featuredClasses : ''}`;

    return (
        <button onClick={onClick} disabled={disabled} className={finalClasses}>
            <div className={`p-1 rounded-full inline-block mb-1 ${isFeatured ? 'bg-white/30' : 'bg-blue-100'}`}>
                <Icon size={18} className={isFeatured ? 'text-white' : 'text-blue-600'} />
            </div>
            <h3 className={`text-sm font-bold ${isFeatured ? 'text-white' : 'text-gray-800'}`}>{title}</h3>
            <p className={`mt-1 text-xs ${isFeatured ? 'text-yellow-100' : 'text-gray-600'}`}>{description}</p>
        </button>
    );
};

const ProfileStrength = ({ score }: { score: number }) => (
    <div className="bg-white p-2 rounded-lg shadow">
        <h3 className="font-bold text-xs mb-1">Profile Strength</h3>
        <div className="flex items-center gap-2">
            <div className="w-full bg-gray-200 rounded-full h-1.5">
                <div className="bg-green-500 h-1.5 rounded-full" style={{ width: `${score}%` }}></div>
            </div>
            <span className="font-bold text-green-600 text-xs">{score}%</span>
        </div>
        <p className="text-xs text-gray-500 mt-1">A complete profile attracts more high-quality job offers.</p>
    </div>
);

const StatBox = ({ value, label, icon: Icon, onClick }: { value: string, label: string, icon: React.ComponentType<any>, onClick?: () => void }) => {
    const content = (
         <div className="flex items-center gap-2">
            <Icon size={18} className="text-blue-500" />
            <div>
                <p className="text-lg font-bold">{value}</p>
                <p className="text-xs text-gray-500">{label}</p>
            </div>
        </div>
    );
    
    const baseClasses = "w-full bg-white p-2 rounded-lg shadow text-left";
    if(onClick) {
        return (
            <button onClick={onClick} className={`${baseClasses} hover:shadow-lg hover:-translate-y-0.5 transition-all`}>
                {content}
            </button>
        );
    }

    return <div className={baseClasses}>{content}</div>;
};

const ActionableInsight = ({ profile, onUpgrade, onNavigate }: { profile: EngineerProfile, onUpgrade: () => void, onNavigate: (view: string) => void }) => {
    let insight = {
        icon: CheckCircle, title: "Profile Looking Good!",
        description: "Your profile is well-structured. Keep your availability updated to attract the best roles.",
        actionText: "Check Availability", action: () => onNavigate('Availability'),
        bgColor: 'bg-green-50', textColor: 'text-green-800'
    };

    if (profile.profileTier === ProfileTier.BASIC) {
        insight = {
            icon: Star, title: "Unlock Your Potential",
            description: "Upgrade to a Silver Profile to add searchable skills and get your certifications verified.",
            actionText: "Upgrade to Silver", action: onUpgrade,
            bgColor: 'bg-yellow-50', textColor: 'text-yellow-800'
        };
    } else if (!profile.selectedJobRoles || profile.selectedJobRoles.length === 0) {
        insight = {
            icon: Edit, title: "Showcase Your Expertise",
            description: "Add specialist job roles to your profile to highlight your detailed skills to companies.",
            actionText: "Add Specialist Roles", action: () => onNavigate('Manage Profile'),
            bgColor: 'bg-blue-50', textColor: 'text-blue-800'
        };
    }

    return (
        <div className={`${insight.bgColor} ${insight.textColor} p-2 rounded-lg shadow`}>
            <div className="flex items-start gap-2">
                <insight.icon size={18} className="flex-shrink-0 mt-0.5" />
                <div>
                    <h3 className="font-bold text-sm">{insight.title}</h3>
                    <p className="text-xs opacity-90">{insight.description}</p>
                    <button onClick={insight.action} className="font-bold text-xs mt-1.5 flex items-center gap-1 hover:underline">
                        {insight.actionText} <ArrowRight size={12} />
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
    const { reactivateProfile, jobs, isPremium } = useAppContext();
    const premiumAccess = isPremium(engineerProfile);
    const firstName = engineerProfile.name.split(' ')[0];

    const profileScore = React.useMemo(() => {
        let score = 20;
        if (engineerProfile.description) score += 10;
        if (engineerProfile.contact.phone || engineerProfile.contact.linkedin) score += 10;
        if (engineerProfile.profileTier === ProfileTier.PROFESSIONAL) score += 10;
        if (engineerProfile.skills && engineerProfile.skills.length > 0) score += 15;
        if (engineerProfile.certifications.some(c => c.verified)) score += 10;
        if (engineerProfile.profileTier === ProfileTier.SKILLS) score += 15;
        if (engineerProfile.selectedJobRoles && engineerProfile.selectedJobRoles.length > 0) score += 20;
        if (engineerProfile.profileTier === ProfileTier.BUSINESS) score += 10;
        return Math.min(score, 100);
    }, [engineerProfile]);
    
    const digestJobs = jobs.filter(j => j.status === 'active').sort((a,b) => b.postedDate.getTime() - a.postedDate.getTime()).slice(0, 3);

    const UPGRADE_INFO = {
        [ProfileTier.BASIC]: { title: "Upgrade to Silver", desc: "For £7/mo, add skills, unlock AI tools & more.", action: () => setActiveView('Billing')},
        [ProfileTier.PROFESSIONAL]: { title: "Upgrade to Gold", desc: "For £15/mo, add up to 3 specialist roles.", action: () => setActiveView('Billing')},
        [ProfileTier.SKILLS]: { title: "Upgrade to Platinum", desc: "For £35/mo, add up to 5 roles & unlock analytics.", action: () => setActiveView('Billing')},
        [ProfileTier.BUSINESS]: { title: "You're all set!", desc: "You have access to all features on the platform.", action: () => setActiveView('Analytics')},
    };
    const upgradeInfo = UPGRADE_INFO[engineerProfile.profileTier];

    return (
        <div>
            <h1 className="text-lg font-bold mb-0.5">Welcome back, {firstName}!</h1>
            <p className="text-gray-500 mb-2 text-xs">This is your command center for managing your freelance career.</p>

            {engineerProfile.status === 'inactive' && (
                 <div className="p-3 mb-3 bg-orange-100 border-l-4 border-orange-500 text-orange-700">
                    <div className="flex">
                        <div className="py-1"><svg className="fill-current h-6 w-6 text-orange-500 mr-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M2.93 17.07A10 10 0 1 1 17.07 2.93 10 10 0 0 1 2.93 17.07zM9 5v6h2V5H9zm0 8v2h2v-2H9z"/></svg></div>
                        <div>
                            <p className="font-bold">Your Profile is Inactive</p>
                            <p className="text-sm">Your profile is hidden from search results. Reactivate it to become visible to companies again.</p>
                             <button onClick={reactivateProfile} className="mt-2 px-3 py-1 bg-orange-500 text-white text-sm font-bold rounded hover:bg-orange-600">Reactivate Profile</button>
                        </div>
                    </div>
                </div>
            )}
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-2">
                <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
                    <DashboardPanel icon={Edit} title="Manage Profile" description="Update your roles, bio, and case studies." onClick={() => setActiveView('Manage Profile')} />
                    <DashboardPanel icon={User} title="View Public Profile" description="See your Stats Card as companies see it." onClick={() => setActiveView('View Public Profile')} />
                    <DashboardPanel icon={CalendarDays} title="Set Availability" description="Update your calendar to get relevant offers." onClick={() => setActiveView('Availability')} />
                    <DashboardPanel icon={Search} title="Find Work" description="Search and apply for freelance contracts." onClick={() => setActiveView('Job Search')} />
                    <DashboardPanel icon={BrainCircuit} title="AI Tools" description="Discover skills and get training suggestions." onClick={() => setActiveView('AI Tools')} disabled={!premiumAccess} />
                    <DashboardPanel icon={CreditCard} title="Billing" description="Manage subscriptions and purchase Boosts." onClick={() => setActiveView('Billing')} />
                    <div className="sm:col-span-2 md:col-span-1">
                         <DashboardPanel icon={Clapperboard} title="Visual Case Studies" description="Create engaging stories of your projects." onClick={() => setActiveView('Create Storyboard')} disabled={!premiumAccess} />
                    </div>
                     <div className="sm:col-span-2">
                        {premiumAccess ? (
                            <DashboardPanel icon={Rocket} title="Boost Profile" description="Get to the top of search results for a short time." onClick={boostProfile} isFeatured={true} />
                        ) : (
                            <DashboardPanel icon={Star} title={upgradeInfo.title} description={upgradeInfo.desc} onClick={upgradeInfo.action} isFeatured={true} />
                        )}
                    </div>
                    {premiumAccess && engineerProfile.jobDigestOptIn && (
                        <div className="sm:col-span-2 md:col-span-3 bg-white p-3 rounded-lg shadow">
                            <h3 className="font-bold text-sm mb-2">Your Weekly Digest</h3>
                            <p className="text-xs text-gray-500 mb-2">Here are some of the latest top-matching jobs. We'll send a full summary to your email.</p>
                            <div className="space-y-2">
                                {digestJobs.map(job => (
                                    <div key={job.id} className="p-2 bg-gray-50 rounded-md flex justify-between items-center">
                                        <div>
                                            <p className="font-semibold text-xs text-blue-700">{job.title}</p>
                                            <p className="text-xs text-gray-600">{job.location} • {job.currency}{job.dayRate}/day</p>
                                        </div>
                                        <button onClick={() => setActiveView('Job Search')} className="text-xs font-semibold text-blue-600 hover:underline flex items-center gap-1">
                                            View <ArrowRight size={12} />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                <div className="lg:col-span-1 space-y-2">
                    <ProfileStrength score={profileScore} />
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-2">
                        <StatBox value={engineerProfile.profileViews.toString()} label="Profile Views (30d)" icon={TrendingUp} onClick={() => setActiveView('Analytics')} />
                        <StatBox value={engineerProfile.jobInvites.toString()} label="Job Invites" icon={Mail} onClick={() => setActiveView('My Network')} />
                    </div>
                    <ActionableInsight profile={engineerProfile} onUpgrade={onUpgradeTier} onNavigate={setActiveView} />
                </div>
            </div>
        </div>
    );
};