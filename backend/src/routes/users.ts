import { Router } from "express";
import { deleteAccount, deleteDocumentsForOwner, exportAccount, findUserById, listUsers, updateUserProfile } from "../lib/db.js";
import bcrypt from "bcryptjs";
import { canonicaliseEngineerProfile } from "../domain/marketplaceSchema.js";
import { decodePersistedObject } from "../lib/persistedData.js";
import { ENGINEER_PROFILE_SCHEMA_VERSION } from "../domain/marketplaceTypes.js";
import { removeStoredDocument } from "../lib/documentStorage.js";
import { toPrivateUser, toPublicUser } from "../lib/publicUser.js";
import { requireAuth, type AuthedRequest } from "../middleware/auth.js";
import { z } from "zod";

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

usersRouter.get("/me", requireAuth, async (req:AuthedRequest,res)=>{const user=findUserById(req.userId!);if(!user)return res.status(404).json({error:"Account not found."});return res.json(toPrivateUser(user));});
usersRouter.get("/me/export",requireAuth,(req:AuthedRequest,res)=>{const data=exportAccount(req.userId!);if(!data)return res.status(404).json({error:"Account not found."});res.setHeader("Content-Disposition",`attachment; filename="techsubbies-account-${req.userId}.json"`);return res.json(data);});
usersRouter.delete("/me",requireAuth,async(req:AuthedRequest,res)=>{const parsed=z.object({password:z.string().min(1),confirmation:z.literal("DELETE MY ACCOUNT")}).safeParse(req.body);if(!parsed.success)return res.status(400).json({error:'Password and confirmation "DELETE MY ACCOUNT" are required.'});const user=findUserById(req.userId!);if(!user||!await bcrypt.compare(parsed.data.password,user.password))return res.status(401).json({error:"Password confirmation failed."});const result=deleteAccount(user.id);if(!result.deleted)return res.status(409).json({error:result.reason});deleteDocumentsForOwner(user.id).forEach(document=>removeStoredDocument(document.storageKey));return res.status(204).send();});

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

  const currentProfile=decodePersistedObject(existing.profile,{entity:"user profile",id:existing.id,...(existing.role==="Engineer"?{versionKey:"profileSchemaVersion",maximumVersion:ENGINEER_PROFILE_SCHEMA_VERSION}:{})});

  const updates = req.body && typeof req.body === "object" ? req.body : {};
  const protectedFields = ["id", "role", "email", "password", "membershipInvoices", "ownerCompanyId"];
  if (Object.keys(updates).some((key) => protectedFields.includes(key)) || JSON.stringify(updates).length > 100_000) return res.status(400).json({ error: "Profile update contains protected or excessive data." });
  let mergedProfile = { ...currentProfile, ...updates };
  if(Object.hasOwn(updates,"capabilityProfiles"))mergedProfile.roleSkillProfiles=updates.capabilityProfiles;
  try{if(existing.role==="Engineer"&&(Object.hasOwn(updates,"roleSkillProfiles")||Object.hasOwn(updates,"roleProfiles")||Object.hasOwn(updates,"capabilityProfiles")))mergedProfile=canonicaliseEngineerProfile(mergedProfile);}catch(error){return res.status(400).json({error:error instanceof Error?error.message:"Invalid capability profile."});}

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

  return res.json(toPrivateUser(updated!));
});

usersRouter.put("/me/availability", requireAuth, async (req: AuthedRequest, res) => {
  const existing = findUserById(req.userId!);
  if (!existing || existing.role !== "Engineer") return res.status(403).json({ error: "Engineer account required." });
  const parsed = z.object({
    availableFrom: z.string().date(),
    baseLocation: z.string().trim().min(2).max(200),
    travelRadiusMiles: z.number().int().min(0).max(1000),
    workingDays: z.array(z.enum(["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"])).min(1).max(7),
    minimumNoticeDays: z.number().int().min(0).max(365),
    overnightWork: z.boolean(),
    weekendWork: z.enum(["yes", "no", "premium-only"]),
    emergencyCallout: z.boolean(),
  }).safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: "Invalid availability details.", issues: parsed.error.flatten().fieldErrors });
  const profile=decodePersistedObject(existing.profile,{entity:"engineer profile",id:existing.id,versionKey:"profileSchemaVersion",maximumVersion:ENGINEER_PROFILE_SCHEMA_VERSION});
  const availabilityConfirmedAt = new Date().toISOString();
  const updated = updateUserProfile(existing.id, JSON.stringify({ ...profile, ...parsed.data, availabilityConfirmedAt }), existing.name);
  return res.json(toPrivateUser(updated!));
});
