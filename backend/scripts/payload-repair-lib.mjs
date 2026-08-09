import { DatabaseSync } from "node:sqlite";
import path from "node:path";

export const repairableTables=new Set(["users","jobs","applications","contracts","timesheets","completion_validations","talent_pool_entries","technical_work_packs","project_teams","audit_events"]);

export function argument(name){const prefix=`--${name}=`;return process.argv.find(value=>value.startsWith(prefix))?.slice(prefix.length);}
export function databasePath(){return path.resolve(process.env.DB_FILE||path.join(process.cwd(),"data","techsubbies.db"));}
export function openDatabase(){const database=new DatabaseSync(databasePath());database.exec("PRAGMA foreign_keys=ON; PRAGMA busy_timeout=5000; CREATE TABLE IF NOT EXISTS payload_quarantine (id TEXT PRIMARY KEY, sourceTable TEXT NOT NULL, sourceId TEXT NOT NULL, snapshot TEXT NOT NULL, reason TEXT NOT NULL, createdAt TEXT NOT NULL, restoredAt TEXT); CREATE UNIQUE INDEX IF NOT EXISTS idx_payload_quarantine_active ON payload_quarantine(sourceTable,sourceId) WHERE restoredAt IS NULL;");return database;}
export function requireRepairableTable(table){if(!table||!repairableTables.has(table))throw new Error(`Unsupported table. Choose one of: ${[...repairableTables].join(", ")}`);return table;}
export function quoteIdentifier(value){if(!/^[A-Za-z_][A-Za-z0-9_]*$/.test(value))throw new Error("Unsafe SQL identifier.");return `"${value}"`;}
