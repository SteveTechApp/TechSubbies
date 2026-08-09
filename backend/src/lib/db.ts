import { DatabaseSync } from "node:sqlite";
import { randomUUID } from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import { decodePersistedObject } from "./persistedData.js";
import { JOB_SCHEMA_VERSION } from "../domain/marketplaceTypes.js";

// Uses Node's built-in SQLite module (stable since Node 22.5, no native
// binary download required) rather than a database engine that needs to
// fetch prebuilt binaries at install time - keeping the backend runnable
// offline and behind restrictive network setups.

const DB_FILE = process.env.DB_FILE || path.join(process.cwd(), "data", "techsubbies.db");
fs.mkdirSync(path.dirname(DB_FILE), { recursive: true });

export const db = new DatabaseSync(DB_FILE);
db.exec("PRAGMA foreign_keys = ON; PRAGMA journal_mode = WAL; PRAGMA synchronous = NORMAL; PRAGMA busy_timeout = 5000;");

// WAL allows readers to continue while a write is committed. A bounded busy
// timeout absorbs short write contention instead of immediately failing a
// marketplace action with SQLITE_BUSY.
db.prepare("PRAGMA journal_mode = WAL").get();
db.exec(`
  PRAGMA synchronous = NORMAL;
  PRAGMA foreign_keys = ON;
  PRAGMA busy_timeout = 5000;
`);

export function checkDatabaseConnection(): boolean {
  const result = db.prepare("SELECT 1 AS ok").get() as { ok?: number } | undefined;
  return result?.ok === 1 && currentSchemaVersion(db) === LATEST_SCHEMA_VERSION;
}

export function getDatabaseRuntimeSettings() {
  const journal = db.prepare("PRAGMA journal_mode").get() as { journal_mode: string };
  const synchronous = db.prepare("PRAGMA synchronous").get() as { synchronous: number };
  const foreignKeys = db.prepare("PRAGMA foreign_keys").get() as { foreign_keys: number };
  const busyTimeout = db.prepare("PRAGMA busy_timeout").get() as { timeout: number };
  return {
    journalMode: journal.journal_mode,
    synchronous: synchronous.synchronous,
    foreignKeys: foreignKeys.foreign_keys === 1,
    busyTimeoutMs: busyTimeout.timeout,
  };
}

db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    role TEXT NOT NULL,
    name TEXT NOT NULL,
    profile TEXT NOT NULL,
    emailVerified INTEGER NOT NULL DEFAULT 0,
    sessionVersion INTEGER NOT NULL DEFAULT 0,
    createdAt TEXT NOT NULL,
    updatedAt TEXT NOT NULL
  );
`);

// Existing development databases pre-date email verification.
const userColumns = db.prepare("PRAGMA table_info(users)").all() as unknown as { name: string }[];
if (!userColumns.some((column) => column.name === "emailVerified")) {
  db.exec("ALTER TABLE users ADD COLUMN emailVerified INTEGER NOT NULL DEFAULT 0");
}
if (!userColumns.some((column) => column.name === "sessionVersion")) {
  db.exec("ALTER TABLE users ADD COLUMN sessionVersion INTEGER NOT NULL DEFAULT 0");
}

db.exec(`
  CREATE TABLE IF NOT EXISTS account_tokens (
    tokenHash TEXT PRIMARY KEY,
    userId TEXT NOT NULL,
    type TEXT NOT NULL,
    expiresAt TEXT NOT NULL,
    createdAt TEXT NOT NULL
  );
  CREATE INDEX IF NOT EXISTS account_tokens_user_type ON account_tokens(userId, type);
`);

db.exec(`
  CREATE TABLE IF NOT EXISTS partnership_requests (
    id TEXT PRIMARY KEY,
    requesterId TEXT NOT NULL,
    partnerId TEXT NOT NULL,
    status TEXT NOT NULL,
    createdAt TEXT NOT NULL,
    updatedAt TEXT NOT NULL
  );
`);

db.exec(`
  CREATE TABLE IF NOT EXISTS company_attachment_requests (
    id TEXT PRIMARY KEY,
    engineerId TEXT NOT NULL,
    resourcingCompanyId TEXT NOT NULL,
    status TEXT NOT NULL,
    createdAt TEXT NOT NULL,
    updatedAt TEXT NOT NULL
  );
