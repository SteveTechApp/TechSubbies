import path from "node:path";
process.env.DB_FILE=process.env.DB_FILE||path.join(process.cwd(),"data","techsubbies.db");
const {db,databaseIntegrity}=await import("../dist/lib/db.js");
try{const integrity=databaseIntegrity();if(!integrity.ok)throw new Error(`Migration integrity failed: ${integrity.quickCheck}`);console.log(JSON.stringify({status:"migrated",database:process.env.DB_FILE,integrity:integrity.quickCheck}));}finally{db.close();}
