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
