import { randomUUID } from "node:crypto";
import { db } from "./db.js";

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

export function checkNotificationRepository(): boolean {
  return Boolean(db.prepare(
    "SELECT name FROM sqlite_master WHERE type = 'table' AND name = 'user_notifications'"
  ).get());
}

export function createNotification(input: {
  userId: string;
  type: string;
  text: string;
  link: string;
}): NotificationRow {
  const row: NotificationRow = {
    id: randomUUID(),
    userId: input.userId,
    type: input.type,
    text: input.text,
    link: input.link,
    isRead: 0,
    timestamp: new Date().toISOString(),
  };
  db.prepare(`
    INSERT INTO user_notifications (id, userId, type, text, link, isRead, timestamp)
    VALUES (?, ?, ?, ?, ?, 0, ?)
  `).run(row.id, row.userId, row.type, row.text, row.link, row.timestamp);
  return row;
}

export function listNotificationsForUser(userId: string, limit = 100): NotificationRow[] {
  const safeLimit = Math.max(1, Math.min(200, Math.trunc(limit)));
  return db.prepare(`
    SELECT * FROM user_notifications
    WHERE userId = ?
    ORDER BY timestamp DESC
    LIMIT ?
  `).all(userId, safeLimit) as unknown as NotificationRow[];
}

export function countUnreadNotifications(userId: string): number {
  const row = db.prepare(
    "SELECT COUNT(*) AS total FROM user_notifications WHERE userId = ? AND isRead = 0"
  ).get(userId) as { total: number };
  return row.total;
}

export function markNotificationRead(id: string, userId: string): NotificationRow | undefined {
  db.prepare(
    "UPDATE user_notifications SET isRead = 1 WHERE id = ? AND userId = ?"
  ).run(id, userId);
  return db.prepare(
    "SELECT * FROM user_notifications WHERE id = ? AND userId = ?"
  ).get(id, userId) as unknown as NotificationRow | undefined;
}

export function markAllNotificationsRead(userId: string): number {
  const result = db.prepare(
    "UPDATE user_notifications SET isRead = 1 WHERE userId = ? AND isRead = 0"
  ).run(userId);
  return Number(result.changes);
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
