import { createHash } from "node:crypto";
import type { DatabaseSync } from "node:sqlite";
import { currentSchemaVersion } from "./migrations.js";

export type SqliteColumnSnapshot = {
  cid: number;
  name: string;
  type: string;
  notnull: number;
  dflt_value: string | null;
  pk: number;
};

export type SqliteForeignKeySnapshot = {
  id: number;
  seq: number;
  table: string;
  from: string;
  to: string;
  on_update: string;
  on_delete: string;
  match: string;
};

export type SqliteIndexSnapshot = {
  name: string;
  unique: boolean;
  columns: string[];
};

export type SqliteTableSnapshot = {
  name: string;
  createSql: string | null;
  columns: SqliteColumnSnapshot[];
  foreignKeys: SqliteForeignKeySnapshot[];
  indexes: SqliteIndexSnapshot[];
};

export type SqliteSchemaSnapshot = {
  schemaVersion: number;
  tables: SqliteTableSnapshot[];
};

export type PostgresMigrationTableManifest = {
  name: string;
  file: string;
  rowCount: number;
  sha256: string;
};

export type PostgresMigrationManifest = {
  formatVersion: 1;
  exportedAt: string;
  sourceEngine: "sqlite";
  sourceSchemaVersion: number;
  schemaFile: "schema.sql";
  schemaSha256: string;
  tables: PostgresMigrationTableManifest[];
};

export type PostgresMigrationBundle = {
  manifest: PostgresMigrationManifest;
  schemaSql: string;
  tableFiles: Record<string, string>;
};

export type PostgresReadinessReport = {
  sourceEngine: "sqlite";
  schemaVersion: number;
  tableCount: number;
  schemaConvertible: boolean;
  runtimeCutoverReady: false;
  runtimeBlockers: string[];
  warnings: string[];
};

function quoteIdentifier(name: string): string {
  return `"${name.replace(/"/g, '""')}"`;
}

function safeFileName(name: string): string {
  return `${name.replace(/[^a-zA-Z0-9_.-]/g, "_")}.jsonl`;
}

function hashText(value: string): string {
  return createHash("sha256").update(value, "utf8").digest("hex");
}

function sqliteTypeToPostgres(type: string): string {
  const normalized = type.trim().toUpperCase();
  if (!normalized) return "TEXT";
  if (/INT/.test(normalized)) return "BIGINT";
  if (/CHAR|CLOB|TEXT|VARCHAR/.test(normalized)) return "TEXT";
  if (/BLOB/.test(normalized)) return "BYTEA";
  if (/REAL|FLOA|DOUB/.test(normalized)) return "DOUBLE PRECISION";
  if (/NUMERIC|DECIMAL/.test(normalized)) return "NUMERIC";
  if (/BOOL/.test(normalized)) return "BOOLEAN";
  if (/JSON/.test(normalized)) return "JSONB";
  if (/DATE|TIME/.test(normalized)) return "TEXT";
  return "TEXT";
}

function postgresDefault(defaultValue: string | null): string | null {
  if (defaultValue == null) return null;
  const value = defaultValue.trim();
  if (!value) return null;
  if (/^(NULL|CURRENT_TIMESTAMP|CURRENT_DATE|CURRENT_TIME)$/i.test(value)) return value.toUpperCase();
  if (/^-?\d+(\.\d+)?$/.test(value)) return value;
  if (/^'.*'$/.test(value)) return value;
  return null;
}

function pragmaRows<T>(database: DatabaseSync, sql: string): T[] {
  return database.prepare(sql).all() as unknown as T[];
}

