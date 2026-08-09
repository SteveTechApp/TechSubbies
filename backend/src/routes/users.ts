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

// GET /api/users - list all profiles (for search/browse screens).
usersRouter.get("/", async (_req, res) => {
  return res.json(listUsers().map(toPublicUser));
});

usersRouter.get("/me", requireAuth, async (req:AuthedRequest,res)=>{const user=findUserById(req.userId!);if(!user)return res.status(404).json({error:"Account not found."});return res.json(toPrivateUser(user));});
usersRouter.get("/me/export",requireAuth,(req:AuthedRequest,res)=>{const data=exportAccount(req.userId!);if(!data)return res.status(404).json({error:"Account not found."});res.setHeader("Content-Disposition",`attachment; filename="techsubbies-account-${req.userId}.json"`);return res.json(data);});
usersRouter.delete("/me",requireAuth,async(req:AuthedRequest,res)=>{const parsed=z.object({password:z.string().min(1),confirmation:z.literal("DELETE MY ACCOUNT")}).safeParse(req.body);if(!parsed.success)return res.status(400).json({error:'Password and confirmation "DELETE MY ACCOUNT" are required.'});const user=findUserById(req.userId!);if(!user||!await bcrypt.compare(parsed.data.password,user.password))return res.status(401).json({error:"Password confirmation failed."});const result=deleteAccount(user.id);if(!result.deleted)return res.status(409).json({error:result.reason});deleteDocumentsForOwner(user.id).forEach(document=>removeStoredDocument(document.storageKey));return res.status(204).send();});

// GET /api/users/:profileId - a single profile.
usersRouter.get("/:profileId", async (req, res) => {
  const user = findUserById(req.params.profileId);
  if (!user) {
    return res.status(404).json({ error: "Profile not found." });
  }
  return res.json(toPublicUser(user));
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
