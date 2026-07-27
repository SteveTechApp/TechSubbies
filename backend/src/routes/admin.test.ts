import fs from "node:fs";
import path from "node:path";
import bcrypt from "bcryptjs";
import { beforeAll, describe, expect, it } from "vitest";
import request from "supertest";

const TEST_DB = path.join(process.cwd(), "data", "test-admin.db");
fs.rmSync(TEST_DB, { force: true });
process.env.DB_FILE = TEST_DB;
process.env.JWT_SECRET = "test-secret";

const { createApp } = await import("../app.js");
const { createUser } = await import("../lib/db.js");
const { db } = await import("../lib/db.js");
const { requestAccountDeletion } = await import("../lib/accountDeletion.js");
const { signToken } = await import("../middleware/auth.js");
const app = createApp();

let adminToken: string;
let engineerToken: string;
let deletionRequestId: string;

beforeAll(async () => {
  const password = await bcrypt.hash("correcthorsebattery", 10);
  const engineer = createUser({
    email: "privacy-engineer@example.com",
    password,
    role: "Engineer",
    name: "Privacy Engineer",
    profile: "{}",
  });
  const admin = createUser({
    email: "privacy-admin@example.com",
    password,
    role: "Admin",
    name: "Privacy Admin",
    profile: "{}",
  });
  engineerToken = signToken(engineer.id);
  adminToken = signToken(admin.id);
  deletionRequestId = requestAccountDeletion(engineer.id).id;
});

describe("admin deletion request reviews", () => {
  it("keeps the privacy queue restricted to administrators", async () => {
    expect((await request(app).get("/api/admin/deletion-requests")).status).toBe(401);
    expect((await request(app)
      .get("/api/admin/deletion-requests")
      .set("Authorization", `Bearer ${engineerToken}`)).status).toBe(403);
  });

  it("lists pending requests and records a non-destructive decision", async () => {
    const queued = await request(app)
      .get("/api/admin/deletion-requests")
      .set("Authorization", `Bearer ${adminToken}`);
    expect(queued.status).toBe(200);
    expect(queued.body.requests[0]).toMatchObject({
      id: deletionRequestId,
      status: "pending",
      accountEmail: "privacy-engineer@example.com",
    });

    const reviewed = await request(app)
      .patch(`/api/admin/deletion-requests/${deletionRequestId}`)
      .set("Authorization", `Bearer ${adminToken}`)
      .send({ decision: "approved", note: "Identity confirmed; retention checks still required." });
    expect(reviewed.status).toBe(200);
    expect(reviewed.body.request).toMatchObject({
      id: deletionRequestId,
      status: "approved",
      reviewerId: expect.any(String),
      reviewedAt: expect.any(String),
    });
    expect(reviewed.body.processingNotice).toMatch(/No account data has been deleted/);

    const pending = await request(app)
      .get("/api/admin/deletion-requests")
      .set("Authorization", `Bearer ${adminToken}`);
    expect(pending.body.requests).toHaveLength(0);
  });

  it("rejects invalid and duplicate review decisions", async () => {
    const invalid = await request(app)
      .patch(`/api/admin/deletion-requests/${deletionRequestId}`)
      .set("Authorization", `Bearer ${adminToken}`)
      .send({ decision: "delete", note: "Immediately delete everything." });
    expect(invalid.status).toBe(400);

    const duplicate = await request(app)
      .patch(`/api/admin/deletion-requests/${deletionRequestId}`)
      .set("Authorization", `Bearer ${adminToken}`)
      .send({ decision: "rejected", note: "This should not overwrite the prior review." });
    expect(duplicate.status).toBe(409);
  });

  it("blocks approval while marketplace obligations remain but permits rejection", async () => {
    const password = await bcrypt.hash("correcthorsebattery", 10);
    const blockedUser = createUser({
      email: "blocked-privacy@example.com",
      password,
      role: "Engineer",
      name: "Blocked Privacy User",
      profile: "{}",
    });
    const blockedRequest = requestAccountDeletion(blockedUser.id);
    const now = new Date().toISOString();
    db.prepare(`
      INSERT INTO applications
        (id, jobId, engineerId, status, reviewed, createdAt, updatedAt)
      VALUES ('blocking-application', 'job-privacy', ?, 'Applied', 0, ?, ?)
    `).run(blockedUser.id, now, now);

    const queue = await request(app)
      .get("/api/admin/deletion-requests")
      .set("Authorization", `Bearer ${adminToken}`);
    const queued = queue.body.requests.find((item: { id: string }) => item.id === blockedRequest.id);
    expect(queued.eligibility).toMatchObject({
      eligible: false,
      blockers: [expect.objectContaining({ code: "LIVE_APPLICATIONS", count: 1 })],
    });

    const approval = await request(app)
      .patch(`/api/admin/deletion-requests/${blockedRequest.id}`)
      .set("Authorization", `Bearer ${adminToken}`)
      .send({ decision: "approved", note: "Attempt approval while application remains live." });
    expect(approval.status).toBe(409);
    expect(approval.body.eligibility.eligible).toBe(false);

    const rejection = await request(app)
      .patch(`/api/admin/deletion-requests/${blockedRequest.id}`)
      .set("Authorization", `Bearer ${adminToken}`)
      .send({ decision: "rejected", note: "Resolve the live application before resubmitting." });
    expect(rejection.status).toBe(200);
    expect(rejection.body.request.status).toBe("rejected");
  });
});
