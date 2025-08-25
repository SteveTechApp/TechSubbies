import React from 'react';
import { EngineerProfile, Skill } from '../../types/index.ts';
import { AISkillDiscovery } from '../../components/AISkillDiscovery.tsx';
import { TrainingRecommendations } from '../../components/TrainingRecommendations.tsx';
import { BrainCircuit } from '../../components/Icons.tsx';

interface AIToolsViewProps {
    profile: EngineerProfile;
    onSkillsAdded: (skills: Skill[]) => void;
}

export const AIToolsView = ({ profile, onSkillsAdded }: AIToolsViewProps) => {
    return (
        <div>
            <h1 className="text-3xl font-bold mb-4 flex items-center"><BrainCircuit size={32} className="mr-3 text-purple-600"/> AI Tools</h1>
            <p className="text-gray-600 mb-6 max-w-3xl">Leverage the power of AI to enhance your profile, discover new skills, and identify valuable training opportunities to boost your career.</p>

            <div className="space-y-6">
                <AISkillDiscovery onSkillsAdded={onSkillsAdded} />
                <TrainingRecommendations profile={profile} />
            </div>
        </div>
    );
};