import React, { useMemo, useState } from 'react';
import { useData } from '../../context/DataContext';
import { ApplicationStatus, EngineerProfile } from '../../types';
import {
    ApplicationPipelineFilter,
    applicationPipelineFilters,
    getApplicationPipelineCounts,
    matchesApplicationPipeline,
} from '../../utils/applicationPipeline';
import { Briefcase, MapPin, Search } from '../../components/Icons';

interface ApplicationsViewProps {
    engineerProfile: EngineerProfile;
    setActiveView: (view: string) => void;
}

const statusGuidance: Partial<Record<ApplicationStatus, string>> = {
    [ApplicationStatus.APPLIED]: 'Your application has been submitted.',
    [ApplicationStatus.VIEWED]: 'The company has reviewed your application.',
    [ApplicationStatus.OFFERED]: 'You have progressed to an offer. Check contracts and messages for next steps.',
    [ApplicationStatus.HIRED]: 'You have been selected for this opportunity.',
    [ApplicationStatus.REJECTED]: 'This opportunity did not progress, but your profile remains available.',
    [ApplicationStatus.COMPLETED]: 'This engagement has been completed.',
};

export const ApplicationsView = ({ engineerProfile, setActiveView }: ApplicationsViewProps) => {
    const { applications, companies, jobs } = useData();
    const [filter, setFilter] = useState<ApplicationPipelineFilter>('all');
    const [query, setQuery] = useState('');

    const myApplications = useMemo(
        () => applications
            .filter(application => application.engineerId === engineerProfile.id)
            .sort((a, b) => b.date.getTime() - a.date.getTime()),
        [applications, engineerProfile.id]
    );
    const counts = useMemo(() => getApplicationPipelineCounts(myApplications), [myApplications]);
    const visibleApplications = useMemo(() => {
        const normalizedQuery = query.trim().toLowerCase();
        return myApplications.filter(application => {
            if (!matchesApplicationPipeline(application.status, filter)) return false;
            const job = jobs.find(item => item.id === application.jobId);
            const company = job ? companies.find(item => item.id === job.companyId) : undefined;
            return !normalizedQuery || [
                application.jobTitle,
                application.jobLocation,
                application.companyName,
                job?.title,
                job?.location,
                company?.name,
            ].filter(Boolean).some(value => String(value).toLowerCase().includes(normalizedQuery));
        });
    }, [companies, filter, jobs, myApplications, query]);

    return (
        <div>
            <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                <div>
                    <h1 className="text-3xl font-bold">My Applications</h1>
                    <p className="mt-1 text-gray-600">Track every opportunity from application through engagement.</p>
                </div>
                <button onClick={() => setActiveView('Job Search')} className="rounded-md bg-blue-600 px-4 py-2 font-semibold text-white hover:bg-blue-700">
                    Find more work
                </button>
            </div>

            <div className="mb-6 rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
                <label className="relative block">
                    <span className="sr-only">Search applications</span>
                    <Search className="pointer-events-none absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                    <input
                        type="search"
                        value={query}
                        onChange={event => setQuery(event.target.value)}
                        placeholder="Search jobs, companies or locations"
                        className="w-full rounded-md border border-gray-300 py-2 pl-10 pr-3 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
                    />
                </label>
                <div className="mt-3 flex flex-wrap gap-2" aria-label="Application status filters">
                    {applicationPipelineFilters.map(item => (
                        <button
                            key={item.id}
                            type="button"
                            onClick={() => setFilter(item.id)}
                            aria-pressed={filter === item.id}
                            className={`rounded-full px-3 py-1.5 text-sm font-semibold ${
                                filter === item.id ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                            }`}
                        >
                            {item.label} ({counts[item.id]})
                        </button>
                    ))}
                </div>
            </div>

            <div className="space-y-4">
                {visibleApplications.map(application => {
                    const job = jobs.find(item => item.id === application.jobId);
                    const company = job ? companies.find(item => item.id === job.companyId) : undefined;
                    const statusClasses = application.status === ApplicationStatus.HIRED || application.status === ApplicationStatus.COMPLETED
                        ? 'bg-green-100 text-green-800'
                        : application.status === ApplicationStatus.OFFERED
                            ? 'bg-blue-100 text-blue-800'
                            : application.status === ApplicationStatus.REJECTED
                                ? 'bg-red-100 text-red-800'
                                : 'bg-gray-100 text-gray-700';
                    return (
                        <article key={application.id || application.jobId} className="rounded-lg border border-gray-200 bg-white p-5 shadow-sm">
                            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                                <div>
                                    <h2 className="flex items-center gap-2 text-lg font-bold text-gray-900">
                                        <Briefcase className="h-5 w-5 text-blue-600" />
                                        {application.jobTitle || job?.title || 'Technical opportunity'}
                                    </h2>
                                    <p className="mt-1 font-medium text-gray-600">
                                        {application.companyName || company?.name || 'TechSubbies client'}
                                    </p>
                                    {(application.jobLocation || job?.location) && (
                                        <p className="mt-1 flex items-center gap-1 text-sm text-gray-500">
                                            <MapPin className="h-4 w-4" />
                                            {application.jobLocation || job?.location}
                                        </p>
                                    )}
                                </div>
                                <span className={`w-fit rounded-full px-3 py-1 text-xs font-bold ${statusClasses}`}>
                                    {application.status}
                                </span>
                            </div>
                            <div className="mt-4 border-t border-gray-100 pt-4">
                                <p className="text-sm text-gray-700">{statusGuidance[application.status]}</p>
                                <p className="mt-1 text-xs text-gray-500">Applied {application.date.toLocaleDateString()}</p>
                                {(application.status === ApplicationStatus.OFFERED || application.status === ApplicationStatus.HIRED) && (
                                    <div className="mt-3 flex flex-wrap gap-2">
                                        <button onClick={() => setActiveView('Contracts')} className="rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white hover:bg-blue-700">
                                            View contracts
                                        </button>
                                        <button onClick={() => setActiveView('Messages')} className="rounded-md border border-gray-300 px-3 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50">
                                            Open messages
                                        </button>
                                    </div>
                                )}
                            </div>
                        </article>
                    );
                })}
            </div>

            {visibleApplications.length === 0 && (
                <div className="rounded-lg border border-dashed border-gray-300 bg-white p-10 text-center">
                    <Briefcase className="mx-auto h-10 w-10 text-gray-400" />
                    <h2 className="mt-3 font-bold text-gray-900">
                        {myApplications.length ? 'No applications match these filters' : 'No applications yet'}
                    </h2>
                    <p className="mt-1 text-sm text-gray-600">Adjust your filters or explore current technical opportunities.</p>
                </div>
            )}
        </div>
    );
};
