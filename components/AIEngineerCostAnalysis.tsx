import React, { useState } from 'react';
import { geminiService } from '../services/geminiService.ts';
import { BrainCircuit, Loader } from 'lucide-react';
import { Job, EngineerProfile } from '../types.ts';

interface AIEngineerCostAnalysisProps {
    job: Job;
    engineer: EngineerProfile;
}

interface AnalysisResult {
    skill_match_assessment: string;
    rate_justification: string;
    overall_recommendation: string;
    confidence_score: number;
}

export const AIEngineerCostAnalysis = ({ job, engineer }: AIEngineerCostAnalysisProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState('');

  const handleAnalyze = async () => {
    setIsLoading(true);
    setError('');
    setAnalysisResult(null);
    const result = await geminiService.analyzeEngineerCost(job.description, engineer);
    if (result) {
      setAnalysisResult(result);
    } else {
      setError('Could not perform analysis. The AI service may be unavailable.');
    }
    setIsLoading(false);
  };

  const ResultDisplay = () => {
    if (!analysisResult) return null;
    return (
        <div className='space-y-3'>
            <div> 
                <strong>Skill Match: </strong> 
                {analysisResult.skill_match_assessment}
            </div>
            <div> 
                <strong>Rate Justification: </strong> 
                {analysisResult.rate_justification}
            </div>
            <div className='p-3 bg-green-50 border border-green-200 rounded-md'> 
                <strong>Overall Recommendation: </strong> 
                {analysisResult.overall_recommendation}
            </div>
            <div className='flex items-center'>
                <strong className='mr-2'>Confidence:</strong>
                <div className='w-full bg-gray-200 rounded-full h-4'>
                    <div 
                        className='bg-blue-600 h-4 rounded-full text-xs font-medium text-blue-100 text-center p-0.5 leading-none' 
                        style={{ width: `${analysisResult.confidence_score}%` }}
                    >
                        {analysisResult.confidence_score}%
                    </div>
                </div>
            </div>
        </div>
    );
  };

  return (
    <div className='p-4 border-2 border-dashed rounded-md bg-gray-50'>
      <h4 className='font-bold text-lg mb-2 flex items-center'> 
        <BrainCircuit className='w-6 h-6 mr-2 text-purple-600' /> 
        AI Cost-Effectiveness Analysis
      </h4>
      <p className='text-sm text-gray-600 mb-4'> 
        Is {engineer.name}'s day rate of {engineer.currency}{engineer.dayRate} a good value for this job? Let our AI analyze the match.
      </p>
      {!analysisResult && (
        <button
            onClick={handleAnalyze}
            disabled={isLoading}
            className='px-4 py-2 bg-purple-600 text-white font-semibold rounded-md hover:bg-purple-700 disabled:bg-purple-300'
        >
            {isLoading ? 'Analyzing...' : 'Analyze Now'}
        </button>
      )}
      {isLoading && <Loader className='animate-spin mt-4' />}
      {error && <p className='text-red-500 mt-2'>{error}</p>}
      {analysisResult && <ResultDisplay />}
    </div>
  );
};
