import { Router } from "express";
import { z } from "zod";
import {
  createConversation,
  createMessage,
  findConversationBetween,
  findConversationById,
  findUserById,
  listConversationsForUser,
  listMessagesForConversation,
} from "../lib/db.js";
import { toPublicConversation, toPublicMessage } from "../lib/publicConversation.js";
import { requireAuth, type AuthedRequest } from "../middleware/auth.js";

export const conversationsRouter = Router();

function isParticipant(conversation: { participantAId: string; participantBId: string }, userId: string): boolean {
  return conversation.participantAId === userId || conversation.participantBId === userId;
}

const startConversationSchema = z.object({ otherUserId: z.string().min(1) });

// POST /api/conversations - start a conversation with another user, or
// return the existing one if the two of them already have one (a 1:1 chat
// is never duplicated, matching the fact that the frontend keys off a
// single conversation per pair of participants).
conversationsRouter.post("/", requireAuth, async (req: AuthedRequest, res) => {
  const parsed = startConversationSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: "The other person's user id is required." });
  }
  const { otherUserId } = parsed.data;

  if (otherUserId === req.userId) {
    return res.status(400).json({ error: "You can't start a conversation with yourself." });
  }
  if (!findUserById(otherUserId)) {
    return res.status(404).json({ error: "That user could not be found." });
  }

  const existing = findConversationBetween(req.userId!, otherUserId);
  if (existing) {
    return res.status(200).json(toPublicConversation(existing));
  }

  const conversation = createConversation(req.userId!, otherUserId);
  return res.status(201).json(toPublicConversation(conversation));
});

// GET /api/conversations/me - every conversation the signed-in user is a
// participant in, most recently active first.
conversationsRouter.get("/me", requireAuth, async (req: AuthedRequest, res) => {
  return res.json(listConversationsForUser(req.userId!).map(toPublicConversation));
});

// GET /api/conversations/:conversationId/messages - full message history
// for a conversation, participants only.
conversationsRouter.get("/:conversationId/messages", requireAuth, async (req: AuthedRequest, res) => {
  const conversation = findConversationById(req.params.conversationId);
  if (!conversation) {
    return res.status(404).json({ error: "Conversation not found." });
  }
  if (!isParticipant(conversation, req.userId!)) {
    return res.status(403).json({ error: "You are not part of this conversation." });
  }
  return res.json(listMessagesForConversation(conversation.id).map(toPublicMessage));
});

const sendMessageSchema = z.object({ text: z.string().min(1) });

// POST /api/conversations/:conversationId/messages - send a message,
// participants only. Also bumps the conversation's "last message" preview
// used by the conversation list.
conversationsRouter.post("/:conversationId/messages", requireAuth, async (req: AuthedRequest, res) => {
  const conversation = findConversationById(req.params.conversationId);
  if (!conversation) {
    return res.status(404).json({ error: "Conversation not found." });
  }
  if (!isParticipant(conversation, req.userId!)) {
    return res.status(403).json({ error: "You are not part of this conversation." });
  }

  const parsed = sendMessageSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: "Message text is required." });
  }

  const message = createMessage(conversation.id, req.userId!, parsed.data.text);
  return res.status(201).json(toPublicMessage(message));
});
