import "../app.js";
import { db } from "../lib/db.js";
import { getPostgresReadinessReport } from "../lib/postgresMigration.js";

const report = getPostgresReadinessReport(db);
console.log(JSON.stringify(report, null, 2));

if (process.argv.includes("--strict") && !report.runtimeCutoverReady) {
  process.exitCode = 2;
}
