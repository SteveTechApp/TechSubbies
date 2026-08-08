import { API_BASE_URL } from './apiConfig';
import { secureFetch } from './httpClient';
import type { Conversation, Notification } from '../types';

type ConversationWithUnread = Conversation & { unreadCount?: number };

async function readJson<T>(response: Response): Promise<T> {
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
  return response.json() as Promise<T>;
}

function toConversation(value: any): ConversationWithUnread {
  return {
    ...value,
    lastMessageTimestamp: new Date(value.lastMessageTimestamp),
    unreadCount: Number(value.unreadCount || 0),
  } as ConversationWithUnread;
}

function toNotification(value: any): Notification {
  return {
    ...value,
    timestamp: new Date(value.timestamp),
  } as Notification;
}

export const realtimeApi = {
  async listConversations(): Promise<ConversationWithUnread[]> {
    const response = await secureFetch(`${API_BASE_URL}/conversations/me`);
    const values = await readJson<any[]>(response);
    return values.map(toConversation);
  },

  async listNotifications(): Promise<Notification[]> {
    const response = await secureFetch(`${API_BASE_URL}/notifications/me`);
    const values = await readJson<any[]>(response);
    return values.map(toNotification);
  },

  async markConversationRead(conversationId: string) {
    const response = await secureFetch(`${API_BASE_URL}/conversations/${encodeURIComponent(conversationId)}/read`, {
      method: 'POST',
    });
    return readJson<{ conversationId: string; readerId: string; messageIds: string[]; unreadCount: number }>(response);
  },

  async markNotificationRead(notificationId: string) {
    const response = await secureFetch(`${API_BASE_URL}/notifications/${encodeURIComponent(notificationId)}/read`, {
      method: 'PATCH',
    });
    return readJson<Notification>(response);
  },

  async markAllNotificationsRead() {
    const response = await secureFetch(`${API_BASE_URL}/notifications/read-all`, { method: 'POST' });
    return readJson<{ changed: number }>(response);
  },
};
