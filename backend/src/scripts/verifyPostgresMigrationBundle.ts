import { createHash } from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import type { PostgresMigrationBundle, PostgresMigrationManifest } from "../lib/postgresMigration.js";
import { verifyPostgresMigrationBundle } from "../lib/postgresMigration.js";

function inputDirectory(): string {
  const arg = process.argv.find((value) => value.startsWith("--in="));
  if (arg) return path.resolve(arg.slice("--in=".length));
  return path.resolve(process.cwd(), "data", "postgres-migration");
}

function hashText(value: string): string {
  return createHash("sha256").update(value, "utf8").digest("hex");
}

const inDir = inputDirectory();
const manifestPath = path.join(inDir, "manifest.json");
const schemaPath = path.join(inDir, "schema.sql");

if (!fs.existsSync(manifestPath) || !fs.existsSync(schemaPath)) {
  console.error(`Migration bundle is incomplete: ${inDir}`);
  process.exit(1);
}

const manifest = JSON.parse(fs.readFileSync(manifestPath, "utf8")) as PostgresMigrationManifest;
const schemaSql = fs.readFileSync(schemaPath, "utf8");
const tableFiles: Record<string, string> = {};
for (const table of manifest.tables) {
  const target = path.join(inDir, table.file);
  if (fs.existsSync(target)) tableFiles[table.file] = fs.readFileSync(target, "utf8");
}

const bundle: PostgresMigrationBundle = { manifest, schemaSql, tableFiles };
const problems = verifyPostgresMigrationBundle(bundle);
const manifestHash = hashText(fs.readFileSync(manifestPath, "utf8"));

if (problems.length) {
  console.error("PostgreSQL migration bundle verification FAILED:");
  problems.forEach((problem) => console.error(`- ${problem}`));
  process.exit(1);
}

const totalRows = manifest.tables.reduce((sum, table) => sum + table.rowCount, 0);
console.log("PostgreSQL migration bundle verification PASS");
console.log(`Manifest SHA-256: ${manifestHash}`);
console.log(`Schema SHA-256: ${manifest.schemaSha256}`);
console.log(`Tables: ${manifest.tables.length}`);
console.log(`Rows: ${totalRows}`);
