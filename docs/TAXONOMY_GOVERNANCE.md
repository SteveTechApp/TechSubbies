# Taxonomy governance

TechSubbies uses a source-controlled canonical AV/IT role registry as the stable baseline for profile creation, job intake and matching. The taxonomy governance workflow adds controlled, versioned change management without allowing an Admin draft to change live role definitions immediately.

## Workflow

1. Admin opens **Role Taxonomy** and selects a canonical role.
2. Admin creates a new draft version from the current published version, or from the source-controlled baseline when no governed version has been published.
3. The draft can update role metadata, suitability/project examples, tags, evidence types and the complete skill-group structure.
4. Admin records a meaningful change note and submits the draft for practitioner review.
5. Submission locks the draft.
6. A verified Engineer opens **Taxonomy Review** and approves or rejects the proposed version with a review note.
7. Rejected versions remain immutable audit history. Admin creates a later version to address the feedback.
8. Approved versions still do not become authoritative automatically. Admin must explicitly publish them.
9. Publishing supersedes the previously published governed version for that role.

## States

- `draft` — editable by Admin.
- `in_review` — locked and waiting for practitioner review.
- `approved` — practitioner-approved and waiting for Admin publish.
- `rejected` — closed; retained for audit/history.
- `published` — current governed version for the role.
- `superseded` — previously published version retained for history.

Only one open (`draft`, `in_review`, or `approved`) version is allowed for a role at a time.

## Access controls

- Only Admin accounts can create, edit, submit or publish role versions.
- Only Engineer accounts can perform practitioner review.
- Practitioner review mutations use the existing verified-email guard.
- Company and Resourcing Company accounts cannot approve taxonomy definitions.
- Published versions and their review history are available to authenticated application clients through the taxonomy API.

## Data model

`taxonomy_role_versions` stores immutable version history including the full proposed role snapshot, version number, status, change note, creator, timestamps and publisher.

`taxonomy_role_reviews` stores practitioner decisions separately, including reviewer identity, decision, note and timestamp.

The workflow deliberately stores a full role snapshot per version rather than only a patch. This makes each historic version independently auditable and avoids replaying a long chain of patches to reconstruct what was approved.

## Relationship to the canonical registry

The source-controlled `data/canonicalRoleRegistry.ts` remains the baseline and fallback. Published governed versions are exposed as versioned overlays. This P2.1 workflow does not silently rewrite source files or mutate active matching rules from an unapproved browser edit.

The next taxonomy pass should crosswalk responsibility expectations and role consumers to the canonical IDs/published overlay contract so all downstream matching behaviour has an explicit, testable migration path.
