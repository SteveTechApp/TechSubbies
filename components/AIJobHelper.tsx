import React, { useState } from 'react';
import { useAppContext } from '../context/InteractionContext';
import { Sparkles, Loader, ArrowRight } from './Icons';

interface AIJobHelperProps {
    jobDetails: any;
    setJobDetails: (details: any) => void;
}

export const AIJobHelper = ({ jobDetails, setJobDetails }: AIJobHelperProps) => {
    const { geminiService } = useAppContext();
    const [isLoading, setIsLoading] = useState(false);
    const [analysis, setAnalysis] = useState<any>(null);
    const [error, setError] = useState('');

    const handleAnalyze = async () => {
        if (!jobDetails.title && !jobDetails.description) {
            setError("Please provide a title or description first.");
            return;
        }
        setIsLoading(true);
        setError('');
        setAnalysis(null);
        
        const result = await geminiService.analyzeJobDescription(jobDetails.title, jobDetails.description);

        if (result.error) {
            setError(result.error);
        } else {
            setAnalysis(result);
        }
        setIsLoading(false);
    };
    
    const applySuggestion = (field: string, value: any) => {
        if(field === 'suggested_day_rate') {
             setJobDetails((prev: any) => ({ ...prev, minDayRate: value.min_rate, maxDayRate: value.max_rate }));
        } else if (field === 'suggested_titles') {
            setJobDetails((prev: any) => ({ ...prev, title: value[0] }));
        } else {
            setJobDetails((prev: any) => ({ ...prev, [field.replace('suggested_', '').replace('improved_', '')]: value }));
        }
    };

    return (
        <div className="p-4 border-2 border-dashed border-purple-200 rounded-lg bg-purple-50 my-2">
            <button
                type="button"
                onClick={handleAnalyze}
                disabled={isLoading}
                className="w-full flex items-center justify-center px-4 py-2 bg-purple-600 text-white font-semibold rounded-md hover:bg-purple-700 disabled:bg-purple-300"
            >
                {isLoading ? <Loader className="animate-spin w-5 h-5" /> : <Sparkles className="w-5 h-5 mr-2" />}
                {isLoading ? 'Analyzing...' : 'Get AI Suggestions'}
            </button>
            
            {error && <p className="text-red-500 mt-2 text-sm">{error}</p>}
            
            {analysis && (
                <div className="mt-4 space-y-3 text-sm">
                    <div className="p-2 bg-white rounded-md border">
                        <p className="font-semibold">Improved Description:</p>
                        <p className="italic text-gray-600">{analysis.improved_description}</p>
                        <button onClick={() => applySuggestion('improved_description', analysis.improved_description)} className="text-blue-600 font-bold text-xs hover:underline mt-1">Apply this</button>
                    </div>
                     <div className="p-2 bg-white rounded-md border flex justify-between items-center">
                        <div>
                            <p className="font-semibold">Suggested Role:</p>
                            <p className="text-gray-600">{analysis.suggested_job_role}</p>
                        </div>
                        <button onClick={() => applySuggestion('job_role', analysis.suggested_job_role)} className="text-blue-600 font-bold text-xs hover:underline">Apply</button>
                    </div>
                     <div className="p-2 bg-white rounded-md border flex justify-between items-center">
                        <div>
                            <p className="font-semibold">Suggested Day Rate:</p>
                            <p className="text-gray-600">£{analysis.suggested_day_rate.min_rate} - £{analysis.suggested_day_rate.max_rate}</p>
                        </div>
                        <button onClick={() => applySuggestion('suggested_day_rate', analysis.suggested_day_rate)} className="text-blue-600 font-bold text-xs hover:underline">Apply</button>
                    </div>
                    <div className="p-2 bg-white rounded-md border">
                        <p className="font-semibold">Alternative Titles:</p>
                        <ul className="list-disc list-inside text-gray-600">
                           {analysis.suggested_titles.map((title: string) => <li key={title}>{title}</li>)}
                        </ul>
                         <button onClick={() => applySuggestion('suggested_titles', analysis.suggested_titles)} className="text-blue-600 font-bold text-xs hover:underline mt-1">Apply first</button>
                    </div>
                </div>
            )}
        </div>
    );
};
