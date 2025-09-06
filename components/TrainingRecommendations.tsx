import React, { useState } from 'react';
import { useAppContext } from '../context/AppContext';
// FIX: Corrected module import to remove file extension.
import { EngineerProfile, TrainingProvider } from '../types';
import { MOCK_TRAINING_PROVIDERS } from '../data/trainingProviders';
import { Award, Loader, Sparkles } from './Icons';

interface Recommendation {
    courseName: string;
    reason: string;
    keywords: string[];
    providerName?: string;
}

interface TrainingRecommendationsProps {
    profile: EngineerProfile;
}

const findProvidersByKeywords = (keywords: string[]): TrainingProvider[] => {
    if (!keywords || keywords.length === 0) return [];
    const lowerCaseKeywords = keywords.map(k => k.toLowerCase());
    
    const providers = MOCK_TRAINING_PROVIDERS.filter(provider => 
        provider.specialties.some(specialty => 
            lowerCaseKeywords.some(keyword => specialty.toLowerCase().includes(keyword))
        )
    );
    return [...new Map(providers.map(item => [item.name, item])).values()];
};

export const TrainingRecommendations = ({ profile }: TrainingRecommendationsProps) => {
    const { geminiService } = useAppContext();
    const [isLoading, setIsLoading] = useState(false);
    const [recommendations, setRecommendations] = useState<Recommendation[] | null>(null);
    const [error, setError] = useState('');

    const handleAnalyze = async () => {
        setIsLoading(true);
        setError('');
        setRecommendations(null);
        
        const result = await geminiService.getTrainingRecommendations(profile);
        
        if (result.error) {
            setError(result.error);
        } else if (result && result.recommendations) {
            setRecommendations(result.recommendations);
        } else {
            setError('Could not get training recommendations. An unexpected error occurred.');
        }
        setIsLoading(false);
    };

    const buttonContent = isLoading ? (
        <>
            <Loader className="animate-spin w-5 h-5 mr-2" />
            Analyzing...
        </>
    ) : (
        <>
            <Sparkles className="w-5 h-5 mr-2" />
            Suggest Training
        </>
    );

    return (
        <div className="bg-white p-6 rounded-lg shadow mt-6">
            <div className="flex items-center mb-3">
                <Award className="w-8 h-8 text-green-600 mr-3" />
                <h2 className="text-xl font-bold">Training &amp; Development</h2>
            </div>
            <p className="text-gray-600 mb-4">Leverage AI to identify key training opportunities that can boost your skills and increase your day rate. Our AI will analyze your profile to suggest valuable certifications.</p>

            {!recommendations && (
                 <button
                    onClick={handleAnalyze}
                    disabled={isLoading}
                    className="flex items-center px-4 py-2 bg-green-600 text-white font-semibold rounded-md hover:bg-green-700 disabled:bg-green-300"
                >
                    {buttonContent}
                </button>
            )}
            
            {error && <p className="text-red-500 mt-2">{error}</p>}

            {recommendations && (
                <div className="mt-4 space-y-4 animate-fade-in-up">
                    <h3 className="font-bold text-lg">Your AI-Powered Recommendations:</h3>
                    {recommendations.map((rec, index) => {
                        let providers: TrainingProvider[] = [];
                        if (rec.providerName) {
                            const directMatch = MOCK_TRAINING_PROVIDERS.find(p => p.name === rec.providerName);
                            if (directMatch) providers.push(directMatch);
                        }
                        
                        if (providers.length === 0) {
                            providers = findProvidersByKeywords(rec.keywords);
                        }

                        return (
                            <div key={index} className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                                <h4 className="font-bold text-blue-700">{rec.courseName}</h4>
                                <p className="text-gray-700 my-2 text-sm">{rec.reason}</p>
                                {providers.length > 0 && (
                                    <div>
                                        <h5 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Recommended Training Providers:</h5>
                                        <div className="flex flex-wrap gap-2 mt-2">
                                            {providers.map(p => (
                                                <a 
                                                    key={p.name} 
                                                    href={p.url} 
                                                    target="_blank" 
                                                    rel="noopener noreferrer" 
                                                    className="flex items-center text-sm bg-blue-100 text-blue-800 px-3 py-1 rounded-full hover:bg-blue-200 hover:text-blue-900 transition-colors"
                                                >
                                                    {p.name}
                                                    {p.type === 'Sponsored' && (
                                                        <span className="ml-2 text-xs font-bold bg-yellow-400 text-yellow-900 px-1.5 py-0.5 rounded-full">
                                                            Sponsored
                                                        </span>
                                                    )}
                                                </a>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        );
                    })}
                     <button
                        onClick={() => setRecommendations(null)}
                        className="text-sm text-blue-600 hover:underline mt-4 font-semibold"
                    >
                        Analyze again
                    </button>
                </div>
            )}
        </div>
    );
};