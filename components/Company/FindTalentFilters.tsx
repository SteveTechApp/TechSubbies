import React, { useState, useEffect } from 'react';
import { EngineerProfile, Job, ProfileTier, Discipline } from '../../types';
import { Search, Sparkles, SlidersHorizontal } from '../Icons';
// FIX: Corrected import path for useAppContext to resolve 'not a module' error.
import { useAppContext } from '../../context/InteractionContext';
import { getDistance, findLocationsInRegion } from '../../utils/locationUtils';
import { LocationAutocomplete } from '../LocationAutocomplete';

interface Filters {
    searchTerm: string;
    jobForMatch: string;
    minExperience: number;
    maxDayRate: number;
    location: string;
    radius: number;
    hasSkillsProfile: boolean;
    discipline: string;
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
};

interface FindTalentFiltersProps {
    engineers: EngineerProfile[];
    myJobs: Job[];
    onFilterChange: (filteredEngineers: EngineerProfile[]) => void;
}

export const FindTalentFilters = ({ engineers, myJobs, onFilterChange }: FindTalentFiltersProps) => {
    const { geminiService } = useAppContext();
    const [filters, setFilters] = useState<Filters>(initialFilters);
    const [isAiLoading, setIsAiLoading] = useState(false);

    useEffect(() => {
        // This effect will run whenever filters change, except for AI-based filters
        if (!filters.jobForMatch) {
            applyFilters();
        }
    }, [filters, engineers]);

    const handleFilterChange = (field: keyof Filters, value: any) => {
        setFilters(prev => ({ ...prev, [field]: value }));
    };
    
    const handleLocationChange = (value: string) => {
         setFilters(prev => ({ ...prev, location: value }));
    }

    const runAiMatch = async () => {
        const job = myJobs.find(j => j.id === filters.jobForMatch);
        if (!job) return;

        setIsAiLoading(true);
        const result = await geminiService.findBestMatchesForJob(job, engineers);
        
        if (result.matches) {
            const engineersWithScores = engineers.map(eng => {
                const match = result.matches.find(m => m.id === eng.id);
                return match ? { ...eng, matchScore: match.match_score } : { ...eng, matchScore: 0 };
            }).sort((a, b) => (b.matchScore || 0) - (a.matchScore || 0));
            onFilterChange(engineersWithScores);
        } else {
            alert(result.error || "Failed to get AI matches.");
        }
        
        setIsAiLoading(false);
    };

    const applyFilters = () => {
        let filtered = [...engineers];

        // AI Match
        if (filters.jobForMatch) {
            // This is handled by a separate function
            return;
        }

        // Search Term
        if (filters.searchTerm) {
            const term = filters.searchTerm.toLowerCase();
            filtered = filtered.filter(e =>
                e.name.toLowerCase().includes(term) ||
                e.discipline.toLowerCase().includes(term) ||
                (e.skills && e.skills.some(s => s.name.toLowerCase().includes(term)))
            );
        }
        
        // Experience
        filtered = filtered.filter(e => e.experience >= filters.minExperience);
        
        // Day Rate
        filtered = filtered.filter(e => e.minDayRate <= filters.maxDayRate);

        // Location & Radius
        if (filters.radius > 0 && filters.radius < 500) {
             filtered = filtered.filter(e => {
                const distance = getDistance(filters.location, e.location);
                return distance !== null && distance <= filters.radius;
            });
        } else if (filters.radius >= 500) { // Special case for "UK Wide" or larger regions
            const locationsInScope = findLocationsInRegion(filters.location);
             filtered = filtered.filter(e => locationsInScope.some(l => e.location.includes(l)));
        }
        
        // Skills Profile
        if (filters.hasSkillsProfile) {
            filtered = filtered.filter(e => e.profileTier !== ProfileTier.BASIC);
        }
        
        // Discipline
        if (filters.discipline !== 'all') {
            filtered = filtered.filter(e => e.discipline === filters.discipline);
        }
        
        // Remove match score when not using AI match
        onFilterChange(filtered.map(e => ({ ...e, matchScore: undefined })));
    };

    const resetFilters = () => {
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
                {/* AI Smart Match */}
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
                </div>
                
                {/* Manual Filters */}
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

                <button onClick={resetFilters} className="w-full text-sm text-blue-600 hover:underline">Reset All Filters</button>
            </div>
        </aside>
    );
};