# Real-time Messaging and Notifications

## Architecture

TechSubbies keeps REST and SQLite as the durable source of truth. Real-time delivery is an authenticated Server-Sent Events (SSE) layer on top of that state rather than a replacement for it.

- Browser writes still use normal authenticated REST requests.
- The backend persists messages, read state and in-app notifications first.
- The backend then publishes a short-lived event to the affected signed-in user.
- The dashboard holds one authenticated SSE connection to `/api/realtime/events`.
- Native EventSource reconnection is used after a temporary network interruption.
- On every successful connection/reconnection, the browser reloads conversation summaries and notifications from REST so a missed transient event cannot leave the UI permanently stale.

## Delivered event types

- `message.created` — a new persisted message for the recipient.
- `conversation.updated` — last-message preview/unread state changed.
- `conversation.read` — one party marked incoming messages as read; used for unread badges and Seen state.
- `notification.created` — a new durable in-app notification.
- `notification.read` — one or all notifications were marked read.

The stream also sends `realtime.connected` with current unread message and notification totals and sends a comment heartbeat every 25 seconds.

## Authentication and privacy

The SSE endpoint uses the same authenticated session cookie as the rest of TechSubbies. EventSource is created with credentials enabled. Events are published to one authenticated user id only; the in-memory hub does not broadcast a global marketplace stream.

Message history and notifications are still permission-checked through their REST routes. SSE event data is treated as a delivery convenience, not as an authorization boundary or system of record.

## Read and unread state

The existing `messages.isRead` column stores chat read state. A participant opening a conversation calls the read endpoint, which marks only messages sent by the other participant as read. Conversation summaries calculate an unread count for the current user.

In-app notifications are stored in `user_notifications` and have their own read state. Opening the notification panel persists read-all state to the backend instead of only clearing the badge locally.

## Production proxy requirements

The production proxy/load balancer must support long-lived HTTP responses:

- disable response buffering for `/api/realtime/events`;
- allow `text/event-stream` responses to flush immediately;
- set idle/read timeouts comfortably above the 25-second heartbeat interval;
- avoid caching or compression behaviour that delays small event frames;
- preserve authenticated cookies and the configured CORS origin.

A production smoke test should open two authenticated browser sessions and confirm new messages, unread badges, notifications and Seen state update without manual refresh.

## Current single-process boundary

`realtimeHub.ts` is intentionally an in-process per-user event hub. That matches the current SQLite/single-backend deployment phase and avoids introducing infrastructure that TechSubbies does not yet need.

Before running multiple backend processes or horizontally scaling the service, replace or bridge this hub with shared pub/sub (for example Redis, a managed message bus, or equivalent). Otherwise a browser connected to process A would not receive an event produced by process B.

The REST/SQLite persistence model means this limitation affects immediacy only, not data durability: reconnect hydration still recovers the authoritative state.
