import { DatabaseSync } from "node:sqlite";
import { randomUUID } from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import { currentSchemaVersion, runMigrations } from "./migrations.js";

// Uses Node's built-in SQLite module (stable since Node 22.5, no native
// binary download required) rather than a database engine that needs to
// fetch prebuilt binaries at install time - keeping the backend runnable
// offline and behind restrictive network setups.

const DB_FILE = process.env.DB_FILE || path.join(process.cwd(), "data", "techsubbies.db");
fs.mkdirSync(path.dirname(DB_FILE), { recursive: true });

export const db = new DatabaseSync(DB_FILE);

// WAL allows readers to continue while a write is committed. A bounded busy
// timeout absorbs short write contention instead of immediately failing a
// marketplace action with SQLITE_BUSY.
db.prepare("PRAGMA journal_mode = WAL").get();
db.exec(`
  PRAGMA synchronous = NORMAL;
  PRAGMA foreign_keys = ON;
  PRAGMA busy_timeout = 5000;
`);

export function checkDatabaseConnection(): boolean {
  const result = db.prepare("SELECT 1 AS ok").get() as { ok?: number } | undefined;
  return result?.ok === 1 && currentSchemaVersion(db) === LATEST_SCHEMA_VERSION;
}

export function getDatabaseRuntimeSettings() {
  const journal = db.prepare("PRAGMA journal_mode").get() as { journal_mode: string };
  const synchronous = db.prepare("PRAGMA synchronous").get() as { synchronous: number };
  const foreignKeys = db.prepare("PRAGMA foreign_keys").get() as { foreign_keys: number };
  const busyTimeout = db.prepare("PRAGMA busy_timeout").get() as { timeout: number };
  return {
    journalMode: journal.journal_mode,
    synchronous: synchronous.synchronous,
    foreignKeys: foreignKeys.foreign_keys === 1,
    busyTimeoutMs: busyTimeout.timeout,
  };
}

db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    role TEXT NOT NULL,
    name TEXT NOT NULL,
    profile TEXT NOT NULL,
    emailVerified INTEGER NOT NULL DEFAULT 0,
    sessionVersion INTEGER NOT NULL DEFAULT 0,
    createdAt TEXT NOT NULL,
    updatedAt TEXT NOT NULL
  );
`);

// Existing development databases pre-date email verification.
const userColumns = db.prepare("PRAGMA table_info(users)").all() as unknown as { name: string }[];
if (!userColumns.some((column) => column.name === "emailVerified")) {
  db.exec("ALTER TABLE users ADD COLUMN emailVerified INTEGER NOT NULL DEFAULT 0");
}
if (!userColumns.some((column) => column.name === "sessionVersion")) {
  db.exec("ALTER TABLE users ADD COLUMN sessionVersion INTEGER NOT NULL DEFAULT 0");
}

db.exec(`
  CREATE TABLE IF NOT EXISTS account_tokens (
    tokenHash TEXT PRIMARY KEY,
    userId TEXT NOT NULL,
    type TEXT NOT NULL,
    expiresAt TEXT NOT NULL,
    createdAt TEXT NOT NULL
  );
  CREATE INDEX IF NOT EXISTS account_tokens_user_type ON account_tokens(userId, type);
`);

db.exec(`
  CREATE TABLE IF NOT EXISTS partnership_requests (
    id TEXT PRIMARY KEY,
    requesterId TEXT NOT NULL,
    partnerId TEXT NOT NULL,
    status TEXT NOT NULL,
    createdAt TEXT NOT NULL,
    updatedAt TEXT NOT NULL
  );
`);

db.exec(`
  CREATE TABLE IF NOT EXISTS company_attachment_requests (
    id TEXT PRIMARY KEY,
    engineerId TEXT NOT NULL,
    resourcingCompanyId TEXT NOT NULL,
    status TEXT NOT NULL,
    createdAt TEXT NOT NULL,
    updatedAt TEXT NOT NULL
  );
`);

db.exec(`
  CREATE TABLE IF NOT EXISTS jobs (
    id TEXT PRIMARY KEY,
    companyId TEXT NOT NULL,
    data TEXT NOT NULL,
    status TEXT NOT NULL,
    postedDate TEXT NOT NULL,
    updatedAt TEXT NOT NULL
  );
