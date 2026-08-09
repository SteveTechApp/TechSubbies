import { DatabaseSync } from "node:sqlite";
import { afterEach, describe, expect, it } from "vitest";
import {
  buildPostgresMigrationBundle,
  generatePostgresSchema,
  getPostgresReadinessReport,
  inspectSqliteSchema,
  verifyPostgresMigrationBundle,
} from "./postgresMigration.js";

const databases: DatabaseSync[] = [];

function fixtureDatabase(): DatabaseSync {
  const database = new DatabaseSync(":memory:");
  databases.push(database);
  database.exec(`
    PRAGMA foreign_keys = ON;
    CREATE TABLE schema_migrations (
      version INTEGER PRIMARY KEY,
      name TEXT NOT NULL,
      appliedAt TEXT NOT NULL
    );
    INSERT INTO schema_migrations (version, name, appliedAt)
      VALUES (12, 'fixture', '2026-08-09T00:00:00.000Z');

    CREATE TABLE companies (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      active INTEGER NOT NULL DEFAULT 1
    );
    CREATE TABLE engineers (
      id TEXT PRIMARY KEY,
      companyId TEXT,
      name TEXT NOT NULL,
      score REAL NOT NULL DEFAULT 0,
      FOREIGN KEY(companyId) REFERENCES companies(id) ON DELETE SET NULL
    );
    CREATE INDEX engineers_company ON engineers(companyId);

    INSERT INTO companies (id, name, active) VALUES
      ('company-2', 'Second Company', 1),
      ('company-1', 'First Company', 1);
    INSERT INTO engineers (id, companyId, name, score) VALUES
      ('engineer-2', 'company-2', 'Second Engineer', 3.5),
      ('engineer-1', 'company-1', 'First Engineer', 4.5);
  `);
  return database;
}

afterEach(() => {
  while (databases.length) databases.pop()?.close();
});

describe("PostgreSQL migration readiness", () => {
  it("introspects SQLite and generates PostgreSQL-compatible DDL", () => {
    const database = fixtureDatabase();
    const snapshot = inspectSqliteSchema(database);
    const schema = generatePostgresSchema(snapshot);

    expect(snapshot.schemaVersion).toBe(12);
    expect(snapshot.tables.map((table) => table.name)).toEqual([
      "companies",
      "engineers",
      "schema_migrations",
    ]);
    expect(schema).toContain('CREATE TABLE "companies"');
    expect(schema).toContain('"active" BIGINT NOT NULL DEFAULT 1');
    expect(schema).toContain('ALTER TABLE "engineers" ADD CONSTRAINT');
    expect(schema).toContain('REFERENCES "companies" ("id") ON DELETE SET NULL');
    expect(schema).toContain('CREATE INDEX "engineers_company" ON "engineers" ("companyId")');
  });

  it("exports deterministic table data with checksums and detects tampering", () => {
    const database = fixtureDatabase();
    const bundle = buildPostgresMigrationBundle(database, new Date("2026-08-09T06:00:00.000Z"));
    const companyManifest = bundle.manifest.tables.find((table) => table.name === "companies")!;
    const companyRows = bundle.tableFiles[companyManifest.file].trim().split("\n").map((line) => JSON.parse(line));

    expect(bundle.manifest.exportedAt).toBe("2026-08-09T06:00:00.000Z");
    expect(companyManifest.rowCount).toBe(2);
    expect(companyRows.map((row) => row.id)).toEqual(["company-1", "company-2"]);
    expect(verifyPostgresMigrationBundle(bundle)).toEqual([]);

    bundle.tableFiles[companyManifest.file] += '{"id":"tampered"}\n';
    expect(verifyPostgresMigrationBundle(bundle)).toEqual(expect.arrayContaining([
      "companies checksum mismatch.",
      "companies row count mismatch.",
    ]));
  });

  it("keeps runtime cutover blocked until the async repository boundary exists", () => {
    const report = getPostgresReadinessReport(fixtureDatabase());

    expect(report.schemaConvertible).toBe(true);
    expect(report.runtimeCutoverReady).toBe(false);
    expect(report.runtimeBlockers.join(" ")).toMatch(/DatabaseSync/i);
    expect(report.runtimeBlockers.join(" ")).toMatch(/question-mark placeholders/i);
  });
});
