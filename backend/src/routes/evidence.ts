import { createHash } from "node:crypto";
import { Router, raw } from "express";
import { z } from "zod";
import { requireAuth, requireRole, type AuthedRequest } from "../middleware/auth.js";
import {
  createEvidenceObject,
  findEvidenceObject,
  listEvidenceAccessEvents,
  listEvidenceObjectsForOwner,
  markEvidenceReady,
  recordEvidenceAccess,
  type EvidenceObjectRow,
} from "../lib/evidenceRepository.js";
import { getEvidenceObject, putEvidenceObject } from "../lib/evidenceStorage.js";
import { canMarketplaceReadEvidence } from "../lib/certificateRepository.js";

const MAX_EVIDENCE_BYTES = 10 * 1024 * 1024;
const uploadBody = raw({ type: "*/*", limit: `${MAX_EVIDENCE_BYTES}b` });
const allowedContentTypes = new Set(["application/pdf", "image/jpeg", "image/png"]);

function publicEvidence(row: EvidenceObjectRow) {
  return {
    id: row.id,
    purpose: row.purpose,
    fileName: row.fileName,
    contentType: row.contentType,
    declaredSizeBytes: row.declaredSizeBytes,
    storedSizeBytes: row.storedSizeBytes,
    sha256: row.sha256,
    status: row.status,
    createdAt: row.createdAt,
    updatedAt: row.updatedAt,
  };
}

function requestId(req: AuthedRequest) {
  return String(req.res?.locals.requestId || "unknown-request");
}

async function canReadEvidence(req: AuthedRequest, evidence: EvidenceObjectRow) {
  if (req.userId === evidence.ownerUserId || req.authUser?.role === "Admin") return true;
  if (!["Company", "Resourcing Company"].includes(req.authUser?.role || "")) return false;
  if (!req.authUser?.emailVerified) return false;
  return canMarketplaceReadEvidence(evidence.id);
}

export const evidenceRouter = Router();
evidenceRouter.use(requireAuth);

evidenceRouter.get("/mine", async (req: AuthedRequest, res) => {
  return res.json((await listEvidenceObjectsForOwner(req.userId!)).map(publicEvidence));
});

evidenceRouter.post("/", requireRole("Engineer"), async (req: AuthedRequest, res) => {
  const parsed = z.object({
    purpose: z.enum(["cv", "certification", "skill_evidence"]),
    fileName: z.string().trim().min(1).max(180),
    contentType: z.enum(["application/pdf", "image/jpeg", "image/png"]),
    sizeBytes: z.number().int().min(1).max(MAX_EVIDENCE_BYTES),
  }).safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({
      error: "Evidence must be a PDF, JPEG or PNG up to 10 MB with valid metadata.",
    });
  }

  const evidence = await createEvidenceObject({
    ownerUserId: req.userId!,
    purpose: parsed.data.purpose,
    fileName: parsed.data.fileName,
    contentType: parsed.data.contentType,
    declaredSizeBytes: parsed.data.sizeBytes,
  });
  await recordEvidenceAccess({
    evidenceId: evidence.id,
    actorUserId: req.userId!,
    action: "metadata.created",
    outcome: "success",
    requestId: requestId(req),
  });
  return res.status(201).json(publicEvidence(evidence));
});

evidenceRouter.put(
  "/:evidenceId/content",
  requireRole("Engineer"),
  uploadBody,
  async (req: AuthedRequest, res) => {
    const evidence = await findEvidenceObject(req.params.evidenceId);
    if (!evidence) return res.status(404).json({ error: "Evidence item not found." });
    if (evidence.ownerUserId !== req.userId) {
      await recordEvidenceAccess({
        evidenceId: evidence.id,
        actorUserId: req.userId!,
        action: "content.access_denied",
        outcome: "denied",
        requestId: requestId(req),
      });
      return res.status(403).json({ error: "Only the evidence owner can upload this file." });
    }

    const contentType = String(req.headers["content-type"] || "").split(";")[0].trim();
    if (!allowedContentTypes.has(contentType) || contentType !== evidence.contentType) {
      return res.status(415).json({ error: "Uploaded content type does not match the evidence metadata." });
    }
    if (!Buffer.isBuffer(req.body) || req.body.length !== evidence.declaredSizeBytes) {
      return res.status(400).json({ error: "Uploaded file size does not match the declared evidence size." });
    }

    try {
      await putEvidenceObject(evidence.objectKey, req.body, evidence.contentType);
      const sha256 = createHash("sha256").update(req.body).digest("hex");
      const ready = (await markEvidenceReady(evidence.id, req.body.length, sha256))!;
      await recordEvidenceAccess({
        evidenceId: evidence.id,
        actorUserId: req.userId!,
        action: "content.uploaded",
        outcome: "success",
        requestId: requestId(req),
      });
      return res.json(publicEvidence(ready));
    } catch {
      await recordEvidenceAccess({
        evidenceId: evidence.id,
        actorUserId: req.userId!,
        action: "content.access_failed",
        outcome: "failed",
        requestId: requestId(req),
      });
      return res.status(502).json({ error: "Evidence storage is temporarily unavailable." });
    }
  }
);

evidenceRouter.get("/:evidenceId/audit", requireRole("Admin"), async (req, res) => {
  const evidence = await findEvidenceObject(req.params.evidenceId);
  if (!evidence) return res.status(404).json({ error: "Evidence item not found." });
  return res.json(await listEvidenceAccessEvents(evidence.id));
});

evidenceRouter.get("/:evidenceId/content", async (req: AuthedRequest, res) => {
  const evidence = await findEvidenceObject(req.params.evidenceId);
  if (!evidence) return res.status(404).json({ error: "Evidence item not found." });
  if (!(await canReadEvidence(req, evidence))) {
    await recordEvidenceAccess({
      evidenceId: evidence.id,
      actorUserId: req.userId!,
      action: "content.access_denied",
      outcome: "denied",
      requestId: requestId(req),
    });
    return res.status(403).json({ error: "This evidence file is private." });
  }
  if (evidence.status !== "ready") {
    return res.status(409).json({ error: "Evidence content has not been uploaded yet." });
  }

  try {
    const stored = await getEvidenceObject(evidence.objectKey, evidence.contentType);
    await recordEvidenceAccess({
      evidenceId: evidence.id,
      actorUserId: req.userId!,
      action: "content.accessed",
      outcome: "success",
      requestId: requestId(req),
    });
    res.setHeader("Content-Type", stored.contentType);
    res.setHeader("Content-Length", String(stored.body.length));
    res.setHeader("Cache-Control", "private, no-store");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename*=UTF-8''${encodeURIComponent(evidence.fileName)}`
    );
    return res.send(stored.body);
  } catch {
    await recordEvidenceAccess({
      evidenceId: evidence.id,
      actorUserId: req.userId!,
      action: "content.access_failed",
      outcome: "failed",
      requestId: requestId(req),
    });
    return res.status(502).json({ error: "Evidence storage is temporarily unavailable." });
  }
});
