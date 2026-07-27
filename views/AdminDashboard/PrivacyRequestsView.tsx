import React, { useEffect, useState } from 'react';
import apiService, { type AdminDeletionRequest } from '../../services/apiService';

export const PrivacyRequestsView = () => {
    const [requests, setRequests] = useState<AdminDeletionRequest[]>([]);
    const [notes, setNotes] = useState<Record<string, string>>({});
    const [loading, setLoading] = useState(true);
    const [workingId, setWorkingId] = useState<string | null>(null);
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    useEffect(() => {
        apiService.listAdminDeletionRequests()
            .then(setRequests)
            .catch((err) => setError(err instanceof Error ? err.message : 'Could not load privacy requests.'))
            .finally(() => setLoading(false));
    }, []);

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
            setMessage(
                decision === 'approved'
                    ? 'Request approved for processing. No data was deleted; complete retention and marketplace checks next.'
                    : 'Request rejected and the decision was recorded.'
            );
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Could not review privacy request.');
        } finally {
            setWorkingId(null);
        }
    };

    return (
        <div>
            <div className="mb-6">
                <h1 className="text-3xl font-bold text-gray-900">Privacy Requests</h1>
                <p className="mt-2 text-gray-600">
                    Review account deletion requests. Approval records readiness for processing; it does not delete
                    the account or bypass retention, payment, or active-contract checks.
                </p>
            </div>

            {error && <div role="alert" className="mb-4 rounded-md bg-red-50 p-3 text-sm text-red-700">{error}</div>}
            {message && <div role="status" className="mb-4 rounded-md bg-green-50 p-3 text-sm text-green-800">{message}</div>}

            {loading ? (
                <p className="text-gray-600">Loading privacy requests…</p>
            ) : requests.length === 0 ? (
                <div className="rounded-lg border bg-white p-8 text-center shadow-sm">
                    <h2 className="text-lg font-semibold text-gray-900">No pending requests</h2>
                    <p className="mt-1 text-sm text-gray-500">New account deletion requests will appear here.</p>
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
                            <label className="mt-4 block text-sm font-medium text-gray-700" htmlFor={`note-${request.id}`}>
                                Review note
                            </label>
                            <textarea
                                id={`note-${request.id}`}
                                rows={3}
                                maxLength={1000}
                                value={notes[request.id] || ''}
                                onChange={(event) => setNotes((current) => ({ ...current, [request.id]: event.target.value }))}
                                placeholder="Record identity, retention, contract, or payment checks…"
                                className="mt-1 w-full rounded-md border border-gray-300 p-2 focus:border-blue-500 focus:ring-blue-500"
                            />
                            <div className="mt-3 flex flex-wrap gap-3">
                                <button
                                    type="button"
                                    disabled={workingId === request.id}
                                    onClick={() => review(request, 'approved')}
                                    className="rounded-md bg-green-600 px-4 py-2 text-sm font-semibold text-white hover:bg-green-700 disabled:opacity-50"
                                >
                                    Approve for processing
                                </button>
                                <button
                                    type="button"
                                    disabled={workingId === request.id}
                                    onClick={() => review(request, 'rejected')}
                                    className="rounded-md bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700 disabled:opacity-50"
                                >
                                    Reject request
                                </button>
                            </div>
                        </section>
                    ))}
                </div>
            )}
        </div>
    );
};
