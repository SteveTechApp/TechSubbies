export type DatabaseProvider = "sqlite" | "postgres";

export type DatabaseProviderStatus = {
  provider: DatabaseProvider;
  databaseUrlConfigured: boolean;
  runtimeSupported: boolean;
  migrationBundleRequired: boolean;
};

export function resolveDatabaseProvider(env: NodeJS.ProcessEnv = process.env): DatabaseProvider {
  const provider = (env.DATABASE_PROVIDER || "sqlite").trim().toLowerCase();
  if (provider !== "sqlite" && provider !== "postgres") {
    throw new Error('DATABASE_PROVIDER must be either "sqlite" or "postgres".');
  }
  return provider;
}

export function databaseProviderStatus(env: NodeJS.ProcessEnv = process.env): DatabaseProviderStatus {
  const provider = resolveDatabaseProvider(env);
  return {
    provider,
    databaseUrlConfigured: Boolean(env.DATABASE_URL?.trim()),
    runtimeSupported: provider === "sqlite",
    migrationBundleRequired: provider === "postgres",
  };
}

export function assertDatabaseRuntimeSupported(env: NodeJS.ProcessEnv = process.env): void {
  const status = databaseProviderStatus(env);
  if (status.provider === "postgres" && !status.databaseUrlConfigured) {
    throw new Error("DATABASE_URL is required when DATABASE_PROVIDER=postgres.");
  }
  if (!status.runtimeSupported) {
    throw new Error(
      "DATABASE_PROVIDER=postgres is not enabled yet. Generate and verify the PostgreSQL migration bundle, convert the synchronous repository boundary, then enable the PostgreSQL runtime adapter."
    );
  }
}
