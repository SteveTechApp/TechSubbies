import {
  listApplicationsForEngineer,
  listContractsForUser,
  listConversationsForUser,
  listJobsForCompany,
  listMessagesForConversation,
  listPartnershipRequestsForUser,
  type UserRow,
} from "./db.js";
import { listAccountAuditForUser } from "./accountAudit.js";
import { toPublicUser } from "./publicUser.js";
import { toPublicApplication, toPublicJob } from "./publicJob.js";
import { toPublicContract } from "./publicContract.js";

export function buildAccountDataExport(user: UserRow, generatedAt = new Date().toISOString()) {
  const conversations = listConversationsForUser(user.id);
  return {
    format: "techsubbies-account-export",
    version: 2,
    generatedAt,
    account: toPublicUser(user),
    marketplace: {
      jobs: listJobsForCompany(user.id).map(toPublicJob),
      applications: listApplicationsForEngineer(user.id).map(toPublicApplication),
      contracts: listContractsForUser(user.id).map(toPublicContract),
      partnerships: listPartnershipRequestsForUser(user.id),
      conversations: conversations.map((conversation) => ({
        ...conversation,
        messages: listMessagesForConversation(conversation.id),
      })),
    },
    securityActivity: listAccountAuditForUser(user.id, 50).map((event) => ({
      eventType: event.eventType,
      outcome: event.outcome,
      createdAt: event.createdAt,
    })),
  };
}
