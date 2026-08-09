import { database } from "./db.js";

export async function countUnreadMessagesForConversation(conversationId: string, userId: string): Promise<number> {
  const row = await database.queryOne<{ total: number }>(`
    SELECT COUNT(*) AS total
    FROM messages
    WHERE conversationId = ? AND senderId <> ? AND isRead = 0
  `, [conversationId, userId]);
  return row?.total ?? 0;
}

export async function countUnreadMessagesForUser(userId: string): Promise<number> {
  const row = await database.queryOne<{ total: number }>(`
    SELECT COUNT(*) AS total
    FROM messages
    JOIN conversations ON conversations.id = messages.conversationId
    WHERE messages.senderId <> ?
      AND messages.isRead = 0
      AND (conversations.participantAId = ? OR conversations.participantBId = ?)
  `, [userId, userId, userId]);
  return row?.total ?? 0;
}

export async function markConversationMessagesRead(conversationId: string, userId: string): Promise<string[]> {
  return database.transaction(async (transaction) => {
  const unread = await transaction.queryMany<{ id: string }>(`
    SELECT id
    FROM messages
    WHERE conversationId = ? AND senderId <> ? AND isRead = 0
    ORDER BY timestamp ASC
  `, [conversationId, userId]);
  if (unread.length === 0) return [];
  await transaction.execute(`
    UPDATE messages
    SET isRead = 1
    WHERE conversationId = ? AND senderId <> ? AND isRead = 0
  `, [conversationId, userId]);
  return unread.map((row) => row.id);
  });
}
