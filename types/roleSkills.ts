export type RoleMarket = "av" | "it" | "hybrid";

export type RoleFamily =
  | "installation"
  | "commissioning"
  | "support"
  | "networking"
  | "programming"
  | "audio"
  | "uc"
  | "security"
  | "infrastructure";

export type SkillRating = 0 | 1 | 2 | 3 | 4 | 5;

export interface SkillRatingLabel {
  value: SkillRating;
  label: string;
  description: string;
}

export interface RoleSkill {
  id: string;
  label: string;
  description: string;
  requiredForGoodMatch: boolean;
  evidenceRecommended: boolean;
  suggestedTags: string[];
}

export interface RoleSkillGroup {
  id: string;
  title: string;
  description: string;
  skills: RoleSkill[];
}

export interface RoleSkillDefinition {
  id: string;
  market: RoleMarket;
  family: RoleFamily;
  title: string;
  shortTitle: string;
  level: "entry" | "skilled" | "specialist" | "lead";
  summary: string;
  suitableFor: string[];
  typicalProjects: string[];
  skillGroups: RoleSkillGroup[];
  recommendedTags: string[];
  evidenceTypes: string[];
}

export interface EngineerSkillRating {
  skillId: string;
  rating: SkillRating;
  evidenceNote: string;
  willingToDo: boolean;
  needsSupervision: boolean;
  canLead: boolean;
  tags: string[];
}

export interface EngineerRoleSkillProfile {
  roleId: string;
  ratings: EngineerSkillRating[];
  productTags: string[];
  brandTags: string[];
  platformTags: string[];
  certificationTags: string[];
  uploadedEvidenceNotes: string[];
  profileNotes: string;
}

export interface RoleSkillFilter {
  searchText: string;
  market: RoleMarket | "all";
  family: RoleFamily | "all";
}

export interface RoleSkillSummary {
  totalSkills: number;
  ratedSkills: number;
  goodOrBetterSkills: number;
  leadLevelSkills: number;
  missingRequiredSkills: number;
  averageRating: number;
  completenessPercent: number;
  profileStrength: "Not started" | "Basic" | "Developing" | "Good" | "Strong" | "Specialist";
}