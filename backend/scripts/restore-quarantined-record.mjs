import { argument, databasePath, openDatabase, quoteIdentifier, requireRepairableTable } from "./payload-repair-lib.mjs";

const quarantineId=argument("quarantine-id");
if(!quarantineId)throw new Error("Provide --quarantine-id.");
if(argument("confirm")!==`restore:${quarantineId}`)throw new Error(`Refusing restore. Re-run with --confirm=restore:${quarantineId}`);

const database=openDatabase();
try{
  const quarantine=database.prepare("SELECT * FROM payload_quarantine WHERE id=?").get(quarantineId);
  if(!quarantine)throw new Error("Quarantine record was not found.");
  if(quarantine.restoredAt)throw new Error(`Record was already restored at ${quarantine.restoredAt}.`);
  const table=requireRepairableTable(quarantine.sourceTable);
  if(database.prepare(`SELECT id FROM ${quoteIdentifier(table)} WHERE id=?`).get(quarantine.sourceId))throw new Error("An active record already uses the source id; restore would overwrite data.");
  const snapshot=JSON.parse(quarantine.snapshot);
  if(!snapshot||typeof snapshot!=="object"||Array.isArray(snapshot))throw new Error("Quarantine snapshot is corrupt.");
  const allowedColumns=new Set(database.prepare(`PRAGMA table_info(${quoteIdentifier(table)})`).all().map(column=>column.name));
  const columns=Object.keys(snapshot).filter(column=>allowedColumns.has(column));
  if(!columns.includes("id"))throw new Error("Quarantine snapshot has no source id.");
  const placeholders=columns.map(()=>"?").join(",");
  const restoredAt=new Date().toISOString();
  database.exec("BEGIN IMMEDIATE");
  try{
    database.prepare(`INSERT INTO ${quoteIdentifier(table)} (${columns.map(quoteIdentifier).join(",")}) VALUES (${placeholders})`).run(...columns.map(column=>snapshot[column]));
    database.prepare("UPDATE payload_quarantine SET restoredAt=? WHERE id=?").run(restoredAt,quarantineId);
    database.exec("COMMIT");
  }catch(error){database.exec("ROLLBACK");throw error;}
  console.log(JSON.stringify({status:"restored",database:databasePath(),quarantineId,sourceTable:table,sourceId:quarantine.sourceId,restoredAt}));
}finally{database.close();}
