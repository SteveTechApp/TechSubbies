import path from "node:path";
import { randomUUID } from "node:crypto";
import { describe, it, expect, beforeAll } from "vitest";
import request from "supertest";

// Point the app at a throwaway database file so these tests never touch
// the real local dev database, and start from a clean slate every run.
const TEST_DB = path.join(process.cwd(), "data", `test-auth-${randomUUID()}.db`);
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

  it("rejects unrecognised account roles", async () => {
    const res = await request(app).post("/api/auth/register").send({ email: "admin-claim@example.com", password: "correcthorsebattery", role: "Admin", name: "Not Admin" });
    expect(res.status).toBe(400);
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

  it("throttles repeated credential attempts for the same account", async () => {
    let response:any;
    for(let attempt=0;attempt<6;attempt++) response=await request(app).post("/api/auth/login").send({email:"attacked@example.com",password:"incorrect-password"});
    expect(response.status).toBe(429);
    expect(response.headers["retry-after"]).toBeTruthy();
    expect(response.body.error).not.toContain("email");
  });
});

describe("secure account lifecycle",()=>{
  it("verifies an email with an expiring single-use token",async()=>{const registered=await request(app).post("/api/auth/register").send({email:"verify@example.com",password:"correcthorsebattery",role:"Engineer",name:"Verify Me"});expect(registered.body.debugToken).toBeTruthy();const verified=await request(app).post("/api/auth/verification/confirm").send({token:registered.body.debugToken});expect(verified.status).toBe(200);expect(verified.body.user.emailVerified).toBe(true);const reused=await request(app).post("/api/auth/verification/confirm").send({token:registered.body.debugToken});expect(reused.status).toBe(400);});
  it("resets a password and revokes previously issued sessions",async()=>{const registered=await request(app).post("/api/auth/register").send({email:"reset@example.com",password:"correcthorsebattery",role:"Engineer",name:"Reset Me"});const oldToken=registered.body.token;const forgot=await request(app).post("/api/auth/password/forgot").send({email:"reset@example.com"});expect(forgot.status).toBe(202);expect(forgot.body.debugToken).toBeTruthy();const reset=await request(app).post("/api/auth/password/reset").send({token:forgot.body.debugToken,password:"a-new-secure-password"});expect(reset.status).toBe(200);const oldSession=await request(app).get("/api/users/me").set("Authorization",`Bearer ${oldToken}`);expect(oldSession.status).toBe(401);const login=await request(app).post("/api/auth/login").send({email:"reset@example.com",password:"a-new-secure-password"});expect(login.status).toBe(200);});
  it("revokes all sessions from an authenticated request",async()=>{const registered=await request(app).post("/api/auth/register").send({email:"revoke@example.com",password:"correcthorsebattery",role:"Engineer",name:"Revoke Me"});const revoke=await request(app).post("/api/auth/sessions/revoke").set("Authorization",`Bearer ${registered.body.token}`);expect(revoke.status).toBe(200);const after=await request(app).get("/api/users/me").set("Authorization",`Bearer ${registered.body.token}`);expect(after.status).toBe(401);});
  it("returns the same password recovery response for unknown accounts",async()=>{const response=await request(app).post("/api/auth/password/forgot").send({email:"unknown-account@example.com"});expect(response.status).toBe(202);expect(response.body.message).toMatch(/If an account exists/);});
});
