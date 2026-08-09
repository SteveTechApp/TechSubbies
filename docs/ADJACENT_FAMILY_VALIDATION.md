# Adjacent Family Validation

Updated 8 August 2026.

This pass validates whether six adjacent technical markets are sufficiently distinct and evidenced to justify future TechSubbies canonical roles. It does **not** add those roles to the live marketplace catalogue.

## Gate

A candidate family may progress only when:

1. there is credible external evidence for a recognisable occupation or body of skills;
2. the first proposed role has a narrower boundary than the family name itself;
3. overlaps with existing AV/IT roles are documented;
4. safety, regulatory and trade-authority boundaries are explicit;
5. practitioner questions are resolved before a new canonical role snapshot is drafted;
6. the role then passes the existing TechSubbies taxonomy practitioner-approval and Admin-publish workflow.

`data/adjacentFamilyValidation.ts` is the implementation source for these decisions. Candidate IDs are intentionally absent from `baselineCanonicalRoleRegistry`.

## Decisions

| Family | Decision | Proposed first role | Main reason |
| --- | --- | --- | --- |
| Fibre & telecoms | Advance | Fibre Optic Technician | FOA publishes broad technician and specialist KSAs covering installation, splicing, connectors and testing. |
| Physical security | Conditional | Electronic Security Systems Technician | UK occupational scope is clear, but fire/life-safety and compliance boundaries must not be implied. |
| Smart buildings / BMS / IoT | Advance | Building Automation / BMS Engineer | KNX certification and BACnet provide strong vendor-independent building-automation anchors. |
| Broadcast & IP media | Hold | Broadcast / IP Media Systems Engineer | The market is clear, but “broadcast engineer” is too broad without practitioner job-task analysis. |
| Stage & entertainment systems | Conditional | Stage AV Systems Technician | ETCP separates safety-critical rigging/electrical/power disciplines; those must remain outside a generic stage AV role. |
| Residential integration | Advance | Residential Integrated Systems Technician | CEDIA publishes role-specific technician, infrastructure, networking and design certification boundaries. |

## Evidence anchors

### Fibre & telecoms

- Fiber Optic Association CFOT: https://www.thefoa.org/cfot.htm
- Fiber Optic Association KSAs: https://www.thefoa.org/KSAs.html

### Physical security systems

- UK Fire emergency and security systems technician Level 3 occupational standard/training scope: https://findapprenticeshiptraining.apprenticeships.education.gov.uk/courses/126

The standard includes CCTV, access control, intruder and fire systems. TechSubbies should not infer fire/life-safety competence from a general electronic-security role; those capabilities need their own compliance model.

### Smart buildings / BMS / IoT

- KNX professional certification: https://www.knx.org/professionals/getting-knx-certified
- BACnet International: https://bacnetinternational.org/

KNX explicitly covers system design, ETS and commissioning. BACnet provides a vendor-independent building automation communications standard. Neither credential implies electrical installation or HVAC mechanical trade authority.

### Broadcast & IP media

- SMPTE: https://www.smpte.org/

SMPTE standards/training are a credible technology anchor, particularly for professional media-over-IP, but do not by themselves provide a narrow TechSubbies marketplace role definition. Practitioner task analysis is still required.

### Stage & entertainment systems

- ESTA Entertainment Technician Certification Program: https://etcp.esta.org/etcp/about.html

ETCP maintains separate certifications for arena/theatre rigging, entertainment electricians and portable power distribution because those disciplines affect crew, performer and audience safety. The first TechSubbies role therefore remains limited to stage AV/system support unless separate safety-critical role definitions are validated later.

### Residential integration / smart home

- CEDIA certification programme: https://cedia.org/en-us/smart-home-professionals/education/certification/
- CEDIA Integrated Systems Technician: https://cedia.org/en-us/smart-home-professionals/certifications/ist-certification/

CEDIA distinguishes cabling/infrastructure, integrated systems technician, residential networking and design competence. That is a strong basis for a dedicated residential family while retaining separate skill evidence for networking/design depth.

## Promotion path

An `advance` decision means **advance to practitioner validation**, not “add to production”. The next role-expansion pass should take one proposed role at a time, convert it into a full `RoleSkillDefinition`, obtain verified practitioner review through the existing taxonomy workflow, and only then consider extending the permanent canonical-ID baseline.

`conditional` candidates need their safeguard questions resolved first. `hold` candidates need narrower job-task analysis before role drafting begins.
