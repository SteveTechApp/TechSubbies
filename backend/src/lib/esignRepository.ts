import { randomUUID } from "node:crypto";
import { db } from "./db.js";

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

export function checkEsignRepository(): boolean {
  const requestTable = db.prepare("SELECT name FROM sqlite_master WHERE type = 'table' AND name = 'contract_esign_requests'").get();
  const eventTable = db.prepare("SELECT name FROM sqlite_master WHERE type = 'table' AND name = 'contract_esign_events'").get();
  return Boolean(requestTable && eventTable);
}

export function findContractEsignRequest(contractId: string): ContractEsignRequestRow | undefined {
  return db.prepare("SELECT * FROM contract_esign_requests WHERE contractId = ?").get(contractId) as unknown as ContractEsignRequestRow | undefined;
}

export function findEsignRequestByProviderId(providerRequestId: string): ContractEsignRequestRow | undefined {
  return db.prepare("SELECT * FROM contract_esign_requests WHERE providerRequestId = ?").get(providerRequestId) as unknown as ContractEsignRequestRow | undefined;
}

export function createContractEsignRequest(input: {
  contractId: string;
  provider: string;
  providerRequestId: string;
  engineerSignatureId: string;
  companySignatureId: string;
}) {
  const now = new Date().toISOString();
  db.prepare(`
    INSERT INTO contract_esign_requests (
      contractId, provider, providerRequestId, engineerSignatureId,
      companySignatureId, status, createdAt, updatedAt
    ) VALUES (?, ?, ?, ?, ?, 'awaiting_signatures', ?, ?)
  `).run(
    input.contractId,
    input.provider,
    input.providerRequestId,
    input.engineerSignatureId,
    input.companySignatureId,
    now,
    now
  );
  return findContractEsignRequest(input.contractId)!;
}

export function updateContractEsignStatus(contractId: string, status: string) {
  db.prepare("UPDATE contract_esign_requests SET status = ?, updatedAt = ? WHERE contractId = ?")
    .run(status, new Date().toISOString(), contractId);
  return findContractEsignRequest(contractId);
}

export function recordContractEsignEvent(input: {
  eventKey: string;
  providerRequestId: string;
  eventType: string;
  signatureId?: string | null;
}): boolean {
  try {
    db.prepare(`
      INSERT INTO contract_esign_events (id, eventKey, providerRequestId, eventType, signatureId, createdAt)
      VALUES (?, ?, ?, ?, ?, ?)
    `).run(
      randomUUID(),
      input.eventKey,
      input.providerRequestId,
      input.eventType,
      input.signatureId ?? null,
      new Date().toISOString()
    );
    return true;
  } catch (error) {
    if (error instanceof Error && /UNIQUE constraint failed/.test(error.message)) return false;
    throw error;
  }
}
