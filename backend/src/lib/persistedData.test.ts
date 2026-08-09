import { describe, expect, it } from "vitest";
import { AppError } from "./errors.js";
import { decodePersistedObject } from "./persistedData.js";

describe("decodePersistedObject", () => {
  it("accepts legacy records without a version and current records", () => {
    expect(decodePersistedObject('{"name":"legacy"}', { entity: "profile", id: "p1", versionKey: "profileSchemaVersion", maximumVersion: 2 })).toEqual({ name: "legacy" });
    expect(decodePersistedObject('{"profileSchemaVersion":2}', { entity: "profile", id: "p2", versionKey: "profileSchemaVersion", maximumVersion: 2 })).toEqual({ profileSchemaVersion: 2 });
  });

  it.each([
    ["not-json", "PERSISTED_DATA_CORRUPT"],
    ["[]", "PERSISTED_DATA_CORRUPT"],
    ['{"profileSchemaVersion":"two"}', "PERSISTED_SCHEMA_INVALID"],
    ['{"profileSchemaVersion":3}', "PERSISTED_SCHEMA_UNSUPPORTED"],
  ])("rejects invalid persisted data with a stable code", (stored, code) => {
    try {
      decodePersistedObject(stored, { entity: "profile", id: "p1", versionKey: "profileSchemaVersion", maximumVersion: 2 });
      throw new Error("Expected decode to fail");
    } catch (error) {
      expect(error).toBeInstanceOf(AppError);
      expect((error as AppError).code).toBe(code);
    }
  });
});
