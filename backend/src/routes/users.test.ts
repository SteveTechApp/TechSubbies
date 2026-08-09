import path from "node:path";
import { randomUUID } from "node:crypto";
import { describe, it, expect, beforeAll } from "vitest";
import request from "supertest";

const TEST_DB = path.join(process.cwd(), "data", `test-users-${randomUUID()}.db`);
process.env.DB_FILE = TEST_DB;
process.env.JWT_SECRET = "test-secret";

const { createApp } = await import("../app.js");
const app = createApp();
const { developmentEmailOutbox } = await import("../lib/email.js");

let token: string;
let userId: string;

beforeAll(async () => {
  const res = await request(app).post("/api/auth/register").send({
    email: "carol@example.com",
    password: "correcthorsebattery",
    role: "Engineer",
    name: "Carol Example",
    profileData: { minDayRate: 150 },
  });
  token = res.body.token;
  userId = res.body.user.id;
});

describe("GET /api/users", () => {
  it("lists registered profiles", async () => {
    const res = await request(app).get("/api/users");
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.some((u: any) => u.id === userId)).toBe(true);
    const listed = res.body.find((u: any) => u.id === userId);
    expect(listed.profile.contact).toBeUndefined();
    expect(res.headers["x-total-count"]).toBeTruthy();
  });

  it("bounds and offsets directory results", async () => {
    const res = await request(app).get("/api/users?limit=1&offset=0");
    expect(res.status).toBe(200);
    expect(res.body).toHaveLength(1);
  });
});

describe("GET /api/users/:profileId", () => {
  it("returns a single profile", async () => {
    const res = await request(app).get(`/api/users/${userId}`);
    expect(res.status).toBe(200);
    expect(res.body.profile.name).toBe("Carol Example");
    expect(res.body.profile.contact?.email).toBeUndefined();
  });

  it("404s for an id that doesn't exist", async () => {
    const res = await request(app).get("/api/users/does-not-exist");
    expect(res.status).toBe(404);
  });
});

describe("GET /api/users/me", () => {
  it("returns the authenticated account for a valid server-issued token", async () => {
    const res = await request(app).get("/api/users/me").set("Authorization", `Bearer ${token}`);
    expect(res.status).toBe(200);
    expect(res.body.id).toBe(userId);
    expect(res.body.role).toBe("Engineer");
    expect(res.body.profile.contact.email).toBe("carol@example.com");
  });

  it("rejects a missing or invalid session", async () => {
    const missing = await request(app).get("/api/users/me");
    expect(missing.status).toBe(401);

    const invalid = await request(app)
      .get("/api/users/me")
      .set("Authorization", "Bearer forged-token");
    expect(invalid.status).toBe(401);
  });
});

