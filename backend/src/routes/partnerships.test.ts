import fs from "node:fs";
import path from "node:path";
import { describe, it, expect, beforeAll } from "vitest";
import request from "supertest";

const TEST_DB = path.join(process.cwd(), "data", "test-partnerships.db");
fs.rmSync(TEST_DB, { force: true });
process.env.DB_FILE = TEST_DB;
process.env.JWT_SECRET = "test-secret";

const { createApp } = await import("../app.js");
const { markEmailVerified } = await import("../lib/db.js");
const app = createApp();

async function registerEngineer(email: string, name: string) {
  const res = await request(app).post("/api/auth/register").send({
    email,
    password: "correcthorsebattery",
    role: "Engineer",
    name,
    profileData: {},
  });
  markEmailVerified(res.body.user.id);
  return { token: res.body.token as string, id: res.body.user.id as string };
}

async function registerResourcingCompany(email: string, name: string) {
  const res = await request(app).post("/api/auth/register").send({
    email,
    password: "correcthorsebattery",
    role: "Resourcing Company",
    name,
    profileData: { managedEngineerIds: [] },
  });
  markEmailVerified(res.body.user.id);
  return { token: res.body.token as string, id: res.body.user.id as string };
}

describe("partnership requests", () => {
  it("lets one engineer request another, and the other accept, linking both profiles", async () => {
    const a = await registerEngineer("partner-a@example.com", "Partner A");
    const b = await registerEngineer("partner-b@example.com", "Partner B");

    const requestRes = await request(app)
      .post("/api/partnerships/request")
      .set("Authorization", `Bearer ${a.token}`)
      .send({ partnerEmail: "partner-b@example.com" });

    expect(requestRes.status).toBe(201);
    expect(requestRes.body.status).toBe("pending");
    const requestId = requestRes.body.request.id;

    const acceptRes = await request(app)
      .post(`/api/partnerships/${requestId}/accept`)
      .set("Authorization", `Bearer ${b.token}`);

    expect(acceptRes.status).toBe(200);

    const aProfile = await request(app).get(`/api/users/${a.id}`);
    const bProfile = await request(app).get(`/api/users/${b.id}`);

    expect(aProfile.body.profile.partnerEngineerId).toBe(b.id);
    expect(aProfile.body.profile.partnerStatus).toBe("accepted");
    expect(bProfile.body.profile.partnerEngineerId).toBe(a.id);
    expect(bProfile.body.profile.partnerStatus).toBe("accepted");
  });

  it("only lets the invited engineer accept the request", async () => {
    const a = await registerEngineer("partner-c@example.com", "Partner C");
    const b = await registerEngineer("partner-d@example.com", "Partner D");

    const requestRes = await request(app)
      .post("/api/partnerships/request")
      .set("Authorization", `Bearer ${a.token}`)
      .send({ partnerEmail: "partner-d@example.com" });

    const requestId = requestRes.body.request.id;

    const wrongAccept = await request(app)
      .post(`/api/partnerships/${requestId}/accept`)
      .set("Authorization", `Bearer ${a.token}`);

    expect(wrongAccept.status).toBe(403);
  });

  it("rejects a duplicate pending request between the same two engineers", async () => {
    const a = await registerEngineer("partner-e@example.com", "Partner E");
    await registerEngineer("partner-f@example.com", "Partner F");

    await request(app)
      .post("/api/partnerships/request")
      .set("Authorization", `Bearer ${a.token}`)
      .send({ partnerEmail: "partner-f@example.com" });

    const dupe = await request(app)
      .post("/api/partnerships/request")
      .set("Authorization", `Bearer ${a.token}`)
      .send({ partnerEmail: "partner-f@example.com" });

    expect(dupe.status).toBe(409);
  });

  it("removes the pairing from both sides on /remove", async () => {
    const a = await registerEngineer("partner-g@example.com", "Partner G");
    const b = await registerEngineer("partner-h@example.com", "Partner H");

    const requestRes = await request(app)
      .post("/api/partnerships/request")
      .set("Authorization", `Bearer ${a.token}`)
      .send({ partnerEmail: "partner-h@example.com" });

    await request(app)
      .post(`/api/partnerships/${requestRes.body.request.id}/accept`)
      .set("Authorization", `Bearer ${b.token}`);

    const removeRes = await request(app)
      .post("/api/partnerships/remove")
      .set("Authorization", `Bearer ${a.token}`);

    expect(removeRes.status).toBe(200);

    const bProfile = await request(app).get(`/api/users/${b.id}`);
    expect(bProfile.body.profile.partnerEngineerId).toBeUndefined();
  });
});

describe("company attachment requests", () => {
  it("lets an engineer request to join a resourcing company, and the company approve it", async () => {
    const engineer = await registerEngineer("attach-a@example.com", "Attach Engineer");
    const company = await registerResourcingCompany("attach-co@example.com", "Attach Co");

    const requestRes = await request(app)
      .post("/api/company-attachments/request")
      .set("Authorization", `Bearer ${engineer.token}`)
      .send({ resourcingCompanyId: company.id });

    expect(requestRes.status).toBe(201);
    const requestId = requestRes.body.request.id;

    const pendingRes = await request(app)
      .get("/api/company-attachments/pending")
      .set("Authorization", `Bearer ${company.token}`);

    expect(pendingRes.body.requests).toHaveLength(1);
    expect(pendingRes.body.requests[0].engineer.id).toBe(engineer.id);

    const approveRes = await request(app)
      .post(`/api/company-attachments/${requestId}/approve`)
      .set("Authorization", `Bearer ${company.token}`);

    expect(approveRes.status).toBe(200);

    const engineerProfile = await request(app).get(`/api/users/${engineer.id}`);
    const companyProfile = await request(app).get(`/api/users/${company.id}`);

    expect(engineerProfile.body.profile.resourcingCompanyId).toBe(company.id);
    expect(companyProfile.body.profile.managedEngineerIds).toContain(engineer.id);
  });

  it("only lets the target resourcing company approve or reject its own requests", async () => {
    const engineer = await registerEngineer("attach-b@example.com", "Attach Engineer B");
    const company = await registerResourcingCompany("attach-co-2@example.com", "Attach Co 2");
    const otherCompany = await registerResourcingCompany("attach-co-3@example.com", "Attach Co 3");

    const requestRes = await request(app)
      .post("/api/company-attachments/request")
      .set("Authorization", `Bearer ${engineer.token}`)
      .send({ resourcingCompanyId: company.id });

    const wrongApprove = await request(app)
      .post(`/api/company-attachments/${requestRes.body.request.id}/approve`)
      .set("Authorization", `Bearer ${otherCompany.token}`);

    expect(wrongApprove.status).toBe(403);
  });
});
