import { afterEach, describe, expect, it, vi } from "vitest";
import {
  createEmailProvider,
  developmentEmailOutbox,
  ResendEmailProvider,
  resetEmailProvider,
  sendEmail,
  setEmailProvider,
} from "./email.js";

describe("transactional email providers", () => {
  afterEach(() => {
    resetEmailProvider();
    developmentEmailOutbox.length = 0;
  });

  it("uses the development outbox when no provider is configured", async () => {
    const originalProvider = process.env.EMAIL_PROVIDER;
    delete process.env.EMAIL_PROVIDER;
    try {
      await sendEmail({ to: "user@example.com", subject: "Test", text: "Message" });
    } finally {
      if (originalProvider === undefined) delete process.env.EMAIL_PROVIDER;
      else process.env.EMAIL_PROVIDER = originalProvider;
    }

    expect(developmentEmailOutbox).toEqual([
      { to: "user@example.com", subject: "Test", text: "Message" },
    ]);
  });

  it("selects Resend from environment configuration", () => {
    expect(
      createEmailProvider({
        EMAIL_PROVIDER: "resend",
        RESEND_API_KEY: "re_test",
        EMAIL_FROM: "TechSubbies <accounts@example.com>",
      } as NodeJS.ProcessEnv)
    ).toBeInstanceOf(ResendEmailProvider);
  });

  it("sends the expected authenticated Resend request", async () => {
    const fetchImplementation = vi.fn().mockResolvedValue(new Response(null, { status: 202 }));
    const provider = new ResendEmailProvider(
      "re_secret",
      "TechSubbies <accounts@example.com>",
      fetchImplementation
    );

    await provider.send({ to: "user@example.com", subject: "Verify", text: "Follow this link" });

    expect(fetchImplementation).toHaveBeenCalledWith(
      "https://api.resend.com/emails",
      expect.objectContaining({
        method: "POST",
        headers: {
          Authorization: "Bearer re_secret",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from: "TechSubbies <accounts@example.com>",
          to: "user@example.com",
          subject: "Verify",
          text: "Follow this link",
        }),
      })
    );
  });

  it("surfaces provider failures without exposing credentials", async () => {
    const provider = new ResendEmailProvider(
      "re_do-not-leak",
      "accounts@example.com",
      vi.fn().mockResolvedValue(new Response(null, { status: 429 }))
    );
    setEmailProvider(provider);

    await expect(
      sendEmail({ to: "user@example.com", subject: "Reset", text: "Reset link" })
    ).rejects.toThrow("Transactional email delivery failed with status 429.");
  });
});
