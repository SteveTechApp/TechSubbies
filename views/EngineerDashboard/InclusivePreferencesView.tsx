import React, { useMemo, useState } from 'react';
import type { EngineerProfile } from '../../types';
import {
  ALTERNATIVE_EVIDENCE_LABELS,
  readInclusivePreferences,
  type AlternativeEvidenceRoute,
  type InclusivePreferences,
  type WorkModePreference,
} from '../../utils/inclusivePreferences';

interface InclusivePreferencesViewProps {
  profile: EngineerProfile;
  onSave: (profileData: Partial<EngineerProfile>) => Promise<void>;
}

const WORK_MODES: Array<{ value: WorkModePreference; label: string; detail: string }> = [
  { value: 'on-site', label: 'On-site', detail: 'Field, installation, commissioning or customer-site work.' },
  { value: 'remote', label: 'Remote', detail: 'Remote support, programming, design, documentation or administration.' },
  { value: 'hybrid', label: 'Hybrid', detail: 'A combination of remote preparation/support and on-site delivery.' },
];

const ADJUSTMENTS = [
  'Step-free / accessible site access',
  'Seated work where practical',
  'Reduced lifting / manual handling',
  'Flexible or additional breaks',
  'Hearing / audio communication support',
  'Visual / written communication support',
  'Clear written task instructions',
  'Additional site-onboarding time',
];

const EVIDENCE_ROUTES = Object.entries(ALTERNATIVE_EVIDENCE_LABELS) as Array<[AlternativeEvidenceRoute, string]>;

function toggle<T extends string>(values: T[], value: T): T[] {
  return values.includes(value) ? values.filter(item => item !== value) : [...values, value];
}

