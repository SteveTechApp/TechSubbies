import { createHmac, timingSafeEqual } from "node:crypto";

export type EsignParty = { id: string; name: string; email: string };
export type ContractSigningContext = {
  contractId: string;
  jobTitle: string;
  description: string;
  amount: string;
  currency: string;
  contractType: string;
  engineer: EsignParty;
  company: EsignParty;
};

export type EsignRequest = {
  provider: "local" | "dropbox_sign";
  providerRequestId: string;
  engineerSignatureId: string;
  companySignatureId: string;
};

export type EsignSession = {
  provider: "local" | "dropbox_sign";
  signUrl: string | null;
  expiresAt: number | null;
};

export interface EsignProvider {
  readonly name: EsignRequest["provider"];
  createRequest(context: ContractSigningContext): Promise<EsignRequest>;
  createSigningSession(signatureId: string): Promise<EsignSession>;
}

export class LocalEsignProvider implements EsignProvider {
  readonly name = "local" as const;

  async createRequest(context: ContractSigningContext): Promise<EsignRequest> {
    return {
      provider: this.name,
      providerRequestId: `local-${context.contractId}`,
      engineerSignatureId: `local-engineer-${context.contractId}`,
      companySignatureId: `local-company-${context.contractId}`,
    };
  }

  async createSigningSession(_signatureId: string): Promise<EsignSession> {
    return { provider: this.name, signUrl: null, expiresAt: null };
  }
}

type DropboxSignature = {
  signature_id: string;
  signer_role?: string | null;
  signer_email_address?: string | null;
};

type DropboxCreateResponse = {
  signature_request?: {
    signature_request_id?: string;
    signatures?: DropboxSignature[];
  };
};

type DropboxSignUrlResponse = {
  embedded?: { sign_url?: string; expires_at?: number };
};

function basicAuth(apiKey: string) {
  return `Basic ${Buffer.from(`${apiKey}:`).toString("base64")}`;
}

export class DropboxSignProvider implements EsignProvider {
  readonly name = "dropbox_sign" as const;

  constructor(
    private readonly config: {
      apiKey: string;
      clientId: string;
      templateId: string;
      engineerRole: string;
      companyRole: string;
      testMode: boolean;
    },
    private readonly fetchImplementation: typeof fetch = globalThis.fetch
  ) {}

  async createRequest(context: ContractSigningContext): Promise<EsignRequest> {
    const response = await this.fetchImplementation(
      "https://api.hellosign.com/v3/signature_request/create_embedded_with_template",
      {
        method: "POST",
        headers: {
          Authorization: basicAuth(this.config.apiKey),
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          client_id: this.config.clientId,
          template_ids: [this.config.templateId],
          title: `TechSubbies contract ${context.contractId}`,
          subject: `Contract for ${context.jobTitle}`,
          message: "Please review and sign this direct agreement. TechSubbies provides the signing workflow but is not a party to the contract.",
          signers: [
            { role: this.config.engineerRole, name: context.engineer.name, email_address: context.engineer.email },
            { role: this.config.companyRole, name: context.company.name, email_address: context.company.email },
          ],
          custom_fields: [
            { name: "contract_id", value: context.contractId },
            { name: "job_title", value: context.jobTitle },
            { name: "contract_description", value: context.description },
            { name: "contract_amount", value: context.amount },
            { name: "contract_currency", value: context.currency },
            { name: "contract_type", value: context.contractType },
          ],
          metadata: { contract_id: context.contractId },
          allow_decline: true,
          test_mode: this.config.testMode,
        }),
        signal: AbortSignal.timeout(15_000),
      }
    );

    const data = await response.json() as DropboxCreateResponse & { error?: { error_msg?: string } };
    if (!response.ok) {
      throw new Error(data.error?.error_msg || `Dropbox Sign request creation failed with status ${response.status}.`);
    }
    const requestId = data.signature_request?.signature_request_id;
    const signatures = data.signature_request?.signatures || [];
    const engineerSignature = signatures.find((signature) =>
      signature.signer_role === this.config.engineerRole || signature.signer_email_address === context.engineer.email
    );
    const companySignature = signatures.find((signature) =>
      signature.signer_role === this.config.companyRole || signature.signer_email_address === context.company.email
    );
    if (!requestId || !engineerSignature?.signature_id || !companySignature?.signature_id) {
      throw new Error("Dropbox Sign did not return both expected signer identifiers.");
    }
    return {
      provider: this.name,
      providerRequestId: requestId,
      engineerSignatureId: engineerSignature.signature_id,
      companySignatureId: companySignature.signature_id,
    };
  }

  async createSigningSession(signatureId: string): Promise<EsignSession> {
    const response = await this.fetchImplementation(
      `https://api.hellosign.com/v3/embedded/sign_url/${encodeURIComponent(signatureId)}`,
      {
        headers: { Authorization: basicAuth(this.config.apiKey) },
        signal: AbortSignal.timeout(10_000),
      }
    );
    const data = await response.json() as DropboxSignUrlResponse & { error?: { error_msg?: string } };
    if (!response.ok) {
      throw new Error(data.error?.error_msg || `Dropbox Sign session creation failed with status ${response.status}.`);
    }
    if (!data.embedded?.sign_url) throw new Error("Dropbox Sign did not return an embedded signing URL.");
    return {
      provider: this.name,
      signUrl: data.embedded.sign_url,
      expiresAt: data.embedded.expires_at ?? null,
    };
  }
}

export function createEsignProvider(env: NodeJS.ProcessEnv = process.env): EsignProvider {
  if (env.ESIGN_PROVIDER === "dropbox_sign") {
    return new DropboxSignProvider({
      apiKey: env.DROPBOX_SIGN_API_KEY || "",
      clientId: env.DROPBOX_SIGN_CLIENT_ID || "",
      templateId: env.DROPBOX_SIGN_CONTRACT_TEMPLATE_ID || "",
      engineerRole: env.DROPBOX_SIGN_ENGINEER_ROLE || "Engineer",
      companyRole: env.DROPBOX_SIGN_COMPANY_ROLE || "Client",
      testMode: env.DROPBOX_SIGN_TEST_MODE === "true",
    });
  }
  return new LocalEsignProvider();
}

export function verifyDropboxSignEvent(input: {
  apiKey: string;
  eventTime: string;
  eventType: string;
  eventHash: string;
}): boolean {
  const expected = createHmac("sha256", input.apiKey)
    .update(`${input.eventTime}${input.eventType}`)
    .digest("hex");
  const expectedBytes = Buffer.from(expected);
  const actualBytes = Buffer.from(input.eventHash || "");
  return expectedBytes.length === actualBytes.length && timingSafeEqual(expectedBytes, actualBytes);
}
