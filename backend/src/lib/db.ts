import { DatabaseSync } from "node:sqlite";
import { randomUUID } from "node:crypto";
import fs from "node:fs";
import path from "node:path";

// Uses Node's built-in SQLite module (stable since Node 22.5, no native
// binary download required) rather than a database engine that needs to
// fetch prebuilt binaries at install time - keeping the backend runnable
// offline and behind restrictive network setups.

const DB_FILE = process.env.DB_FILE || path.join(process.cwd(), "data", "techsubbies.db");
fs.mkdirSync(path.dirname(DB_FILE), { recursive: true });

export const db = new DatabaseSync(DB_FILE);

db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    role TEXT NOT NULL,
    name TEXT NOT NULL,
    profile TEXT NOT NULL,
    createdAt TEXT NOT NULL,
    updatedAt TEXT NOT NULL
  );
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

export interface UserRow {
  id: string;
  email: string;
  password: string;
  role: string;
  name: string;
  profile: string;
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
  return db.prepare("SELECT * FROM users ORDER BY createdAt DESC").all() as unknown as UserRow[];
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
