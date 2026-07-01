export type ItSkillLevel = "foundation" | "intermediate" | "advanced" | "specialist";

export type ItSkillPriority = "must-have" | "nice-to-have";

export type ItSkillItem = {
  name: string;
  level: ItSkillLevel;
  priority?: ItSkillPriority;
  evidenceHint?: string;
};

export type ItSkillGroup = {
  title: string;
  description: string;
  skills: ItSkillItem[];
};

export type ItRoleAspect = {
  title: string;
  description: string;
  mustHave: string[];
  niceToHave: string[];
};

export type ItSkillProfile = {
  id: string;
  title: string;
  planLevel?: "free-basic" | "paid-specialist" | "pro-specialist";
  category:
    | "support"
    | "field-service"
    | "infrastructure"
    | "networking"
    | "wireless"
    | "systems"
    | "cloud"
    | "security"
    | "data"
    | "devops"
    | "management"
    | "consultancy"
    | "specialist";
  summary: string;
  suitableFor: string[];
  mustHaveSummary?: string[];
  niceToHaveSummary?: string[];
  expectedKnowledge?: string[];
  roleAspects?: ItRoleAspect[];
  typicalEvidence?: string[];
  productKnowledgeTags?: string[];
  skillGroups: ItSkillGroup[];
};

export type ItProductExperienceLevel =
  | "aware"
  | "assisted"
  | "installed"
  | "configured"
  | "administered"
  | "commissioned"
  | "programmed"
  | "troubleshot"
  | "certified";

export type ItProductKnowledgeTag = {
  id: string;
  label: string;
  category:
    | "operating-systems"
    | "microsoft-cloud"
    | "identity"
    | "endpoint-management"
    | "networking"
    | "wireless"
    | "security"
    | "virtualisation"
    | "backup"
    | "collaboration"
    | "voice"
    | "database"
    | "data-bi"
    | "devops"
    | "automation"
    | "cloud"
    | "monitoring-rmm"
    | "apple"
    | "management"
    | "hardware-vendors"
    | "retail-it"
    | "printing";
  type: "brand" | "technology" | "platform" | "system-type";
  suggestedExperienceLevels: ItProductExperienceLevel[];
};
