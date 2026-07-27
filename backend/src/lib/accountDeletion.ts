import { randomUUID } from "node:crypto";
import { db } from "./db.js";

export type AccountDeletionRequest = {
  id: string;
  userId: string;
  status: "pending" | "cancelled" | "approved" | "rejected" | "processed";
  requestedAt: string;
  cancelledAt: string | null;
  reviewedAt: string | null;
  reviewerId: string | null;
  resolutionNote: string | null;
  userMessage: string | null;
  processedAt: string | null;
  processorId: string | null;
};

export type AccountDeletionReviewItem = AccountDeletionRequest & {
  accountEmail: string;
  accountName: string;
  accountRole: string;
};

export type AccountDeletionEligibility = {
  eligible: boolean;
  blockers: Array<{
    code: "ACTIVE_CONTRACTS" | "UNPAID_INVOICES" | "LIVE_APPLICATIONS";
    count: number;
    message: string;
  }>;
};

export type AccountDeletionSummary = {
  pending: number;
  approved: number;
  rejected: number;
  processed: number;
  overduePending: number;
  oldestPendingAt: string | null;
};

export function accountDeletionResponseDueAt(requestedAt: string): string {
  return new Date(new Date(requestedAt).getTime() + 30 * 24 * 60 * 60 * 1000).toISOString();
}

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
          reviewedAt = NULL, reviewerId = NULL, resolutionNote = NULL, userMessage = NULL
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
  resolutionNote: string,
  userMessage: string
): AccountDeletionRequest | undefined {
  const result = db.prepare(`
    UPDATE account_deletion_requests
    SET status = ?, reviewedAt = ?, reviewerId = ?, resolutionNote = ?, userMessage = ?
    WHERE id = ? AND status = 'pending'
  `).run(decision, new Date().toISOString(), reviewerId, resolutionNote, userMessage, id);
  if (result.changes === 0) return undefined;
  return db.prepare(
    "SELECT * FROM account_deletion_requests WHERE id = ?"
  ).get(id) as unknown as AccountDeletionRequest;
}

function count(sql: string, userId: string): number {
  const row = db.prepare(sql).get(userId, userId) as { total: number };
  return row.total;
}

export function getAccountDeletionEligibility(userId: string): AccountDeletionEligibility {
  const activeContracts = count(`
    SELECT COUNT(*) AS total FROM contracts
    WHERE (companyId = ? OR engineerId = ?)
      AND status NOT IN ('Completed', 'Cancelled')
  `, userId);
  const unpaidInvoices = count(`
    SELECT COUNT(*) AS total FROM invoices
    WHERE (companyId = ? OR engineerId = ?)
      AND status != 'Paid'
  `, userId);
  const liveApplications = db.prepare(`
    SELECT COUNT(*) AS total FROM applications
    WHERE engineerId = ? AND status NOT IN ('Rejected', 'Completed')
  `).get(userId) as { total: number };

  const blockers: AccountDeletionEligibility["blockers"] = [];
  if (activeContracts > 0) blockers.push({
    code: "ACTIVE_CONTRACTS",
    count: activeContracts,
    message: `${activeContracts} contract${activeContracts === 1 ? "" : "s"} must be completed or cancelled.`,
  });
  if (unpaidInvoices > 0) blockers.push({
    code: "UNPAID_INVOICES",
    count: unpaidInvoices,
    message: `${unpaidInvoices} invoice${unpaidInvoices === 1 ? "" : "s"} must be paid or otherwise resolved.`,
  });
  if (liveApplications.total > 0) blockers.push({
    code: "LIVE_APPLICATIONS",
    count: liveApplications.total,
    message: `${liveApplications.total} live job application${liveApplications.total === 1 ? "" : "s"} must be resolved.`,
  });
  return { eligible: blockers.length === 0, blockers };
}

export function processAccountDeletionRequest(
  id: string,
  processorId: string
): AccountDeletionRequest | undefined {
  const request = db.prepare(
    "SELECT * FROM account_deletion_requests WHERE id = ? AND status = 'approved'"
  ).get(id) as unknown as AccountDeletionRequest | undefined;
  if (!request || !getAccountDeletionEligibility(request.userId).eligible) return undefined;

  const now = new Date().toISOString();
  const anonymousEmail = `deleted+${request.userId}@deleted.techsubbies.invalid`;
  db.exec("BEGIN IMMEDIATE");
  try {
    db.prepare(`
      UPDATE users
      SET email = ?, password = ?, name = 'Deleted account',
          profile = '{"name":"Deleted account","status":"deleted"}',
          emailVerified = 0, sessionVersion = sessionVersion + 1,
          deletedAt = ?, updatedAt = ?
      WHERE id = ? AND deletedAt IS NULL
    `).run(anonymousEmail, `disabled-${randomUUID()}`, now, now, request.userId);
    db.prepare("DELETE FROM account_tokens WHERE userId = ?").run(request.userId);
    db.prepare(`
      UPDATE account_deletion_requests
      SET status = 'processed', processedAt = ?, processorId = ?
      WHERE id = ? AND status = 'approved'
    `).run(now, processorId, id);
    db.exec("COMMIT");
  } catch (error) {
    db.exec("ROLLBACK");
    throw error;
  }
  return db.prepare(
    "SELECT * FROM account_deletion_requests WHERE id = ?"
  ).get(id) as unknown as AccountDeletionRequest;
}

export function getAccountDeletionSummary(now = new Date()): AccountDeletionSummary {
  const overdueThreshold = new Date(now.getTime() - 28 * 24 * 60 * 60 * 1000).toISOString();
  return db.prepare(`
    SELECT
      SUM(CASE WHEN status = 'pending' THEN 1 ELSE 0 END) AS pending,
      SUM(CASE WHEN status = 'approved' THEN 1 ELSE 0 END) AS approved,
      SUM(CASE WHEN status = 'rejected' THEN 1 ELSE 0 END) AS rejected,
      SUM(CASE WHEN status = 'processed' THEN 1 ELSE 0 END) AS processed,
      SUM(CASE WHEN status = 'pending' AND requestedAt < ? THEN 1 ELSE 0 END) AS overduePending,
      MIN(CASE WHEN status = 'pending' THEN requestedAt END) AS oldestPendingAt
    FROM account_deletion_requests
  `).get(overdueThreshold) as unknown as AccountDeletionSummary;
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
