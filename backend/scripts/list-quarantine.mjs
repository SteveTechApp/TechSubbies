import { databasePath, openDatabase } from "./payload-repair-lib.mjs";
const database=openDatabase();
try{console.log(JSON.stringify({database:databasePath(),records:database.prepare("SELECT id,sourceTable,sourceId,reason,createdAt,restoredAt FROM payload_quarantine ORDER BY createdAt DESC").all()},null,2));}finally{database.close();}
