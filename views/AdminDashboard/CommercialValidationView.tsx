import React, { useEffect, useMemo, useState } from 'react';
import {
  createCommercialDecision,
  getCommercialValidationSummary,
  listCommercialDecisions,
  updateCommercialDecisionStatus,
  type CommercialDecision,
  type CommercialRole,
  type CommercialRoleValidation,
  type CommercialValidationSummary,
  type PricingValueDriver,
} from '../../services/commercialValidationService';

const ROLE_OPTIONS: CommercialRole[] = ['Engineer', 'Company', 'Resourcing Company'];
const DRIVER_OPTIONS: Array<{ value: PricingValueDriver; label: string }> = [
  { value: 'verified-talent', label: 'Verified talent' },
  { value: 'better-matching', label: 'Better matching' },
  { value: 'faster-hiring', label: 'Faster hiring' },
  { value: 'profile-visibility', label: 'Profile visibility' },
  { value: 'evidence-verification', label: 'Evidence verification' },
  { value: 'contract-workflow', label: 'Contract workflow' },
  { value: 'messaging', label: 'Messaging' },
  { value: 'analytics', label: 'Analytics' },
  { value: 'resourcing-roster', label: 'Resourcing roster' },
  { value: 'priority-support', label: 'Priority support' },
];

const percent = (value: number | null) => value === null ? '—' : `${Math.round(value * 100)}%`;
const money = (value: number | null) => value === null ? '—' : `£${value}`;

function StageBadge({ validation }: { validation: CommercialRoleValidation }) {
  const label = validation.stage === 'observed-evidence-ready'
    ? 'Observed evidence'
    : validation.stage === 'cohort-test-ready'
      ? 'Cohort test ready'
      : 'More evidence needed';
  const className = validation.stage === 'observed-evidence-ready'
    ? 'bg-green-100 text-green-800'
    : validation.stage === 'cohort-test-ready'
      ? 'bg-blue-100 text-blue-800'
      : 'bg-amber-100 text-amber-800';
  return <span className={`rounded-md px-2.5 py-1 text-xs font-semibold ${className}`}>{label}</span>;
}

function Gate({ ok, label }: { ok: boolean | null; label: string }) {
  return (
    <div className="flex items-center justify-between gap-3 border-b py-2 text-sm last:border-b-0">
      <span className="text-gray-700">{label}</span>
      <span className={ok === null ? 'text-gray-500' : ok ? 'font-semibold text-green-700' : 'font-semibold text-amber-700'}>
        {ok === null ? 'Unavailable' : ok ? 'Met' : 'Not met'}
      </span>
    </div>
  );
}

