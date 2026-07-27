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
