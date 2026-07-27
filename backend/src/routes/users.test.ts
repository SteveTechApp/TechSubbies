import fs from "node:fs";
import path from "node:path";
import { describe, it, expect, beforeAll } from "vitest";
import request from "supertest";

const TEST_DB = path.join(process.cwd(), "data", "test-users.db");
fs.rmSync(TEST_DB, { force: true });
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
    expect(res.body.profile.contact).toBeUndefined();
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
      version: 1,
      account: { id: userId, role: "Engineer" },
      marketplace: {
        jobs: expect.any(Array),
        applications: expect.any(Array),
        contracts: expect.any(Array),
        invoices: expect.any(Array),
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
  });

  it("rejects a tampered/invalid token", async () => {
    const res = await request(app)
      .patch("/api/users/me")
      .set("Authorization", "Bearer not-a-real-token")
      .send({ minDayRate: 999 });

    expect(res.status).toBe(401);
  });
});
