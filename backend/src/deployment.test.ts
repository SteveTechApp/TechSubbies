import path from "node:path";
import { randomUUID } from "node:crypto";
import { describe, expect, it } from "vitest";
import request from "supertest";

process.env.DB_FILE = path.join(process.cwd(), "data", `test-deployment-${randomUUID()}.db`);
process.env.JWT_SECRET = "test-secret";
process.env.FRONTEND_ORIGIN = "https://app.techsubbies.test";
const { createApp } = await import("./app.js");
const { db, listAuditEvents } = await import("./lib/db.js");
const app = createApp();

describe("deployment health and HTTP boundaries", () => {
  it("reports liveness and database readiness", async () => {
    expect((await request(app).get("/api/health")).body.status).toBe("ok");
    expect((await request(app).get("/api/ready")).body.status).toBe("ready");
  });

  it("adds security and correlation headers", async () => {
    const response = await request(app).get("/api/health").set("X-Request-Id", "trace-123");
    expect(response.headers["x-powered-by"]).toBeUndefined();
    expect(response.headers["x-content-type-options"]).toBe("nosniff");
    expect(response.headers["x-frame-options"]).toBe("DENY");
    expect(response.headers["x-request-id"]).toBe("trace-123");
  });

  it("rejects browser origins outside the configured allow-list", async () => {
    expect((await request(app).get("/api/health").set("Origin", "https://evil.example")).status).toBe(403);
    expect((await request(app).get("/api/health").set("Origin", "https://app.techsubbies.test")).headers["access-control-allow-origin"]).toBe("https://app.techsubbies.test");
  });

  it("returns a stable code when persisted marketplace JSON is corrupt", async () => {
    const timestamp=new Date().toISOString();
    db.prepare("INSERT INTO jobs(id,companyId,payload,status,createdAt,updatedAt) VALUES (?,?,?,?,?,?)").run("corrupt-job","company-1","not-json","active",timestamp,timestamp);
    const response=await request(app).get("/api/jobs");
    expect(response.status).toBe(500);
    expect(response.body).toMatchObject({code:"PERSISTED_DATA_CORRUPT",details:{entity:"job",id:"corrupt-job"}});
  });

  it("adds stable default codes to ordinary route errors", async () => {
    expect((await request(app).get("/api/does-not-exist")).body.code).toBe("NOT_FOUND");
    expect((await request(app).post("/api/auth/register").send({})).body.code).toBe("INVALID_REQUEST");
    expect((await request(app).get("/api/users/me")).body.code).toBe("AUTHENTICATION_REQUIRED");
  });

  it("rejects corrupt auxiliary audit payloads explicitly", () => {
    const timestamp=new Date().toISOString();
    db.prepare("INSERT INTO audit_events VALUES (?,?,?,?,?,?,?,?)").run("corrupt-audit","company-aux","actor-1","test","test","entity-1","not-json",timestamp);
    try {
      expect(()=>listAuditEvents("company-aux")).toThrow("Stored audit metadata data is corrupt.");
    } finally {
      db.prepare("DELETE FROM audit_events WHERE id=?").run("corrupt-audit");
    }
  });
});
