import { createHmac } from "node:crypto";
import { describe, expect, it, vi } from "vitest";
import { DropboxSignProvider, verifyDropboxSignEvent } from "./esignProvider.js";

const context = {
  contractId: "contract-123",
  jobTitle: "AV Commissioning Engineer",
  description: "Commission and hand over the installed AV system.",
  amount: "1500",
  currency: "£",
  contractType: "Statement of Work",
  engineer: { id: "eng-1", name: "Engineer One", email: "engineer@example.com" },
  company: { id: "co-1", name: "Client One", email: "client@example.com" },
};

function provider(fetchImplementation: typeof fetch) {
  return new DropboxSignProvider({
    apiKey: "api-key",
    clientId: "client-id",
    templateId: "template-id",
    engineerRole: "Engineer",
    companyRole: "Client",
    testMode: false,
  }, fetchImplementation);
}

describe("DropboxSignProvider", () => {
  it("creates a template-backed request and maps both signer ids", async () => {
    const fetchMock = vi.fn(async (_input: RequestInfo | URL, init?: RequestInit) => {
      expect(init?.headers).toEqual(expect.objectContaining({
        Authorization: expect.stringMatching(/^Basic /),
        "Content-Type": "application/json",
      }));
      const body = JSON.parse(String(init?.body));
      expect(body.template_ids).toEqual(["template-id"]);
      expect(body.metadata).toEqual({ contract_id: "contract-123" });
      expect(body.custom_fields).toContainEqual({ name: "contract_id", value: "contract-123" });
      expect(body.test_mode).toBe(false);
      return new Response(JSON.stringify({
        signature_request: {
          signature_request_id: "request-1",
          signatures: [
            { signature_id: "sig-engineer", signer_role: "Engineer", signer_email_address: "engineer@example.com" },
            { signature_id: "sig-client", signer_role: "Client", signer_email_address: "client@example.com" },
          ],
        },
      }), { status: 200, headers: { "Content-Type": "application/json" } });
    }) as unknown as typeof fetch;

    await expect(provider(fetchMock).createRequest(context)).resolves.toEqual({
      provider: "dropbox_sign",
      providerRequestId: "request-1",
      engineerSignatureId: "sig-engineer",
      companySignatureId: "sig-client",
    });
  });

  it("requests a short-lived embedded URL only when the signer is ready", async () => {
    const fetchMock = vi.fn(async (input: RequestInfo | URL) => {
      expect(String(input)).toContain("/embedded/sign_url/sig-engineer");
      return new Response(JSON.stringify({ embedded: { sign_url: "https://sign.example/session", expires_at: 123456 } }), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    }) as unknown as typeof fetch;

    await expect(provider(fetchMock).createSigningSession("sig-engineer")).resolves.toEqual({
      provider: "dropbox_sign",
      signUrl: "https://sign.example/session",
      expiresAt: 123456,
    });
  });
});

describe("Dropbox Sign callback verification", () => {
  it("accepts the HMAC event hash and rejects a forged value", () => {
    const apiKey = "callback-secret";
    const eventTime = "1669926463";
    const eventType = "signature_request_signed";
    const eventHash = createHmac("sha256", apiKey).update(`${eventTime}${eventType}`).digest("hex");

    expect(verifyDropboxSignEvent({ apiKey, eventTime, eventType, eventHash })).toBe(true);
    expect(verifyDropboxSignEvent({ apiKey, eventTime, eventType, eventHash: "0".repeat(64) })).toBe(false);
  });
});
