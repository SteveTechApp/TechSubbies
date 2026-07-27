import { sendEmail } from "./email.js";

export async function sendModerationNotification(input: {
  to: string;
  suspended: boolean;
  reason?: string | null;
}): Promise<boolean> {
  const message = input.suspended
    ? {
        subject: "Your TechSubbies account has been suspended",
        text: `Your marketplace access has been suspended and all sessions were signed out.\n\nReason: ${input.reason}\n\nIf you believe this decision is incorrect, contact TechSubbies support through the Help Center.`,
      }
    : {
        subject: "Your TechSubbies account has been reactivated",
        text: "Your marketplace access has been restored. For security, previous sessions remain revoked, so please sign in again.",
      };
  try {
    await sendEmail({ to: input.to, ...message });
    return true;
  } catch (error) {
    console.error("Moderation notification delivery failed.", error);
    return false;
  }
}
