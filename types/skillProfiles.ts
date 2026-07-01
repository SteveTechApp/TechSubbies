export type SkillLevel = "foundation" | "intermediate" | "advanced" | "specialist";

export type SkillPriority = "must-have" | "nice-to-have";

export type SkillItem = {
  name: string;
  level: SkillLevel;
  priority?: SkillPriority;
  evidenceHint?: string;
};

export type SkillGroup = {
  title: string;
  description: string;
  skills: SkillItem[];
};

export type RoleAspect = {
  title: string;
  description: string;
  mustHave: string[];
  niceToHave: string[];
};

export type AvSkillProfile = {
  id: string;
  title: string;
  planLevel?: "free-basic" | "paid-specialist" | "pro-specialist";
  category:
    | "installation"
    | "commissioning"
    | "programming"
    | "live-events"
    | "design"
    | "management"
    | "service"
    | "product-awareness"
    | "specialist";
  summary: string;
  suitableFor: string[];
  mustHaveSummary?: string[];
  niceToHaveSummary?: string[];
  expectedKnowledge?: string[];
  roleAspects?: RoleAspect[];
  typicalEvidence?: string[];
  productKnowledgeTags?: string[];
  skillGroups: SkillGroup[];
};

export type ProductExperienceLevel =
  | "aware"
  | "assisted"
  | "installed"
  | "configured"
  | "commissioned"
  | "programmed"
  | "troubleshot"
  | "certified";

export type ProductKnowledgeTag = {
  id: string;
  label: string;
  category:
    | "signal-management"
    | "uc-conferencing"
    | "audio-dsp"
    | "control"
    | "video-wall-led"
    | "network-av"
    | "digital-signage"
    | "projection-display"
    | "live-events"
    | "broadcast-streaming";
  type: "brand" | "technology" | "platform" | "system-type";
  suggestedExperienceLevels: ProductExperienceLevel[];
};

export type ProductAwarenessProfile = {
  id: string;
  title: string;
  category:
    | "signal-management"
    | "uc-conferencing"
    | "audio"
    | "control"
    | "video-wall-led"
    | "network-av"
    | "display-projection";
  summary: string;
  awarenessAreas: {
    title: string;
    mustHave: string[];
    niceToHave: string[];
  }[];
};
