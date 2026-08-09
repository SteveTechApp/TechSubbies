import { DatabaseSync } from "node:sqlite";
import { afterEach, describe, expect, it } from "vitest";
import { SqliteDatabase } from "./database.js";

const openDatabases: DatabaseSync[] = [];

function fixture() {
  const sqlite = new DatabaseSync(":memory:");
  openDatabases.push(sqlite);
  sqlite.exec("CREATE TABLE items (id TEXT PRIMARY KEY, value TEXT NOT NULL)");
  return new SqliteDatabase(sqlite);
}

afterEach(() => {
  while (openDatabases.length) openDatabases.pop()!.close();
});

describe("SqliteDatabase", () => {
  it("provides asynchronous query and command operations", async () => {
    const database = fixture();
    const pending = database.execute(
      "INSERT INTO items (id, value) VALUES (?, ?)",
      ["one", "first"]
    );

    expect(pending).toBeInstanceOf(Promise);
    await expect(pending).resolves.toMatchObject({ changes: 1 });
    await expect(database.queryOne<{ value: string }>(
      "SELECT value FROM items WHERE id = ?", ["one"]
    )).resolves.toEqual({ value: "first" });
    await expect(database.queryMany<{ id: string }>(
      "SELECT id FROM items ORDER BY id"
    )).resolves.toEqual([{ id: "one" }]);
  });

  it("commits successful work and rolls failed work back", async () => {
    const database = fixture();
    await database.transaction(async (transaction) => {
      await transaction.execute("INSERT INTO items (id, value) VALUES (?, ?)", ["kept", "yes"]);
    });

    await expect(database.transaction(async (transaction) => {
      await transaction.execute("INSERT INTO items (id, value) VALUES (?, ?)", ["rolled-back", "no"]);
      throw new Error("stop");
    })).rejects.toThrow("stop");

    await expect(database.queryMany<{ id: string }>(
      "SELECT id FROM items ORDER BY id"
    )).resolves.toEqual([{ id: "kept" }]);
  });

  it("exposes table checks without leaking sqlite metadata queries", async () => {
    const database = fixture();
    await expect(database.tableExists("items")).resolves.toBe(true);
    await expect(database.tableExists("missing_table")).resolves.toBe(false);
  });
});
