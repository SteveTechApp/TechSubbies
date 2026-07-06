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
