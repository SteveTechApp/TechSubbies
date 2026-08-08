import express from "express";
import request from "supertest";
import { describe, expect, it } from "vitest";
import { validateRuntimeConfig } from "../lib/config.js";
import { createRateLimiter } from "./rateLimit.js";

const validProductionConfig = {
  NODE_ENV: "production",
  JWT_SECRET: "a-secure-production-secret-that-is-long-enough",
  FRONTEND_ORIGIN: "https://app.techsubbies.com",
  EMAIL_PROVIDER: "resend",
  RESEND_API_KEY: "re_production_key",
  EMAIL_FROM: "TechSubbies <accounts@techsubbies.com>",
  EVIDENCE_STORAGE_PROVIDER: "s3",
  EVIDENCE_S3_BUCKET: "techsubbies-private-evidence",
  AWS_REGION: "eu-west-2",
  AWS_ACCESS_KEY_ID: "AKIATESTKEY",
  AWS_SECRET_ACCESS_KEY: "test-secret-access-key",
  ESIGN_PROVIDER: "dropbox_sign",
  DROPBOX_SIGN_API_KEY: "dropbox-sign-production-key",
  DROPBOX_SIGN_CLIENT_ID: "dropbox-sign-app-client-id",
  DROPBOX_SIGN_CONTRACT_TEMPLATE_ID: "dropbox-sign-contract-template",
  DROPBOX_SIGN_TEST_MODE: "false",
};

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

  it("accepts strong security, email, evidence storage and e-sign settings", () => {
    expect(() => validateRuntimeConfig(validProductionConfig)).not.toThrow();
  });

  it("rejects production startup without transactional email delivery", () => {
    expect(() =>
      validateRuntimeConfig({
        ...validProductionConfig,
        EMAIL_PROVIDER: undefined,
        RESEND_API_KEY: undefined,
        EMAIL_FROM: undefined,
      })
    ).toThrow(/EMAIL_PROVIDER|RESEND_API_KEY|EMAIL_FROM/);
  });

  it("rejects production startup without private S3 evidence storage", () => {
    expect(() =>
      validateRuntimeConfig({
        ...validProductionConfig,
        EVIDENCE_STORAGE_PROVIDER: "local",
        EVIDENCE_S3_BUCKET: undefined,
        AWS_REGION: undefined,
        AWS_ACCESS_KEY_ID: undefined,
        AWS_SECRET_ACCESS_KEY: undefined,
      })
    ).toThrow(/EVIDENCE_STORAGE_PROVIDER|EVIDENCE_S3_BUCKET|AWS_REGION|AWS_ACCESS_KEY_ID|AWS_SECRET_ACCESS_KEY/);
  });

  it("rejects production startup without a live Dropbox Sign configuration", () => {
    expect(() => validateRuntimeConfig({
      ...validProductionConfig,
      ESIGN_PROVIDER: "local",
      DROPBOX_SIGN_API_KEY: undefined,
      DROPBOX_SIGN_CLIENT_ID: undefined,
      DROPBOX_SIGN_CONTRACT_TEMPLATE_ID: undefined,
      DROPBOX_SIGN_TEST_MODE: "true",
    })).toThrow(/ESIGN_PROVIDER|DROPBOX_SIGN_API_KEY|DROPBOX_SIGN_CLIENT_ID|DROPBOX_SIGN_CONTRACT_TEMPLATE_ID|DROPBOX_SIGN_TEST_MODE/);
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
