import fs from "node:fs";
import path from "node:path";
import "../app.js";
import { db } from "../lib/db.js";
import { buildPostgresMigrationBundle, getPostgresReadinessReport } from "../lib/postgresMigration.js";

function outputDirectory(): string {
  const arg = process.argv.find((value) => value.startsWith("--out="));
  if (arg) return path.resolve(arg.slice("--out=".length));
  return path.resolve(process.cwd(), "data", "postgres-migration");
}

const outDir = outputDirectory();
const bundle = buildPostgresMigrationBundle(db);
const report = getPostgresReadinessReport(db);

fs.rmSync(outDir, { recursive: true, force: true });
fs.mkdirSync(path.join(outDir, "tables"), { recursive: true });
fs.writeFileSync(path.join(outDir, "schema.sql"), bundle.schemaSql, "utf8");
fs.writeFileSync(path.join(outDir, "manifest.json"), `${JSON.stringify(bundle.manifest, null, 2)}\n`, "utf8");
fs.writeFileSync(path.join(outDir, "readiness.json"), `${JSON.stringify(report, null, 2)}\n`, "utf8");

for (const [relativePath, contents] of Object.entries(bundle.tableFiles)) {
  const target = path.join(outDir, relativePath);
  fs.mkdirSync(path.dirname(target), { recursive: true });
  fs.writeFileSync(target, contents, "utf8");
}

const totalRows = bundle.manifest.tables.reduce((sum, table) => sum + table.rowCount, 0);
console.log(`PostgreSQL migration bundle written to ${outDir}`);
console.log(`Tables: ${bundle.manifest.tables.length}`);
console.log(`Rows: ${totalRows}`);
console.log(`SQLite schema version: ${bundle.manifest.sourceSchemaVersion}`);
console.log(`Runtime cutover ready: ${report.runtimeCutoverReady ? "yes" : "no"}`);
if (report.runtimeBlockers.length) {
  console.log("Runtime blockers:");
  report.runtimeBlockers.forEach((blocker) => console.log(`- ${blocker}`));
}