export function inspectSqliteSchema(database: DatabaseSync): SqliteSchemaSnapshot {
  const tableRows = database.prepare(`
    SELECT name, sql
    FROM sqlite_master
    WHERE type = 'table' AND name NOT LIKE 'sqlite_%'
    ORDER BY name
  `).all() as unknown as Array<{ name: string; sql: string | null }>;

  const tables = tableRows.map((table): SqliteTableSnapshot => {
    const quoted = quoteIdentifier(table.name);
    const columns = pragmaRows<SqliteColumnSnapshot>(database, `PRAGMA table_info(${quoted})`);
    const foreignKeys = pragmaRows<SqliteForeignKeySnapshot>(database, `PRAGMA foreign_key_list(${quoted})`);
    const indexRows = pragmaRows<{ name: string; unique: number; origin: string }>(database, `PRAGMA index_list(${quoted})`);
    const indexes = indexRows
      .filter((index) => index.origin !== "pk" && !index.name.startsWith("sqlite_autoindex_"))
      .map((index): SqliteIndexSnapshot => ({
        name: index.name,
        unique: index.unique === 1,
        columns: pragmaRows<{ name: string }>(database, `PRAGMA index_info(${quoteIdentifier(index.name)})`)
          .map((column) => column.name),
      }))
      .filter((index) => index.columns.length > 0);

    return {
      name: table.name,
      createSql: table.sql,
      columns,
      foreignKeys,
      indexes,
    };
  });

  return {
    schemaVersion: currentSchemaVersion(database),
    tables,
  };
}

function primaryKeySql(table: SqliteTableSnapshot): string | null {
  const columns = table.columns
    .filter((column) => column.pk > 0)
    .sort((a, b) => a.pk - b.pk)
    .map((column) => quoteIdentifier(column.name));
  return columns.length ? `PRIMARY KEY (${columns.join(", ")})` : null;
}

function foreignKeyStatements(table: SqliteTableSnapshot): string[] {
  const grouped = new Map<number, SqliteForeignKeySnapshot[]>();
  for (const foreignKey of table.foreignKeys) {
    const rows = grouped.get(foreignKey.id) || [];
    rows.push(foreignKey);
    grouped.set(foreignKey.id, rows);
  }

  return [...grouped.entries()].map(([id, rows]) => {
    const ordered = [...rows].sort((a, b) => a.seq - b.seq);
    const local = ordered.map((row) => quoteIdentifier(row.from)).join(", ");
    const remote = ordered.map((row) => quoteIdentifier(row.to)).join(", ");
    const referenceTable = quoteIdentifier(ordered[0].table);
    const update = ordered[0].on_update && ordered[0].on_update !== "NO ACTION"
      ? ` ON UPDATE ${ordered[0].on_update}`
      : "";
    const remove = ordered[0].on_delete && ordered[0].on_delete !== "NO ACTION"
      ? ` ON DELETE ${ordered[0].on_delete}`
      : "";
    return `ALTER TABLE ${quoteIdentifier(table.name)} ADD CONSTRAINT ${quoteIdentifier(`fk_${table.name}_${id}`)} FOREIGN KEY (${local}) REFERENCES ${referenceTable} (${remote})${update}${remove};`;
  });
}

export function generatePostgresSchema(snapshot: SqliteSchemaSnapshot): string {
  const statements: string[] = [
    "-- Generated from the TechSubbies SQLite schema.",
    "-- Review in a staging PostgreSQL database before production cutover.",
    "BEGIN;",
  ];

  for (const table of snapshot.tables) {
    const columnSql = table.columns.map((column) => {
      const parts = [quoteIdentifier(column.name), sqliteTypeToPostgres(column.type)];
      if (column.notnull === 1) parts.push("NOT NULL");
      const defaultValue = postgresDefault(column.dflt_value);
      if (defaultValue) parts.push(`DEFAULT ${defaultValue}`);
      return `  ${parts.join(" ")}`;
    });
    const primaryKey = primaryKeySql(table);
    if (primaryKey) columnSql.push(`  ${primaryKey}`);
    statements.push(`CREATE TABLE ${quoteIdentifier(table.name)} (\n${columnSql.join(",\n")}\n);`);
  }

  for (const table of snapshot.tables) {
    statements.push(...foreignKeyStatements(table));
  }

  for (const table of snapshot.tables) {
    for (const index of table.indexes) {
      const unique = index.unique ? "UNIQUE " : "";
      const columns = index.columns.map(quoteIdentifier).join(", ");
      statements.push(`CREATE ${unique}INDEX ${quoteIdentifier(index.name)} ON ${quoteIdentifier(table.name)} (${columns});`);
    }
  }

  statements.push("COMMIT;", "");
  return statements.join("\n");
}

function tableOrderClause(table: SqliteTableSnapshot): string {
  const primaryKey = table.columns
    .filter((column) => column.pk > 0)
    .sort((a, b) => a.pk - b.pk)
    .map((column) => quoteIdentifier(column.name));
  return primaryKey.length ? ` ORDER BY ${primaryKey.join(", ")}` : "";
}

