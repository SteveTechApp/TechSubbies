import React, { useMemo, useState } from 'react';
import {
  adjacentFamilyDecisionOrder,
  adjacentFamilyValidations,
  type AdjacentFamilyDecision,
} from '../../data/adjacentFamilyValidation';

const decisionMeta: Record<AdjacentFamilyDecision, { label: string; className: string; detail: string }> = {
  advance: {
    label: 'Advance to practitioner validation',
    className: 'border-emerald-200 bg-emerald-50 text-emerald-800',
    detail: 'Evidence is strong enough to define a practitioner-reviewed role draft. This is not permission to add the role to the live catalogue.',
  },
  conditional: {
    label: 'Conditional / compliance gate',
    className: 'border-amber-200 bg-amber-50 text-amber-900',
    detail: 'The market is valid, but safety, regulatory or scope controls must be resolved before a live role is created.',
  },
  hold: {
    label: 'Hold for task analysis',
    className: 'border-slate-300 bg-slate-100 text-slate-700',
    detail: 'The adjacent market is real, but the first marketplace role is not yet narrow enough for reliable matching.',
  },
};

export const AdjacentFamiliesView = () => {
  const [decision, setDecision] = useState<AdjacentFamilyDecision | 'all'>('all');
  const families = useMemo(
    () => adjacentFamilyValidations
      .filter(item => decision === 'all' || item.decision === decision)
      .slice()
      .sort((a, b) => adjacentFamilyDecisionOrder[a.decision] - adjacentFamilyDecisionOrder[b.decision] || a.label.localeCompare(b.label)),
    [decision]
  );

  const counts = adjacentFamilyValidations.reduce<Record<AdjacentFamilyDecision, number>>(
    (acc, item) => ({ ...acc, [item.decision]: acc[item.decision] + 1 }),
    { advance: 0, conditional: 0, hold: 0 }
  );

  return (
    <div className="space-y-6">
      <header className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <p className="text-xs font-bold uppercase tracking-[0.18em] text-blue-600">P2 family expansion gate</p>
        <h1 className="mt-1 text-2xl font-bold text-slate-900">Adjacent family validation</h1>
        <p className="mt-2 max-w-4xl text-sm leading-6 text-slate-600">
          Research and scope candidate markets before they become canonical TechSubbies roles. Candidate IDs on this page are deliberately excluded from the live role registry until a practitioner-reviewed taxonomy proposal is approved and published.
        </p>

        <div className="mt-5 grid gap-3 sm:grid-cols-3">
          {(['advance', 'conditional', 'hold'] as AdjacentFamilyDecision[]).map(key => (
            <button
              key={key}
              type="button"
              onClick={() => setDecision(current => current === key ? 'all' : key)}
              className={`rounded-lg border p-3 text-left ${decisionMeta[key].className} ${decision === key ? 'ring-2 ring-blue-500 ring-offset-1' : ''}`}
            >
              <div className="text-2xl font-bold">{counts[key]}</div>
              <div className="mt-1 text-xs font-semibold">{decisionMeta[key].label}</div>
            </button>
          ))}
        </div>
      </header>

      <div className="space-y-5">
        {families.map(family => {
          const meta = decisionMeta[family.decision];
          return (
            <article key={family.id} className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
                <div>
                  <h2 className="text-xl font-bold text-slate-900">{family.label}</h2>
                  <p className="mt-1 max-w-4xl text-sm leading-6 text-slate-600">{family.summary}</p>
                </div>
                <span className={`w-fit rounded-md border px-3 py-1.5 text-xs font-bold ${meta.className}`}>
                  {meta.label}
                </span>
              </div>

              <div className="mt-4 rounded-lg bg-slate-50 p-4 text-sm leading-6 text-slate-700">
                <strong>Decision rationale:</strong> {family.rationale}
              </div>

              <div className="mt-5 grid gap-5 xl:grid-cols-2">
                <section>
                  <h3 className="text-sm font-bold uppercase tracking-wide text-slate-500">Proposed first role</h3>
                  <div className="mt-2 space-y-3">
                    {family.proposedRoles.map(role => (
                      <div key={role.id} className="rounded-lg border border-blue-100 bg-blue-50 p-4">
                        <div className="font-bold text-blue-950">{role.title}</div>
                        <div className="mt-1 font-mono text-xs text-blue-700">{role.id}</div>
                        <p className="mt-2 text-sm leading-6 text-blue-900">{role.boundary}</p>
                      </div>
                    ))}
                  </div>
                </section>

                <section>
                  <h3 className="text-sm font-bold uppercase tracking-wide text-slate-500">Existing overlap</h3>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {family.overlapsWith.map(item => (
                      <span key={item} className="rounded-md bg-slate-100 px-2 py-1 text-xs font-medium text-slate-700">{item}</span>
                    ))}
                  </div>
                </section>
              </div>

              <div className="mt-5 grid gap-5 xl:grid-cols-3">
                <section>
                  <h3 className="text-sm font-bold text-slate-800">Evidence anchors</h3>
                  <ul className="mt-2 space-y-2 text-sm">
                    {family.evidence.map(item => (
                      <li key={`${item.organisation}-${item.label}`}>
                        <a href={item.url} target="_blank" rel="noreferrer" className="font-semibold text-blue-700 hover:underline">
                          {item.organisation}: {item.label}
                        </a>
                        <span className="ml-2 text-xs text-slate-500">{item.strength}</span>
                      </li>
                    ))}
                  </ul>
                </section>

                <section>
                  <h3 className="text-sm font-bold text-slate-800">Scope safeguards</h3>
                  <ul className="mt-2 list-disc space-y-1 pl-5 text-sm leading-6 text-slate-600">
                    {family.safeguards.map(item => <li key={item}>{item}</li>)}
                  </ul>
                </section>

                <section>
                  <h3 className="text-sm font-bold text-slate-800">Practitioner questions</h3>
                  <ul className="mt-2 list-disc space-y-1 pl-5 text-sm leading-6 text-slate-600">
                    {family.practitionerQuestions.map(item => <li key={item}>{item}</li>)}
                  </ul>
                </section>
              </div>

              <p className={`mt-5 rounded-lg border p-3 text-xs leading-5 ${meta.className}`}>{meta.detail}</p>
            </article>
          );
        })}
      </div>
    </div>
  );
};