`);

function ensureUserColumn(name:string,definition:string){const columns=db.prepare("PRAGMA table_info(users)").all() as any[];if(!columns.some(column=>column.name===name))db.exec(`ALTER TABLE users ADD COLUMN ${name} ${definition}`);}
ensureUserColumn("emailVerifiedAt","TEXT");
ensureUserColumn("sessionVersion","INTEGER NOT NULL DEFAULT 0");
db.exec(`CREATE TABLE IF NOT EXISTS account_tokens (
  id TEXT PRIMARY KEY, userId TEXT NOT NULL, purpose TEXT NOT NULL, tokenHash TEXT UNIQUE NOT NULL,
  expiresAt TEXT NOT NULL, usedAt TEXT, createdAt TEXT NOT NULL
); CREATE INDEX IF NOT EXISTS idx_account_tokens_lookup ON account_tokens(tokenHash,purpose);`);

db.exec(`
  CREATE TABLE IF NOT EXISTS jobs (
    id TEXT PRIMARY KEY, companyId TEXT NOT NULL, payload TEXT NOT NULL,
    status TEXT NOT NULL, createdAt TEXT NOT NULL, updatedAt TEXT NOT NULL
  );
  CREATE TABLE IF NOT EXISTS applications (
    id TEXT PRIMARY KEY, jobId TEXT NOT NULL, engineerId TEXT NOT NULL,
    status TEXT NOT NULL, payload TEXT NOT NULL, createdAt TEXT NOT NULL, updatedAt TEXT NOT NULL,
    UNIQUE(jobId, engineerId)
  );
  CREATE TABLE IF NOT EXISTS contracts (
    id TEXT PRIMARY KEY, jobId TEXT NOT NULL, applicationId TEXT NOT NULL UNIQUE,
    companyId TEXT NOT NULL, engineerId TEXT NOT NULL, status TEXT NOT NULL,
    payload TEXT NOT NULL, createdAt TEXT NOT NULL, updatedAt TEXT NOT NULL
  );
  CREATE TABLE IF NOT EXISTS timesheets (
    id TEXT PRIMARY KEY, contractId TEXT NOT NULL, engineerId TEXT NOT NULL,
    status TEXT NOT NULL, payload TEXT NOT NULL, createdAt TEXT NOT NULL, updatedAt TEXT NOT NULL
  );
  CREATE TABLE IF NOT EXISTS membership_invoices (
    id TEXT PRIMARY KEY, userId TEXT NOT NULL, plan TEXT NOT NULL, amountPence INTEGER NOT NULL,
    currency TEXT NOT NULL, status TEXT NOT NULL, createdAt TEXT NOT NULL, paidAt TEXT
  );
  CREATE TABLE IF NOT EXISTS membership_subscriptions (
    userId TEXT PRIMARY KEY, plan TEXT NOT NULL, status TEXT NOT NULL,
    providerCustomerId TEXT, providerSubscriptionId TEXT UNIQUE,
    currentPeriodEnd TEXT, createdAt TEXT NOT NULL, updatedAt TEXT NOT NULL
  );
  CREATE TABLE IF NOT EXISTS membership_checkout_sessions (
    id TEXT PRIMARY KEY, invoiceId TEXT NOT NULL UNIQUE, userId TEXT NOT NULL,
    plan TEXT NOT NULL, status TEXT NOT NULL, createdAt TEXT NOT NULL, updatedAt TEXT NOT NULL
  );
  CREATE TABLE IF NOT EXISTS payment_webhook_events (
    id TEXT PRIMARY KEY, type TEXT NOT NULL, processedAt TEXT NOT NULL
  );
  CREATE TABLE IF NOT EXISTS documents (
    id TEXT PRIMARY KEY, ownerId TEXT NOT NULL, documentType TEXT NOT NULL,
    originalName TEXT NOT NULL, mimeType TEXT NOT NULL, sizeBytes INTEGER NOT NULL,
    sha256 TEXT NOT NULL, storageKey TEXT UNIQUE NOT NULL, status TEXT NOT NULL,
    createdAt TEXT NOT NULL, updatedAt TEXT NOT NULL
  );
  CREATE TABLE IF NOT EXISTS completion_validations (
    id TEXT PRIMARY KEY, contractId TEXT NOT NULL, engineerId TEXT NOT NULL,
    validatorId TEXT NOT NULL, roleId TEXT NOT NULL, payload TEXT NOT NULL,
    createdAt TEXT NOT NULL, UNIQUE(contractId, validatorId)
  );
  CREATE TABLE IF NOT EXISTS talent_pool_entries (
    id TEXT PRIMARY KEY, ownerCompanyId TEXT NOT NULL, engineerId TEXT NOT NULL,
    list TEXT NOT NULL, payload TEXT NOT NULL, createdAt TEXT NOT NULL, updatedAt TEXT NOT NULL,
    UNIQUE(ownerCompanyId, engineerId)
  );
  CREATE TABLE IF NOT EXISTS technical_work_packs (
    id TEXT PRIMARY KEY, contractId TEXT NOT NULL UNIQUE, ownerCompanyId TEXT NOT NULL,
    version INTEGER NOT NULL, payload TEXT NOT NULL, createdAt TEXT NOT NULL, updatedAt TEXT NOT NULL
  );
  CREATE TABLE IF NOT EXISTS project_teams (
    id TEXT PRIMARY KEY, ownerCompanyId TEXT NOT NULL, name TEXT NOT NULL,
    payload TEXT NOT NULL, createdAt TEXT NOT NULL, updatedAt TEXT NOT NULL
  );
  CREATE TABLE IF NOT EXISTS audit_events (
    id TEXT PRIMARY KEY, companyId TEXT NOT NULL, actorId TEXT NOT NULL,
    action TEXT NOT NULL, entityType TEXT NOT NULL, entityId TEXT NOT NULL,
    metadata TEXT NOT NULL, createdAt TEXT NOT NULL
  );
  CREATE TABLE IF NOT EXISTS payload_quarantine (
    id TEXT PRIMARY KEY, sourceTable TEXT NOT NULL, sourceId TEXT NOT NULL,
    snapshot TEXT NOT NULL, reason TEXT NOT NULL, createdAt TEXT NOT NULL, restoredAt TEXT
  );
  CREATE UNIQUE INDEX IF NOT EXISTS idx_payload_quarantine_active ON payload_quarantine(sourceTable,sourceId) WHERE restoredAt IS NULL;
`);

db.exec(`
  CREATE TABLE IF NOT EXISTS schema_migrations (version INTEGER PRIMARY KEY, appliedAt TEXT NOT NULL);
  CREATE INDEX IF NOT EXISTS idx_jobs_company_created ON jobs(companyId, createdAt DESC);
  CREATE INDEX IF NOT EXISTS idx_applications_job_status ON applications(jobId, status);
  CREATE INDEX IF NOT EXISTS idx_applications_engineer_created ON applications(engineerId, createdAt DESC);
  CREATE INDEX IF NOT EXISTS idx_contracts_company_status ON contracts(companyId, status);
  CREATE INDEX IF NOT EXISTS idx_contracts_engineer_status ON contracts(engineerId, status);
  CREATE INDEX IF NOT EXISTS idx_timesheets_contract_status ON timesheets(contractId, status);
  CREATE INDEX IF NOT EXISTS idx_validations_engineer_created ON completion_validations(engineerId, createdAt DESC);
  CREATE INDEX IF NOT EXISTS idx_talent_pool_owner_list ON talent_pool_entries(ownerCompanyId, list);
  CREATE INDEX IF NOT EXISTS idx_audit_company_created ON audit_events(companyId, createdAt DESC);
  INSERT OR IGNORE INTO schema_migrations(version, appliedAt) VALUES (1, datetime('now'));
