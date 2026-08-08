import React, { useEffect, useMemo, useState } from 'react';
import {
  getMyPricingResearchResponse,
  saveMyPricingResearchResponse,
  type BillingPreference,
  type PricingBlocker,
  type PricingResearchInput,
  type PricingValueDriver,
} from '../services/pricingResearchService';

const driverLabels: Record<PricingValueDriver, string> = {
  'verified-talent': 'Verified talent',
  'better-matching': 'Better matching',
  'faster-hiring': 'Faster hiring',
  'profile-visibility': 'Profile visibility',
  'evidence-verification': 'Evidence verification',
  'contract-workflow': 'Contract workflow',
  messaging: 'Messaging',
  analytics: 'Analytics',
  'resourcing-roster': 'Resourcing roster management',
  'priority-support': 'Priority support',
};

const blockerLabels: Record<PricingBlocker, string> = {
  price: 'Price',
  'need-proof-of-value': 'Need more proof of value',
  'not-enough-demand': 'Not enough project demand yet',
  'not-enough-supply': 'Not enough suitable talent yet',
  'missing-features': 'Missing features',
  'billing-commitment': 'Do not want a recurring commitment',
  none: 'No major blocker',
};

const initialForm: PricingResearchInput = {
  valueScore: 3,
  likelihoodToPay: 3,
  priceTooCheap: 5,
  priceGoodValue: 15,
  priceExpensive: 35,
  priceTooExpensive: 60,
  preferredBilling: 'monthly',
  valueDrivers: ['better-matching'],
  primaryBlocker: 'need-proof-of-value',
};

