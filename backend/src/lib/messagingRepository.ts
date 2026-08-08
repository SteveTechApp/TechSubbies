import { db } from "./db.js";

export function countUnreadMessagesForConversation(conversationId: string, userId: string): number {
  const row = db.prepare(`
    SELECT COUNT(*) AS total
    FROM messages
    WHERE conversationId = ? AND senderId <> ? AND isRead = 0
  `).get(conversationId, userId) as { total: number };
  return row.total;
}

export function countUnreadMessagesForUser(userId: string): number {
  const row = db.prepare(`
    SELECT COUNT(*) AS total
    FROM messages
    JOIN conversations ON conversations.id = messages.conversationId
    WHERE messages.senderId <> ?
      AND messages.isRead = 0
      AND (conversations.participantAId = ? OR conversations.participantBId = ?)
  `).get(userId, userId, userId) as { total: number };
  return row.total;
}

export function markConversationMessagesRead(conversationId: string, userId: string): string[] {
  const unread = db.prepare(`
    SELECT id
    FROM messages
    WHERE conversationId = ? AND senderId <> ? AND isRead = 0
    ORDER BY timestamp ASC
  `).all(conversationId, userId) as unknown as Array<{ id: string }>;
  if (unread.length === 0) return [];
  db.prepare(`
    UPDATE messages
    SET isRead = 1
    WHERE conversationId = ? AND senderId <> ? AND isRead = 0
  `).run(conversationId, userId);
  return unread.map((row) => row.id);
}
