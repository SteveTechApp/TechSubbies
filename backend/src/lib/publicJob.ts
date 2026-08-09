import type { ApplicationRow, JobRow } from "./db.js";
import { canonicalizeRoleId } from "./canonicalRoles.js";

// Shapes a database job row into the `Job` shape the frontend already
// expects (see types/index.ts `Job`) - the free-form fields live in the
// `data` JSON blob, and the indexed columns (id, companyId, status,
// postedDate) are layered on top so they're always authoritative.
export function toPublicJob(job: JobRow) {
  let data: Record<string, unknown> = {};
  try {
    const parsed = JSON.parse(job.data);
    data = typeof parsed === "object" && parsed !== null ? parsed as Record<string, unknown> : {};
  } catch {
    data = {};
  }

  const canonicalRoleId = canonicalizeRoleId(data.canonicalRoleId || data.jobRole);

  return {
    ...data,
    ...(canonicalRoleId ? { canonicalRoleId } : {}),
    id: job.id,
    companyId: job.companyId,
    status: job.status,
    postedDate: job.postedDate,
  };
}

// Shapes a database application row into the `Application` shape the
// frontend expects (see types/index.ts `Application`).
export function toPublicApplication(application: ApplicationRow) {
  return {
    id: application.id,
    jobId: application.jobId,
    engineerId: application.engineerId,
    date: application.createdAt,
    status: application.status,
    reviewed: Boolean(application.reviewed),
  };
}
