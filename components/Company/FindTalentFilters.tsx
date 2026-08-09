import React, { useState, useEffect, useRef } from 'react';
import { EngineerProfile, Job, ProfileTier } from '../../types';
import { Search, Sparkles, SlidersHorizontal } from '../Icons';
import { useAppContext } from '../../context/InteractionContext';
import { getDistance, findLocationsInRegion } from '../../utils/locationUtils';
import { LocationAutocomplete } from '../LocationAutocomplete';
import { getSkillBand } from '../../utils/skillBands';
import { isEngineerAvailable } from '../../utils/availability';
import { matchesWorkPreference, type WorkModePreference } from '../../utils/inclusivePreferences';
import { useData } from '../../context/DataContext';
import { explainSkillRequirementMatch } from '../../services/skillMatching';
import { trackMarketplaceEvent } from '../../services/marketplaceAnalyticsService';

interface Filters {
    searchTerm: string;
    jobForMatch: string;
    minExperience: number;
    maxDayRate: number;
    location: string;
    radius: number;
    hasSkillsProfile: boolean;
    discipline: string;
    minSkillLevel: number;
    neededFrom: string;
    neededTo: string;
    workMode: WorkModePreference | 'any';
    language: string;
}

const initialFilters: Filters = {
    searchTerm: '',
    jobForMatch: '',
    minExperience: 0,
    maxDayRate: 1500,
    location: 'London, UK',
    radius: 50,
    hasSkillsProfile: false,
    discipline: 'all',
    minSkillLevel: 0,
    neededFrom: '',
    neededTo: '',
    workMode: 'any',
    language: '',
};

interface FindTalentFiltersProps {
    engineers: EngineerProfile[];
    myJobs: Job[];
    onFilterChange: (filteredEngineers: EngineerProfile[]) => void;
    onBudgetChange?: (maxDayRate: number) => void;
}

