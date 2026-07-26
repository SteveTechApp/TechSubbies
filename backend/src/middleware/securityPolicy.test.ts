import express from "express";
import request from "supertest";
import { describe, expect, it } from "vitest";
import { validateRuntimeConfig } from "../lib/config.js";
import { createRateLimiter } from "./rateLimit.js";

describe("production configuration", () => {
  it("rejects placeholder secrets and non-HTTPS origins", () => {
    expect(() =>
      validateRuntimeConfig({
        NODE_ENV: "production",
        JWT_SECRET: "change-this-to-a-long-random-string",
        FRONTEND_ORIGIN: "http://localhost:5173",
      })
    ).toThrow(/Unsafe production configuration/);
  });

  it("accepts a strong secret and exact HTTPS origin", () => {
    expect(() =>
      validateRuntimeConfig({
        NODE_ENV: "production",
        JWT_SECRET: "a-secure-production-secret-that-is-long-enough",
        FRONTEND_ORIGIN: "https://app.techsubbies.com",
        EMAIL_PROVIDER: "resend",
        RESEND_API_KEY: "re_production_key",
        EMAIL_FROM: "TechSubbies <accounts@techsubbies.com>",
      })
    ).not.toThrow();
  });

  it("rejects production startup without transactional email delivery", () => {
    expect(() =>
      validateRuntimeConfig({
        NODE_ENV: "production",
        JWT_SECRET: "a-secure-production-secret-that-is-long-enough",
        FRONTEND_ORIGIN: "https://app.techsubbies.com",
      })
    ).toThrow(/EMAIL_PROVIDER|RESEND_API_KEY|EMAIL_FROM/);
  });
});

describe("rate limiting", () => {
  it("returns 429 with retry information after the configured limit", async () => {
    const app = express();
    app.use(createRateLimiter({ windowMs: 60_000, max: 2, name: "test" }));
    app.get("/", (_req, res) => res.json({ ok: true }));

    expect((await request(app).get("/")).status).toBe(200);
    expect((await request(app).get("/")).status).toBe(200);
    const blocked = await request(app).get("/");
    expect(blocked.status).toBe(429);
    expect(blocked.headers["retry-after"]).toBeTruthy();
    expect(blocked.body.error).toMatch(/Too many test requests/);
  });
});
