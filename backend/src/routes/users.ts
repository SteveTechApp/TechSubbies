import { Router } from "express";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { findUserById, listUsers, updateUserProfile } from "../lib/db.js";
import { toDirectoryUser, toPublicUser } from "../lib/publicUser.js";
import { requireAuth, type AuthedRequest } from "../middleware/auth.js";
import { buildAccountDataExport } from "../lib/accountExport.js";
import {
  cancelAccountDeletion,
  findAccountDeletionRequest,
  requestAccountDeletion,
  accountDeletionResponseDueAt,
} from "../lib/accountDeletion.js";
import { recordAccountAudit } from "../lib/accountAudit.js";
import { sendPrivacyNotification } from "../lib/privacyNotifications.js";

export const usersRouter = Router();

// Validate the current server-issued session. Keep this route before
// /:profileId so "me" is not interpreted as a profile id.
usersRouter.get("/me", requireAuth, async (req: AuthedRequest, res) => {
  return res.json(toPublicUser(req.authUser!));
});

usersRouter.get("/me/export", requireAuth, (req: AuthedRequest, res) => {
  const date = new Date().toISOString().slice(0, 10);
  res.setHeader("Content-Disposition", `attachment; filename="techsubbies-account-${date}.json"`);
  return res.json(buildAccountDataExport(req.authUser!));
});

function publicDeletionRequest(userId: string) {
  const request = findAccountDeletionRequest(userId);
  if (!request) return null;
  return {
    reference: request.id,
    status: request.status,
    requestedAt: request.requestedAt,
    responseDueAt: accountDeletionResponseDueAt(request.requestedAt),
    cancelledAt: request.cancelledAt,
    reviewedAt: request.reviewedAt,
    resolutionNote: request.resolutionNote,
    processedAt: request.processedAt,
  };
}

usersRouter.get("/me/deletion-request", requireAuth, (req: AuthedRequest, res) => {
  return res.json({ request: publicDeletionRequest(req.userId!) });
});

usersRouter.post("/me/deletion-request", requireAuth, async (req: AuthedRequest, res) => {
  const parsed = z.object({ password: z.string().min(1) }).safeParse(req.body);
  if (!parsed.success || !(await bcrypt.compare(parsed.data.password, req.authUser!.password))) {
    return res.status(401).json({ error: "Password confirmation is incorrect." });
  }
  requestAccountDeletion(req.userId!);
  recordAccountAudit({
    eventType: "deletion.requested",
    outcome: "success",
    userId: req.userId!,
    requestId: res.locals.requestId,
  });
  const notificationSent = await sendPrivacyNotification(req.authUser!.email, "requested");
  return res.status(202).json({
    request: publicDeletionRequest(req.userId!),
    notificationSent,
  });
});

usersRouter.delete("/me/deletion-request", requireAuth, (req: AuthedRequest, res) => {
  const existing = findAccountDeletionRequest(req.userId!);
  if (!existing || existing.status !== "pending") {
    return res.status(404).json({ error: "No pending deletion request was found." });
  }
  cancelAccountDeletion(req.userId!);
  recordAccountAudit({
    eventType: "deletion.cancelled",
    outcome: "success",
    userId: req.userId!,
    requestId: res.locals.requestId,
  });
  return res.json({ request: publicDeletionRequest(req.userId!) });
});

// GET /api/users - list all profiles (for search/browse screens).
usersRouter.get("/", async (_req, res) => {
  const requestedLimit = Number(_req.query.limit);
  const requestedOffset = Number(_req.query.offset);
  const limit = Number.isFinite(requestedLimit) ? Math.min(100, Math.max(1, Math.floor(requestedLimit))) : 50;
  const offset = Number.isFinite(requestedOffset) ? Math.max(0, Math.floor(requestedOffset)) : 0;
  const users = listUsers();
  res.setHeader("X-Total-Count", String(users.length));
  return res.json(users.slice(offset, offset + limit).map(toDirectoryUser));
});

// GET /api/users/:profileId - a single profile.
usersRouter.get("/:profileId", async (req, res) => {
  const user = findUserById(req.params.profileId);
  if (!user) {
    return res.status(404).json({ error: "Profile not found." });
  }
  return res.json(toDirectoryUser(user));
});

// PATCH /api/users/me - update the signed-in user's own profile.
usersRouter.patch("/me", requireAuth, async (req: AuthedRequest, res) => {
  const existing = findUserById(req.userId!);
  if (!existing) {
    return res.status(404).json({ error: "Account not found." });
  }

  let currentProfile: Record<string, unknown> = {};
  try {
    currentProfile = JSON.parse(existing.profile);
  } catch {
    currentProfile = {};
  }

  const updates = req.body && typeof req.body === "object" ? req.body : {};
  const mergedProfile = { ...currentProfile, ...updates };

  const updated = updateUserProfile(
    existing.id,
    JSON.stringify(mergedProfile),
    typeof updates.name === "string" ? updates.name : existing.name
  );

  return res.json(toPublicUser(updated!));
});
