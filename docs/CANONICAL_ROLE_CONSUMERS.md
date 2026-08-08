# Canonical Role Consumer Contract

Updated 8 August 2026.

## Purpose

TechSubbies has one stable role identity contract across engineer profiles, job intake, matching and responsibility guidance. Role content can evolve through taxonomy governance, but marketplace identity must not drift when titles or descriptions change.

## Stable identity

- `canonicalRoleId` is the persisted/API identity for a marketplace role.
- Canonical IDs come from the source-controlled AV/IT role registry and are not changed by taxonomy publishing.
- Historic responsibility-template IDs are compatibility inputs only. They are explicitly crosswalked to canonical IDs in `data/canonicalRoleIds.ts` and server-side in `backend/src/lib/canonicalRoles.ts`.
- Free-text role names are display/search content, not trusted identifiers.

## Responsibility expectations

`data/roleExpectations.ts` remains the responsibility/supervision layer. It expresses boundaries such as labour, junior, competent, senior, lead and specialist work, including supervision, evidence and site-readiness expectations.

Every responsibility expectation ID must map to an existing canonical role ID. Regression coverage fails if an expectation is added without a crosswalk.

Responsibility templates do not replace canonical taxonomy. Multiple responsibility bands may legitimately resolve to the same canonical role while preserving different supervision and accountability rules.

## Published taxonomy overlays

The source-controlled `baselineCanonicalRoleRegistry` is the safe fallback catalogue. Approved Admin/practitioner taxonomy versions may replace the content of an existing role ID at runtime.

At application bootstrap:

1. TechSubbies requests the published taxonomy catalogue.
2. Approved snapshots are applied only when their IDs already exist in the baseline registry.
3. Existing role consumers continue using `canonicalRoleRegistry`, whose array identity remains stable while its role objects are replaced by approved overlays.
4. If the catalogue request fails or takes more than 2.5 seconds, startup continues using the baseline catalogue.

This prevents a taxonomy outage from blocking signup or marketplace access while ensuring approved role wording and skills reach downstream consumers when available.

## Job intake and persistence

The standard job-post flow now selects a canonical role ID directly from the effective role catalogue and retains the approved role title for display/AI skill suggestion context.

The backend canonicalises roles at both create and update boundaries. A legacy responsibility ID is converted to its canonical ID; an unknown/free-text role cannot replace the trusted canonical identifier. Public job projections also expose a canonical ID whenever one can be recovered from historic data.

## Consumer rules

New marketplace features should:

- persist and compare `canonicalRoleId`, not role title;
- obtain role content from the effective canonical catalogue;
- use responsibility expectation IDs only for responsibility/supervision behaviour;
- never publish a taxonomy overlay with a new/unrecognised role ID;
- retain compatibility reads for historic records, but write canonical IDs back at trust boundaries.

## Tests

Coverage includes:

- every responsibility expectation maps to a real canonical role;
- published overlays replace content without changing catalogue identity/size;
- baseline fallback is restored if taxonomy retrieval fails;
- published taxonomy can be read before authentication for signup/bootstrap;
- legacy role IDs are canonicalised on job create and update;
- unrecognised role changes are rejected;
- the job-post selector persists a canonical role ID while showing the approved role title.
