export type GeneralSector = "AV" | "IT";

export interface GeneralSectorProfileDefinition {
  sector: GeneralSector;
  title: string;
  scopeStatement: string;
  exclusions: string[];
  skills: Array<{ id: string; label: string; expectation: string }>;
}

export const generalSectorProfiles: Record<GeneralSector, GeneralSectorProfileDefinition> = {
  AV: {
    sector: "AV",
    title: "General AV Skills Profile",
    scopeStatement: "Entry-level AV assistance under instruction: site conduct, cable handling, equipment preparation, basic installation support and accurate escalation.",
    exclusions: ["Sole site responsibility", "Commissioning", "DSP or control programming", "Network configuration", "Design decisions", "Client sign-off"],
    skills: [
      { id: "general-av-site", label: "AV site conduct and safe working", expectation: "Follows induction, RAMS, PPE and supervisor instructions." },
      { id: "general-av-cabling", label: "Basic AV cable handling and labelling", expectation: "Assists without claiming termination or test competence." },
      { id: "general-av-equipment", label: "Equipment identification and preparation", expectation: "Recognises common displays, brackets, extenders and rack equipment." },
      { id: "general-av-support", label: "Installation support", expectation: "Assists a named competent engineer; does not work as sole engineer." },
      { id: "general-av-escalation", label: "Issue recording and escalation", expectation: "Records photos, symptoms and blockers without unsupported changes." },
    ],
  },
  IT: {
    sector: "IT",
    title: "General IT Skills Profile",
    scopeStatement: "Entry-level IT assistance under instruction: equipment deployment, basic endpoint checks, user-facing support and accurate escalation.",
    exclusions: ["Network or firewall configuration", "Server administration", "Privileged identity changes", "Cybersecurity ownership", "Software development", "Technical design authority"],
    skills: [
      { id: "general-it-site", label: "IT site and data-handling conduct", expectation: "Follows access, privacy, change and escalation rules." },
      { id: "general-it-endpoint", label: "Basic endpoint setup", expectation: "Connects and checks standard desktops, laptops and peripherals under instruction." },
      { id: "general-it-user", label: "Basic user support", expectation: "Collects symptoms and handles standard documented checks." },
      { id: "general-it-deployment", label: "Equipment deployment support", expectation: "Labels, inventories and installs equipment to an approved plan." },
      { id: "general-it-escalation", label: "Ticket notes and escalation", expectation: "Records reproducible information and escalates privileged or complex work." },
    ],
  },
};
