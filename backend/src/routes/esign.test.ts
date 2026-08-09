import { createHmac } from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import request from "supertest";

const TEST_DB = path.join(process.cwd(), "data", "test-esign.db");
fs.rmSync(TEST_DB, { force: true });
process.env.DB_FILE = TEST_DB;
process.env.JWT_SECRET = "test-secret";
process.env.NODE_ENV = "test";
process.env.DROPBOX_SIGN_API_KEY = "callback-secret";

const { createApp } = await import("../app.js");
const { isTerminalContractStatus } = await import("./esign.js");
const app = createApp();

function callback(eventType: string, eventTime: string, valid = true) {
  const correct = createHmac("sha256", "callback-secret")
    .update(`${eventTime}${eventType}`)
    .digest("hex");
  return {
    event: {
      event_type: eventType,
      event_time: eventTime,
      event_hash: valid ? correct : "0".repeat(64),
      event_metadata: {},
    },
  };
}

describe("Dropbox Sign webhook", () => {
  it("recognises only contract terminal states", () => {
    expect(isTerminalContractStatus("Completed")).toBe(true);
    expect(isTerminalContractStatus("Cancelled")).toBe(true);
    expect(isTerminalContractStatus("Active")).toBe(false);
    expect(isTerminalContractStatus("provider-completed")).toBe(false);
  });
  it("accepts a verified provider callback test event", async () => {
    const response = await request(app)
      .post("/api/esign/dropbox-sign/webhook")
      .field("json", JSON.stringify(callback("account_callback_test", "1669926463")));

    expect(response.status).toBe(200);
    expect(response.text).toBe("Hello API Event Received");
  });

  it("rejects a callback with a forged event hash", async () => {
    const response = await request(app)
      .post("/api/esign/dropbox-sign/webhook")
      .field("json", JSON.stringify(callback("signature_request_signed", "1669926464", false)));

    expect(response.status).toBe(401);
  });

  it("rejects a verified envelope whose JSON field is not a callback object", async () => {
    const response = await request(app).post("/api/esign/dropbox-sign/webhook").field("json", "null");
    expect(response.status).toBe(400);
  });
});
