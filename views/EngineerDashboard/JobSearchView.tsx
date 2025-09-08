
import React, { useState, useMemo } from 'react';
import { useAppContext } from '../../context/AppContext';
import { JobCard } from '../../components/JobCard';
import { Search, DollarSign, ArrowLeft, Layers } from '../../components/Icons';
import { ExperienceLevel, EngineerProfile } from '../../types';
import { LocationAutocomplete } from '../../components/LocationAutocomplete';
import { findLocationsInRegion, getDistance } from '../../utils/locationUtils';

export const JobSearchView = ({ setActiveView }: { setActiveView: (view: string) => void }) => {
    const { user, jobs, isPremium } = useAppContext();
    const [filters, setFilters] = useState({
        keyword: '',
        location: '',
        maxRate: 0,
        experienceLevel: 'any',
        proximitySearch: false,
    });
    
    const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;
        const isCheckbox = type === 'checkbox';
        
        setFilters(prev => ({
            ...prev,
            [name]: isCheckbox ? (e.target as HTMLInputElement).checked : (name === 'maxRate' ? (parseInt(value, 10) || 0) : value),
        }));
    };
    
    const handleLocationChange = (value: string) => {
        setFilters(prev => ({ ...prev, location: value }));
    };

    const filteredJobs = useMemo(() => {
        if (!user) return [];
        const userLocation = user.profile.location;

        return jobs.filter(job => {
            if (job.status !== 'active') return false;

            const keywordMatch = filters.keyword === '' ||
                job.title.toLowerCase().includes(filters.keyword.toLowerCase()) ||
                job.description.toLowerCase().includes(filters.keyword.toLowerCase());

            const locationSearchText = filters.location.trim();
            const jobLocation = job.location;
            let locationMatch = true;
            if (filters.proximitySearch) {
                const distance = getDistance(userLocation, jobLocation);
                locationMatch = distance !== null && distance <= 100;
            } else if (locationSearchText && locationSearchText !== 'Worldwide') {
                const regionLocations = findLocationsInRegion(locationSearchText);
                locationMatch = regionLocations.some(l => jobLocation.toLowerCase().includes(l.toLowerCase()));
            }
            
            const rateMatch = filters.maxRate === 0 || (parseInt(job.dayRate, 10) || 0) <= filters.maxRate;
            
            const levelMatch = filters.experienceLevel === 'any' || job.experienceLevel === filters.experienceLevel;

            return keywordMatch && locationMatch && rateMatch && levelMatch;
        });
    }, [jobs, user, filters]);

    const premiumAccess = user && 'profileTier' in user.profile && isPremium(user.profile as EngineerProfile);
    
    const highPayingJobs = useMemo(() => {
        return filteredJobs.filter(job => (parseInt(job.dayRate, 10) || 0) > 195);
    }, [filteredJobs]);

    return (
        <div>
            <button onClick={() => setActiveView('Dashboard')} className="flex items-center mb-4 px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300">
                <ArrowLeft size={16} className="mr-2" /> Back to Dashboard
            </button>
            <div className="flex flex-col lg:flex-row gap-8 h-[calc(100vh-10rem)]">
                <aside className="w-full lg:w-1/3 xl:w-1/4 bg-white p-6 rounded-lg shadow-md flex-shrink-0">
                    <h2 className="text-xl font-bold mb-4 flex items-center"><Search size={20} className="mr-2"/> Find Work</h2>
                    <div className="space-y-6">
                        <div>
                            <label htmlFor="keyword" className="block text-sm font-medium text-gray-700">Keyword or Skill</label>
                            <input type="text" id="keyword" name="keyword" value={filters.keyword} onChange={handleFilterChange} placeholder="e.g., Crestron, Cisco, AWS" className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm p-2" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Location</label>
                            <LocationAutocomplete value={filters.location} onValueChange={handleLocationChange} />
                            <label className="flex items-center mt-2 text-sm">
                                <input type="checkbox" name="proximitySearch" checked={filters.proximitySearch} onChange={handleFilterChange} className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
                                <span className="ml-2 text-gray-700">Search within 100 miles of my location</span>
                            </label>
                        </div>
                        <div>
                            <label htmlFor="experienceLevel" className="block text-sm font-medium text-gray-700 flex items-center"><Layers size={14} className="mr-1.5"/> Experience Level</label>
                            <select name="experienceLevel" id="experienceLevel" value={filters.experienceLevel} onChange={handleFilterChange} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm p-2 bg-white">
                                <option value="any">Any Level</option>
                                {Object.values(ExperienceLevel).map((level) => <option key={level} value={level}>{level}</option>)}
                            </select>
                        </div>
                        <div>
                            <label htmlFor="maxRate" className="block text-sm font-medium text-gray-700 flex items-center"><DollarSign size={14} className="mr-1.5"/> Max Day Rate: £{filters.maxRate || 'Any'}</label>
                            <input type="range" id="maxRate" name="maxRate" min="0" max="1200" step="25" value={filters.maxRate} onChange={handleFilterChange} className="mt-1 block w-full" />
                        </div>
                    </div>
                </aside>

                <main className="flex-1 bg-gray-50 overflow-y-auto custom-scrollbar pr-2">
                     {!premiumAccess && highPayingJobs.length > 0 && (
                        <div className="p-3 bg-yellow-50 border border-yellow-200 text-yellow-800 rounded-md mb-4 text-sm">
                            <strong>Heads up!</strong> {highPayingJobs.length} job(s) in your search offer a day rate above £195. To be more competitive, consider upgrading to a <button onClick={() => setActiveView('Billing')} className="font-bold underline hover:text-yellow-900">Gold Profile</button> or get a <button onClick={() => alert('Open Payment Modal')} className="font-bold underline hover:text-yellow-900">12-Hour Premium Pass</button>.
                        </div>
                    )}
                    <p className="text-sm text-gray-600 mb-4">Showing {filteredJobs.length} of {jobs.filter(j => j.status === 'active').length} available contracts.</p>
                    <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                        {filteredJobs.length > 0 ? (
                            filteredJobs.map(job => <JobCard key={job.id} job={job} setActiveView={setActiveView} />)
                        ) : (
                            <div className="text-center py-10 bg-white rounded-lg shadow-sm col-span-full">
                                <p className="font-semibold">No contracts match your search.</p>
                                <p className="text-sm text-gray-500">Try adjusting your filters.</p>
                            </div>
                        )}
                    </div>
                </main>
            </div>
        </div>
    );
};