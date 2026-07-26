import { Router } from "express";
import { z } from "zod";
import {
  createPartnershipRequest,
  findPartnershipRequestById,
  findPendingPartnershipRequestBetween,
  findUserByEmail,
  findUserById,
  listPartnershipRequestsForUser,
  updatePartnershipRequestStatus,
  updateUserProfile,
} from "../lib/db.js";
import { toPublicUser } from "../lib/publicUser.js";
import { requireAuth, requireRole, type AuthedRequest } from "../middleware/auth.js";

export const partnershipsRouter = Router();

function readProfile(profileJson: string): Record<string, unknown> {
  try {
    const parsed = JSON.parse(profileJson);
    return typeof parsed === "object" && parsed !== null ? parsed : {};
  } catch {
    return {};
  }
}

// Sets partnerEngineerId + partnerStatus on both engineers' stored profiles
// in one go, so the pairing is symmetric on both sides.
function linkPartners(userAId: string, userBId: string) {
  const userA = findUserById(userAId);
  const userB = findUserById(userBId);
  if (!userA || !userB) return;

  const profileA = { ...readProfile(userA.profile), partnerEngineerId: userBId, partnerStatus: "accepted" as const };
  const profileB = { ...readProfile(userB.profile), partnerEngineerId: userAId, partnerStatus: "accepted" as const };

  updateUserProfile(userA.id, JSON.stringify(profileA), userA.name);
  updateUserProfile(userB.id, JSON.stringify(profileB), userB.name);
}

const requestSchema = z.object({
  partnerEmail: z.string().email(),
});

// POST /api/partnerships/request - send (or auto-accept a matching) partner request by email.
partnershipsRouter.post("/request", requireAuth, requireRole("Engineer"), async (req: AuthedRequest, res) => {
  const parsed = requestSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: "A valid partner email is required." });
  }

  const requester = findUserById(req.userId!);
  if (!requester) {
    return res.status(404).json({ error: "Account not found." });
  }

  const partner = findUserByEmail(parsed.data.partnerEmail);
  if (!partner) {
    return res.status(404).json({ error: "No engineer found with that email." });
  }

  if (partner.id === requester.id) {
    return res.status(400).json({ error: "You can't partner with yourself." });
  }

  // Role strings are set by the frontend at registration and must match
  // the `Role` enum values in types/index.ts ("Engineer", "Company", etc).
  if (requester.role !== "Engineer" || partner.role !== "Engineer") {
    return res.status(400).json({ error: "Partnering is only available between engineer accounts." });
  }

  const requesterProfile = readProfile(requester.profile);
  if (requesterProfile.partnerStatus === "accepted") {
    return res.status(409).json({ error: "You already have an active partner. Remove them first." });
  }

  // If the target has already sent a pending request to us, accept it
  // straight away instead of creating a duplicate crossed request.
  const reciprocal = findPendingPartnershipRequestBetween(requester.id, partner.id);
  if (reciprocal && reciprocal.requesterId === partner.id) {
    updatePartnershipRequestStatus(reciprocal.id, "accepted");
    linkPartners(requester.id, partner.id);
    return res.json({ status: "accepted", request: findPartnershipRequestById(reciprocal.id) });
  }

  if (reciprocal) {
    return res.status(409).json({ error: "A partner request is already pending with this engineer." });
  }

  const created = createPartnershipRequest(requester.id, partner.id);
  return res.status(201).json({ status: "pending", request: created });
});

// POST /api/partnerships/:id/accept - the invited partner accepts.
partnershipsRouter.post("/:id/accept", requireAuth, requireRole("Engineer"), async (req: AuthedRequest, res) => {
  const request = findPartnershipRequestById(req.params.id);
  if (!request) {
    return res.status(404).json({ error: "Partner request not found." });
  }
  if (request.partnerId !== req.userId) {
    return res.status(403).json({ error: "Only the invited engineer can accept this request." });
  }
  if (request.status !== "pending") {
    return res.status(409).json({ error: "This request has already been resolved." });
  }

  updatePartnershipRequestStatus(request.id, "accepted");
  linkPartners(request.requesterId, request.partnerId);

  return res.json({ status: "accepted", request: findPartnershipRequestById(request.id) });
});

// POST /api/partnerships/:id/decline - the invited partner declines.
partnershipsRouter.post("/:id/decline", requireAuth, requireRole("Engineer"), async (req: AuthedRequest, res) => {
  const request = findPartnershipRequestById(req.params.id);
  if (!request) {
    return res.status(404).json({ error: "Partner request not found." });
  }
  if (request.partnerId !== req.userId) {
    return res.status(403).json({ error: "Only the invited engineer can decline this request." });
  }
  if (request.status !== "pending") {
    return res.status(409).json({ error: "This request has already been resolved." });
  }

  updatePartnershipRequestStatus(request.id, "declined");
  return res.json({ status: "declined", request: findPartnershipRequestById(request.id) });
});

// POST /api/partnerships/remove - unlink the signed-in engineer from their current partner.
partnershipsRouter.post("/remove", requireAuth, requireRole("Engineer"), async (req: AuthedRequest, res) => {
  const user = findUserById(req.userId!);
  if (!user) {
    return res.status(404).json({ error: "Account not found." });
  }

  const profile = readProfile(user.profile);
  const partnerId = profile.partnerEngineerId as string | undefined;

  const { partnerEngineerId, partnerStatus, ...restProfile } = profile;
  updateUserProfile(user.id, JSON.stringify(restProfile), user.name);

  if (partnerId) {
    const partner = findUserById(partnerId);
    if (partner) {
      const partnerProfile = readProfile(partner.profile);
      const { partnerEngineerId: _p, partnerStatus: _s, ...restPartnerProfile } = partnerProfile;
      updateUserProfile(partner.id, JSON.stringify(restPartnerProfile), partner.name);
    }
  }

  return res.json({ status: "removed" });
});

// GET /api/partnerships/me - incoming/outgoing requests and current accepted partner.
partnershipsRouter.get("/me", requireAuth, requireRole("Engineer"), async (req: AuthedRequest, res) => {
  const user = findUserById(req.userId!);
  if (!user) {
    return res.status(404).json({ error: "Account not found." });
  }

  const allRequests = listPartnershipRequestsForUser(user.id);
  const incoming = allRequests.filter((r) => r.partnerId === user.id && r.status === "pending");
  const outgoing = allRequests.filter((r) => r.requesterId === user.id && r.status === "pending");

  const profile = readProfile(user.profile);
  let partner = null;
  if (profile.partnerStatus === "accepted" && typeof profile.partnerEngineerId === "string") {
    const partnerUser = findUserById(profile.partnerEngineerId);
    partner = partnerUser ? toPublicUser(partnerUser) : null;
  }

  return res.json({ incoming, outgoing, partner });
});
