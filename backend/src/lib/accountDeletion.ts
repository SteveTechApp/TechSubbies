import { randomUUID } from "node:crypto";
import { db } from "./db.js";

export type AccountDeletionRequest = {
  id: string;
  userId: string;
  status: "pending" | "cancelled";
  requestedAt: string;
  cancelledAt: string | null;
};

export function findAccountDeletionRequest(userId: string): AccountDeletionRequest | undefined {
  return db.prepare(
    "SELECT * FROM account_deletion_requests WHERE userId = ?"
  ).get(userId) as unknown as AccountDeletionRequest | undefined;
}

export function requestAccountDeletion(userId: string): AccountDeletionRequest {
  const existing = findAccountDeletionRequest(userId);
  const now = new Date().toISOString();
  if (existing) {
    db.prepare(`
      UPDATE account_deletion_requests
      SET status = 'pending', requestedAt = ?, cancelledAt = NULL
      WHERE userId = ?
    `).run(now, userId);
  } else {
    db.prepare(`
      INSERT INTO account_deletion_requests
        (id, userId, status, requestedAt, cancelledAt)
      VALUES (?, ?, 'pending', ?, NULL)
    `).run(randomUUID(), userId, now);
  }
  return findAccountDeletionRequest(userId)!;
}

export function cancelAccountDeletion(userId: string): AccountDeletionRequest | undefined {
  const existing = findAccountDeletionRequest(userId);
  if (!existing || existing.status !== "pending") return existing;
  db.prepare(`
    UPDATE account_deletion_requests
    SET status = 'cancelled', cancelledAt = ?
    WHERE userId = ?
  `).run(new Date().toISOString(), userId);
  return findAccountDeletionRequest(userId);
}
