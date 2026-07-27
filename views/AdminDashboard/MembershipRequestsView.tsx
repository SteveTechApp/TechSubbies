import React, { useEffect, useState } from 'react';
import apiService, { type AdminMembershipSelection } from '../../services/apiService';

export const MembershipRequestsView = () => {
    const [selections, setSelections] = useState<AdminMembershipSelection[]>([]);
    const [loading, setLoading] = useState(true);
    const [workingId, setWorkingId] = useState<string | null>(null);
    const [error, setError] = useState('');
    const [message, setMessage] = useState('');

    useEffect(() => {
        apiService.listAdminMembershipSelections()
            .then(setSelections)
            .catch((err) => setError(err instanceof Error ? err.message : 'Could not load membership requests.'))
            .finally(() => setLoading(false));
    }, []);

    const confirmSelection = async (selection: AdminMembershipSelection) => {
        const confirmed = window.confirm(
            `Confirm that external billing has been verified for ${selection.name}. ` +
            `This will activate their ${selection.requestedTier} membership.`
        );
        if (!confirmed) return;

        setWorkingId(selection.userId);
        setError('');
        setMessage('');
        try {
            await apiService.confirmAdminMembershipSelection(selection.userId);
            setSelections((current) => current.filter((item) => item.userId !== selection.userId));
            setMessage(`${selection.name}'s ${selection.requestedTier} membership is now active.`);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Could not activate membership.');
        } finally {
            setWorkingId(null);
        }
    };

    return (
        <div>
            <div className="mb-6">
                <h1 className="text-3xl font-bold text-gray-900">Membership Requests</h1>
                <p className="mt-2 text-gray-600">
                    Activate selected plans only after the membership payment has been verified externally.
                </p>
            </div>

            <div className="mb-5 rounded-lg border border-blue-200 bg-blue-50 p-4 text-sm text-blue-900">
                TechSubbies charges membership fees only. Engineer engagements, invoices and fees remain directly
                managed between engineers and companies.
            </div>

            {error && <div role="alert" className="mb-4 rounded-md bg-red-50 p-3 text-sm text-red-700">{error}</div>}
            {message && <div role="status" className="mb-4 rounded-md bg-green-50 p-3 text-sm text-green-800">{message}</div>}

            {loading ? (
                <p className="text-gray-600">Loading membership requests…</p>
            ) : selections.length === 0 ? (
                <div className="rounded-lg border bg-white p-8 text-center shadow-sm">
                    <h2 className="text-lg font-semibold text-gray-900">No membership requests awaiting verification</h2>
                    <p className="mt-1 text-sm text-gray-500">New plan selections will appear here.</p>
                </div>
            ) : (
                <div className="space-y-4">
                    {selections.map((selection) => (
                        <section key={selection.userId} className="rounded-lg border bg-white p-5 shadow-sm">
                            <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                                <div>
                                    <h2 className="font-semibold text-gray-900">{selection.name}</h2>
                                    <p className="text-sm text-gray-600">{selection.email}</p>
                                    <p className="mt-2 text-sm text-gray-700">
                                        <span className="font-medium">{selection.activeTier}</span>
                                        <span aria-hidden="true"> → </span>
                                        <span className="font-semibold text-blue-700">{selection.requestedTier}</span>
                                    </p>
                                    <p className="mt-1 text-xs text-gray-500">
                                        Selected {new Date(selection.requestedAt).toLocaleString()}
                                    </p>
                                </div>
                                <button
                                    type="button"
                                    disabled={workingId === selection.userId}
                                    onClick={() => confirmSelection(selection)}
                                    className="rounded-md bg-blue-700 px-4 py-2 text-sm font-semibold text-white disabled:opacity-50"
                                >
                                    {workingId === selection.userId ? 'Activating…' : 'Verify billing and activate'}
                                </button>
                            </div>
                        </section>
                    ))}
                </div>
            )}
        </div>
    );
};
