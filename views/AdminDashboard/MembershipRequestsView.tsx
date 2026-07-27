import React, { useEffect, useState } from 'react';
import apiService, { type AdminMembershipSelection } from '../../services/apiService';

export const MembershipRequestsView = () => {
    const [selections, setSelections] = useState<AdminMembershipSelection[]>([]);
    const [loading, setLoading] = useState(true);
    const [workingId, setWorkingId] = useState<string | null>(null);
    const [rejectionReasons, setRejectionReasons] = useState<Record<string, string>>({});
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
            const result = await apiService.confirmAdminMembershipSelection(selection.userId);
            setSelections((current) => current.filter((item) => item.userId !== selection.userId));
            setMessage(
                `${selection.name}'s ${selection.requestedTier} membership is now active. ` +
                (result.notificationSent
                    ? 'A confirmation email was sent.'
                    : 'The confirmation email could not be delivered; please contact them directly.')
            );
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Could not activate membership.');
        } finally {
            setWorkingId(null);
        }
    };

    const rejectSelection = async (selection: AdminMembershipSelection) => {
        const reason = rejectionReasons[selection.userId]?.trim() || '';
        if (reason.length < 10) {
            setError('Add a rejection reason of at least 10 characters.');
            return;
        }
        setWorkingId(selection.userId);
        setError('');
        setMessage('');
        try {
            const result = await apiService.rejectAdminMembershipSelection(selection.userId, reason);
            setSelections((current) => current.filter((item) => item.userId !== selection.userId));
            setMessage(
                `${selection.name}'s request was rejected; their ${selection.activeTier} plan remains active. ` +
                (result.notificationSent
                    ? 'A notification email was sent.'
                    : 'The notification email could not be delivered; please contact them directly.')
            );
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Could not reject membership request.');
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
                                <div className="w-full space-y-2 sm:max-w-sm">
                                    <label className="block text-sm font-medium text-gray-700" htmlFor={`rejection-${selection.userId}`}>
                                        Rejection reason
                                    </label>
                                    <textarea
                                        id={`rejection-${selection.userId}`}
                                        rows={2}
                                        maxLength={500}
                                        value={rejectionReasons[selection.userId] || ''}
                                        onChange={(event) => setRejectionReasons((current) => ({
                                            ...current,
                                            [selection.userId]: event.target.value,
                                        }))}
                                        className="w-full rounded-md border border-gray-300 p-2 text-sm"
                                        placeholder="Required only when rejecting"
                                    />
                                    <div className="flex flex-col gap-2 sm:flex-row">
                                        <button
                                            type="button"
                                            disabled={workingId === selection.userId}
                                            onClick={() => confirmSelection(selection)}
                                            className="rounded-md bg-blue-700 px-4 py-2 text-sm font-semibold text-white disabled:opacity-50"
                                        >
                                            {workingId === selection.userId ? 'Working…' : 'Verify billing and activate'}
                                        </button>
                                        <button
                                            type="button"
                                            disabled={workingId === selection.userId}
                                            onClick={() => rejectSelection(selection)}
                                            className="rounded-md border border-red-300 px-4 py-2 text-sm font-semibold text-red-700 hover:bg-red-50 disabled:opacity-50"
                                        >
                                            Reject request
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </section>
                    ))}
                </div>
            )}
        </div>
    );
};
