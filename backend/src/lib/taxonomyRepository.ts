import { randomUUID } from "node:crypto";
import { db } from "./db.js";

export type TaxonomyVersionStatus =
  | "draft"
  | "in_review"
  | "approved"
  | "rejected"
  | "published"
  | "superseded";

export type TaxonomyReviewDecision = "approved" | "rejected";

export type TaxonomyVersionRow = {
  id: string;
  roleId: string;
  version: number;
  status: TaxonomyVersionStatus;
  snapshot: string;
  changeNote: string;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
  submittedAt: string | null;
  publishedAt: string | null;
  publishedBy: string | null;
};

export type TaxonomyReviewRow = {
  id: string;
  versionId: string;
  reviewerUserId: string;
  decision: TaxonomyReviewDecision;
  note: string;
  createdAt: string;
};

db.exec(`
  CREATE TABLE IF NOT EXISTS taxonomy_role_versions (
    id TEXT PRIMARY KEY,
    roleId TEXT NOT NULL,
    version INTEGER NOT NULL,
    status TEXT NOT NULL,
    snapshot TEXT NOT NULL,
    changeNote TEXT NOT NULL,
    createdBy TEXT NOT NULL,
    createdAt TEXT NOT NULL,
    updatedAt TEXT NOT NULL,
    submittedAt TEXT,
    publishedAt TEXT,
    publishedBy TEXT,
    UNIQUE(roleId, version),
    FOREIGN KEY(createdBy) REFERENCES users(id),
    FOREIGN KEY(publishedBy) REFERENCES users(id)
  );
  CREATE INDEX IF NOT EXISTS taxonomy_role_versions_role_status
    ON taxonomy_role_versions(roleId, status, version DESC);

  CREATE TABLE IF NOT EXISTS taxonomy_role_reviews (
    id TEXT PRIMARY KEY,
    versionId TEXT NOT NULL,
    reviewerUserId TEXT NOT NULL,
    decision TEXT NOT NULL,
    note TEXT NOT NULL,
    createdAt TEXT NOT NULL,
    UNIQUE(versionId, reviewerUserId),
    FOREIGN KEY(versionId) REFERENCES taxonomy_role_versions(id) ON DELETE CASCADE,
    FOREIGN KEY(reviewerUserId) REFERENCES users(id)
  );
  CREATE INDEX IF NOT EXISTS taxonomy_role_reviews_version
    ON taxonomy_role_reviews(versionId, createdAt DESC);
`);

export function checkTaxonomyRepository(): boolean {
  const versions = db.prepare(
    "SELECT name FROM sqlite_master WHERE type = 'table' AND name = 'taxonomy_role_versions'"
  ).get();
  const reviews = db.prepare(
    "SELECT name FROM sqlite_master WHERE type = 'table' AND name = 'taxonomy_role_reviews'"
  ).get();
  return Boolean(versions && reviews);
}

export function findTaxonomyVersion(id: string): TaxonomyVersionRow | undefined {
  return db.prepare("SELECT * FROM taxonomy_role_versions WHERE id = ?").get(id) as unknown as TaxonomyVersionRow | undefined;
}

export function listTaxonomyVersions(input: {
  roleId?: string;
  status?: TaxonomyVersionStatus;
} = {}): TaxonomyVersionRow[] {
  if (input.roleId && input.status) {
    return db.prepare(`
      SELECT * FROM taxonomy_role_versions
      WHERE roleId = ? AND status = ?
      ORDER BY version DESC
    `).all(input.roleId, input.status) as unknown as TaxonomyVersionRow[];
  }
  if (input.roleId) {
    return db.prepare(`
      SELECT * FROM taxonomy_role_versions
      WHERE roleId = ?
      ORDER BY version DESC
    `).all(input.roleId) as unknown as TaxonomyVersionRow[];
  }
  if (input.status) {
    return db.prepare(`
      SELECT * FROM taxonomy_role_versions
      WHERE status = ?
      ORDER BY updatedAt DESC
    `).all(input.status) as unknown as TaxonomyVersionRow[];
  }
  return db.prepare("SELECT * FROM taxonomy_role_versions ORDER BY updatedAt DESC").all() as unknown as TaxonomyVersionRow[];
}

export function listPendingTaxonomyReviews(): TaxonomyVersionRow[] {
  return listTaxonomyVersions({ status: "in_review" });
}

export function listTaxonomyReviews(versionId: string): TaxonomyReviewRow[] {
  return db.prepare(`
    SELECT * FROM taxonomy_role_reviews
    WHERE versionId = ?
    ORDER BY createdAt DESC
  `).all(versionId) as unknown as TaxonomyReviewRow[];
}

export function findOpenTaxonomyVersion(roleId: string): TaxonomyVersionRow | undefined {
  return db.prepare(`
    SELECT * FROM taxonomy_role_versions
    WHERE roleId = ? AND status IN ('draft', 'in_review', 'approved')
    ORDER BY version DESC LIMIT 1
  `).get(roleId) as unknown as TaxonomyVersionRow | undefined;
}

