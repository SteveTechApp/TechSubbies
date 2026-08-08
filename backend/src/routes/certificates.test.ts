import fs from "node:fs";
import path from "node:path";
import bcrypt from "bcryptjs";
import { beforeAll, describe, expect, it } from "vitest";
import request from "supertest";

const TEST_DB = path.join(process.cwd(), "data", "test-certificates.db");
const TEST_EVIDENCE_ROOT = path.join(process.cwd(), "data", "test-certificate-evidence");
fs.rmSync(TEST_DB, { force: true });
fs.rmSync(TEST_EVIDENCE_ROOT, { recursive: true, force: true });
process.env.DB_FILE = TEST_DB;
process.env.EVIDENCE_LOCAL_ROOT = TEST_EVIDENCE_ROOT;
process.env.EVIDENCE_STORAGE_PROVIDER = "local";
process.env.JWT_SECRET = "test-secret";
process.env.NODE_ENV = "test";

const { createApp } = await import("../app.js");
const { createUser, markEmailVerified } = await import("../lib/db.js");
const { signToken } = await import("../middleware/auth.js");
const { developmentEmailOutbox } = await import("../lib/email.js");
const app = createApp();

let adminToken: string;

beforeAll(async () => {
  const password = await bcrypt.hash("correcthorsebattery", 10);
  const admin = createUser({
    email: "certificate-admin@example.com",
    password,
    role: "Admin",
    name: "Certificate Admin",
    profile: "{}",
  });
  adminToken = signToken(admin.id);
});

async function register(role: "Engineer" | "Company" | "Resourcing Company", email: string, name: string) {
  const response = await request(app).post("/api/auth/register").send({
    email,
    password: "correcthorsebattery",
    role,
    name,
    profileData: {},
  });
  markEmailVerified(response.body.user.id);
  return { id: response.body.user.id as string, token: response.body.token as string };
}

async function uploadCertificateEvidence(token: string, contents = Buffer.from("certificate-evidence")) {
  const metadata = await request(app)
    .post("/api/evidence")
    .set("Authorization", `Bearer ${token}`)
    .send({
      purpose: "certification",
      fileName: "certificate.pdf",
      contentType: "application/pdf",
      sizeBytes: contents.length,
    });
  expect(metadata.status).toBe(201);

  const upload = await request(app)
    .put(`/api/evidence/${metadata.body.id}/content`)
    .set("Authorization", `Bearer ${token}`)
    .set("Content-Type", "application/pdf")
    .send(contents);
  expect(upload.status).toBe(200);
  return metadata.body.id as string;
}

