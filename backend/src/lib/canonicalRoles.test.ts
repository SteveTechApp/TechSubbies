import { describe, expect, it } from "vitest";
import { canonicalizeRoleId, migrateRoleFields } from "./canonicalRoles.js";

describe("canonical role compatibility", () => {
  it("maps legacy IDs, preserves canonical IDs and rejects free text", () => {
    expect(canonicalizeRoleId("senior-av-installer")).toBe("av-lead-engineer-site-manager");
    expect(canonicalizeRoleId("devops-automation-engineer")).toBe("devops-automation-engineer");
    expect(canonicalizeRoleId("AV Engineer")).toBeUndefined();
  });

  it("migrates historic job and engineer profile fields in place", () => {
    const historic = {
      jobRole: "senior-av-installer",
      roleProfiles: [{ expectationId: "m365-endpoint-engineer" }],
      selectedJobRoles: [{ roleId: "junior-it-field-engineer" }],
    };

    expect(migrateRoleFields(historic)).toBe(true);
    expect(historic).toMatchObject({
      canonicalRoleId: "av-lead-engineer-site-manager",
      roleProfiles: [{ roleId: "microsoft-365-modern-workplace-admin" }],
      selectedJobRoles: [{ roleId: "it-field-service-engineer" }],
    });
    expect(migrateRoleFields(historic)).toBe(false);
  });
});
