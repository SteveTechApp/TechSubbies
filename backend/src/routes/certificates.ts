import { Router } from "express";
import { z } from "zod";
import { requireAuth, requireRole, type AuthedRequest } from "../middleware/auth.js";
import {
  createCertificateSubmission,
  findCertificateById,
  listAdminCertificateQueue,
  listCertificatesForOwner,
  listMarketplaceCertificates,
  reviewCertificate,
  setCertificateVisibility,
  type CertificateRow,
} from "../lib/certificateRepository.js";
import { findUserById } from "../lib/db.js";
import {
  runCertificateExpiryReminderSweep,
  sendCertificateReviewNotification,
} from "../lib/certificateNotifications.js";

const dateOnly = /^\d{4}-\d{2}-\d{2}$/;

function isoDate(value?: string) {
  return value ? new Date(`${value}T00:00:00.000Z`).toISOString() : undefined;
}

function publicCertificate(certificate: CertificateRow) {
  return {
    id: certificate.id,
    evidenceId: certificate.evidenceId,
    name: certificate.name,
    issuer: certificate.issuer,
    certificateNumber: certificate.certificateNumber,
    issuedAt: certificate.issuedAt,
    expiresAt: certificate.expiresAt,
    verificationStatus: certificate.verificationStatus,
    visibility: certificate.visibility,
    reviewNote: certificate.reviewNote,
    reviewedAt: certificate.reviewedAt,
    createdAt: certificate.createdAt,
    updatedAt: certificate.updatedAt,
  };
}

export const certificatesRouter = Router();
certificatesRouter.use(requireAuth);

certificatesRouter.get("/mine", requireRole("Engineer"), (req: AuthedRequest, res) => {
  return res.json(listCertificatesForOwner(req.userId!).map(publicCertificate));
});

certificatesRouter.post("/", requireRole("Engineer"), (req: AuthedRequest, res) => {
  const parsed = z.object({
    evidenceId: z.string().uuid(),
    name: z.string().trim().min(2).max(160),
    issuer: z.string().trim().min(2).max(160),
    certificateNumber: z.string().trim().max(120).optional(),
    issuedAt: z.string().regex(dateOnly).optional(),
    expiresAt: z.string().regex(dateOnly).optional(),
    visibility: z.enum(["private", "marketplace"]).default("private"),
  }).safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: "Provide valid certificate details and uploaded certification evidence." });
  }

  const issuedAt = isoDate(parsed.data.issuedAt);
  const expiresAt = isoDate(parsed.data.expiresAt);
  if (issuedAt && expiresAt && new Date(expiresAt).getTime() <= new Date(issuedAt).getTime()) {
    return res.status(400).json({ error: "Certificate expiry must be after its issue date." });
  }

  try {
    const certificate = createCertificateSubmission({
      ownerUserId: req.userId!,
      evidenceId: parsed.data.evidenceId,
      name: parsed.data.name,
      issuer: parsed.data.issuer,
      certificateNumber: parsed.data.certificateNumber,
      issuedAt,
      expiresAt,
      visibility: parsed.data.visibility,
    });
    return res.status(201).json(publicCertificate(certificate));
  } catch (error) {
    const code = error instanceof Error ? error.message : "";
    if (code === "CERTIFICATE_ALREADY_SUBMITTED") {
      return res.status(409).json({ error: "This evidence has already been submitted for certificate verification." });
    }
    if (code === "EVIDENCE_NOT_READY_CERTIFICATE") {
      return res.status(409).json({ error: "Upload certification evidence before submitting it for verification." });
    }
    return res.status(403).json({ error: "The selected certification evidence is not available to this account." });
  }
});

certificatesRouter.patch("/:certificateId/visibility", requireRole("Engineer"), (req: AuthedRequest, res) => {
  const parsed = z.object({ visibility: z.enum(["private", "marketplace"]) }).safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: "Choose Private or Marketplace visibility." });
  const updated = setCertificateVisibility(
    req.params.certificateId,
    req.userId!,
    parsed.data.visibility
  );
  if (!updated) return res.status(404).json({ error: "Certificate not found." });
  return res.json(publicCertificate(updated));
});

certificatesRouter.get("/engineer/:userId", (req: AuthedRequest, res) => {
  const role = req.authUser?.role;
  if (!role || !["Company", "Resourcing Company", "Admin"].includes(role)) {
    return res.status(403).json({ error: "Your account role cannot view marketplace certificate evidence." });
  }
  return res.json(listMarketplaceCertificates(req.params.userId).map(publicCertificate));
});

export const adminCertificatesRouter = Router();
adminCertificatesRouter.use(requireAuth, requireRole("Admin"));

adminCertificatesRouter.get("/", (req, res) => {
  const parsed = z.enum(["pending", "verified", "rejected"]).safeParse(req.query.status || "pending");
  if (!parsed.success) return res.status(400).json({ error: "Unsupported certificate verification status." });
  return res.json({ certificates: listAdminCertificateQueue(parsed.data) });
});

adminCertificatesRouter.patch("/:certificateId/review", async (req: AuthedRequest, res) => {
  const parsed = z.discriminatedUnion("status", [
    z.object({ status: z.literal("verified"), note: z.string().trim().max(1000).default("") }),
    z.object({ status: z.literal("rejected"), note: z.string().trim().min(10).max(1000) }),
  ]).safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: "Choose verified or rejected; rejection requires a reason of at least 10 characters." });
  }

  const current = findCertificateById(req.params.certificateId);
  if (!current) return res.status(404).json({ error: "Certificate not found." });
  const updated = reviewCertificate(
    current.id,
    req.userId!,
    parsed.data.status,
    parsed.data.note
  );
  if (!updated) return res.status(409).json({ error: "This certificate has already been reviewed." });

  const owner = findUserById(updated.ownerUserId);
  const notificationSent = owner
    ? await sendCertificateReviewNotification({
        to: owner.email,
        name: owner.name,
        certificateName: updated.name,
        status: parsed.data.status,
        note: parsed.data.note,
      })
    : false;

  return res.json({ certificate: publicCertificate(updated), notificationSent });
});

adminCertificatesRouter.post("/expiry-reminders/run", async (_req, res) => {
  return res.json(await runCertificateExpiryReminderSweep());
});
