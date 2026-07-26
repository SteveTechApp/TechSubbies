import fs from "node:fs";
import path from "node:path";
import { describe, it, expect, beforeAll } from "vitest";
import request from "supertest";

// Point the app at a throwaway database file so these tests never touch
// the real local dev database, and start from a clean slate every run.
const TEST_DB = path.join(process.cwd(), "data", "test.db");
fs.rmSync(TEST_DB, { force: true });
process.env.DB_FILE = TEST_DB;
process.env.JWT_SECRET = "test-secret";

const { createApp } = await import("../app.js");
const app = createApp();

describe("POST /api/auth/register", () => {
  it("creates a new account and returns a token", async () => {
    const res = await request(app).post("/api/auth/register").send({
      email: "alice@example.com",
      password: "correcthorsebattery",
      role: "Engineer",
      name: "Alice Example",
      profileData: { discipline: "AV Engineer" },
    });

    expect(res.status).toBe(201);
    expect(res.body.token).toBeTruthy();
    expect(res.body.user.role).toBe("Engineer");
    expect(res.body.user.profile.name).toBe("Alice Example");
    expect(res.body.user.profile.contact.email).toBe("alice@example.com");
    const cookies = res.headers["set-cookie"] as unknown as string[];
    expect(cookies.some((cookie) => cookie.startsWith("techsubbies_session=") && cookie.includes("HttpOnly"))).toBe(true);
    expect(cookies.some((cookie) => cookie.startsWith("techsubbies_csrf="))).toBe(true);
  });

  it("rejects a password shorter than 8 characters", async () => {
    const res = await request(app).post("/api/auth/register").send({
      email: "short@example.com",
      password: "short",
      role: "Engineer",
      name: "Short Password",
    });

    expect(res.status).toBe(400);
  });

  it("rejects attempts to self-register as an admin", async () => {
    const response = await request(app).post("/api/auth/register").send({
      email: "attacker@example.com",
      password: "strong-password",
      role: "Admin",
      name: "Unauthorised Admin",
      profileData: {},
    });

    expect(response.status).toBe(400);
    expect(response.body.error).toMatch(/Invalid enum value|Invalid option/i);
  });

  it("rejects a duplicate email", async () => {
    await request(app).post("/api/auth/register").send({
      email: "dupe@example.com",
      password: "correcthorsebattery",
      role: "Engineer",
      name: "First",
    });

    const res = await request(app).post("/api/auth/register").send({
      email: "dupe@example.com",
      password: "anotherpassword",
      role: "Engineer",
      name: "Second",
    });

    expect(res.status).toBe(409);
  });
});

describe("cookie session security", () => {
  it("requires a matching CSRF token for cookie-authenticated state changes", async () => {
    const agent = request.agent(app);
    const login = await agent.post("/api/auth/register").send({
      email: "cookie-session@example.com",
      password: "correcthorsebattery",
      role: "Engineer",
      name: "Cookie Session",
    });
    const cookies = login.headers["set-cookie"] as unknown as string[];
    const csrfCookie = cookies.find((cookie) => cookie.startsWith("techsubbies_csrf="));
    const csrfToken = decodeURIComponent(csrfCookie!.split(";")[0].split("=")[1]);

    const rejected = await agent.post("/api/auth/logout");
    expect(rejected.status).toBe(403);

    const accepted = await agent.post("/api/auth/logout").set("X-CSRF-Token", csrfToken);
    expect(accepted.status).toBe(204);
  });

  it("adds baseline security headers", async () => {
    const res = await request(app).get("/api/health");
    expect(res.headers["x-content-type-options"]).toBe("nosniff");
    expect(res.headers["x-frame-options"]).toBe("DENY");
    expect(res.headers["referrer-policy"]).toBe("strict-origin-when-cross-origin");
  });
});

describe("POST /api/auth/login", () => {
  beforeAll(async () => {
    await request(app).post("/api/auth/register").send({
      email: "bob@example.com",
      password: "correcthorsebattery",
      role: "Company",
      name: "Bob Example",
    });
  });

  it("logs in with the correct password", async () => {
    const res = await request(app).post("/api/auth/login").send({
      email: "bob@example.com",
      password: "correcthorsebattery",
    });

    expect(res.status).toBe(200);
    expect(res.body.token).toBeTruthy();
    expect(res.body.user.role).toBe("Company");
  });

  it("rejects the wrong password", async () => {
    const res = await request(app).post("/api/auth/login").send({
      email: "bob@example.com",
      password: "wrongpassword",
    });

    expect(res.status).toBe(401);
  });

  it("rejects a login for an email that was never registered", async () => {
    const res = await request(app).post("/api/auth/login").send({
      email: "nobody@example.com",
      password: "whatever123",
    });

    expect(res.status).toBe(401);
  });
});
