import { useEffect } from 'react';
import { useAppContext } from '../context/InteractionContext';
import { realtimeService } from '../services/realtimeService';
import { realtimeApi, toConversation, toMessage, toNotification } from '../services/realtimeApi';

function payloadRecord(value: unknown): Record<string, unknown> | null {
  return typeof value === 'object' && value !== null ? value as Record<string, unknown> : null;
}

export const RealtimeBridge = () => {
  const { user, setAppData } = useAppContext();

  useEffect(() => {
    if (!user) {
      realtimeService.disconnect();
      return;
    }

    const mergeConversation = (conversation: unknown) => {
      let normalized;
      try { normalized = toConversation(conversation); } catch { return; }
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
          setAppData(previous => {
            const durableIds = new Set(notifications.map(notification => notification.id));
            const localOnlyNotifications = previous.notifications.filter(notification => !durableIds.has(notification.id));
            return {
              ...previous,
              conversations,
              notifications: [...notifications, ...localOnlyNotifications],
            };
          });
        })
        .catch(() => undefined);
    };

    const onMessageCreated = (payload: unknown) => {
      const data = payloadRecord(payload);
      if (!data?.message) return;
      let message;
      try { message = toMessage(data.message); } catch { return; }
      setAppData(previous => ({
        ...previous,
        messages: previous.messages.some(item => item.id === message.id)
          ? previous.messages.map(item => item.id === message.id ? message : item)
          : [...previous.messages, message],
      }));
      if (data.conversation) mergeConversation(data.conversation);
    };

    const onConversationUpdated = (payload: unknown) => {
      const data = payloadRecord(payload);
      if (data?.conversation) mergeConversation(data.conversation);
    };

    const onConversationRead = (payload: unknown) => {
      const data = payloadRecord(payload);
      if (!data) return;
      const ids = new Set<string>(Array.isArray(data.messageIds) ? data.messageIds.filter((id): id is string => typeof id === 'string') : []);
      setAppData(previous => ({
        ...previous,
        messages: previous.messages.map(message => ids.has(message.id) ? { ...message, isRead: true } : message),
        conversations: previous.conversations.map(conversation =>
          conversation.id === data.conversationId && data.readerId === user.id
            ? { ...conversation, unreadCount: 0 }
            : conversation
        ),
      }));
    };

    const onNotificationCreated = (payload: unknown) => {
      const data = payloadRecord(payload);
      if (!data?.notification) return;
      let notification;
      try { notification = toNotification(data.notification); } catch { return; }
      setAppData(previous => ({
        ...previous,
        notifications: previous.notifications.some(item => item.id === notification.id)
          ? previous.notifications.map(item => item.id === notification.id ? notification : item)
          : [notification, ...previous.notifications],
      }));
    };

    const onNotificationRead = (payload: unknown) => {
      const data = payloadRecord(payload);
      if (!data) return;
      const notification = payloadRecord(data.notification);
      setAppData(previous => ({
        ...previous,
        notifications: data.all === true
          ? previous.notifications.map(item => item.userId === user.id ? { ...item, isRead: true } : item)
          : previous.notifications.map(item => item.id === notification?.id ? { ...item, isRead: true } : item),
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