export const InclusivePreferencesView = ({ profile, onSave }: InclusivePreferencesViewProps) => {
  const initial = useMemo(() => readInclusivePreferences(profile), [profile]);
  const [preferences, setPreferences] = useState<InclusivePreferences>(initial);
  const [languageText, setLanguageText] = useState(initial.languages.join(', '));
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState('');

  const updateAccessibility = (patch: Partial<InclusivePreferences['accessibility']>) => {
    setPreferences(current => ({
      ...current,
      accessibility: { ...current.accessibility, ...patch },
    }));
  };

  const save = async () => {
    const languages = Array.from(new Map(
      languageText.split(',')
        .map(value => value.trim())
        .filter(Boolean)
        .slice(0, 12)
        .map(value => [value.toLowerCase(), value.slice(0, 120)])
    ).values());
    const normalized: InclusivePreferences = {
      ...preferences,
      languages: languages.length ? languages : ['English'],
      workModes: preferences.workModes.length ? preferences.workModes : ['on-site'],
      accessibility: preferences.accessibility.needsAdjustments
        ? preferences.accessibility
        : { needsAdjustments: false, shareWithCompanies: false, adjustments: [], note: '' },
    };

    setSaving(true);
    setSaved(false);
    setError('');
    try {
      await onSave({ inclusivePreferences: normalized } as unknown as Partial<EngineerProfile>);
      setPreferences(normalized);
      setLanguageText(normalized.languages.join(', '));
      setSaved(true);
    } catch (saveError) {
      setError(saveError instanceof Error ? saveError.message : 'Could not save work preferences.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <header>
        <p className="text-xs font-bold uppercase tracking-[0.18em] text-blue-600">Profile preferences</p>
        <h1 className="mt-1 text-2xl font-bold text-gray-900">Work preferences & accessibility</h1>
        <p className="mt-2 max-w-3xl text-sm leading-6 text-gray-600">
          Record how you prefer to work and the evidence routes you can provide. Accessibility details are private by default and are never available as company search filters.
        </p>
      </header>

      <section className="rounded-xl border bg-white p-6 shadow-sm">
        <h2 className="text-lg font-bold text-gray-900">Work location preference</h2>
        <p className="mt-1 text-sm text-gray-500">Select every mode you genuinely want to be considered for.</p>
        <div className="mt-4 grid gap-3 md:grid-cols-3">
          {WORK_MODES.map(mode => {
            const active = preferences.workModes.includes(mode.value);
            return (
              <button
                key={mode.value}
                type="button"
                aria-pressed={active}
                onClick={() => setPreferences(current => ({ ...current, workModes: toggle(current.workModes, mode.value) }))}
                className={`rounded-xl border p-4 text-left transition ${active ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-blue-300'}`}
              >
                <div className="font-semibold text-gray-900">{mode.label}</div>
                <div className="mt-1 text-xs leading-5 text-gray-500">{mode.detail}</div>
              </button>
            );
          })}
        </div>
      </section>

      <section className="rounded-xl border bg-white p-6 shadow-sm">
        <h2 className="text-lg font-bold text-gray-900">Languages</h2>
        <p className="mt-1 text-sm text-gray-500">Used for work matching and communication planning. Separate languages with commas.</p>
        <input
          aria-label="Languages"
          value={languageText}
          onChange={event => setLanguageText(event.target.value)}
          placeholder="English, Polish, French"
          className="mt-4 w-full rounded-lg border border-gray-300 px-3 py-2"
        />
      </section>

      <section className="rounded-xl border bg-white p-6 shadow-sm">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="text-lg font-bold text-gray-900">Accessibility adjustments</h2>
            <p className="mt-1 max-w-3xl text-sm text-gray-500">
              You do not need to disclose a diagnosis. Record only practical adjustments that help you work safely and effectively.
            </p>
          </div>
          <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
            <input
              type="checkbox"
              checked={preferences.accessibility.needsAdjustments}
              onChange={event => updateAccessibility({ needsAdjustments: event.target.checked })}
            />
            I may need adjustments
          </label>
        </div>

        {preferences.accessibility.needsAdjustments && (
          <div className="mt-5 space-y-5">
            <div className="grid gap-2 md:grid-cols-2">
              {ADJUSTMENTS.map(adjustment => (
                <label key={adjustment} className="flex items-start gap-2 rounded-lg border border-gray-200 p-3 text-sm text-gray-700">
                  <input
                    type="checkbox"
                    className="mt-0.5"
                    checked={preferences.accessibility.adjustments.includes(adjustment)}
                    onChange={() => updateAccessibility({
                      adjustments: toggle(preferences.accessibility.adjustments, adjustment),
                    })}
                  />
                  {adjustment}
                </label>
              ))}
            </div>
            <div>
              <label className="text-sm font-semibold text-gray-700" htmlFor="accessibility-note">Practical note</label>
              <textarea
                id="accessibility-note"
                value={preferences.accessibility.note}
                onChange={event => updateAccessibility({ note: event.target.value.slice(0, 1000) })}
                rows={3}
                className="mt-2 w-full rounded-lg border border-gray-300 px-3 py-2"
                placeholder="Only include practical information a company would need to plan the work/site."
              />
            </div>
            <label className="flex items-start gap-2 rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
              <input
                type="checkbox"
                className="mt-0.5"
                checked={preferences.accessibility.shareWithCompanies}
                onChange={event => updateAccessibility({ shareWithCompanies: event.target.checked })}
              />
              <span>
                <strong>Share these adjustment details with companies.</strong> If unchecked, the details remain in your own account data and are removed from marketplace/directory responses.
              </span>
            </label>
          </div>
        )}
      </section>

      <section className="rounded-xl border bg-white p-6 shadow-sm">
        <h2 className="text-lg font-bold text-gray-900">Alternative evidence routes</h2>
        <p className="mt-1 text-sm leading-6 text-gray-500">
          Formal certificates are not the only way to demonstrate competence. Select evidence you can provide. These choices do not become verified evidence or increase a score until the underlying evidence is reviewed through the normal trust workflow.
        </p>
        <div className="mt-4 grid gap-2 md:grid-cols-2">
          {EVIDENCE_ROUTES.map(([route, label]) => (
            <label key={route} className="flex items-center gap-2 rounded-lg border border-gray-200 p-3 text-sm text-gray-700">
              <input
                type="checkbox"
                checked={preferences.alternativeEvidenceRoutes.includes(route)}
                onChange={() => setPreferences(current => ({
                  ...current,
                  alternativeEvidenceRoutes: toggle(current.alternativeEvidenceRoutes, route),
                }))}
              />
              {label}
            </label>
          ))}
        </div>
      </section>

      <div className="flex items-center justify-end gap-3">
        {saved && <span role="status" className="text-sm font-medium text-green-700">Preferences saved.</span>}
        {error && <span role="alert" className="text-sm font-medium text-red-700">{error}</span>}
        <button
          type="button"
          onClick={save}
          disabled={saving}
          className="rounded-lg bg-blue-600 px-5 py-2.5 font-semibold text-white hover:bg-blue-700 disabled:bg-blue-300"
        >
          {saving ? 'Saving…' : 'Save preferences'}
        </button>
      </div>
    </div>
  );
};
