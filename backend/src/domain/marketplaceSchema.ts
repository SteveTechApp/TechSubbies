import { z } from "zod";
import { normaliseRoleId } from "./roleCatalog.js";
import {
  ENGINEER_PROFILE_SCHEMA_VERSION,
  JOB_SCHEMA_VERSION,
  type CanonicalCapabilityProfileDTO,
  type CanonicalEngineerProfileDTO,
  type CanonicalJobDTO,
  type CanonicalPrerequisiteDTO,
  type CanonicalRoleRequirementDTO,
  type CanonicalSkillRequirementDTO,
  type CapabilityClaim,
  type CapabilityEvidenceDTO,
  type ResponsibilityLevel,
} from "./marketplaceTypes.js";

const text = (value: unknown, max = 120): string => typeof value === "string" ? value.trim().slice(0, max) : "";
const record = (value: unknown): Record<string, unknown> => typeof value === "object" && value !== null && !Array.isArray(value)
  ? value as Record<string, unknown>
  : {};
const array = (value: unknown): unknown[] => Array.isArray(value) ? value : [];
const first = (...values: unknown[]): unknown => values.find((value) => value !== undefined && value !== null);

const responsibility = (value: unknown): ResponsibilityLevel => {
  const key = text(value).toLowerCase();
  if (["lead", "lead-engineer"].includes(key)) return "lead";
  if (["specialist", "diagnose"].includes(key)) return "diagnose";
  if (["competent", "independent", "deliver"].includes(key)) return "deliver";
  return "assist";
};

const claim = (value: unknown): CapabilityClaim => {
  const item = record(value);
  if (item.claim === "support" || item.claim === "independent" || item.claim === "not-offered") return item.claim;
  const score = Number(first(item.selfLevel, item.rating, 0));
  return score <= 0 ? "not-offered" : score < 3 ? "support" : "independent";
};

const keywordValues = (value: unknown): string[] => array(value).map((item) => text(item, 80)).filter(Boolean);
const keywords = (value: unknown): string[] => {
  const profile = record(value);
  const combined = [profile.customKeywords, profile.productTags, profile.brandTags, profile.platformTags, profile.certificationTags]
    .flatMap(keywordValues);
  return combined.filter((item, index, all) => all.findIndex((value) => value.toLowerCase() === item.toLowerCase()) === index).slice(0, 30);
};

const productExperience = (value: unknown): Record<string, string> => Object.fromEntries(
  Object.entries(record(value))
    .map(([product, experience]) => [text(product, 80), text(experience, 40).toLowerCase()])
    .filter(([product, experience]) => Boolean(product && experience))
    .slice(0, 40),
);

const evidence = (value: unknown): CapabilityEvidenceDTO[] => array(value)
  .flatMap((entry) => {
    const item = record(entry);
    if (!Object.keys(item).length) return [];
    return [{ ...item, type: text(item.type, 120) || undefined, note: text(item.note, 500) || undefined }];
  })
  .slice(0, 20);

export function canonicaliseEngineerProfile(profile: Record<string, unknown>): CanonicalEngineerProfileDTO {
  const source = Array.isArray(profile.roleSkillProfiles)
    ? profile.roleSkillProfiles
    : Array.isArray(profile.capabilityProfiles)
      ? profile.capabilityProfiles
      : array(profile.roleProfiles);

  const capabilityProfiles: CanonicalCapabilityProfileDTO[] = source.map((value) => {
    const item = record(value);
    const roleId = normaliseRoleId(text(first(item.roleId, item.expectationId)));
    if (!roleId) throw new Error("Engineer profile contains a non-canonical specialist role.");
    const rawCapabilities = Array.isArray(item.capabilities)
      ? item.capabilities
      : Array.isArray(item.skills) ? item.skills : array(item.ratings);
    const seen = new Set<string>();
    const capabilities = rawCapabilities
      .map((value) => {
        const skill = record(value);
        return {
          skillId: text(first(skill.skillId, skill.skill, skill.name), 120),
          claim: claim(skill),
          evidenceNote: text(first(skill.evidenceNote, skill.evidence), 500),
        };
      })
      .filter((entry) => entry.skillId && !seen.has(entry.skillId.toLowerCase()) && seen.add(entry.skillId.toLowerCase()))
      .slice(0, 80);
    return {
      roleId,
      overallCapability: responsibility(first(item.overallCapability, item.maximumResponsibility)),
      capabilities,
      keywords: keywords(item),
      productExperience: productExperience(item.productExperience),
      productTags: keywords({ productTags: item.productTags }),
      brandTags: keywords({ brandTags: item.brandTags }),
      platformTags: keywords({ platformTags: item.platformTags }),
      certificationTags: keywords({ certificationTags: item.certificationTags }),
      customKeywords: keywords({ customKeywords: item.customKeywords }),
      evidence: evidence(item.evidence),
      profileNote: text(first(item.profileNote, item.profileNotes), 2000),
    };
  });
  return { ...profile, profileSchemaVersion: ENGINEER_PROFILE_SCHEMA_VERSION, capabilityProfiles, roleSkillProfiles: capabilityProfiles };
}

const jobInput = z.record(z.unknown()).refine((value) => typeof value.title === "string" && value.title.trim().length >= 3, { message: "A job title is required." });

export function canonicaliseJob(input: unknown): CanonicalJobDTO {
  const parsed = jobInput.parse(input);
  const requestedExpectationId = text(parsed.roleId);
  const rawNeeds = array(parsed.engineerNeeds);
  const requested: unknown[] = rawNeeds.length ? rawNeeds : [{
    expectationId: parsed.roleId,
    workingArrangement: parsed.workingArrangement,
    skills: parsed.skillRequirements,
    prerequisites: parsed.prerequisites,
    quantity: 1,
  }];

  const roleRequirements: CanonicalRoleRequirementDTO[] = requested.map((value) => {
    const need = record(value);
    const roleId = normaliseRoleId(text(first(need.roleId, need.expectationId)));
    if (!roleId) throw new Error("Choose a canonical AV or IT job role.");
    const skills: CanonicalSkillRequirementDTO[] = array(need.skills).map((value) => {
      const item = record(value);
      return { skillId: text(first(item.skillId, item.skill, item.name), 120), required: Boolean(first(item.required, item.isRequired, true)) };
    }).filter((entry) => entry.skillId).slice(0, 40);
    const prerequisites: CanonicalPrerequisiteDTO[] = array(need.prerequisites).map((value) => {
      const item = record(value);
      return {
        label: text(typeof value === "string" ? value : item.label, 120),
        category: text(first(item.category, "software-manufacturer-hardware"), 60),
        minimumExperience: text(first(item.minimumExperience, "practical"), 60),
      };
    }).filter((entry) => entry.label).slice(0, 3);
    return {
      roleId,
      quantity: Math.max(1, Math.min(100, Number(need.quantity) || 1)),
      responsibility: responsibility(first(need.workingArrangement, need.responsibility)),
      skills,
      prerequisites,
    };
  });
  const roleIds = [...new Set(roleRequirements.map((item) => item.roleId))];
  return {
    ...parsed,
    jobSchemaVersion: JOB_SCHEMA_VERSION,
    title: text(parsed.title, 160),
    requestedExpectationId,
    roleId: roleIds[0],
    roleIds,
    roleRequirements,
    skillRequirements: roleRequirements.flatMap((item) => item.skills.map((skill) => ({ ...skill, roleId: item.roleId }))),
    prerequisites: roleRequirements.flatMap((item) => item.prerequisites),
  };
}
