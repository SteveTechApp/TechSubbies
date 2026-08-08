import React, { useEffect, useState } from 'react';
import {
    createContractSupportCase,
    listContractSupportCases,
    respondToContractSupportCase,
    withdrawContractSupportCase,
    type ContractSupportCase,
    type ContractSupportCaseType,
} from '../services/contractSupportService';

const CASE_LABELS: Record<ContractSupportCaseType, string> = {
    cancellation: 'Request cancellation',
    substitution: 'Request substitute / replacement',
    no_show: 'Report a no-show',
    dispute: 'Raise a dispute',
    support: 'Request support',
};

const STATUS_LABELS: Record<ContractSupportCase['status'], string> = {
    awaiting_other_party: 'Awaiting other party',
    under_review: 'TechSubbies review',
    resolved: 'Resolved',
    withdrawn: 'Withdrawn',
};

export const ContractSupportPanel = ({ contractId, currentUserId }: { contractId: string; currentUserId: string }) => {
    const [cases, setCases] = useState<ContractSupportCase[]>([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [caseType, setCaseType] = useState<ContractSupportCaseType>('support');
    const [summary, setSummary] = useState('');
    const [details, setDetails] = useState('');
    const [responseNotes, setResponseNotes] = useState<Record<string, string>>({});
    const [workingId, setWorkingId] = useState<string | null>(null);
    const [error, setError] = useState('');
    const [message, setMessage] = useState('');

    const reload = async () => {
        try {
            setCases(await listContractSupportCases(contractId));
            setError('');
        } catch (reason) {
            setError(reason instanceof Error ? reason.message : 'Could not load contract support cases.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        void reload();
    }, [contractId]);

    const submitCase = async () => {
        if (summary.trim().length < 5 || details.trim().length < 10) {
            setError('Add a short summary and at least 10 characters of detail.');
            return;
        }
        setWorkingId('new');
        setError('');
        setMessage('');
        try {
            await createContractSupportCase({
                contractId,
                caseType,
                summary: summary.trim(),
                details: details.trim(),
            });
            setSummary('');
            setDetails('');
            setShowForm(false);
            setMessage('Support case opened. The other party has been notified where a response is required.');
            await reload();
        } catch (reason) {
            setError(reason instanceof Error ? reason.message : 'Could not open the support case.');
        } finally {
            setWorkingId(null);
        }
    };

    const respond = async (supportCase: ContractSupportCase, decision: 'accept' | 'decline') => {
        const note = responseNotes[supportCase.id]?.trim() || '';
        if (note.length < 5) {
            setError('Add a short response note before accepting or declining.');
            return;
        }
        setWorkingId(supportCase.id);
        setError('');
        setMessage('');
        try {
            await respondToContractSupportCase(supportCase.id, decision, note);
            setMessage(
                supportCase.caseType === 'cancellation' && decision === 'accept'
                    ? 'Cancellation agreed and recorded. Any invoicing or financial settlement remains directly between the parties.'
                    : 'Your response has been recorded.'
            );
            await reload();
        } catch (reason) {
            setError(reason instanceof Error ? reason.message : 'Could not update the support case.');
        } finally {
            setWorkingId(null);
        }
    };

    const withdraw = async (supportCase: ContractSupportCase) => {
        setWorkingId(supportCase.id);
        setError('');
        try {
            await withdrawContractSupportCase(supportCase.id, 'Withdrawn from the contract support panel.');
            setMessage('Support case withdrawn.');
            await reload();
        } catch (reason) {
            setError(reason instanceof Error ? reason.message : 'Could not withdraw the support case.');
        } finally {
            setWorkingId(null);
        }
    };

    return (
        <section className="mt-6 border-t pt-6" aria-labelledby="contract-support-title">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div>
                    <h3 id="contract-support-title" className="text-lg font-bold text-gray-900">Contract Support</h3>
                    <p className="mt-1 max-w-3xl text-sm text-gray-600">
                        Record cancellations, substitution requests, no-shows, disputes or other support issues. TechSubbies can coordinate the case, but does not hold project funds or decide payment liability.
                    </p>
                </div>
                <button
                    type="button"
                    onClick={() => setShowForm((value) => !value)}
                    className="rounded-md bg-slate-800 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-900"
                >
                    {showForm ? 'Close form' : 'Report / request support'}
                </button>
            </div>

            {error && <div role="alert" className="mt-4 rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-700">{error}</div>}
            {message && <div role="status" className="mt-4 rounded-md border border-green-200 bg-green-50 p-3 text-sm text-green-800">{message}</div>}

            {showForm && (
                <div className="mt-4 grid gap-3 rounded-lg border border-gray-200 bg-gray-50 p-4">
                    <label className="text-sm font-semibold text-gray-800">
                        Issue type
                        <select
                            value={caseType}
                            onChange={(event) => setCaseType(event.target.value as ContractSupportCaseType)}
                            className="mt-1 w-full rounded-md border border-gray-300 bg-white p-2"
                        >
                            {Object.entries(CASE_LABELS).map(([value, label]) => <option key={value} value={value}>{label}</option>)}
                        </select>
                    </label>
                    <label className="text-sm font-semibold text-gray-800">
                        Summary
                        <input
                            value={summary}
                            onChange={(event) => setSummary(event.target.value)}
                            maxLength={120}
                            className="mt-1 w-full rounded-md border border-gray-300 bg-white p-2"
                            placeholder="Briefly describe what has happened"
                        />
                    </label>
                    <label className="text-sm font-semibold text-gray-800">
                        Details
                        <textarea
                            value={details}
                            onChange={(event) => setDetails(event.target.value)}
                            rows={4}
                            maxLength={2000}
                            className="mt-1 w-full rounded-md border border-gray-300 bg-white p-2"
                            placeholder="Include dates, agreed arrangements and what you need to happen next"
                        />
                    </label>
                    {caseType === 'substitution' && (
                        <p className="rounded-md border border-blue-200 bg-blue-50 p-3 text-xs text-blue-800">
                            A substitution request does not replace the signed contractor automatically. TechSubbies support will coordinate the next step; a replacement must be contracted and signed separately.
                        </p>
                    )}
                    <div className="flex justify-end">
                        <button
                            type="button"
                            disabled={workingId === 'new'}
                            onClick={submitCase}
                            className="rounded-md bg-blue-700 px-5 py-2 text-sm font-semibold text-white disabled:opacity-50"
                        >
                            {workingId === 'new' ? 'Opening…' : 'Open support case'}
                        </button>
                    </div>
                </div>
            )}

            <div className="mt-4 space-y-3">
                {loading ? (
                    <p className="text-sm text-gray-500">Loading support cases…</p>
                ) : cases.length === 0 ? (
                    <p className="rounded-md bg-gray-50 p-3 text-sm text-gray-500">No support cases recorded for this contract.</p>
                ) : cases.map((supportCase) => {
                    const needsMyResponse = supportCase.status === 'awaiting_other_party' && supportCase.counterpartyId === currentUserId;
                    const canWithdraw = supportCase.openedById === currentUserId && !['resolved', 'withdrawn'].includes(supportCase.status);
                    return (
                        <article key={supportCase.id} className="rounded-lg border border-gray-200 bg-white p-4">
                            <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                                <div>
                                    <p className="text-xs font-bold uppercase tracking-wide text-blue-700">{CASE_LABELS[supportCase.caseType]}</p>
                                    <h4 className="mt-1 font-semibold text-gray-900">{supportCase.summary}</h4>
                                    <p className="mt-1 text-sm text-gray-600">{supportCase.details}</p>
                                    <p className="mt-2 text-xs text-gray-500">Opened by {supportCase.openedByName} · {new Date(supportCase.createdAt).toLocaleString()}</p>
                                </div>
                                <span className="rounded-md bg-gray-100 px-2 py-1 text-xs font-semibold text-gray-700">{STATUS_LABELS[supportCase.status]}</span>
                            </div>

                            {supportCase.resolution && (
                                <div className="mt-3 rounded-md border border-green-200 bg-green-50 p-3 text-sm text-green-900">
                                    <strong>Resolution:</strong> {supportCase.resolution}
                                </div>
                            )}

                            {needsMyResponse && (
                                <div className="mt-3 rounded-md border border-amber-200 bg-amber-50 p-3">
                                    <label className="text-sm font-semibold text-amber-950">
                                        Your response to {supportCase.openedByName}
                                        <textarea
                                            rows={2}
                                            value={responseNotes[supportCase.id] || ''}
                                            onChange={(event) => setResponseNotes((current) => ({ ...current, [supportCase.id]: event.target.value }))}
                                            className="mt-1 w-full rounded-md border border-amber-300 bg-white p-2 text-gray-900"
                                        />
                                    </label>
                                    <div className="mt-2 flex gap-2">
                                        <button type="button" disabled={workingId === supportCase.id} onClick={() => respond(supportCase, 'accept')} className="rounded-md bg-green-700 px-3 py-2 text-sm font-semibold text-white disabled:opacity-50">Accept</button>
                                        <button type="button" disabled={workingId === supportCase.id} onClick={() => respond(supportCase, 'decline')} className="rounded-md border border-red-300 px-3 py-2 text-sm font-semibold text-red-700 disabled:opacity-50">Decline / request review</button>
                                    </div>
                                </div>
                            )}

                            {canWithdraw && (
                                <div className="mt-3 flex justify-end">
                                    <button type="button" disabled={workingId === supportCase.id} onClick={() => withdraw(supportCase)} className="text-sm font-semibold text-gray-600 hover:text-gray-900 disabled:opacity-50">Withdraw case</button>
                                </div>
                            )}
                        </article>
                    );
                })}
            </div>
        </section>
    );
};
