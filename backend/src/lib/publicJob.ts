import type { ApplicationRow, JobRow } from "./db.js";

// Shapes a database job row into the `Job` shape the frontend already
// expects (see types/index.ts `Job`) - the free-form fields live in the
// `data` JSON blob, and the indexed columns (id, companyId, status,
// postedDate) are layered on top so they're always authoritative.
export function toPublicJob(job: JobRow) {
  let data: unknown = {};
  try {
    data = JSON.parse(job.data);
  } catch {
    data = {};
  }

  return {
    ...(typeof data === "object" && data !== null ? data : {}),
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
