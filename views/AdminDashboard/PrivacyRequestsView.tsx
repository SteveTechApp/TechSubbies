import React, { useEffect, useState } from 'react';
import apiService, { type AdminDeletionRequest } from '../../services/apiService';

type QueueStatus = 'pending' | 'approved';

export const PrivacyRequestsView = () => {
    const [requests, setRequests] = useState<AdminDeletionRequest[]>([]);
    const [notes, setNotes] = useState<Record<string, string>>({});
    const [confirmations, setConfirmations] = useState<Record<string, string>>({});
    const [status, setStatus] = useState<QueueStatus>('pending');
    const [loading, setLoading] = useState(true);
    const [workingId, setWorkingId] = useState<string | null>(null);
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    useEffect(() => {
        setLoading(true);
        setError('');
        apiService.listAdminDeletionRequests(status)
            .then(setRequests)
            .catch((err) => setError(err instanceof Error ? err.message : 'Could not load privacy requests.'))
            .finally(() => setLoading(false));
    }, [status]);

    const review = async (request: AdminDeletionRequest, decision: 'approved' | 'rejected') => {
        const note = notes[request.id]?.trim() || '';
        if (note.length < 10) {
            setError('Add a review note of at least 10 characters before deciding.');
            return;
        }
        setWorkingId(request.id);
        setError('');
        setMessage('');
        try {
            await apiService.reviewAdminDeletionRequest(request.id, decision, note);
            setRequests((current) => current.filter((item) => item.id !== request.id));
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

            <div className="mb-5 flex gap-2 border-b" aria-label="Privacy request status">
                {(['pending', 'approved'] as const).map((option) => (
                    <button
                        key={option}
                        type="button"
                        onClick={() => setStatus(option)}
                        className={`border-b-2 px-4 py-2 text-sm font-semibold ${
                            status === option ? 'border-blue-600 text-blue-700' : 'border-transparent text-gray-500'
                        }`}
                    >
                        {option === 'pending' ? 'Pending review' : 'Approved for processing'}
                    </button>
                ))}
            </div>

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
                            : 'Approved requests awaiting anonymisation will appear here.'}
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

                            {status === 'pending' ? (
                                <>
                                    <label className="mt-4 block text-sm font-medium text-gray-700" htmlFor={`note-${request.id}`}>
                                        Review note
                                    </label>
                                    <textarea
                                        id={`note-${request.id}`}
                                        rows={3}
                                        maxLength={1000}
                                        value={notes[request.id] || ''}
                                        onChange={(event) => setNotes((current) => ({ ...current, [request.id]: event.target.value }))}
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
                                        Review note: {request.resolutionNote || 'No note recorded'}
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
                </div>
            )}
        </div>
    );
};
