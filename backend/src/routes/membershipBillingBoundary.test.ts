import { describe, expect, it } from "vitest";
import { hasOpenMembershipInvoice, membershipInvoiceId } from "../domain/membershipInvoice.js";

describe("membership invoice persistence narrowing", () => {
  it("detects only matching open invoices from persisted provider data", () => {
    expect(hasOpenMembershipInvoice([{ plan: "skills", status: "open" }, null, { plan: "professional", status: "paid" }], "skills")).toBe(true);
    expect(hasOpenMembershipInvoice([{ plan: "skills", status: "paid" }, "invalid"], "skills")).toBe(false);
    expect(hasOpenMembershipInvoice({ invoices: [] }, "skills")).toBe(false);
  });

  it("requires a persisted invoice identifier before checkout", () => {
    expect(membershipInvoiceId({ id: "invoice-1" })).toBe("invoice-1");
    expect(() => membershipInvoiceId({ id: 42 })).toThrow("Membership invoice could not be created.");
  });
});
