# Pricing Research and Willingness-to-Pay Measurement

## Purpose

TechSubbies must validate commercial pricing with real marketplace participants before changing membership prices. This research is intentionally separate from subscription billing and from project payments.

The research covers three account types:

- Engineer
- Company
- Resourcing Company

Each authenticated account can maintain one current pricing-research response. Saving again updates that response rather than creating repeated survey entries from the same person/account.

## What is collected

Each response contains structured fields only:

- overall perceived membership value, scored 1–5;
- likelihood to pay for a useful membership, scored 1–5;
- four monthly price-sensitivity points in GBP;
- preferred monthly/annual billing cadence;
- up to five product value drivers;
- one structured primary blocker.

No free-text pricing comments, search terms, accessibility data, project rates, invoices or project-payment information are stored in this research table.

## Price-sensitivity points

The four price points use this order:

1. `priceTooCheap` — so cheap the service may feel low-value or not credible;
2. `priceGoodValue` — feels like good value for a useful membership;
3. `priceExpensive` — expensive, but still something the respondent would consider;
4. `priceTooExpensive` — too expensive to consider.

The API requires:

`too cheap <= good value <= expensive <= too expensive`

This prevents internally contradictory price bands from entering the aggregate dataset.

## Stated intent versus observed behaviour

A likelihood-to-pay score of 4 or 5 is reported as **likely to pay (stated)**.

This must never be described as revenue, a subscription, a sale or a committed purchase. Admin shows stated research evidence beside actual Stripe subscription state so the two signals stay visibly separate.

Current actual paid-member counts come from the existing subscription-billing repository/provider reconciliation. Pricing research does not activate a plan, grant an entitlement or create a Stripe subscription.

## Segmentation

Admin aggregates responses separately for:

- Engineers;
- Companies;
- Resourcing Companies.

For each segment the dashboard reports:

- response count;
- average perceived value;
- average likelihood to pay;
- number and rate scoring likelihood 4–5;
- median price-sensitivity points;
- billing-cadence preferences;
- top value drivers;
- structured blockers.

A segment with too few responses should be treated as directional research only. Pricing should not be changed from a handful of responses.

## Product boundary

TechSubbies monetizes memberships only.

This research must not introduce or imply:

- project payment processing;
- escrow;
- placement fees;
- success fees;
- percentage commission on engineer rates;
- invoice settlement by TechSubbies.

Project rates, invoices and payments remain direct matters between the contracting parties.

## Recommended pilot interpretation

Pricing decisions should combine three evidence classes:

1. **Stated value** — pricing-research scores and price bands;
2. **Observed marketplace value** — search, profile-view, invitation, application, booking, repeat-booking and retention analytics;
3. **Observed paid behaviour** — Stripe trial, active, past-due, cancellation and renewal state.

Do not optimize to a stated median price if marketplace retention or paid conversion is weak. Conversely, strong marketplace repeat-booking with weak willingness-to-pay responses may indicate the value proposition or plan packaging needs clearer communication rather than simply lowering price.
