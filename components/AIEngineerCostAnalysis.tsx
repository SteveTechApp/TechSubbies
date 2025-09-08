
import React, { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import { Job, EngineerProfile } from '../types';
import { ResultDisplay } from './ResultDisplay';
import { BrainCircuit, Loader } from './Icons';

export interface AnalysisResult {
    skill_match_assessment: string;
    rate_justification: string;
    overall_recommendation: string;
    confidence_score: number;
}

interface AIEngineerCostAnalysisProps {
    job: Job;
    engineer: EngineerProfile;
}

export const AIEngineerCostAnalysis = ({ job, engineer }: AIEngineerCostAnalysisProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState('');
  const { geminiService } = useAppContext();

  const handleAnalyze = async () => {
    setIsLoading(true);
    setError('');
    setAnalysisResult(null);

    const result = await geminiService.analyzeEngineerCost(job.description, engineer);
    
    if (result.error) {
      setError(result.error);
    } else {
      setAnalysisResult(result as AnalysisResult);
    }

    setIsLoading(false);
  };
  
  const buttonContent = isLoading ? (
    <>
      <Loader className="animate-spin w-5 h-5 mr-2" />
      Analyzing...
    </>
  ) : (
    "Analyze Now"
  );

  return (
    <div className="p-4 border-2 border-dashed rounded-md bg-gray-50">
      <h4 className="font-bold text-lg mb-2 flex items-center"> 
        <BrainCircuit className="w-6 h-6 mr-2 text-purple-600" /> 
        AI Cost-Effectiveness Analysis
      </h4>
      <p className="text-sm text-gray-600 mb-4"> 
        Is {engineer.name}'s day rate range of {engineer.currency}{engineer.minDayRate} - {engineer.maxDayRate} a good value for this job? Let our AI analyze the match.
      </p>
      
      {!analysisResult && (
        <button
            onClick={handleAnalyze}
            disabled={isLoading}
            className="flex items-center px-4 py-2 bg-purple-600 text-white font-semibold rounded-md hover:bg-purple-700 disabled:bg-purple-300"
        >
            {buttonContent}
        </button>
      )}

      {error && <p className="text-red-500 mt-2">{error}</p>}
      
      {analysisResult && <ResultDisplay analysisResult={analysisResult} />}
    </div>
  );
};