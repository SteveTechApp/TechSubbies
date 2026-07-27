import { DatabaseSync } from "node:sqlite";
import { describe, expect, it } from "vitest";
import { currentSchemaVersion, runMigrations } from "./migrations.js";

describe("database migrations", () => {
  it("applies migrations in order and only once", () => {
    const database = new DatabaseSync(":memory:");
    const applied: number[] = [];
    const migrations = [
      { version: 2, name: "second", up: () => { applied.push(2); } },
      { version: 1, name: "first", up: () => { applied.push(1); } },
    ];

    runMigrations(database, migrations);
    runMigrations(database, migrations);

    expect(applied).toEqual([1, 2]);
    expect(currentSchemaVersion(database)).toBe(2);
    database.close();
  });

  it("rolls back both schema changes and version history on failure", () => {
    const database = new DatabaseSync(":memory:");

    expect(() => runMigrations(database, [{
      version: 1,
      name: "broken",
      up: (db) => {
        db.exec("CREATE TABLE should_not_exist (id TEXT)");
        throw new Error("failure");
      },
    }])).toThrow(/Migration 1/);

    expect(database.prepare(
      "SELECT name FROM sqlite_master WHERE type = 'table' AND name = 'should_not_exist'"
    ).get()).toBeUndefined();
    expect(currentSchemaVersion(database)).toBe(0);
    database.close();
  });

  it("rejects duplicate and invalid versions before applying anything", () => {
    const database = new DatabaseSync(":memory:");
    expect(() => runMigrations(database, [
      { version: 1, name: "one", up: () => undefined },
      { version: 1, name: "duplicate", up: () => undefined },
    ])).toThrow(/Duplicate migration version/);
    expect(() => runMigrations(database, [
      { version: 0, name: "invalid", up: () => undefined },
    ])).toThrow(/positive integers/);
    database.close();
  });
});
