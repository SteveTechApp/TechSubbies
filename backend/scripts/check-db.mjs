import { DatabaseSync } from "node:sqlite";
import path from "node:path";
const source=path.resolve(process.env.DB_FILE||path.join(process.cwd(),"data","techsubbies.db"));
const database=new DatabaseSync(source,{readOnly:true});
try{
  const quick=database.prepare("PRAGMA quick_check").get()?.quick_check;
  const violations=database.prepare("PRAGMA foreign_key_check").all();
  const jsonColumns=[
    ["users","profile"],["jobs","payload"],["applications","payload"],["contracts","payload"],["timesheets","payload"],
    ["completion_validations","payload"],["talent_pool_entries","payload"],["technical_work_packs","payload"],["project_teams","payload"],["audit_events","metadata"],
  ];
  const existingTables=new Set(database.prepare("SELECT name FROM sqlite_master WHERE type='table'").all().map(row=>row.name));
  const requiredTables=[...new Set(jsonColumns.map(([table])=>table))];
  const missingTables=requiredTables.filter(table=>!existingTables.has(table)).map(table=>({table,issue:"missing-table"}));
  const invalidPayloads=jsonColumns.filter(([table])=>existingTables.has(table)).flatMap(([table,column])=>database.prepare(`SELECT id FROM ${table} WHERE CASE WHEN json_valid(${column})=0 THEN 1 ELSE json_type(${column})!='object' END`).all().map(row=>({table,column,id:row.id,issue:"invalid-json-object"})));
  const unsupportedJobs=existingTables.has("jobs")?database.prepare("SELECT id,json_extract(payload,'$.jobSchemaVersion') AS storedVersion FROM jobs WHERE json_valid(payload)=1 AND json_type(payload,'$.jobSchemaVersion') IN ('integer','real') AND json_extract(payload,'$.jobSchemaVersion')>2").all().map(row=>({table:"jobs",column:"payload",id:row.id,storedVersion:row.storedVersion,supportedVersion:2,issue:"unsupported-schema"})):[];
  const unsupportedProfiles=existingTables.has("users")?database.prepare("SELECT id,json_extract(profile,'$.profileSchemaVersion') AS storedVersion FROM users WHERE json_valid(profile)=1 AND json_type(profile,'$.profileSchemaVersion') IN ('integer','real') AND json_extract(profile,'$.profileSchemaVersion')>2").all().map(row=>({table:"users",column:"profile",id:row.id,storedVersion:row.storedVersion,supportedVersion:2,issue:"unsupported-schema"})):[];
  const payloadIssues=[...missingTables,...invalidPayloads,...unsupportedJobs,...unsupportedProfiles];
  if(quick!=="ok"||violations.length||payloadIssues.length)throw new Error(`Integrity failed: quick_check=${quick}, foreign_key_violations=${violations.length}, payload_issues=${payloadIssues.length}\n${JSON.stringify(payloadIssues,null,2)}`);
  console.log(JSON.stringify({status:"ok",database:source,quickCheck:quick,foreignKeyViolations:0,payloadIssues:0}));
}finally{database.close();}
