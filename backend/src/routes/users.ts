import { Router } from "express";
import { findUserById, listUsers, updateUserProfile } from "../lib/db.js";
import { toPublicUser } from "../lib/publicUser.js";
import { requireAuth, type AuthedRequest } from "../middleware/auth.js";

export const usersRouter = Router();

// GET /api/users - list all profiles (for search/browse screens).
usersRouter.get("/", async (_req, res) => {
  return res.json(listUsers().map(toPublicUser));
});

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