export const PricingResearchView = () => {
  const [form, setForm] = useState<PricingResearchInput>(initialForm);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    getMyPricingResearchResponse()
      .then((response) => {
        if (response) {
          const { id: _id, userId: _userId, accountRole: _accountRole, createdAt: _createdAt, updatedAt: _updatedAt, ...saved } = response;
          setForm(saved);
        }
      })
      .catch((reason) => setError(reason instanceof Error ? reason.message : 'Could not load pricing research.'))
      .finally(() => setLoading(false));
  }, []);

  const pricesValid = useMemo(() =>
    form.priceTooCheap <= form.priceGoodValue
      && form.priceGoodValue <= form.priceExpensive
      && form.priceExpensive <= form.priceTooExpensive,
  [form.priceTooCheap, form.priceGoodValue, form.priceExpensive, form.priceTooExpensive]);

  const toggleDriver = (driver: PricingValueDriver) => {
    setForm((previous) => {
      const selected = previous.valueDrivers.includes(driver);
      if (selected) {
        if (previous.valueDrivers.length === 1) return previous;
        return { ...previous, valueDrivers: previous.valueDrivers.filter((value) => value !== driver) };
      }
      if (previous.valueDrivers.length >= 5) return previous;
      return { ...previous, valueDrivers: [...previous.valueDrivers, driver] };
    });
  };

  const save = async () => {
    if (!pricesValid) {
      setError('Price thresholds must increase from too cheap through too expensive.');
      return;
    }
    setSaving(true);
    setStatus('');
    setError('');
    try {
      const saved = await saveMyPricingResearchResponse(form);
      const { id: _id, userId: _userId, accountRole: _accountRole, createdAt: _createdAt, updatedAt: _updatedAt, ...savedForm } = saved;
      setForm(savedForm);
      setStatus('Pricing feedback saved. You can update it as your experience changes.');
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : 'Could not save pricing research.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <p className="text-gray-600">Loading pricing research…</p>;

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <header>
        <p className="text-xs font-bold uppercase tracking-[0.18em] text-blue-600">Commercial research</p>
        <h1 className="mt-1 text-2xl font-bold text-gray-900">Pricing Research</h1>
        <p className="mt-2 max-w-3xl text-sm leading-6 text-gray-600">
          This research helps TechSubbies test membership value before changing prices. Your answers are aggregated by account type; they do not change your current plan or project rates.
        </p>
      </header>

      {error && <div role="alert" className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-800">{error}</div>}
      {status && <div role="status" className="rounded-lg border border-green-200 bg-green-50 p-4 text-sm text-green-800">{status}</div>}

      <section className="rounded-xl border bg-white p-6 shadow-sm">
        <h2 className="text-lg font-bold text-gray-900">Perceived value</h2>
        <div className="mt-4 grid gap-4 md:grid-cols-2">
          <label className="text-sm font-medium text-gray-700">
            Overall membership value: {form.valueScore}/5
            <input aria-label="Overall membership value" className="mt-2 w-full" type="range" min="1" max="5" value={form.valueScore} onChange={(event) => setForm({ ...form, valueScore: Number(event.target.value) })} />
          </label>
          <label className="text-sm font-medium text-gray-700">
            Likelihood you would pay for a useful membership: {form.likelihoodToPay}/5
            <input aria-label="Likelihood to pay" className="mt-2 w-full" type="range" min="1" max="5" value={form.likelihoodToPay} onChange={(event) => setForm({ ...form, likelihoodToPay: Number(event.target.value) })} />
          </label>
        </div>
      </section>

      <section className="rounded-xl border bg-white p-6 shadow-sm">
        <h2 className="text-lg font-bold text-gray-900">Monthly price sensitivity</h2>
        <p className="mt-1 text-sm text-gray-500">Think about a useful TechSubbies membership for your account type. Enter whole-pound monthly amounts.</p>
        <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[
            ['priceTooCheap', 'Too cheap to feel credible'],
            ['priceGoodValue', 'Good value'],
            ['priceExpensive', 'Expensive but still considered'],
            ['priceTooExpensive', 'Too expensive'],
          ].map(([field, label]) => (
            <label key={field} className="text-sm font-medium text-gray-700">
              {label}
              <div className="mt-2 flex items-center rounded-lg border border-gray-300 bg-white px-3">
                <span className="text-gray-500">£</span>
                <input
                  aria-label={label}
                  className="w-full border-0 px-2 py-2 outline-none"
                  type="number"
                  min="0"
                  max="2000"
                  step="1"
                  value={form[field as keyof Pick<PricingResearchInput, 'priceTooCheap' | 'priceGoodValue' | 'priceExpensive' | 'priceTooExpensive'>] as number}
                  onChange={(event) => setForm({ ...form, [field]: Number(event.target.value) })}
                />
              </div>
            </label>
          ))}
        </div>
        {!pricesValid && <p className="mt-3 text-sm font-medium text-red-700">The four price points must increase from left to right.</p>}
      </section>

      <section className="rounded-xl border bg-white p-6 shadow-sm">
        <h2 className="text-lg font-bold text-gray-900">What would make it worth paying for?</h2>
        <p className="mt-1 text-sm text-gray-500">Choose up to five. Keep at least one selected.</p>
        <div className="mt-4 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
          {(Object.keys(driverLabels) as PricingValueDriver[]).map((driver) => (
            <label key={driver} className="flex items-center gap-2 rounded-lg border border-gray-200 p-3 text-sm text-gray-700">
              <input type="checkbox" checked={form.valueDrivers.includes(driver)} onChange={() => toggleDriver(driver)} />
              {driverLabels[driver]}
            </label>
          ))}
        </div>
      </section>

      <section className="rounded-xl border bg-white p-6 shadow-sm">
        <div className="grid gap-4 md:grid-cols-2">
          <label className="text-sm font-medium text-gray-700">
            Preferred billing
            <select className="mt-2 w-full rounded-lg border border-gray-300 px-3 py-2" value={form.preferredBilling} onChange={(event) => setForm({ ...form, preferredBilling: event.target.value as BillingPreference })}>
              <option value="monthly">Monthly</option>
              <option value="annual">Annual</option>
              <option value="either">Either / no preference</option>
            </select>
          </label>
          <label className="text-sm font-medium text-gray-700">
            Main reason you might not pay
            <select className="mt-2 w-full rounded-lg border border-gray-300 px-3 py-2" value={form.primaryBlocker} onChange={(event) => setForm({ ...form, primaryBlocker: event.target.value as PricingBlocker })}>
              {(Object.keys(blockerLabels) as PricingBlocker[]).map((blocker) => <option key={blocker} value={blocker}>{blockerLabels[blocker]}</option>)}
            </select>
          </label>
        </div>
      </section>

      <div className="flex justify-end">
        <button type="button" disabled={saving || !pricesValid} onClick={save} className="rounded-lg bg-blue-600 px-5 py-2.5 font-semibold text-white hover:bg-blue-700 disabled:bg-blue-300">
          {saving ? 'Saving…' : 'Save pricing feedback'}
        </button>
      </div>
    </div>
  );
};