export const FindTalentFilters = ({ engineers, myJobs, onFilterChange, onBudgetChange }: FindTalentFiltersProps) => {
    const { geminiService } = useAppContext();
    const { jobs, reviews } = useData();
    const [filters, setFilters] = useState<Filters>(initialFilters);
    const [isAiLoading, setIsAiLoading] = useState(false);
    const [matchNotice, setMatchNotice] = useState('');
    const userChangedFilters = useRef(false);

    useEffect(() => {
        if (!filters.jobForMatch) {
            applyFilters();
        }
    }, [filters, engineers]);

    useEffect(() => {
        onBudgetChange?.(filters.maxDayRate);
    }, [filters.maxDayRate]);

    const handleFilterChange = (field: keyof Filters, value: any) => {
        userChangedFilters.current = true;
        setFilters(prev => ({ ...prev, [field]: value }));
    };
    
    const handleLocationChange = (value: string) => {
         userChangedFilters.current = true;
         setFilters(prev => ({ ...prev, location: value }));
    };

    const runAiMatch = async () => {
        const job = myJobs.find(j => j.id === filters.jobForMatch);
        if (!job) return;

        void trackMarketplaceEvent({ eventType: 'search.performed', jobId: job.id });
        userChangedFilters.current = false;
        setIsAiLoading(true);
        setMatchNotice('');
        const evidenceContext = { jobs, reviews };
        const eligibleEngineers = engineers.filter(engineer => matchesWorkPreference(engineer, {
            workMode: filters.workMode,
            language: filters.language,
        }));
        const rankEngineers = (matches: Array<{ id: string; match_score: number }>) => eligibleEngineers.map(eng => {
            const explanation = explainSkillRequirementMatch(eng, job, evidenceContext);
            const match = matches.find(candidate => candidate.id === eng.id);
            return {
                ...eng,
                matchScore: match ? match.match_score : explanation.requirementScore,
                matchExplanation: explanation,
            };
        }).sort((a, b) => (b.matchScore || 0) - (a.matchScore || 0));
        try {
            const result = await geminiService.findBestMatchesForJob(job, eligibleEngineers, evidenceContext);
            const matches = 'matches' in result && Array.isArray(result.matches) ? result.matches : [];
            onFilterChange(rankEngineers(matches));
            if (matches.length === 0) setMatchNotice('Showing deterministic evidence-adjusted results.');
        } catch (error) {
            onFilterChange(rankEngineers([]));
            setMatchNotice('AI refinement is unavailable; showing deterministic evidence-adjusted results.');
        } finally {
            setIsAiLoading(false);
        }
    };

    const applyFilters = () => {
        let filtered = [...engineers];

        if (filters.jobForMatch) return;

        if (filters.searchTerm) {
            const term = filters.searchTerm.toLowerCase();
            filtered = filtered.filter(e => {
                const nameOrDisciplineMatch =
                    e.name.toLowerCase().includes(term) ||
                    e.discipline.toLowerCase().includes(term);

                const matchingSkills = (e.selectedJobRoles || [])
                    .flatMap(role => role.skills)
                    .filter(s => s.name.toLowerCase().includes(term));

                if (matchingSkills.length > 0) {
                    return matchingSkills.some(s => s.rating >= filters.minSkillLevel);
                }

                return nameOrDisciplineMatch && filters.minSkillLevel === 0;
            });
        }
        
        filtered = filtered.filter(e => e.experience >= filters.minExperience);
        filtered = filtered.filter(e => e.minDayRate <= filters.maxDayRate);

        if (filters.radius > 0 && filters.radius < 500) {
             filtered = filtered.filter(e => {
                const distance = getDistance(filters.location, e.location);
                return distance !== null && distance <= filters.radius;
            });
        } else if (filters.radius >= 500) {
            const locationsInScope = findLocationsInRegion(filters.location);
             filtered = filtered.filter(e => locationsInScope.some(l => e.location.includes(l)));
        }
        
        if (filters.hasSkillsProfile) {
            filtered = filtered.filter(e => e.profileTier !== ProfileTier.BASIC);
        }
        
        if (filters.discipline !== 'all') {
            filtered = filtered.filter(e => e.discipline === filters.discipline);
        }

        if (filters.workMode !== 'any' || filters.language.trim()) {
            filtered = filtered.filter(e => matchesWorkPreference(e, {
                workMode: filters.workMode,
                language: filters.language,
            }));
        }

        if (filters.neededFrom) {
            filtered = filtered.filter(e => isEngineerAvailable(e, filters.neededFrom, filters.neededTo || filters.neededFrom));
        }

        onFilterChange(filtered.map(e => ({ ...e, matchScore: undefined })));
        if (userChangedFilters.current) {
            void trackMarketplaceEvent({ eventType: 'search.performed' });
            userChangedFilters.current = false;
        }
    };

    const resetFilters = () => {
        userChangedFilters.current = true;
        setFilters(initialFilters);
        onFilterChange(engineers);
    };

    return (
        <aside className="w-1/3 max-w-sm bg-white p-4 rounded-lg shadow-md flex-shrink-0">
            <h2 className="text-xl font-bold mb-4 flex items-center">
                <SlidersHorizontal size={20} className="mr-2" />
                Find Talent
            </h2>
            
            <div className="space-y-4">
                <div className="p-3 bg-purple-50 border-2 border-dashed border-purple-200 rounded-lg">
                    <h3 className="font-bold text-purple-800 flex items-center mb-2">
                        <Sparkles size={16} className="mr-1.5"/> AI Smart Match
                    </h3>
                    <select
                        value={filters.jobForMatch}
                        onChange={e => handleFilterChange('jobForMatch', e.target.value)}
                        className="w-full border p-2 rounded bg-white"
                    >
                        <option value="">-- Select a job to auto-match --</option>
                        {myJobs.map(j => <option key={j.id} value={j.id}>{j.title}</option>)}
                    </select>
                    <button onClick={runAiMatch} disabled={!filters.jobForMatch || isAiLoading} className="w-full mt-2 px-4 py-2 bg-purple-600 text-white font-semibold rounded-md text-sm hover:bg-purple-700 disabled:bg-purple-300">
                        {isAiLoading ? 'Analyzing...' : 'Find Best Matches'}
                    </button>
                    {matchNotice && <p className="mt-2 text-xs text-purple-700" role="status">{matchNotice}</p>}
                </div>
                
                <div>
                    <label className="block text-sm font-medium">Keywords</label>
                    <div className="relative">
                        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"/>
                        <input
                            type="text"
                            placeholder="Name, skill, discipline..."
                            value={filters.searchTerm}
                            onChange={e => handleFilterChange('searchTerm', e.target.value)}
                            className="w-full border p-2 pl-8 rounded"
                            disabled={!!filters.jobForMatch}
                        />
                    </div>
                    {filters.searchTerm && (
                        <div className="mt-2">
                            <label className="block text-xs font-medium text-gray-600">
                                Minimum skill level for "{filters.searchTerm}": {filters.minSkillLevel} · {getSkillBand(filters.minSkillLevel).label}
                            </label>
                            <input
                                type="range"
                                min="0"
                                max="100"
                                step="5"
                                value={filters.minSkillLevel}
                                onChange={e => handleFilterChange('minSkillLevel', parseInt(e.target.value))}
                                className="w-full"
                                disabled={!!filters.jobForMatch}
                            />
                        </div>
                    )}
                </div>

                <div>
                    <label className="block text-sm font-medium">Work mode</label>
                    <p className="mb-1 text-xs text-gray-500">Engineer-declared preference. Accessibility needs are not searchable.</p>
                    <select
                        value={filters.workMode}
                        onChange={e => handleFilterChange('workMode', e.target.value as Filters['workMode'])}
                        className="w-full border p-2 rounded bg-white"
                    >
                        <option value="any">Any work mode</option>
                        <option value="on-site">On-site</option>
                        <option value="remote">Remote</option>
                        <option value="hybrid">Hybrid</option>
                    </select>
                </div>

                <div>
                    <label className="block text-sm font-medium">Language</label>
                    <input
                        type="text"
                        value={filters.language}
                        onChange={e => handleFilterChange('language', e.target.value)}
                        placeholder="e.g. English, Polish"
                        className="w-full border p-2 rounded"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium">Location</label>
                    <LocationAutocomplete value={filters.location} onValueChange={handleLocationChange}/>
                    <label className="block text-sm font-medium mt-2">Within {filters.radius < 500 ? `${filters.radius} miles` : 'Region'}</label>
                    <input type="range" min="0" max="500" step="10" value={filters.radius} onChange={e => handleFilterChange('radius', parseInt(e.target.value))} className="w-full" disabled={!!filters.jobForMatch}/>
                </div>
                
                 <div>
                    <label className="block text-sm font-medium">Min. Experience ({filters.minExperience} years)</label>
                    <input type="range" min="0" max="25" value={filters.minExperience} onChange={e => handleFilterChange('minExperience', parseInt(e.target.value))} className="w-full" disabled={!!filters.jobForMatch}/>
                </div>

                <div>
                    <label className="block text-sm font-medium">Max Day Rate (£{filters.maxDayRate})</label>
                    <input type="range" min="150" max="1500" step="25" value={filters.maxDayRate} onChange={e => handleFilterChange('maxDayRate', parseInt(e.target.value))} className="w-full" disabled={!!filters.jobForMatch}/>
                </div>
                
                <div>
                     <label className="flex items-center">
                        <input type="checkbox" checked={filters.hasSkillsProfile} onChange={e => handleFilterChange('hasSkillsProfile', e.target.checked)} className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500" disabled={!!filters.jobForMatch}/>
                        <span className="ml-2 text-sm">Skills Profile Only</span>
                    </label>
                </div>

                <div>
                    <label className="block text-sm font-medium">Needed for dates</label>
                    <p className="text-xs text-gray-500 mb-1">Only show engineers who are actually free for this job.</p>
                    <div className="grid grid-cols-2 gap-2">
                        <input
                            type="date"
                            value={filters.neededFrom}
                            onChange={e => handleFilterChange('neededFrom', e.target.value)}
                            className="w-full border p-2 rounded text-sm"
                            disabled={!!filters.jobForMatch}
                        />
                        <input
                            type="date"
                            value={filters.neededTo}
                            onChange={e => handleFilterChange('neededTo', e.target.value)}
                            className="w-full border p-2 rounded text-sm"
                            disabled={!!filters.jobForMatch || !filters.neededFrom}
                        />
                    </div>
                </div>

                <button onClick={resetFilters} className="w-full text-sm text-blue-600 hover:underline">Reset All Filters</button>
            </div>
        </aside>
    );
};
