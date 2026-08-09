import path from "node:path";
import { randomUUID } from "node:crypto";
import { describe, it, expect, beforeAll } from "vitest";
import request from "supertest";

const TEST_DB = path.join(process.cwd(), "data", `test-users-${randomUUID()}.db`);
process.env.DB_FILE = TEST_DB;
process.env.JWT_SECRET = "test-secret";

const { createApp } = await import("../app.js");
const app = createApp();

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
