import { randomUUID } from "node:crypto";

export type RealtimeEventType =
  | "message.created"
  | "conversation.updated"
  | "conversation.read"
  | "notification.created"
  | "notification.read";

export type RealtimeEvent = {
  id: string;
  type: RealtimeEventType;
  userId: string;
  payload: Record<string, unknown>;
  createdAt: string;
};

type Listener = (event: RealtimeEvent) => void;

const listenersByUser = new Map<string, Set<Listener>>();

export function subscribeRealtime(userId: string, listener: Listener) {
  let listeners = listenersByUser.get(userId);
  if (!listeners) {
    listeners = new Set();
    listenersByUser.set(userId, listeners);
  }
  listeners.add(listener);
  return () => {
    const current = listenersByUser.get(userId);
    current?.delete(listener);
    if (current?.size === 0) listenersByUser.delete(userId);
  };
}

export function publishRealtime(
  userId: string,
  type: RealtimeEventType,
  payload: Record<string, unknown>
): RealtimeEvent {
  const event: RealtimeEvent = {
    id: randomUUID(),
    type,
    userId,
    payload,
    createdAt: new Date().toISOString(),
  };
  for (const listener of listenersByUser.get(userId) || []) listener(event);
  return event;
}

export function activeRealtimeConnections(userId?: string) {
  if (userId) return listenersByUser.get(userId)?.size || 0;
  let total = 0;
  for (const listeners of listenersByUser.values()) total += listeners.size;
  return total;
}