export function createTaxonomyDraft(input: {
  roleId: string;
  snapshot: unknown;
  changeNote: string;
  createdBy: string;
}): TaxonomyVersionRow {
  const open = findOpenTaxonomyVersion(input.roleId);
  if (open) throw new Error("TAXONOMY_OPEN_VERSION_EXISTS");

  const latest = db.prepare(
    "SELECT MAX(version) AS version FROM taxonomy_role_versions WHERE roleId = ?"
  ).get(input.roleId) as { version: number | null };
  const version = Number(latest.version || 0) + 1;
  const now = new Date().toISOString();
  const id = randomUUID();
  db.prepare(`
    INSERT INTO taxonomy_role_versions (
      id, roleId, version, status, snapshot, changeNote, createdBy,
      createdAt, updatedAt, submittedAt, publishedAt, publishedBy
    ) VALUES (?, ?, ?, 'draft', ?, ?, ?, ?, ?, NULL, NULL, NULL)
  `).run(
    id,
    input.roleId,
    version,
    JSON.stringify(input.snapshot),
    input.changeNote,
    input.createdBy,
    now,
    now
  );
  return findTaxonomyVersion(id)!;
}

export function updateTaxonomyDraft(input: {
  id: string;
  snapshot: unknown;
  changeNote: string;
}): TaxonomyVersionRow | undefined {
  const existing = findTaxonomyVersion(input.id);
  if (!existing || existing.status !== "draft") return undefined;
  const now = new Date().toISOString();
  db.prepare(`
    UPDATE taxonomy_role_versions
    SET snapshot = ?, changeNote = ?, updatedAt = ?
    WHERE id = ? AND status = 'draft'
  `).run(JSON.stringify(input.snapshot), input.changeNote, now, input.id);
  return findTaxonomyVersion(input.id);
}

export function submitTaxonomyVersion(id: string): TaxonomyVersionRow | undefined {
  const existing = findTaxonomyVersion(id);
  if (!existing || existing.status !== "draft") return undefined;
  const now = new Date().toISOString();
  db.prepare(`
    UPDATE taxonomy_role_versions
    SET status = 'in_review', submittedAt = ?, updatedAt = ?
    WHERE id = ? AND status = 'draft'
  `).run(now, now, id);
  return findTaxonomyVersion(id);
}

export function reviewTaxonomyVersion(input: {
  versionId: string;
  reviewerUserId: string;
  decision: TaxonomyReviewDecision;
  note: string;
}): TaxonomyVersionRow | undefined {
  const version = findTaxonomyVersion(input.versionId);
  if (!version || version.status !== "in_review") return undefined;
  const now = new Date().toISOString();

  db.exec("BEGIN IMMEDIATE");
  try {
    db.prepare(`
      INSERT INTO taxonomy_role_reviews (id, versionId, reviewerUserId, decision, note, createdAt)
      VALUES (?, ?, ?, ?, ?, ?)
    `).run(randomUUID(), input.versionId, input.reviewerUserId, input.decision, input.note, now);
    db.prepare(`
      UPDATE taxonomy_role_versions
      SET status = ?, updatedAt = ?
      WHERE id = ? AND status = 'in_review'
    `).run(input.decision, now, input.versionId);
    db.exec("COMMIT");
  } catch (error) {
    db.exec("ROLLBACK");
    throw error;
  }
  return findTaxonomyVersion(input.versionId);
}

export function publishTaxonomyVersion(input: {
  id: string;
  publishedBy: string;
}): TaxonomyVersionRow | undefined {
  const version = findTaxonomyVersion(input.id);
  if (!version || version.status !== "approved") return undefined;
  const now = new Date().toISOString();

  db.exec("BEGIN IMMEDIATE");
  try {
    db.prepare(`
      UPDATE taxonomy_role_versions
      SET status = 'superseded', updatedAt = ?
      WHERE roleId = ? AND status = 'published'
    `).run(now, version.roleId);
    db.prepare(`
      UPDATE taxonomy_role_versions
      SET status = 'published', publishedAt = ?, publishedBy = ?, updatedAt = ?
      WHERE id = ? AND status = 'approved'
    `).run(now, input.publishedBy, now, input.id);
    db.exec("COMMIT");
  } catch (error) {
    db.exec("ROLLBACK");
    throw error;
  }
  return findTaxonomyVersion(input.id);
}

export function listPublishedTaxonomyVersions(): TaxonomyVersionRow[] {
  return db.prepare(`
    SELECT * FROM taxonomy_role_versions
    WHERE status = 'published'
    ORDER BY roleId ASC, version DESC
  `).all() as unknown as TaxonomyVersionRow[];
}

export function toPublicTaxonomyVersion(row: TaxonomyVersionRow) {
  return {
    ...row,
    snapshot: JSON.parse(row.snapshot) as unknown,
    reviews: listTaxonomyReviews(row.id),
  };
}
