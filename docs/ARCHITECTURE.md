# Architecture

## Runtime applications

- `index.tsx`, `App.tsx`: browser entry point and route-level composition.
- `views/`: route and dashboard views. Views own page composition and user journeys.
- `components/`: reusable UI and workflow panels. Compatibility re-exports may live here temporarily but new route views belong in `views/`.
- `context/`: authenticated user, persisted data, and interaction state providers.
- `services/`: frontend API clients and pure matching/trust helpers.
- `types/`: frontend/shared domain contracts pending extraction into a dedicated shared package.
- `data/`: static taxonomies, reference content, and local runtime databases. Database files are never source-controlled.
- `backend/src/routes/`: HTTP validation, authorization, and response mapping.
- `backend/src/domain/`: canonicalisation and pure business decisions.
- `backend/src/lib/`: persistence and infrastructure adapters.
- `backend/src/billing/`: membership billing provider integration.

## Dependency direction

UI views depend on components, contexts, services, and types. Frontend services call HTTP routes. Routes validate and authorize requests, then call domain and persistence code. Domain code must not depend on Express or React. Infrastructure code must not contain UI policy.

## Canonical data boundaries

Engineer registration canonicalises role profiles into profile schema v2. Job creation canonicalises role requirements into job schema v2. These boundary functions must preserve all information used by downstream decisions, especially role identity, responsibility, capabilities, product experience, prerequisites, evidence, and availability.

Shortlisting is server-authoritative. The browser displays the recorded outcome and reasons; it must not independently recreate eligibility rules. A hard exclusion can only be bypassed with a persisted written override.

## Persistence

SQLite is accessed through `backend/src/lib/db.ts`. Tests use isolated database files. Local and E2E databases, WAL files, build output, and Cypress evidence are generated artifacts and ignored by Git.

## Quality gates

- `npm run typecheck`: frontend static analysis.
- `npm test`: frontend unit tests.
- `npm run build`: frontend production build.
- `npm test --prefix backend`: backend domain/API tests.
- `npm run build --prefix backend`: backend build.
- `npm run e2e`: persisted browser golden path.
- `npm run check`: consolidated non-browser quality gate.

Changes to authentication, authorization, canonicalisation, persistence, contracts, billing, or trust decisions require regression coverage at the relevant boundary.
