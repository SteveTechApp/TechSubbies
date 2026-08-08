import React, { useEffect, useState } from 'react';
import {
  getAdminMarketplaceAnalytics,
  type MarketplaceAnalyticsSummary,
} from '../../services/marketplaceAnalyticsService';

const WINDOWS: Array<{ value: 30 | 90 | 'all'; label: string }> = [
  { value: 30, label: '30 days' },
  { value: 90, label: '90 days' },
  { value: 'all', label: 'All time' },
];

function percent(value: number | null): string {
  return value === null ? '—' : `${Math.round(value * 100)}%`;
}

function decimal(value: number | null): string {
  return value === null ? '—' : value.toFixed(2);
}

export const MarketplaceAnalyticsView = () => {
  const [windowDays, setWindowDays] = useState<30 | 90 | 'all'>(30);
  const [analytics, setAnalytics] = useState<MarketplaceAnalyticsSummary | null>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    let cancelled = false;
    setError('');
    getAdminMarketplaceAnalytics(windowDays)
      .then((summary) => {
        if (!cancelled) setAnalytics(summary);
      })
      .catch((reason) => {
        if (!cancelled) setError(reason instanceof Error ? reason.message : 'Could not load marketplace analytics.');
      });
    return () => {
      cancelled = true;
    };
  }, [windowDays]);

  return (
    <div className="space-y-5">
      <header className="flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-blue-600">P3 marketplace measurement</p>
          <h1 className="mt-1 text-2xl font-bold text-gray-900">Marketplace Analytics</h1>
          <p className="mt-2 max-w-3xl text-sm text-gray-600">
            Server-owned funnel measurement from talent discovery through booking, repeat booking and 30-day retention.
          </p>
        </div>
        <div className="flex rounded-lg border border-gray-200 bg-white p-1">
          {WINDOWS.map((item) => (
            <button
              key={String(item.value)}
              type="button"
              onClick={() => setWindowDays(item.value)}
              className={`rounded-md px-3 py-2 text-sm font-semibold ${windowDays === item.value ? 'bg-gray-900 text-white' : 'text-gray-600 hover:bg-gray-100'}`}
            >
              {item.label}
            </button>
          ))}
        </div>
      </header>

      {error && <div role="alert" className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-800">{error}</div>}
      {!error && !analytics && <p className="text-sm text-gray-500">Loading marketplace analytics…</p>}

      {analytics && (
        <>
          <section className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
            {[
              ['Searches', analytics.stages.searches],
              ['Profile views', analytics.stages.profileViews],
              ['Invitations', analytics.stages.invitations],
              ['Applications', analytics.stages.applications],
              ['Bookings', analytics.stages.bookings],
            ].map(([label, value]) => (
              <div key={String(label)} className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
                <div className="text-2xl font-bold text-gray-900">{value}</div>
                <div className="mt-1 text-xs font-semibold uppercase tracking-wide text-gray-500">{label}</div>
              </div>
            ))}
          </section>

          <section className="grid gap-4 lg:grid-cols-2">
            <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
              <h2 className="text-base font-bold text-gray-900">Discovery conversion</h2>
              <div className="mt-4 divide-y divide-gray-100 text-sm">
                <div className="flex items-center justify-between py-3">
                  <div>
                    <div className="font-semibold text-gray-800">Profile views per search</div>
                    <div className="text-xs text-gray-500">Discovery depth, not a bounded percentage.</div>
                  </div>
                  <strong>{decimal(analytics.conversion.profileViewsPerSearch)}</strong>
                </div>
                <div className="flex items-center justify-between py-3">
                  <div>
                    <div className="font-semibold text-gray-800">Invitation rate from views</div>
                    <div className="text-xs text-gray-500">Invitations ÷ engineer profile views.</div>
                  </div>
                  <strong>{percent(analytics.conversion.invitationRateFromViews)}</strong>
                </div>
                <div className="flex items-center justify-between py-3">
                  <div>
                    <div className="font-semibold text-gray-800">Application to booking</div>
                    <div className="text-xs text-gray-500">Contracts created ÷ applications submitted.</div>
                  </div>
                  <strong>{percent(analytics.conversion.applicationToBookingRate)}</strong>
                </div>
              </div>
            </div>

            <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
              <h2 className="text-base font-bold text-gray-900">Marketplace participants</h2>
              <div className="mt-4 grid grid-cols-2 gap-3">
                {[
                  ['Unique searchers', analytics.actors.uniqueSearchers],
                  ['Profile viewers', analytics.actors.uniqueProfileViewers],
                  ['Applicants', analytics.actors.uniqueApplicants],
                  ['Booking companies', analytics.actors.uniqueBookers],
                ].map(([label, value]) => (
                  <div key={String(label)} className="rounded-lg bg-gray-50 p-3">
                    <div className="text-xl font-bold text-gray-900">{value}</div>
                    <div className="mt-1 text-xs text-gray-500">{label}</div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          <section className="grid gap-4 lg:grid-cols-2">
            <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
              <h2 className="text-base font-bold text-gray-900">Repeat booking</h2>
              <p className="mt-1 text-sm text-gray-500">A repeat pair has at least two contracts between the same company and engineer in the selected window.</p>
              <div className="mt-4 flex items-end justify-between gap-4">
                <div>
                  <div className="text-3xl font-bold text-gray-900">{percent(analytics.repeatBooking.repeatBookingRate)}</div>
                  <div className="mt-1 text-xs text-gray-500">repeat-pair rate</div>
                </div>
                <div className="text-right text-sm text-gray-600">
                  <div><strong>{analytics.repeatBooking.repeatBookingPairs}</strong> repeat pairs</div>
                  <div><strong>{analytics.repeatBooking.bookingPairs}</strong> total booking pairs</div>
                </div>
              </div>
            </div>

            <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
              <h2 className="text-base font-bold text-gray-900">30-day retention</h2>
              <p className="mt-1 text-sm text-gray-500">Eligible users are those whose first marketplace activity was at least 30 days ago; retained users returned on or after day 30.</p>
              <div className="mt-4 flex items-end justify-between gap-4">
                <div>
                  <div className="text-3xl font-bold text-gray-900">{percent(analytics.retention30d.rate)}</div>
                  <div className="mt-1 text-xs text-gray-500">30-day retained</div>
                </div>
                <div className="text-right text-sm text-gray-600">
                  <div><strong>{analytics.retention30d.retainedUsers}</strong> retained</div>
                  <div><strong>{analytics.retention30d.eligibleUsers}</strong> eligible</div>
                </div>
              </div>
            </div>
          </section>

          <p className="text-xs text-gray-400">Generated {new Date(analytics.generatedAt).toLocaleString()}</p>
        </>
      )}
    </div>
  );
};
