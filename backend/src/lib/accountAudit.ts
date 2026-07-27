import { createHmac, randomUUID } from "node:crypto";
import { db } from "./db.js";

export type AccountAuditEventType =
  | "account.registered"
  | "login.succeeded"
  | "login.failed"
  | "email.verified"
  | "password.reset"
  | "password.changed"
  | "sessions.revoked"
  | "deletion.requested"
  | "deletion.cancelled"
  | "deletion.approved"
  | "deletion.rejected"
  | "deletion.processed"
  | "account.suspended"
  | "account.reactivated"
  | "job.closed"
  | "job.reopened";

export type AccountAuditEvent = {
  id: string;
  eventType: AccountAuditEventType;
  outcome: "success" | "failure";
  userId: string | null;
  subjectHash: string | null;
  requestId: string;
  createdAt: string;
};

function hashSubject(subject: string): string {
  const secret = process.env.JWT_SECRET || "insecure-dev-secret-change-me";
  return createHmac("sha256", secret).update(subject.trim().toLowerCase()).digest("hex");
}

export function recordAccountAudit(input: {
  eventType: AccountAuditEventType;
  outcome: "success" | "failure";
  requestId: string;
  userId?: string;
  subject?: string;
}) {
  const event: AccountAuditEvent = {
    id: randomUUID(),
    eventType: input.eventType,
    outcome: input.outcome,
    userId: input.userId || null,
    subjectHash: input.subject ? hashSubject(input.subject) : null,
    requestId: input.requestId,
    createdAt: new Date().toISOString(),
  };
  db.prepare(`
    INSERT INTO account_audit_events
      (id, eventType, outcome, userId, subjectHash, requestId, createdAt)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `).run(
    event.id,
    event.eventType,
    event.outcome,
    event.userId,
    event.subjectHash,
    event.requestId,
    event.createdAt
  );
  return event;
}

export function findAccountAuditByRequestId(requestId: string): AccountAuditEvent[] {
  return db.prepare(
    "SELECT * FROM account_audit_events WHERE requestId = ? ORDER BY createdAt ASC"
  ).all(requestId) as unknown as AccountAuditEvent[];
}

export function listAccountAuditForUser(userId: string, limit = 20): AccountAuditEvent[] {
  const safeLimit = Math.max(1, Math.min(50, Math.trunc(limit)));
  return db.prepare(
    "SELECT * FROM account_audit_events WHERE userId = ? ORDER BY createdAt DESC LIMIT ?"
  ).all(userId, safeLimit) as unknown as AccountAuditEvent[];
}