describe("certificate verification", () => {
  it("keeps marketplace-selected evidence private until an admin verifies it", async () => {
    const engineer = await register("Engineer", "cert-engineer@example.com", "Cert Engineer");
    const company = await register("Company", "cert-company@example.com", "Cert Company");
    const evidenceId = await uploadCertificateEvidence(engineer.token);

    const submitted = await request(app)
      .post("/api/certificates")
      .set("Authorization", `Bearer ${engineer.token}`)
      .send({
        evidenceId,
        name: "CTS-I",
        issuer: "AVIXA",
        certificateNumber: "CTS-I-12345",
        issuedAt: "2026-01-01",
        expiresAt: "2027-01-01",
        visibility: "marketplace",
      });
    expect(submitted.status).toBe(201);
    expect(submitted.body.verificationStatus).toBe("pending");

    const hiddenList = await request(app)
      .get(`/api/certificates/engineer/${engineer.id}`)
      .set("Authorization", `Bearer ${company.token}`);
    expect(hiddenList.status).toBe(200);
    expect(hiddenList.body).toEqual([]);

    const hiddenContent = await request(app)
      .get(`/api/evidence/${evidenceId}/content`)
      .set("Authorization", `Bearer ${company.token}`);
    expect(hiddenContent.status).toBe(403);

    const queue = await request(app)
      .get("/api/admin/certificates")
      .set("Authorization", `Bearer ${adminToken}`);
    expect(queue.status).toBe(200);
    expect(queue.body.certificates).toContainEqual(expect.objectContaining({
      id: submitted.body.id,
      ownerName: "Cert Engineer",
      name: "CTS-I",
      evidenceId,
    }));

    const verified = await request(app)
      .patch(`/api/admin/certificates/${submitted.body.id}/review`)
      .set("Authorization", `Bearer ${adminToken}`)
      .send({ status: "verified", note: "Issuer and certificate number confirmed." });
    expect(verified.status).toBe(200);
    expect(verified.body.certificate.verificationStatus).toBe("verified");
    expect(verified.body.notificationSent).toBe(true);

    const marketplaceList = await request(app)
      .get(`/api/certificates/engineer/${engineer.id}`)
      .set("Authorization", `Bearer ${company.token}`);
    expect(marketplaceList.body).toEqual([
      expect.objectContaining({ name: "CTS-I", visibility: "marketplace", verificationStatus: "verified" }),
    ]);

    const visibleContent = await request(app)
      .get(`/api/evidence/${evidenceId}/content`)
      .set("Authorization", `Bearer ${company.token}`);
    expect(visibleContent.status).toBe(200);
    expect(visibleContent.body.toString()).toBe("certificate-evidence");

    const madePrivate = await request(app)
      .patch(`/api/certificates/${submitted.body.id}/visibility`)
      .set("Authorization", `Bearer ${engineer.token}`)
      .send({ visibility: "private" });
    expect(madePrivate.status).toBe(200);

    expect((await request(app)
      .get(`/api/evidence/${evidenceId}/content`)
      .set("Authorization", `Bearer ${company.token}`)).status).toBe(403);
  });

  it("prevents expired verified certificates from exposing evidence and sends expiry reminders", async () => {
    const engineer = await register("Engineer", "expired-cert@example.com", "Expired Cert");
    const company = await register("Company", "expired-cert-company@example.com", "Expired Viewer");
    const evidenceId = await uploadCertificateEvidence(engineer.token, Buffer.from("expired-evidence"));

    const submitted = await request(app)
      .post("/api/certificates")
      .set("Authorization", `Bearer ${engineer.token}`)
      .send({
        evidenceId,
        name: "Legacy Vendor Certification",
        issuer: "Vendor",
        issuedAt: "2024-01-01",
        expiresAt: "2025-01-01",
        visibility: "marketplace",
      });

    expect((await request(app)
      .patch(`/api/admin/certificates/${submitted.body.id}/review`)
      .set("Authorization", `Bearer ${adminToken}`)
      .send({ status: "verified", note: "Historic certificate record confirmed." })).status).toBe(200);

    const visible = await request(app)
      .get(`/api/certificates/engineer/${engineer.id}`)
      .set("Authorization", `Bearer ${company.token}`);
    expect(visible.body).toEqual([]);
    expect((await request(app)
      .get(`/api/evidence/${evidenceId}/content`)
      .set("Authorization", `Bearer ${company.token}`)).status).toBe(403);

    const before = developmentEmailOutbox.length;
    const sweep = await request(app)
      .post("/api/admin/certificates/expiry-reminders/run")
      .set("Authorization", `Bearer ${adminToken}`);
    expect(sweep.status).toBe(200);
    expect(sweep.body.sent).toBeGreaterThanOrEqual(1);
    expect(developmentEmailOutbox.length).toBeGreaterThan(before);
    expect(developmentEmailOutbox.at(-1)?.subject).toMatch(/Certificate expired/i);
  });

  it("requires a meaningful reason when a certificate is rejected", async () => {
    const engineer = await register("Engineer", "rejected-cert@example.com", "Rejected Cert");
    const evidenceId = await uploadCertificateEvidence(engineer.token, Buffer.from("rejected-evidence"));
    const submitted = await request(app)
      .post("/api/certificates")
      .set("Authorization", `Bearer ${engineer.token}`)
      .send({ evidenceId, name: "Vendor Level 2", issuer: "Vendor", visibility: "private" });

    const short = await request(app)
      .patch(`/api/admin/certificates/${submitted.body.id}/review`)
      .set("Authorization", `Bearer ${adminToken}`)
      .send({ status: "rejected", note: "No" });
    expect(short.status).toBe(400);

    const rejected = await request(app)
      .patch(`/api/admin/certificates/${submitted.body.id}/review`)
      .set("Authorization", `Bearer ${adminToken}`)
      .send({ status: "rejected", note: "Certificate number could not be independently confirmed." });
    expect(rejected.status).toBe(200);
    expect(rejected.body.certificate.verificationStatus).toBe("rejected");
  });
});
