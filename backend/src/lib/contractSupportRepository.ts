import { randomUUID } from "node:crypto";
import { db, findContractById } from "./db.js";

export type ContractSupportCaseType =
  | "cancellation"
  | "substitution"
  | "no_show"
  | "dispute"
  | "support";

export type ContractSupportCaseStatus =
  | "awaiting_other_party"
  | "under_review"
  | "resolved"
  | "withdrawn";

export type ContractSupportCaseRow = {
  id: string;
  contractId: string;
  caseType: ContractSupportCaseType;
  status: ContractSupportCaseStatus;
  openedById: string;
  counterpartyId: string;
  proposedEngineerId: string | null;
  summary: string;
  details: string;
  resolution: string | null;
  resolvedById: string | null;
  createdAt: string;
  updatedAt: string;
};

export type ContractSupportEventRow = {
  id: string;
  caseId: string;
  actorId: string;
  eventType: string;
  note: string | null;
  createdAt: string;
};

db.exec(`
  CREATE TABLE IF NOT EXISTS contract_support_cases (
    id TEXT PRIMARY KEY,
    contractId TEXT NOT NULL,
    caseType TEXT NOT NULL,
    status TEXT NOT NULL,
    openedById TEXT NOT NULL,
    counterpartyId TEXT NOT NULL,
    proposedEngineerId TEXT,
    summary TEXT NOT NULL,
    details TEXT NOT NULL,
    resolution TEXT,
    resolvedById TEXT,
    createdAt TEXT NOT NULL,
    updatedAt TEXT NOT NULL,
    FOREIGN KEY(contractId) REFERENCES contracts(id) ON DELETE CASCADE,
    FOREIGN KEY(openedById) REFERENCES users(id),
    FOREIGN KEY(counterpartyId) REFERENCES users(id),
    FOREIGN KEY(proposedEngineerId) REFERENCES users(id),
    FOREIGN KEY(resolvedById) REFERENCES users(id)
  );
  CREATE INDEX IF NOT EXISTS contract_support_cases_contract
    ON contract_support_cases(contractId, createdAt DESC);
  CREATE INDEX IF NOT EXISTS contract_support_cases_status
    ON contract_support_cases(status, updatedAt DESC);

  CREATE TABLE IF NOT EXISTS contract_support_events (
    id TEXT PRIMARY KEY,
    caseId TEXT NOT NULL,
    actorId TEXT NOT NULL,
    eventType TEXT NOT NULL,
    note TEXT,
    createdAt TEXT NOT NULL,
    FOREIGN KEY(caseId) REFERENCES contract_support_cases(id) ON DELETE CASCADE,
    FOREIGN KEY(actorId) REFERENCES users(id)
  );
  CREATE INDEX IF NOT EXISTS contract_support_events_case
    ON contract_support_events(caseId, createdAt ASC);
`);

export function checkContractSupportRepository(): boolean {
  const row = db.prepare(`
    SELECT COUNT(*) AS total
    FROM sqlite_master
    WHERE type = 'table' AND name IN ('contract_support_cases', 'contract_support_events')
  `).get() as { total: number };
  return row.total === 2;
}

export function createContractSupportCase(input: {
  contractId: string;
  caseType: ContractSupportCaseType;
  openedById: string;
  counterpartyId: string;
  proposedEngineerId?: string | null;
  summary: string;
  details: string;
}): ContractSupportCaseRow {
  const id = randomUUID();
  const now = new Date().toISOString();
  const status: ContractSupportCaseStatus =
    input.caseType === "cancellation" || input.caseType === "substitution"
      ? "awaiting_other_party"
      : "under_review";
  db.prepare(`
    INSERT INTO contract_support_cases (
      id, contractId, caseType, status, openedById, counterpartyId,
      proposedEngineerId, summary, details, resolution, resolvedById,
      createdAt, updatedAt
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, NULL, NULL, ?, ?)
  `).run(
    id,
    input.contractId,
    input.caseType,
    status,
    input.openedById,
    input.counterpartyId,
    input.proposedEngineerId || null,
    input.summary,
    input.details,
    now,
    now
  );
  addContractSupportEvent({
    caseId: id,
    actorId: input.openedById,
    eventType: "case.opened",
    note: input.details,
  });
  return findContractSupportCaseById(id)!;
}

export function findContractSupportCaseById(id: string): ContractSupportCaseRow | undefined {
  return db.prepare("SELECT * FROM contract_support_cases WHERE id = ?").get(id) as unknown as
    | ContractSupportCaseRow
    | undefined;
}

export function listContractSupportEvents(caseId: string): ContractSupportEventRow[] {
  return db.prepare(
    "SELECT * FROM contract_support_events WHERE caseId = ? ORDER BY createdAt ASC"
  ).all(caseId) as unknown as ContractSupportEventRow[];
}

export function addContractSupportEvent(input: {
  caseId: string;
  actorId: string;
  eventType: string;
  note?: string | null;
}) {
  const event: ContractSupportEventRow = {
    id: randomUUID(),
    caseId: input.caseId,
    actorId: input.actorId,
    eventType: input.eventType,
    note: input.note || null,
    createdAt: new Date().toISOString(),
  };
  db.prepare(`
    INSERT INTO contract_support_events (id, caseId, actorId, eventType, note, createdAt)
    VALUES (?, ?, ?, ?, ?, ?)
  `).run(event.id, event.caseId, event.actorId, event.eventType, event.note, event.createdAt);
  return event;
}

