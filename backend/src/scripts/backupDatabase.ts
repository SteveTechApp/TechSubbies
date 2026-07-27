import path from "node:path";
import { db } from "../lib/db.js";
import { createBackupFilename, createVerifiedDatabaseBackup } from "../lib/databaseBackup.js";

const backupDirectory = path.resolve(
  process.env.DB_BACKUP_DIR || path.join(process.cwd(), "data", "backups")
);
const destination = path.join(backupDirectory, createBackupFilename());

try {
  const result = await createVerifiedDatabaseBackup(db, destination);
  console.log(JSON.stringify({ event: "database_backup_complete", ...result }));
} catch (error) {
  console.error(JSON.stringify({
    event: "database_backup_failed",
    error: error instanceof Error ? error.message : "Unknown error",
  }));
  process.exitCode = 1;
}
