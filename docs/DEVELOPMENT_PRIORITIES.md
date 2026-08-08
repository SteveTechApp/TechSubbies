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

- [x] Implement the private evidence-storage boundary: authenticated
  owner/Admin access, append-only access audit records, local private storage
  for development and an AWS S3 production adapter.
- [ ] Provision the production private S3 bucket/IAM/encryption/logging controls
  and run a deployed evidence upload/download smoke test.
- [x] Implement certificate verification workflow: engineer submission,
  Admin verification/rejection queue, automated 30-day/7-day/expired reminders,
  and Private/Marketplace evidence visibility gated by verification, expiry and
  a verified marketplace account.
- [x] Implement production e-signature integration boundary using Dropbox Sign:
  template-backed embedded requests, signer-specific sessions, verified and
  idempotent callback processing, and provider-driven contract status updates.
- [ ] Provision the live Dropbox Sign API app/template/callback configuration,
  confirm the contract wording and run engineer/client signing smoke tests.
- [x] Lock the TechSubbies payment boundary: TechSubbies charges membership
  subscriptions only. Project invoices and payments remain directly between
  companies/resourcing companies and engineers; no project funds, escrow,
  placement commission or success fee passes through TechSubbies.
- [x] Implement Stripe subscription billing and entitlement reconciliation:
  hosted Checkout for new paid memberships, Customer Portal for plan/payment
  management, signed idempotent webhooks, renewal/failure/cancellation state,
  automatic paid-tier reconciliation and read-only Admin billing operations.
- [ ] Provision live Stripe products/prices, Checkout, Customer Portal and
  webhook endpoint; run new subscription, renewal, failed-payment, plan-change
  and cancellation smoke tests.
- [x] Implement contract-support workflows for cancellations, substitutions,
  no-shows, disputes and general support. Cases are contract-linked and audited;
  mutual cancellation is required before a contract is marked Cancelled,
  declined requests move to Admin review, substitutions require a separately
  contracted replacement, and TechSubbies does not determine payment liability.
- [x] Implement authenticated real-time notification and messaging transport:
  Server-Sent Events deliver live messages, conversation changes, read receipts
  and persistent in-app notifications; REST/SQLite remain the durable source of
  truth with reconnect hydration and unread counts.
- [ ] Confirm production proxy/load-balancer SSE buffering and timeout settings;
  introduce shared pub/sub before running more than one backend process.

## P2 - taxonomy and inclusion

- [x] Implement Admin taxonomy governance with versioned role snapshots,
  practitioner approval/rejection by verified Engineers, immutable review
  history and explicit Admin publishing/superseding of approved versions.
- [x] Crosswalk every responsibility expectation to a canonical role ID and
  route downstream role consumers through approved published taxonomy overlays,
  with the source-controlled catalogue retained as the fail-open baseline.
- [x] Add assisted/independent/lead delivery context, last-used dates and
  project scale to completed-work skill evidence. Context is stored on the job,
  carried into evidence trails and explanations, and does not add score merely
  because an engagement was lead-level or large.
- [x] Add accessibility adjustments, languages, remote/on-site preferences and
  alternative evidence routes. Accessibility details are private by default,
  never exposed as company search/ranking criteria, and enter directory data
  only after explicit engineer sharing; work-mode/language preferences are
  searchable only when the engineer has actually declared them.
- [x] Validate adjacent families before adding them. Fibre/telecoms, smart
  buildings/BMS/IoT and residential integration can advance to practitioner
  role drafting; physical security and stage systems require explicit
  compliance/safety gates; broadcast/IP media remains on hold pending a narrower
  practitioner job-task analysis. Candidate IDs remain outside the live
  canonical registry until the existing taxonomy approval/publish gate is used.

## P3 - scale and monetization

- [ ] Validate buyer, engineer and resourcing-company willingness to pay.
- [x] Track marketplace discovery and conversion: company/resourcing-company
  talent searches, engineer profile views and invitations are stored as
  privacy-minimal deduplicated events; applications and bookings come from the
  durable marketplace tables; Admin reports search-to-view, invitation,
  application-to-booking, repeat company/engineer bookings and 30-day retention.
- [ ] Migrate SQLite to managed PostgreSQL before horizontal scaling.
- [ ] Add subscription revenue reporting, tax/accounting reconciliation and
  finance operations once commercial pricing is validated.
