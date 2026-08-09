import { sendEmail } from "./email.js";

export async function sendJobModerationNotification(input: {
  to: string;
  title: string;
  jobId: string;
  status: "active" | "closed";
  reason?: string | null;
}): Promise<boolean> {
  const message = input.status === "closed"
    ? {
        subject: `Your TechSubbies job listing was closed: ${input.title}`,
        text: `Your listing "${input.title}" (${input.jobId}) was closed and removed from public search.\n\nReason: ${input.reason}\n\nIf you believe this decision is incorrect, contact TechSubbies support through the Help Center.`,
      }
    : {
        subject: `Your TechSubbies job listing was reopened: ${input.title}`,
        text: `Your listing "${input.title}" (${input.jobId}) was reopened and is visible in public job search again.`,
      };
  try {
    await sendEmail({ to: input.to, ...message });
    return true;
  } catch (error) {
    console.error("Job moderation notification delivery failed.", error);
    return false;
  }
}
