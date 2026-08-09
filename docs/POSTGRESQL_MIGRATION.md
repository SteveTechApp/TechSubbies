# PostgreSQL migration readiness

Updated 9 August 2026.

TechSubbies currently uses Node's synchronous `node:sqlite` `DatabaseSync` API. This document defines the controlled path to a managed PostgreSQL runtime before horizontal backend scaling.

## Current boundary

- SQLite remains the supported application runtime.
- `DATABASE_PROVIDER` defaults to `sqlite`.
- `DATABASE_PROVIDER=postgres` requires `DATABASE_URL`, but application startup is intentionally blocked until the asynchronous repository/data-access conversion is complete.
- No migration command changes the production database automatically.
- A verified export bundle and staging import are mandatory before cutover.

This prevents a deployment from claiming to use PostgreSQL while continuing to write to SQLite.

## Why the runtime cannot be switched in one environment variable

The current repositories are synchronous and call `DatabaseSync.prepare(...).get()/all()/run()` directly. Production PostgreSQL drivers are asynchronous. The code also contains SQLite-specific behaviour including:

- `?` query placeholders rather than PostgreSQL numbered parameters;
- `PRAGMA` inspection and runtime settings;
- `sqlite_master` schema inspection;
- `BEGIN IMMEDIATE` migration transactions;
- SQLite backup/verification logic.

Those operations must either move behind a SQLite adapter or be replaced by PostgreSQL equivalents before runtime cutover.

## Migration bundle

Run from `backend`:

```powershell
npm run db:postgres-readiness
npm run db:postgres-export
npm run db:postgres-verify
```

The default output directory is:

```text
data/postgres-migration/
```

Use a different directory when required:

```powershell
npm run db:postgres-export -- --out=C:\migration\techsubbies
npm run db:postgres-verify -- --in=C:\migration\techsubbies
```

The bundle contains:

- `manifest.json` — source schema version, table list, row counts and SHA-256 checksums;
- `schema.sql` — PostgreSQL-oriented DDL generated from the live SQLite schema;
- `readiness.json` — explicit runtime blockers and schema warnings;
- `tables/*.jsonl` — deterministic primary-key-ordered table data.

The verifier checks the schema checksum, every table checksum, every table row count and JSON validity.

## Generated schema rules

The generator preserves the existing data model conservatively:

- SQLite `TEXT` remains PostgreSQL `TEXT`;
- integer affinity becomes `BIGINT`;
- real values become `DOUBLE PRECISION`;
- blobs become `BYTEA`;
- numeric/decimal types become `NUMERIC`;
- explicit JSON becomes `JSONB`;
- current text timestamps remain `TEXT` for the first migration to avoid changing application semantics during the database move;
- primary keys, foreign keys and non-internal indexes are recreated.

Unsupported/opaque SQLite defaults are omitted from generated DDL and reported for manual review. The generated schema must be reviewed and applied to a staging PostgreSQL instance before any production cutover.

## Staged cutover

### Stage 1 — readiness tooling

Complete in this pass:

1. Introspect the complete live SQLite schema.
2. Export all user tables with deterministic row ordering.
3. Generate PostgreSQL-oriented DDL.
4. Produce row-count and checksum evidence.
5. Verify the export bundle independently.
6. Fail safely if PostgreSQL runtime is selected before the adapter exists.

### Stage 2 — asynchronous data-access boundary

Still required:

1. Introduce a PostgreSQL driver/pool.
2. Convert repository methods from synchronous calls to an asynchronous query interface.
3. Isolate SQLite-only `PRAGMA`, migration and backup code.
4. Convert placeholders and transaction semantics.
5. Run the complete backend test suite against both SQLite development mode and PostgreSQL integration mode while the transition is active.

### Stage 3 — staging import and parity

1. Freeze a representative SQLite snapshot.
2. Generate and verify the migration bundle.
3. Apply `schema.sql` to an empty managed PostgreSQL staging database.
4. Import all JSONL table data transactionally.
5. Compare source/target row counts for every table.
6. Compare representative entity hashes and critical relationships.
7. Run authentication, profile, job, application, contract, messaging, evidence, taxonomy, billing and analytics smoke tests.
8. Exercise concurrent writes and transaction rollback behaviour.

### Stage 4 — production cutover

1. Take and verify the final SQLite backup.
2. Enter a short write-maintenance window.
3. Export and verify the final migration bundle.
4. Import into the production managed PostgreSQL database.
5. Repeat row-count/checksum/parity checks.
6. Deploy the PostgreSQL runtime adapter with `DATABASE_PROVIDER=postgres` and the production `DATABASE_URL`.
7. Run health/readiness and critical user-journey smoke tests.
8. Reopen writes only after validation succeeds.
9. Retain the final SQLite backup according to the recovery policy.

## Rollback rule

Do not dual-write SQLite and PostgreSQL during the first cutover. If validation fails before writes reopen, return to the unchanged SQLite runtime and investigate. If PostgreSQL has accepted production writes, rollback requires an explicit reverse-data plan rather than simply switching the environment variable.

## Horizontal scaling gate

Do not run multiple backend application processes against the current SQLite runtime. PostgreSQL runtime cutover and the separate shared pub/sub requirement for real-time messaging must both be complete before horizontal scaling.
