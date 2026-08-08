import { useEffect } from 'react';
import { useAppContext } from '../context/InteractionContext';
import { realtimeService } from '../services/realtimeService';
import { realtimeApi } from '../services/realtimeApi';

function toConversation(value: any) {
  return { ...value, lastMessageTimestamp: new Date(value.lastMessageTimestamp), unreadCount: Number(value.unreadCount || 0) };
}

function toMessage(value: any) {
  return { ...value, timestamp: new Date(value.timestamp) };
}

function toNotification(value: any) {
  return { ...value, timestamp: new Date(value.timestamp) };
}

export const RealtimeBridge = () => {
  const { user, setAppData } = useAppContext();

  useEffect(() => {
    if (!user) {
      realtimeService.disconnect();
      return;
    }

    const mergeConversation = (conversation: any) => {
      const normalized = toConversation(conversation);
      setAppData(previous => {
        const exists = previous.conversations.some(item => item.id === normalized.id);
        return {
          ...previous,
          conversations: exists
            ? previous.conversations.map(item => item.id === normalized.id ? { ...item, ...normalized } : item)
            : [normalized, ...previous.conversations],
        };
      });
    };

    const onConnected = () => {
      void Promise.all([realtimeApi.listConversations(), realtimeApi.listNotifications()])
        .then(([conversations, notifications]) => {
          setAppData(previous => ({ ...previous, conversations, notifications }));
        })
        .catch(() => undefined);
    };

    const onMessageCreated = (payload: any) => {
      if (!payload?.message) return;
      const message = toMessage(payload.message);
      setAppData(previous => ({
        ...previous,
        messages: previous.messages.some(item => item.id === message.id)
          ? previous.messages.map(item => item.id === message.id ? message : item)
          : [...previous.messages, message],
      }));
      if (payload.conversation) mergeConversation(payload.conversation);
    };

    const onConversationUpdated = (payload: any) => {
      if (payload?.conversation) mergeConversation(payload.conversation);
    };

    const onConversationRead = (payload: any) => {
      const ids = new Set<string>(Array.isArray(payload?.messageIds) ? payload.messageIds : []);
      setAppData(previous => ({
        ...previous,
        messages: previous.messages.map(message => ids.has(message.id) ? { ...message, isRead: true } : message),
        conversations: previous.conversations.map(conversation =>
          conversation.id === payload?.conversationId && payload?.readerId === user.id
            ? { ...conversation, unreadCount: 0 }
            : conversation
        ),
      }));
    };

    const onNotificationCreated = (payload: any) => {
      if (!payload?.notification) return;
      const notification = toNotification(payload.notification);
      setAppData(previous => ({
        ...previous,
        notifications: previous.notifications.some(item => item.id === notification.id)
          ? previous.notifications.map(item => item.id === notification.id ? notification : item)
          : [notification, ...previous.notifications],
      }));
    };

    const onNotificationRead = (payload: any) => {
      setAppData(previous => ({
        ...previous,
        notifications: payload?.all
          ? previous.notifications.map(item => item.userId === user.id ? { ...item, isRead: true } : item)
          : previous.notifications.map(item => item.id === payload?.notification?.id ? { ...item, isRead: true } : item),
      }));
    };

    realtimeService.subscribe('realtime.connected', onConnected);
    realtimeService.subscribe('message.created', onMessageCreated);
    realtimeService.subscribe('conversation.updated', onConversationUpdated);
    realtimeService.subscribe('conversation.read', onConversationRead);
    realtimeService.subscribe('notification.created', onNotificationCreated);
    realtimeService.subscribe('notification.read', onNotificationRead);
    realtimeService.connect();

    return () => {
      realtimeService.unsubscribe('realtime.connected', onConnected);
      realtimeService.unsubscribe('message.created', onMessageCreated);
      realtimeService.unsubscribe('conversation.updated', onConversationUpdated);
      realtimeService.unsubscribe('conversation.read', onConversationRead);
      realtimeService.unsubscribe('notification.created', onNotificationCreated);
      realtimeService.unsubscribe('notification.read', onNotificationRead);
      realtimeService.disconnect();
    };
  }, [user?.id, setAppData]);

  return null;
};
