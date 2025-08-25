import React from 'react';
import { EngineerProfile, Skill } from '../../types/index.ts';
import { AISkillDiscovery } from '../../components/AISkillDiscovery.tsx';
import { TrainingRecommendations } from '../../components/TrainingRecommendations.tsx';
import { BrainCircuit, ArrowLeft } from '../../components/Icons.tsx';

interface AIToolsViewProps {
    profile: EngineerProfile;
    onSkillsAdded: (skills: Skill[]) => void;
    setActiveView: (view: string) => void;
}

export const AIToolsView = ({ profile, onSkillsAdded, setActiveView }: AIToolsViewProps) => {
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
            <p className="text-gray-600 mb-6 max-w-3xl">Leverage the power of AI to enhance your profile, discover new skills, and identify valuable training opportunities to boost your career.</p>

            <div className="space-y-6">
                <AISkillDiscovery onSkillsAdded={onSkillsAdded} />
                <TrainingRecommendations profile={profile} />
            </div>
        </div>
    );
};