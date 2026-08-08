# Marketplace Analytics

P3 marketplace analytics measures whether TechSubbies creates repeatable marketplace activity, not project-payment volume. TechSubbies does not process project payments, escrow, placement commission or success fees.

## Event ownership

Discovery activity that cannot be inferred from durable marketplace records is stored in `marketplace_analytics_events`:

- `search.performed` — a Company or Resourcing Company changes Find Talent criteria or runs a job-based match.
- `profile.viewed` — a Company or Resourcing Company opens an Engineer profile from discovery.
- `invitation.sent` — the posting company uses the current Invite to Apply action for a job/engineer pair.

The event payload is intentionally small: actor user ID, optional subject engineer ID, optional job ID, event type and timestamp. Search text, accessibility details, profile notes and other free-form content are not stored in analytics.

Rapid duplicate events are suppressed server-side: searches within 5 seconds, the same profile view within 60 seconds, and the same invitation target/job within 5 minutes.

## Durable conversion stages

Applications and bookings are not browser-reported analytics events:

- **Applications** come from the `applications` table.
- **Bookings** come from the `contracts` table.

This keeps the most commercially important conversion stages server-owned and prevents a browser from manufacturing successful marketplace outcomes.

There is not currently a separate persisted shortlist feature. `invitation.sent` is therefore the present shortlist/intention stage. If a dedicated shortlist is introduced later, it should become its own event and be reported separately rather than silently redefining invitations.

## Admin metrics

Admin → Marketplace Analytics supports 30-day, 90-day and all-time windows.

- **Searches** — deduplicated discovery searches.
- **Profile views** — deduplicated engineer-profile opens.
- **Invitations** — deduplicated Invite to Apply actions.
- **Applications** — durable application rows created in the selected window.
- **Bookings** — durable contract rows created in the selected window.
- **Profile views per search** — profile views divided by searches. This is a depth ratio and may exceed 1.0.
- **Invitation rate from views** — invitations divided by profile views.
- **Application-to-booking rate** — contracts divided by applications.

## Repeat booking

A booking pair is a `(companyId, engineerId)` pair with at least one contract in the selected window. A repeat booking pair has at least two contracts in that window.

`repeat booking rate = repeat booking pairs / booking pairs`

This measures whether clients return to engineers they have already engaged rather than treating raw contract count as retention.

## 30-day retention

Marketplace activity includes:

- discovery events (search, profile view, invitation),
- company job posts,
- engineer applications,
- contracts for both company and engineer parties.

A user becomes eligible for the 30-day retention metric once 30 days have elapsed since their first recorded marketplace activity. They count as retained if they record any marketplace activity on or after day 30.

`30-day retention = retained eligible users / eligible users`

New users who have not yet had 30 days to return are excluded from the denominator.

## Scaling note

The analytics table currently uses the same SQLite database as the marketplace. P3 PostgreSQL migration should move analytics with the transactional data or into a dedicated event/warehouse pipeline while preserving these metric definitions and privacy boundaries.
