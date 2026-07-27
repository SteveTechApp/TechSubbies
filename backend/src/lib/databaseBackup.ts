import { randomUUID } from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import { backup, DatabaseSync } from "node:sqlite";

export function createBackupFilename(now = new Date()): string {
  const timestamp = now.toISOString().replace(/[:.]/g, "-");
  return `techsubbies-${timestamp}-${randomUUID().slice(0, 8)}.sqlite`;
}

export async function createVerifiedDatabaseBackup(source: DatabaseSync, destination: string) {
  const resolvedDestination = path.resolve(destination);
  fs.mkdirSync(path.dirname(resolvedDestination), { recursive: true });
  if (fs.existsSync(resolvedDestination)) {
    throw new Error("Backup destination already exists.");
  }

  await backup(source, resolvedDestination);

  const copy = new DatabaseSync(resolvedDestination, { readOnly: true });
  try {
    const result = copy.prepare("PRAGMA integrity_check").get() as { integrity_check?: string };
    if (result.integrity_check !== "ok") {
      throw new Error("Backup integrity verification failed.");
    }
  } catch (error) {
    copy.close();
    fs.rmSync(resolvedDestination, { force: true });
    throw error;
  }
  copy.close();

  return {
    path: resolvedDestination,
    bytes: fs.statSync(resolvedDestination).size,
  };
}

const REQUIRED_TABLES = ["users", "jobs", "applications", "contracts", "invoices"];

export function verifyDatabaseBackup(backupPath: string) {
  const resolvedPath = path.resolve(backupPath);
  if (!fs.existsSync(resolvedPath) || !fs.statSync(resolvedPath).isFile()) {
    throw new Error("Backup file does not exist.");
  }

  const copy = new DatabaseSync(resolvedPath, { readOnly: true });
  try {
    const integrity = copy.prepare("PRAGMA integrity_check").get() as { integrity_check?: string };
    if (integrity.integrity_check !== "ok") {
      throw new Error("Backup integrity verification failed.");
    }
    const rows = copy.prepare(
      "SELECT name FROM sqlite_master WHERE type = 'table' AND name IN (?, ?, ?, ?, ?)"
    ).all(...REQUIRED_TABLES) as unknown as { name: string }[];
    const tableNames = new Set(rows.map((row) => row.name));
    const missingTables = REQUIRED_TABLES.filter((table) => !tableNames.has(table));
    if (missingTables.length) {
      throw new Error(`Backup is missing required tables: ${missingTables.join(", ")}.`);
    }
    return {
      path: resolvedPath,
      bytes: fs.statSync(resolvedPath).size,
      requiredTables: REQUIRED_TABLES.length,
    };
  } finally {
    copy.close();
  }
}
