import React, { useEffect, useState } from 'react';
import apiService, { type AdminDeletionRequest, type AdminPrivacySummary } from '../../services/apiService';

type QueueStatus = 'pending' | 'approved' | 'processed';
const PAGE_SIZE = 20;

export const PrivacyRequestsView = () => {
    const [requests, setRequests] = useState<AdminDeletionRequest[]>([]);
    const [notes, setNotes] = useState<Record<string, string>>({});
    const [userMessages, setUserMessages] = useState<Record<string, string>>({});
    const [confirmations, setConfirmations] = useState<Record<string, string>>({});
    const [status, setStatus] = useState<QueueStatus>('pending');
    const [searchInput, setSearchInput] = useState('');
    const [query, setQuery] = useState('');
    const [offset, setOffset] = useState(0);
    const [total, setTotal] = useState(0);
    const [summary, setSummary] = useState<AdminPrivacySummary | null>(null);
    const [loading, setLoading] = useState(true);
    const [workingId, setWorkingId] = useState<string | null>(null);
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    useEffect(() => {
        setLoading(true);
        setError('');
        apiService.listAdminDeletionRequests(status, { limit: PAGE_SIZE, offset, query })
            .then((result) => {
                setRequests(result.requests);
                setTotal(result.total);
            })
            .catch((err) => setError(err instanceof Error ? err.message : 'Could not load privacy requests.'))
            .finally(() => setLoading(false));
    }, [status, offset, query]);

    useEffect(() => {
        apiService.getAdminPrivacySummary().then(setSummary).catch(() => undefined);
    }, [requests]);

    const review = async (request: AdminDeletionRequest, decision: 'approved' | 'rejected') => {
        const note = notes[request.id]?.trim() || '';
        const userMessage = userMessages[request.id]?.trim() || '';
        if (note.length < 10 || userMessage.length < 10) {
            setError('Add both internal and user-facing notes of at least 10 characters before deciding.');
            return;
        }
        setWorkingId(request.id);
        setError('');
        setMessage('');
        try {
            await apiService.reviewAdminDeletionRequest(request.id, decision, note, userMessage);
            setRequests((current) => current.filter((item) => item.id !== request.id));
            setTotal((current) => Math.max(0, current - 1));
            setMessage(decision === 'approved'
                ? 'Request approved for processing. No account data has been changed yet.'
                : 'Request rejected and the decision was recorded.');
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Could not review privacy request.');
        } finally {
            setWorkingId(null);
        }
    };

    const processRequest = async (request: AdminDeletionRequest) => {
        const confirmation = confirmations[request.id] || '';
        if (confirmation !== 'ANONYMISE ACCOUNT') {
            setError('Type ANONYMISE ACCOUNT exactly before final processing.');
            return;
        }
        setWorkingId(request.id);
        setError('');
        setMessage('');
        try {
            await apiService.processAdminDeletionRequest(request.id, confirmation);
            setRequests((current) => current.filter((item) => item.id !== request.id));
            setTotal((current) => Math.max(0, current - 1));
            setMessage('Identity and authentication data were anonymised; transaction references were retained.');
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Could not process privacy request.');
        } finally {
            setWorkingId(null);
        }
    };

    return (
        <div>
            <div className="mb-6">
                <h1 className="text-3xl font-bold text-gray-900">Privacy Requests</h1>
                <p className="mt-2 text-gray-600">
                    Review account deletion requests, resolve marketplace obligations, then process approved accounts.
                </p>
            </div>

            {summary && (
                <div className="mb-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
                    {[
                        ['Pending', summary.pending],
                        ['Approved', summary.approved],
                        ['Processed', summary.processed],
                        ['Rejected', summary.rejected],
                        ['Over 28 days', summary.overduePending],
                    ].map(([label, value]) => (
                        <div key={label} className="rounded-lg border bg-white p-4 shadow-sm">
                            <p className="text-sm text-gray-500">{label}</p>
                            <p className="mt-1 text-2xl font-bold text-gray-900">{value}</p>
                        </div>
                    ))}
                </div>
            )}

            <div className="mb-5 flex gap-2 border-b" aria-label="Privacy request status">
                {(['pending', 'approved', 'processed'] as const).map((option) => (
                    <button
                        key={option}
                        type="button"
                        onClick={() => { setStatus(option); setOffset(0); }}
                        className={`border-b-2 px-4 py-2 text-sm font-semibold ${
                            status === option ? 'border-blue-600 text-blue-700' : 'border-transparent text-gray-500'
                        }`}
                    >
                        {option === 'pending'
                            ? 'Pending review'
                            : option === 'approved' ? 'Approved for processing' : 'Processed history'}
                    </button>
                ))}
            </div>

            <form
                className="mb-5 flex flex-col gap-2 sm:flex-row"
                onSubmit={(event) => {
                    event.preventDefault();
                    setOffset(0);
                    setQuery(searchInput.trim());
                }}
            >
                <label className="sr-only" htmlFor="privacy-search">Search privacy requests</label>
                <input
                    id="privacy-search"
                    value={searchInput}
                    onChange={(event) => setSearchInput(event.target.value)}
                    placeholder="Search name, email, or reference"
                    maxLength={100}
                    className="flex-1 rounded-md border border-gray-300 px-3 py-2"
                />
                <button type="submit" className="rounded-md bg-blue-700 px-4 py-2 font-semibold text-white">
                    Search
                </button>
                {query && (
                    <button
                        type="button"
                        onClick={() => { setSearchInput(''); setQuery(''); setOffset(0); }}
                        className="rounded-md border border-gray-300 px-4 py-2 font-semibold text-gray-700"
                    >
                        Clear
                    </button>
                )}
            </form>

            {error && <div role="alert" className="mb-4 rounded-md bg-red-50 p-3 text-sm text-red-700">{error}</div>}
            {message && <div role="status" className="mb-4 rounded-md bg-green-50 p-3 text-sm text-green-800">{message}</div>}

            {loading ? (
                <p className="text-gray-600">Loading privacy requests…</p>
            ) : requests.length === 0 ? (
                <div className="rounded-lg border bg-white p-8 text-center shadow-sm">
                    <h2 className="text-lg font-semibold text-gray-900">No {status} requests</h2>
                    <p className="mt-1 text-sm text-gray-500">
                        {status === 'pending'
                            ? 'New account deletion requests will appear here.'
                            : status === 'approved'
                                ? 'Approved requests awaiting anonymisation will appear here.'
                                : 'Completed anonymisation operations will appear here.'}
                    </p>
                </div>
            ) : (
                <div className="space-y-4">
                    {requests.map((request) => (
                        <section key={request.id} className="rounded-lg border bg-white p-5 shadow-sm">
                            <div className="flex flex-col justify-between gap-2 sm:flex-row">
                                <div>
                                    <h2 className="font-semibold text-gray-900">{request.accountName}</h2>
                                    <p className="text-sm text-gray-600">{request.accountEmail} · {request.accountRole}</p>
                                </div>
                                <p className="text-sm text-gray-500">
                                    Requested {new Date(request.requestedAt).toLocaleString()}
                                </p>
                            </div>
                            <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs text-gray-500">
                                <span>Reference: {request.id}</span>
                                <span className={new Date(request.responseDueAt) < new Date() && request.status === 'pending' ? 'font-semibold text-red-700' : ''}>
                                    Response target: {new Date(request.responseDueAt).toLocaleDateString()}
                                </span>
                            </div>

                            {!request.eligibility.eligible && (
                                <div className="mt-3 rounded-md bg-amber-50 p-3 text-sm text-amber-900">
                                    <p className="font-semibold">Unresolved obligations:</p>
                                    <ul className="mt-1 list-disc pl-5">
                                        {request.eligibility.blockers.map((blocker) => (
                                            <li key={blocker.code}>{blocker.message}</li>
                                        ))}
                                    </ul>
                                </div>
                            )}

                            {status === 'processed' ? (
                                <div className="mt-4 rounded-md bg-gray-50 p-3 text-sm text-gray-700">
                                    Processed {request.processedAt ? new Date(request.processedAt).toLocaleString() : 'date unavailable'}.
                                    Identity and authentication data were anonymised; transaction references were retained.
                                </div>
                            ) : status === 'pending' ? (
                                <>
                                    <label className="mt-4 block text-sm font-medium text-gray-700" htmlFor={`note-${request.id}`}>
                                        Internal audit note
                                    </label>
                                    <textarea
                                        id={`note-${request.id}`}
                                        rows={3}
                                        maxLength={1000}
                                        value={notes[request.id] || ''}
                                        onChange={(event) => setNotes((current) => ({ ...current, [request.id]: event.target.value }))}
                                        className="mt-1 w-full rounded-md border border-gray-300 p-2"
                                    />
                                    <label className="mt-4 block text-sm font-medium text-gray-700" htmlFor={`user-message-${request.id}`}>
                                        Explanation shown to the account holder
                                    </label>
                                    <textarea
                                        id={`user-message-${request.id}`}
                                        rows={3}
                                        maxLength={1000}
                                        value={userMessages[request.id] || ''}
                                        onChange={(event) => setUserMessages((current) => ({ ...current, [request.id]: event.target.value }))}
                                        className="mt-1 w-full rounded-md border border-gray-300 p-2"
                                    />
                                    <div className="mt-3 flex flex-wrap gap-3">
                                        <button
                                            type="button"
                                            disabled={workingId === request.id || !request.eligibility.eligible}
                                            onClick={() => review(request, 'approved')}
                                            className="rounded-md bg-green-600 px-4 py-2 text-sm font-semibold text-white disabled:opacity-50"
                                        >
                                            Approve for processing
                                        </button>
                                        <button
                                            type="button"
                                            disabled={workingId === request.id}
                                            onClick={() => review(request, 'rejected')}
                                            className="rounded-md bg-red-600 px-4 py-2 text-sm font-semibold text-white disabled:opacity-50"
                                        >
                                            Reject request
                                        </button>
                                    </div>
                                </>
                            ) : (
                                <>
                                    <p className="mt-4 text-sm text-gray-600">
                                        Internal review note: {request.resolutionNote || 'No note recorded'}
                                    </p>
                                    <p className="mt-1 text-sm text-gray-600">
                                        User explanation: {request.userMessage || 'No explanation recorded'}
                                    </p>
                                    <label className="mt-3 block text-sm font-medium text-gray-700" htmlFor={`confirmation-${request.id}`}>
                                        Type <strong>ANONYMISE ACCOUNT</strong> to confirm
                                    </label>
                                    <input
                                        id={`confirmation-${request.id}`}
                                        value={confirmations[request.id] || ''}
                                        onChange={(event) => setConfirmations((current) => ({
                                            ...current,
                                            [request.id]: event.target.value,
                                        }))}
                                        className="mt-1 w-full rounded-md border border-gray-300 p-2"
                                    />
                                    <button
                                        type="button"
                                        disabled={workingId === request.id || confirmations[request.id] !== 'ANONYMISE ACCOUNT'}
                                        onClick={() => processRequest(request)}
                                        className="mt-3 rounded-md bg-red-700 px-4 py-2 text-sm font-semibold text-white disabled:opacity-50"
                                    >
                                        Anonymise account
                                    </button>
                                </>
                            )}
                        </section>
                    ))}
                    <nav className="flex items-center justify-between rounded-lg border bg-white p-3" aria-label="Privacy request pages">
                        <button
                            type="button"
                            disabled={offset === 0}
                            onClick={() => setOffset((current) => Math.max(0, current - PAGE_SIZE))}
                            className="rounded-md border px-3 py-2 text-sm font-semibold disabled:opacity-40"
                        >
                            Previous
                        </button>
                        <span className="text-sm text-gray-600">
                            {offset + 1}–{Math.min(offset + requests.length, total)} of {total}
                        </span>
                        <button
                            type="button"
                            disabled={offset + requests.length >= total}
                            onClick={() => setOffset((current) => current + PAGE_SIZE)}
                            className="rounded-md border px-3 py-2 text-sm font-semibold disabled:opacity-40"
                        >
                            Next
                        </button>
                    </nav>
                </div>
            )}
        </div>
    );
};
