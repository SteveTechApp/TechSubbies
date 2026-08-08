import { Router, raw } from "express";
import {
  findContractById,
  findUserById,
  updateContractSignature,
} from "../lib/db.js";
import {
  createContractEsignRequest,
  findContractEsignRequest,
  findEsignRequestByProviderId,
  recordContractEsignEvent,
  updateContractEsignStatus,
} from "../lib/esignRepository.js";
import { createEsignProvider, verifyDropboxSignEvent } from "../lib/esignProvider.js";
import { requireAuth, type AuthedRequest } from "../middleware/auth.js";

const CONTRACT_STATUS = {
  PENDING_SIGNATURE: "Pending Signature",
  SIGNED: "Signed by Engineer",
  ACTIVE: "Active",
} as const;

type DropboxSignature = {
  signature_id?: string;
  signer_name?: string;
  status_code?: string;
  signed_at?: number | null;
};

type DropboxCallback = {
  event?: {
    event_type?: string;
    event_time?: string | number;
    event_hash?: string;
    event_metadata?: { related_signature_id?: string | null };
  };
  signature_request?: {
    signature_request_id?: string;
    signatures?: DropboxSignature[];
  };
};

function parseContractData(data: string) {
  try {
    return JSON.parse(data) as Record<string, unknown>;
  } catch {
    return {};
  }
}

async function ensureRequest(contractId: string) {
  const existing = findContractEsignRequest(contractId);
  if (existing) return existing;

  const contract = findContractById(contractId);
  if (!contract) throw new Error("CONTRACT_NOT_FOUND");
  const engineer = findUserById(contract.engineerId);
  const company = findUserById(contract.companyId);
  if (!engineer || !company) throw new Error("CONTRACT_PARTY_NOT_FOUND");
  const data = parseContractData(contract.data);
  const provider = createEsignProvider();
  const created = await provider.createRequest({
    contractId: contract.id,
    jobTitle: String(data.jobTitle || "Technical services agreement"),
    description: String(data.description || ""),
    amount: String(data.amount ?? ""),
    currency: String(data.currency || ""),
    contractType: String(data.type || ""),
    engineer: { id: engineer.id, name: engineer.name, email: engineer.email },
    company: { id: company.id, name: company.name, email: company.email },
  });
  return createContractEsignRequest({
    contractId: contract.id,
    provider: created.provider,
    providerRequestId: created.providerRequestId,
    engineerSignatureId: created.engineerSignatureId,
    companySignatureId: created.companySignatureId,
  });
}

export const esignRouter = Router();

esignRouter.post("/contracts/:contractId/session", requireAuth, async (req: AuthedRequest, res) => {
  const contract = findContractById(req.params.contractId);
  if (!contract) return res.status(404).json({ error: "Contract not found." });

  let signerKind: "engineer" | "company";
  if (contract.engineerId === req.userId) {
    if (contract.status !== CONTRACT_STATUS.PENDING_SIGNATURE || contract.engineerSignature) {
      return res.status(409).json({ error: "This contract is not waiting for the engineer signature." });
    }
    signerKind = "engineer";
  } else if (contract.companyId === req.userId) {
    if (contract.status !== CONTRACT_STATUS.SIGNED || contract.companySignature) {
      return res.status(409).json({ error: "This contract is not waiting for the client countersignature." });
    }
    signerKind = "company";
  } else {
    return res.status(403).json({ error: "Only the named contract parties can open a signing session." });
  }

  try {
    const request = await ensureRequest(contract.id);
    const provider = createEsignProvider();
    if (request.provider !== provider.name) {
      return res.status(409).json({ error: "The contract was created with a different e-signature provider." });
    }
    const signatureId = signerKind === "engineer"
      ? request.engineerSignatureId
      : request.companySignatureId;
    const session = await provider.createSigningSession(signatureId);
    return res.json({
      provider: session.provider,
      signUrl: session.signUrl,
      expiresAt: session.expiresAt,
      signer: signerKind,
      signerName: req.authUser?.name || (signerKind === "engineer" ? "Engineer" : "Client"),
    });
  } catch (error) {
    console.error("Could not create e-signing session", error);
    return res.status(502).json({ error: "The secure signing service is temporarily unavailable." });
  }
});

