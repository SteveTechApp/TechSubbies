import { describe, expect, it, vi } from "vitest";
import {
  analyseTeamCoverage,
  buildCapabilityPassport,
  calculateAvailabilityConfidence,
  checkOpportunityReadiness,
  explainCandidateMatch,
  generateTechnicalWorkPack,
} from "./trustEngine";
import type { EngineerProfile } from "../types";

describe("trust and resourcing engine", () => {
  it("makes availability confidence decay rather than presenting stale availability as fact", () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-08-08T12:00:00Z"));
    expect(calculateAvailabilityConfidence("2026-08-05T12:00:00Z").score).toBe(100);
    expect(calculateAvailabilityConfidence("2026-05-01T12:00:00Z").label).toBe("stale");
    vi.useRealTimers();
  });

  it("promotes repeated positive client validation to proven role confidence", () => {
    const engineer = { id: "eng-1", sectorProfiles: ["AV"], roleSkillProfiles: [{ roleId: "av-commissioning", overallCapability: "deliver", evidence: [] }], certifications: [] } as unknown as EngineerProfile;
    const validations = [1, 2, 3].map((index) => ({ id: `v-${index}`, contractId: `c-${index}`, engineerId: "eng-1", companyId: "co-1", validatorId: "user-1", roleId: "av-commissioning", responsibilityMet: true, capabilitiesObserved: [], unexpectedSupervisionRequired: false, wouldUseAgainForRole: true, createdAt: "2026-08-01" }));
    expect(buildCapabilityPassport(engineer, validations).roleProfiles[0].confidence).toBe("proven");
  });

  it("ignores malformed legacy role profiles while preserving valid evidence", () => {
    const engineer = {
      id: "eng-1",
      roleSkillProfiles: [null, { expectationId: "av-commissioning", evidence: [null, { note: "Commissioning report" }] }, { roleId: 42 }],
    } as unknown as EngineerProfile;

    const passport = buildCapabilityPassport(engineer);
    expect(passport.roleProfiles).toHaveLength(1);
    expect(passport.roleProfiles[0]).toMatchObject({ roleId: "av-commissioning", confidence: "supported" });
    expect(passport.roleProfiles[0].supportingEvidence[0].summary).toBe("Commissioning report");
  });

  it("excludes a candidate when a mandatory product prerequisite is missing and explains why", () => {
    const result = explainCandidateMatch({ engineerId: "eng-1", roleMatch: true, responsibilityMatch: true, prerequisites: ["Q-SYS", "Dante"], productExperience: { Dante: "delivered" }, evidence: [], availabilityScore: 100 });
    expect(result.outcome).toBe("excluded");
    expect(result.prerequisitesMissing).toEqual(["Q-SYS"]);
    expect(result.risks[0]).toContain("Q-SYS");
  });

  it("flags ambiguous opportunities and reports missing team coverage", () => {
    expect(checkOpportunityReadiness({ roleTitle: "Engineer", prerequisites: [] }).ready).toBe(false);
    expect(analyseTeamCoverage(["lead", "audio"], [{ engineerId: "e1", roleIds: ["lead"] }])).toEqual({ coveredRoleIds: ["lead"], missingRoleIds: ["audio"], complete: false });
  });

  it("keeps job payment outside the generated technical work pack", () => {
    const pack = generateTechnicalWorkPack({ jobId: "j1", roleId: "r1", responsibility: "deliver", scope: "Commission and verify the installed system.", exclusions: [], prerequisites: [], siteContact: "Sam", escalationContact: "Alex", completionEvidence: ["test results"] });
    expect(pack.paymentNotice).toContain("directly between the parties");
  });
});
