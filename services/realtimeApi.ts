import { API_BASE_URL } from './apiConfig';
import { secureFetch } from './httpClient';
import { NotificationType, type Conversation, type Message, type Notification } from '../types';

type ConversationWithUnread = Conversation & { unreadCount?: number };

async function readJson(response: Response): Promise<unknown> {
  if (!response.ok) {
    let message = `Request failed with status ${response.status}.`;
    try {
      const body = await response.json() as { error?: string };
      if (body.error) message = body.error;
    } catch {
      // Keep the generic status message.
    }
    throw new Error(message);
  }
  return response.json() as Promise<unknown>;
}

function record(value: unknown, label: string): Record<string, unknown> {
  if (typeof value !== 'object' || value === null) throw new Error(`Invalid ${label} response.`);
  return value as Record<string, unknown>;
}

function dateValue(value: unknown, label: string): Date {
  const date = new Date(typeof value === 'string' || typeof value === 'number' ? value : '');
  if (Number.isNaN(date.getTime())) throw new Error(`Invalid ${label} timestamp.`);
  return date;
}

export function toConversation(value: unknown): ConversationWithUnread {
  const data = record(value, 'conversation');
  if (typeof data.id !== 'string' || !Array.isArray(data.participantIds) || !data.participantIds.every(item => typeof item === 'string') || typeof data.lastMessageText !== 'string') {
    throw new Error('Invalid conversation response.');
  }
  return {
    id: data.id,
    participantIds: data.participantIds,
    lastMessageText: data.lastMessageText,
    lastMessageTimestamp: dateValue(data.lastMessageTimestamp, 'conversation'),
    unreadCount: Number(data.unreadCount || 0),
  };
}

export function toMessage(value: unknown): Message {
  const data = record(value, 'message');
  if (typeof data.id !== 'string' || typeof data.conversationId !== 'string' || typeof data.senderId !== 'string' || typeof data.text !== 'string' || typeof data.isRead !== 'boolean') {
    throw new Error('Invalid message response.');
  }
  return { id: data.id, conversationId: data.conversationId, senderId: data.senderId, text: data.text, isRead: data.isRead, timestamp: dateValue(data.timestamp, 'message') };
}

export function toNotification(value: unknown): Notification {
  const data = record(value, 'notification');
  if (typeof data.id !== 'string' || typeof data.userId !== 'string' || !Object.values(NotificationType).includes(data.type as NotificationType) || typeof data.text !== 'string' || typeof data.link !== 'string' || typeof data.isRead !== 'boolean') {
    throw new Error('Invalid notification response.');
  }
  return {
    id: data.id, userId: data.userId, type: data.type as NotificationType, text: data.text, link: data.link, isRead: data.isRead,
    timestamp: dateValue(data.timestamp, 'notification'),
  };
}

export const realtimeApi = {
  async listConversations(): Promise<ConversationWithUnread[]> {
    const response = await secureFetch(`${API_BASE_URL}/conversations/me`);
    const values = await readJson(response);
    if (!Array.isArray(values)) throw new Error('Invalid conversation list response.');
    return values.map(toConversation);
  },

  async listNotifications(): Promise<Notification[]> {
    const response = await secureFetch(`${API_BASE_URL}/notifications/me`);
    const values = await readJson(response);
    if (!Array.isArray(values)) throw new Error('Invalid notification list response.');
    return values.map(toNotification);
  },

  async markConversationRead(conversationId: string) {
    const response = await secureFetch(`${API_BASE_URL}/conversations/${encodeURIComponent(conversationId)}/read`, {
      method: 'POST',
    });
    return readJson(response) as Promise<{ conversationId: string; readerId: string; messageIds: string[]; unreadCount: number }>;
  },

  async markNotificationRead(notificationId: string) {
    const response = await secureFetch(`${API_BASE_URL}/notifications/${encodeURIComponent(notificationId)}/read`, {
      method: 'PATCH',
    });
    return toNotification(await readJson(response));
  },

  async markAllNotificationsRead() {
    const response = await secureFetch(`${API_BASE_URL}/notifications/read-all`, { method: 'POST' });
    return readJson(response) as Promise<{ changed: number }>;
  },
};
