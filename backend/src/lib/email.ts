export type OutboundEmail = {
  to: string;
  subject: string;
  text: string;
};

export interface EmailProvider {
  send(message: OutboundEmail): Promise<void>;
}

// Test/development outbox. A production adapter can implement EmailProvider
// without changing account routes.
export const developmentEmailOutbox: OutboundEmail[] = [];

class DevelopmentEmailProvider implements EmailProvider {
  async send(message: OutboundEmail) {
    developmentEmailOutbox.push(message);
    if (process.env.NODE_ENV !== "test") {
      console.log(`Queued development email to ${message.to}: ${message.subject}`);
    }
  }
}

export class ResendEmailProvider implements EmailProvider {
  constructor(
    private readonly apiKey: string,
    private readonly from: string,
    private readonly fetchImplementation: typeof fetch = globalThis.fetch
  ) {}

  async send(message: OutboundEmail) {
    const response = await this.fetchImplementation("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${this.apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ from: this.from, ...message }),
      signal: AbortSignal.timeout(10_000),
    });

    if (!response.ok) {
      throw new Error(`Transactional email delivery failed with status ${response.status}.`);
    }
  }
}

export function createEmailProvider(env: NodeJS.ProcessEnv = process.env): EmailProvider {
  if (env.EMAIL_PROVIDER === "resend") {
    return new ResendEmailProvider(env.RESEND_API_KEY || "", env.EMAIL_FROM || "");
  }
  return new DevelopmentEmailProvider();
}

let providerOverride: EmailProvider | null = null;

export function setEmailProvider(nextProvider: EmailProvider) {
  providerOverride = nextProvider;
}

export function resetEmailProvider() {
  providerOverride = null;
}

export async function sendEmail(message: OutboundEmail) {
  await (providerOverride || createEmailProvider()).send(message);
}
