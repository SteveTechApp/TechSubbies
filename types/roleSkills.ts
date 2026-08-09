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
  | "infrastructure"
  | "design"
  | "project-delivery"
  | "field-service"
  | "live-events"
  | "cloud-platform"
  | "data"
  | "quality-assurance"
  | "architecture";

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
  profileKind?: "free-sector" | "job-role";
  summary: string;
  suitableFor: string[];
  typicalProjects: string[];
  skillGroups: RoleSkillGroup[];
  recommendedTags: string[];
  evidenceTypes: string[];
  aliases?: string[];
  coreResponsibilities?: string[];
  workContexts?: string[];
  knowledgeRequirements?: RoleKnowledgeRequirement[];
  roleBoundaries?: string[];
  distinguishedFrom?: Array<{ roleId: string; distinction: string }>;
}

export interface RoleKnowledgeRequirement {
  topic: string;
  expectation: string;
  suggestedTags: string[];
  prerequisiteEligible: boolean;
}

export interface EngineerSkillRating {
  skillId: string;
  rating: SkillRating;
  evidenceNote: string;
  // Engineer-declared recency. This is displayed as context and freshness,
  // not treated as independent proof of competence.
  lastUsedDate?: string;
  willingToDo: boolean;
  needsSupervision: boolean;
  canLead: boolean;
  tags: string[];
}

export interface EngineerRoleSkillProfile {
  roleId: string;
  overallCapability?: "assist" | "deliver" | "diagnose" | "lead";
  capabilities?: Array<{ skillId: string; claim: "independent" | "support" | "not-offered" }>;
  ratings: EngineerSkillRating[];
  productTags: string[];
  brandTags: string[];
  platformTags: string[];
  certificationTags: string[];
  uploadedEvidenceNotes: string[];
  profileNotes: string;
  customKeywords?: string[];
  productExperience?: Record<string, "aware" | "installed" | "configured" | "commissioned" | "programmed" | "certified">;
  evidence?: Array<{ type: string; note: string }>;
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
