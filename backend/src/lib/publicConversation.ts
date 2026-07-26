import type { ConversationRow, MessageRow } from "./db.js";

// Shapes a database conversation row into the `Conversation` shape the
// frontend expects (see types/index.ts `Conversation`) - the two indexed
// participant columns become the `participantIds` array the frontend reads.
export function toPublicConversation(conversation: ConversationRow) {
  return {
    id: conversation.id,
    participantIds: [conversation.participantAId, conversation.participantBId],
    lastMessageText: conversation.lastMessageText,
    lastMessageTimestamp: conversation.lastMessageTimestamp,
  };
}

// Shapes a database message row into the `Message` shape the frontend
// expects (see types/index.ts `Message`).
export function toPublicMessage(message: MessageRow) {
  return {
    id: message.id,
    conversationId: message.conversationId,
    senderId: message.senderId,
    text: message.text,
    timestamp: message.timestamp,
    isRead: Boolean(message.isRead),
  };
}
