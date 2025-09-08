
import React, { useState, useMemo, useEffect } from 'react';
import { EngineerProfile, Job, ProfileTier, CompanyProfile, ExperienceLevel } from '../../types';
import { useAppContext } from '../../context/AppContext';
import { JOB_ROLE_DEFINITIONS } from '../../data/jobRoles';
import { Search, Sparkles, Loader } from '../Icons';
import { getDistance, findLocationsInRegion } from '../../utils/locationUtils';
import { LocationAutocomplete } from '../LocationAutocomplete';

interface AiMatchResult {
    id: string;
    match_score: number;
}

interface FindTalentFiltersProps {
    engineers: EngineerProfile[];
    myJobs: Job[];
    onFilterChange: (filteredEngineers: EngineerProfile[]) => void;
}

export const FindTalentFilters = ({ engineers, myJobs, onFilterChange }: FindTalentFiltersProps) => {
    const { user, geminiService } = useAppContext();
    const [filters, setFilters] = useState({
        keyword: '', role: 'any', maxRate: 0, minExperience: 0, maxDistance: 0, location: '', experienceLevel: 'any'
    });
    const [sort, setSort] = useState('relevance');
    const [aiSelectedJobId, setAiSelectedJobId] = useState('');
    const [aiMatchResults, setAiMatchResults] = useState<AiMatchResult[]>([]);
    const [isAiLoading, setIsAiLoading] = useState(false);

    const specialistRoles = useMemo(() => JOB_ROLE_DEFINITIONS.map(r => r.name).sort(), []);
    
    const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFilters(prev => {
            const newFilters = { ...prev };
            switch (name) {
                case 'maxRate':
                case 'minExperience':
                case 'maxDistance':
                    newFilters[name] = parseInt(value, 10) || 0;
                    break;
                case 'keyword':
                case 'role':
                case 'experienceLevel':
                    newFilters[name] = value;
                    break;
            }
            return newFilters;
        });
    };
    
    const handleLocationChange = (value: string) => {
        setFilters(prev => ({ ...prev, location: value }));
    };

    useEffect(() => {
        const aiScores = new Map(aiMatchResults.map(r => [r.id, r.match_score]));
        
        const locationSearchText = filters.location.trim();
        const regionLocations = locationSearchText ? findLocationsInRegion(locationSearchText) : [];

        const filtered = engineers
            .map(eng => ({ ...eng, matchScore: aiScores.get(eng.id) }))
            .filter(eng => {
                if (eng.status !== 'active') return false;
                if (eng.minDayRate > filters.maxRate && filters.maxRate > 0) return false;
                if (eng.experience < filters.minExperience) return false;
                if (filters.role !== 'any' && !eng.selectedJobRoles?.some(r => r.roleName === filters.role)) return false;
                if (filters.experienceLevel !== 'any' && eng.experienceLevel !== filters.experienceLevel) return false;
                
                if (locationSearchText && locationSearchText !== 'Worldwide') {
                    const engLocation = eng.location;
                    const inRegion = regionLocations.some(l => engLocation.toLowerCase().includes(l.toLowerCase()));
                    if (!inRegion) return false;
                }
                
                if (filters.keyword.trim() !== '') {
                    const searchableText = [eng.name, eng.discipline, eng.description, ...(eng.skills?.map(s => s.name) || []), ...(eng.selectedJobRoles?.flatMap(r => [...r.skills.map(s => s.name), r.roleName]) || [])].join(' ').toLowerCase();
                    if (!searchableText.includes(filters.keyword.toLowerCase())) return false;
                }
                return true;
            })
            .sort((a, b) => {
                if (a.matchScore !== undefined && b.matchScore !== undefined) return b.matchScore - a.matchScore;
                if (a.matchScore !== undefined) return -1;
                if (b.matchScore !== undefined) return 1;

                const tierSort = (b.profileTier !== ProfileTier.BASIC ? 1 : 0) - (a.profileTier !== ProfileTier.BASIC ? 1 : 0);
                switch (sort) {
                    case 'name-asc': return a.name.localeCompare(b.name);
                    case 'name-desc': return b.name.localeCompare(a.name);
                    case 'rate-asc': return a.minDayRate - b.minDayRate;
                    case 'rate-desc': return b.maxDayRate - a.maxDayRate;
                    default:
                        if (a.isBoosted !== b.isBoosted) return a.isBoosted ? -1 : 1;
                        return tierSort;
                }
            });
        onFilterChange(filtered);
    }, [engineers, filters, sort, aiMatchResults, onFilterChange]);

    const handleAiMatch = async () => {
        if (!aiSelectedJobId) return;
        const selectedJob = myJobs.find(j => j.id === aiSelectedJobId);
        if (!selectedJob) return;
        if (!selectedJob.skillRequirements || selectedJob.skillRequirements.length === 0) {
            alert("This job has no specific skill requirements defined. Please edit the job to add skills before using AI Match."); return;
        }
    
        setIsAiLoading(true);
        setAiMatchResults([]);
        const premiumEngineers = engineers.filter(e => e.status === 'active' && e.profileTier !== ProfileTier.BASIC);
        const result = await geminiService.findBestMatchesForJob(selectedJob, premiumEngineers);
    
        if (result.error) alert(result.error);
        else if (result && result.matches) setAiMatchResults(result.matches);
        else alert("AI could not find matches for this job. An unexpected error occurred.");
        setIsAiLoading(false);
    };

    return (
        <aside className="w-1/3 lg:w-1/4 bg-white p-6 rounded-lg shadow-md flex-shrink-0 overflow-y-auto custom-scrollbar">
            <h2 className="text-xl font-bold mb-4 flex items-center"><Search size={20} className="mr-2"/> Find Talent</h2>
            <div className="space-y-6">
                <div>
                    <label htmlFor="keyword" className="block text-sm font-medium text-gray-700">Keyword</label>
                    <input type="text" id="keyword" name="keyword" value={filters.keyword} onChange={handleFilterChange} placeholder="e.g., Crestron, Cisco" className="mt-1 block w-full border-gray-300 rounded-md shadow-sm p-2" />
                </div>
                 <div>
                    <label htmlFor="location" className="block text-sm font-medium text-gray-700">Location</label>
                    <LocationAutocomplete value={filters.location} onValueChange={handleLocationChange} />
                </div>
                <div>
                    <label htmlFor="role" className="block text-sm font-medium text-gray-700">Specialist Role</label>
                    <select name="role" id="role" value={filters.role} onChange={handleFilterChange} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm p-2 bg-white">
                        <option value="any">Any Role</option>
                        {specialistRoles.map(r => <option key={r} value={r}>{r}</option>)}
                    </select>
                </div>
                <div>
                    <label htmlFor="experienceLevel" className="block text-sm font-medium text-gray-700">Experience Level</label>
                    <select name="experienceLevel" id="experienceLevel" value={filters.experienceLevel} onChange={handleFilterChange} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm p-2 bg-white">
                        <option value="any">Any Level</option>
                        {Object.values(ExperienceLevel).map(level => <option key={level} value={level}>{level}</option>)}
                    </select>
                </div>
                 <div>
                    <label htmlFor="maxDistance" className="block text-sm font-medium text-gray-700">Max Distance (miles): {filters.maxDistance > 0 ? filters.maxDistance : 'Any'}</label>
                    <input type="range" id="maxDistance" name="maxDistance" min="0" max="500" step="10" value={filters.maxDistance} onChange={handleFilterChange} className="mt-1 block w-full" />
                </div>
                <div>
                    <label htmlFor="maxRate" className="block text-sm font-medium text-gray-700">Max Day Rate: {filters.maxRate || 'Any'}</label>
                    <input type="range" id="maxRate" name="maxRate" min="0" max="1200" step="25" value={filters.maxRate} onChange={handleFilterChange} className="mt-1 block w-full" />
                </div>
                <div>
                    <label htmlFor="minExperience" className="block text-sm font-medium text-gray-700">Min Experience (Yrs)</label>
                    <input type="number" id="minExperience" name="minExperience" value={filters.minExperience} onChange={handleFilterChange} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm p-2" />
                </div>
                 <div>
                    <label htmlFor="sort" className="block text-sm font-medium text-gray-700">Sort by</label>
                    <select id="sort" name="sort" value={sort} onChange={(e) => setSort(e.target.value)} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm p-2 bg-white">
                        <option value="relevance">Relevance</option>
                        <option value="name-asc">Name (A-Z)</option>
                        <option value="name-desc">Name (Z-A)</option>
                        <option value="rate-asc">Day Rate (Low-High)</option>
                        <option value="rate-desc">Day Rate (High-Low)</option>
                    </select>
                </div>
            </div>

            <div className="mt-6 pt-6 border-t border-gray-200">
                <h3 className="text-sm font-bold text-gray-800 uppercase tracking-wider flex items-center mb-3"><Sparkles size={16} className="mr-2 text-purple-600"/> AI Smart Match</h3>
                <select value={aiSelectedJobId} onChange={(e) => setAiSelectedJobId(e.target.value)} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm p-2 bg-white mb-2" aria-label="Select a job for AI matching">
                    <option value="">-- Select a Job --</option>
                    {myJobs.map(job => <option key={job.id} value={job.id}>{job.title}</option>)}
                </select>
                <button onClick={handleAiMatch} disabled={!aiSelectedJobId || isAiLoading} className="w-full flex items-center justify-center px-4 py-2 bg-purple-600 text-white font-semibold rounded-md hover:bg-purple-700 disabled:bg-purple-300">
                    {isAiLoading ? <Loader className="animate-spin w-5 h-5"/> : 'Find Top Matches'}
                </button>
            </div>
        </aside>
    );
};