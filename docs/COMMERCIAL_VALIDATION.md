# Commercial validation decision gate

P3.3 turns marketplace analytics, pricing research and observed membership billing into a controlled decision workflow. It does **not** change live membership prices or entitlements.

## Purpose

Pricing research is stated intent. Marketplace activity is observed product use. Stripe subscription state is observed willingness to pay for account types that can currently buy a membership. The Admin decision gate keeps these evidence types separate and prevents a pricing hypothesis from being treated as validated merely because one signal looks positive.

## Initial evidence thresholds

The thresholds are deliberately modest pilot gates, not statistical proof:

- at least **10 pricing-research responses** for the account type;
- at least **5 engaged marketplace accounts in the previous 90 days**;
- at least **40% stated likely-to-pay rate** (scores 4–5 in Pricing Research);
- average perceived-value score of at least **3.5 / 5**;
- for Engineers only, at least **3 active or trial paid Stripe accounts** before billing behaviour is labelled observed evidence.

Thresholds are defined in `COMMERCIAL_VALIDATION_THRESHOLDS` and must be changed intentionally with tests and documentation.

## Evidence stages

### Insufficient evidence

One or more research, marketplace-usage or stated-value gates are not met. Admin may record a package hypothesis, but the API refuses cohort approval.

### Cohort test ready

Research, marketplace usage and stated-value gates are met. Admin may approve a package hypothesis for a controlled cohort test. Approval captures an immutable evidence snapshot.

For Company and Resourcing Company accounts, this is currently the strongest available stage because Stripe membership checkout is not implemented for those roles. Their billing evidence is reported as **unavailable**, not zero.

### Observed evidence ready

The controlled-cohort gates are met and the account type also has the required observed paid-subscription signal. At present only Engineers can reach this stage because `/api/billing` is Engineer-only.

This stage still does not automatically justify or publish a production price change.

## Role-level marketplace evidence

The 90-day engagement count uses activity appropriate to the current product implementation:

- **Engineer:** applications and contracts;
- **Company / Resourcing Company:** recorded talent discovery events, posted jobs and contracts.

If an account type has little or no instrumented activity because its workflow is not yet implemented end-to-end, the gate remains unmet rather than inferring demand.

## Package hypotheses

Admin can record:

- target account type;
- package name;
- candidate monthly price;
- optional candidate annual price;
- primary value driver.

A hypothesis starts as `draft`. It may move to:

- `approved-for-cohort` only when the role meets the cohort evidence gate;
- `rejected`;
- `completed` only after it was approved for a cohort.

Approval stores the current role-validation evidence in `evidenceSnapshot`. Later changes in marketplace or pricing-research data do not rewrite the approval basis.

## Production pricing boundary

The commercial-validation API has no route that edits:

- `MEMBERSHIP_PLANS`;
- Stripe products or prices;
- membership entitlements;
- checkout price IDs.

Production pricing remains a separate explicit decision after controlled-cohort results are reviewed.

## Payment boundary

TechSubbies monetizes membership subscriptions only. Project rates, invoices and payments remain direct between members. Commercial validation must never introduce escrow, settlement, success fees, placement commission or percentage-of-project-value charging.

## Validation

```powershell
cd C:\Users\steve\TechSubbies

cd backend
npm test
npm run build

cd ..
npm run typecheck
npm test
npm run build
```
