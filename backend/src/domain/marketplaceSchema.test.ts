import { describe, expect, it } from "vitest";
import { canonicaliseEngineerProfile, canonicaliseJob } from "./marketplaceSchema.js";

describe("versioned marketplace schema adapters", () => {
  it("migrates a legacy roleProfiles engineer shape without losing decision evidence", () => {
    const profile = canonicaliseEngineerProfile({
      availabilityConfirmedAt: "2026-08-09T00:00:00.000Z",
      roleProfiles: [{
        expectationId: "avoip-networked-av-engineer",
        maximumResponsibility: "independent",
        skills: [{ skill: "validate-igmp", rating: 4 }],
        productExperience: { "Q-SYS": "configured" },
        brandTags: ["QSC"],
        evidence: [{ type: "project", note: "Commissioning record" }],
      }],
    });

    expect(profile.profileSchemaVersion).toBe(2);
    expect(profile.capabilityProfiles[0]).toMatchObject({
      roleId: "avoip-commissioning-engineer",
      overallCapability: "deliver",
      productExperience: { "Q-SYS": "configured" },
      brandTags: ["QSC"],
    });
    expect(profile.roleSkillProfiles).toEqual(profile.capabilityProfiles);
  });

  it("migrates a legacy single-role job into canonical role requirements", () => {
    const job = canonicaliseJob({
      title: "Network commissioning",
      roleId: "senior-network-engineer",
      workingArrangement: "independent",
      skillRequirements: [{ skill: "VLAN configuration", isRequired: true }],
      prerequisites: ["Cisco Catalyst configuration"],
    });

    expect(job).toMatchObject({ jobSchemaVersion: 2, roleId: "network-engineer", roleIds: ["network-engineer"] });
    expect(job.roleRequirements[0]).toMatchObject({ responsibility: "deliver", quantity: 1 });
    expect(job.skillRequirements[0]).toMatchObject({ skillId: "VLAN configuration", required: true, roleId: "network-engineer" });
  });

  it("rejects a job without a canonical role instead of persisting an ambiguous payload", () => {
    expect(() => canonicaliseJob({ title: "Mystery role", roleId: "made-up-role" })).toThrow("Choose a canonical AV or IT job role.");
  });

  it("filters malformed legacy evidence and capability entries deterministically", () => {
    const profile = canonicaliseEngineerProfile({
      roleSkillProfiles: [{ roleId: "network-engineer", capabilities: [null, { skill: "VLAN", rating: 4 }, { skill: "vlan", rating: 2 }], evidence: [null, "claim", { type: "project", note: "Observed" }] }],
    });
    expect(profile.capabilityProfiles[0].capabilities).toHaveLength(1);
    expect(profile.capabilityProfiles[0].evidence).toEqual([{ type: "project", note: "Observed" }]);
  });

  it("ignores malformed multi-role requirement children without widening the schema", () => {
    const job = canonicaliseJob({ title: "Network delivery", engineerNeeds: [{ roleId: "network-engineer", skills: [null, { name: "Routing" }], prerequisites: [null, "Cisco access"] }] });
    expect(job.roleRequirements[0].skills).toEqual([{ skillId: "Routing", required: true }]);
    expect(job.roleRequirements[0].prerequisites).toHaveLength(1);
  });
});
