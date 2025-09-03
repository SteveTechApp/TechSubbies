import React, { useState } from 'react';
import { useAppContext } from '../context/AppContext.tsx';
import { ExperienceLevel } from '../types/index.ts';
import { Loader, Sparkles, BarChart2, DollarSign, Briefcase } from './Icons.tsx';

interface AIJobHelperProps {
    jobDetails: any;
    setJobDetails: (updater: (prev: any) => any) => void;
}

interface AnalysisResult {
    improved_description: string;
    suggested_job_role: string;
    suggested_experience_level: ExperienceLevel;
    suggested_day_rate: {
        min_rate: number;
        max_rate: number;
    };
    error?: string;
}

const SuggestionCard = ({ icon: Icon, title, children, onApply, isApplied }: { icon: React.ComponentType<any>, title: string, children: React.ReactNode, onApply: () => void, isApplied: boolean }) => (
    <div className="bg-white p-3 rounded-lg border flex flex-col">
        <h4 className="font-bold text-sm mb-2 flex items-center text-gray-700">
            <Icon size={16} className="mr-2" /> {title}
        </h4>
        <div className="flex-grow text-sm text-gray-600">
            {children}
        </div>
        <button type="button" onClick={onApply} disabled={isApplied} className="mt-2 text-xs font-bold text-blue-600 hover:underline disabled:text-gray-400 self-start">
            {isApplied ? 'Applied ✓' : 'Apply Suggestion'}
        </button>
    </div>
);

export const AIJobHelper = ({ jobDetails, setJobDetails }: AIJobHelperProps) => {
    const { geminiService } = useAppContext();
    const [isLoading, setIsLoading] = useState(false);
    const [result, setResult] = useState<AnalysisResult | null>(null);
    const [error, setError] = useState('');
    const [applied, setApplied] = useState<string[]>([]);

    const handleAnalyze = async () => {
        if (!jobDetails.description.trim()) {
            setError("Please enter a description before analyzing.");
            return;
        }
        setIsLoading(true);
        setError('');
        setResult(null);
        setApplied([]);
        const analysis = await geminiService.analyzeJobDescription(jobDetails.title, jobDetails.description);
        if (analysis.error) {
            setError(analysis.error);
        } else {
            setResult(analysis);
        }
        setIsLoading(false);
    };

    const handleApply = (field: string, value: any) => {
        setJobDetails(prev => ({...prev, ...value}));
        setApplied(prev => [...prev, field]);
    };

    return (
        <div className="mt-2 p-4 border-2 border-dashed border-purple-300 bg-purple-50 rounded-lg">
            <div className="flex justify-between items-center">
                <div>
                    <h3 className="text-lg font-bold text-purple-800 flex items-center">
                        <Sparkles size={20} className="mr-2" />
                        AI Job Post Assistant
                    </h3>
                    <p className="text-sm text-purple-700">Improve your job post to attract top talent.</p>
                </div>
                <button type="button" onClick={handleAnalyze} disabled={isLoading} className="px-4 py-2 bg-purple-600 text-white font-semibold rounded-md hover:bg-purple-700 disabled:bg-purple-300">
                    {isLoading ? <Loader className="animate-spin w-5 h-5"/> : 'Analyze'}
                </button>
            </div>

            {error && <p className="text-red-500 mt-2 text-sm">{error}</p>}

            {result && (
                <div className="mt-4 grid grid-cols-1 gap-4">
                     <SuggestionCard 
                        icon={Briefcase} 
                        title="Suggested Description"
                        isApplied={applied.includes('description')}
                        onApply={() => handleApply('description', { description: result.improved_description })}
                    >
                        <p className="text-xs text-gray-600 h-24 overflow-y-auto custom-scrollbar pr-2 border-l-2 pl-2 border-gray-200">{result.improved_description}</p>
                    </SuggestionCard>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <SuggestionCard 
                            icon={Briefcase} 
                            title="Suggested Role & Title"
                            isApplied={applied.includes('role')}
                            onApply={() => handleApply('role', { jobRole: result.suggested_job_role, title: result.suggested_job_role })}
                        >
                            <p className="font-semibold">{result.suggested_job_role}</p>
                        </SuggestionCard>

                         <SuggestionCard 
                            icon={BarChart2} 
                            title="Suggested Experience"
                            isApplied={applied.includes('experience')}
                            onApply={() => handleApply('experience', { experienceLevel: result.suggested_experience_level })}
                         >
                             <p className="font-semibold">{result.suggested_experience_level}</p>
                        </SuggestionCard>

                        <SuggestionCard 
                            icon={DollarSign} 
                            title="Suggested Day Rate"
                            isApplied={applied.includes('rate')}
                            onApply={() => handleApply('rate', { dayRate: String(result.suggested_day_rate.max_rate) })}
                        >
                            <p className="font-semibold">£{result.suggested_day_rate.min_rate} - £{result.suggested_day_rate.max_rate}</p>
                             <p className="text-xs text-gray-500">(Applying sets the max rate)</p>
                        </SuggestionCard>
                    </div>
                </div>
            )}
        </div>
    );
};