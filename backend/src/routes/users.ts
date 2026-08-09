import { Router } from "express";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { findUserById, listEngineerRoleProfiles, listUsers, updateUserProfile, recordPilotFunnelEvent, syncEngineerRoleProfiles } from "../lib/db.js";
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

usersRouter.get("/me/role-profiles", requireAuth, (req: AuthedRequest, res) => {
  if (req.authUser!.role !== "Engineer") {
    return res.status(403).json({ error: "Role profiles are available to engineer accounts." });
  }
  return res.json(listEngineerRoleProfiles(req.userId!));
});

usersRouter.get("/me/export", requireAuth, (req: AuthedRequest, res) => {
  const date = new Date().toISOString().slice(0, 10);
  res.setHeader("Content-Disposition", `attachment; filename="techsubbies-account-${date}.json"`);
  return res.json(buildAccountDataExport(req.authUser!));
});

const availabilitySchema = z.object({
  availableFrom: z.string().date(),
  baseLocation: z.string().trim().min(2).max(200),
  travelRadiusMiles: z.number().int().min(0).max(1000),
  workingDays: z.array(z.enum(["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"])).min(1).max(7),
  minimumNoticeDays: z.number().int().min(0).max(365),
  overnightWork: z.boolean(),
  weekendWork: z.enum(["no", "yes", "premium-only"]),
  emergencyCallout: z.boolean(),
});

usersRouter.put("/me/availability", requireAuth, (req: AuthedRequest, res) => {
  if (req.authUser!.role !== "Engineer") {
    return res.status(403).json({ error: "Availability controls are available to engineer accounts." });
  }
  const parsed = availabilitySchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: "Enter valid availability details." });
  let profile: Record<string, unknown> = {};
  try { profile = JSON.parse(req.authUser!.profile); } catch { profile = {}; }
  const updated = updateUserProfile(req.userId!, JSON.stringify({
    ...profile,
    ...parsed.data,
    availabilityConfirmedAt: new Date().toISOString(),
  }), req.authUser!.name);
  return res.json(toPublicUser(updated!));
});

const membershipTierSchema = z.enum(["Bronze", "Silver", "Gold", "Platinum"]);

// Records a member's commercial selection without granting paid
// entitlements. The active profileTier is changed only after billing
// confirmation is implemented and verified server-side.
usersRouter.post("/me/membership-selection", requireAuth, (req: AuthedRequest, res) => {
  if (req.authUser!.role !== "Engineer") {
    return res.status(403).json({ error: "Membership plans are available to engineer accounts." });
  }
  const parsed = z.object({ tier: membershipTierSchema }).safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: "Select a valid membership tier." });
  }

  let profile: Record<string, unknown> = {};
  try {
    profile = JSON.parse(req.authUser!.profile);
  } catch {
    profile = {};
  }
  const requestedAt = new Date().toISOString();
  profile.requestedProfileTier = parsed.data.tier;
  profile.membershipRequestedAt = requestedAt;
  const updated = updateUserProfile(req.userId!, JSON.stringify(profile), req.authUser!.name);
  recordAccountAudit({
    eventType: "membership.requested",
    outcome: "success",
    userId: req.userId!,
    requestId: res.locals.requestId,
  });

  return res.status(202).json({
    activeTier: profile.profileTier ?? "Bronze",
    requestedTier: parsed.data.tier,
    requestedAt,
    user: toPublicUser(updated!),
  });
});

usersRouter.delete("/me/membership-selection", requireAuth, (req: AuthedRequest, res) => {
  if (req.authUser!.role !== "Engineer") {
    return res.status(403).json({ error: "Membership plans are available to engineer accounts." });
  }
  let profile: Record<string, unknown> = {};
  try {
    profile = JSON.parse(req.authUser!.profile);
  } catch {
    profile = {};
  }
  if (!profile.requestedProfileTier || !profile.membershipRequestedAt) {
    return res.status(404).json({ error: "No pending membership selection was found." });
  }
  const activeTier = profile.profileTier ?? "Bronze";
  delete profile.requestedProfileTier;
  delete profile.membershipRequestedAt;
  const updated = updateUserProfile(req.userId!, JSON.stringify(profile), req.authUser!.name);
  recordAccountAudit({
    eventType: "membership.request_cancelled",
    outcome: "success",
    userId: req.userId!,
    requestId: res.locals.requestId,
  });
  return res.json({ activeTier, user: toPublicUser(updated!) });
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
    userMessage: request.userMessage,
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
  const existing = findAccountDeletionRequest(req.userId!);
  if (existing?.status === "approved") {
    return res.status(409).json({
      error: "This deletion request is already approved and awaiting processing.",
      request: publicDeletionRequest(req.userId!),
    });
  }
  if (existing?.status === "pending") {
    return res.status(200).json({
      request: publicDeletionRequest(req.userId!),
      alreadyPending: true,
      notificationSent: false,
    });
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
  if (!user || user.deletedAt || user.suspendedAt) {
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

  const updates = req.body && typeof req.body === "object"
    ? { ...(req.body as Record<string, unknown>) }
    : {};
  // Membership is server-owned commercial state. Generic profile edits
  // must never activate a paid plan or forge a pending selection.
  delete updates.profileTier;
  delete updates.requestedProfileTier;
  delete updates.membershipRequestedAt;
  delete updates.membershipActivatedAt;
  delete updates.membershipActivatedBy;
  const mergedProfile = { ...currentProfile, ...updates };

  const updated = updateUserProfile(
    existing.id,
    JSON.stringify(mergedProfile),
    typeof updates.name === "string" ? updates.name : existing.name
  );
  if (existing.role === "Engineer" && Array.isArray(updates.roleProfiles)) {
    syncEngineerRoleProfiles(existing.id, updates.roleProfiles);
  }
  recordPilotFunnelEvent({
    eventType: "profile.updated",
    userId: req.userId,
    roleId: typeof updates.primaryRoleId === "string" ? updates.primaryRoleId : undefined,
  });

  return res.json(toPublicUser(updated!));
});
