import React, { useState, useEffect } from 'react';
import { EngineerProfile, Insight } from '../../types';
import { useAppContext } from '../../context/InteractionContext';
import { Loader, BrainCircuit } from '../../components/Icons';
import { InsightCard } from '../../components/InsightCard';

interface AICoachViewProps {
    profile: EngineerProfile;
    setActiveView: (view: string) => void;
}

export const AICoachView = ({ profile, setActiveView }: AICoachViewProps) => {
    const { geminiService } = useAppContext();
    const [insights, setInsights] = useState<Insight[] | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const handleGetCoaching = async () => {
        setIsLoading(true);
        setError('');
        setInsights(null);

        const result = await geminiService.getCareerCoaching(profile);
        if (result.error) {
            setError(result.error);
        } else {
            setInsights(result.insights || []);
        }
        setIsLoading(false);
    };
    
    // Automatically run analysis on component mount
    useEffect(() => {
        handleGetCoaching();
    }, [profile]);


    return (
        <div>
            <h1 className="text-3xl font-bold mb-2">AI Career Coach</h1>
            <p className="text-gray-600 mb-6">Your personal AI career advisor, analyzing your profile to suggest actionable steps for growth.</p>

            <div className="bg-white p-6 rounded-lg shadow">
                 {isLoading && (
                    <div className="text-center py-12">
                        <Loader className="animate-spin w-10 h-10 text-blue-600 mx-auto mb-4" />
                        <p className="font-semibold text-gray-700">Analyzing your profile against market trends...</p>
                    </div>
                )}
                 {error && <p className="text-red-500 text-center py-12">{error}</p>}

                 {insights && (
                     <div className="space-y-4">
                        <h2 className="text-xl font-bold mb-2">Your Personalized Insights:</h2>
                        {insights.map((insight, index) => (
                            <InsightCard key={index} insight={insight} onNavigate={setActiveView} />
                        ))}
                         <button
                            onClick={handleGetCoaching}
                            className="text-sm text-blue-600 hover:underline mt-4 font-semibold"
                        >
                            Analyze again
                        </button>
                    </div>
                 )}
            </div>
        </div>
    );
};