describe("GET /api/users/me/export", () => {
  it("exports owned account data without credentials or internal audit hashes", async () => {
    const res = await request(app)
      .get("/api/users/me/export")
      .set("Authorization", `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.headers["content-disposition"]).toMatch(/techsubbies-account-\d{4}-\d{2}-\d{2}\.json/);
    expect(res.body).toMatchObject({
      format: "techsubbies-account-export",
      version: 2,
      account: { id: userId, role: "Engineer" },
      marketplace: {
        jobs: expect.any(Array),
        applications: expect.any(Array),
        contracts: expect.any(Array),
        partnerships: expect.any(Array),
        conversations: expect.any(Array),
      },
      securityActivity: expect.any(Array),
    });
    const serialized = JSON.stringify(res.body);
    expect(serialized).not.toContain("correcthorsebattery");
    expect(serialized).not.toContain('"password"');
    expect(serialized).not.toContain("subjectHash");
  });

  it("requires a valid account session", async () => {
    expect((await request(app).get("/api/users/me/export")).status).toBe(401);
  });
});

describe("account deletion requests", () => {
  it("requires password confirmation, creates a pending request and allows cancellation", async () => {
    const wrongPassword = await request(app)
      .post("/api/users/me/deletion-request")
      .set("Authorization", `Bearer ${token}`)
      .send({ password: "wrong-password" });
    expect(wrongPassword.status).toBe(401);

    const created = await request(app)
      .post("/api/users/me/deletion-request")
      .set("Authorization", `Bearer ${token}`)
      .send({ password: "correcthorsebattery" });
    expect(created.status).toBe(202);
    expect(created.body.request).toMatchObject({
      reference: expect.any(String),
      status: "pending",
      requestedAt: expect.any(String),
      responseDueAt: expect.any(String),
      cancelledAt: null,
    });
    expect(created.body.request).not.toHaveProperty("userId");
    expect(created.body.request).not.toHaveProperty("resolutionNote");
    expect(created.body.notificationSent).toBe(true);
    expect(developmentEmailOutbox.some((email) =>
      email.to === "carol@example.com" && email.subject.includes("deletion request")
    )).toBe(true);

    const duplicate = await request(app)
      .post("/api/users/me/deletion-request")
      .set("Authorization", `Bearer ${token}`)
      .send({ password: "correcthorsebattery" });
    expect(duplicate.status).toBe(200);
    expect(duplicate.body.alreadyPending).toBe(true);
    expect(duplicate.body.notificationSent).toBe(false);
    expect(duplicate.body.request.reference).toBe(created.body.request.reference);
    expect(duplicate.body.request.requestedAt).toBe(created.body.request.requestedAt);
    expect(duplicate.body.request.responseDueAt).toBe(created.body.request.responseDueAt);

    const status = await request(app)
      .get("/api/users/me/deletion-request")
      .set("Authorization", `Bearer ${token}`);
    expect(status.body.request.status).toBe("pending");

    const cancelled = await request(app)
      .delete("/api/users/me/deletion-request")
      .set("Authorization", `Bearer ${token}`);
    expect(cancelled.status).toBe(200);
    expect(cancelled.body.request.status).toBe("cancelled");
    expect(cancelled.body.request.cancelledAt).toEqual(expect.any(String));
  });

  it("does not reveal deletion status without authentication", async () => {
    expect((await request(app).get("/api/users/me/deletion-request")).status).toBe(401);
  });
});

describe("PATCH /api/users/me", () => {
  it("rejects the request without a token", async () => {
    const res = await request(app).patch("/api/users/me").send({ minDayRate: 200 });
    expect(res.status).toBe(401);
  });

  it("updates the signed-in user's profile with a valid token", async () => {
    const res = await request(app)
      .patch("/api/users/me")
      .set("Authorization", `Bearer ${token}`)
      .send({ minDayRate: 200 });

    expect(res.status).toBe(200);
    expect(res.body.profile.minDayRate).toBe(200);
    expect((await request(app).get(`/api/users/${userId}`)).body.profile.minDayRate).toBe(200);
  });

  it("does not allow generic profile updates to grant paid membership", async () => {
    const res = await request(app)
      .patch("/api/users/me")
      .set("Authorization", `Bearer ${token}`)
      .send({
        profileTier: "Platinum",
        membershipActivatedAt: "2000-01-01T00:00:00.000Z",
        membershipActivatedBy: "forged-admin-id",
        minDayRate: 225,
      });

    expect(res.status).toBe(200);
    expect(res.body.profile.profileTier).not.toBe("Platinum");
    expect(res.body.profile.membershipActivatedAt).not.toBe("2000-01-01T00:00:00.000Z");
    expect(res.body.profile).not.toHaveProperty("membershipActivatedBy");
    expect(res.body.profile.minDayRate).toBe(225);
  });

  it("rejects a tampered/invalid token", async () => {
    const res = await request(app)
      .patch("/api/users/me")
      .set("Authorization", "Bearer not-a-real-token")
      .send({ minDayRate: 999 });

    expect(res.status).toBe(401);
  });
});

describe("GET /api/users/me",()=>{
  it("returns private contact data only to the authenticated owner",async()=>{const res=await request(app).get("/api/users/me").set("Authorization",`Bearer ${token}`);expect(res.status).toBe(200);expect(res.body.profile.contact.email).toBe("carol@example.com");});
  it("requires authentication",async()=>{expect((await request(app).get("/api/users/me")).status).toBe(401);});
});

describe("PUT /api/users/me/availability", () => {
  it("persists a validated engineer confirmation timestamp", async () => {
    const res = await request(app).put("/api/users/me/availability").set("Authorization", `Bearer ${token}`).send({ availableFrom: "2026-08-10", baseLocation: "London", travelRadiusMiles: 75, workingDays: ["Monday", "Tuesday", "Wednesday"], minimumNoticeDays: 2, overnightWork: true, weekendWork: "premium-only", emergencyCallout: false });
    expect(res.status).toBe(200);
    expect(res.body.profile.baseLocation).toBe("London");
    expect(res.body.profile.availabilityConfirmedAt).toMatch(/^\d{4}-\d{2}-\d{2}T/);
  });

  it("rejects incomplete or implausible availability", async () => {
    const res = await request(app).put("/api/users/me/availability").set("Authorization", `Bearer ${token}`).send({ availableFrom: "not-a-date", baseLocation: "", travelRadiusMiles: 5000, workingDays: [] });
    expect(res.status).toBe(400);
  });

  it("does not allow profile editing to overwrite protected account fields", async () => {
    const res = await request(app).patch("/api/users/me").set("Authorization", `Bearer ${token}`).send({ role: "Admin", id: "replacement" });
    expect(res.status).toBe(400);
    expect((await request(app).get(`/api/users/${userId}`)).body.role).toBe("Engineer");
  });
});

describe("account data controls",()=>{
  it("exports the authenticated account without its password hash",async()=>{const response=await request(app).get("/api/users/me/export").set("Authorization",`Bearer ${token}`);expect(response.status).toBe(200);expect(response.headers["content-disposition"]).toContain("attachment");expect(response.body.account.email).toBe("carol@example.com");expect(response.body.account).not.toHaveProperty("password");expect(response.body).toHaveProperty("applications");expect(response.body).toHaveProperty("contracts");});
  it("requires the password and exact confirmation before deletion",async()=>{const registered=await request(app).post("/api/auth/register").send({email:"delete-me@example.com",password:"correcthorsebattery",role:"Engineer",name:"Delete Me"});const denied=await request(app).delete("/api/users/me").set("Authorization",`Bearer ${registered.body.token}`).send({password:"wrong-password",confirmation:"DELETE MY ACCOUNT"});expect(denied.status).toBe(401);const removed=await request(app).delete("/api/users/me").set("Authorization",`Bearer ${registered.body.token}`).send({password:"correcthorsebattery",confirmation:"DELETE MY ACCOUNT"});expect(removed.status).toBe(204);expect((await request(app).get(`/api/users/${registered.body.user.id}`)).status).toBe(404);});
});

describe("canonical engineer capability profiles",()=>{
  it("migrates legacy ratings into role, responsibility and capability claims",async()=>{const registered=await request(app).post("/api/auth/register").send({email:"legacy-capability@example.com",password:"correcthorsebattery",role:"Engineer",name:"Legacy Capability",profileData:{roleSkillProfiles:[{expectationId:"senior-av-installer",maximumResponsibility:"lead",skills:[{skill:"rack testing",selfLevel:4,evidenceNote:"Delivered three projects"},{skill:"control programming",selfLevel:0}],customKeywords:["Crestron","Crestron"]}]}});expect(registered.status).toBe(201);expect(registered.body.user.profile.profileSchemaVersion).toBe(2);expect(registered.body.user.profile.roleSkillProfiles[0]).toMatchObject({roleId:"av-installation-engineer",overallCapability:"lead",keywords:["Crestron"]});expect(registered.body.user.profile.roleSkillProfiles[0].capabilities).toEqual([{skillId:"rack testing",claim:"independent",evidenceNote:"Delivered three projects"},{skillId:"control programming",claim:"not-offered",evidenceNote:""}]);});
  it("rejects a skill or product name masquerading as a role during profile edits",async()=>{const response=await request(app).patch("/api/users/me").set("Authorization",`Bearer ${token}`).send({roleSkillProfiles:[{roleId:"Q-SYS programming",overallCapability:"lead",capabilities:[]}]});expect(response.status).toBe(400);});
});
