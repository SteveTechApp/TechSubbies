import React, { useEffect, useMemo, useState } from 'react';
import {
    listAdminContractSupportCases,
    resolveAdminContractSupportCase,
    type ContractSupportCase,
} from '../../services/contractSupportService';

const TYPE_LABELS: Record<ContractSupportCase['caseType'], string> = {
    cancellation: 'Cancellation',
    substitution: 'Substitution',
    no_show: 'No-show',
    dispute: 'Dispute',
    support: 'Support',
};

export const ContractSupportView = () => {
    const [cases, setCases] = useState<ContractSupportCase[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [message, setMessage] = useState('');
    const [workingId, setWorkingId] = useState<string | null>(null);
    const [resolutions, setResolutions] = useState<Record<string, string>>({});
    const [filter, setFilter] = useState<'open' | 'all'>('open');

    const reload = async () => {
        try {
            setCases(await listAdminContractSupportCases());
            setError('');
        } catch (reason) {
            setError(reason instanceof Error ? reason.message : 'Could not load support cases.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        void reload();
    }, []);

    const visible = useMemo(
        () => filter === 'all' ? cases : cases.filter((item) => !['resolved', 'withdrawn'].includes(item.status)),
        [cases, filter]
    );

    const resolve = async (supportCase: ContractSupportCase) => {
        const resolution = resolutions[supportCase.id]?.trim() || '';
        if (resolution.length < 10) {
            setError('Add a resolution note of at least 10 characters.');
            return;
        }
        setWorkingId(supportCase.id);
        setError('');
        setMessage('');
        try {
            await resolveAdminContractSupportCase(supportCase.id, resolution);
            setMessage(`Case ${supportCase.id} resolved and both contract parties notified.`);
            await reload();
        } catch (reason) {
            setError(reason instanceof Error ? reason.message : 'Could not resolve the support case.');
        } finally {
            setWorkingId(null);
        }
    };

    return (
        <div>
            <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Contract Support</h1>
                    <p className="mt-1 text-sm text-gray-600">
                        Coordinate cancellations, substitutions, no-shows and disputes. TechSubbies records the workflow but does not decide project-payment liability.
                    </p>
                </div>
                <div className="flex gap-2">
                    <button type="button" onClick={() => setFilter('open')} className={`rounded-md px-3 py-2 text-sm font-semibold ${filter === 'open' ? 'bg-slate-800 text-white' : 'bg-gray-100 text-gray-700'}`}>Open cases</button>
                    <button type="button" onClick={() => setFilter('all')} className={`rounded-md px-3 py-2 text-sm font-semibold ${filter === 'all' ? 'bg-slate-800 text-white' : 'bg-gray-100 text-gray-700'}`}>All cases</button>
                </div>
            </div>

            {error && <div role="alert" className="mb-4 rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-700">{error}</div>}
            {message && <div role="status" className="mb-4 rounded-md border border-green-200 bg-green-50 p-3 text-sm text-green-800">{message}</div>}

            {loading ? (
                <p className="text-sm text-gray-500">Loading contract support cases…</p>
            ) : visible.length === 0 ? (
                <div className="rounded-lg border bg-white p-8 text-center shadow-sm">
                    <h2 className="font-semibold text-gray-900">No support cases in this view</h2>
                    <p className="mt-1 text-sm text-gray-500">New contract issues will appear here.</p>
                </div>
            ) : (
                <div className="space-y-4">
                    {visible.map((supportCase) => (
                        <section key={supportCase.id} className="rounded-lg border bg-white p-5 shadow-sm">
                            <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
                                <div className="min-w-0 flex-1">
                                    <div className="flex flex-wrap items-center gap-2">
                                        <span className="rounded-md bg-blue-50 px-2 py-1 text-xs font-bold text-blue-700">{TYPE_LABELS[supportCase.caseType]}</span>
                                        <span className="rounded-md bg-gray-100 px-2 py-1 text-xs font-semibold text-gray-700">{supportCase.status.replaceAll('_', ' ')}</span>
                                    </div>
                                    <h2 className="mt-2 text-lg font-semibold text-gray-900">{supportCase.summary}</h2>
                                    <p className="mt-1 text-sm text-gray-600">{supportCase.details}</p>
                                    <dl className="mt-3 grid gap-2 text-xs text-gray-600 sm:grid-cols-2">
                                        <div><dt className="font-semibold">Contract</dt><dd>{supportCase.contractId}</dd></div>
                                        <div><dt className="font-semibold">Opened by</dt><dd>{supportCase.openedByName}</dd></div>
                                        <div><dt className="font-semibold">Other party</dt><dd>{supportCase.counterpartyName}</dd></div>
                                        <div><dt className="font-semibold">Opened</dt><dd>{new Date(supportCase.createdAt).toLocaleString()}</dd></div>
                                    </dl>
                                    {supportCase.resolution && (
                                        <div className="mt-3 rounded-md border border-green-200 bg-green-50 p-3 text-sm text-green-900">
                                            <strong>Resolution:</strong> {supportCase.resolution}
                                        </div>
                                    )}
                                </div>

                                {!['resolved', 'withdrawn'].includes(supportCase.status) && (
                                    <div className="w-full lg:max-w-md">
                                        <label className="block text-sm font-semibold text-gray-800">
                                            Resolution / support outcome
                                            <textarea
                                                rows={4}
                                                maxLength={2000}
                                                value={resolutions[supportCase.id] || ''}
                                                onChange={(event) => setResolutions((current) => ({ ...current, [supportCase.id]: event.target.value }))}
                                                className="mt-1 w-full rounded-md border border-gray-300 p-2"
                                                placeholder="Record what TechSubbies coordinated or what the parties agreed"
                                            />
                                        </label>
                                        <button
                                            type="button"
                                            disabled={workingId === supportCase.id}
                                            onClick={() => resolve(supportCase)}
                                            className="mt-2 w-full rounded-md bg-green-700 px-4 py-2 text-sm font-semibold text-white disabled:opacity-50"
                                        >
                                            {workingId === supportCase.id ? 'Resolving…' : 'Resolve case'}
                                        </button>
                                    </div>
                                )}
                            </div>
                        </section>
                    ))}
                </div>
            )}
        </div>
    );
};
