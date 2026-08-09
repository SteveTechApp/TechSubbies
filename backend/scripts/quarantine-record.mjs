import { randomUUID } from "node:crypto";
import { argument, databasePath, openDatabase, quoteIdentifier, requireRepairableTable } from "./payload-repair-lib.mjs";

const table=requireRepairableTable(argument("table"));
const id=argument("id");
const reason=argument("reason");
const confirmation=argument("confirm");
if(!id||!reason||reason.trim().length<10)throw new Error("Provide --id and a --reason of at least 10 characters.");
if(confirmation!==`${table}:${id}`)throw new Error(`Refusing quarantine. Re-run with --confirm=${table}:${id}`);

const database=openDatabase();
try{
  const row=database.prepare(`SELECT * FROM ${quoteIdentifier(table)} WHERE id=?`).get(id);
  if(!row)throw new Error(`Record ${table}:${id} was not found.`);
  const quarantineId=randomUUID(),createdAt=new Date().toISOString();
  database.exec("BEGIN IMMEDIATE");
  try{
    database.prepare("INSERT INTO payload_quarantine VALUES (?,?,?,?,?,?,NULL)").run(quarantineId,table,id,JSON.stringify(row),reason.trim(),createdAt);
    database.prepare(`DELETE FROM ${quoteIdentifier(table)} WHERE id=?`).run(id);
    database.exec("COMMIT");
  }catch(error){database.exec("ROLLBACK");throw error;}
  console.log(JSON.stringify({status:"quarantined",database:databasePath(),quarantineId,sourceTable:table,sourceId:id,createdAt}));
}finally{database.close();}
