# TechSubbies Subscription Billing

## Product boundary

TechSubbies uses payment processing only for TechSubbies membership subscriptions.

TechSubbies does **not**:

- process engineer or contractor project invoices;
- receive or hold client project funds;
- provide project escrow;
- deduct placement, transaction or success commission from work fees; or
- intermediate settlement between companies, resourcing companies and engineers.

Project invoicing and payment remain directly between the contracting parties.

## Membership plans

The application currently defines these monthly engineer memberships:

| Tier | Monthly price | Stripe configuration |
| --- | ---: | --- |
| Bronze | £0 | No Stripe subscription required |
| Silver | £7 | `STRIPE_PRICE_SILVER` |
| Gold | £15 | `STRIPE_PRICE_GOLD` |
| Platinum | £35 | `STRIPE_PRICE_PLATINUM` |

The Stripe Price IDs are deployment configuration. Do not hard-code live Price IDs in source control.

## Billing flow

### New paid membership

1. Engineer selects Silver, Gold or Platinum in Membership & Billing.
2. Backend creates a Stripe Checkout Session in `subscription` mode.
3. Stripe hosts payment collection. TechSubbies does not receive card details.
4. Stripe sends subscription webhooks to the backend.
5. TechSubbies reconciles the paid tier only from the verified Stripe subscription state.

### Existing paid membership

An existing Stripe customer is sent to the Stripe Customer Portal for supported plan changes, cancellation and payment-method management. The local application does not directly mutate paid entitlement state from browser actions.

### Renewal failure

`invoice.payment_failed` records a payment issue and moves an active/trialing local billing record to `past_due`. The paid membership remains available while Stripe retries collection. The member is notified to update their payment method.

### Recovery

`invoice.paid` clears the recorded payment failure. If the local state is `past_due`, the membership is immediately reconciled back to `active`.

### Cancellation / unpaid termination

When Stripe reports a subscription state that no longer grants paid access, TechSubbies returns the engineer entitlement to Bronze. A subscription that is still `active` but has `cancel_at_period_end=true` keeps its paid tier until Stripe reports the subscription ended.

## Webhook endpoint

Configure the Stripe webhook endpoint as:

`https://<backend-host>/api/billing/stripe/webhook`

Required events:

- `checkout.session.completed`
- `customer.subscription.created`
- `customer.subscription.updated`
- `customer.subscription.deleted`
- `invoice.paid`
- `invoice.payment_failed`

Webhook requests are verified against the exact raw JSON body using `STRIPE_WEBHOOK_SECRET`. Event IDs are persisted to make processing idempotent.

## Production environment

Required:

```text
BILLING_PROVIDER=stripe
STRIPE_SECRET_KEY=sk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...
STRIPE_PRICE_SILVER=price_...
STRIPE_PRICE_GOLD=price_...
STRIPE_PRICE_PLATINUM=price_...
```

Production startup rejects Stripe test secret keys.

## Stripe Customer Portal

Enable the Customer Portal features TechSubbies wants members to self-manage, including:

- payment-method updates;
- invoice/receipt history;
- subscription cancellation; and
- switching between the configured TechSubbies paid membership prices, if plan switching is enabled commercially.

The portal return URL is generated from `FRONTEND_ORIGIN`.

## Entitlement authority

Paid membership state must never be granted by an Admin button or a browser profile update. When `BILLING_PROVIDER=stripe` is enabled:

- the legacy membership-selection endpoint cannot be used to grant paid access;
- the legacy Admin billing-confirmation endpoint cannot activate a paid tier; and
- Stripe subscription webhooks are the paid-entitlement authority.

Admin Subscription Billing is intentionally read-only for entitlement state.

## Migration before live switch

Before enabling `BILLING_PROVIDER=stripe` in production, review any historically/manual activated Silver, Gold or Platinum profiles. Each genuinely paid member must either:

1. be migrated to an equivalent Stripe subscription/customer and reconciled through Stripe; or
2. be intentionally returned to Bronze.

Do not leave a manually granted paid profile tier as an untracked production entitlement after the Stripe cutover.

## Deployment smoke test

Before launch, verify at minimum:

1. Bronze engineer can start Silver/Gold/Platinum Checkout.
2. Successful Checkout creates the Stripe customer/subscription and activates the expected tier through webhook processing.
3. Customer Portal opens for an existing subscriber.
4. Paid plan change updates the TechSubbies tier through `customer.subscription.updated`.
5. Failed renewal becomes `past_due` without immediately removing paid access.
6. Subsequent successful payment clears the warning and restores `active`.
7. Cancellation at period end retains paid access until the end date.
8. Final subscription cancellation returns entitlement to Bronze.
9. Forged/stale webhook signatures are rejected.
10. Duplicate webhook events do not repeat entitlement changes.
11. No project-payment or project-invoice action is routed through Stripe or TechSubbies.
