import React, { useState, useMemo } from 'react';
import { useData } from '../../context/DataContext';
import { useAuth } from '../../context/AuthContext';
import { Job } from '../../types';
import { JobCard } from '../../components/JobCard';
import { Search } from '../../components/Icons';

interface JobSearchViewProps {
    setActiveView: (view: string) => void;
}

export const JobSearchView = ({ setActiveView }: JobSearchViewProps) => {
    const { jobs } = useData();
    const { user } = useAuth();
    const [searchTerm, setSearchTerm] = useState('');

    const filteredJobs = useMemo(() => {
        return jobs.filter(job =>
            job.status === 'active' &&
            (job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
             job.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
             job.location.toLowerCase().includes(searchTerm.toLowerCase()))
        );
    }, [jobs, searchTerm]);

    return (
        <div>
            <h1 className="text-3xl font-bold mb-4">Find Your Next Contract</h1>
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
                    filteredJobs.map(job => (
                        <JobCard key={job.id} job={job} setActiveView={setActiveView} />
                    ))
                ) : (
                    <p className="text-center text-gray-500 py-8">No jobs found matching your criteria.</p>
                )}
            </div>
        </div>
    );
};