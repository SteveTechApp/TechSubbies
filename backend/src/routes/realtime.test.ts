import fs from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import request from "supertest";

const TEST_DB = path.join(process.cwd(), "data", "test-realtime-route.db");
fs.rmSync(TEST_DB, { force: true });
process.env.DB_FILE = TEST_DB;
process.env.JWT_SECRET = "test-secret";

const { createApp } = await import("../app.js");
const app = createApp();

describe("realtime event stream", () => {
  it("rejects unauthenticated stream connections", async () => {
    const response = await request(app).get("/api/realtime/events");
    expect(response.status).toBe(401);
  });
});