export const CommercialValidationView = () => {
  const [summary, setSummary] = useState<CommercialValidationSummary | null>(null);
  const [decisions, setDecisions] = useState<CommercialDecision[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [accountRole, setAccountRole] = useState<CommercialRole>('Engineer');
  const [packageName, setPackageName] = useState('Controlled cohort package');
  const [monthlyPrice, setMonthlyPrice] = useState('15');
  const [annualPrice, setAnnualPrice] = useState('');
  const [valueDriver, setValueDriver] = useState<PricingValueDriver>('better-matching');
  const [saving, setSaving] = useState(false);

  const load = async () => {
    setLoading(true);
    setError('');
    try {
      const [nextSummary, nextDecisions] = await Promise.all([
        getCommercialValidationSummary(),
        listCommercialDecisions(),
      ]);
      setSummary(nextSummary);
      setDecisions(nextDecisions);
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : 'Could not load commercial validation.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { void load(); }, []);

  const selectedValidation = useMemo(
    () => summary?.roles.find((role) => role.role === accountRole) || null,
    [summary, accountRole],
  );

  const createHypothesis = async (event: React.FormEvent) => {
    event.preventDefault();
    setSaving(true);
    setError('');
    try {
      const decision = await createCommercialDecision({
        accountRole,
        packageName: packageName.trim(),
        candidateMonthlyPrice: Number(monthlyPrice),
        candidateAnnualPrice: annualPrice.trim() ? Number(annualPrice) : null,
        valueDrivers: [valueDriver],
      });
      setDecisions((current) => [decision, ...current]);
    } catch (saveError) {
      setError(saveError instanceof Error ? saveError.message : 'Could not save package hypothesis.');
    } finally {
      setSaving(false);
    }
  };

  const changeStatus = async (decision: CommercialDecision, status: 'approved-for-cohort' | 'rejected' | 'completed') => {
    setError('');
    try {
      const updated = await updateCommercialDecisionStatus(decision.id, status);
      setDecisions((current) => current.map((entry) => entry.id === updated.id ? updated : entry));
      if (status === 'approved-for-cohort') await load();
    } catch (updateError) {
      setError(updateError instanceof Error ? updateError.message : 'Could not update decision.');
    }
  };

  if (loading) return <div className="p-6 text-sm text-gray-600">Loading commercial validation evidence…</div>;

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-3xl font-bold text-gray-900">Commercial Validation</h1>
        <p className="mt-2 max-w-4xl text-sm leading-6 text-gray-600">
          Decide when a membership package is ready for a controlled cohort test. This screen never changes live Stripe prices or member entitlements.
        </p>
      </header>

      {error && <div role="alert" className="rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-800">{error}</div>}

      <section className="grid grid-cols-1 gap-4 xl:grid-cols-3">
        {summary?.roles.map((validation) => (
          <article key={validation.role} className="rounded-lg border bg-white p-5 shadow-sm">
            <div className="flex items-start justify-between gap-3">
              <div>
                <h2 className="text-lg font-bold text-gray-900">{validation.role}</h2>
                <p className="mt-1 text-xs text-gray-500">90-day marketplace evidence</p>
              </div>
              <StageBadge validation={validation} />
            </div>

            <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
              <div className="rounded-md bg-gray-50 p-3"><div className="text-xs text-gray-500">Research responses</div><div className="mt-1 text-xl font-bold">{validation.research.responses}</div></div>
              <div className="rounded-md bg-gray-50 p-3"><div className="text-xs text-gray-500">Engaged accounts</div><div className="mt-1 text-xl font-bold">{validation.marketplace.engagedAccounts90d}</div></div>
              <div className="rounded-md bg-gray-50 p-3"><div className="text-xs text-gray-500">Likely to pay</div><div className="mt-1 text-xl font-bold">{percent(validation.research.likelyToPayRate)}</div></div>
              <div className="rounded-md bg-gray-50 p-3"><div className="text-xs text-gray-500">Research price band</div><div className="mt-1 text-lg font-bold">{money(validation.researchPriceBand.lowerMonthly)}–{money(validation.researchPriceBand.upperMonthly)}</div></div>
            </div>

            <div className="mt-4 rounded-md border px-3">
              <Gate ok={validation.gates.researchSample} label="Research sample" />
              <Gate ok={validation.gates.marketplaceUsage} label="Marketplace usage" />
              <Gate ok={validation.gates.statedIntent} label="Stated value / intent" />
              <Gate ok={validation.gates.observedBilling} label="Observed paid behaviour" />
            </div>

            <div className="mt-4 text-xs leading-5 text-gray-600">
              {validation.billing.capabilityAvailable
                ? `${validation.billing.activeOrTrialing} active/trial paid accounts; ${validation.billing.endingAtPeriodEnd} ending at period end.`
                : 'Role-specific Stripe membership checkout is not currently available, so paid-behaviour evidence is intentionally marked unavailable.'}
            </div>

            {validation.blockers.length > 0 && (
              <ul className="mt-3 list-disc space-y-1 pl-5 text-xs text-amber-800">
                {validation.blockers.map((blocker) => <li key={blocker}>{blocker}</li>)}
              </ul>
            )}
          </article>
        ))}
      </section>

      <section className="grid grid-cols-1 gap-6 xl:grid-cols-[380px_1fr]">
        <form onSubmit={createHypothesis} className="rounded-lg border bg-white p-5 shadow-sm">
          <h2 className="text-lg font-bold text-gray-900">Package hypothesis</h2>
          <p className="mt-1 text-xs leading-5 text-gray-500">Records a test candidate only. Approval authorises a controlled cohort test; it does not publish pricing.</p>
          <div className="mt-4 space-y-3">
            <label className="block text-sm font-medium">Account type
              <select aria-label="Account type" value={accountRole} onChange={(event) => setAccountRole(event.target.value as CommercialRole)} className="mt-1 w-full rounded-md border p-2">
                {ROLE_OPTIONS.map((role) => <option key={role}>{role}</option>)}
              </select>
            </label>
            <label className="block text-sm font-medium">Package name
              <input aria-label="Package name" value={packageName} onChange={(event) => setPackageName(event.target.value)} required className="mt-1 w-full rounded-md border p-2" />
            </label>
            <div className="grid grid-cols-2 gap-3">
              <label className="block text-sm font-medium">Monthly £
                <input aria-label="Candidate monthly price" type="number" min="0" value={monthlyPrice} onChange={(event) => setMonthlyPrice(event.target.value)} required className="mt-1 w-full rounded-md border p-2" />
              </label>
              <label className="block text-sm font-medium">Annual £
                <input aria-label="Candidate annual price" type="number" min="0" value={annualPrice} onChange={(event) => setAnnualPrice(event.target.value)} className="mt-1 w-full rounded-md border p-2" placeholder="Optional" />
              </label>
            </div>
            <label className="block text-sm font-medium">Primary value driver
              <select aria-label="Primary value driver" value={valueDriver} onChange={(event) => setValueDriver(event.target.value as PricingValueDriver)} className="mt-1 w-full rounded-md border p-2">
                {DRIVER_OPTIONS.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
              </select>
            </label>
          </div>
          <div className="mt-4 rounded-md bg-gray-50 p-3 text-xs text-gray-600">
            Current gate: <strong>{selectedValidation?.readyForCohortTest ? 'ready for cohort approval' : 'not ready for cohort approval'}</strong>.
          </div>
          <button disabled={saving} className="mt-4 w-full rounded-md bg-blue-600 px-4 py-2 font-semibold text-white disabled:bg-gray-400">
            {saving ? 'Saving…' : 'Save hypothesis'}
          </button>
        </form>

        <div className="rounded-lg border bg-white p-5 shadow-sm">
          <h2 className="text-lg font-bold text-gray-900">Decision history</h2>
          <p className="mt-1 text-xs text-gray-500">Approved decisions retain the evidence snapshot used at approval.</p>
          {decisions.length === 0 ? (
            <p className="mt-5 text-sm text-gray-500">No package hypotheses recorded yet.</p>
          ) : (
            <div className="mt-4 space-y-3">
              {decisions.map((decision) => {
                const roleValidation = summary?.roles.find((role) => role.role === decision.accountRole);
                return (
                  <article key={decision.id} className="rounded-md border p-4">
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div>
                        <h3 className="font-bold text-gray-900">{decision.packageName}</h3>
                        <p className="mt-1 text-sm text-gray-600">{decision.accountRole} · £{decision.candidateMonthlyPrice}/month{decision.candidateAnnualPrice !== null ? ` · £${decision.candidateAnnualPrice}/year` : ''}</p>
                      </div>
                      <span className="rounded-md bg-gray-100 px-2.5 py-1 text-xs font-semibold text-gray-700">{decision.status}</span>
                    </div>
                    <p className="mt-2 text-xs text-gray-500">Focus: {decision.valueDrivers.join(', ')}</p>
                    <div className="mt-3 flex flex-wrap gap-2">
                      {decision.status === 'draft' && (
                        <>
                          <button type="button" disabled={!roleValidation?.readyForCohortTest} onClick={() => void changeStatus(decision, 'approved-for-cohort')} className="rounded-md bg-green-600 px-3 py-1.5 text-xs font-semibold text-white disabled:bg-gray-300">Approve cohort test</button>
                          <button type="button" onClick={() => void changeStatus(decision, 'rejected')} className="rounded-md border px-3 py-1.5 text-xs font-semibold text-gray-700">Reject</button>
                        </>
                      )}
                      {decision.status === 'approved-for-cohort' && (
                        <button type="button" onClick={() => void changeStatus(decision, 'completed')} className="rounded-md bg-blue-600 px-3 py-1.5 text-xs font-semibold text-white">Mark cohort complete</button>
                      )}
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </div>
      </section>
    </div>
  );
};
