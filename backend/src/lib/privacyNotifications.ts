import { sendEmail } from "./email.js";

export type PrivacyNotificationStage = "requested" | "approved" | "rejected" | "processed";

const messages: Record<PrivacyNotificationStage, { subject: string; text: string }> = {
  requested: {
    subject: "We received your TechSubbies account deletion request",
    text: "Your request is pending review. You can cancel it from Account Security until a decision is recorded.",
  },
  approved: {
    subject: "Your TechSubbies deletion request was approved",
    text: "Your request was approved for processing. Your account remains active until final anonymisation is completed.",
  },
  rejected: {
    subject: "Update on your TechSubbies deletion request",
    text: "Your request could not be processed at this time. Sign in to review its status or submit a new request after resolving outstanding requirements.",
  },
  processed: {
    subject: "Your TechSubbies account was anonymised",
    text: "Your direct identity and authentication data were anonymised. Legally required transaction references may be retained.",
  },
};

export async function sendPrivacyNotification(
  to: string,
  stage: PrivacyNotificationStage
): Promise<boolean> {
  try {
    await sendEmail({ to, ...messages[stage] });
    return true;
  } catch (error) {
    console.error(`Privacy notification delivery failed for stage ${stage}.`, error);
    return false;
  }
}