export function listContractSupportCasesForUser(userId: string): ContractSupportCaseRow[] {
  return db.prepare(`
    SELECT support.*
    FROM contract_support_cases support
    JOIN contracts ON contracts.id = support.contractId
    WHERE contracts.companyId = ? OR contracts.engineerId = ?
    ORDER BY support.updatedAt DESC
  `).all(userId, userId) as unknown as ContractSupportCaseRow[];
}

export function listContractSupportCasesForContract(contractId: string): ContractSupportCaseRow[] {
  return db.prepare(`
    SELECT * FROM contract_support_cases
    WHERE contractId = ? ORDER BY updatedAt DESC
  `).all(contractId) as unknown as ContractSupportCaseRow[];
}

export function listAdminContractSupportCases(status?: ContractSupportCaseStatus): ContractSupportCaseRow[] {
  if (status) {
    return db.prepare(`
      SELECT * FROM contract_support_cases
      WHERE status = ? ORDER BY updatedAt ASC
    `).all(status) as unknown as ContractSupportCaseRow[];
  }
  return db.prepare(`
    SELECT * FROM contract_support_cases
    ORDER BY
      CASE status WHEN 'under_review' THEN 0 WHEN 'awaiting_other_party' THEN 1 ELSE 2 END,
      updatedAt ASC
  `).all() as unknown as ContractSupportCaseRow[];
}

export function respondToContractSupportCase(input: {
  caseId: string;
  actorId: string;
  decision: "accept" | "decline";
  note: string;
}): ContractSupportCaseRow | undefined {
  const supportCase = findContractSupportCaseById(input.caseId);
  if (!supportCase || supportCase.status !== "awaiting_other_party") return undefined;
  if (supportCase.counterpartyId !== input.actorId) return undefined;

  const now = new Date().toISOString();
  let nextStatus: ContractSupportCaseStatus = "under_review";
  let resolution: string | null = null;
  let resolvedById: string | null = null;

  if (supportCase.caseType === "cancellation" && input.decision === "accept") {
    const contract = findContractById(supportCase.contractId);
    if (!contract) return undefined;
    db.prepare("UPDATE contracts SET status = 'Cancelled', updatedAt = ? WHERE id = ?")
      .run(now, supportCase.contractId);
    nextStatus = "resolved";
    resolution = "Both contract parties agreed to cancel the engagement. TechSubbies recorded the cancellation; any invoicing or financial settlement remains between the parties.";
    resolvedById = input.actorId;
  }

  db.prepare(`
    UPDATE contract_support_cases
    SET status = ?, resolution = ?, resolvedById = ?, updatedAt = ?
    WHERE id = ?
  `).run(nextStatus, resolution, resolvedById, now, supportCase.id);
  addContractSupportEvent({
    caseId: supportCase.id,
    actorId: input.actorId,
    eventType: input.decision === "accept" ? "party.accepted" : "party.declined",
    note: input.note,
  });
  return findContractSupportCaseById(supportCase.id);
}

export function withdrawContractSupportCase(input: {
  caseId: string;
  actorId: string;
  note?: string;
}): ContractSupportCaseRow | undefined {
  const supportCase = findContractSupportCaseById(input.caseId);
  if (!supportCase || supportCase.openedById !== input.actorId) return undefined;
  if (supportCase.status === "resolved" || supportCase.status === "withdrawn") return undefined;
  const now = new Date().toISOString();
  db.prepare(`
    UPDATE contract_support_cases
    SET status = 'withdrawn', resolution = ?, resolvedById = ?, updatedAt = ?
    WHERE id = ?
  `).run("Withdrawn by the person who opened the case.", input.actorId, now, supportCase.id);
  addContractSupportEvent({
    caseId: supportCase.id,
    actorId: input.actorId,
    eventType: "case.withdrawn",
    note: input.note || null,
  });
  return findContractSupportCaseById(supportCase.id);
}

export function resolveContractSupportCase(input: {
  caseId: string;
  administratorId: string;
  resolution: string;
}): ContractSupportCaseRow | undefined {
  const supportCase = findContractSupportCaseById(input.caseId);
  if (!supportCase || supportCase.status === "resolved" || supportCase.status === "withdrawn") return undefined;
  const now = new Date().toISOString();
  db.prepare(`
    UPDATE contract_support_cases
    SET status = 'resolved', resolution = ?, resolvedById = ?, updatedAt = ?
    WHERE id = ?
  `).run(input.resolution, input.administratorId, now, supportCase.id);
  addContractSupportEvent({
    caseId: supportCase.id,
    actorId: input.administratorId,
    eventType: "case.resolved",
    note: input.resolution,
  });
  return findContractSupportCaseById(supportCase.id);
}

export function reopenContractSupportCaseForReview(input: {
  caseId: string;
  administratorId: string;
  note: string;
}): ContractSupportCaseRow | undefined {
  const supportCase = findContractSupportCaseById(input.caseId);
  if (!supportCase || supportCase.status === "withdrawn") return undefined;
  db.prepare(`
    UPDATE contract_support_cases
    SET status = 'under_review', resolution = NULL, resolvedById = NULL, updatedAt = ?
    WHERE id = ?
  `).run(new Date().toISOString(), supportCase.id);
  addContractSupportEvent({
    caseId: supportCase.id,
    actorId: input.administratorId,
    eventType: "case.reopened",
    note: input.note,
  });
  return findContractSupportCaseById(supportCase.id);
}
