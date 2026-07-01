# TechSubbies Matching Engine V1

## Purpose

This upgrade introduces the first reusable matching engine for TechSubbies.

It compares an opportunity against candidate profiles using:

- role fit
- must-have skills
- nice-to-have skills
- product/platform/technology experience tags
- explanation of match reasons
- risk/gap prompts
- next qualification questions

## Outcome labels

The engine returns one of:

- GOOD MATCH
- PARTIAL MATCH
- NO MATCH

These labels are deliberately simple because buyers need quick confidence, not a hidden scoring model.

## Product knowledge

Product knowledge stays separate from role skills.

A role says what the person can do.
A product tag says what brands, platforms or technologies they know.

Example:

- Role: Audio Commissioning Engineer
- Product tags: Q-SYS - Commissioned, Shure - Configured, Biamp - Troubleshot

## Installed files

- types/opportunityMatching.ts
- services/opportunityMatchEngine.ts
- data/sampleOpportunityMatching.ts
- views/OpportunityMatchingDemoPage.tsx
- docs/matching-engine-v1.md
