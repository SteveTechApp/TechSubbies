import fs from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import request from "supertest";

const TEST_DB = path.join(process.cwd(), "data", "test-evidence.db");
const TEST_STORAGE = path.join(process.cwd(), "data", "test-private-evidence");
fs.rmSync(TEST_DB, { force: true });
fs.rmSync(TEST_STORAGE, { force: true, recursive: true });
process.env.DB_FILE = TEST_DB;
process.env.JWT_SECRET = "test-secret";
process.env.EVIDENCE_STORAGE_PROVIDER = "local";
process.env.EVIDENCE_LOCAL_ROOT = TEST_STORAGE;

const { createApp } = await import("../app.js");
const { createUser, markEmailVerified } = await import("../lib/db.js");
const { signToken } = await import("../middleware/auth.js");
const { listEvidenceAccessEvents } = await import("../lib/evidenceRepository.js");
const app = createApp();

async function registerEngineer(email: string, name: string, verified = true) {
  const response = await request(app).post("/api/auth/register").send({
    email,
    password: "correcthorsebattery",
    role: "Engineer",
    name,
    profileData: {},
  });
  if (verified) markEmailVerified(response.body.user.id);
  return { token: response.body.token as string, id: response.body.user.id as string };
}

function createAdmin() {
  const admin = createUser({
    email: "evidence-admin@example.com",
    password: "not-used-by-this-test",
    role: "Admin",
    name: "Evidence Admin",
    profile: "{}",
  });
  markEmailVerified(admin.id);
  return { id: admin.id, token: signToken(admin.id) };
}

describe("private evidence storage", () => {
  it("requires verified engineers before evidence metadata can be created", async () => {
    const engineer = await registerEngineer("evidence-unverified@example.com", "Unverified", false);
    const response = await request(app)
      .post("/api/evidence")
      .set("Authorization", `Bearer ${engineer.token}`)
      .send({
        purpose: "certification",
        fileName: "certificate.pdf",
        contentType: "application/pdf",
        sizeBytes: 20,
      });

    expect(response.status).toBe(403);
    expect(response.body.code).toBe("EMAIL_VERIFICATION_REQUIRED");
  });

  it("keeps uploaded evidence private and records owner, denied and admin access", async () => {
    const owner = await registerEngineer("evidence-owner@example.com", "Evidence Owner");
    const otherEngineer = await registerEngineer("evidence-other@example.com", "Other Engineer");
    const admin = createAdmin();
    const file = Buffer.from("%PDF-1.4 private evidence file", "utf8");

    const created = await request(app)
      .post("/api/evidence")
      .set("Authorization", `Bearer ${owner.token}`)
      .send({
        purpose: "certification",
        fileName: "CTS certificate.pdf",
        contentType: "application/pdf",
        sizeBytes: file.length,
      });

    expect(created.status).toBe(201);
    expect(created.body).toEqual(expect.objectContaining({
      purpose: "certification",
      fileName: "CTS certificate.pdf",
      status: "pending",
    }));
    expect(created.body.objectKey).toBeUndefined();

    const uploaded = await request(app)
      .put(`/api/evidence/${created.body.id}/content`)
      .set("Authorization", `Bearer ${owner.token}`)
      .set("Content-Type", "application/pdf")
      .send(file);

    expect(uploaded.status).toBe(200);
    expect(uploaded.body.status).toBe("ready");
    expect(uploaded.body.sha256).toMatch(/^[a-f0-9]{64}$/);

    const mine = await request(app)
      .get("/api/evidence/mine")
      .set("Authorization", `Bearer ${owner.token}`);
    expect(mine.status).toBe(200);
    expect(mine.body).toEqual([
      expect.objectContaining({ id: created.body.id, status: "ready" }),
    ]);

    const denied = await request(app)
      .get(`/api/evidence/${created.body.id}/content`)
      .set("Authorization", `Bearer ${otherEngineer.token}`);
    expect(denied.status).toBe(403);
    expect(denied.body.error).toMatch(/private/i);

    const ownerDownload = await request(app)
      .get(`/api/evidence/${created.body.id}/content`)
      .set("Authorization", `Bearer ${owner.token}`)
      .buffer(true);
    expect(ownerDownload.status).toBe(200);
    expect(ownerDownload.headers["cache-control"]).toBe("private, no-store");
    expect(ownerDownload.headers["content-disposition"]).toContain("CTS%20certificate.pdf");

    const adminDownload = await request(app)
      .get(`/api/evidence/${created.body.id}/content`)
      .set("Authorization", `Bearer ${admin.token}`)
      .buffer(true);
    expect(adminDownload.status).toBe(200);

    const audit = await request(app)
      .get(`/api/evidence/${created.body.id}/audit`)
      .set("Authorization", `Bearer ${admin.token}`);
    expect(audit.status).toBe(200);
    expect(audit.body).toEqual(expect.arrayContaining([
      expect.objectContaining({ action: "metadata.created", outcome: "success", actorUserId: owner.id }),
      expect.objectContaining({ action: "content.uploaded", outcome: "success", actorUserId: owner.id }),
      expect.objectContaining({ action: "content.access_denied", outcome: "denied", actorUserId: otherEngineer.id }),
      expect.objectContaining({ action: "content.accessed", outcome: "success", actorUserId: owner.id }),
      expect.objectContaining({ action: "content.accessed", outcome: "success", actorUserId: admin.id }),
    ]));

    const storedEvents = listEvidenceAccessEvents(created.body.id);
    expect(storedEvents.length).toBeGreaterThanOrEqual(5);
  });
});
