# Database operations

TechSubbies currently uses SQLite for its persistent marketplace data. Production mounts `/data` as a durable volume. SQLite records live in `/data/techsubbies.db`; private uploaded files live under `/data/documents`.

## Integrity

Run `npm run db:integrity --prefix backend`. The readiness endpoint also runs SQLite's quick integrity and foreign-key checks.

## Migrations

Run `npm run db:migrate --prefix backend` before starting a newly deployed API version. Schema changes are idempotent, recorded in `schema_migrations`, and followed by an integrity check. Take a backup before applying migrations to production.

## Backup

Run `npm run db:backup --prefix backend`. Set `DB_FILE` to the live database and `BACKUP_DIR` to a durable backup location. The command uses SQLite `VACUUM INTO`, producing a transactionally consistent backup even while WAL mode is active.

Backups must be copied off the application host, encrypted, access-controlled, retention-limited and restoration-tested. A backup is not proven until it has been restored into a separate environment and passed `db:integrity`.

The database backup command covers SQLite only. Back up `/data/documents` separately using encrypted object or volume snapshots with the same retention policy. Complete recovery requires both artifacts from a compatible backup window. A document row whose file is unavailable returns HTTP 410.

Test a restore into a new file only:

```powershell
$env:BACKUP_FILE="C:\backups\techsubbies-example.db"
$env:RESTORE_TARGET="C:\restore-test\techsubbies.db"
npm run db:restore --prefix backend
$env:DB_FILE=$env:RESTORE_TARGET
npm run db:integrity --prefix backend
```

The restore command refuses to overwrite an existing target and removes a newly copied target if its integrity check fails.

## Deployment

Never mount backups over the live `/data` directory. Stop the API before replacing a live database during disaster recovery, preserve the failed database, restore to a new path first, run the integrity check, and only then switch `DB_FILE`.

Set `REQUIRE_EXTERNAL_SERVICES=true` in production to make startup fail when membership-payment or account-email credentials are missing. After deployment, set `SMOKE_API_URL` and run `npm run smoke --prefix backend`. Application logs are newline-delimited JSON containing request IDs, status codes and durations; route logging intentionally excludes bodies and credentials.
## Payload integrity

`npm run db:integrity --prefix backend` is read-only. In addition to SQLite quick-check and foreign-key validation, it verifies that every persisted profile, marketplace, trust, work-pack, team, and audit payload is a JSON object and reports records using unsupported schema versions.

Set `DB_FILE` to the database being inspected. Missing schema tables are reported as integrity failures rather than causing an opaque SQL error. The command does not repair or delete records; use its table and record identifiers to investigate and restore from a verified backup.

## Quarantine and restore

Create a verified backup before changing damaged data. Quarantine is explicit and recoverable: it snapshots the complete database row into `payload_quarantine` and removes that exact row from its active table in one transaction. It never accepts arbitrary table names and requires an exact confirmation token.

```powershell
$env:DB_FILE='C:\absolute\path\techsubbies.db'
npm run db:backup
npm run db:quarantine -- --table=jobs --id=<record-id> --reason="Confirmed corrupt payload after integrity review" --confirm=jobs:<record-id>
npm run db:quarantine:list
```

Restore only after checking that no active record has reused the source ID:

```powershell
npm run db:quarantine:restore -- --quarantine-id=<quarantine-id> --confirm=restore:<quarantine-id>
npm run db:integrity
```

Both operations are transactional. Restore refuses to overwrite an active record, ignores snapshot columns no longer present in the current schema, and records the restoration timestamp.
