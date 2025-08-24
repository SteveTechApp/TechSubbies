import React from 'react';
import { EngineerProfile, Skill, User } from '../../context/AppContext.tsx';
import { AISkillDiscovery } from '../../components/AISkillDiscovery.tsx';
import { Loader, Sparkles, Rocket, Clock } from '../../components/Icons.tsx';

const calculateDaysRemaining = (endDate: Date): number => {
    const now = new Date();
    const end = new Date(endDate);
    const diffTime = end.getTime() - now.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
};

const TrialCtaBanner = ({ onUpgrade }: { onUpgrade: () => void }) => (
    <div className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white p-6 rounded-lg shadow-lg mb-4 flex items-center justify-between">
        <div>
            <h3 className="font-bold text-xl mb-1">Get Hired Faster with a Job Profile</h3>
            <p className="text-blue-100">Appear at the top of search results and showcase your specialist skills to top companies.</p>
        </div>
        <button 
            onClick={onUpgrade}
            className="bg-white text-blue-600 font-bold py-2 px-5 rounded-lg hover:bg-gray-100 transition-transform transform hover:scale-105 whitespace-nowrap flex items-center"
        >
            <Sparkles size={18} className="mr-2"/> Start 30-Day Free Trial
        </button>
    </div>
);

const ActiveTrialBanner = ({ trialEndDate }: { trialEndDate: Date }) => {
    const daysRemaining = calculateDaysRemaining(trialEndDate);
    
    if (daysRemaining <= 0) return null; // Should be handled by login logic, but as a fallback.

    return (
        <div className="bg-gradient-to-r from-green-500 to-teal-500 text-white p-6 rounded-lg shadow-lg mb-4 flex items-center justify-between">
            <div>
                <h3 className="font-bold text-xl mb-1 flex items-center"><Rocket size={20} className="mr-2"/> Your Job Profile Trial is Active!</h3>
                <p className="text-green-100 flex items-center mt-2"><Clock size={16} className="mr-2"/> You have <strong className="mx-1.5">{daysRemaining}</strong> day{daysRemaining !== 1 ? 's' : ''} remaining.</p>
            </div>
             <button 
                // In a real app, this would open a subscription modal/page
                onClick={() => alert("Subscription flow not implemented in this demo.")}
                className="bg-white text-green-600 font-bold py-2 px-5 rounded-lg hover:bg-gray-100 transition-transform transform hover:scale-105 whitespace-nowrap"
            >
                Subscribe to Keep
            </button>
        </div>
    );
};


interface DashboardViewProps {
    engineerProfile: EngineerProfile;
    onGenerateDescription: () => void;
    isGeneratingDesc: boolean;
    onSkillsAdded: (skills: Skill[]) => void;
    onUpgradeTier: () => void;
}

export const DashboardView = ({ engineerProfile, onGenerateDescription, isGeneratingDesc, onSkillsAdded, onUpgradeTier }: DashboardViewProps) => {
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
    
    const isOnTrial = engineerProfile.profileTier === 'paid' && engineerProfile.trialEndDate;

    return (
        <div>
            {engineerProfile.profileTier === 'free' && <TrialCtaBanner onUpgrade={onUpgradeTier} />}
            {isOnTrial && <ActiveTrialBanner trialEndDate={engineerProfile.trialEndDate!} />}
            
            <h1 className="text-3xl font-bold mb-4">Welcome back, {engineerProfile.name.split(' ')[0]}!</h1>
            
            <AISkillDiscovery onSkillsAdded={onSkillsAdded} />
            
            <div className="bg-white p-6 rounded-lg shadow">
                <h2 className="text-xl font-bold">Profile Summary</h2>
                <p className="my-4 text-gray-700">
                    {String(engineerProfile.description || '')}
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