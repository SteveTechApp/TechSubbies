import { sendEmail } from "./email.js";

type NotifiableApplicationStatus = "Offered" | "Hired" | "Rejected";

const statusMessages: Record<NotifiableApplicationStatus, {
  subject: (jobTitle: string) => string;
  text: (jobTitle: string) => string;
}> = {
  Offered: {
    subject: (jobTitle) => `You have an offer for ${jobTitle}`,
    text: (jobTitle) =>
      `A company has progressed your TechSubbies application for "${jobTitle}" to an offer.\n\nSign in to review the opportunity and any contract details.`,
  },
  Hired: {
    subject: (jobTitle) => `You have been hired for ${jobTitle}`,
    text: (jobTitle) =>
      `Congratulations — your TechSubbies application for "${jobTitle}" has been marked as hired.\n\nSign in to review the engagement and next steps.`,
  },
  Rejected: {
    subject: (jobTitle) => `Update on your application for ${jobTitle}`,
    text: (jobTitle) =>
      `Your TechSubbies application for "${jobTitle}" was not selected on this occasion.\n\nYour profile remains available for other suitable opportunities.`,
  },
};

export async function sendApplicationStatusNotification(input: {
  to: string;
  jobTitle: string;
  status: NotifiableApplicationStatus;
}): Promise<boolean> {
  const message = statusMessages[input.status];
  try {
    await sendEmail({
      to: input.to,
      subject: message.subject(input.jobTitle),
      text: message.text(input.jobTitle),
    });
    return true;
  } catch (error) {
    console.error("Application status notification delivery failed.", error);
    return false;
  }
}
