import { defaultRoleSkillRoleId, roleSkillTaxonomy } from "../data/roleSkillTaxonomy";
import type {
  EngineerRoleSkillProfile,
  EngineerSkillRating,
  RoleMarket,
  RoleFamily,
  RoleSkillDefinition,
  RoleSkillFilter,
  RoleSkillSummary,
  SkillRating,
} from "../types/roleSkills";

function normalise(value: string): string {
  return value.trim().toLowerCase();
}

export function getRoleSkillDefinitions(): RoleSkillDefinition[] {
  return roleSkillTaxonomy;
}

export function getDefaultRoleSkillDefinition(): RoleSkillDefinition {
  return getRoleSkillDefinition(defaultRoleSkillRoleId);
}

export function getRoleSkillDefinition(roleId: string): RoleSkillDefinition {
  const found = roleSkillTaxonomy.find((role) => role.id === roleId);

  if (found) {
    return found;
  }

  return roleSkillTaxonomy[0];
}

export function filterRoleSkillDefinitions(filter: RoleSkillFilter): RoleSkillDefinition[] {
  const search = normalise(filter.searchText);

  return roleSkillTaxonomy.filter((role) => {
    if (filter.market !== "all" && role.market !== filter.market) {
      return false;
    }

    if (filter.family !== "all" && role.family !== filter.family) {
      return false;
    }

    if (search.length === 0) {
      return true;
    }

    const searchable = normalise([
      role.title,
      role.shortTitle,
      role.summary,
      role.market,
      role.family,
      role.level,
      role.suitableFor.join(" "),
      role.typicalProjects.join(" "),
      role.recommendedTags.join(" "),
      role.skillGroups.map((group) => group.title + " " + group.skills.map((skill) => skill.label).join(" ")).join(" "),
    ].join(" "));

    return searchable.indexOf(search) >= 0;
  });
}

export function getRoleMarkets(): Array<RoleMarket | "all"> {
  return ["all", "av", "it", "hybrid"];
}

export function getRoleFamilies(): Array<RoleFamily | "all"> {
  return [
    "all",
    "installation",
    "commissioning",
    "support",
    "networking",
    "programming",
    "audio",
    "uc",
    "security",
    "infrastructure",
  ];
}

export function createEmptyRoleSkillProfile(role: RoleSkillDefinition): EngineerRoleSkillProfile {
  const ratings: EngineerSkillRating[] = [];

  role.skillGroups.forEach((group) => {
    group.skills.forEach((skill) => {
      ratings.push({
        skillId: skill.id,
        rating: 0,
        evidenceNote: "",
        willingToDo: true,
        needsSupervision: false,
        canLead: false,
        tags: skill.suggestedTags,
      });
    });
  });

  return {
    roleId: role.id,
    ratings,
    productTags: [],
    brandTags: [],
    platformTags: [],
    certificationTags: [],
    uploadedEvidenceNotes: [],
    profileNotes: "",
  };
}

export function getAllSkillsForRole(role: RoleSkillDefinition) {
  return role.skillGroups.flatMap((group) => group.skills);
}

export function updateSkillRating(
  profile: EngineerRoleSkillProfile,
  skillId: string,
  rating: SkillRating,
): EngineerRoleSkillProfile {
  return {
    ...profile,
    ratings: profile.ratings.map((item) => {
      if (item.skillId !== skillId) {
        return item;
      }

      return {
        ...item,
        rating,
        needsSupervision: rating > 0 && rating < 3,
        canLead: rating >= 5,
      };
    }),
  };
}

export function updateSkillEvidenceNote(
  profile: EngineerRoleSkillProfile,
  skillId: string,
  evidenceNote: string,
): EngineerRoleSkillProfile {
  return {
    ...profile,
    ratings: profile.ratings.map((item) => {
      if (item.skillId !== skillId) {
        return item;
      }

      return {
        ...item,
        evidenceNote,
      };
    }),
  };
}

export function toggleSkillWillingness(
  profile: EngineerRoleSkillProfile,
  skillId: string,
): EngineerRoleSkillProfile {
  return {
    ...profile,
    ratings: profile.ratings.map((item) => {
      if (item.skillId !== skillId) {
        return item;
      }

      return {
        ...item,
        willingToDo: !item.willingToDo,
      };
    }),
  };
}

export function addTag(currentTags: string[], tag: string): string[] {
  const clean = tag.trim();

  if (clean.length === 0) {
    return currentTags;
  }

  const exists = currentTags.some((item) => item.toLowerCase() === clean.toLowerCase());

  if (exists) {
    return currentTags;
  }

  return [...currentTags, clean].sort((a, b) => a.localeCompare(b));
}

export function removeTag(currentTags: string[], tag: string): string[] {
  return currentTags.filter((item) => item !== tag);
}

export function getRoleSkillSummary(
  role: RoleSkillDefinition,
  profile: EngineerRoleSkillProfile,
): RoleSkillSummary {
  const allSkills = getAllSkillsForRole(role);
  const requiredSkillIds = allSkills
    .filter((skill) => skill.requiredForGoodMatch)
    .map((skill) => skill.id);

  const ratedSkills = profile.ratings.filter((item) => item.rating > 0);
  const goodOrBetterSkills = profile.ratings.filter((item) => item.rating >= 3);
  const leadLevelSkills = profile.ratings.filter((item) => item.rating >= 5);

  const missingRequiredSkills = requiredSkillIds.filter((skillId) => {
    const rating = profile.ratings.find((item) => item.skillId === skillId);

    if (!rating) {
      return true;
    }

    return rating.rating < 3;
  });

  const ratingTotal = profile.ratings.reduce((total, item) => total + item.rating, 0);
  const averageRating = profile.ratings.length > 0 ? ratingTotal / profile.ratings.length : 0;
  const completenessPercent = allSkills.length > 0 ? Math.round((ratedSkills.length / allSkills.length) * 100) : 0;

  let profileStrength: RoleSkillSummary["profileStrength"] = "Not started";

  if (completenessPercent > 0) {
    profileStrength = "Basic";
  }

  if (completenessPercent >= 35 && averageRating >= 1.8) {
    profileStrength = "Developing";
  }

  if (completenessPercent >= 60 && averageRating >= 2.5 && missingRequiredSkills.length <= 2) {
    profileStrength = "Good";
  }

  if (completenessPercent >= 80 && averageRating >= 3.2 && missingRequiredSkills.length === 0) {
    profileStrength = "Strong";
  }

  if (completenessPercent >= 90 && averageRating >= 4 && leadLevelSkills.length >= 2 && missingRequiredSkills.length === 0) {
    profileStrength = "Specialist";
  }

  return {
    totalSkills: allSkills.length,
    ratedSkills: ratedSkills.length,
    goodOrBetterSkills: goodOrBetterSkills.length,
    leadLevelSkills: leadLevelSkills.length,
    missingRequiredSkills: missingRequiredSkills.length,
    averageRating: Math.round(averageRating * 10) / 10,
    completenessPercent,
    profileStrength,
  };
}

export function getMissingRequiredSkillLabels(
  role: RoleSkillDefinition,
  profile: EngineerRoleSkillProfile,
): string[] {
  const allSkills = getAllSkillsForRole(role);

  return allSkills
    .filter((skill) => skill.requiredForGoodMatch)
    .filter((skill) => {
      const rating = profile.ratings.find((item) => item.skillId === skill.id);

      if (!rating) {
        return true;
      }

      return rating.rating < 3;
    })
    .map((skill) => skill.label);
}