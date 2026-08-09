# Role Skill Builder

The Role Skill Builder is the foundation for high-quality TechSubbies engineer profiles.

## Purpose

Instead of asking engineers to create a generic CV-style profile or complete dozens of numeric sliders, TechSubbies asks them to choose a job role and make a small number of practical claims.

The primary interaction model is:

1. Overall role capability: **Assist, Deliver, Diagnose or Lead**.
2. Distinguishing capabilities: **Yes independently, With support or Not offered**.
3. Product/software experience: **Aware, Installed, Configured, Commissioned/troubleshot, Programmed/administered or Certified**.
4. One supporting project, credential or evidence example.

Legacy numeric ratings remain readable for existing saved profiles, but are not presented in the main workflow.

Clients select a role and responsibility arrangement. The normal skills are inferred from the role template; clients may add at most three genuine software, manufacturer or technical prerequisites.

## Profile hierarchy

- **Engineer** is the account type, not a technical role.
- Every engineer receives one free **General AV Skills Profile** or **General IT Skills Profile**. It provides limited visibility for genuinely general support work and never proves a named specialist role.
- A **job-role profile** represents a deployable function such as Network Engineer, AV Control Systems Programmer or IT Service Desk Engineer.
- A **skill** is a practical competency rated inside a job-role or general-sector profile. A skill must not be promoted into a role.
- **Product knowledge** records practical experience with software, platforms, protocols or hardware manufacturers. Customers can mark a minimum product-experience level as a prerequisite.

Engineers can opt out of low-responsibility matching. General profiles exclude commissioning, programming, design authority, privileged administration and lead responsibility unless a corresponding job-role profile is selected and rated.

## Installed files

- types/roleSkills.ts
- data/roleSkillTaxonomy.ts
- services/roleSkillEngine.ts
- views/RoleSkillBuilderPage.tsx

## Initial seeded roles

- AV Installation Engineer
- AV-over-IP Commissioning Engineer
- UC Room Engineer
- LED Wall Technician
- Audio / DSP Technician
- Network Engineer
- Wi-Fi Engineer
- Microsoft 365 Support Engineer
- Rack Build Engineer

## Matching principle

A good project match should consider:

- selected role profile
- individual skill ratings
- required skill gaps
- products and brands
- platforms
- evidence
- availability
- location
- compliance documents

## Next improvements

- Persist engineer role profiles
- Allow multiple specialist profiles per engineer
- Add upload handling for evidence
- Add company-side search based on role skill ratings
- Add match score explanations
- Add admin taxonomy editor
