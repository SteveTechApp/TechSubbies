import { sendEmail } from "./email.js";
import {
  listCertificatesDueExpiryReminder,
  markCertificateReminderSent,
  type CertificateReminderStage,
} from "./certificateRepository.js";

export async function sendCertificateReviewNotification(input: {
  to: string;
  name: string;
  certificateName: string;
  status: "verified" | "rejected";
  note: string;
}) {
  try {
    await sendEmail({
      to: input.to,
      subject: input.status === "verified"
        ? `Certificate verified: ${input.certificateName}`
        : `Certificate review update: ${input.certificateName}`,
      text: input.status === "verified"
        ? `Hi ${input.name},\n\nYour ${input.certificateName} certificate has been verified by TechSubbies.\n\nReview note: ${input.note || "Verified"}\n`
        : `Hi ${input.name},\n\nYour ${input.certificateName} certificate could not be verified.\n\nReason: ${input.note}\n\nPlease update the evidence and submit again if appropriate.\n`,
    });
    return true;
  } catch {
    return false;
  }
}

function reminderText(stage: CertificateReminderStage, certificateName: string, expiresAt: string) {
  const date = new Date(expiresAt).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  });
  if (stage === "expired") {
    return `${certificateName} expired on ${date}. It is no longer marketplace-visible until renewed evidence is verified.`;
  }
  const window = stage === "7d" ? "within 7 days" : "within 30 days";
  return `${certificateName} expires ${window}, on ${date}. Upload renewed evidence early to avoid losing verified marketplace visibility.`;
}

export async function runCertificateExpiryReminderSweep(now = new Date()) {
  const due = await listCertificatesDueExpiryReminder(now);
  let sent = 0;
  for (const item of due) {
    try {
      await sendEmail({
        to: item.ownerEmail,
        subject: item.stage === "expired"
          ? `Certificate expired: ${item.certificate.name}`
          : `Certificate expiry reminder: ${item.certificate.name}`,
        text: `Hi ${item.ownerName},\n\n${reminderText(item.stage, item.certificate.name, item.certificate.expiresAt!)}\n`,
      });
      await markCertificateReminderSent(item.certificate.id, item.stage);
      sent += 1;
    } catch {
      // Leave the reminder stage unchanged so a later sweep can retry.
    }
  }
  return { due: due.length, sent };
}

let expiryTimer: NodeJS.Timeout | undefined;

export function startCertificateExpiryReminderScheduler() {
  if (process.env.NODE_ENV === "test" || expiryTimer) return;
  void runCertificateExpiryReminderSweep();
  expiryTimer = setInterval(() => {
    void runCertificateExpiryReminderSweep();
  }, 24 * 60 * 60 * 1000);
  expiryTimer.unref();
}
