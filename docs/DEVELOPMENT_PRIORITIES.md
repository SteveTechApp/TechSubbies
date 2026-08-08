# TechSubbies Development Priorities

Updated 8 August 2026. This is the current implementation backlog; the older
Word planning documents are retained as historical snapshots.

## Completed foundations

- Canonical AV/IT role registry: all 20 AV and 26 IT profiles now feed the
  interactive role-skill engine through one contract.
- Evidence-adjusted skill scoring from self-ratings, completed work, reviews
  and verified certificates.
- Availability windows, minimum notice period and working radius persisted in
  engineer profiles and used by search filters.
- Junior/lead supervision checks with an auditable contract override.
- Budget-aware senior versus junior-plus-lead team suggestions.
- Server-side pilot funnel counters for profile updates, job posts,
  applications and contracts, displayed in the admin dashboard.

## P0 - controlled commercial pilot

- [x] Replace remaining mock engineer/job data merges with explicit demo and
  production modes.
- [x] Persist canonical specialist-role ratings and evidence as normalized
  backend records rather than opaque profile JSON.
- [x] Attach canonical role IDs to engineer registration and new job intake.
- [x] Migrate historic job/opportunity records to canonical identifiers while
  retaining an explicit legacy crosswalk for older pilot clients.
- [x] Connect the evidence-adjusted shortlist to the company Find Talent flow;
  show score explanations, evidence freshness and gaps.
- [x] Define initial controlled-pilot conversion thresholds and show live
  actual-versus-target progress in Admin: 2.0 applications per job, 30% job to
  contract and 15% application to contract.
- [ ] Recruit a small AV/UC and IT field-services pilot cohort and validate the
  initial conversion thresholds against the first reliable cohort baseline.

## P1 - trust and transaction readiness

- [ ] Production object storage with private evidence access and audit logs.
- [ ] Certificate verification queue, expiry reminders and evidence visibility
  controls.
- [ ] Production e-signature provider.
- [ ] Decide and document direct-party payments versus platform payment rails.
- [ ] Cancellations, substitutions, no-shows, disputes and support workflows.
- [ ] Real-time notification delivery and messaging transport.

## P2 - taxonomy and inclusion

- [ ] Admin taxonomy editor with versioning and practitioner approval.
- [ ] Crosswalk all responsibility expectations to canonical role IDs.
- [ ] Add assisted/independent/lead delivery context, last-used dates and
  project scale to skill evidence.
- [ ] Add accessibility adjustments, languages, remote/on-site preferences and
  alternative evidence routes.
- [ ] Validate adjacent families before adding them: fibre/telecoms, physical
  security, smart buildings/BMS/IoT, broadcast, stage systems and residential
  integration.

## P3 - scale and monetization

- [ ] Validate buyer, engineer and resourcing-company willingness to pay.
- [ ] Track search-to-view, shortlist, invitation, repeat booking and retention.
- [ ] Migrate SQLite to managed PostgreSQL before horizontal scaling.
- [ ] Add production billing, entitlement reconciliation and revenue reporting.