`);

export function databaseIntegrity() { const quick=(db.prepare("PRAGMA quick_check").get() as any)?.quick_check; const foreignKeys=db.prepare("PRAGMA foreign_key_check").all(); return {ok:quick==='ok'&&foreignKeys.length===0,quickCheck:quick,foreignKeyViolations:foreignKeys.length}; }

export interface MarketplaceRow { id: string; payload: string; status: string; createdAt: string; updatedAt: string; [key: string]: unknown }
const now = () => new Date().toISOString();
function transaction<T>(work:()=>T):T{db.exec("BEGIN IMMEDIATE");try{const result=work();db.exec("COMMIT");return result;}catch(error){db.exec("ROLLBACK");throw error;}}
const hydrate = (row: MarketplaceRow) => {
  const { payload, ...storedFields } = row;
  const entity=Object.hasOwn(row,"companyId")&&Object.hasOwn(row,"engineerId")?"contract":Object.hasOwn(row,"companyId")?"job":Object.hasOwn(row,"contractId")?"timesheet":"application";
  const decoded=decodePersistedObject(payload,{entity,id:row.id,...(entity==="job"?{versionKey:"jobSchemaVersion",maximumVersion:JOB_SCHEMA_VERSION}:{})});
  return { ...storedFields, ...decoded, id: row.id, status: row.status, createdAt: row.createdAt, updatedAt: row.updatedAt };
};

export function createJob(companyId: string, payload: Record<string, unknown>) {
  const id = randomUUID(), timestamp = now();
  db.prepare("INSERT INTO jobs VALUES (?, ?, ?, 'active', ?, ?)").run(id, companyId, JSON.stringify(payload), timestamp, timestamp);
  return getJob(id)!;
}
export function getJob(id: string) { const row = db.prepare("SELECT * FROM jobs WHERE id = ?").get(id) as unknown as MarketplaceRow | undefined; return row ? hydrate(row) : undefined; }
export function listJobs() { return (db.prepare("SELECT * FROM jobs ORDER BY createdAt DESC").all() as unknown as MarketplaceRow[]).map(hydrate); }
export function createApplication(jobId: string, engineerId: string, payload: Record<string, unknown>) {
  const id = randomUUID(), timestamp = now();
  db.prepare("INSERT INTO applications VALUES (?, ?, ?, 'Applied', ?, ?, ?)").run(id, jobId, engineerId, JSON.stringify(payload), timestamp, timestamp);
  return getApplication(id)!;
}
export function getApplication(id: string) { const row = db.prepare("SELECT * FROM applications WHERE id = ?").get(id) as unknown as MarketplaceRow | undefined; return row ? hydrate(row) : undefined; }
export function listApplicationsForJob(jobId: string) { return (db.prepare("SELECT * FROM applications WHERE jobId = ? ORDER BY createdAt DESC").all(jobId) as unknown as MarketplaceRow[]).map(hydrate); }
export function listApplicationsForUser(userId: string) { return (db.prepare("SELECT * FROM applications WHERE engineerId = ? OR jobId IN (SELECT id FROM jobs WHERE companyId = ?) ORDER BY createdAt DESC").all(userId, userId) as unknown as MarketplaceRow[]).map(hydrate); }
export function updateApplicationStatus(id: string, status: string) { db.prepare("UPDATE applications SET status = ?, updatedAt = ? WHERE id = ?").run(status, now(), id); return getApplication(id); }
export function createContract(application: any, companyId: string, payload: Record<string, unknown>) {
  const id = randomUUID(), timestamp = now();
  transaction(()=>{db.prepare("INSERT INTO contracts VALUES (?, ?, ?, ?, ?, 'Pending Signature', ?, ?, ?)").run(id, application.jobId, application.id, companyId, application.engineerId, JSON.stringify(payload), timestamp, timestamp);db.prepare("UPDATE applications SET status='Offered', updatedAt=? WHERE id=?").run(timestamp,application.id);});
  return getContract(id)!;
}
export function getContract(id: string) { const row = db.prepare("SELECT * FROM contracts WHERE id = ?").get(id) as unknown as MarketplaceRow | undefined; return row ? hydrate(row) : undefined; }
export function listContractsForUser(userId: string) { return (db.prepare("SELECT * FROM contracts WHERE companyId = ? OR engineerId = ? ORDER BY createdAt DESC").all(userId, userId) as unknown as MarketplaceRow[]).map(hydrate).map((contract:any)=>({...contract,timesheets:listTimesheets(contract.id)})); }
export function updateContract(id: string, status: string, payload: Record<string, unknown>) { db.prepare("UPDATE contracts SET status = ?, payload = ?, updatedAt = ? WHERE id = ?").run(status, JSON.stringify(payload), now(), id); return getContract(id); }
export function activateContract(id:string,payload:Record<string,unknown>){const contract:any=getContract(id);if(!contract)return undefined;const timestamp=now();transaction(()=>{db.prepare("UPDATE contracts SET status='Active', payload=?, updatedAt=? WHERE id=?").run(JSON.stringify(payload),timestamp,id);db.prepare("UPDATE applications SET status='Hired', updatedAt=? WHERE id=?").run(timestamp,contract.applicationId);});return getContract(id);}
export function createTimesheet(contractId: string, engineerId: string, payload: Record<string, unknown>) { const id = randomUUID(), timestamp = now(); db.prepare("INSERT INTO timesheets VALUES (?, ?, ?, 'submitted', ?, ?, ?)").run(id, contractId, engineerId, JSON.stringify(payload), timestamp, timestamp); return getTimesheet(id)!; }
export function getTimesheet(id: string) { const row = db.prepare("SELECT * FROM timesheets WHERE id = ?").get(id) as unknown as MarketplaceRow | undefined; return row ? hydrate(row) : undefined; }
export function listTimesheets(contractId: string) { return (db.prepare("SELECT * FROM timesheets WHERE contractId = ? ORDER BY createdAt DESC").all(contractId) as unknown as MarketplaceRow[]).map(hydrate); }
export function updateTimesheetStatus(id: string, status: string) { db.prepare("UPDATE timesheets SET status = ?, updatedAt = ? WHERE id = ?").run(status, now(), id); return getTimesheet(id); }
export function createMembershipInvoice(userId: string, plan: string, amountPence: number, currency: string) { const id = randomUUID(), timestamp = now(); db.prepare("INSERT INTO membership_invoices VALUES (?, ?, ?, ?, ?, 'open', ?, NULL)").run(id, userId, plan, amountPence, currency, timestamp); return db.prepare("SELECT * FROM membership_invoices WHERE id = ?").get(id); }
export function listMembershipInvoices(userId: string) { return db.prepare("SELECT * FROM membership_invoices WHERE userId = ? ORDER BY createdAt DESC").all(userId); }
export function createDocument(input:{ownerId:string;documentType:string;originalName:string;mimeType:string;sizeBytes:number;sha256:string;storageKey:string}){const id=randomUUID(),timestamp=now();db.prepare("INSERT INTO documents VALUES (?,?,?,?,?,?,?,?,'pending-review',?,?)").run(id,input.ownerId,input.documentType,input.originalName,input.mimeType,input.sizeBytes,input.sha256,input.storageKey,timestamp,timestamp);return getDocument(id)!;}
export function getDocument(id:string){return db.prepare("SELECT * FROM documents WHERE id=?").get(id) as any;}
export function listDocuments(ownerId:string){return db.prepare("SELECT id,ownerId,documentType,originalName,mimeType,sizeBytes,sha256,status,createdAt,updatedAt FROM documents WHERE ownerId=? ORDER BY createdAt DESC").all(ownerId);}
export function deleteDocument(id:string,ownerId:string){const row=getDocument(id);if(!row||row.ownerId!==ownerId)return undefined;db.prepare("DELETE FROM documents WHERE id=?").run(id);return row;}
export function deleteDocumentsForOwner(ownerId:string){const rows=db.prepare("SELECT * FROM documents WHERE ownerId=?").all(ownerId) as any[];db.prepare("DELETE FROM documents WHERE ownerId=?").run(ownerId);return rows;}
export function getMembershipInvoice(id:string){return db.prepare("SELECT * FROM membership_invoices WHERE id=?").get(id) as any;}
export function createMembershipCheckoutSession(id:string,invoiceId:string,userId:string,plan:string){const timestamp=now();db.prepare("INSERT INTO membership_checkout_sessions VALUES (?, ?, ?, ?, 'open', ?, ?)").run(id,invoiceId,userId,plan,timestamp,timestamp);return db.prepare("SELECT * FROM membership_checkout_sessions WHERE id=?").get(id);}
export function getMembershipCheckoutSession(id:string){return db.prepare("SELECT * FROM membership_checkout_sessions WHERE id=?").get(id) as any;}
export function getMembershipSubscription(userId:string){return db.prepare("SELECT * FROM membership_subscriptions WHERE userId=?").get(userId);}
export function activateMembership(eventId:string,eventType:string,sessionId:string,providerCustomerId:string|undefined,providerSubscriptionId:string|undefined){return transaction(()=>{if(db.prepare("SELECT id FROM payment_webhook_events WHERE id=?").get(eventId))return {duplicate:true};const session=getMembershipCheckoutSession(sessionId);if(!session)throw new Error('Unknown membership checkout session.');const invoice=getMembershipInvoice(session.invoiceId);if(!invoice||invoice.userId!==session.userId)throw new Error('Invalid membership invoice link.');const timestamp=now();db.prepare("UPDATE membership_invoices SET status='paid', paidAt=? WHERE id=? AND status='open'").run(timestamp,invoice.id);db.prepare("UPDATE membership_checkout_sessions SET status='complete', updatedAt=? WHERE id=?").run(timestamp,sessionId);db.prepare("INSERT INTO membership_subscriptions(userId,plan,status,providerCustomerId,providerSubscriptionId,currentPeriodEnd,createdAt,updatedAt) VALUES (?,?,'active',?,?,NULL,?,?) ON CONFLICT(userId) DO UPDATE SET plan=excluded.plan,status='active',providerCustomerId=excluded.providerCustomerId,providerSubscriptionId=excluded.providerSubscriptionId,updatedAt=excluded.updatedAt").run(session.userId,session.plan,providerCustomerId||null,providerSubscriptionId||null,timestamp,timestamp);const user=findUserById(session.userId);if(user){let profile:any={};try{profile=JSON.parse(user.profile)}catch{}const tiers:Record<string,string>={professional:'Silver',skills:'Gold',business:'Platinum'};updateUserProfile(user.id,JSON.stringify({...profile,profileTier:tiers[session.plan]||'Bronze'}),user.name);}db.prepare("INSERT INTO payment_webhook_events VALUES (?,?,?)").run(eventId,eventType,timestamp);return {duplicate:false,userId:session.userId,plan:session.plan};});}
export function cancelMembership(eventId:string,eventType:string,providerSubscriptionId:string){return transaction(()=>{if(db.prepare("SELECT id FROM payment_webhook_events WHERE id=?").get(eventId))return {duplicate:true};db.prepare("UPDATE membership_subscriptions SET status='cancelled', updatedAt=? WHERE providerSubscriptionId=?").run(now(),providerSubscriptionId);db.prepare("INSERT INTO payment_webhook_events VALUES (?,?,?)").run(eventId,eventType,now());return {duplicate:false};});}

export function createCompletionValidation(contractId: string, engineerId: string, validatorId: string, roleId: string, payload: Record<string, unknown>) { const id=randomUUID(), timestamp=now(); db.prepare("INSERT INTO completion_validations VALUES (?, ?, ?, ?, ?, ?, ?)").run(id,contractId,engineerId,validatorId,roleId,JSON.stringify(payload),timestamp); return {id,contractId,engineerId,validatorId,roleId,...payload,createdAt:timestamp}; }
export function listCompletionValidations(engineerId: string) { return (db.prepare("SELECT * FROM completion_validations WHERE engineerId = ? ORDER BY createdAt DESC").all(engineerId) as any[]).map((row)=>({...decodePersistedObject(row.payload,{entity:"completion validation",id:row.id}),id:row.id,contractId:row.contractId,engineerId:row.engineerId,validatorId:row.validatorId,roleId:row.roleId,createdAt:row.createdAt})); }
export function upsertTalentPoolEntry(ownerCompanyId: string, engineerId: string, list: string, payload: Record<string, unknown>) { const existing=db.prepare("SELECT id, createdAt FROM talent_pool_entries WHERE ownerCompanyId=? AND engineerId=?").get(ownerCompanyId,engineerId) as any; const timestamp=now(), id=existing?.id||randomUUID(); if(existing) db.prepare("UPDATE talent_pool_entries SET list=?, payload=?, updatedAt=? WHERE id=?").run(list,JSON.stringify(payload),timestamp,id); else db.prepare("INSERT INTO talent_pool_entries VALUES (?, ?, ?, ?, ?, ?, ?)").run(id,ownerCompanyId,engineerId,list,JSON.stringify(payload),timestamp,timestamp); return {id,ownerCompanyId,engineerId,list,...payload,createdAt:existing?.createdAt||timestamp,updatedAt:timestamp}; }
export function listTalentPoolEntries(ownerCompanyId: string) { return (db.prepare("SELECT * FROM talent_pool_entries WHERE ownerCompanyId=? ORDER BY updatedAt DESC").all(ownerCompanyId) as any[]).map((row)=>{ const engineer=findUserById(row.engineerId); return {...decodePersistedObject(row.payload,{entity:"talent pool entry",id:row.id}),id:row.id,ownerCompanyId:row.ownerCompanyId,engineerId:row.engineerId,engineerName:engineer?.name||'Engineer',list:row.list,createdAt:row.createdAt,updatedAt:row.updatedAt}; }); }
export function deleteTalentPoolEntry(ownerCompanyId: string, engineerId: string) { return db.prepare("DELETE FROM talent_pool_entries WHERE ownerCompanyId=? AND engineerId=?").run(ownerCompanyId,engineerId).changes > 0; }
export function getTechnicalWorkPack(contractId: string) { const row=db.prepare("SELECT * FROM technical_work_packs WHERE contractId=?").get(contractId) as any; return row ? {...decodePersistedObject(row.payload,{entity:"technical work pack",id:row.id}),id:row.id,contractId:row.contractId,ownerCompanyId:row.ownerCompanyId,version:row.version,createdAt:row.createdAt,updatedAt:row.updatedAt} : undefined; }
export function upsertTechnicalWorkPack(contractId:string,ownerCompanyId:string,payload:Record<string,unknown>) { const existing=getTechnicalWorkPack(contractId), timestamp=now(), id=existing?.id||randomUUID(), version=(existing?.version||0)+1; if(existing) db.prepare("UPDATE technical_work_packs SET version=?, payload=?, updatedAt=? WHERE id=?").run(version,JSON.stringify(payload),timestamp,id); else db.prepare("INSERT INTO technical_work_packs VALUES (?, ?, ?, ?, ?, ?, ?)").run(id,contractId,ownerCompanyId,version,JSON.stringify(payload),timestamp,timestamp); return getTechnicalWorkPack(contractId)!; }
export function createProjectTeam(ownerCompanyId:string,name:string,payload:Record<string,unknown>){const id=randomUUID(),timestamp=now();db.prepare("INSERT INTO project_teams VALUES (?, ?, ?, ?, ?, ?)").run(id,ownerCompanyId,name,JSON.stringify(payload),timestamp,timestamp);return {id,ownerCompanyId,name,...payload,createdAt:timestamp,updatedAt:timestamp};}
export function listProjectTeams(ownerCompanyId:string){return (db.prepare("SELECT * FROM project_teams WHERE ownerCompanyId=? ORDER BY updatedAt DESC").all(ownerCompanyId) as any[]).map(row=>({...decodePersistedObject(row.payload,{entity:"project team",id:row.id}),id:row.id,ownerCompanyId:row.ownerCompanyId,name:row.name,createdAt:row.createdAt,updatedAt:row.updatedAt}));}
export function getCompanyWorkforceInsights(companyId:string){
  const jobs=(db.prepare("SELECT * FROM jobs WHERE companyId=?").all(companyId) as any[]).map(hydrate);
  const jobIds=new Set(jobs.map((job:any)=>job.id));
  const applications=(db.prepare("SELECT * FROM applications ORDER BY createdAt").all() as any[]).map(hydrate).filter((item:any)=>jobIds.has(item.jobId));
  const contracts=(db.prepare("SELECT * FROM contracts WHERE companyId=?").all(companyId) as any[]).map(hydrate);
  const validations=db.prepare("SELECT payload FROM completion_validations WHERE validatorId=?").all(companyId) as any[];
  const roleDemand:Record<string,number>={}; jobs.forEach((job:any)=>{const ids=Array.isArray(job.roleIds)&&job.roleIds.length?job.roleIds:[job.roleId].filter(Boolean);ids.forEach((id:string)=>roleDemand[id]=(roleDemand[id]||0)+1);});
  const nowMs=Date.now(); const engineers=listUsers().filter(user=>user.role==='Engineer').map(user=>{try{return JSON.parse(user.profile)}catch{return{}}}); const recentlyAvailable=engineers.filter((profile:any)=>profile.availabilityConfirmedAt&&nowMs-new Date(profile.availabilityConfirmedAt).getTime()<=7*86400000).length;
  const positiveValidations=validations.filter(row=>{try{const value=JSON.parse(row.payload);return value.responsibilityMet&&value.wouldUseAgainForRole&&!value.unexpectedSupervisionRequired}catch{return false}}).length;
  return {generatedAt:now(),totals:{jobs:jobs.length,applications:applications.length,contracts:contracts.length,completedContracts:contracts.filter((item:any)=>item.status==='Completed').length,validations:validations.length,positiveValidations},conversion:{applicationsPerJob:jobs.length?Number((applications.length/jobs.length).toFixed(1)):0,applicationToContractPercent:applications.length?Math.round(contracts.length/applications.length*100):0,contractCompletionPercent:contracts.length?Math.round(contracts.filter((item:any)=>item.status==='Completed').length/contracts.length*100):0},roleDemand:Object.entries(roleDemand).map(([roleId,count])=>({roleId,count})).sort((a,b)=>b.count-a.count),availability:{registeredEngineers:engineers.length,recentlyConfirmed:recentlyAvailable,freshnessPercent:engineers.length?Math.round(recentlyAvailable/engineers.length*100):0},privacyNotice:'Metrics are aggregated. Private talent-pool notes, client validation comments and individual engineer performance are not exposed.'};
}
export function createAuditEvent(companyId:string,actorId:string,action:string,entityType:string,entityId:string,metadata:Record<string,unknown>={}){const id=randomUUID(),createdAt=now();db.prepare("INSERT INTO audit_events VALUES (?, ?, ?, ?, ?, ?, ?, ?)").run(id,companyId,actorId,action,entityType,entityId,JSON.stringify(metadata),createdAt);return{id,companyId,actorId,action,entityType,entityId,metadata,createdAt};}
export function listAuditEvents(companyId:string,limit=100){return(db.prepare("SELECT * FROM audit_events WHERE companyId=? ORDER BY createdAt DESC LIMIT ?").all(companyId,limit) as any[]).map(row=>({...row,metadata:decodePersistedObject(row.metadata,{entity:"audit metadata",id:row.id})}));}

export interface UserRow {
  id: string;
  email: string;
  password: string;
  role: string;
  name: string;
  profile: string;
  emailVerified: number;
  sessionVersion: number;
  deletedAt: string | null;
  suspendedAt: string | null;
  suspensionReason: string | null;
  suspendedBy: string | null;
  createdAt: string;
  updatedAt: string;
  emailVerifiedAt: string|null;
  sessionVersion: number;
}

export function findUserByEmail(email: string): UserRow | undefined {
  return db.prepare("SELECT * FROM users WHERE email = ?").get(email) as unknown as UserRow | undefined;
}

export function findUserById(id: string): UserRow | undefined {
  return db.prepare("SELECT * FROM users WHERE id = ?").get(id) as unknown as UserRow | undefined;
}

export function listUsers(): UserRow[] {
  return db.prepare(
    "SELECT * FROM users WHERE deletedAt IS NULL AND suspendedAt IS NULL ORDER BY createdAt DESC"
  ).all() as unknown as UserRow[];
}

export function createUser(input: { email: string; password: string; role: string; name: string; profile: string }): UserRow {
  const id = randomUUID();
  const now = new Date().toISOString();
  db.prepare(
    "INSERT INTO users (id, email, password, role, name, profile, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?, ?, ?, ?)"
  ).run(id, input.email, input.password, input.role, input.name, input.profile, now, now);
  return findUserById(id)!;
}

export function updateUserProfile(id: string, profile: string, name: string): UserRow | undefined {
  const now = new Date().toISOString();
  db.prepare("UPDATE users SET profile = ?, name = ?, updatedAt = ? WHERE id = ?").run(profile, name, now, id);
  return findUserById(id);
}

export function createAccountToken(userId:string,purpose:"verify-email"|"reset-password",tokenHash:string,expiresAt:string){const id=randomUUID(),createdAt=now();db.prepare("DELETE FROM account_tokens WHERE userId=? AND purpose=? AND usedAt IS NULL").run(userId,purpose);db.prepare("INSERT INTO account_tokens VALUES (?,?,?,?,?,NULL,?)").run(id,userId,purpose,tokenHash,expiresAt,createdAt);return{id,userId,purpose,expiresAt,createdAt};}
export function consumeAccountToken(tokenHash:string,purpose:"verify-email"|"reset-password"){return transaction(()=>{const row=db.prepare("SELECT * FROM account_tokens WHERE tokenHash=? AND purpose=? AND usedAt IS NULL AND expiresAt>?").get(tokenHash,purpose,now()) as any;if(!row)return undefined;db.prepare("UPDATE account_tokens SET usedAt=? WHERE id=?").run(now(),row.id);return row;});}
export function markEmailVerified(userId:string){db.prepare("UPDATE users SET emailVerifiedAt=COALESCE(emailVerifiedAt,?), updatedAt=? WHERE id=?").run(now(),now(),userId);return findUserById(userId);}
export function updatePasswordAndRevokeSessions(userId:string,password:string){db.prepare("UPDATE users SET password=?, sessionVersion=sessionVersion+1, updatedAt=? WHERE id=?").run(password,now(),userId);return findUserById(userId);}
export function revokeUserSessions(userId:string){db.prepare("UPDATE users SET sessionVersion=sessionVersion+1, updatedAt=? WHERE id=?").run(now(),userId);return findUserById(userId);}
export function exportAccount(userId:string){const user=findUserById(userId);if(!user)return undefined;return{exportedAt:now(),account:{id:user.id,email:user.email,role:user.role,name:user.name,profile:JSON.parse(user.profile),createdAt:user.createdAt,emailVerifiedAt:user.emailVerifiedAt},jobs:listJobs().filter((item:any)=>item.companyId===userId),applications:listApplicationsForUser(userId),contracts:listContractsForUser(userId),membershipInvoices:listMembershipInvoices(userId),subscription:getMembershipSubscription(userId)};}
export function deleteAccount(userId:string){const active=db.prepare("SELECT COUNT(*) AS count FROM contracts WHERE (companyId=? OR engineerId=?) AND status IN ('Pending Signature','Active')").get(userId,userId) as any;if(active.count>0)return{deleted:false,reason:"Active or unsigned contracts must be resolved before account deletion."};transaction(()=>{db.prepare("DELETE FROM completion_validations WHERE engineerId=? OR validatorId=? OR contractId IN (SELECT id FROM contracts WHERE companyId=? OR engineerId=?)").run(userId,userId,userId,userId);db.prepare("DELETE FROM technical_work_packs WHERE ownerCompanyId=? OR contractId IN (SELECT id FROM contracts WHERE companyId=? OR engineerId=?)").run(userId,userId,userId);db.prepare("DELETE FROM timesheets WHERE engineerId=? OR contractId IN (SELECT id FROM contracts WHERE companyId=? OR engineerId=?)").run(userId,userId,userId);db.prepare("DELETE FROM contracts WHERE companyId=? OR engineerId=?").run(userId,userId);db.prepare("DELETE FROM applications WHERE engineerId=? OR jobId IN (SELECT id FROM jobs WHERE companyId=?)").run(userId,userId);db.prepare("DELETE FROM jobs WHERE companyId=?").run(userId);db.prepare("DELETE FROM account_tokens WHERE userId=?").run(userId);db.prepare("DELETE FROM membership_checkout_sessions WHERE userId=?").run(userId);db.prepare("DELETE FROM membership_subscriptions WHERE userId=?").run(userId);db.prepare("DELETE FROM membership_invoices WHERE userId=?").run(userId);db.prepare("DELETE FROM partnership_requests WHERE requesterId=? OR partnerId=?").run(userId,userId);db.prepare("DELETE FROM company_attachment_requests WHERE engineerId=? OR resourcingCompanyId=?").run(userId,userId);db.prepare("DELETE FROM talent_pool_entries WHERE engineerId=? OR ownerCompanyId=?").run(userId,userId);db.prepare("DELETE FROM project_teams WHERE ownerCompanyId=?").run(userId);db.prepare("DELETE FROM audit_events WHERE companyId=? OR actorId=?").run(userId,userId);db.prepare("DELETE FROM users WHERE id=?").run(userId);});return{deleted:true};}

// --- Partnership requests (engineer <-> engineer "team" pairing) ---

export interface PartnershipRequestRow {
  id: string;
  requesterId: string;
  partnerId: string;
  status: string;
  createdAt: string;
  updatedAt: string;
}

export function createPartnershipRequest(requesterId: string, partnerId: string): PartnershipRequestRow {
  const id = randomUUID();
  const now = new Date().toISOString();
  db.prepare(
    "INSERT INTO partnership_requests (id, requesterId, partnerId, status, createdAt, updatedAt) VALUES (?, ?, ?, 'pending', ?, ?)"
  ).run(id, requesterId, partnerId, now, now);
  return findPartnershipRequestById(id)!;
}

export function findPartnershipRequestById(id: string): PartnershipRequestRow | undefined {
  return db.prepare("SELECT * FROM partnership_requests WHERE id = ?").get(id) as unknown as
    | PartnershipRequestRow
    | undefined;
}

export function listPartnershipRequestsForUser(userId: string): PartnershipRequestRow[] {
  return db
    .prepare(
      "SELECT * FROM partnership_requests WHERE requesterId = ? OR partnerId = ? ORDER BY createdAt DESC"
    )
    .all(userId, userId) as unknown as PartnershipRequestRow[];
}

export function findPendingPartnershipRequestBetween(
  userAId: string,
  userBId: string
): PartnershipRequestRow | undefined {
  return db
    .prepare(
      "SELECT * FROM partnership_requests WHERE status = 'pending' AND ((requesterId = ? AND partnerId = ?) OR (requesterId = ? AND partnerId = ?))"
    )
    .get(userAId, userBId, userBId, userAId) as unknown as PartnershipRequestRow | undefined;
}

export function updatePartnershipRequestStatus(id: string, status: string): PartnershipRequestRow | undefined {
  const now = new Date().toISOString();
  db.prepare("UPDATE partnership_requests SET status = ?, updatedAt = ? WHERE id = ?").run(status, now, id);
  return findPartnershipRequestById(id);
}

// --- Company attachment requests (engineer -> resourcing company) ---

export interface CompanyAttachmentRequestRow {
  id: string;
  engineerId: string;
  resourcingCompanyId: string;
  status: string;
  createdAt: string;
  updatedAt: string;
}

export function createCompanyAttachmentRequest(
  engineerId: string,
  resourcingCompanyId: string
): CompanyAttachmentRequestRow {
  const id = randomUUID();
  const now = new Date().toISOString();
  db.prepare(
    "INSERT INTO company_attachment_requests (id, engineerId, resourcingCompanyId, status, createdAt, updatedAt) VALUES (?, ?, ?, 'pending', ?, ?)"
  ).run(id, engineerId, resourcingCompanyId, now, now);
  return findCompanyAttachmentRequestById(id)!;
}

export function findCompanyAttachmentRequestById(id: string): CompanyAttachmentRequestRow | undefined {
  return db.prepare("SELECT * FROM company_attachment_requests WHERE id = ?").get(id) as unknown as
    | CompanyAttachmentRequestRow
    | undefined;
}

export function listCompanyAttachmentRequestsForEngineer(engineerId: string): CompanyAttachmentRequestRow[] {
  return db
    .prepare("SELECT * FROM company_attachment_requests WHERE engineerId = ? ORDER BY createdAt DESC")
    .all(engineerId) as unknown as CompanyAttachmentRequestRow[];
}

export function listPendingCompanyAttachmentRequestsForCompany(
  resourcingCompanyId: string
): CompanyAttachmentRequestRow[] {
  return db
    .prepare(
      "SELECT * FROM company_attachment_requests WHERE resourcingCompanyId = ? AND status = 'pending' ORDER BY createdAt DESC"
    )
    .all(resourcingCompanyId) as unknown as CompanyAttachmentRequestRow[];
}

export function findPendingCompanyAttachmentRequest(
  engineerId: string,
  resourcingCompanyId: string
): CompanyAttachmentRequestRow | undefined {
  return db
    .prepare(
      "SELECT * FROM company_attachment_requests WHERE engineerId = ? AND resourcingCompanyId = ? AND status = 'pending'"
    )
    .get(engineerId, resourcingCompanyId) as unknown as CompanyAttachmentRequestRow | undefined;
}

export function updateCompanyAttachmentRequestStatus(
  id: string,
  status: string
): CompanyAttachmentRequestRow | undefined {
  const now = new Date().toISOString();
  db.prepare("UPDATE company_attachment_requests SET status = ?, updatedAt = ? WHERE id = ?").run(status, now, id);
  return findCompanyAttachmentRequestById(id);
}

// --- Jobs ---
// The job-specific fields (title, description, dayRate, skillRequirements,
// etc - see types/index.ts `Job` on the frontend) are stored as a single
// JSON blob, the same pattern as `users.profile`, so the frontend's Job
// shape can evolve without a matching migration every time.

export interface JobRow {
  id: string;
  companyId: string;
  data: string;
  status: string;
  postedDate: string;
  updatedAt: string;
  moderatedAt: string | null;
  moderatorId: string | null;
  moderationReason: string | null;
}

export function createJob(companyId: string, data: Record<string, unknown>): JobRow {
  const id = randomUUID();
  const now = new Date().toISOString();
  db.prepare(
    "INSERT INTO jobs (id, companyId, data, status, postedDate, updatedAt) VALUES (?, ?, ?, 'active', ?, ?)"
  ).run(id, companyId, JSON.stringify(data), now, now);
  return findJobById(id)!;
}

export function findJobById(id: string): JobRow | undefined {
  return db.prepare("SELECT * FROM jobs WHERE id = ?").get(id) as unknown as JobRow | undefined;
}

export function listActiveJobs(): JobRow[] {
  return db.prepare(`
    SELECT jobs.* FROM jobs
    JOIN users ON users.id = jobs.companyId
    WHERE jobs.status = 'active'
      AND users.deletedAt IS NULL
      AND users.suspendedAt IS NULL
    ORDER BY jobs.postedDate DESC
  `).all() as unknown as JobRow[];
}

export function listJobsForCompany(companyId: string): JobRow[] {
  return db
    .prepare("SELECT * FROM jobs WHERE companyId = ? ORDER BY postedDate DESC")
    .all(companyId) as unknown as JobRow[];
}

export function updateJob(
  id: string,
  updates: { data?: Record<string, unknown>; status?: string }
): JobRow | undefined {
  const existing = findJobById(id);
  if (!existing) return undefined;

  const mergedData = updates.data ? { ...JSON.parse(existing.data), ...updates.data } : JSON.parse(existing.data);
  const status = updates.status || existing.status;
  const now = new Date().toISOString();

  db.prepare("UPDATE jobs SET data = ?, status = ?, updatedAt = ? WHERE id = ?").run(
    JSON.stringify(mergedData),
    status,
    now,
    id
  );
  return findJobById(id);
}

export type AdminJobRow = JobRow & {
  companyName: string;
  companyEmail: string;
};

export function listAdminJobs(options: {
  limit: number;
  offset: number;
  query: string;
}): AdminJobRow[] {
  const query = `%${options.query.trim().toLowerCase()}%`;
  return db.prepare(`
    SELECT jobs.*, users.name AS companyName, users.email AS companyEmail
    FROM jobs
    JOIN users ON users.id = jobs.companyId
    WHERE (? = '%%'
      OR LOWER(json_extract(jobs.data, '$.title')) LIKE ?
      OR LOWER(users.name) LIKE ?
      OR LOWER(users.email) LIKE ?
      OR LOWER(jobs.id) LIKE ?)
    ORDER BY jobs.postedDate DESC
    LIMIT ? OFFSET ?
  `).all(query, query, query, query, query, options.limit, options.offset) as unknown as AdminJobRow[];
}

export function countAdminJobs(queryText: string): number {
  const query = `%${queryText.trim().toLowerCase()}%`;
  const row = db.prepare(`
    SELECT COUNT(*) AS total
    FROM jobs
    JOIN users ON users.id = jobs.companyId
    WHERE (? = '%%'
      OR LOWER(json_extract(jobs.data, '$.title')) LIKE ?
      OR LOWER(users.name) LIKE ?
      OR LOWER(users.email) LIKE ?
      OR LOWER(jobs.id) LIKE ?)
  `).get(query, query, query, query, query) as { total: number };
  return row.total;
}

export function moderateJob(
  id: string,
  status: "active" | "closed",
  moderatorId: string,
  reason: string | null
): JobRow | undefined {
  const existing = findJobById(id);
  if (!existing) return undefined;
  const now = new Date().toISOString();
  db.prepare(`
    UPDATE jobs
    SET status = ?, moderatedAt = ?, moderatorId = ?,
        moderationReason = ?, updatedAt = ?
    WHERE id = ?
  `).run(status, now, moderatorId, status === "closed" ? reason : null, now, id);
  return findJobById(id);
}

// --- Applications ---

export interface ApplicationRow {
  id: string;
  jobId: string;
  engineerId: string;
  status: string;
  reviewed: number;
  createdAt: string;
  updatedAt: string;
}

export function createApplication(jobId: string, engineerId: string, status: string): ApplicationRow {
  const id = randomUUID();
  const now = new Date().toISOString();
  db.prepare(
    "INSERT INTO applications (id, jobId, engineerId, status, reviewed, createdAt, updatedAt) VALUES (?, ?, ?, ?, 0, ?, ?)"
  ).run(id, jobId, engineerId, status, now, now);
  return findApplicationById(id)!;
}

export function findApplicationById(id: string): ApplicationRow | undefined {
  return db.prepare("SELECT * FROM applications WHERE id = ?").get(id) as unknown as ApplicationRow | undefined;
}

export function findApplication(jobId: string, engineerId: string): ApplicationRow | undefined {
  return db
    .prepare("SELECT * FROM applications WHERE jobId = ? AND engineerId = ?")
    .get(jobId, engineerId) as unknown as ApplicationRow | undefined;
}

export function listApplicationsForJob(jobId: string): ApplicationRow[] {
  return db
    .prepare("SELECT * FROM applications WHERE jobId = ? ORDER BY createdAt DESC")
    .all(jobId) as unknown as ApplicationRow[];
}

export function listApplicationsForEngineer(engineerId: string): ApplicationRow[] {
  return db
    .prepare("SELECT * FROM applications WHERE engineerId = ? ORDER BY createdAt DESC")
    .all(engineerId) as unknown as ApplicationRow[];
}

export function listApplicationsForCompany(companyId: string): ApplicationRow[] {
  return db.prepare(`
    SELECT applications.*
    FROM applications
    JOIN jobs ON jobs.id = applications.jobId
    WHERE jobs.companyId = ?
    ORDER BY applications.createdAt DESC
  `).all(companyId) as unknown as ApplicationRow[];
}

export function updateApplicationStatus(id: string, status: string, reviewed?: boolean): ApplicationRow | undefined {
  const existing = findApplicationById(id);
  if (!existing) return undefined;
  const now = new Date().toISOString();
  db.prepare("UPDATE applications SET status = ?, reviewed = ?, updatedAt = ? WHERE id = ?").run(
    status,
    reviewed === undefined ? existing.reviewed : reviewed ? 1 : 0,
    now,
    id
  );
  return findApplicationById(id);
}

// --- Contracts, milestones & timesheets ---
// Like `jobs.data`, the free-form contract fields (description, amount,
// currency, type, jobTitle...) live in a JSON blob so the frontend's
// Contract shape can evolve without a migration. Milestones, timesheets and
// the two signatures get their own columns (still JSON-encoded) because
// they're each updated independently and often - keeping them separate
// avoids re-writing the whole blob on every milestone tick.

export interface ContractRow {
  id: string;
  jobId: string;
  companyId: string;
  engineerId: string;
  data: string;
  status: string;
  engineerSignature: string | null;
  companySignature: string | null;
  milestones: string;
  timesheets: string;
  createdAt: string;
  updatedAt: string;
}

export function createContract(
  companyId: string,
  engineerId: string,
  jobId: string,
  status: string,
  data: Record<string, unknown>,
  milestones: unknown[]
): ContractRow {
  const id = randomUUID();
  const now = new Date().toISOString();
  db.prepare(
    "INSERT INTO contracts (id, jobId, companyId, engineerId, data, status, engineerSignature, companySignature, milestones, timesheets, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?, ?, NULL, NULL, ?, '[]', ?, ?)"
  ).run(id, jobId, companyId, engineerId, JSON.stringify(data), status, JSON.stringify(milestones), now, now);
  return findContractById(id)!;
}

export function createContractAndHireApplication(
  applicationId: string,
  companyId: string,
  engineerId: string,
  jobId: string,
  status: string,
  data: Record<string, unknown>,
  milestones: unknown[]
): ContractRow {
  db.exec("BEGIN IMMEDIATE");
  try {
    const contract = createContract(companyId, engineerId, jobId, status, data, milestones);
    if (!updateApplicationStatus(applicationId, "Hired", true)) {
      throw new Error("Application disappeared while creating the contract.");
    }
    db.exec("COMMIT");
    return contract;
  } catch (error) {
    db.exec("ROLLBACK");
    throw error;
  }
}

export function findContractById(id: string): ContractRow | undefined {
  return db.prepare("SELECT * FROM contracts WHERE id = ?").get(id) as unknown as ContractRow | undefined;
}

export function findContractForApplication(jobId: string, engineerId: string): ContractRow | undefined {
  return db
    .prepare("SELECT * FROM contracts WHERE jobId = ? AND engineerId = ?")
    .get(jobId, engineerId) as unknown as ContractRow | undefined;
}

export function listContractsForUser(userId: string): ContractRow[] {
  return db
    .prepare("SELECT * FROM contracts WHERE companyId = ? OR engineerId = ? ORDER BY createdAt DESC")
    .all(userId, userId) as unknown as ContractRow[];
}

export function updateContractSignature(
  id: string,
  field: "engineerSignature" | "companySignature",
  signature: { name: string; date: string },
  status: string
): ContractRow | undefined {
  const now = new Date().toISOString();
  db.prepare(`UPDATE contracts SET ${field} = ?, status = ?, updatedAt = ? WHERE id = ?`).run(
    JSON.stringify(signature),
    status,
    now,
    id
  );
  return findContractById(id);
}

export function updateContractMilestones(id: string, milestones: unknown[]): ContractRow | undefined {
  const now = new Date().toISOString();
  db.prepare("UPDATE contracts SET milestones = ?, updatedAt = ? WHERE id = ?").run(
    JSON.stringify(milestones),
    now,
    id
  );
  return findContractById(id);
}

export function updateContractTimesheets(id: string, timesheets: unknown[]): ContractRow | undefined {
  const now = new Date().toISOString();
  db.prepare("UPDATE contracts SET timesheets = ?, updatedAt = ? WHERE id = ?").run(
    JSON.stringify(timesheets),
    now,
    id
  );
  return findContractById(id);
}

// --- Conversations & messages ---
// Every conversation in this app is a 1:1 chat between two users, so the
// two participants get their own indexed columns (participantAId /
// participantBId) rather than a JSON blob - that makes "find the
// conversation between these two people" and "list my conversations" plain
// indexed lookups instead of a JSON scan.

export interface ConversationRow {
  id: string;
  participantAId: string;
  participantBId: string;
  lastMessageText: string;
  lastMessageTimestamp: string;
  createdAt: string;
  updatedAt: string;
}

export function createConversation(userAId: string, userBId: string): ConversationRow {
  const id = randomUUID();
  const now = new Date().toISOString();
  db.prepare(
    "INSERT INTO conversations (id, participantAId, participantBId, lastMessageText, lastMessageTimestamp, createdAt, updatedAt) VALUES (?, ?, ?, '', ?, ?, ?)"
  ).run(id, userAId, userBId, now, now, now);
  return findConversationById(id)!;
}

export function findConversationById(id: string): ConversationRow | undefined {
  return db.prepare("SELECT * FROM conversations WHERE id = ?").get(id) as unknown as ConversationRow | undefined;
}

export function findConversationBetween(userAId: string, userBId: string): ConversationRow | undefined {
  return db
    .prepare(
      "SELECT * FROM conversations WHERE (participantAId = ? AND participantBId = ?) OR (participantAId = ? AND participantBId = ?)"
    )
    .get(userAId, userBId, userBId, userAId) as unknown as ConversationRow | undefined;
}

export function listConversationsForUser(userId: string): ConversationRow[] {
  return db
    .prepare(
      "SELECT * FROM conversations WHERE participantAId = ? OR participantBId = ? ORDER BY lastMessageTimestamp DESC"
    )
    .all(userId, userId) as unknown as ConversationRow[];
}

function touchConversation(id: string, lastMessageText: string, lastMessageTimestamp: string) {
  db.prepare("UPDATE conversations SET lastMessageText = ?, lastMessageTimestamp = ?, updatedAt = ? WHERE id = ?").run(
    lastMessageText,
    lastMessageTimestamp,
    lastMessageTimestamp,
    id
  );
}

export interface MessageRow {
  id: string;
  conversationId: string;
  senderId: string;
  text: string;
  timestamp: string;
  isRead: number;
}

export function createMessage(conversationId: string, senderId: string, text: string): MessageRow {
  const id = randomUUID();
  const now = new Date().toISOString();
  db.prepare(
    "INSERT INTO messages (id, conversationId, senderId, text, timestamp, isRead) VALUES (?, ?, ?, ?, ?, 0)"
  ).run(id, conversationId, senderId, text, now);
  touchConversation(conversationId, text, now);
  return findMessageById(id)!;
}

export function findMessageById(id: string): MessageRow | undefined {
  return db.prepare("SELECT * FROM messages WHERE id = ?").get(id) as unknown as MessageRow | undefined;
}

export function listMessagesForConversation(conversationId: string): MessageRow[] {
  return db
    .prepare("SELECT * FROM messages WHERE conversationId = ? ORDER BY timestamp ASC")
    .all(conversationId) as unknown as MessageRow[];
}
