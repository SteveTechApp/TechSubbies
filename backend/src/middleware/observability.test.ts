import express from "express";
import request from "supertest";
import { afterEach, describe, expect, it, vi } from "vitest";
import { requestContext, requestLogger, safeErrorHandler } from "./observability.js";

describe("request observability", () => {
  afterEach(() => {
    vi.restoreAllMocks();
    delete process.env.LOG_REQUESTS;
  });

  it("preserves a safe caller request id and generates one otherwise", async () => {
    const app = express();
    app.use(requestContext);
    app.get("/", (_req, res) => res.json({ ok: true }));

    expect((await request(app).get("/").set("X-Request-Id", "deploy-check-42")).headers["x-request-id"])
      .toBe("deploy-check-42");
    expect((await request(app).get("/").set("X-Request-Id", "unsafe id!")).headers["x-request-id"])
      .toMatch(/^[0-9a-f-]{36}$/);
  });

  it("logs request metadata without bodies or authorization values", async () => {
    process.env.LOG_REQUESTS = "true";
    const info = vi.spyOn(console, "info").mockImplementation(() => undefined);
    const app = express();
    app.use(requestContext, requestLogger);
    app.post("/login", (_req, res) => res.status(204).end());

    await request(app).post("/login").set("Authorization", "Bearer secret").send({ password: "secret" });

    const log = info.mock.calls[0][0] as string;
    expect(log).toContain('"path":"/login"');
    expect(log).toContain('"status":204');
    expect(log).not.toContain("Bearer secret");
    expect(log).not.toContain("password");
  });

  it("returns a traceable error without exposing exception details", async () => {
    vi.spyOn(console, "error").mockImplementation(() => undefined);
    const app = express();
    app.use(requestContext);
    app.get("/failure", () => {
      throw new Error("database password was exposed here");
    });
    app.use(safeErrorHandler);

    const response = await request(app).get("/failure");

    expect(response.status).toBe(500);
    expect(response.body.error).toBe("An unexpected server error occurred.");
    expect(response.body.requestId).toBe(response.headers["x-request-id"]);
    expect(JSON.stringify(response.body)).not.toContain("database password");
  });
});
