import React, { useState } from 'react';
import { EngineerProfile, Insight } from '../../types';
import { useAppContext } from '../../context/AppContext';
import { Lightbulb, ArrowLeft, Star, Loader } from '../../components/Icons';
import { InsightCard } from '../../components/InsightCard';

interface AICoachViewProps {
    profile: EngineerProfile;
    setActiveView: (view: string) => void;
}

export const AICoachView = ({ profile, setActiveView }: AICoachViewProps) => {
    const { isPremium, getCareerCoaching } = useAppContext();
    const [isLoading, setIsLoading] = useState(false);
    const [insights, setInsights] = useState<Insight[] | null>(null);
    const [error, setError] = useState('');

    const premiumAccess = isPremium(profile);

    const handleAnalysis = async () => {
        setIsLoading(true);
        setError('');
        setInsights(null);
        const result = await getCareerCoaching();
        if (result.error) {
            setError(result.error);
        } else if (result.insights) {
            setInsights(result.insights);
        }
        setIsLoading(false);
    };

    return (
        <div>
            <button 
                onClick={() => setActiveView('Dashboard')} 
                className="flex items-center mb-4 px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300"
            >
                <ArrowLeft size={16} className="mr-2" />
                Back to Dashboard
            </button>
            <h1 className="text-3xl font-bold mb-4 flex items-center"><Lightbulb size={32} className="mr-3 text-yellow-500"/> AI Career Coach</h1>
            
            {!premiumAccess ? (
                // Upgrade CTA
                <div className="mt-6 bg-gradient-to-br from-yellow-300 to-orange-400 p-8 rounded-lg shadow-lg text-center text-orange-900">
                    <div className="inline-block bg-white/30 p-3 rounded-full mb-4">
                        <Star size={32} className="text-white" />
                    </div>
                    <h2 className="text-2xl font-bold mb-2">Unlock Your Personal AI Career Coach</h2>
                    <p className="max-w-xl mx-auto mb-6">
                        Get personalized, data-driven advice on how to improve your profile, what skills to learn next, and which certifications will increase your day rate. This is a premium feature.
                    </p>
                    <button
                        onClick={() => setActiveView('Billing')}
                        className="bg-white text-blue-700 font-bold py-3 px-8 rounded-lg hover:bg-gray-100 transition-transform transform hover:scale-105 shadow-md"
                    >
                        Upgrade Your Profile
                    </button>
                </div>
            ) : (
                // Feature UI
                <div className="bg-white p-6 rounded-lg shadow">
                    <p className="text-gray-600 mb-6">Your AI Coach analyzes your profile against real-time job market trends on TechSubbies to give you a competitive edge. Get personalized recommendations to help you land your next high-value contract.</p>
                    
                    {!insights && (
                        <div className="text-center">
                            <button onClick={handleAnalysis} disabled={isLoading} className="px-6 py-3 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 disabled:bg-blue-300 flex items-center justify-center mx-auto">
                                {isLoading ? (
                                    <><Loader className="animate-spin w-5 h-5 mr-2"/> Analyzing...</>
                                ) : 'Analyze My Career Path'}
                            </button>
                        </div>
                    )}

                    {error && <p className="text-red-500 mt-4 text-center">{error}</p>}

                    {insights && (
                        <div className="mt-6 space-y-4">
                            <h2 className="text-2xl font-bold text-gray-800">Your Personalized Insights:</h2>
                            {insights.map((insight, index) => (
                                <InsightCard key={index} insight={insight} onNavigate={setActiveView} />
                            ))}
                            <button onClick={handleAnalysis} disabled={isLoading} className="text-sm text-blue-600 hover:underline mt-4 font-semibold">
                                {isLoading ? 'Analyzing...' : 'Re-analyze My Profile'}
                            </button>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};