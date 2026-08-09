import type { ContractRow } from "./db.js";

function parseJson<T>(value: string | null, fallback: T): T {
  if (!value) return fallback;
  try {
    return JSON.parse(value) as T;
  } catch {
    return fallback;
  }
}

// Shapes a database contract row into the `Contract` shape the frontend
// expects (see types/index.ts `Contract`) - free-form fields live in the
// `data` JSON blob (mirroring toPublicJob), while milestones, timesheets
// and both signatures have their own columns since they change on their
// own independent schedule.
export function toPublicContract(contract: ContractRow) {
  const data = parseJson<Record<string, unknown>>(contract.data, {});

  return {
    schemaVersion: 1 as const,
    ...data,
    id: contract.id,
    jobId: contract.jobId,
    companyId: contract.companyId,
    engineerId: contract.engineerId,
    status: contract.status,
    engineerSignature: parseJson(contract.engineerSignature, null),
    companySignature: parseJson(contract.companySignature, null),
    milestones: parseJson(contract.milestones, []),
    timesheets: parseJson(contract.timesheets, []),
  };
}
