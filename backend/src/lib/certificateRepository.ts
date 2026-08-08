import { randomUUID } from "node:crypto";
import { db, findUserById } from "./db.js";
import { findEvidenceObject } from "./evidenceRepository.js";

export type CertificateVerificationStatus = "pending" | "verified" | "rejected";
export type CertificateVisibility = "private" | "marketplace";

export type CertificateRow = {
  id: string;
  ownerUserId: string;
  evidenceId: string;
  name: string;
  issuer: string;
  certificateNumber: string | null;
  issuedAt: string | null;
  expiresAt: string | null;
  verificationStatus: CertificateVerificationStatus;
  visibility: CertificateVisibility;
  reviewerId: string | null;
  reviewNote: string | null;
  reviewedAt: string | null;
  expiryReminderStage: string | null;
  createdAt: string;
  updatedAt: string;
};

export type AdminCertificateQueueItem = CertificateRow & {
  ownerName: string;
  ownerEmail: string;
  evidenceFileName: string;
  evidenceContentType: string;
};

db.exec(`
  CREATE TABLE IF NOT EXISTS certificate_verifications (
    id TEXT PRIMARY KEY,
    ownerUserId TEXT NOT NULL,
    evidenceId TEXT NOT NULL UNIQUE,
    name TEXT NOT NULL,
    issuer TEXT NOT NULL,
    certificateNumber TEXT,
    issuedAt TEXT,
    expiresAt TEXT,
    verificationStatus TEXT NOT NULL DEFAULT 'pending',
    visibility TEXT NOT NULL DEFAULT 'private',
    reviewerId TEXT,
    reviewNote TEXT,
    reviewedAt TEXT,
    expiryReminderStage TEXT,
    createdAt TEXT NOT NULL,
    updatedAt TEXT NOT NULL,
    FOREIGN KEY(ownerUserId) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY(evidenceId) REFERENCES evidence_objects(id) ON DELETE CASCADE
  );
  CREATE INDEX IF NOT EXISTS certificate_verifications_owner_created
    ON certificate_verifications(ownerUserId, createdAt DESC);
  CREATE INDEX IF NOT EXISTS certificate_verifications_status_created
    ON certificate_verifications(verificationStatus, createdAt ASC);
  CREATE INDEX IF NOT EXISTS certificate_verifications_expiry
    ON certificate_verifications(expiresAt);
`);

export function checkCertificateRepository(): boolean {
  const row = db.prepare(
    "SELECT name FROM sqlite_master WHERE type = 'table' AND name = 'certificate_verifications'"
  ).get() as { name?: string } | undefined;
  return row?.name === "certificate_verifications";
}

export function createCertificateSubmission(input: {
  ownerUserId: string;
  evidenceId: string;
  name: string;
  issuer: string;
  certificateNumber?: string;
  issuedAt?: string;
  expiresAt?: string;
  visibility: CertificateVisibility;
}): CertificateRow {
  const evidence = findEvidenceObject(input.evidenceId);
  if (!evidence || evidence.ownerUserId !== input.ownerUserId) {
    throw new Error("EVIDENCE_NOT_OWNED");
  }
  if (evidence.purpose !== "certification" || evidence.status !== "ready") {
    throw new Error("EVIDENCE_NOT_READY_CERTIFICATE");
  }
  const existing = findCertificateByEvidenceId(input.evidenceId);
  if (existing) throw new Error("CERTIFICATE_ALREADY_SUBMITTED");

  const id = randomUUID();
  const now = new Date().toISOString();
  db.prepare(`
    INSERT INTO certificate_verifications (
      id, ownerUserId, evidenceId, name, issuer, certificateNumber,
      issuedAt, expiresAt, verificationStatus, visibility, createdAt, updatedAt
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'pending', ?, ?, ?)
  `).run(
    id,
    input.ownerUserId,
    input.evidenceId,
    input.name,
    input.issuer,
    input.certificateNumber || null,
    input.issuedAt || null,
    input.expiresAt || null,
    input.visibility,
    now,
    now
  );
  return findCertificateById(id)!;
}

export function findCertificateById(id: string): CertificateRow | undefined {
  return db.prepare("SELECT * FROM certificate_verifications WHERE id = ?").get(id) as unknown as CertificateRow | undefined;
}

export function findCertificateByEvidenceId(evidenceId: string): CertificateRow | undefined {
  return db.prepare("SELECT * FROM certificate_verifications WHERE evidenceId = ?").get(evidenceId) as unknown as CertificateRow | undefined;
}

