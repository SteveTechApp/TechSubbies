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

let provider: EmailProvider = new DevelopmentEmailProvider();

export function setEmailProvider(nextProvider: EmailProvider) {
  provider = nextProvider;
}

export async function sendEmail(message: OutboundEmail) {
  await provider.send(message);
}
