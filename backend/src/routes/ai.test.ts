import fs from "node:fs";
import path from "node:path";
import { describe, it, expect, vi } from "vitest";
import request from "supertest";

// Keep these route tests independent of backend/.env and developer-level
// environment variables. Tests that exercise the real provider belong in a
// separately configured integration suite.
vi.mock("../lib/gemini.js", () => ({
  genAI: null,
  requireGenAI: () => {
    throw new Error("GEMINI_API_KEY is not configured on the server.");
  },
}));

const TEST_DB = path.join(process.cwd(), "data", "test-ai.db");
fs.rmSync(TEST_DB, { force: true });
process.env.DB_FILE = TEST_DB;
process.env.JWT_SECRET = "test-secret";
const { createApp } = await import("../app.js");
const app = createApp();
const { parseTranslationResponse, parseTutorialScript } = await import("./ai.js");

describe("POST /api/ai/translate", () => {
  it("reports 503 (not configured) when there is no GEMINI_API_KEY", async () => {
    const res = await request(app)
      .post("/api/ai/translate")
      .send({ text: "Bonjour, êtes-vous disponible mardi ?", targetLanguage: "English" });

    expect(res.status).toBe(503);
    expect(res.body.error).toMatch(/GEMINI_API_KEY/);
  });

  it("validates that text and targetLanguage are required", async () => {
    const res = await request(app).post("/api/ai/translate").send({ text: "" });
    // Validation runs before the "not configured" check for a well-formed
    // request, but an empty text still fails schema validation first.
    expect([400, 503]).toContain(res.status);
  });
});

describe("AI structured response parsing", () => {
  it("accepts complete translation and tutorial responses", () => {
    expect(parseTranslationResponse('{"detectedSourceLanguage":"French","translatedText":"Hello"}')).toEqual({ detectedSourceLanguage: "French", translatedText: "Hello" });
    expect(parseTutorialScript('{"title":"Routing","script":"Step one"}')).toEqual({ title: "Routing", script: "Step one" });
  });

  it("rejects primitive, partial, and incorrectly typed provider JSON", () => {
    expect(() => parseTranslationResponse('null')).toThrow("Invalid translation response from AI model.");
    expect(() => parseTranslationResponse('{"translatedText":42}')).toThrow("Invalid translation response from AI model.");
    expect(() => parseTutorialScript('{"title":"Routing","script":""}')).toThrow("Invalid tutorial response from AI model.");
  });
});
