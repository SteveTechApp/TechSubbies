# Engineer Profile Data Collection Audit

## Purpose

The engineer profile should not only be a CV replacement. It should become a structured evidence record that helps companies decide whether an engineer is suitable, available, compliant and trustworthy for a specific job.

## Already present in the app

The current app already has useful foundations:

- Core engineer profile data.
- CV upload reference.
- Certification list with supporting documents.
- Compliance and identity fields.
- Case studies / portfolio links.
- Reviews.
- Jobs, applications, contracts, invoices and conversations.

## Gaps to close

### 1. Professional certificates, qualifications and awards

Current certification data is too light. It needs enough structure to support filtering, verification and expiry warnings.

Recommended fields:

| Field | Reason |
|---|---|
| Certificate / qualification name | Searchable proof of capability |
| Issuer / awarding body | Separates credible sources from self-claimed skills |
| Category | Professional, safety, site access, manufacturer, award |
| Level / grade | Required for tiered credentials |
| Issue date | Shows recency |
| Expiry / renewal date | Important for site-access and compliance checks |
| Verification status | Pending, verified, rejected, expired |
| Verified by | Admin, resourcing company, automated check or customer |
| Visibility | Private, verified companies only, public profile |
| Evidence document URL | Upload reference |
| Notes / scope covered | Plain-English explanation of what it proves |

### 2. Customer feedback and case studies

Case studies need structured evidence rather than a loose external link.

Recommended fields:

| Field | Reason |
|---|---|
| Project title | Clear project reference |
| Customer / site name | Can be public, anonymised or private |
| Customer permission status | Avoids displaying client evidence without permission |
| Site type | Office, education, hospitality, retail, residential, public sector |
| Project type | Install, commissioning, support, rack build, service visit |
| Completion date | Helps judge current experience |
| Customer feedback / outcome | Shows result, not just activity |
| Document evidence | Testimonial, completion note, sign-off sheet |
| Photo evidence | Visual proof of installation quality |
| Short video evidence | Useful for demos, walkthroughs and before/after proof |
| Visibility | Private, verified companies only, public profile |
| Verification status | Pending, verified, rejected |

### 3. Availability and working area

A single availability date is not enough for practical subcontractor matching.

Recommended fields:

- Available date ranges.
- Recurring weekly availability.
- Normal working days.
- Weekend availability.
- Evening / overnight availability.
- Emergency callout availability.
- Remote support availability.
- Notice period.
- Travel radius.
- Willingness to stay away overnight.
- Public-holiday rules.
- Own transport confirmation.
- Preferred project duration.

### 4. Product and platform awareness

The profile should capture product familiarity separately from general skills.

Recommended fields:

- Brand / vendor.
- Product family.
- Product category.
- Self-rated awareness level.
- Hands-on install experience.
- Commissioning experience.
- Troubleshooting experience.
- Certification / training link.
- Date last used.

### 5. Search and matching data

The matching engine needs structured evidence rather than free text.

Recommended datasets:

| Dataset | Purpose |
|---|---|
| `professionalCredentials` | Certificates, awards, qualifications and expiry data |
| `workEvidence` | Feedback, testimonials, case studies and media proof |
| `verificationEvents` | Audit log for verification actions |
| `availabilityWindows` | Searchable date and working-area availability |
| `siteAccessCredentials` | ECS, CSCS, IPAF, PASMA, DBS, first aid, access training |
| `customerConsentRecords` | Permission to show customer names, photos and videos |
| `productExperienceRecords` | Structured product and platform exposure |
| `workHistoryRecords` | Completed work linked to contracts, feedback and evidence |

## Implementation notes

- Do not make all evidence public by default.
- Keep uploaded documents private until verified and permissioned.
- Separate self-claimed skills from verified evidence.
- Track expiry dates and warn both the engineer and companies when documents are out of date.
- Link evidence to completed contracts where possible, so feedback becomes harder to fake.
- Allow anonymised case studies for projects where customer names cannot be published.
