import React from 'react';
import { EngineerProfile, Skill, ProfileTier } from '../../types';
import { AISkillDiscovery } from '../../components/AISkillDiscovery';
import { TrainingRecommendations } from '../../components/TrainingRecommendations';
import { BrainCircuit, ArrowLeft, Star } from '../../components/Icons';

interface AIToolsViewProps {
    profile: EngineerProfile;
    onSkillsAdded: (skills: Skill[]) => void;
    setActiveView: (view: string) => void;
}

export const AIToolsView = ({ profile, onSkillsAdded, setActiveView }: AIToolsViewProps) => {
    const canUseAiTools = profile.profileTier !== ProfileTier.BASIC;

    return (
        <div>
            <button 
                onClick={() => setActiveView('Dashboard')} 
                className="flex items-center mb-4 px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300"
            >
                <ArrowLeft size={16} className="mr-2" />
                Back to Dashboard
            </button>
            <h1 className="text-3xl font-bold mb-4 flex items-center"><BrainCircuit size={32} className="mr-3 text-purple-600"/> AI Tools</h1>
            
            {canUseAiTools ? (
                <>
                    <p className="text-gray-600 mb-6 max-w-3xl">Leverage the power of AI to enhance your profile, discover new skills, and identify valuable training opportunities to boost your career.</p>
                    <div className="space-y-6">
                        <AISkillDiscovery onSkillsAdded={onSkillsAdded} />
                        <TrainingRecommendations profile={profile} />
                    </div>
                </>
            ) : (
                <div className="mt-6 bg-gradient-to-br from-yellow-300 to-orange-400 p-8 rounded-lg shadow-lg text-center text-orange-900">
                    <div className="inline-block bg-white/30 p-3 rounded-full mb-4">
                        <Star size={32} className="text-white" />
                    </div>
                    <h2 className="text-2xl font-bold mb-2">Unlock AI-Powered Career Tools</h2>
                    <p className="max-w-xl mx-auto mb-6">
                        AI Skill Discovery and Training Recommendations are premium features. Upgrade to a <strong>Silver Profile</strong> to get AI-driven insights that help you stand out, identify skill gaps, and command higher day rates.
                    </p>
                    <button
                        onClick={() => setActiveView('Billing')}
                        className="bg-white text-blue-700 font-bold py-3 px-8 rounded-lg hover:bg-gray-100 transition-transform transform hover:scale-105 shadow-md"
                    >
                        Upgrade to Silver Profile
                    </button>
                </div>
            )}
        </div>
    );
};
