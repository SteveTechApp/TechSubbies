import { randomUUID } from "node:crypto";
import { database, db, findUserById } from "./db.js";
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

export function checkCertificateRepository(): Promise<boolean> {
  return database.tableExists("certificate_verifications");
}

export async function createCertificateSubmission(input: {
  ownerUserId: string;
  evidenceId: string;
  name: string;
  issuer: string;
  certificateNumber?: string;
  issuedAt?: string;
  expiresAt?: string;
  visibility: CertificateVisibility;
}): Promise<CertificateRow> {
  const evidence = await findEvidenceObject(input.evidenceId);
  if (!evidence || evidence.ownerUserId !== input.ownerUserId) {
    throw new Error("EVIDENCE_NOT_OWNED");
  }
  if (evidence.purpose !== "certification" || evidence.status !== "ready") {
    throw new Error("EVIDENCE_NOT_READY_CERTIFICATE");
  }
  const existing = await findCertificateByEvidenceId(input.evidenceId);
  if (existing) throw new Error("CERTIFICATE_ALREADY_SUBMITTED");

  const id = randomUUID();
  const now = new Date().toISOString();
  await database.execute(`
    INSERT INTO certificate_verifications (
      id, ownerUserId, evidenceId, name, issuer, certificateNumber,
      issuedAt, expiresAt, verificationStatus, visibility, createdAt, updatedAt
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'pending', ?, ?, ?)
  `, [id, input.ownerUserId, input.evidenceId, input.name, input.issuer,
    input.certificateNumber || null, input.issuedAt || null, input.expiresAt || null,
    input.visibility, now, now]);
  return (await findCertificateById(id))!;
}

export function findCertificateById(id: string): Promise<CertificateRow | undefined> {
  return database.queryOne<CertificateRow>("SELECT * FROM certificate_verifications WHERE id = ?", [id]);
}

export function findCertificateByEvidenceId(evidenceId: string): Promise<CertificateRow | undefined> {
  return database.queryOne<CertificateRow>("SELECT * FROM certificate_verifications WHERE evidenceId = ?", [evidenceId]);
}

export function listCertificatesForOwner(ownerUserId: string): Promise<CertificateRow[]> {
  return database.queryMany<CertificateRow>(
    "SELECT * FROM certificate_verifications WHERE ownerUserId = ? ORDER BY createdAt DESC", [ownerUserId]
  );
}

export async function setCertificateVisibility(
  id: string,
  ownerUserId: string,
  visibility: CertificateVisibility
): Promise<CertificateRow | undefined> {
  const now = new Date().toISOString();
  const result = await database.execute(`
    UPDATE certificate_verifications
    SET visibility = ?, updatedAt = ?
    WHERE id = ? AND ownerUserId = ?
  `, [visibility, now, id, ownerUserId]);
  return result.changes ? findCertificateById(id) : undefined;
}

export async function reviewCertificate(
  id: string,
  reviewerId: string,
  status: Exclude<CertificateVerificationStatus, "pending">,
  note: string
): Promise<CertificateRow | undefined> {
  const current = await findCertificateById(id);
  if (!current || current.verificationStatus !== "pending") return undefined;
  const now = new Date().toISOString();
  await database.execute(`
    UPDATE certificate_verifications
    SET verificationStatus = ?, reviewerId = ?, reviewNote = ?, reviewedAt = ?, updatedAt = ?
    WHERE id = ? AND verificationStatus = 'pending'
  `, [status, reviewerId, note || null, now, now, id]);
  return findCertificateById(id);
}

export function listAdminCertificateQueue(
  status: CertificateVerificationStatus = "pending"
): Promise<AdminCertificateQueueItem[]> {
  return database.queryMany<AdminCertificateQueueItem>(`
    SELECT c.*, u.name AS ownerName, u.email AS ownerEmail,
           e.fileName AS evidenceFileName, e.contentType AS evidenceContentType
    FROM certificate_verifications c
    JOIN users u ON u.id = c.ownerUserId
    JOIN evidence_objects e ON e.id = c.evidenceId
    WHERE c.verificationStatus = ?
    ORDER BY c.createdAt ASC
  `, [status]);
}

export function isCertificateCurrentlyValid(certificate: CertificateRow, now = new Date()): boolean {
  if (certificate.verificationStatus !== "verified") return false;
  if (!certificate.expiresAt) return true;
  return new Date(certificate.expiresAt).getTime() > now.getTime();
}

export async function canMarketplaceReadEvidence(evidenceId: string, now = new Date()): Promise<boolean> {
  const certificate = await findCertificateByEvidenceId(evidenceId);
  return Boolean(
    certificate
    && certificate.visibility === "marketplace"
    && isCertificateCurrentlyValid(certificate, now)
  );
}

export async function listMarketplaceCertificates(ownerUserId: string, now = new Date()): Promise<CertificateRow[]> {
  return (await listCertificatesForOwner(ownerUserId)).filter(
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

export async function listCertificatesDueExpiryReminder(now = new Date()): Promise<Array<{
  certificate: CertificateRow;
  stage: CertificateReminderStage;
  ownerEmail: string;
  ownerName: string;
}>> {
  const rows = await database.queryMany<CertificateRow>(`
    SELECT * FROM certificate_verifications
    WHERE verificationStatus = 'verified' AND expiresAt IS NOT NULL
  `);
  return rows.flatMap((certificate) => {
    const stage = reminderStageFor(certificate, now);
    if (!stage || certificate.expiryReminderStage === stage) return [];
    const owner = findUserById(certificate.ownerUserId);
    if (!owner) return [];
    return [{ certificate, stage, ownerEmail: owner.email, ownerName: owner.name }];
  });
}

export async function markCertificateReminderSent(id: string, stage: CertificateReminderStage): Promise<void> {
  await database.execute(
    "UPDATE certificate_verifications SET expiryReminderStage = ?, updatedAt = ? WHERE id = ?",
    [stage, new Date().toISOString(), id]
  );
}
