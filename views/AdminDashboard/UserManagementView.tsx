import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import apiService, { type AdminUserAccount } from '../../services/apiService';
import { Search } from '../../components/Icons';

const PAGE_SIZE = 25;

export const UserManagementView = () => {
    const { user: currentUser } = useAuth();
    const [accounts, setAccounts] = useState<AdminUserAccount[]>([]);
    const [reasons, setReasons] = useState<Record<string, string>>({});
    const [searchInput, setSearchInput] = useState('');
    const [query, setQuery] = useState('');
    const [offset, setOffset] = useState(0);
    const [total, setTotal] = useState(0);
    const [workingId, setWorkingId] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [message, setMessage] = useState('');

    useEffect(() => {
        setLoading(true);
        setError('');
        apiService.listAdminUsers({ limit: PAGE_SIZE, offset, query })
            .then((result) => {
                setAccounts(result.users);
                setTotal(result.total);
            })
            .catch((reason) => setError(reason instanceof Error ? reason.message : 'Could not load user accounts.'))
            .finally(() => setLoading(false));
    }, [offset, query]);

    const updateSuspension = async (account: AdminUserAccount) => {
        const suspending = !account.suspendedAt;
        const reason = reasons[account.id]?.trim() || '';
        if (suspending && reason.length < 10) {
            setError('Enter a suspension reason of at least 10 characters.');
            return;
        }
        setWorkingId(account.id);
        setError('');
        setMessage('');
        try {
            const result = await apiService.setAdminUserSuspension(account.id, suspending, reason);
            setAccounts((current) => current.map((item) => item.id === account.id ? { ...item, ...result.user } : item));
            setReasons((current) => ({ ...current, [account.id]: '' }));
            const delivery = result.notificationSent ? ' A notification email was sent.' : ' The account changed, but email delivery failed.';
            setMessage((suspending
                ? `${account.name} was suspended and all sessions were revoked.`
                : `${account.name} was reactivated. They must sign in again.`) + delivery);
        } catch (reason) {
            setError(reason instanceof Error ? reason.message : 'Could not update account status.');
        } finally {
            setWorkingId(null);
        }
    };

    return (
        <div>
            <h1 className="text-3xl font-bold mb-2">User Management</h1>
            <p className="mb-6 text-gray-600">Search real accounts and enforce marketplace access decisions.</p>

            {error && <div role="alert" className="mb-4 rounded-md bg-red-50 p-3 text-red-700">{error}</div>}
            {message && <div role="status" className="mb-4 rounded-md bg-green-50 p-3 text-green-800">{message}</div>}

            <form
                className="mb-5 flex flex-col gap-2 rounded-lg border bg-white p-3 shadow-sm sm:flex-row"
                onSubmit={(event) => {
                    event.preventDefault();
                    setOffset(0);
                    setQuery(searchInput.trim());
                }}
            >
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                    <label className="sr-only" htmlFor="admin-user-search">Search accounts</label>
                    <input
                        id="admin-user-search"
                        value={searchInput}
                        maxLength={100}
                        onChange={(event) => setSearchInput(event.target.value)}
                        placeholder="Search by account name or email"
                        className="w-full rounded-md border border-gray-300 p-2 pl-10"
                    />
                </div>
                <button className="rounded-md bg-blue-700 px-4 py-2 font-semibold text-white">Search</button>
                {query && <button type="button" onClick={() => { setSearchInput(''); setQuery(''); setOffset(0); }} className="rounded-md border px-4 py-2">Clear</button>}
            </form>

            {loading ? <p>Loading user accounts…</p> : accounts.length === 0 ? (
                <div className="rounded-lg border bg-white p-8 text-center text-gray-600">No accounts match this search.</div>
            ) : (
                <div className="space-y-4">
                    {accounts.map((account) => {
                        const suspended = Boolean(account.suspendedAt);
                        const isSelf = account.id === currentUser?.id;
                        return (
                            <section key={account.id} className="rounded-lg border bg-white p-5 shadow-sm">
                                <div className="flex flex-col justify-between gap-2 sm:flex-row">
                                    <div>
                                        <h2 className="font-semibold text-gray-900">{account.name}</h2>
                                        <p className="text-sm text-gray-600">{account.email} · {account.role}</p>
                                    </div>
                                    <span className={`h-fit rounded-full px-3 py-1 text-xs font-semibold ${suspended ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'}`}>
                                        {suspended ? 'Suspended' : 'Active'}
                                    </span>
                                </div>
                                {suspended && account.suspensionReason && (
                                    <p className="mt-3 rounded-md bg-red-50 p-3 text-sm text-red-800">Reason: {account.suspensionReason}</p>
                                )}
                                {!suspended && !isSelf && (
                                    <>
                                        <label className="mt-3 block text-sm font-medium text-gray-700" htmlFor={`reason-${account.id}`}>Suspension reason</label>
                                        <textarea
                                            id={`reason-${account.id}`}
                                            rows={2}
                                            maxLength={500}
                                            value={reasons[account.id] || ''}
                                            onChange={(event) => setReasons((current) => ({ ...current, [account.id]: event.target.value }))}
                                            className="mt-1 w-full rounded-md border border-gray-300 p-2"
                                        />
                                    </>
                                )}
                                <button
                                    type="button"
                                    disabled={isSelf || workingId === account.id}
                                    onClick={() => updateSuspension(account)}
                                    className={`mt-3 rounded-md px-4 py-2 font-semibold text-white disabled:opacity-40 ${suspended ? 'bg-green-700' : 'bg-red-700'}`}
                                >
                                    {isSelf ? 'Current administrator' : suspended ? 'Reactivate account' : 'Suspend account'}
                                </button>
                            </section>
                        );
                    })}
                    <nav className="flex items-center justify-between rounded-lg border bg-white p-3" aria-label="User account pages">
                        <button disabled={offset === 0} onClick={() => setOffset((value) => Math.max(0, value - PAGE_SIZE))} className="rounded-md border px-3 py-2 disabled:opacity-40">Previous</button>
                        <span className="text-sm text-gray-600">{offset + 1}–{Math.min(offset + accounts.length, total)} of {total}</span>
                        <button disabled={offset + accounts.length >= total} onClick={() => setOffset((value) => value + PAGE_SIZE)} className="rounded-md border px-3 py-2 disabled:opacity-40">Next</button>
                    </nav>
                </div>
            )}
        </div>
    );
};
