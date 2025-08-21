import React from 'react';
import { Skill, User } from '../../context/AppContext.tsx';
import { AISkillDiscovery } from '../../components/AISkillDiscovery.tsx';
import { Loader, Sparkles } from '../../components/Icons.tsx';

const UpgradeProfileCta = ({ onUpgrade }: { onUpgrade: () => void }) => (
    <div className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white p-6 rounded-lg shadow-lg mb-6 flex items-center justify-between">
        <div>
            <h3 className="font-bold text-xl mb-1">Activate Job Profile to Get Hired Faster</h3>
            <p className="text-blue-100">Your Free Profile has limited visibility. Upgrade to appear at the top of search results and get matched with exclusive projects.</p>
        </div>
        <button 
            onClick={onUpgrade}
            className="bg-white text-blue-600 font-bold py-2 px-5 rounded-lg hover:bg-gray-100 transition-transform transform hover:scale-105 whitespace-nowrap"
        >
            Upgrade Now
        </button>
    </div>
);


interface DashboardViewProps {
    user: User;
    profileDescription: string;
    onGenerateDescription: () => void;
    isGeneratingDesc: boolean;
    onSkillsAdded: (skills: Skill[]) => void;
    profileTier: 'free' | 'paid';
    onUpgradeTier: () => void;
}

export const DashboardView = ({ user, profileDescription, onGenerateDescription, isGeneratingDesc, onSkillsAdded, profileTier, onUpgradeTier }: DashboardViewProps) => {
    const buttonContent = isGeneratingDesc ? (
      <>
        <Loader className="animate-spin w-5 h-5 mr-2" />
        Generating...
      </>
    ) : (
      <>
        <Sparkles className="w-5 h-5 mr-2" />
        Generate Bio with AI
      </>
    );
    
    return (
        <div>
            {profileTier === 'free' && <UpgradeProfileCta onUpgrade={onUpgradeTier} />}
            <h1 className="text-3xl font-bold mb-6">Welcome back, {user?.profile?.name.split(' ')[0]}!</h1>
            <AISkillDiscovery onSkillsAdded={onSkillsAdded} />
            <div className="bg-white p-6 rounded-lg shadow">
                <h2 className="text-xl font-bold">Profile Summary</h2>
                <p className="my-4 text-gray-700">
                    {String(profileDescription || '')}
                </p>
                <button
                    onClick={onGenerateDescription}
                    disabled={isGeneratingDesc}
                    className="flex items-center px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 disabled:bg-purple-300"
                >
                    {buttonContent}
                </button>
            </div>
        </div>
    );
};