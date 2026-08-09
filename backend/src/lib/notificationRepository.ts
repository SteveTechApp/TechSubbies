import { randomUUID } from "node:crypto";
import { database, db } from "./db.js";

export type NotificationRow = {
  id: string;
  userId: string;
  type: string;
  text: string;
  link: string;
  isRead: number;
  timestamp: string;
};

db.exec(`
  CREATE TABLE IF NOT EXISTS user_notifications (
    id TEXT PRIMARY KEY,
    userId TEXT NOT NULL,
    type TEXT NOT NULL,
    text TEXT NOT NULL,
    link TEXT NOT NULL,
    isRead INTEGER NOT NULL DEFAULT 0,
    timestamp TEXT NOT NULL,
    FOREIGN KEY(userId) REFERENCES users(id) ON DELETE CASCADE
  );
  CREATE INDEX IF NOT EXISTS user_notifications_user_unread
    ON user_notifications(userId, isRead, timestamp DESC);
`);

export function checkNotificationRepository(): Promise<boolean> {
  return database.tableExists("user_notifications");
}

export async function createNotification(input: {
  userId: string;
  type: string;
  text: string;
  link: string;
}): Promise<NotificationRow> {
  const row: NotificationRow = {
    id: randomUUID(),
    userId: input.userId,
    type: input.type,
    text: input.text,
    link: input.link,
    isRead: 0,
    timestamp: new Date().toISOString(),
  };
  await database.execute(`
    INSERT INTO user_notifications (id, userId, type, text, link, isRead, timestamp)
    VALUES (?, ?, ?, ?, ?, 0, ?)
  `, [row.id, row.userId, row.type, row.text, row.link, row.timestamp]);
  return row;
}

export function listNotificationsForUser(userId: string, limit = 100): Promise<NotificationRow[]> {
  const safeLimit = Math.max(1, Math.min(200, Math.trunc(limit)));
  return database.queryMany<NotificationRow>(`
    SELECT * FROM user_notifications
    WHERE userId = ?
    ORDER BY timestamp DESC
    LIMIT ?
  `, [userId, safeLimit]);
}

export async function countUnreadNotifications(userId: string): Promise<number> {
  const row = await database.queryOne<{ total: number }>(
    "SELECT COUNT(*) AS total FROM user_notifications WHERE userId = ? AND isRead = 0", [userId]
  );
  return row?.total ?? 0;
}

export async function markNotificationRead(id: string, userId: string): Promise<NotificationRow | undefined> {
  await database.execute(
    "UPDATE user_notifications SET isRead = 1 WHERE id = ? AND userId = ?"
  , [id, userId]);
  return database.queryOne<NotificationRow>(
    "SELECT * FROM user_notifications WHERE id = ? AND userId = ?", [id, userId]
  );
}

export async function markAllNotificationsRead(userId: string): Promise<number> {
  const result = await database.execute(
    "UPDATE user_notifications SET isRead = 1 WHERE userId = ? AND isRead = 0"
  , [userId]);
  return result.changes;
}

export function toPublicNotification(row: NotificationRow) {
  return {
    id: row.id,
    userId: row.userId,
    type: row.type,
    text: row.text,
    link: row.link,
    isRead: Boolean(row.isRead),
    timestamp: row.timestamp,
  };
}