export function serializeSqliteTable(database: DatabaseSync, table: SqliteTableSnapshot): string {
  const rows = database.prepare(
    `SELECT * FROM ${quoteIdentifier(table.name)}${tableOrderClause(table)}`
  ).all() as unknown as Record<string, unknown>[];
  if (!rows.length) return "";
  return `${rows.map((row) => JSON.stringify(row)).join("\n")}\n`;
}

export function buildPostgresMigrationBundle(database: DatabaseSync, exportedAt = new Date()): PostgresMigrationBundle {
  const snapshot = inspectSqliteSchema(database);
  const schemaSql = generatePostgresSchema(snapshot);
  const tableFiles: Record<string, string> = {};
  const tables = snapshot.tables.map((table): PostgresMigrationTableManifest => {
    const file = `tables/${safeFileName(table.name)}`;
    const contents = serializeSqliteTable(database, table);
    tableFiles[file] = contents;
    const rowCount = contents ? contents.trimEnd().split("\n").length : 0;
    return {
      name: table.name,
      file,
      rowCount,
      sha256: hashText(contents),
    };
  });

  return {
    manifest: {
      formatVersion: 1,
      exportedAt: exportedAt.toISOString(),
      sourceEngine: "sqlite",
      sourceSchemaVersion: snapshot.schemaVersion,
      schemaFile: "schema.sql",
      schemaSha256: hashText(schemaSql),
      tables,
    },
    schemaSql,
    tableFiles,
  };
}

export function verifyPostgresMigrationBundle(bundle: PostgresMigrationBundle): string[] {
  const problems: string[] = [];
  if (bundle.manifest.formatVersion !== 1) problems.push("Unsupported migration bundle format version.");
  if (hashText(bundle.schemaSql) !== bundle.manifest.schemaSha256) problems.push("schema.sql checksum mismatch.");

  for (const table of bundle.manifest.tables) {
    const contents = bundle.tableFiles[table.file];
    if (contents == null) {
      problems.push(`Missing data file for ${table.name}.`);
      continue;
    }
    if (hashText(contents) !== table.sha256) problems.push(`${table.name} checksum mismatch.`);
    const rowCount = contents ? contents.trimEnd().split("\n").length : 0;
    if (rowCount !== table.rowCount) problems.push(`${table.name} row count mismatch.`);
    if (contents) {
      for (const [index, line] of contents.trimEnd().split("\n").entries()) {
        try {
          JSON.parse(line);
        } catch {
          problems.push(`${table.name} contains invalid JSON on line ${index + 1}.`);
          break;
        }
      }
    }
  }
  return problems;
}

export function getPostgresReadinessReport(database: DatabaseSync): PostgresReadinessReport {
  const snapshot = inspectSqliteSchema(database);
  const warnings: string[] = [];
  for (const table of snapshot.tables) {
    for (const column of table.columns) {
      if (column.dflt_value && postgresDefault(column.dflt_value) == null) {
        warnings.push(`${table.name}.${column.name} has a SQLite default that needs manual PostgreSQL review: ${column.dflt_value}`);
      }
      if (!column.type.trim()) {
        warnings.push(`${table.name}.${column.name} has no declared SQLite type and will be exported as TEXT.`);
      }
    }
  }

  return {
    sourceEngine: "sqlite",
    schemaVersion: snapshot.schemaVersion,
    tableCount: snapshot.tables.length,
    schemaConvertible: snapshot.tables.length > 0,
    runtimeCutoverReady: false,
    runtimeBlockers: [
      "Repository APIs are synchronous and depend on node:sqlite DatabaseSync; PostgreSQL access must be converted to an asynchronous data-access boundary.",
      "SQL statements use SQLite question-mark placeholders; PostgreSQL drivers use numbered parameters and require a query adapter or repository conversion.",
      "SQLite-specific PRAGMA, sqlite_master and BEGIN IMMEDIATE operations must stay inside the SQLite adapter or be replaced for PostgreSQL.",
      "A staging import, row-count/checksum comparison and read/write smoke test must pass before production DATABASE_URL cutover.",
    ],
    warnings,
  };
}
