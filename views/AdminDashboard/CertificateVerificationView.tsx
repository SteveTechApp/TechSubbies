import React, { useEffect, useState } from 'react';
import {
  downloadEvidence,
  listAdminCertificates,
  reviewCertificate,
  runExpiryReminderSweep,
  type AdminCertificateQueueItem,
  type CertificateVerificationStatus,
} from '../../services/certificateService';

export const CertificateVerificationView = () => {
  const [status, setStatus] = useState<CertificateVerificationStatus>('pending');
  const [items, setItems] = useState<AdminCertificateQueueItem[]>([]);
  const [notes, setNotes] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [workingId, setWorkingId] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  const load = async (nextStatus = status) => {
    setLoading(true);
    try {
      setItems(await listAdminCertificates(nextStatus));
      setError('');
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : 'Could not load certificate verification queue.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { void load(status); }, [status]);

  const review = async (item: AdminCertificateQueueItem, next: 'verified' | 'rejected') => {
    const note = (notes[item.id] || '').trim();
    if (next === 'rejected' && note.length < 10) {
      setError('Enter a rejection reason of at least 10 characters.');
      return;
    }
    setWorkingId(item.id);
    setError('');
    setMessage('');
    try {
      const result = await reviewCertificate(item.id, next, note);
      setMessage(`${item.name} ${next === 'verified' ? 'verified' : 'rejected'}${result.notificationSent ? ' and the engineer was notified.' : '.'}`);
      await load(status);
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : 'Could not review certificate.');
    } finally {
      setWorkingId('');
    }
  };

  const runReminders = async () => {
    setError('');
    setMessage('');
    try {
      const result = await runExpiryReminderSweep();
      setMessage(`Expiry reminder sweep complete: ${result.sent} sent from ${result.due} due reminder${result.due === 1 ? '' : 's'}.`);
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : 'Could not run expiry reminders.');
    }
  };

  return (
    <div className="space-y-5">
      <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Certificate Verification</h1>
          <p className="mt-1 text-sm text-gray-500">Review engineer certificate evidence, verification state and marketplace visibility.</p>
        </div>
        <button type="button" onClick={() => void runReminders()} className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50">
          Run expiry reminders
        </button>
      </div>

      {error && <div role="alert" className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-800">{error}</div>}
      {message && <div className="rounded-lg border border-green-200 bg-green-50 p-4 text-sm text-green-800">{message}</div>}

      <div className="flex flex-wrap gap-2">
        {(['pending', 'verified', 'rejected'] as CertificateVerificationStatus[]).map((option) => (
          <button
            key={option}
            type="button"
            onClick={() => setStatus(option)}
            className={`rounded-md px-4 py-2 text-sm font-semibold ${status === option ? 'bg-gray-900 text-white' : 'border border-gray-300 bg-white text-gray-700 hover:bg-gray-50'}`}
          >
            {option[0].toUpperCase() + option.slice(1)}
          </button>
        ))}
      </div>

      <section className="rounded-lg bg-white p-5 shadow">
        {loading ? <p className="text-sm text-gray-500">Loading certificate queue…</p> : items.length === 0 ? (
          <p className="text-sm text-gray-500">No {status} certificates.</p>
        ) : (
          <div className="space-y-4">
            {items.map((item) => (
              <article key={item.id} className="rounded-lg border border-gray-200 p-4">
                <div className="grid gap-4 lg:grid-cols-[1fr_260px]">
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <h2 className="font-semibold text-gray-900">{item.name}</h2>
                      <span className="rounded bg-gray-100 px-2 py-1 text-xs font-semibold text-gray-700">{item.visibility}</span>
                    </div>
                    <dl className="mt-3 grid gap-x-5 gap-y-2 text-sm sm:grid-cols-2">
                      <div><dt className="text-gray-500">Engineer</dt><dd className="font-medium text-gray-900">{item.ownerName}</dd></div>
                      <div><dt className="text-gray-500">Email</dt><dd className="font-medium text-gray-900">{item.ownerEmail}</dd></div>
                      <div><dt className="text-gray-500">Issuer</dt><dd className="font-medium text-gray-900">{item.issuer}</dd></div>
                      <div><dt className="text-gray-500">Certificate no.</dt><dd className="font-medium text-gray-900">{item.certificateNumber || 'Not supplied'}</dd></div>
                      <div><dt className="text-gray-500">Issued</dt><dd className="font-medium text-gray-900">{item.issuedAt ? new Date(item.issuedAt).toLocaleDateString('en-GB') : 'Not supplied'}</dd></div>
                      <div><dt className="text-gray-500">Expires</dt><dd className="font-medium text-gray-900">{item.expiresAt ? new Date(item.expiresAt).toLocaleDateString('en-GB') : 'No expiry supplied'}</dd></div>
                    </dl>
                    {item.reviewNote && <p className="mt-3 rounded-md bg-gray-50 px-3 py-2 text-sm text-gray-700">Review note: {item.reviewNote}</p>}
                  </div>

                  <div className="space-y-3">
                    <button type="button" onClick={() => void downloadEvidence(item.evidenceId, item.evidenceFileName)} className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50">
                      Download evidence
                    </button>
                    {status === 'pending' && (
                      <>
                        <textarea
                          aria-label={`Review note for ${item.name}`}
                          value={notes[item.id] || ''}
                          onChange={(e) => setNotes((current) => ({ ...current, [item.id]: e.target.value }))}
                          rows={4}
                          className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
                          placeholder="Optional verification note; required for rejection"
                        />
                        <div className="grid grid-cols-2 gap-2">
                          <button disabled={workingId === item.id} type="button" onClick={() => void review(item, 'verified')} className="rounded-md bg-green-700 px-3 py-2 text-sm font-semibold text-white hover:bg-green-800 disabled:opacity-50">Verify</button>
                          <button disabled={workingId === item.id} type="button" onClick={() => void review(item, 'rejected')} className="rounded-md bg-red-700 px-3 py-2 text-sm font-semibold text-white hover:bg-red-800 disabled:opacity-50">Reject</button>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};
