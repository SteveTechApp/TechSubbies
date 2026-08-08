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
  type ConversationRow,
} from "../lib/db.js";
import { countUnreadMessagesForConversation, markConversationMessagesRead } from "../lib/messagingRepository.js";
import { createNotification, toPublicNotification } from "../lib/notificationRepository.js";
import { publishRealtime } from "../lib/realtimeHub.js";
import { toPublicConversation, toPublicMessage } from "../lib/publicConversation.js";
import { requireAuth, type AuthedRequest } from "../middleware/auth.js";

export const conversationsRouter = Router();

function isParticipant(conversation: { participantAId: string; participantBId: string }, userId: string): boolean {
  return conversation.participantAId === userId || conversation.participantBId === userId;
}

function otherParticipantId(conversation: { participantAId: string; participantBId: string }, userId: string) {
  return conversation.participantAId === userId ? conversation.participantBId : conversation.participantAId;
}

function publicConversationForUser(conversation: ConversationRow, userId: string) {
  return {
    ...toPublicConversation(conversation),
    unreadCount: countUnreadMessagesForConversation(conversation.id, userId),
  };
}

const startConversationSchema = z.object({ otherUserId: z.string().min(1) });

conversationsRouter.post("/", requireAuth, async (req: AuthedRequest, res) => {
  const parsed = startConversationSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: "The other person's user id is required." });
  const { otherUserId } = parsed.data;

  if (otherUserId === req.userId) return res.status(400).json({ error: "You can't start a conversation with yourself." });
  if (!findUserById(otherUserId)) return res.status(404).json({ error: "That user could not be found." });

  const existing = findConversationBetween(req.userId!, otherUserId);
  if (existing) return res.status(200).json(publicConversationForUser(existing, req.userId!));

  const conversation = createConversation(req.userId!, otherUserId);
  return res.status(201).json(publicConversationForUser(conversation, req.userId!));
});

conversationsRouter.get("/me", requireAuth, async (req: AuthedRequest, res) => {
  return res.json(listConversationsForUser(req.userId!).map((conversation) =>
    publicConversationForUser(conversation, req.userId!)
  ));
});

conversationsRouter.get("/:conversationId/messages", requireAuth, async (req: AuthedRequest, res) => {
  const conversation = findConversationById(req.params.conversationId);
  if (!conversation) return res.status(404).json({ error: "Conversation not found." });
  if (!isParticipant(conversation, req.userId!)) {
    return res.status(403).json({ error: "You are not part of this conversation." });
  }
  return res.json(listMessagesForConversation(conversation.id).map(toPublicMessage));
});

conversationsRouter.post("/:conversationId/read", requireAuth, async (req: AuthedRequest, res) => {
  const conversation = findConversationById(req.params.conversationId);
  if (!conversation) return res.status(404).json({ error: "Conversation not found." });
  if (!isParticipant(conversation, req.userId!)) {
    return res.status(403).json({ error: "You are not part of this conversation." });
  }

  const messageIds = markConversationMessagesRead(conversation.id, req.userId!);
  const payload = {
    conversationId: conversation.id,
    readerId: req.userId!,
    messageIds,
    unreadCount: countUnreadMessagesForConversation(conversation.id, req.userId!),
  };
  publishRealtime(req.userId!, "conversation.read", payload);
  publishRealtime(otherParticipantId(conversation, req.userId!), "conversation.read", payload);
  return res.json(payload);
});

const sendMessageSchema = z.object({ text: z.string().trim().min(1).max(5000) });

conversationsRouter.post("/:conversationId/messages", requireAuth, async (req: AuthedRequest, res) => {
  const conversation = findConversationById(req.params.conversationId);
  if (!conversation) return res.status(404).json({ error: "Conversation not found." });
  if (!isParticipant(conversation, req.userId!)) {
    return res.status(403).json({ error: "You are not part of this conversation." });
  }

  const parsed = sendMessageSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: "Message text is required." });

  const message = createMessage(conversation.id, req.userId!, parsed.data.text);
  const publicMessage = toPublicMessage(message);
  const recipientId = otherParticipantId(conversation, req.userId!);
  const sender = findUserById(req.userId!);
  const refreshedConversation = findConversationById(conversation.id)!;

  const recipientConversation = publicConversationForUser(refreshedConversation, recipientId);
  const senderConversation = publicConversationForUser(refreshedConversation, req.userId!);
  publishRealtime(recipientId, "message.created", { message: publicMessage, conversation: recipientConversation });
  publishRealtime(req.userId!, "message.created", { message: publicMessage, conversation: senderConversation });
  publishRealtime(recipientId, "conversation.updated", { conversation: recipientConversation });
  publishRealtime(req.userId!, "conversation.updated", { conversation: senderConversation });

  const notification = createNotification({
    userId: recipientId,
    type: "message",
    text: `${sender?.name || "Someone"} sent you a message`,
    link: "Messages",
  });
  publishRealtime(recipientId, "notification.created", { notification: toPublicNotification(notification) });

  return res.status(201).json(publicMessage);
});
