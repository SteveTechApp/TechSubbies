import { describe, expect, it } from 'vitest';
import { NotificationType } from '../types';
import { toConversation, toMessage, toNotification } from './realtimeApi';

describe('realtime payload parsing', () => {
  it('hydrates valid timestamps at the transport boundary', () => {
    expect(toConversation({ id: 'c1', participantIds: ['u1', 'u2'], lastMessageText: 'Hi', lastMessageTimestamp: '2026-08-09T10:00:00Z' }).lastMessageTimestamp).toBeInstanceOf(Date);
    expect(toMessage({ id: 'm1', conversationId: 'c1', senderId: 'u1', text: 'Hi', isRead: false, timestamp: '2026-08-09T10:00:00Z' }).timestamp).toBeInstanceOf(Date);
    expect(toNotification({ id: 'n1', userId: 'u2', type: NotificationType.MESSAGE, text: 'New message', link: '/messages', isRead: false, timestamp: '2026-08-09T10:00:00Z' }).timestamp).toBeInstanceOf(Date);
  });

  it('rejects malformed realtime records before state reconciliation', () => {
    expect(() => toConversation({ id: 'c1', participantIds: 'u1', lastMessageTimestamp: 'invalid' })).toThrow('Invalid conversation response.');
    expect(() => toMessage({ id: 'm1', timestamp: 'invalid' })).toThrow('Invalid message response.');
    expect(() => toNotification({ id: 'n1', type: 'unknown' })).toThrow('Invalid notification response.');
  });
});
