import { sendEmail } from "./email.js";

export async function sendMembershipActivationNotification(input: {
  to: string;
  name: string;
  tier: string;
}): Promise<boolean> {
  try {
    await sendEmail({
      to: input.to,
      subject: `Your TechSubbies ${input.tier} membership is active`,
      text:
        `Hello ${input.name},\n\nYour ${input.tier} membership is now active.\n\n` +
        "Your membership covers access to TechSubbies. Any engineering engagement, invoice, fee or payment " +
        "is agreed and managed directly between you and the company; TechSubbies does not take a percentage.",
    });
    return true;
  } catch (error) {
    console.error("Membership activation notification delivery failed.", error);
    return false;
  }
}

export async function sendMembershipRejectionNotification(input: {
  to: string;
  name: string;
  requestedTier: string;
  activeTier: string;
  reason: string;
}): Promise<boolean> {
  try {
    await sendEmail({
      to: input.to,
      subject: `Update on your TechSubbies ${input.requestedTier} membership request`,
      text:
        `Hello ${input.name},\n\nWe could not verify your ${input.requestedTier} membership request.\n\n` +
        `Reason: ${input.reason}\n\nYour existing ${input.activeTier} membership remains active. ` +
        "You can submit another plan selection from Membership & Billing.",
    });
    return true;
  } catch (error) {
    console.error("Membership rejection notification delivery failed.", error);
    return false;
  }
}
