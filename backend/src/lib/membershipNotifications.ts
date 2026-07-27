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
