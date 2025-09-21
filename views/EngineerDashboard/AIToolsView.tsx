import React from 'react';
import { EngineerProfile, Skill, ProfileTier } from '../../types';
import { AISkillDiscovery } from '../../components/AISkillDiscovery';
import { TrainingRecommendations } from '../../components/TrainingRecommendations';

interface AIToolsViewProps {
    profile: EngineerProfile;
    onSkillsAdded: (skills: Skill[]) => void;
    setActiveView: (view: string) => void;
}

export const AIToolsView = ({ profile, onSkillsAdded, setActiveView }: AIToolsViewProps) => {

    return (
        <div>
            <h1 className="text-3xl font-bold mb-4">AI-Powered Tools</h1>
            
            {profile.profileTier !== ProfileTier.BASIC ? (
                <>
                    <AISkillDiscovery onSkillsAdded={onSkillsAdded} />
                    <TrainingRecommendations profile={profile} />
                </>
            ) : (
                 <div className="text-center p-6 bg-gray-100 rounded-lg border-2 border-dashed">
                    <p className="text-gray-600">Upgrade to a premium profile to unlock powerful AI tools like Skill Discovery and Training Recommendations.</p>
                    <button onClick={() => setActiveView('Billing')} className="mt-4 bg-blue-600 text-white font-bold py-2 px-5 rounded-lg hover:bg-blue-700">Upgrade Now</button>
                </div>
            )}
        </div>
    );
};
