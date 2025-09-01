import React, { useState, useMemo } from 'react';
import { useAppContext } from '../../context/AppContext.tsx';
import { JobCard } from '../../components/JobCard.tsx';
import { Search, MapPin, DollarSign, ArrowLeft, Briefcase, Layers } from '../../components/Icons.tsx';
import { JobType, ExperienceLevel, ProfileTier } from '../../types/index.ts';


export const JobSearchView = ({ setActiveView }: { setActiveView: (view: string) => void }) => {
    const { user, jobs } = useAppContext();
    const [filters, setFilters] = useState({
        keyword: '',
        location: '',
        maxRate: 1200,
        jobType: 'any',
        experienceLevel: 'any',
    });
    
    const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFilters(prev => ({...prev, [name]: name === 'maxRate' ? parseInt(value) : value }));
    };

    const filteredJobs = useMemo(() => {
        return jobs.filter(job => {
            if (job.status !== 'active') return false;

            const keywordMatch = filters.keyword.toLowerCase() === '' ||
                job.title.toLowerCase().includes(filters.keyword.toLowerCase()) ||
                job.description.toLowerCase().includes(filters.keyword.toLowerCase());

            const locationMatch = filters.location.toLowerCase() === '' ||
                job.location.toLowerCase().includes(filters.location.toLowerCase());
            
            const rateMatch = parseInt(job.dayRate) <= filters.maxRate;
            
            const typeMatch = filters.jobType === 'any' || job.jobType === filters.jobType;
            
            const levelMatch = filters.experienceLevel === 'any' || job.experienceLevel === filters.experienceLevel;

            return keywordMatch && locationMatch && rateMatch && typeMatch && levelMatch;
        });
    }, [jobs, filters]);

    const isFreeTier = user && 'profileTier' in user.profile && user.profile.profileTier === ProfileTier.BASIC;
    const highPayingJobs = useMemo(() => {
        return filteredJobs.filter(job => parseInt(job.dayRate) > 195);
    }, [filteredJobs]);

    return (
        <div>
            <button 
                onClick={() => setActiveView('Dashboard')} 
                className="flex items-center mb-4 px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300"
            >
                <ArrowLeft size={16} className="mr-2" />
                Back to Dashboard
            </button>
            <div className="flex flex-col lg:flex-row gap-8 h-[calc(100vh-10rem)]">
                {/* Filters Sidebar */}
                <aside className="w-full lg:w-1/3 xl:w-1/4 bg-white p-6 rounded-lg shadow-md flex-shrink-0">
                    <h2 className="text-xl font-bold mb-4 flex items-center"><Search size={20} className="mr-2"/> Find Work</h2>
                    <div className="space-y-6">
                        <div>
                            <label htmlFor="keyword" className="block text-sm font-medium text-gray-700">Keyword or Skill</label>
                            <input type="text" id="keyword" name="keyword" value={filters.keyword} onChange={handleFilterChange} placeholder="e.g., Crestron, Cisco, AWS" className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm p-2" />
                        </div>
                        <div>
                            <label htmlFor="location" className="block text-sm font-medium text-gray-700 flex items-center"><MapPin size={14} className="mr-1.5"/> Location</label>
                            <input type="text" id="location" name="location" value={filters.location} onChange={handleFilterChange} placeholder="e.g., London, Remote" className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm p-2" />
                        </div>
                        <div>
                            <label htmlFor="jobType" className="block text-sm font-medium text-gray-700 flex items-center"><Briefcase size={14} className="mr-1.5"/> Job Type</label>
                            <select name="jobType" id="jobType" value={filters.jobType} onChange={handleFilterChange} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm p-2 bg-white">
                                <option value="any">Any Type</option>
                                {Object.values(JobType).map(type => <option key={type} value={type}>{type}</option>)}
                            </select>
                        </div>
                        <div>
                            <label htmlFor="experienceLevel" className="block text-sm font-medium text-gray-700 flex items-center"><Layers size={14} className="mr-1.5"/> Experience Level</label>
                            <select name="experienceLevel" id="experienceLevel" value={filters.experienceLevel} onChange={handleFilterChange} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm p-2 bg-white">
                                <option value="any">Any Level</option>
                                {Object.values(ExperienceLevel).map(level => <option key={level} value={level}>{level}</option>)}
                            </select>
                        </div>
                        <div>
                            <label htmlFor="maxRate" className="block text-sm font-medium text-gray-700 flex items-center"><DollarSign size={14} className="mr-1.5"/> Max Day Rate: £{filters.maxRate}</label>
                            <input type="range" id="maxRate" name="maxRate" min="200" max="1200" step="25" value={filters.maxRate} onChange={handleFilterChange} className="mt-1 block w-full" />
                        </div>
                    </div>
                </aside>

                {/* Job Results */}
                <main className="flex-1 bg-gray-50 overflow-y-auto custom-scrollbar pr-2">
                     {isFreeTier && highPayingJobs.length > 0 && (
                        <div className="p-3 bg-yellow-50 border border-yellow-200 text-yellow-800 rounded-md mb-4 text-sm">
                            <strong>Heads up!</strong> {highPayingJobs.length} job(s) in your search offer a day rate above £195. To be more competitive for these high-value roles, consider upgrading to a <button onClick={() => setActiveView('Billing')} className="font-bold underline hover:text-yellow-900">Skills Profile</button>.
                        </div>
                    )}
                    <p className="text-sm text-gray-600 mb-4">Showing {filteredJobs.length} of {jobs.filter(j => j.status === 'active').length} available jobs.</p>
                    <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                        {filteredJobs.length > 0 ? (
                            filteredJobs.map(job => <JobCard key={job.id} job={job} setActiveView={setActiveView} />)
                        ) : (
                            <div className="text-center py-10 bg-white rounded-lg shadow-sm col-span-full">
                                <p className="font-semibold">No jobs match your search.</p>
                                <p className="text-sm text-gray-500">Try adjusting your filters.</p>
                            </div>
                        )}
                    </div>
                </main>
            </div>
        </div>
    );
};
