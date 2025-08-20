
import React, { useState } from 'react';
import { DollarSign, Loader, BarChart2 } from 'lucide-react';
import { analyzeEngineerRates } from '../services/geminiService';
import { useAppContext } from '../context/AppContext';
import { SKILL_ROLES } from '../constants';
import { Role } from '../types';

interface AnalysisResult {
    roleTitle: string;
    engineerCount: number;
    averageDayRate: number;
    aiSummary: string;
    scope: 'local' | 'global';
    location?: string;
    isSmallSample: boolean;
}

export const AIEngineerCostAnalysis: React.FC = () => {
    const { engineers, currency, currentUser, role } = useAppContext();
    const [selectedRole, setSelectedRole] = useState('');
    const [scope, setScope] = useState<'local' | 'global'>('local');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [result, setResult] = useState<AnalysisResult | null>(null);

    const isLocalScopeAvailable = role === Role.ENGINEER || role === Role.COMPANY;

    // Default to global if local is not available
    React.useEffect(() => {
        if (!isLocalScopeAvailable) {
            setScope('global');
        }
    }, [isLocalScopeAvailable]);


    const handleAnalyze = async () => {
        if (!selectedRole) {
            setError('Please select a role to analyze.');
            return;
        }

        setIsLoading(true);
        setError(null);
        setResult(null);

        const analysisScope = isLocalScopeAvailable ? scope : 'global';
        let relevantEngineers = engineers;
        let locationName: string | undefined;

        if (analysisScope === 'local' && currentUser && 'location' in currentUser && typeof currentUser.location === 'string') {
            const userCountry = currentUser.location.split(', ')[1];
            if (userCountry) {
                locationName = userCountry;
                relevantEngineers = engineers.filter(eng => eng.location.endsWith(userCountry));
            }
        }
        
        const relevantProfiles = relevantEngineers
            .flatMap(eng => eng.skillProfiles)
            .filter(profile => profile.roleTitle === selectedRole);
        
        if (relevantProfiles.length === 0) {
            const scopeMessage = analysisScope === 'local' ? `in your local market (${locationName})` : 'globally';
            setError(`No engineers found with the role "${selectedRole}" ${scopeMessage} to analyze.`);
            setIsLoading(false);
            return;
        }

        const totalRate = relevantProfiles.reduce((sum, profile) => sum + profile.dayRate, 0);
        const averageDayRate = Math.round(totalRate / relevantProfiles.length);
        const engineerCount = relevantProfiles.length;
        const isSmallSample = engineerCount < 5;

        try {
            const aiSummary = await analyzeEngineerRates(selectedRole, averageDayRate, engineerCount, currency, analysisScope, locationName);
            if (aiSummary) {
                setResult({
                    roleTitle: selectedRole,
                    engineerCount,
                    averageDayRate,
                    aiSummary,
                    scope: analysisScope,
                    location: locationName,
                    isSmallSample,
                });
            } else {
                setError('Failed to get a valid response from the AI. Please try again.');
            }
        } catch (e) {
            setError('An unexpected error occurred while generating the analysis.');
            console.error(e);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="bg-white rounded-lg shadow-md border border-gray-200">
            <div className="p-6 border-b">
                <h2 className="text-xl font-bold text-gray-800 flex items-center">
                    <DollarSign className="mr-3 text-green-600" />
                    AI Market Rate Analysis
                </h2>
                <p className="text-sm text-gray-600 mt-1">
                    Analyze average day rates for any role to stay competitive.
                </p>
            </div>

            {isLocalScopeAvailable && (
                 <div className="p-6 border-b">
                     <div className="flex border border-gray-200 rounded-md p-1 bg-gray-100 max-w-xs">
                         <button
                             onClick={() => setScope('local')}
                             className={`w-1/2 py-2 text-sm font-semibold rounded-md transition-colors ${scope === 'local' ? 'bg-white text-blue-600 shadow' : 'text-gray-600 hover:bg-white/50'}`}
                         >
                             Local Market
                         </button>
                         <button
                             onClick={() => setScope('global')}
                             className={`w-1/2 py-2 text-sm font-semibold rounded-md transition-colors ${scope === 'global' ? 'bg-white text-blue-600 shadow' : 'text-gray-600 hover:bg-white/50'}`}
                         >
                             Global Market
                         </button>
                     </div>
                 </div>
            )}
            
            <div className="p-6">
                <div className="flex flex-col sm:flex-row gap-4">
                    <select
                        value={selectedRole}
                        onChange={(e) => setSelectedRole(e.target.value)}
                        className="flex-grow p-3 border border-gray-300 rounded-md bg-white focus:ring-2 focus:ring-blue-500"
                        disabled={isLoading}
                    >
                        <option value="" disabled>Select a role to analyze...</option>
                        {SKILL_ROLES.map(role => (
                            <option key={role} value={role}>{role}</option>
                        ))}
                    </select>
                    <button
                        onClick={handleAnalyze}
                        disabled={isLoading || !selectedRole}
                        className="flex items-center justify-center bg-green-600 text-white font-bold py-3 px-6 rounded-lg hover:bg-green-700 transition-colors disabled:bg-green-300"
                    >
                        {isLoading ? (
                            <>
                                <Loader className="animate-spin mr-2" size={20} />
                                Analyzing...
                            </>
                        ) : (
                            <>
                                <BarChart2 className="mr-2" size={20} />
                                Analyze Rates
                            </>
                        )}
                    </button>
                </div>
                {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
            </div>

            {result && (
                <div className="p-6 border-t">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">
                        Analysis for <span className="text-blue-600">{result.roleTitle}</span> ({result.scope === 'local' ? `Local - ${result.location}` : 'Global'})
                    </h3>
                     {result.isSmallSample && (
                        <div className="p-3 mb-4 bg-yellow-50 border-l-4 border-yellow-400 text-yellow-800 text-sm rounded-r-md">
                            <strong>Note:</strong> The sample size is small ({result.engineerCount} engineers), so this analysis may not be fully representative.
                        </div>
                    )}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                         <div className="bg-gray-50 p-4 rounded-lg border">
                            <p className="text-sm text-gray-600">Average Day Rate</p>
                            <p className="text-3xl font-bold text-gray-900">{currency}{result.averageDayRate}</p>
                        </div>
                        <div className="bg-gray-50 p-4 rounded-lg border">
                            <p className="text-sm text-gray-600">Engineers Analyzed</p>
                            <p className="text-3xl font-bold text-gray-900">{result.engineerCount}</p>
                        </div>
                    </div>
                    <div>
                        <h4 className="font-semibold text-gray-700 mb-2">AI Summary</h4>
                        <div className="p-4 bg-blue-50 border-l-4 border-blue-400 text-gray-700 rounded-r-lg">
                            <p className="whitespace-pre-wrap">{result.aiSummary}</p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};