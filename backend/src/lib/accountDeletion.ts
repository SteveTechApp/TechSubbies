import { randomUUID } from "node:crypto";
import { db } from "./db.js";

export type AccountDeletionRequest = {
  id: string;
  userId: string;
  status: "pending" | "cancelled" | "approved" | "rejected";
  requestedAt: string;
  cancelledAt: string | null;
  reviewedAt: string | null;
  reviewerId: string | null;
  resolutionNote: string | null;
};

export type AccountDeletionReviewItem = AccountDeletionRequest & {
  accountEmail: string;
  accountName: string;
  accountRole: string;
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
      SET status = 'pending', requestedAt = ?, cancelledAt = NULL,
          reviewedAt = NULL, reviewerId = NULL, resolutionNote = NULL
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

export function listAccountDeletionRequests(status = "pending"): AccountDeletionReviewItem[] {
  return db.prepare(`
    SELECT request.*, users.email AS accountEmail, users.name AS accountName,
           users.role AS accountRole
    FROM account_deletion_requests request
    JOIN users ON users.id = request.userId
    WHERE request.status = ?
    ORDER BY request.requestedAt ASC
  `).all(status) as unknown as AccountDeletionReviewItem[];
}

export function reviewAccountDeletionRequest(
  id: string,
  reviewerId: string,
  decision: "approved" | "rejected",
  resolutionNote: string
): AccountDeletionRequest | undefined {
  const result = db.prepare(`
    UPDATE account_deletion_requests
    SET status = ?, reviewedAt = ?, reviewerId = ?, resolutionNote = ?
    WHERE id = ? AND status = 'pending'
  `).run(decision, new Date().toISOString(), reviewerId, resolutionNote, id);
  if (result.changes === 0) return undefined;
  return db.prepare(
    "SELECT * FROM account_deletion_requests WHERE id = ?"
  ).get(id) as unknown as AccountDeletionRequest;
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
