import { describe, expect, it } from "vitest";
import {
  assertDatabaseRuntimeSupported,
  databaseProviderStatus,
  resolveDatabaseProvider,
} from "./databaseProvider.js";

describe("database provider cutover guard", () => {
  it("keeps SQLite as the current default runtime", () => {
    expect(resolveDatabaseProvider({})).toBe("sqlite");
    expect(databaseProviderStatus({})).toEqual({
      provider: "sqlite",
      databaseUrlConfigured: false,
      runtimeSupported: true,
      migrationBundleRequired: false,
    });
    expect(() => assertDatabaseRuntimeSupported({})).not.toThrow();
  });

  it("requires DATABASE_URL and still blocks premature PostgreSQL runtime selection", () => {
    expect(() => assertDatabaseRuntimeSupported({ DATABASE_PROVIDER: "postgres" })).toThrow(/DATABASE_URL/i);
    expect(() => assertDatabaseRuntimeSupported({
      DATABASE_PROVIDER: "postgres",
      DATABASE_URL: "postgresql://example.invalid/techsubbies",
    })).toThrow(/not enabled yet/i);
  });

  it("rejects unknown database providers", () => {
    expect(() => resolveDatabaseProvider({ DATABASE_PROVIDER: "mysql" })).toThrow(/sqlite.*postgres/i);
  });
});
