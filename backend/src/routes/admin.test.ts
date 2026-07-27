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
const { developmentEmailOutbox } = await import("../lib/email.js");
const app = createApp();

let adminToken: string;
let engineerToken: string;
let engineerId: string;
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
  engineerId = engineer.id;
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

  it("provides administrator-only privacy operations totals", async () => {
    const summary = await request(app)
      .get("/api/admin/privacy-summary")
      .set("Authorization", `Bearer ${adminToken}`);
    expect(summary.status).toBe(200);
    expect(summary.body.summary).toMatchObject({
      pending: expect.any(Number),
      approved: expect.any(Number),
      rejected: expect.any(Number),
      processed: expect.any(Number),
      overduePending: expect.any(Number),
    });
    expect((await request(app).get("/api/admin/privacy-summary")).status).toBe(401);
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
      responseDueAt: expect.any(String),
    });
    expect(queued.body).toMatchObject({ total: 1, limit: 20, offset: 0 });

    const searched = await request(app)
      .get("/api/admin/deletion-requests?query=privacy-engineer&limit=1&offset=0")
      .set("Authorization", `Bearer ${adminToken}`);
    expect(searched.status).toBe(200);
    expect(searched.body.requests).toHaveLength(1);
    expect(searched.body.total).toBe(1);

    const noMatches = await request(app)
      .get("/api/admin/deletion-requests?query=not-a-real-account")
      .set("Authorization", `Bearer ${adminToken}`);
    expect(noMatches.body).toMatchObject({ requests: [], total: 0 });

    const invalidPage = await request(app)
      .get("/api/admin/deletion-requests?limit=1000")
      .set("Authorization", `Bearer ${adminToken}`);
    expect(invalidPage.status).toBe(400);

    const reviewed = await request(app)
      .patch(`/api/admin/deletion-requests/${deletionRequestId}`)
      .set("Authorization", `Bearer ${adminToken}`)
      .send({
        decision: "approved",
        note: "Identity confirmed; retention checks still required.",
        userMessage: "Your request passed our identity and account checks.",
      });
    expect(reviewed.status).toBe(200);
    expect(reviewed.body.request).toMatchObject({
      id: deletionRequestId,
      status: "approved",
      reviewerId: expect.any(String),
      reviewedAt: expect.any(String),
    });
    expect(reviewed.body.processingNotice).toMatch(/No account data has been deleted/);
    expect(reviewed.body.notificationSent).toBe(true);
    expect(developmentEmailOutbox.some((email) =>
      email.to === "privacy-engineer@example.com" && email.subject.includes("approved")
    )).toBe(true);

    const resubmitted = await request(app)
      .post("/api/users/me/deletion-request")
      .set("Authorization", `Bearer ${engineerToken}`)
      .send({ password: "correcthorsebattery" });
    expect(resubmitted.status).toBe(409);
    expect(resubmitted.body.request).toMatchObject({
      reference: deletionRequestId,
      status: "approved",
    });

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
      .send({
        decision: "rejected",
        note: "This should not overwrite the prior review.",
        userMessage: "This request has already received a decision.",
      });
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
      .send({
        decision: "approved",
        note: "Attempt approval while application remains live.",
        userMessage: "Your live application must be resolved before approval.",
      });
    expect(approval.status).toBe(409);
    expect(approval.body.eligibility.eligible).toBe(false);

    const rejection = await request(app)
      .patch(`/api/admin/deletion-requests/${blockedRequest.id}`)
      .set("Authorization", `Bearer ${adminToken}`)
      .send({
        decision: "rejected",
        note: "Resolve the live application before resubmitting.",
        userMessage: "Please resolve your live job application and submit again.",
      });
    expect(rejection.status).toBe(200);
    expect(rejection.body.request.status).toBe("rejected");
  });

  it("requires typed confirmation and anonymises an approved account", async () => {
    const missingConfirmation = await request(app)
      .post(`/api/admin/deletion-requests/${deletionRequestId}/process`)
      .set("Authorization", `Bearer ${adminToken}`)
      .send({ confirmation: "DELETE" });
    expect(missingConfirmation.status).toBe(400);

    const processed = await request(app)
      .post(`/api/admin/deletion-requests/${deletionRequestId}/process`)
      .set("Authorization", `Bearer ${adminToken}`)
      .send({ confirmation: "ANONYMISE ACCOUNT" });
    expect(processed.status).toBe(200);
    expect(processed.body.request).toMatchObject({
      status: "processed",
      processedAt: expect.any(String),
      processorId: expect.any(String),
    });
    expect(developmentEmailOutbox.some((email) =>
      email.to === "privacy-engineer@example.com" && email.subject.includes("anonymised")
    )).toBe(true);

    const account = db.prepare("SELECT * FROM users WHERE id = ?").get(engineerId) as {
      email: string;
      name: string;
      deletedAt: string | null;
      sessionVersion: number;
    };
    expect(account.email).toBe(`deleted+${engineerId}@deleted.techsubbies.invalid`);
    expect(account.name).toBe("Deleted account");
    expect(account.deletedAt).toEqual(expect.any(String));
    expect(account.sessionVersion).toBe(1);

    const oldSession = await request(app)
      .get("/api/users/me")
      .set("Authorization", `Bearer ${engineerToken}`);
    expect(oldSession.status).toBe(401);
  });
});
