import React, { useState } from 'react';
import { useAppContext, Skill } from '../context/AppContext.tsx';
import { BrainCircuit, Loader, Plus } from 'lucide-react';

interface AISkillDiscoveryProps {
    onSkillsAdded: (skills: Skill[]) => void;
}

export const AISkillDiscovery = ({ onSkillsAdded }: AISkillDiscoveryProps) => {
    const [role, setRole] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [discoveredSkills, setDiscoveredSkills] = useState<Skill[] | null>(null);
    const [error, setError] = useState('');
    const { geminiService } = useAppContext();

    const handleDiscover = async () => {
        if (!role.trim()) {
            setError('Please enter a role or job title.');
            return;
        }
        setIsLoading(true);
        setError('');
        setDiscoveredSkills(null);
        const result = await geminiService.generateSkillsForRole(role);
        setIsLoading(false);
        if (result && result.skills) {
            setDiscoveredSkills(result.skills);
        } else {
            setError('Could not discover skills for this role. Please try another.');
        }
    };

    const handleAddSkills = () => {
        if(discoveredSkills) {
            onSkillsAdded(discoveredSkills);
        }
        setDiscoveredSkills(null);
        setRole('');
    };

    return (
        <div className='bg-blue-50 border-2 border-dashed border-blue-200 rounded-lg p-6 my-6'>
            <div className='flex items-center mb-3'>
                <BrainCircuit className='w-8 h-8 text-blue-600 mr-3' />
                <h3 className='text-xl font-bold text-blue-800'>AI Skill Discovery</h3>
            </div>
            <p className='text-gray-600 mb-4'>Don't want to add skills manually? Enter a job title (e.g., "AV Programmer") and let our AI suggest relevant skills for you.</p>
            <div className='flex items-center space-x-2'>
                <input
                    type='text'
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    placeholder='e.g., Senior Network Engineer'
                    className='w-full border p-2 rounded-md focus:ring-2 focus:ring-blue-500'
                />
                <button
                    onClick={handleDiscover}
                    disabled={isLoading}
                    className='px-6 py-2 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 disabled:bg-blue-300 flex items-center'
                >
                    {isLoading ? <Loader className='animate-spin w-5 h-5' /> : 'Discover'}
                </button>
            </div>
            {error && <p className='text-red-500 mt-2'>{error}</p>}
            {discoveredSkills && (
                <div className='mt-4 animate-fade-in-up'>
                    <h4 className='font-bold'>Suggested Skills:</h4>
                    <div className='flex flex-wrap gap-2 my-2'>
                        {discoveredSkills.map(skill =>
                            <span key={skill.name} className='bg-blue-200 text-blue-800 px-3 py-1 rounded-full text-sm'>
                                {skill.name} (Rated: {skill.rating}/5)
                            </span>
                        )}
                    </div>
                    <button
                        onClick={handleAddSkills}
                        className='px-4 py-2 bg-green-600 text-white font-semibold rounded-md hover:bg-green-700 flex items-center'
                    >
                        <Plus className='w-5 h-5 mr-1' />
                        Add to My Profile
                    </button>
                </div>
            )}
        </div>
    );
};
