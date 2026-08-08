import React, { useEffect, useMemo, useState } from 'react';
import { canonicalRoleRegistry } from '../../data/canonicalRoleRegistry';
import type { RoleSkillDefinition } from '../../types/roleSkills';
import { taxonomyService, type TaxonomyVersion } from '../../services/taxonomyService';

const OPEN_STATUSES = new Set(['draft', 'in_review', 'approved']);

const statusClass = (status: string) => {
  if (status === 'published') return 'bg-green-100 text-green-800';
  if (status === 'approved') return 'bg-emerald-100 text-emerald-800';
  if (status === 'rejected') return 'bg-red-100 text-red-800';
  if (status === 'in_review') return 'bg-amber-100 text-amber-800';
  if (status === 'superseded') return 'bg-gray-100 text-gray-600';
  return 'bg-blue-100 text-blue-800';
};

const splitLines = (value: string) => value.split('\n').map(item => item.trim()).filter(Boolean);
const splitTags = (value: string) => value.split(',').map(item => item.trim()).filter(Boolean);

export const TaxonomyEditorView = () => {
  const [selectedRoleId, setSelectedRoleId] = useState(canonicalRoleRegistry[0]?.id || '');
  const [versions, setVersions] = useState<TaxonomyVersion[]>([]);
  const [editor, setEditor] = useState<RoleSkillDefinition | null>(null);
  const [changeNote, setChangeNote] = useState('');
  const [skillGroupsJson, setSkillGroupsJson] = useState('[]');
  const [search, setSearch] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');

  const baseRole = useMemo(
    () => canonicalRoleRegistry.find(role => role.id === selectedRoleId) || null,
    [selectedRoleId]
  );
  const published = versions.find(version => version.status === 'published');
  const openVersion = versions.find(version => OPEN_STATUSES.has(version.status));
  const currentSource = openVersion?.snapshot || published?.snapshot || baseRole;
  const canEdit = openVersion?.status === 'draft';

  const filteredRoles = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return canonicalRoleRegistry;
    return canonicalRoleRegistry.filter(role =>
      role.title.toLowerCase().includes(query)
      || role.family.toLowerCase().includes(query)
      || role.market.toLowerCase().includes(query)
    );
  }, [search]);

  const loadVersions = async (roleId: string) => {
    setError('');
    try {
      setVersions(await taxonomyService.listVersions(roleId));
    } catch (loadError: any) {
      setError(loadError?.message || 'Could not load taxonomy versions.');
      setVersions([]);
    }
  };

  useEffect(() => {
    if (selectedRoleId) void loadVersions(selectedRoleId);
  }, [selectedRoleId]);

  useEffect(() => {
    if (!currentSource) return;
    setEditor(structuredClone(currentSource));
    setSkillGroupsJson(JSON.stringify(currentSource.skillGroups, null, 2));
    setChangeNote(openVersion?.status === 'draft' ? openVersion.changeNote : '');
  }, [selectedRoleId, openVersion?.id, published?.id]);

  const buildSnapshot = (): RoleSkillDefinition | null => {
    if (!editor) return null;
    try {
      const skillGroups = JSON.parse(skillGroupsJson);
      if (!Array.isArray(skillGroups) || skillGroups.length === 0) {
        throw new Error('At least one skill group is required.');
      }
      return { ...editor, skillGroups } as RoleSkillDefinition;
    } catch (parseError: any) {
      setError(parseError?.message || 'Skill groups must be valid JSON.');
      return null;
    }
  };

  const run = async (action: () => Promise<unknown>, success: string) => {
    setBusy(true);
    setError('');
    setNotice('');
    try {
      await action();
      await loadVersions(selectedRoleId);
      setNotice(success);
    } catch (actionError: any) {
      setError(actionError?.message || 'Taxonomy update failed.');
    } finally {
      setBusy(false);
    }
  };

  const createDraft = async () => {
    const snapshot = buildSnapshot();
    if (!snapshot) return;
    await run(
      () => taxonomyService.createDraft({ roleId: selectedRoleId, snapshot, changeNote }),
      'Draft version created.'
    );
  };

  const saveDraft = async () => {
    if (!openVersion || openVersion.status !== 'draft') return;
    const snapshot = buildSnapshot();
    if (!snapshot) return;
    await run(
      () => taxonomyService.updateDraft(openVersion.id, { snapshot, changeNote }),
      'Draft saved.'
    );
  };

  const submitDraft = async () => {
    if (!openVersion || openVersion.status !== 'draft') return;
    const snapshot = buildSnapshot();
    if (!snapshot) return;
    setBusy(true);
    setError('');
    try {
      await taxonomyService.updateDraft(openVersion.id, { snapshot, changeNote });
      await taxonomyService.submitForReview(openVersion.id);
      await loadVersions(selectedRoleId);
      setNotice('Submitted for practitioner review. The draft is now locked.');
    } catch (actionError: any) {
      setError(actionError?.message || 'Could not submit this version.');
    } finally {
      setBusy(false);
    }
  };

  const publishApproved = async () => {
    if (!openVersion || openVersion.status !== 'approved') return;
    await run(
      () => taxonomyService.publish(openVersion.id),
      'Approved taxonomy version published.'
    );
  };

  if (!editor) return <div className="p-6">Loading taxonomy…</div>;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Role Taxonomy</h1>
        <p className="mt-1 text-sm text-gray-600">
          Propose controlled changes to canonical AV/IT roles. Drafts do not affect matching; practitioner approval and an explicit publish step are required.
        </p>
      </div>

      {error && <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">{error}</div>}
      {notice && <div className="rounded-lg border border-green-200 bg-green-50 p-3 text-sm text-green-700">{notice}</div>}

      <div className="grid gap-6 xl:grid-cols-[300px_minmax(0,1fr)]">
        <aside className="rounded-xl border bg-white p-4 shadow-sm">
          <label className="text-sm font-semibold text-gray-700">Find role</label>
          <input
            value={search}
            onChange={event => setSearch(event.target.value)}
            placeholder="Role, family or market"
            className="mt-2 w-full rounded-lg border px-3 py-2 text-sm"
          />
          <div className="mt-3 max-h-[65vh] space-y-1 overflow-y-auto pr-1">
            {filteredRoles.map(role => (
              <button
                key={role.id}
                type="button"
                onClick={() => setSelectedRoleId(role.id)}
                className={`w-full rounded-lg px-3 py-2 text-left text-sm ${selectedRoleId === role.id ? 'bg-blue-50 text-blue-800' : 'hover:bg-gray-50'}`}
              >
                <span className="block font-semibold">{role.title}</span>
                <span className="text-xs text-gray-500">{role.market.toUpperCase()} · {role.family}</span>
              </button>
            ))}
          </div>
        </aside>

        <section className="space-y-5 rounded-xl border bg-white p-5 shadow-sm">
          <div className="flex flex-wrap items-start justify-between gap-3 border-b pb-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">{selectedRoleId}</p>
              <h2 className="text-xl font-bold text-gray-900">{editor.title}</h2>
              <p className="mt-1 text-sm text-gray-500">
                Source: {published ? `published v${published.version}` : 'source-controlled baseline'}
              </p>
            </div>
            {openVersion && (
              <span className={`rounded-md px-2 py-1 text-xs font-semibold ${statusClass(openVersion.status)}`}>
                v{openVersion.version} · {openVersion.status.replace('_', ' ')}
              </span>
            )}
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <label className="text-sm font-medium text-gray-700">Title
              <input disabled={!canEdit && Boolean(openVersion)} value={editor.title} onChange={e => setEditor({ ...editor, title: e.target.value })} className="mt-1 w-full rounded-lg border px-3 py-2 disabled:bg-gray-50" />
            </label>
            <label className="text-sm font-medium text-gray-700">Short title
              <input disabled={!canEdit && Boolean(openVersion)} value={editor.shortTitle} onChange={e => setEditor({ ...editor, shortTitle: e.target.value })} className="mt-1 w-full rounded-lg border px-3 py-2 disabled:bg-gray-50" />
            </label>
            <label className="text-sm font-medium text-gray-700">Family
              <input disabled={!canEdit && Boolean(openVersion)} value={editor.family} onChange={e => setEditor({ ...editor, family: e.target.value as any })} className="mt-1 w-full rounded-lg border px-3 py-2 disabled:bg-gray-50" />
            </label>
            <label className="text-sm font-medium text-gray-700">Level
              <select disabled={!canEdit && Boolean(openVersion)} value={editor.level} onChange={e => setEditor({ ...editor, level: e.target.value as RoleSkillDefinition['level'] })} className="mt-1 w-full rounded-lg border px-3 py-2 disabled:bg-gray-50">
                <option value="entry">Entry</option><option value="skilled">Skilled</option><option value="specialist">Specialist</option><option value="lead">Lead</option>
              </select>
            </label>
          </div>

          <label className="block text-sm font-medium text-gray-700">Summary
            <textarea disabled={!canEdit && Boolean(openVersion)} rows={4} value={editor.summary} onChange={e => setEditor({ ...editor, summary: e.target.value })} className="mt-1 w-full rounded-lg border px-3 py-2 disabled:bg-gray-50" />
          </label>

          <div className="grid gap-4 md:grid-cols-2">
            <label className="text-sm font-medium text-gray-700">Suitable for — one per line
              <textarea disabled={!canEdit && Boolean(openVersion)} rows={5} value={editor.suitableFor.join('\n')} onChange={e => setEditor({ ...editor, suitableFor: splitLines(e.target.value) })} className="mt-1 w-full rounded-lg border px-3 py-2 disabled:bg-gray-50" />
            </label>
            <label className="text-sm font-medium text-gray-700">Typical projects — one per line
              <textarea disabled={!canEdit && Boolean(openVersion)} rows={5} value={editor.typicalProjects.join('\n')} onChange={e => setEditor({ ...editor, typicalProjects: splitLines(e.target.value) })} className="mt-1 w-full rounded-lg border px-3 py-2 disabled:bg-gray-50" />
            </label>
            <label className="text-sm font-medium text-gray-700">Recommended tags — comma separated
              <textarea disabled={!canEdit && Boolean(openVersion)} rows={3} value={editor.recommendedTags.join(', ')} onChange={e => setEditor({ ...editor, recommendedTags: splitTags(e.target.value) })} className="mt-1 w-full rounded-lg border px-3 py-2 disabled:bg-gray-50" />
            </label>
            <label className="text-sm font-medium text-gray-700">Evidence types — comma separated
              <textarea disabled={!canEdit && Boolean(openVersion)} rows={3} value={editor.evidenceTypes.join(', ')} onChange={e => setEditor({ ...editor, evidenceTypes: splitTags(e.target.value) })} className="mt-1 w-full rounded-lg border px-3 py-2 disabled:bg-gray-50" />
            </label>
          </div>

          <label className="block text-sm font-medium text-gray-700">Skill groups — controlled JSON
            <textarea disabled={!canEdit && Boolean(openVersion)} rows={14} value={skillGroupsJson} onChange={e => setSkillGroupsJson(e.target.value)} spellCheck={false} className="mt-1 w-full rounded-lg border bg-slate-950 px-3 py-2 font-mono text-xs text-slate-100 disabled:bg-slate-900" />
          </label>

          <label className="block text-sm font-medium text-gray-700">Change note
            <textarea disabled={!canEdit && Boolean(openVersion)} rows={3} value={changeNote} onChange={e => setChangeNote(e.target.value)} placeholder="Explain what is changing and why (minimum 10 characters)." className="mt-1 w-full rounded-lg border px-3 py-2 disabled:bg-gray-50" />
          </label>

          <div className="flex flex-wrap gap-2 border-t pt-4">
            {!openVersion && <button disabled={busy || changeNote.trim().length < 10} onClick={createDraft} className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white disabled:opacity-50">Create draft version</button>}
            {openVersion?.status === 'draft' && <>
              <button disabled={busy || changeNote.trim().length < 10} onClick={saveDraft} className="rounded-lg border px-4 py-2 text-sm font-semibold">Save draft</button>
              <button disabled={busy || changeNote.trim().length < 10} onClick={submitDraft} className="rounded-lg bg-amber-600 px-4 py-2 text-sm font-semibold text-white disabled:opacity-50">Submit for practitioner review</button>
            </>}
            {openVersion?.status === 'in_review' && <p className="text-sm text-amber-700">Waiting for a verified Engineer practitioner review. This version is locked.</p>}
            {openVersion?.status === 'approved' && <button disabled={busy} onClick={publishApproved} className="rounded-lg bg-green-600 px-4 py-2 text-sm font-semibold text-white">Publish approved version</button>}
          </div>

          <div className="border-t pt-5">
            <h3 className="font-bold text-gray-900">Version history</h3>
            <div className="mt-3 space-y-3">
              {versions.length === 0 && <p className="text-sm text-gray-500">No governed versions yet. The source-controlled baseline remains authoritative.</p>}
              {versions.map(version => (
                <div key={version.id} className="rounded-lg border p-3 text-sm">
                  <div className="flex items-center justify-between gap-3">
                    <strong>Version {version.version}</strong>
                    <span className={`rounded-md px-2 py-1 text-xs font-semibold ${statusClass(version.status)}`}>{version.status.replace('_', ' ')}</span>
                  </div>
                  <p className="mt-2 text-gray-700">{version.changeNote}</p>
                  {version.reviews.map(review => <p key={review.id} className="mt-2 text-xs text-gray-500">Practitioner {review.decision}: {review.note}</p>)}
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};
