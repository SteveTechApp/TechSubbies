import React, { useState, useMemo } from 'react';
import { useAppContext } from '../../context/AppContext.tsx';
import { JobCard } from '../../components/JobCard.tsx';
import { Search } from '../../components/Icons.tsx';

export const JobSearchView = () => {
    const { jobs } = useAppContext();
    const [searchTerm, setSearchTerm] = useState('');

    const filteredJobs = useMemo(() => {
        if (!searchTerm) return jobs;
        return jobs.filter(job => 
            job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            job.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
            job.location.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [jobs, searchTerm]);

    return (
        <div>
            <h1 className="text-3xl font-bold mb-4">Job Search</h1>
            <div className="mb-4 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                <input 
                    type="text"
                    placeholder="Search by title, keyword, or location..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full border border-gray-300 rounded-lg p-3 pl-10 focus:ring-2 focus:ring-blue-500"
                />
            </div>
            <div className="space-y-4">
                {filteredJobs.length > 0 ? (
                    filteredJobs.map(job => <JobCard key={job.id} job={job} />)
                ) : (
                    <div className="text-center py-10 bg-white rounded-lg shadow-sm">
                        <p className="font-semibold">No jobs match your search.</p>
                        <p className="text-sm text-gray-500">Try a different keyword.</p>
                    </div>
                )}
            </div>
        </div>
    );
};