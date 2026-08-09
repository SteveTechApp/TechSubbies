import { randomUUID } from "node:crypto";
import { database, db } from "./db.js";

export type ContractEsignRequestRow = {
  contractId: string;
  provider: string;
  providerRequestId: string;
  engineerSignatureId: string;
  companySignatureId: string;
  status: string;
  createdAt: string;
  updatedAt: string;
};

export type ContractEsignEventRow = {
  id: string;
  eventKey: string;
  providerRequestId: string;
  eventType: string;
  signatureId: string | null;
  createdAt: string;
};

db.exec(`
  CREATE TABLE IF NOT EXISTS contract_esign_requests (
    contractId TEXT PRIMARY KEY,
    provider TEXT NOT NULL,
    providerRequestId TEXT NOT NULL UNIQUE,
    engineerSignatureId TEXT NOT NULL,
    companySignatureId TEXT NOT NULL,
    status TEXT NOT NULL,
    createdAt TEXT NOT NULL,
    updatedAt TEXT NOT NULL,
    FOREIGN KEY(contractId) REFERENCES contracts(id) ON DELETE CASCADE
  );
  CREATE INDEX IF NOT EXISTS contract_esign_requests_provider_request
    ON contract_esign_requests(providerRequestId);

  CREATE TABLE IF NOT EXISTS contract_esign_events (
    id TEXT PRIMARY KEY,
    eventKey TEXT NOT NULL UNIQUE,
    providerRequestId TEXT NOT NULL,
    eventType TEXT NOT NULL,
    signatureId TEXT,
    createdAt TEXT NOT NULL
  );
  CREATE INDEX IF NOT EXISTS contract_esign_events_request_created
    ON contract_esign_events(providerRequestId, createdAt DESC);
`);

export async function checkEsignRepository(): Promise<boolean> {
  const tables = await Promise.all([
    database.tableExists("contract_esign_requests"),
    database.tableExists("contract_esign_events"),
  ]);
  return tables.every(Boolean);
}

export function findContractEsignRequest(contractId: string): Promise<ContractEsignRequestRow | undefined> {
  return database.queryOne<ContractEsignRequestRow>("SELECT * FROM contract_esign_requests WHERE contractId = ?", [contractId]);
}

export function findEsignRequestByProviderId(providerRequestId: string): Promise<ContractEsignRequestRow | undefined> {
  return database.queryOne<ContractEsignRequestRow>("SELECT * FROM contract_esign_requests WHERE providerRequestId = ?", [providerRequestId]);
}

export async function createContractEsignRequest(input: {
  contractId: string;
  provider: string;
  providerRequestId: string;
  engineerSignatureId: string;
  companySignatureId: string;
}) {
  const now = new Date().toISOString();
  await database.execute(`
    INSERT INTO contract_esign_requests (
      contractId, provider, providerRequestId, engineerSignatureId,
      companySignatureId, status, createdAt, updatedAt
    ) VALUES (?, ?, ?, ?, ?, 'awaiting_signatures', ?, ?)
  `, [input.contractId, input.provider, input.providerRequestId,
    input.engineerSignatureId, input.companySignatureId, now, now]);
  return (await findContractEsignRequest(input.contractId))!;
}

export async function updateContractEsignStatus(contractId: string, status: string) {
  await database.execute(
    "UPDATE contract_esign_requests SET status = ?, updatedAt = ? WHERE contractId = ?",
    [status, new Date().toISOString(), contractId]
  );
  return findContractEsignRequest(contractId);
}

export async function recordContractEsignEvent(input: {
  eventKey: string;
  providerRequestId: string;
  eventType: string;
  signatureId?: string | null;
}): Promise<boolean> {
  try {
    await database.execute(`
      INSERT INTO contract_esign_events (id, eventKey, providerRequestId, eventType, signatureId, createdAt)
      VALUES (?, ?, ?, ?, ?, ?)
    `, [randomUUID(), input.eventKey, input.providerRequestId, input.eventType,
      input.signatureId ?? null, new Date().toISOString()]);
    return true;
  } catch (error) {
    if (error instanceof Error && /UNIQUE constraint failed/.test(error.message)) return false;
    throw error;
  }
}
