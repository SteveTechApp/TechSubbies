import React, { useEffect, useState } from 'react';
import { Home, Search } from '../../components/Icons';
import apiService, { type AdminJob } from '../../services/apiService';

const PAGE_SIZE = 25;

export const JobManagementView = ({ setActiveView }: { setActiveView: (view: string) => void }) => {
    const [jobs, setJobs] = useState<AdminJob[]>([]);
    const [reasons, setReasons] = useState<Record<string, string>>({});
    const [searchInput, setSearchInput] = useState('');
    const [query, setQuery] = useState('');
    const [offset, setOffset] = useState(0);
    const [total, setTotal] = useState(0);
    const [loading, setLoading] = useState(true);
    const [workingId, setWorkingId] = useState<string | null>(null);
    const [error, setError] = useState('');
    const [message, setMessage] = useState('');

    useEffect(() => {
        setLoading(true);
        setError('');
        apiService.listAdminJobs({ limit: PAGE_SIZE, offset, query })
            .then((result) => {
                setJobs(result.jobs);
                setTotal(result.total);
            })
            .catch((reason) => setError(reason instanceof Error ? reason.message : 'Could not load job listings.'))
            .finally(() => setLoading(false));
    }, [offset, query]);

    const updateStatus = async (job: AdminJob) => {
        const closing = job.status === 'active';
        const reason = reasons[job.id]?.trim() || '';
        if (closing && reason.length < 10) {
            setError('Enter a closure reason of at least 10 characters.');
            return;
        }
        setWorkingId(job.id);
        setError('');
        setMessage('');
        try {
            const result = await apiService.moderateAdminJob(job.id, closing ? 'closed' : 'active', reason);
            setJobs((current) => current.map((item) => item.id === job.id ? { ...item, ...result.job } : item));
            setReasons((current) => ({ ...current, [job.id]: '' }));
            const delivery = result.notificationSent ? ' The posting company was notified.' : ' The listing changed, but email delivery failed.';
            setMessage((closing ? 'The listing was closed and removed from public search.' : 'The listing was reopened.') + delivery);
        } catch (reason) {
            setError(reason instanceof Error ? reason.message : 'Could not update job status.');
        } finally {
            setWorkingId(null);
        }
    };

    return (
        <div>
            <div className="mb-6 flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold">Job Management</h1>
                    <p className="mt-1 text-gray-600">Review and moderate real marketplace listings.</p>
                </div>
                <button onClick={() => setActiveView('Dashboard')} className="flex items-center rounded-md bg-blue-700 px-4 py-2 font-semibold text-white">
                    <Home size={18} className="mr-2" />Home
                </button>
            </div>

            {error && <div role="alert" className="mb-4 rounded-md bg-red-50 p-3 text-red-700">{error}</div>}
            {message && <div role="status" className="mb-4 rounded-md bg-green-50 p-3 text-green-800">{message}</div>}

            <form className="mb-5 flex gap-2 rounded-lg border bg-white p-3" onSubmit={(event) => {
                event.preventDefault();
                setOffset(0);
                setQuery(searchInput.trim());
            }}>
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                    <label className="sr-only" htmlFor="admin-job-search">Search job listings</label>
                    <input id="admin-job-search" value={searchInput} maxLength={100} onChange={(event) => setSearchInput(event.target.value)} placeholder="Search title, company, email, or reference" className="w-full rounded-md border p-2 pl-10" />
                </div>
                <button className="rounded-md bg-blue-700 px-4 py-2 font-semibold text-white">Search</button>
                {query && <button type="button" onClick={() => { setSearchInput(''); setQuery(''); setOffset(0); }} className="rounded-md border px-4 py-2">Clear</button>}
            </form>

            {loading ? <p>Loading job listings…</p> : jobs.length === 0 ? (
                <div className="rounded-lg border bg-white p-8 text-center text-gray-600">No jobs match this search.</div>
            ) : (
                <div className="space-y-4">
                    {jobs.map((job) => {
                        const active = job.status === 'active';
                        return (
                            <section key={job.id} className="rounded-lg border bg-white p-5 shadow-sm">
                                <div className="flex flex-col justify-between gap-2 sm:flex-row">
                                    <div>
                                        <h2 className="font-semibold text-gray-900">{job.title}</h2>
                                        <p className="text-sm text-gray-600">{job.companyName} · {job.companyEmail}</p>
                                        <p className="mt-1 text-xs text-gray-500">Reference: {job.id}</p>
                                    </div>
                                    <span className={`h-fit rounded-full px-3 py-1 text-xs font-semibold ${active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>{job.status}</span>
                                </div>
                                <p className="mt-3 text-sm text-gray-600">{job.location} · {job.currency}{job.dayRate}/day</p>
                                {!active && job.moderationReason && <p className="mt-3 rounded-md bg-red-50 p-3 text-sm text-red-800">Closure reason: {job.moderationReason}</p>}
                                {active && (
                                    <>
                                        <label className="mt-3 block text-sm font-medium" htmlFor={`job-reason-${job.id}`}>Closure reason</label>
                                        <textarea id={`job-reason-${job.id}`} rows={2} maxLength={500} value={reasons[job.id] || ''} onChange={(event) => setReasons((current) => ({ ...current, [job.id]: event.target.value }))} className="mt-1 w-full rounded-md border p-2" />
                                    </>
                                )}
                                <button type="button" disabled={workingId === job.id} onClick={() => updateStatus(job)} className={`mt-3 rounded-md px-4 py-2 font-semibold text-white disabled:opacity-40 ${active ? 'bg-red-700' : 'bg-green-700'}`}>
                                    {active ? 'Close listing' : 'Reopen listing'}
                                </button>
                            </section>
                        );
                    })}
                    <nav className="flex items-center justify-between rounded-lg border bg-white p-3" aria-label="Job listing pages">
                        <button disabled={offset === 0} onClick={() => setOffset((value) => Math.max(0, value - PAGE_SIZE))} className="rounded-md border px-3 py-2 disabled:opacity-40">Previous</button>
                        <span className="text-sm text-gray-600">{offset + 1}–{Math.min(offset + jobs.length, total)} of {total}</span>
                        <button disabled={offset + jobs.length >= total} onClick={() => setOffset((value) => value + PAGE_SIZE)} className="rounded-md border px-3 py-2 disabled:opacity-40">Next</button>
                    </nav>
                </div>
            )}
        </div>
    );
};
