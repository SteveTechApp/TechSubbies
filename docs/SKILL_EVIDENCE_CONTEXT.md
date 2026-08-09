# Skill evidence context

P2.3 adds context to completed-work skill evidence without turning context into an automatic competence score.

## Captured on a job

New job posts can record:

- `deliveryContext`: `assisted`, `independent`, or `lead`
- `projectScale`: `small`, `medium`, `large`, or `programme`

The job posting UI explains that these values become evidence context only after the work is completed and reviewed.

For historic jobs, a confirmed supervision arrangement can recover `assisted` delivery. TechSubbies does not infer `lead` delivery or project scale from a title, day rate or seniority label.

## Skill evidence

When a reviewed completed job required a named skill, the evidence record now carries:

- the company rating
- completed-work date
- delivery context when known
- project scale when known

`computeSkillEvidence` exposes:

- the effective evidence-adjusted score
- `lastUsedDate`, based on the most recent completed-job evidence
- the observed delivery contexts
- the observed project scales
- an evidence trail whose completed-work labels include context

## Scoring boundary

Delivery context and project scale do **not** add score by themselves.

A five-star reviewed job contributes the same numeric evidence weight whether it was a small assisted task or a large lead engagement. Context is available to explain and later qualify a match, but it cannot substitute for the actual reviewed performance or required skill level.

This prevents a large-project title or a lead label from becoming an unsupported competence multiplier.

## Legacy behaviour

Existing jobs without the new fields continue to work. Where a historic job explicitly records `supervised`, `lead_engineer_present`, or `qualified_engineer_present`, its completed-work evidence is labelled `assisted`. Missing project scale remains unknown rather than guessed.
