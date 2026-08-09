import React, { useEffect, useState } from 'react';
import { taxonomyService, type TaxonomyVersion } from '../../services/taxonomyService';

export const TaxonomyReviewView = () => {
  const [versions, setVersions] = useState<TaxonomyVersion[]>([]);
  const [notes, setNotes] = useState<Record<string, string>>({});
  const [busyId, setBusyId] = useState('');
  const [error, setError] = useState('');

  const load = async () => {
    setError('');
    try {
      setVersions(await taxonomyService.listPendingReviews());
    } catch (loadError: any) {
      setError(loadError?.message || 'Could not load taxonomy reviews.');
    }
  };

  useEffect(() => { void load(); }, []);

  const decide = async (version: TaxonomyVersion, decision: 'approved' | 'rejected') => {
    const note = (notes[version.id] || '').trim();
    if (note.length < 10) {
      setError('Add a practitioner review note of at least 10 characters.');
      return;
    }
    setBusyId(version.id);
    setError('');
    try {
      await taxonomyService.review(version.id, decision, note);
      setVersions(previous => previous.filter(item => item.id !== version.id));
    } catch (reviewError: any) {
      setError(reviewError?.message || 'Could not submit this review.');
    } finally {
      setBusyId('');
    }
  };

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Taxonomy Review</h1>
        <p className="mt-1 text-sm text-gray-600">Review proposed AV/IT role changes as a practitioner. You can approve or reject; only Admin can publish.</p>
      </div>
      {error && <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">{error}</div>}
      {versions.length === 0 && <div className="rounded-xl border bg-white p-6 text-sm text-gray-600 shadow-sm">No taxonomy versions are awaiting practitioner review.</div>}
      {versions.map(version => {
        const skillCount = version.snapshot.skillGroups.reduce((total, group) => total + group.skills.length, 0);
        return (
          <article key={version.id} className="rounded-xl border bg-white p-5 shadow-sm">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">{version.roleId} · version {version.version}</p>
                <h2 className="text-lg font-bold text-gray-900">{version.snapshot.title}</h2>
              </div>
              <span className="rounded-md bg-amber-100 px-2 py-1 text-xs font-semibold text-amber-800">Practitioner review</span>
            </div>
            <p className="mt-3 text-sm text-gray-700">{version.changeNote}</p>
            <div className="mt-4 grid gap-3 sm:grid-cols-3">
              <div className="rounded-lg bg-gray-50 p-3"><p className="text-xs text-gray-500">Market</p><p className="font-semibold">{version.snapshot.market.toUpperCase()}</p></div>
              <div className="rounded-lg bg-gray-50 p-3"><p className="text-xs text-gray-500">Family</p><p className="font-semibold">{version.snapshot.family}</p></div>
              <div className="rounded-lg bg-gray-50 p-3"><p className="text-xs text-gray-500">Skills</p><p className="font-semibold">{skillCount}</p></div>
            </div>
            <p className="mt-4 text-sm text-gray-700">{version.snapshot.summary}</p>
            <label className="mt-4 block text-sm font-medium text-gray-700">Practitioner note
              <textarea value={notes[version.id] || ''} onChange={event => setNotes(previous => ({ ...previous, [version.id]: event.target.value }))} rows={3} className="mt-1 w-full rounded-lg border px-3 py-2" placeholder="Explain why this definition is accurate or what needs changing." />
            </label>
            <div className="mt-4 flex gap-2">
              <button disabled={busyId === version.id} onClick={() => decide(version, 'approved')} className="rounded-lg bg-green-600 px-4 py-2 text-sm font-semibold text-white disabled:opacity-50">Approve</button>
              <button disabled={busyId === version.id} onClick={() => decide(version, 'rejected')} className="rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white disabled:opacity-50">Reject</button>
            </div>
          </article>
        );
      })}
    </div>
  );
};
