import type { DatabaseSync } from "node:sqlite";

export type Migration = {
  version: number;
  name: string;
  up: (database: DatabaseSync) => void;
};

export function runMigrations(database: DatabaseSync, migrations: Migration[]) {
  const ordered = [...migrations].sort((a, b) => a.version - b.version);
  const versions = new Set<number>();
  for (const migration of ordered) {
    if (!Number.isInteger(migration.version) || migration.version < 1) {
      throw new Error("Migration versions must be positive integers.");
    }
    if (versions.has(migration.version)) {
      throw new Error(`Duplicate migration version ${migration.version}.`);
    }
    versions.add(migration.version);
  }

  database.exec(`
    CREATE TABLE IF NOT EXISTS schema_migrations (
      version INTEGER PRIMARY KEY,
      name TEXT NOT NULL,
      appliedAt TEXT NOT NULL
    )
  `);
  const applied = new Set(
    (database.prepare("SELECT version FROM schema_migrations").all() as unknown as { version: number }[])
      .map((row) => row.version)
  );

  for (const migration of ordered) {
    if (applied.has(migration.version)) continue;
    database.exec("BEGIN IMMEDIATE");
    try {
      migration.up(database);
      database.prepare(
        "INSERT INTO schema_migrations (version, name, appliedAt) VALUES (?, ?, ?)"
      ).run(migration.version, migration.name, new Date().toISOString());
      database.exec("COMMIT");
    } catch (error) {
      database.exec("ROLLBACK");
      throw new Error(`Migration ${migration.version} (${migration.name}) failed.`, { cause: error });
    }
  }
}

export function currentSchemaVersion(database: DatabaseSync): number {
  const row = database.prepare(
    "SELECT COALESCE(MAX(version), 0) AS version FROM schema_migrations"
  ).get() as { version: number };
  return row.version;
}
