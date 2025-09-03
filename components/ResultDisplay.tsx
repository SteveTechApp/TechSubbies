import React from 'react';
import { AnalysisResult } from './AIEngineerCostAnalysis.tsx';

interface ResultDisplayProps {
    analysisResult: AnalysisResult | null;
}

export const ResultDisplay = ({ analysisResult }: ResultDisplayProps) => {
    if (!analysisResult) return null;
    
    // Defensive casting ensures that even if the AI returns a non-string value, the component won't crash.
    const assessment = String(analysisResult.skill_match_assessment || '');
    const justification = String(analysisResult.rate_justification || '');
    const recommendation = String(analysisResult.overall_recommendation || '');

    return (
        <div className="space-y-3">
            <div>
                <strong>Skill Match: </strong>
                {assessment}
            </div>
            <div>
                <strong>Rate Justification: </strong>
                {justification}
            </div>
            <div className="p-3 bg-green-50 border border-green-200 rounded-md">
                <strong>Overall Recommendation: </strong>
                {recommendation}
            </div>
            <div className="flex items-center">
                <strong className="mr-2">Confidence:</strong>
                <div className="w-full bg-gray-200 rounded-full h-4">
                    <div
                        className="bg-blue-600 h-4 rounded-full text-xs font-medium text-blue-100 text-center p-0.5 leading-none"
                        style={{ width: `${analysisResult.confidence_score}%` }}
                    >
                        {analysisResult.confidence_score}%
                    </div>
                </div>
            </div>
        </div>
    );
};