function extractCallback(body: Buffer, contentType: string): DropboxCallback | null {
  const boundaryMatch = /boundary=(?:"([^"]+)"|([^;]+))/i.exec(contentType);
  if (!boundaryMatch) return null;
  const boundary = boundaryMatch[1] || boundaryMatch[2];
  const text = body.toString("utf8");
  for (const part of text.split(`--${boundary}`)) {
    if (!/name="json"/i.test(part)) continue;
    const separator = part.indexOf("\r\n\r\n");
    if (separator < 0) continue;
    const json = part.slice(separator + 4).trim();
    try {
      return JSON.parse(json) as DropboxCallback;
    } catch {
      return null;
    }
  }
  return null;
}

function signedAt(signature: DropboxSignature) {
  return signature.signed_at
    ? new Date(signature.signed_at * 1000).toISOString()
    : new Date().toISOString();
}

function applySignedState(callback: DropboxCallback, contractId: string) {
  const request = findContractEsignRequest(contractId);
  if (!request) return;
  const signatures = callback.signature_request?.signatures || [];

  // Apply the engineer first regardless of provider array ordering so the
  // client countersignature can safely activate the contract in the same event.
  const engineerSignature = signatures.find((signature) =>
    signature.signature_id === request.engineerSignatureId && signature.status_code === "signed"
  );
  if (engineerSignature) {
    const contract = findContractById(contractId);
    if (contract && !contract.engineerSignature) {
      const engineer = findUserById(contract.engineerId);
      updateContractSignature(
        contract.id,
        "engineerSignature",
        { name: engineerSignature.signer_name || engineer?.name || "Engineer", date: signedAt(engineerSignature) },
        CONTRACT_STATUS.SIGNED
      );
    }
  }

  const companySignature = signatures.find((signature) =>
    signature.signature_id === request.companySignatureId && signature.status_code === "signed"
  );
  if (companySignature) {
    const contract = findContractById(contractId);
    if (contract?.engineerSignature && !contract.companySignature) {
      const company = findUserById(contract.companyId);
      updateContractSignature(
        contract.id,
        "companySignature",
        { name: companySignature.signer_name || company?.name || "Client", date: signedAt(companySignature) },
        CONTRACT_STATUS.ACTIVE
      );
    }
  }
}

export const dropboxSignWebhookRouter = Router();
dropboxSignWebhookRouter.post(
  "/",
  raw({ type: "multipart/form-data", limit: "1mb" }),
  (req, res) => {
    const callback = Buffer.isBuffer(req.body)
      ? extractCallback(req.body, String(req.headers["content-type"] || ""))
      : null;
    const event = callback?.event;
    if (!event?.event_type || !event.event_time || !event.event_hash) {
      return res.status(400).send("Invalid Dropbox Sign callback");
    }
    if (!verifyDropboxSignEvent({
      apiKey: process.env.DROPBOX_SIGN_API_KEY || "",
      eventTime: String(event.event_time),
      eventType: event.event_type,
      eventHash: event.event_hash,
    })) {
      return res.status(401).send("Invalid Dropbox Sign callback signature");
    }

    const providerRequestId = callback?.signature_request?.signature_request_id;
    // Dropbox Sign sends callback test/account events that have no signature
    // request. A valid provider event must still receive the documented ACK.
    if (!providerRequestId) {
      return res.status(200).type("text/plain").send("Hello API Event Received");
    }

    const request = findEsignRequestByProviderId(providerRequestId);
    if (request) {
      const relatedSignatureId = event.event_metadata?.related_signature_id || "";
      const isNew = recordContractEsignEvent({
        eventKey: `${providerRequestId}:${event.event_hash}:${relatedSignatureId}`,
        providerRequestId,
        eventType: event.event_type,
        signatureId: relatedSignatureId || null,
      });
      if (isNew) {
        if (event.event_type === "signature_request_signed" || event.event_type === "signature_request_all_signed") {
          applySignedState(callback!, request.contractId);
        }
        if (event.event_type === "signature_request_all_signed") {
          updateContractEsignStatus(request.contractId, "all_signed");
        } else if (event.event_type === "signature_request_downloadable") {
          updateContractEsignStatus(request.contractId, "completed");
        } else if (event.event_type === "signature_request_declined") {
          updateContractEsignStatus(request.contractId, "declined");
        }
      }
    }

    return res.status(200).type("text/plain").send("Hello API Event Received");
  }
);
