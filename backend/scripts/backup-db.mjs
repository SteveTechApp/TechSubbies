import { DatabaseSync } from "node:sqlite";
import fs from "node:fs";
import path from "node:path";

const source=path.resolve(process.env.DB_FILE||path.join(process.cwd(),"data","techsubbies.db"));
if(!fs.existsSync(source))throw new Error(`Database does not exist: ${source}`);
const backupDirectory=path.resolve(process.env.BACKUP_DIR||path.join(process.cwd(),"backups"));
fs.mkdirSync(backupDirectory,{recursive:true});
const stamp=new Date().toISOString().replace(/[:.]/g,"-");
const target=path.join(backupDirectory,`techsubbies-${stamp}.db`);
const escaped=target.replaceAll("'","''");
const database=new DatabaseSync(source,{readOnly:false});
try{database.exec(`VACUUM INTO '${escaped}'`);}finally{database.close();}
console.log(target);
