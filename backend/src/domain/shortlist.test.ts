import { describe, expect, it } from "vitest";
import { assessApplicant } from "./shortlist.js";
import type { MarketplaceApplicationDTO, PersistedJobDTO } from "./marketplaceTypes.js";
import type { UserRow } from "../lib/db.js";

const job = {
  id: "job-1", companyId: "company-1", title: "Network delivery", roleId: "network-engineer", roleIds: ["network-engineer"],
  roleRequirements: [{ roleId: "network-engineer", quantity: 1, responsibility: "deliver", skills: [{ skillId: "Routing", required: true }], prerequisites: [{ label: "Cisco experience", category: "product", minimumExperience: "practical" }] }],
  skillRequirements: [{ skillId: "Routing", required: true, roleId: "network-engineer" }], prerequisites: [{ label: "Cisco experience", category: "product", minimumExperience: "practical" }],
  jobSchemaVersion: 2, requestedExpectationId: "network-engineer", status: "active", createdAt: "2026-08-01", updatedAt: "2026-08-01",
} as PersistedJobDTO;
const application = { id: "application-1", jobId: "job-1", engineerId: "engineer-1", status: "Applied" } as MarketplaceApplicationDTO;
const baseUser: UserRow = { id: "engineer-1", email: "engineer@example.com", password: "hash", role: "Engineer", name: "Engineer", profile: "{}", emailVerified: 1, sessionVersion: 0, deletedAt: null, suspendedAt: null, suspensionReason: null, suspendedBy: null, createdAt: "2026-08-01", updatedAt: "2026-08-01" };

describe("shortlist legacy-data narrowing", () => {
  it("retains hard prerequisite exclusion while ignoring malformed profile children", () => {
    const user = { ...baseUser, profile: JSON.stringify({ profileSchemaVersion: 2, availabilityConfirmedAt: "2026-08-09T00:00:00Z", capabilityProfiles: [null, { roleId: "network-engineer", overallCapability: "deliver", capabilities: [null, { skillId: "Routing", claim: "independent" }], keywords: [null] }] }) };
    const result = assessApplicant(job, application, user, new Date("2026-08-09T12:00:00Z").getTime());
    expect(result).toMatchObject({ roleMatch: true, responsibilityFit: true, matchedSkills: ["Routing"], outcome: "excluded" });
    expect(result.missingPrerequisites).toEqual(["Cisco experience"]);
  });

  it("does not count malformed evidence or not-offered skills", () => {
    const user = { ...baseUser, profile: JSON.stringify({ profileSchemaVersion: 2, capabilityProfiles: [{ roleId: "network-engineer", overallCapability: "deliver", capabilities: [null, { skillId: "Routing", claim: "not-offered", evidenceNote: "claim" }], evidence: null }] }) };
    const result = assessApplicant({ ...job, prerequisites: [] }, application, user);
    expect(result.evidenceCount).toBe(1);
    expect(result.missingSkills).toEqual(["Routing"]);
  });
});
