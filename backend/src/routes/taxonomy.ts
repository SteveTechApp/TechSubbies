import { Router } from "express";
import { z } from "zod";
import {
  createTaxonomyDraft,
  findTaxonomyVersion,
  listPendingTaxonomyReviews,
  listPublishedTaxonomyVersions,
  listTaxonomyVersions,
  publishTaxonomyVersion,
  reviewTaxonomyVersion,
  submitTaxonomyVersion,
  toPublicTaxonomyVersion,
  updateTaxonomyDraft,
  type TaxonomyVersionStatus,
} from "../lib/taxonomyRepository.js";
import { requireAuth, requireRole, type AuthedRequest } from "../middleware/auth.js";

export const taxonomyRouter = Router();
export const adminTaxonomyRouter = Router();

const stringList = z.array(z.string().trim().min(1).max(300)).max(100);
const roleSkillSchema = z.object({
  id: z.string().trim().min(1).max(200),
  label: z.string().trim().min(1).max(200),
  description: z.string().trim().max(2000),
  requiredForGoodMatch: z.boolean(),
  evidenceRecommended: z.boolean(),
  suggestedTags: z.array(z.string().trim().min(1).max(100)).max(100),
});
const roleSkillGroupSchema = z.object({
  id: z.string().trim().min(1).max(200),
  title: z.string().trim().min(1).max(200),
  description: z.string().trim().max(2000),
  skills: z.array(roleSkillSchema).max(150),
});
const roleSnapshotSchema = z.object({
  id: z.string().trim().min(1).max(150),
  market: z.enum(["av", "it", "hybrid"]),
  family: z.string().trim().min(1).max(100),
  title: z.string().trim().min(2).max(200),
  shortTitle: z.string().trim().min(2).max(200),
  level: z.enum(["entry", "skilled", "specialist", "lead"]),
  summary: z.string().trim().min(10).max(4000),
  suitableFor: stringList,
  typicalProjects: stringList,
  skillGroups: z.array(roleSkillGroupSchema).min(1).max(40),
  recommendedTags: z.array(z.string().trim().min(1).max(100)).max(100),
  evidenceTypes: z.array(z.string().trim().min(1).max(150)).max(100),
});

const draftSchema = z.object({
  roleId: z.string().trim().min(1).max(150),
  snapshot: roleSnapshotSchema,
  changeNote: z.string().trim().min(10).max(1000),
});

const statusSchema = z.enum(["draft", "in_review", "approved", "rejected", "published", "superseded"]);

adminTaxonomyRouter.use(requireAuth, requireRole("Admin"));

adminTaxonomyRouter.get("/versions", (req, res) => {
  const parsed = z.object({
    roleId: z.string().trim().max(150).optional(),
    status: statusSchema.optional(),
  }).safeParse({
    roleId: req.query.roleId || undefined,
    status: req.query.status || undefined,
  });
  if (!parsed.success) return res.status(400).json({ error: "Invalid taxonomy version filter." });
  const versions = listTaxonomyVersions(parsed.data as { roleId?: string; status?: TaxonomyVersionStatus })
    .map(toPublicTaxonomyVersion);
  return res.json({ versions });
});

adminTaxonomyRouter.post("/versions", (req: AuthedRequest, res) => {
  const parsed = draftSchema.safeParse(req.body);
  if (!parsed.success || parsed.data.roleId !== parsed.data.snapshot.id) {
    return res.status(400).json({ error: "A valid role snapshot and meaningful change note are required." });
  }
  try {
    const version = createTaxonomyDraft({
      roleId: parsed.data.roleId,
      snapshot: parsed.data.snapshot,
      changeNote: parsed.data.changeNote,
      createdBy: req.userId!,
    });
    return res.status(201).json({ version: toPublicTaxonomyVersion(version) });
  } catch (error) {
    if (error instanceof Error && error.message === "TAXONOMY_OPEN_VERSION_EXISTS") {
      return res.status(409).json({ error: "This role already has an open taxonomy version." });
    }
    throw error;
  }
});

adminTaxonomyRouter.patch("/versions/:versionId", (req, res) => {
  const parsed = z.object({
    snapshot: roleSnapshotSchema,
    changeNote: z.string().trim().min(10).max(1000),
  }).safeParse(req.body);
  const existing = findTaxonomyVersion(req.params.versionId);
  if (!parsed.success || !existing || parsed.data.snapshot.id !== existing.roleId) {
    return res.status(existing ? 400 : 404).json({ error: existing ? "Invalid taxonomy draft." : "Taxonomy version not found." });
  }
  const updated = updateTaxonomyDraft({
    id: existing.id,
    snapshot: parsed.data.snapshot,
    changeNote: parsed.data.changeNote,
  });
  if (!updated) return res.status(409).json({ error: "Only a draft taxonomy version can be edited." });
  return res.json({ version: toPublicTaxonomyVersion(updated) });
});

adminTaxonomyRouter.post("/versions/:versionId/submit", (req, res) => {
  const submitted = submitTaxonomyVersion(req.params.versionId);
  if (!submitted) return res.status(409).json({ error: "Only a draft can be submitted for practitioner review." });
  return res.json({ version: toPublicTaxonomyVersion(submitted) });
});

adminTaxonomyRouter.post("/versions/:versionId/publish", (req: AuthedRequest, res) => {
  const published = publishTaxonomyVersion({ id: req.params.versionId, publishedBy: req.userId! });
  if (!published) return res.status(409).json({ error: "Practitioner approval is required before publishing." });
  return res.json({ version: toPublicTaxonomyVersion(published) });
});

// Published role definitions are product catalogue data, not account data.
// Expose them before the authentication gate so signup/job-intake consumers
// can hydrate the approved taxonomy before a user has signed in.
taxonomyRouter.get("/published", (_req, res) => {
  return res.json({ versions: listPublishedTaxonomyVersions().map(toPublicTaxonomyVersion) });
});

taxonomyRouter.use(requireAuth);

taxonomyRouter.get("/reviews/pending", requireRole("Engineer"), (_req, res) => {
  return res.json({ versions: listPendingTaxonomyReviews().map(toPublicTaxonomyVersion) });
});

taxonomyRouter.post("/reviews/:versionId", requireRole("Engineer"), (req: AuthedRequest, res) => {
  const parsed = z.object({
    decision: z.enum(["approved", "rejected"]),
    note: z.string().trim().min(10).max(1000),
  }).safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: "Choose approve or reject and provide a review note of at least 10 characters." });
  }
  try {
    const reviewed = reviewTaxonomyVersion({
      versionId: req.params.versionId,
      reviewerUserId: req.userId!,
      decision: parsed.data.decision,
      note: parsed.data.note,
    });
    if (!reviewed) return res.status(409).json({ error: "This version is no longer awaiting practitioner review." });
    return res.json({ version: toPublicTaxonomyVersion(reviewed) });
  } catch (error) {
    if (error instanceof Error && /UNIQUE constraint failed/.test(error.message)) {
      return res.status(409).json({ error: "You have already reviewed this taxonomy version." });
    }
    throw error;
  }
});
