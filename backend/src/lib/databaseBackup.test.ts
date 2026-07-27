import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { DatabaseSync } from "node:sqlite";
import { afterEach, describe, expect, it } from "vitest";
import { createBackupFilename, createVerifiedDatabaseBackup } from "./databaseBackup.js";

const temporaryDirectories: string[] = [];

afterEach(() => {
  for (const directory of temporaryDirectories.splice(0)) {
    fs.rmSync(directory, { recursive: true, force: true });
  }
});

describe("database backup", () => {
  it("creates filesystem-safe, unique backup names", () => {
    const name = createBackupFilename(new Date("2026-07-27T12:34:56.789Z"));
    expect(name).toMatch(/^techsubbies-2026-07-27T12-34-56-789Z-[0-9a-f]{8}\.sqlite$/);
  });

  it("backs up a live database and verifies the resulting copy", async () => {
    const directory = fs.mkdtempSync(path.join(os.tmpdir(), "techsubbies-backup-test-"));
    temporaryDirectories.push(directory);
    const sourcePath = path.join(directory, "source.sqlite");
    const destination = path.join(directory, "backups", createBackupFilename());
    const source = new DatabaseSync(sourcePath);
    source.exec("CREATE TABLE records (value TEXT NOT NULL); INSERT INTO records VALUES ('preserved');");

    const result = await createVerifiedDatabaseBackup(source, destination);
    source.close();

    expect(result.bytes).toBeGreaterThan(0);
    const copy = new DatabaseSync(destination, { readOnly: true });
    expect(copy.prepare("SELECT value FROM records").get()).toEqual({ value: "preserved" });
    copy.close();
  });

  it("never overwrites an existing backup", async () => {
    const directory = fs.mkdtempSync(path.join(os.tmpdir(), "techsubbies-backup-test-"));
    temporaryDirectories.push(directory);
    const destination = path.join(directory, "existing.sqlite");
    fs.writeFileSync(destination, "keep me");
    const source = new DatabaseSync(":memory:");

    await expect(createVerifiedDatabaseBackup(source, destination)).rejects.toThrow(/already exists/);
    expect(fs.readFileSync(destination, "utf8")).toBe("keep me");
    source.close();
  });
});