export function listCertificatesForOwner(ownerUserId: string): CertificateRow[] {
  return db.prepare(
    "SELECT * FROM certificate_verifications WHERE ownerUserId = ? ORDER BY createdAt DESC"
  ).all(ownerUserId) as unknown as CertificateRow[];
}

export function setCertificateVisibility(
  id: string,
  ownerUserId: string,
  visibility: CertificateVisibility
): CertificateRow | undefined {
  const now = new Date().toISOString();
  const result = db.prepare(`
    UPDATE certificate_verifications
    SET visibility = ?, updatedAt = ?
    WHERE id = ? AND ownerUserId = ?
  `).run(visibility, now, id, ownerUserId);
  return result.changes ? findCertificateById(id) : undefined;
}

export function reviewCertificate(
  id: string,
  reviewerId: string,
  status: Exclude<CertificateVerificationStatus, "pending">,
  note: string
): CertificateRow | undefined {
  const current = findCertificateById(id);
  if (!current || current.verificationStatus !== "pending") return undefined;
  const now = new Date().toISOString();
  db.prepare(`
    UPDATE certificate_verifications
    SET verificationStatus = ?, reviewerId = ?, reviewNote = ?, reviewedAt = ?, updatedAt = ?
    WHERE id = ? AND verificationStatus = 'pending'
  `).run(status, reviewerId, note || null, now, now, id);
  return findCertificateById(id);
}

export function listAdminCertificateQueue(
  status: CertificateVerificationStatus = "pending"
): AdminCertificateQueueItem[] {
  return db.prepare(`
    SELECT c.*, u.name AS ownerName, u.email AS ownerEmail,
           e.fileName AS evidenceFileName, e.contentType AS evidenceContentType
    FROM certificate_verifications c
    JOIN users u ON u.id = c.ownerUserId
    JOIN evidence_objects e ON e.id = c.evidenceId
    WHERE c.verificationStatus = ?
    ORDER BY c.createdAt ASC
  `).all(status) as unknown as AdminCertificateQueueItem[];
}

export function isCertificateCurrentlyValid(certificate: CertificateRow, now = new Date()): boolean {
  if (certificate.verificationStatus !== "verified") return false;
  if (!certificate.expiresAt) return true;
  return new Date(certificate.expiresAt).getTime() > now.getTime();
}

export function canMarketplaceReadEvidence(evidenceId: string, now = new Date()): boolean {
  const certificate = findCertificateByEvidenceId(evidenceId);
  return Boolean(
    certificate
    && certificate.visibility === "marketplace"
    && isCertificateCurrentlyValid(certificate, now)
  );
}

export function listMarketplaceCertificates(ownerUserId: string, now = new Date()): CertificateRow[] {
  return listCertificatesForOwner(ownerUserId).filter(
    (certificate) => certificate.visibility === "marketplace" && isCertificateCurrentlyValid(certificate, now)
  );
}

export type CertificateReminderStage = "30d" | "7d" | "expired";

export function reminderStageFor(certificate: CertificateRow, now = new Date()): CertificateReminderStage | null {
  if (certificate.verificationStatus !== "verified" || !certificate.expiresAt) return null;
  const remainingMs = new Date(certificate.expiresAt).getTime() - now.getTime();
  const days = remainingMs / 86_400_000;
  if (days <= 0) return "expired";
  if (days <= 7) return "7d";
  if (days <= 30) return "30d";
  return null;
}

export function listCertificatesDueExpiryReminder(now = new Date()): Array<{
  certificate: CertificateRow;
  stage: CertificateReminderStage;
  ownerEmail: string;
  ownerName: string;
}> {
  const rows = db.prepare(`
    SELECT * FROM certificate_verifications
    WHERE verificationStatus = 'verified' AND expiresAt IS NOT NULL
  `).all() as unknown as CertificateRow[];
  return rows.flatMap((certificate) => {
    const stage = reminderStageFor(certificate, now);
    if (!stage || certificate.expiryReminderStage === stage) return [];
    const owner = findUserById(certificate.ownerUserId);
    if (!owner) return [];
    return [{ certificate, stage, ownerEmail: owner.email, ownerName: owner.name }];
  });
}

export function markCertificateReminderSent(id: string, stage: CertificateReminderStage) {
  db.prepare(
    "UPDATE certificate_verifications SET expiryReminderStage = ?, updatedAt = ? WHERE id = ?"
  ).run(stage, new Date().toISOString(), id);
}
