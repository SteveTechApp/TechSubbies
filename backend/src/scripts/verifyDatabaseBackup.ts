import { verifyDatabaseBackup } from "../lib/databaseBackup.js";

const backupFile = process.env.BACKUP_FILE;
if (!backupFile) {
  console.error(JSON.stringify({
    event: "database_backup_verification_failed",
    error: "BACKUP_FILE is required.",
  }));
  process.exitCode = 1;
} else {
  try {
    const result = verifyDatabaseBackup(backupFile);
    console.log(JSON.stringify({ event: "database_backup_verified", ...result }));
  } catch (error) {
    console.error(JSON.stringify({
      event: "database_backup_verification_failed",
      error: error instanceof Error ? error.message : "Unknown error",
    }));
    process.exitCode = 1;
  }
}
