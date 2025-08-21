import React from 'react';
import { Skill, User } from '../../context/AppContext.tsx';
import { AISkillDiscovery } from '../../components/AISkillDiscovery.tsx';
import { Loader, Sparkles } from '../../components/Icons.tsx';

interface DashboardViewProps {
    user: User;
    profileDescription: string;
    onGenerateDescription: () => void;
    isGeneratingDesc: boolean;
    onSkillsAdded: (skills: Skill[]) => void;
}

export const DashboardView = ({ user, profileDescription, onGenerateDescription, isGeneratingDesc, onSkillsAdded }: DashboardViewProps) => {
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