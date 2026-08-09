import { randomUUID } from "node:crypto";
import { database, db } from "./db.js";

export type EvidencePurpose = "cv" | "certification" | "skill_evidence";
export type EvidenceStatus = "pending" | "ready";
export type EvidenceAuditAction =
  | "metadata.created"
  | "content.uploaded"
  | "content.accessed"
  | "content.access_denied"
  | "content.access_failed";

export type EvidenceObjectRow = {
  id: string;
  ownerUserId: string;
  purpose: EvidencePurpose;
  objectKey: string;
  fileName: string;
  contentType: string;
  declaredSizeBytes: number;
  storedSizeBytes: number | null;
  sha256: string | null;
  status: EvidenceStatus;
  createdAt: string;
  updatedAt: string;
};

export type EvidenceAccessEventRow = {
  id: string;
  evidenceId: string;
  actorUserId: string;
  action: EvidenceAuditAction;
  outcome: "success" | "denied" | "failed";
  requestId: string;
  createdAt: string;
};

// Evidence storage is intentionally separate from public profile JSON. The
// object key never leaves the backend API, and access events are append-only.
db.exec(`
  CREATE TABLE IF NOT EXISTS evidence_objects (
    id TEXT PRIMARY KEY,
    ownerUserId TEXT NOT NULL,
    purpose TEXT NOT NULL,
    objectKey TEXT NOT NULL UNIQUE,
    fileName TEXT NOT NULL,
    contentType TEXT NOT NULL,
    declaredSizeBytes INTEGER NOT NULL,
    storedSizeBytes INTEGER,
    sha256 TEXT,
    status TEXT NOT NULL,
    createdAt TEXT NOT NULL,
    updatedAt TEXT NOT NULL,
    FOREIGN KEY(ownerUserId) REFERENCES users(id) ON DELETE CASCADE
  );
  CREATE INDEX IF NOT EXISTS evidence_objects_owner_created
    ON evidence_objects(ownerUserId, createdAt DESC);

  CREATE TABLE IF NOT EXISTS evidence_access_events (
    id TEXT PRIMARY KEY,
    evidenceId TEXT NOT NULL,
    actorUserId TEXT NOT NULL,
    action TEXT NOT NULL,
    outcome TEXT NOT NULL,
    requestId TEXT NOT NULL,
    createdAt TEXT NOT NULL
  );
  CREATE INDEX IF NOT EXISTS evidence_access_events_evidence_created
    ON evidence_access_events(evidenceId, createdAt DESC);
  CREATE INDEX IF NOT EXISTS evidence_access_events_actor_created
    ON evidence_access_events(actorUserId, createdAt DESC);
`);

export async function checkEvidenceRepository(): Promise<boolean> {
  const [objectTable, auditTable] = await Promise.all([
    database.tableExists("evidence_objects"),
    database.tableExists("evidence_access_events"),
  ]);
  return objectTable && auditTable;
}

export async function createEvidenceObject(input: {
  ownerUserId: string;
  purpose: EvidencePurpose;
  fileName: string;
  contentType: string;
  declaredSizeBytes: number;
}) {
  const id = randomUUID();
  const objectKey = `evidence/${input.ownerUserId}/${id}`;
  const now = new Date().toISOString();
  await database.execute(`
    INSERT INTO evidence_objects (
      id, ownerUserId, purpose, objectKey, fileName, contentType,
      declaredSizeBytes, status, createdAt, updatedAt
    ) VALUES (?, ?, ?, ?, ?, ?, ?, 'pending', ?, ?)
  `, [id, input.ownerUserId, input.purpose, objectKey, input.fileName,
    input.contentType, input.declaredSizeBytes, now, now]);
  return (await findEvidenceObject(id))!;
}

export function findEvidenceObject(id: string): Promise<EvidenceObjectRow | undefined> {
  return database.queryOne<EvidenceObjectRow>("SELECT * FROM evidence_objects WHERE id = ?", [id]);
}

export function listEvidenceObjectsForOwner(ownerUserId: string): Promise<EvidenceObjectRow[]> {
  return database.queryMany<EvidenceObjectRow>(
    "SELECT * FROM evidence_objects WHERE ownerUserId = ? ORDER BY createdAt DESC", [ownerUserId]
  );
}

export async function markEvidenceReady(id: string, storedSizeBytes: number, sha256: string) {
  const now = new Date().toISOString();
  await database.execute(`
    UPDATE evidence_objects
    SET status = 'ready', storedSizeBytes = ?, sha256 = ?, updatedAt = ?
    WHERE id = ?
  `, [storedSizeBytes, sha256, now, id]);
  return findEvidenceObject(id);
}

export async function recordEvidenceAccess(input: {
  evidenceId: string;
  actorUserId: string;
  action: EvidenceAuditAction;
  outcome: EvidenceAccessEventRow["outcome"];
  requestId: string;
}) {
  const event: EvidenceAccessEventRow = {
    id: randomUUID(),
    evidenceId: input.evidenceId,
    actorUserId: input.actorUserId,
    action: input.action,
    outcome: input.outcome,
    requestId: input.requestId,
    createdAt: new Date().toISOString(),
  };
  await database.execute(`
    INSERT INTO evidence_access_events (
      id, evidenceId, actorUserId, action, outcome, requestId, createdAt
    ) VALUES (?, ?, ?, ?, ?, ?, ?)
  `, [event.id, event.evidenceId, event.actorUserId, event.action,
    event.outcome, event.requestId, event.createdAt]);
  return event;
}

export function listEvidenceAccessEvents(evidenceId: string): Promise<EvidenceAccessEventRow[]> {
  return database.queryMany<EvidenceAccessEventRow>(
    "SELECT * FROM evidence_access_events WHERE evidenceId = ? ORDER BY createdAt DESC", [evidenceId]
  );
}