`);

db.exec(`
  CREATE TABLE IF NOT EXISTS applications (
    id TEXT PRIMARY KEY,
    jobId TEXT NOT NULL,
    engineerId TEXT NOT NULL,
    status TEXT NOT NULL,
    reviewed INTEGER NOT NULL DEFAULT 0,
    createdAt TEXT NOT NULL,
    updatedAt TEXT NOT NULL,
    UNIQUE(jobId, engineerId)
  );
`);

db.exec(`
  CREATE TABLE IF NOT EXISTS contracts (
    id TEXT PRIMARY KEY,
    jobId TEXT NOT NULL,
    companyId TEXT NOT NULL,
    engineerId TEXT NOT NULL,
    data TEXT NOT NULL,
    status TEXT NOT NULL,
    engineerSignature TEXT,
    companySignature TEXT,
    milestones TEXT NOT NULL DEFAULT '[]',
    timesheets TEXT NOT NULL DEFAULT '[]',
    createdAt TEXT NOT NULL,
    updatedAt TEXT NOT NULL
  );
`);

db.exec(`
  CREATE TABLE IF NOT EXISTS conversations (
    id TEXT PRIMARY KEY,
    participantAId TEXT NOT NULL,
    participantBId TEXT NOT NULL,
    lastMessageText TEXT NOT NULL DEFAULT '',
    lastMessageTimestamp TEXT NOT NULL,
    createdAt TEXT NOT NULL,
    updatedAt TEXT NOT NULL
  );
`);

db.exec(`
  CREATE TABLE IF NOT EXISTS messages (
    id TEXT PRIMARY KEY,
    conversationId TEXT NOT NULL,
    senderId TEXT NOT NULL,
    text TEXT NOT NULL,
    timestamp TEXT NOT NULL,
    isRead INTEGER NOT NULL DEFAULT 0
  );
