# TechSubbies development plan

## Objective

Move the current marketplace foundation from a broad prototype tranche to a deployable, observable product. The implementation must preserve the central rule: role identity, responsibility, mandatory prerequisites, capability evidence, availability, and commercial workflow remain explicit and independently auditable.

## Current baseline

The repository contains a React/Vite client and an Express/SQLite API. The implemented vertical slice now covers account access, canonical engineer profiles, persisted jobs and applications, explainable shortlisting, exclusion overrides, contracts and signatures, timesheets, membership invoices, document storage, technical work packs, and completion validation.

The quality baseline is:

- TypeScript checks and production builds for both applications.
- Vitest suites for frontend services/contexts and backend routes/domains.
- A Cypress marketplace golden path backed by an isolated SQLite database.
- Docker and Compose deployment assets plus health/readiness endpoints.
- GitHub Actions quality checks.

## Delivery principles

1. Build and test complete user journeys, not disconnected screens.
2. Keep canonical schemas at API boundaries; legacy UI shapes may be accepted only through named adapters.
3. Store business decisions with their explanation and source evidence.
4. Treat generated databases, screenshots, build output, and secrets as disposable local artifacts.
5. Merge small vertical increments that keep all quality gates green.

## Phase 0 — baseline consolidation

Status: complete

- Preserve product and manufacturer experience when canonicalising engineer profiles.
- Make the persisted marketplace Cypress journey pass from registration through completion validation.
- Ignore generated Cypress and SQLite artifacts.
- Establish this plan and an architecture map as the working source of truth.
- Replace the AI Studio-era README with project-specific setup, validation, and deployment instructions.

Exit criteria: clean builds; all unit, API, and E2E tests pass; generated runtime files do not appear in Git status.

## Phase 1 — schema and boundary hardening

Priority: immediate

Status: in progress

- [x] Introduce versioned DTOs for engineer profiles, jobs, and shortlists, with a typed shortlist client boundary.
- [ ] Extend versioned DTOs to contracts and billing responses, then extract the frontend/backend mirrors into a shared package when the container build context is consolidated.
- [x] Remove untyped function boundaries from marketplace canonicalisation and shortlist calculation.
- [ ] Remove remaining internal `any` compatibility reads and untyped job-posting inputs.
- [x] Add migration tests for legacy engineer profiles and single-role jobs into schema v2.
- [x] Validate core marketplace and profile JSON when reading it, with explicit codes for corrupt, invalid-version, and unsupported-version records.
- [x] Extend safe decoding to trust/audit auxiliary payload tables and add an operational read-only integrity report.
- [ ] Add an explicit quarantine/repair workflow; integrity checks must never mutate records automatically.
- [x] Define stable error codes for persisted-data and unhandled API failures in addition to human-readable messages.
- [x] Define stable default codes for validation, authentication, authorization, conflict, rate-limit, and not-found responses while preserving more specific domain codes.

Exit criteria: malformed/legacy records have deterministic outcomes; no untyped marketplace payload crosses an API boundary.

## Phase 2 — access, trust, and audit completeness

Priority: high

- Complete email verification policy and protected-action rules.
- Add account deletion/export and administrative session revocation.
- Persist audit events for shortlist overrides, contract state changes, document access, timesheet approval, and completion validation.
- Add tenant/ownership regression tests to every protected resource route.
- Add document retention, file-type inspection, and malware-scanning integration points.

Exit criteria: each sensitive action has an ownership test and an immutable audit record; account lifecycle controls are functional.

## Phase 3 — commercial production readiness

Priority: high

- Complete Stripe membership checkout, webhook idempotency, invoice reconciliation, cancellation, and retry states.
- Separate membership billing from assignment financial records in UI, API, and reporting.
- Add configurable plans and entitlement checks without hard-coded product IDs.
- Provide finance/admin reconciliation views and export.

Exit criteria: webhook replay is safe; billing state can be reconciled from Stripe; entitlements fail closed.

## Phase 4 — marketplace usability

Priority: medium

- Consolidate role/skill profile editing around the canonical capability model.
- Add saved drafts, explicit validation summaries, and accessible error focus to opportunity intake.
- Add shortlist filters and evidence drill-down while retaining hard exclusion semantics.
- Complete talent-pool/team-assembly workflows against persisted APIs instead of local-only data.
- Add responsive and accessibility browser coverage for the primary journeys.

Exit criteria: company and engineer primary journeys contain no demo-only persistence; WCAG-critical checks pass.

## Phase 5 — operations and scale

Priority: before public launch

- Choose and implement the production database path; SQLite remains appropriate for local/single-instance operation only.
- Add structured metrics, tracing, alert thresholds, backups, restore drills, and deployment rollback documentation.
- Add dependency/security scanning and container image scanning.
- Define SLOs for authentication, marketplace reads/writes, and billing webhooks.
- Load-test shortlist generation and core API routes with production-like data.

Exit criteria: rehearsed backup/restore and rollback; observable SLOs; production data store supports the deployment topology.

## Working sequence

For each increment:

1. Select one exit-criterion-sized vertical slice.
2. Add or update its domain/API tests first.
3. Implement backend persistence and authorization.
4. Connect the frontend through `services/apiService.ts`.
5. Add the browser-path assertion where user-critical.
6. Run `npm run check` and `npm run e2e` before review.
7. Commit without generated runtime artifacts.

## Next implementation slice

Phase 1 should begin with shared marketplace DTOs and typed canonicalisation. It has the highest leverage because shortlisting, contracts, trust, and UI hydration all depend on those shapes.
