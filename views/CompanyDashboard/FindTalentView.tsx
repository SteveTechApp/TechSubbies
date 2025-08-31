import React, { useState, useMemo } from 'react';
import { useAppContext } from '../../context/AppContext.tsx';
import { EngineerProfile, Job } from '../../types/index.ts';
import { JOB_ROLE_DEFINITIONS } from '../../data/jobRoles.ts';
import { EngineerCard } from '../../components/EngineerCard.tsx';
import { Search, Layers, DollarSign, Sparkles, Loader, User } from '../../components/Icons.tsx';

interface FindTalentViewProps {
    engineers: EngineerProfile[];
    myJobs: Job[];
    onSelectEngineer: (eng: EngineerProfile) => void;
}

export const FindTalentView = ({ engineers, myJobs, onSelectEngineer }: FindTalentViewProps) => {
    const { geminiService } = useAppContext();
    const [filters, setFilters] = useState({
        keyword: '',
        role: 'any',
        maxRate: 1000,
        minExperience: 0,
    });
    const [sort, setSort] = useState('relevance');
    // AI Match State
    const [aiSelectedJobId, setAiSelectedJobId] = useState('');
    const [aiMatchedEngineerIds, setAiMatchedEngineerIds] = useState<string[]>([]);
    const [isAiLoading, setIsAiLoading] = useState(false);
    
    const specialistRoles = useMemo(() => {
        return JOB_ROLE_DEFINITIONS.map(r => r.name).sort();
    }, []);
    
    const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFilters(prev => ({...prev, [name]: parseInt(value) || value }));
    };

    const handleAiMatch = async () => {
        if (!aiSelectedJobId) return;
        const selectedJob = myJobs.find(j => j.id === aiSelectedJobId);
        if (!selectedJob) return;
    
        setIsAiLoading(true);
        setAiMatchedEngineerIds([]);
        const activeEngineers = engineers.filter(e => e.status === 'active');
        
        const result = await geminiService.findBestMatchesForJob(selectedJob, activeEngineers);
    
        if (result && result.best_matches) {
            setAiMatchedEngineerIds(result.best_matches);
        } else {
            alert("AI could not find matches for this job. Please try manual filtering.");
        }
        setIsAiLoading(false);
    };

    const clearAiMatch = () => {
        setAiSelectedJobId('');
        setAiMatchedEngineerIds([]);
    };

    const calculateMatchScore = (eng: EngineerProfile): number => {
        let score = 0;
        const maxScore = 100;

        // 1. Role Match (50 points)
        if (filters.role === 'any') {
            score += 50;
        } else if (eng.selectedJobRoles?.some(r => r.roleName === filters.role)) {
            score += 50;
        }

        // 2. Keyword Match (40 points)
        if (filters.keyword.trim() !== '') {
            const keywords = filters.keyword.toLowerCase().split(' ').filter(k => k);
            let matchedKeywords = 0;
            const searchableText = (eng.profileTier === 'paid')
                ? [ eng.name, eng.discipline, ...(eng.skills?.map(s => s.name) || []), ...(eng.selectedJobRoles?.flatMap(r => r.skills.map(s => s.name)) || []) ].join(' ').toLowerCase()
                : [ eng.name, eng.discipline, eng.description ].join(' ').toLowerCase();

            keywords.forEach(kw => {
                if (searchableText.includes(kw)) {
                    matchedKeywords++;
                }
            });
            score += (matchedKeywords / keywords.length) * 40;
        } else {
            // No keyword, give full points for this section
            score += 40;
        }
        
        // 3. Rate Match (10 points)
        if (eng.dayRate <= filters.maxRate) {
            const rateScore = (1 - (eng.dayRate / filters.maxRate)) * 10;
            score += rateScore;
        }

        return Math.min(Math.round(score), maxScore);
    };


    const processedEngineers = useMemo(() => {
        return engineers
            .map(eng => ({
                ...eng,
                matchScore: calculateMatchScore(eng),
            }))
            .filter(eng => {
                // Only show active engineers
                if (eng.status !== 'active') return false;

                // Main rate filter
                if (eng.dayRate > filters.maxRate) return false;

                // Experience filter
                if (eng.experience < filters.minExperience) return false;
                
                // Role filter (only filter out if a specific role is selected and it doesn't match)
                if (filters.role !== 'any' && !eng.selectedJobRoles?.some(r => r.roleName === filters.role)) {
                    return false;
                }
                
                // Keyword filter
                if (filters.keyword.trim() !== '') {
                     const searchableText = (eng.profileTier === 'paid')
                        ? [ eng.name, eng.discipline, eng.description, ...(eng.skills?.map(s => s.name) || []), ...(eng.selectedJobRoles?.flatMap(r => [...r.skills.map(s => s.name), r.roleName]) || []) ].join(' ').toLowerCase()
                        : [ eng.name, eng.discipline, eng.description ].join(' ').toLowerCase();

                    if (!searchableText.includes(filters.keyword.toLowerCase())) {
                        return false;
                    }
                }

                return true;
            })
            .sort((a, b) => {
                // AI match sorting takes precedence
                const indexA = aiMatchedEngineerIds.indexOf(a.id);
                const indexB = aiMatchedEngineerIds.indexOf(b.id);
                if (indexA !== -1 || indexB !== -1) {
                    if (indexA !== -1 && indexB !== -1) return indexA - indexB;
                    return indexA !== -1 ? -1 : 1;
                }

                const tierSort = (b.profileTier === 'paid' ? 1 : 0) - (a.profileTier === 'paid' ? 1 : 0);
                switch (sort) {
                    case 'name-asc':
                        return a.name.localeCompare(b.name);
                    case 'name-desc':
                        return b.name.localeCompare(a.name);
                    case 'rate-asc':
                        return a.dayRate - b.dayRate;
                    case 'rate-desc':
                        return b.dayRate - a.dayRate;
                    case 'relevance':
                    default:
                        // Boosted profiles first
                        if (a.isBoosted !== b.isBoosted) {
                            return a.isBoosted ? -1 : 1;
                        }
                        // Then by match score
                        if (a.matchScore !== b.matchScore) {
                            return b.matchScore - a.matchScore;
                        }
                        // Then by tier
                        return tierSort;
                }
            });
    }, [engineers, filters, sort, aiMatchedEngineerIds]);

    return (
        <div className="flex gap-8 h-[calc(100vh-10rem)]">
            {/* Filters Sidebar */}
            <aside className="w-1/3 lg:w-1/4 bg-white p-6 rounded-lg shadow-md flex-shrink-0 overflow-y-auto custom-scrollbar">
                <h2 className="text-xl font-bold mb-4 flex items-center"><Search size={20} className="mr-2"/> Find Talent</h2>
                 <div className="p-3 bg-blue-50 text-blue-800 rounded-md text-xs mb-4 border border-blue-200">
                    For best results, filter by a <strong>Specialist Role</strong>. This targets engineers with a premium <strong>Skills Profile</strong> who have detailed, rated expertise.
                </div>
                <div className="space-y-6">
                    <div>
                        <label htmlFor="keyword" className="block text-sm font-medium text-gray-700">Keyword or Skill</label>
                        <input type="text" id="keyword" name="keyword" value={filters.keyword} onChange={handleFilterChange} placeholder="e.g., Crestron, Cisco, AWS" className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm p-2" />
                         <p className="text-xs text-gray-500 mt-1">Only searches detailed skills on premium profiles.</p>
                    </div>
                    <div>
                        <label htmlFor="role" className="block text-sm font-medium text-gray-700 flex items-center"><Layers size={14} className="mr-1.5"/> Specialist Role</label>
                        <select id="role" name="role" value={filters.role} onChange={handleFilterChange} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm p-2 bg-white">
                            <option value="any">Any Role</option>
                            {specialistRoles.map(role => <option key={role} value={role}>{role}</option>)}
                        </select>
                        <p className="text-xs text-gray-500 mt-1">Only engineers with a 'Skills Profile' appear here.</p>
                    </div>
                    <div>
                        <label htmlFor="maxRate" className="block text-sm font-medium text-gray-700 flex items-center"><DollarSign size={14} className="mr-1.5"/> Max Day Rate: £{filters.maxRate}</label>
                        <input type="range" id="maxRate" name="maxRate" min="200" max="1000" step="25" value={filters.maxRate} onChange={handleFilterChange} className="mt-1 block w-full" />
                    </div>
                    <div>
                        <label htmlFor="minExperience" className="block text-sm font-medium text-gray-700 flex items-center"><User size={14} className="mr-1.5"/> Min Years of Experience: {filters.minExperience}</label>
                        <input type="range" id="minExperience" name="minExperience" min="0" max="20" step="1" value={filters.minExperience} onChange={handleFilterChange} className="mt-1 block w-full" />
                    </div>
                </div>

                 {/* AI Job Match Section */}
                <div className="mt-6 pt-6 border-t border-gray-200">
                    <h3 className="text-sm font-bold text-gray-800 uppercase tracking-wider flex items-center mb-3">
                        <Sparkles size={16} className="mr-2 text-purple-600"/>
                        AI Job Match
                    </h3>
                    <p className="text-xs text-gray-500 mb-2">Select one of your jobs to find the best candidates instantly.</p>
                    <select
                        value={aiSelectedJobId}
                        onChange={(e) => setAiSelectedJobId(e.target.value)}
                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm p-2 bg-white mb-2"
                        aria-label="Select a job for AI matching"
                    >
                        <option value="">-- Select a Job --</option>
                        {myJobs.map(job => <option key={job.id} value={job.id}>{job.title}</option>)}
                    </select>
                    <button
                        onClick={handleAiMatch}
                        disabled={!aiSelectedJobId || isAiLoading}
                        className="w-full flex items-center justify-center px-4 py-2 bg-purple-600 text-white font-semibold rounded-md hover:bg-purple-700 disabled:bg-purple-300"
                    >
                        {isAiLoading ? <Loader className="animate-spin w-5 h-5"/> : 'Find Top Matches'}
                    </button>
                     {aiMatchedEngineerIds.length > 0 && (
                        <button onClick={clearAiMatch} className="w-full text-center text-xs text-gray-500 hover:text-red-600 mt-2">
                            Clear AI Match
                        </button>
                    )}
                </div>
            </aside>

            {/* Results */}
            <main className="flex-1 bg-gray-50 overflow-y-auto custom-scrollbar pr-2">
                 <div className="flex flex-col sm:flex-row justify-between items-center mb-4">
                     <p className="text-sm text-gray-600 mb-2 sm:mb-0">Showing {processedEngineers.length} of {engineers.filter(e => e.status === 'active').length} active engineers.</p>
                     <div className="flex items-center gap-2">
                         <label htmlFor="sort" className="text-sm font-medium text-gray-700">Sort by:</label>
                         <select id="sort" name="sort" value={sort} onChange={(e) => setSort(e.target.value)} className="text-sm border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 p-2 bg-white">
                             <option value="relevance">Relevance</option>
                             <option value="name-asc">Name (A-Z)</option>
                             <option value="name-desc">Name (Z-A)</option>
                             <option value="rate-asc">Day Rate (Low-High)</option>
                             <option value="rate-desc">Day Rate (High-Low)</option>
                         </select>
                     </div>
                 </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {processedEngineers.length > 0 ? (
                         processedEngineers.map(eng => <EngineerCard key={eng.id} profile={eng} matchScore={eng.matchScore} onClick={() => onSelectEngineer(eng)} isAiMatch={aiMatchedEngineerIds.includes(eng.id)} />)
                    ) : (
                        <div className="text-center py-10 md:col-span-2 xl:col-span-4">
                            <p className="font-semibold">No engineers match your criteria.</p>
                            <p className="text-sm text-gray-500">Try adjusting your filters.</p>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
};