`);

export const LATEST_SCHEMA_VERSION = 8;
runMigrations(db, [
  {
    version: 1,
    name: "baseline-marketplace-schema",
    // The existing idempotent CREATE TABLE statements above establish the
    // baseline for new and pre-migration databases.
    up: () => undefined,
  },
  {
    version: 2,
    name: "account-security-audit-events",
    up: (database) => database.exec(`
      CREATE TABLE account_audit_events (
        id TEXT PRIMARY KEY,
        eventType TEXT NOT NULL,
        outcome TEXT NOT NULL,
        userId TEXT,
        subjectHash TEXT,
        requestId TEXT NOT NULL,
        createdAt TEXT NOT NULL
      );
      CREATE INDEX account_audit_events_user_created
        ON account_audit_events(userId, createdAt DESC);
      CREATE INDEX account_audit_events_request
        ON account_audit_events(requestId);
    `),
  },
  {
    version: 3,
    name: "account-deletion-requests",
    up: (database) => database.exec(`
      CREATE TABLE account_deletion_requests (
        id TEXT PRIMARY KEY,
        userId TEXT NOT NULL UNIQUE,
        status TEXT NOT NULL,
        requestedAt TEXT NOT NULL,
        cancelledAt TEXT
      );
      CREATE INDEX account_deletion_requests_status
        ON account_deletion_requests(status, requestedAt);
    `),
  },
  {
    version: 4,
    name: "account-deletion-request-reviews",
    up: (database) => database.exec(`
      ALTER TABLE account_deletion_requests ADD COLUMN reviewedAt TEXT;
      ALTER TABLE account_deletion_requests ADD COLUMN reviewerId TEXT;
      ALTER TABLE account_deletion_requests ADD COLUMN resolutionNote TEXT;
    `),
  },
  {
    version: 5,
    name: "account-deletion-processing",
    up: (database) => database.exec(`
      ALTER TABLE users ADD COLUMN deletedAt TEXT;
      ALTER TABLE account_deletion_requests ADD COLUMN processedAt TEXT;
      ALTER TABLE account_deletion_requests ADD COLUMN processorId TEXT;
    `),
  },
  {
    version: 6,
    name: "privacy-review-user-messages",
    up: (database) => database.exec(`
      ALTER TABLE account_deletion_requests ADD COLUMN userMessage TEXT;
    `),
  },
  {
    version: 7,
    name: "account-suspensions",
    up: (database) => database.exec(`
      ALTER TABLE users ADD COLUMN suspendedAt TEXT;
      ALTER TABLE users ADD COLUMN suspensionReason TEXT;
      ALTER TABLE users ADD COLUMN suspendedBy TEXT;
    `),
  },
  {
    version: 8,
    name: "job-moderation",
    up: (database) => database.exec(`
      ALTER TABLE jobs ADD COLUMN moderatedAt TEXT;
      ALTER TABLE jobs ADD COLUMN moderatorId TEXT;
      ALTER TABLE jobs ADD COLUMN moderationReason TEXT;
    `),
  },
]);

export interface UserRow {
  id: string;
  email: string;
  password: string;
  role: string;
  name: string;
  profile: string;
  emailVerified: number;
  sessionVersion: number;
  deletedAt: string | null;
  suspendedAt: string | null;
  suspensionReason: string | null;
  suspendedBy: string | null;
  createdAt: string;
  updatedAt: string;
}

export function findUserByEmail(email: string): UserRow | undefined {
  return db.prepare("SELECT * FROM users WHERE email = ?").get(email) as unknown as UserRow | undefined;
}

export function findUserById(id: string): UserRow | undefined {
  return db.prepare("SELECT * FROM users WHERE id = ?").get(id) as unknown as UserRow | undefined;
}

export function listUsers(): UserRow[] {
  return db.prepare(
    "SELECT * FROM users WHERE deletedAt IS NULL AND suspendedAt IS NULL ORDER BY createdAt DESC"
  ).all() as unknown as UserRow[];
}

export function createUser(input: { email: string; password: string; role: string; name: string; profile: string }): UserRow {
  const id = randomUUID();
  const now = new Date().toISOString();
  db.prepare(
    "INSERT INTO users (id, email, password, role, name, profile, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?, ?, ?, ?)"
  ).run(id, input.email, input.password, input.role, input.name, input.profile, now, now);
  return findUserById(id)!;
}

export function updateUserProfile(id: string, profile: string, name: string): UserRow | undefined {
  const now = new Date().toISOString();
  db.prepare("UPDATE users SET profile = ?, name = ?, updatedAt = ? WHERE id = ?").run(profile, name, now, id);
  return findUserById(id);
}

export function markEmailVerified(id: string): UserRow | undefined {
  db.prepare("UPDATE users SET emailVerified = 1, updatedAt = ? WHERE id = ?").run(new Date().toISOString(), id);
  return findUserById(id);
}

export function updateUserPassword(id: string, passwordHash: string): UserRow | undefined {
  db.prepare("UPDATE users SET password = ?, sessionVersion = sessionVersion + 1, updatedAt = ? WHERE id = ?").run(
    passwordHash,
    new Date().toISOString(),
    id
  );
  return findUserById(id);
}

export function revokeUserSessions(id: string): UserRow | undefined {
  db.prepare(
    "UPDATE users SET sessionVersion = sessionVersion + 1, updatedAt = ? WHERE id = ?"
  ).run(new Date().toISOString(), id);
  return findUserById(id);
}

export function setUserSuspension(
  id: string,
  suspended: boolean,
  reason: string | null,
  administratorId: string
): UserRow | undefined {
  const existing = findUserById(id);
  if (!existing || existing.deletedAt) return undefined;
  const now = new Date().toISOString();
  db.prepare(`
    UPDATE users
    SET suspendedAt = ?, suspensionReason = ?, suspendedBy = ?,
        sessionVersion = sessionVersion + 1, updatedAt = ?
    WHERE id = ?
  `).run(
    suspended ? now : null,
    suspended ? reason : null,
    suspended ? administratorId : null,
    now,
    id
  );
  return findUserById(id);
}

export function listAdminUsers(options: { limit: number; offset: number; query: string }) {
  const query = `%${options.query.trim().toLowerCase()}%`;
  return db.prepare(`
    SELECT id, email, role, name, emailVerified, suspendedAt,
           suspensionReason, createdAt, updatedAt
    FROM users
    WHERE deletedAt IS NULL
      AND (? = '%%' OR LOWER(email) LIKE ? OR LOWER(name) LIKE ?)
    ORDER BY createdAt DESC
    LIMIT ? OFFSET ?
  `).all(query, query, query, options.limit, options.offset);
}

export function countAdminUsers(queryText: string): number {
  const query = `%${queryText.trim().toLowerCase()}%`;
  const row = db.prepare(`
    SELECT COUNT(*) AS total FROM users
    WHERE deletedAt IS NULL
      AND (? = '%%' OR LOWER(email) LIKE ? OR LOWER(name) LIKE ?)
  `).get(query, query, query) as { total: number };
  return row.total;
}

export type MembershipSelection = {
  userId: string;
  email: string;
  name: string;
  activeTier: string;
  requestedTier: string;
  requestedAt: string;
};

export function listPendingMembershipSelections(): MembershipSelection[] {
  const rows = db.prepare(`
    SELECT id, email, name, profile
    FROM users
    WHERE role = 'Engineer' AND deletedAt IS NULL AND suspendedAt IS NULL
    ORDER BY updatedAt ASC
  `).all() as unknown as Array<{ id: string; email: string; name: string; profile: string }>;

  return rows.flatMap((row) => {
    try {
      const profile = JSON.parse(row.profile) as Record<string, unknown>;
      if (typeof profile.requestedProfileTier !== "string" || typeof profile.membershipRequestedAt !== "string") {
        return [];
      }
      return [{
        userId: row.id,
        email: row.email,
        name: row.name,
        activeTier: typeof profile.profileTier === "string" ? profile.profileTier : "Bronze",
        requestedTier: profile.requestedProfileTier,
        requestedAt: profile.membershipRequestedAt,
      }];
    } catch {
      return [];
    }
  });
}

export function activateRequestedMembership(userId: string): UserRow | undefined {
  const user = findUserById(userId);
  if (!user || user.role !== "Engineer" || user.deletedAt || user.suspendedAt) return undefined;

  let profile: Record<string, unknown>;
  try {
    profile = JSON.parse(user.profile) as Record<string, unknown>;
  } catch {
    return undefined;
  }
  const requestedTier = profile.requestedProfileTier;
  if (!["Bronze", "Silver", "Gold", "Platinum"].includes(String(requestedTier))) return undefined;

  profile.profileTier = requestedTier;
  profile.membershipActivatedAt = new Date().toISOString();
  delete profile.requestedProfileTier;
  delete profile.membershipRequestedAt;
  return updateUserProfile(user.id, JSON.stringify(profile), user.name);
}

export type AdminPlatformMetrics = {
  users: {
    total: number;
    engineers: number;
    companies: number;
    resourcingCompanies: number;
    suspended: number;
  };
  marketplace: {
    jobsTotal: number;
    jobsActive: number;
    applications: number;
    contractsTotal: number;
    contractsActive: number;
  };
  privacyPending: number;
};

export function getAdminPlatformMetrics(): AdminPlatformMetrics {
  const users = db.prepare(`
    SELECT
      COUNT(*) AS total,
      COALESCE(SUM(CASE WHEN role = 'Engineer' THEN 1 ELSE 0 END), 0) AS engineers,
      COALESCE(SUM(CASE WHEN role = 'Company' THEN 1 ELSE 0 END), 0) AS companies,
      COALESCE(SUM(CASE WHEN role = 'Resourcing Company' THEN 1 ELSE 0 END), 0) AS resourcingCompanies,
      COALESCE(SUM(CASE WHEN suspendedAt IS NOT NULL THEN 1 ELSE 0 END), 0) AS suspended
    FROM users WHERE deletedAt IS NULL
  `).get() as AdminPlatformMetrics["users"];
  const jobs = db.prepare(`
    SELECT COUNT(*) AS total,
      COALESCE(SUM(CASE WHEN status = 'active' THEN 1 ELSE 0 END), 0) AS active
    FROM jobs
  `).get() as { total: number; active: number };
  const contracts = db.prepare(`
    SELECT COUNT(*) AS total,
      COALESCE(SUM(CASE WHEN status = 'Active' THEN 1 ELSE 0 END), 0) AS active
    FROM contracts
  `).get() as { total: number; active: number };
  const applications = db.prepare("SELECT COUNT(*) AS total FROM applications").get() as { total: number };
  const privacy = db.prepare(
    "SELECT COUNT(*) AS total FROM account_deletion_requests WHERE status = 'pending'"
  ).get() as { total: number };
  return {
    users,
    marketplace: {
      jobsTotal: jobs.total,
      jobsActive: jobs.active,
      applications: applications.total,
      contractsTotal: contracts.total,
      contractsActive: contracts.active,
    },
    privacyPending: privacy.total,
  };
}

// --- Partnership requests (engineer <-> engineer "team" pairing) ---

export interface PartnershipRequestRow {
  id: string;
  requesterId: string;
  partnerId: string;
  status: string;
  createdAt: string;
  updatedAt: string;
}

export function createPartnershipRequest(requesterId: string, partnerId: string): PartnershipRequestRow {
  const id = randomUUID();
  const now = new Date().toISOString();
  db.prepare(
    "INSERT INTO partnership_requests (id, requesterId, partnerId, status, createdAt, updatedAt) VALUES (?, ?, ?, 'pending', ?, ?)"
  ).run(id, requesterId, partnerId, now, now);
  return findPartnershipRequestById(id)!;
}

export function findPartnershipRequestById(id: string): PartnershipRequestRow | undefined {
  return db.prepare("SELECT * FROM partnership_requests WHERE id = ?").get(id) as unknown as
    | PartnershipRequestRow
    | undefined;
}

export function listPartnershipRequestsForUser(userId: string): PartnershipRequestRow[] {
  return db
    .prepare(
      "SELECT * FROM partnership_requests WHERE requesterId = ? OR partnerId = ? ORDER BY createdAt DESC"
    )
    .all(userId, userId) as unknown as PartnershipRequestRow[];
}

export function findPendingPartnershipRequestBetween(
  userAId: string,
  userBId: string
): PartnershipRequestRow | undefined {
  return db
    .prepare(
      "SELECT * FROM partnership_requests WHERE status = 'pending' AND ((requesterId = ? AND partnerId = ?) OR (requesterId = ? AND partnerId = ?))"
    )
    .get(userAId, userBId, userBId, userAId) as unknown as PartnershipRequestRow | undefined;
}

export function updatePartnershipRequestStatus(id: string, status: string): PartnershipRequestRow | undefined {
  const now = new Date().toISOString();
  db.prepare("UPDATE partnership_requests SET status = ?, updatedAt = ? WHERE id = ?").run(status, now, id);
  return findPartnershipRequestById(id);
}

// --- Company attachment requests (engineer -> resourcing company) ---

export interface CompanyAttachmentRequestRow {
  id: string;
  engineerId: string;
  resourcingCompanyId: string;
  status: string;
  createdAt: string;
  updatedAt: string;
}

export function createCompanyAttachmentRequest(
  engineerId: string,
  resourcingCompanyId: string
): CompanyAttachmentRequestRow {
  const id = randomUUID();
  const now = new Date().toISOString();
  db.prepare(
    "INSERT INTO company_attachment_requests (id, engineerId, resourcingCompanyId, status, createdAt, updatedAt) VALUES (?, ?, ?, 'pending', ?, ?)"
  ).run(id, engineerId, resourcingCompanyId, now, now);
  return findCompanyAttachmentRequestById(id)!;
}

export function findCompanyAttachmentRequestById(id: string): CompanyAttachmentRequestRow | undefined {
  return db.prepare("SELECT * FROM company_attachment_requests WHERE id = ?").get(id) as unknown as
    | CompanyAttachmentRequestRow
    | undefined;
}

export function listCompanyAttachmentRequestsForEngineer(engineerId: string): CompanyAttachmentRequestRow[] {
  return db
    .prepare("SELECT * FROM company_attachment_requests WHERE engineerId = ? ORDER BY createdAt DESC")
    .all(engineerId) as unknown as CompanyAttachmentRequestRow[];
}

export function listPendingCompanyAttachmentRequestsForCompany(
  resourcingCompanyId: string
): CompanyAttachmentRequestRow[] {
  return db
    .prepare(
      "SELECT * FROM company_attachment_requests WHERE resourcingCompanyId = ? AND status = 'pending' ORDER BY createdAt DESC"
    )
    .all(resourcingCompanyId) as unknown as CompanyAttachmentRequestRow[];
}

export function findPendingCompanyAttachmentRequest(
  engineerId: string,
  resourcingCompanyId: string
): CompanyAttachmentRequestRow | undefined {
  return db
    .prepare(
      "SELECT * FROM company_attachment_requests WHERE engineerId = ? AND resourcingCompanyId = ? AND status = 'pending'"
    )
    .get(engineerId, resourcingCompanyId) as unknown as CompanyAttachmentRequestRow | undefined;
}

export function updateCompanyAttachmentRequestStatus(
  id: string,
  status: string
): CompanyAttachmentRequestRow | undefined {
  const now = new Date().toISOString();
  db.prepare("UPDATE company_attachment_requests SET status = ?, updatedAt = ? WHERE id = ?").run(status, now, id);
  return findCompanyAttachmentRequestById(id);
}

// --- Jobs ---
// The job-specific fields (title, description, dayRate, skillRequirements,
// etc - see types/index.ts `Job` on the frontend) are stored as a single
// JSON blob, the same pattern as `users.profile`, so the frontend's Job
// shape can evolve without a matching migration every time.

export interface JobRow {
  id: string;
  companyId: string;
  data: string;
  status: string;
  postedDate: string;
  updatedAt: string;
  moderatedAt: string | null;
  moderatorId: string | null;
  moderationReason: string | null;
}

export function createJob(companyId: string, data: Record<string, unknown>): JobRow {
  const id = randomUUID();
  const now = new Date().toISOString();
  db.prepare(
    "INSERT INTO jobs (id, companyId, data, status, postedDate, updatedAt) VALUES (?, ?, ?, 'active', ?, ?)"
  ).run(id, companyId, JSON.stringify(data), now, now);
  return findJobById(id)!;
}

export function findJobById(id: string): JobRow | undefined {
  return db.prepare("SELECT * FROM jobs WHERE id = ?").get(id) as unknown as JobRow | undefined;
}

export function listActiveJobs(): JobRow[] {
  return db.prepare(`
    SELECT jobs.* FROM jobs
    JOIN users ON users.id = jobs.companyId
    WHERE jobs.status = 'active'
      AND users.deletedAt IS NULL
      AND users.suspendedAt IS NULL
    ORDER BY jobs.postedDate DESC
  `).all() as unknown as JobRow[];
}

export function listJobsForCompany(companyId: string): JobRow[] {
  return db
    .prepare("SELECT * FROM jobs WHERE companyId = ? ORDER BY postedDate DESC")
    .all(companyId) as unknown as JobRow[];
}

export function updateJob(
  id: string,
  updates: { data?: Record<string, unknown>; status?: string }
): JobRow | undefined {
  const existing = findJobById(id);
  if (!existing) return undefined;

  const mergedData = updates.data ? { ...JSON.parse(existing.data), ...updates.data } : JSON.parse(existing.data);
  const status = updates.status || existing.status;
  const now = new Date().toISOString();

  db.prepare("UPDATE jobs SET data = ?, status = ?, updatedAt = ? WHERE id = ?").run(
    JSON.stringify(mergedData),
    status,
    now,
    id
  );
  return findJobById(id);
}

export type AdminJobRow = JobRow & {
  companyName: string;
  companyEmail: string;
};

export function listAdminJobs(options: {
  limit: number;
  offset: number;
  query: string;
}): AdminJobRow[] {
  const query = `%${options.query.trim().toLowerCase()}%`;
  return db.prepare(`
    SELECT jobs.*, users.name AS companyName, users.email AS companyEmail
    FROM jobs
    JOIN users ON users.id = jobs.companyId
    WHERE (? = '%%'
      OR LOWER(json_extract(jobs.data, '$.title')) LIKE ?
      OR LOWER(users.name) LIKE ?
      OR LOWER(users.email) LIKE ?
      OR LOWER(jobs.id) LIKE ?)
    ORDER BY jobs.postedDate DESC
    LIMIT ? OFFSET ?
  `).all(query, query, query, query, query, options.limit, options.offset) as unknown as AdminJobRow[];
}

export function countAdminJobs(queryText: string): number {
  const query = `%${queryText.trim().toLowerCase()}%`;
  const row = db.prepare(`
    SELECT COUNT(*) AS total
    FROM jobs
    JOIN users ON users.id = jobs.companyId
    WHERE (? = '%%'
      OR LOWER(json_extract(jobs.data, '$.title')) LIKE ?
      OR LOWER(users.name) LIKE ?
      OR LOWER(users.email) LIKE ?
      OR LOWER(jobs.id) LIKE ?)
  `).get(query, query, query, query, query) as { total: number };
  return row.total;
}

export function moderateJob(
  id: string,
  status: "active" | "closed",
  moderatorId: string,
  reason: string | null
): JobRow | undefined {
  const existing = findJobById(id);
  if (!existing) return undefined;
  const now = new Date().toISOString();
  db.prepare(`
    UPDATE jobs
    SET status = ?, moderatedAt = ?, moderatorId = ?,
        moderationReason = ?, updatedAt = ?
    WHERE id = ?
  `).run(status, now, moderatorId, status === "closed" ? reason : null, now, id);
  return findJobById(id);
}

// --- Applications ---

export interface ApplicationRow {
  id: string;
  jobId: string;
  engineerId: string;
  status: string;
  reviewed: number;
  createdAt: string;
  updatedAt: string;
}

export function createApplication(jobId: string, engineerId: string, status: string): ApplicationRow {
  const id = randomUUID();
  const now = new Date().toISOString();
  db.prepare(
    "INSERT INTO applications (id, jobId, engineerId, status, reviewed, createdAt, updatedAt) VALUES (?, ?, ?, ?, 0, ?, ?)"
  ).run(id, jobId, engineerId, status, now, now);
  return findApplicationById(id)!;
}

export function findApplicationById(id: string): ApplicationRow | undefined {
  return db.prepare("SELECT * FROM applications WHERE id = ?").get(id) as unknown as ApplicationRow | undefined;
}

export function findApplication(jobId: string, engineerId: string): ApplicationRow | undefined {
  return db
    .prepare("SELECT * FROM applications WHERE jobId = ? AND engineerId = ?")
    .get(jobId, engineerId) as unknown as ApplicationRow | undefined;
}

export function listApplicationsForJob(jobId: string): ApplicationRow[] {
  return db
    .prepare("SELECT * FROM applications WHERE jobId = ? ORDER BY createdAt DESC")
    .all(jobId) as unknown as ApplicationRow[];
}

export function listApplicationsForEngineer(engineerId: string): ApplicationRow[] {
  return db
    .prepare("SELECT * FROM applications WHERE engineerId = ? ORDER BY createdAt DESC")
    .all(engineerId) as unknown as ApplicationRow[];
}

export function listApplicationsForCompany(companyId: string): ApplicationRow[] {
  return db.prepare(`
    SELECT applications.*
    FROM applications
    JOIN jobs ON jobs.id = applications.jobId
    WHERE jobs.companyId = ?
    ORDER BY applications.createdAt DESC
  `).all(companyId) as unknown as ApplicationRow[];
}

export function updateApplicationStatus(id: string, status: string, reviewed?: boolean): ApplicationRow | undefined {
  const existing = findApplicationById(id);
  if (!existing) return undefined;
  const now = new Date().toISOString();
  db.prepare("UPDATE applications SET status = ?, reviewed = ?, updatedAt = ? WHERE id = ?").run(
    status,
    reviewed === undefined ? existing.reviewed : reviewed ? 1 : 0,
    now,
    id
  );
  return findApplicationById(id);
}

// --- Contracts, milestones & timesheets ---
// Like `jobs.data`, the free-form contract fields (description, amount,
// currency, type, jobTitle...) live in a JSON blob so the frontend's
// Contract shape can evolve without a migration. Milestones, timesheets and
// the two signatures get their own columns (still JSON-encoded) because
// they're each updated independently and often - keeping them separate
// avoids re-writing the whole blob on every milestone tick.

export interface ContractRow {
  id: string;
  jobId: string;
  companyId: string;
  engineerId: string;
  data: string;
  status: string;
  engineerSignature: string | null;
  companySignature: string | null;
  milestones: string;
  timesheets: string;
  createdAt: string;
  updatedAt: string;
}

export function createContract(
  companyId: string,
  engineerId: string,
  jobId: string,
  status: string,
  data: Record<string, unknown>,
  milestones: unknown[]
): ContractRow {
  const id = randomUUID();
  const now = new Date().toISOString();
  db.prepare(
    "INSERT INTO contracts (id, jobId, companyId, engineerId, data, status, engineerSignature, companySignature, milestones, timesheets, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?, ?, NULL, NULL, ?, '[]', ?, ?)"
  ).run(id, jobId, companyId, engineerId, JSON.stringify(data), status, JSON.stringify(milestones), now, now);
  return findContractById(id)!;
}

export function createContractAndHireApplication(
  applicationId: string,
  companyId: string,
  engineerId: string,
  jobId: string,
  status: string,
  data: Record<string, unknown>,
  milestones: unknown[]
): ContractRow {
  db.exec("BEGIN IMMEDIATE");
  try {
    const contract = createContract(companyId, engineerId, jobId, status, data, milestones);
    if (!updateApplicationStatus(applicationId, "Hired", true)) {
      throw new Error("Application disappeared while creating the contract.");
    }
    db.exec("COMMIT");
    return contract;
  } catch (error) {
    db.exec("ROLLBACK");
    throw error;
  }
}

export function findContractById(id: string): ContractRow | undefined {
  return db.prepare("SELECT * FROM contracts WHERE id = ?").get(id) as unknown as ContractRow | undefined;
}

export function findContractForApplication(jobId: string, engineerId: string): ContractRow | undefined {
  return db
    .prepare("SELECT * FROM contracts WHERE jobId = ? AND engineerId = ?")
    .get(jobId, engineerId) as unknown as ContractRow | undefined;
}

export function listContractsForUser(userId: string): ContractRow[] {
  return db
    .prepare("SELECT * FROM contracts WHERE companyId = ? OR engineerId = ? ORDER BY createdAt DESC")
    .all(userId, userId) as unknown as ContractRow[];
}

export function updateContractSignature(
  id: string,
  field: "engineerSignature" | "companySignature",
  signature: { name: string; date: string },
  status: string
): ContractRow | undefined {
  const now = new Date().toISOString();
  db.prepare(`UPDATE contracts SET ${field} = ?, status = ?, updatedAt = ? WHERE id = ?`).run(
    JSON.stringify(signature),
    status,
    now,
    id
  );
  return findContractById(id);
}

export function updateContractMilestones(id: string, milestones: unknown[]): ContractRow | undefined {
  const now = new Date().toISOString();
  db.prepare("UPDATE contracts SET milestones = ?, updatedAt = ? WHERE id = ?").run(
    JSON.stringify(milestones),
    now,
    id
  );
  return findContractById(id);
}

export function updateContractTimesheets(id: string, timesheets: unknown[]): ContractRow | undefined {
  const now = new Date().toISOString();
  db.prepare("UPDATE contracts SET timesheets = ?, updatedAt = ? WHERE id = ?").run(
    JSON.stringify(timesheets),
    now,
    id
  );
  return findContractById(id);
}

// --- Conversations & messages ---
// Every conversation in this app is a 1:1 chat between two users, so the
// two participants get their own indexed columns (participantAId /
// participantBId) rather than a JSON blob - that makes "find the
// conversation between these two people" and "list my conversations" plain
// indexed lookups instead of a JSON scan.

export interface ConversationRow {
  id: string;
  participantAId: string;
  participantBId: string;
  lastMessageText: string;
  lastMessageTimestamp: string;
  createdAt: string;
  updatedAt: string;
}

export function createConversation(userAId: string, userBId: string): ConversationRow {
  const id = randomUUID();
  const now = new Date().toISOString();
  db.prepare(
    "INSERT INTO conversations (id, participantAId, participantBId, lastMessageText, lastMessageTimestamp, createdAt, updatedAt) VALUES (?, ?, ?, '', ?, ?, ?)"
  ).run(id, userAId, userBId, now, now, now);
  return findConversationById(id)!;
}

export function findConversationById(id: string): ConversationRow | undefined {
  return db.prepare("SELECT * FROM conversations WHERE id = ?").get(id) as unknown as ConversationRow | undefined;
}

export function findConversationBetween(userAId: string, userBId: string): ConversationRow | undefined {
  return db
    .prepare(
      "SELECT * FROM conversations WHERE (participantAId = ? AND participantBId = ?) OR (participantAId = ? AND participantBId = ?)"
    )
    .get(userAId, userBId, userBId, userAId) as unknown as ConversationRow | undefined;
}

export function listConversationsForUser(userId: string): ConversationRow[] {
  return db
    .prepare(
      "SELECT * FROM conversations WHERE participantAId = ? OR participantBId = ? ORDER BY lastMessageTimestamp DESC"
    )
    .all(userId, userId) as unknown as ConversationRow[];
}

function touchConversation(id: string, lastMessageText: string, lastMessageTimestamp: string) {
  db.prepare("UPDATE conversations SET lastMessageText = ?, lastMessageTimestamp = ?, updatedAt = ? WHERE id = ?").run(
    lastMessageText,
    lastMessageTimestamp,
    lastMessageTimestamp,
    id
  );
}

export interface MessageRow {
  id: string;
  conversationId: string;
  senderId: string;
  text: string;
  timestamp: string;
  isRead: number;
}

export function createMessage(conversationId: string, senderId: string, text: string): MessageRow {
  const id = randomUUID();
  const now = new Date().toISOString();
  db.prepare(
    "INSERT INTO messages (id, conversationId, senderId, text, timestamp, isRead) VALUES (?, ?, ?, ?, ?, 0)"
  ).run(id, conversationId, senderId, text, now);
  touchConversation(conversationId, text, now);
  return findMessageById(id)!;
}

export function findMessageById(id: string): MessageRow | undefined {
  return db.prepare("SELECT * FROM messages WHERE id = ?").get(id) as unknown as MessageRow | undefined;
}

export function listMessagesForConversation(conversationId: string): MessageRow[] {
  return db
    .prepare("SELECT * FROM messages WHERE conversationId = ? ORDER BY timestamp ASC")
    .all(conversationId) as unknown as MessageRow[];
}
