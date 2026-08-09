export type MembershipPlan = "professional" | "skills" | "business";

const record = (value: unknown): Record<string, unknown> | null => typeof value === "object" && value !== null && !Array.isArray(value)
  ? value as Record<string, unknown>
  : null;

export function hasOpenMembershipInvoice(value: unknown, plan: MembershipPlan): boolean {
  return Array.isArray(value) && value.some((entry) => {
    const invoice = record(entry);
    return invoice?.plan === plan && invoice.status === "open";
  });
}

export function membershipInvoiceId(value: unknown): string {
  const id = record(value)?.id;
  if (typeof id !== "string" || !id) throw new Error("Membership invoice could not be created.");
  return id;
}
