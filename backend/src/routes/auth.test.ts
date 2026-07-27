import fs from "node:fs";
import path from "node:path";
import { describe, it, expect, beforeAll, vi } from "vitest";
import request from "supertest";

// Point the app at a throwaway database file so these tests never touch
// the real local dev database, and start from a clean slate every run.
const TEST_DB = path.join(process.cwd(), "data", "test.db");
fs.rmSync(TEST_DB, { force: true });
process.env.DB_FILE = TEST_DB;
process.env.JWT_SECRET = "test-secret";

const { createApp } = await import("../app.js");
const { developmentEmailOutbox, resetEmailProvider, setEmailProvider } = await import("../lib/email.js");
const { getDatabaseRuntimeSettings, LATEST_SCHEMA_VERSION } = await import("../lib/db.js");
const { currentSchemaVersion } = await import("../lib/migrations.js");
const { db } = await import("../lib/db.js");
const app = createApp();

function tokenFromLastEmail(): string {
  const email = developmentEmailOutbox.at(-1);
  if (!email) throw new Error("Expected an email in the development outbox.");
  const token = new URL(email.text).searchParams.get("token");
  if (!token) throw new Error("Expected a token in the development email.");
  return token;
}

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

  it("reports process liveness and database readiness separately", async () => {
    const live = await request(app).get("/api/health/live");
    const ready = await request(app).get("/api/health/ready");

    expect(live.status).toBe(200);
    expect(live.body).toEqual({ status: "ok" });
    expect(live.headers["x-request-id"]).toMatch(/^[0-9a-f-]{36}$/);
    expect(ready.status).toBe(200);
    expect(ready.body).toEqual({ status: "ready", checks: { database: "ok" } });
  });

  it("returns a non-sensitive 503 when readiness checks fail", async () => {
    const unavailableApp = createApp({ readinessCheck: () => false });
    const response = await request(unavailableApp).get("/api/health/ready");

    expect(response.status).toBe(503);
    expect(response.body).toEqual({
      status: "unavailable",
      checks: { database: "unavailable" },
    });
  });

  it("uses contention-safe SQLite runtime settings", () => {
    expect(getDatabaseRuntimeSettings()).toEqual({
      journalMode: "wal",
      synchronous: 1,
      foreignKeys: true,
      busyTimeoutMs: 5000,
    });
  });

  it("records the current schema migration version", () => {
    expect(currentSchemaVersion(db)).toBe(LATEST_SCHEMA_VERSION);
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

describe("email verification and password recovery", () => {
  it("keeps a newly created account usable when email delivery is temporarily unavailable", async () => {
    setEmailProvider({ send: async () => { throw new Error("provider unavailable"); } });
    const consoleError = vi.spyOn(console, "error").mockImplementation(() => undefined);
    try {
      const response = await request(app).post("/api/auth/register").send({
        email: "delivery-failure@example.com",
        password: "correcthorsebattery",
        role: "Engineer",
        name: "Delivery Failure",
      });
      expect(response.status).toBe(201);
      expect(response.body.user.id).toBeTruthy();
      expect(response.body.user.role).toBe("Engineer");
      expect(response.body.verificationEmailSent).toBe(false);
    } finally {
      resetEmailProvider();
      consoleError.mockRestore();
    }
  });

  it("verifies an email with a hashed, single-use token", async () => {
    const registered = await request(app).post("/api/auth/register").send({
      email: "verify@example.com",
      password: "correcthorsebattery",
      role: "Engineer",
      name: "Verify Me",
    });
    expect(registered.body.user.emailVerified).toBe(false);
    const token = tokenFromLastEmail();

    const verified = await request(app).post("/api/auth/verification/confirm").send({ token });
    expect(verified.status).toBe(200);
    expect(verified.body.verified).toBe(true);

    const reused = await request(app).post("/api/auth/verification/confirm").send({ token });
    expect(reused.status).toBe(400);
  });

  it("uses the same reset-request response for known and unknown accounts", async () => {
    const known = await request(app)
      .post("/api/auth/password-reset/request")
      .send({ email: "verify@example.com" });
    const unknown = await request(app)
      .post("/api/auth/password-reset/request")
      .send({ email: "unknown@example.com" });
    expect(known.status).toBe(202);
    expect(unknown.status).toBe(202);
    expect(known.body).toEqual(unknown.body);
  });

  it("resets a password with a single-use token", async () => {
    await request(app).post("/api/auth/password-reset/request").send({ email: "verify@example.com" });
    const token = tokenFromLastEmail();
    const reset = await request(app)
      .post("/api/auth/password-reset/confirm")
      .send({ token, newPassword: "a-new-secure-password" });
    expect(reset.status).toBe(204);

    const login = await request(app).post("/api/auth/login").send({
      email: "verify@example.com",
      password: "a-new-secure-password",
    });
    expect(login.status).toBe(200);
  });

  it("changes a signed-in password after checking the current password", async () => {
    const registered = await request(app).post("/api/auth/register").send({
      email: "change-password@example.com",
      password: "original-password",
      role: "Company",
      name: "Password Change",
    });
    const rejected = await request(app)
      .post("/api/auth/password/change")
      .set("Authorization", `Bearer ${registered.body.token}`)
      .send({ currentPassword: "wrong-password", newPassword: "replacement-password" });
    expect(rejected.status).toBe(401);

    const changed = await request(app)
      .post("/api/auth/password/change")
      .set("Authorization", `Bearer ${registered.body.token}`)
      .send({ currentPassword: "original-password", newPassword: "replacement-password" });
    expect(changed.status).toBe(204);

    const revoked = await request(app)
      .get("/api/users/me")
      .set("Authorization", `Bearer ${registered.body.token}`);
    expect(revoked.status).toBe(401);
  });
});
