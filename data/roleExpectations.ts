export type ResponsibilityBand =
  | "labour"
  | "junior"
  | "improver"
  | "competent"
  | "senior"
  | "lead"
  | "specialist";

export type SkillRequirement = {
  skill: string;
  minimumLevel: 0 | 1 | 2 | 3 | 4 | 5;
  importance: 1 | 2 | 3 | 4 | 5;
};

export type SiteReadinessRequirement = {
  identityRequired: boolean;
  insuranceRequired: boolean;
  rightToWorkRequired: boolean;
  ramsRequired: boolean;
  cscsOrEquivalentRequired: boolean;
  workingAtHeightCheckRequired: boolean;
  ownToolsRequired: boolean;
  evidenceRequired: boolean;
  namedSupervisorRequired: boolean;
};

export type RoleExpectation = {
  id: string;
  roleFamily: "AV" | "IT" | "Hybrid";
  roleTitle: string;
  responsibilityBand: ResponsibilityBand;
  canWorkAlone: boolean;
  canLeadOthers: boolean;
  requiresEvidence: boolean;
  requiresNamedSupervisor: boolean;
  typicalDayRateNote: string;
  responsibilityStatement: string;
  notIncludedUnlessSelected: string[];
  requiredSkills: SkillRequirement[];
  siteReadiness: SiteReadinessRequirement;
  mismatchWarnings: string[];
};

export const responsibilityBandLabels: Record<ResponsibilityBand, string> = {
  labour: "Labour / helper",
  junior: "Junior",
  improver: "Improver",
  competent: "Competent",
  senior: "Senior",
  lead: "Lead",
  specialist: "Specialist",
};

export const responsibilityBandDescriptions: Record<ResponsibilityBand, string> = {
  labour: "Basic support role. Should follow instruction and not own technical decisions.",
  junior: "Supervised engineer. Can complete simple tasks with a lead or escalation contact.",
  improver: "Can complete defined tasks but still needs support for variation or faults.",
  competent: "Can complete standard work independently and report issues clearly.",
  senior: "Can handle complexity, supervise juniors and manage common site variations.",
  lead: "Owns site coordination, quality control, escalation and completion readiness.",
  specialist: "Deep skill role with evidence expected for the named technical discipline.",
};

const baseSiteReadiness: SiteReadinessRequirement = {
  identityRequired: true,
  insuranceRequired: true,
  rightToWorkRequired: true,
  ramsRequired: false,
  cscsOrEquivalentRequired: false,
  workingAtHeightCheckRequired: false,
  ownToolsRequired: false,
  evidenceRequired: false,
  namedSupervisorRequired: false,
};

function readiness(patch: Partial<SiteReadinessRequirement>): SiteReadinessRequirement {
  return {
    ...baseSiteReadiness,
    ...patch,
  };
}

export const roleExpectations: RoleExpectation[] = [
  {
    id: "av-labour-support",
    roleFamily: "AV",
    roleTitle: "AV Labour / Site Support",
    responsibilityBand: "labour",
    canWorkAlone: false,
    canLeadOthers: false,
    requiresEvidence: false,
    requiresNamedSupervisor: true,
    typicalDayRateNote: "Low to mid support rate. Should not be priced or treated as specialist work.",
    responsibilityStatement:
      "This role is for basic AV site support. The engineer can assist with moving equipment, cable pulling, preparation and tidy-up under instruction. They should not be expected to work alone, make design decisions, commission systems or resolve complex faults.",
    notIncludedUnlessSelected: [
      "Solo site responsibility",
      "Commissioning",
      "Client handover",
      "Fault ownership",
      "Control programming",
      "Network switch configuration",
    ],
    requiredSkills: [
      { skill: "Site conduct", minimumLevel: 2, importance: 5 },
      { skill: "PPE and safety basics", minimumLevel: 2, importance: 5 },
      { skill: "Cable pulling", minimumLevel: 2, importance: 4 },
      { skill: "Basic tool use", minimumLevel: 2, importance: 4 },
      { skill: "Following instruction", minimumLevel: 3, importance: 5 },
      { skill: "Completion photos", minimumLevel: 1, importance: 2 },
    ],
    siteReadiness: readiness({
      namedSupervisorRequired: true,
    }),
    mismatchWarnings: [
      "Do not assign as sole engineer.",
      "Do not expect commissioning or fault ownership.",
      "A named lead or site supervisor should be present.",
    ],
  },
  {
    id: "junior-av-installer",
    roleFamily: "AV",
    roleTitle: "Junior AV Installation Engineer",
    responsibilityBand: "junior",
    canWorkAlone: false,
    canLeadOthers: false,
    requiresEvidence: false,
    requiresNamedSupervisor: true,
    typicalDayRateNote: "Junior rate. Suitable for assisted installation work.",
    responsibilityStatement:
      "This role is suitable for a junior AV engineer who can complete simple installation tasks under supervision. They should have an escalation route and should not be expected to lead the site, make design decisions or complete final commissioning alone.",
    notIncludedUnlessSelected: [
      "Lead engineer responsibility",
      "Final commissioning",
      "Unsupervised live-site ownership",
      "Specialist audio, network or control work",
    ],
    requiredSkills: [
      { skill: "Display mounting support", minimumLevel: 2, importance: 4 },
      { skill: "Cable pulling", minimumLevel: 3, importance: 4 },
      { skill: "Cable termination", minimumLevel: 2, importance: 4 },
      { skill: "Rack build support", minimumLevel: 2, importance: 3 },
      { skill: "HDMI basics", minimumLevel: 2, importance: 3 },
      { skill: "Documentation photos", minimumLevel: 2, importance: 3 },
      { skill: "Escalation discipline", minimumLevel: 3, importance: 5 },
    ],
    siteReadiness: readiness({
      ownToolsRequired: true,
      namedSupervisorRequired: true,
    }),
    mismatchWarnings: [
      "Should not be sent as the sole responsible engineer.",
      "Should not own commissioning or complex fault-finding.",
      "Requires a lead engineer or clear escalation contact.",
    ],
  },
  {
    id: "competent-av-installer",
    roleFamily: "AV",
    roleTitle: "Competent AV Installation Engineer",
    responsibilityBand: "competent",
    canWorkAlone: true,
    canLeadOthers: false,
    requiresEvidence: false,
    requiresNamedSupervisor: false,
    typicalDayRateNote: "Standard independent engineer day rate.",
    responsibilityStatement:
      "This role requires an independent AV installation engineer who can complete standard installation work, follow drawings, install equipment, test basic signal paths, document progress and report issues clearly.",
    notIncludedUnlessSelected: [
      "DSP commissioning",
      "Control programming",
      "Advanced network configuration",
      "Lead engineer responsibility",
    ],
    requiredSkills: [
      { skill: "Display mounting", minimumLevel: 3, importance: 4 },
      { skill: "Rack build", minimumLevel: 3, importance: 4 },
      { skill: "Cable termination", minimumLevel: 3, importance: 4 },
      { skill: "HDMI", minimumLevel: 3, importance: 3 },
      { skill: "HDBaseT", minimumLevel: 3, importance: 3 },
      { skill: "Drawing interpretation", minimumLevel: 3, importance: 4 },
      { skill: "Snagging and handover notes", minimumLevel: 3, importance: 4 },
    ],
    siteReadiness: readiness({
      ownToolsRequired: true,
    }),
    mismatchWarnings: [
      "Do not assume specialist commissioning capability.",
      "Check separately for DSP, network, control or AVoIP skills.",
    ],
  },
  {
    id: "senior-av-installer",
    roleFamily: "AV",
    roleTitle: "Senior AV Installation Engineer",
    responsibilityBand: "senior",
    canWorkAlone: true,
    canLeadOthers: true,
    requiresEvidence: true,
    requiresNamedSupervisor: false,
    typicalDayRateNote: "Senior rate. Suitable for complex installation and supervision.",
    responsibilityStatement:
      "This role requires a senior AV engineer who can manage complex installation work, supervise junior engineers, identify risks, adapt to site conditions, fault-find common install issues and communicate clearly with the project lead or client.",
    notIncludedUnlessSelected: [
      "DSP programming",
      "Network switch configuration",
      "Control programming",
      "Formal commissioning sign-off outside their rated skills",
    ],
    requiredSkills: [
      { skill: "Complex display mounting", minimumLevel: 4, importance: 4 },
      { skill: "Rack build", minimumLevel: 4, importance: 4 },
      { skill: "Cable testing", minimumLevel: 4, importance: 4 },
      { skill: "HDMI and HDBaseT fault-finding", minimumLevel: 4, importance: 5 },
      { skill: "Junior supervision", minimumLevel: 4, importance: 4 },
      { skill: "Site decision-making", minimumLevel: 4, importance: 5 },
      { skill: "Client communication", minimumLevel: 4, importance: 4 },
      { skill: "Completion documentation", minimumLevel: 4, importance: 4 },
    ],
    siteReadiness: readiness({
      ownToolsRequired: true,
      evidenceRequired: true,
    }),
    mismatchWarnings: [
      "Senior installer does not automatically mean DSP, network or control specialist.",
      "Evidence is recommended before using as sole senior engineer.",
    ],
  },
  {
    id: "av-commissioning-engineer",
    roleFamily: "AV",
    roleTitle: "AV Commissioning Engineer",
    responsibilityBand: "specialist",
    canWorkAlone: true,
    canLeadOthers: false,
    requiresEvidence: true,
    requiresNamedSupervisor: false,
    typicalDayRateNote: "Specialist commissioning rate.",
    responsibilityStatement:
      "This role requires an engineer who can validate AV signal flow, configure devices, test routes, diagnose HDMI/HDCP/EDID faults, document findings and support handover. Installation ability alone is not enough for this role.",
    notIncludedUnlessSelected: [
      "Network switch configuration",
      "DSP programming",
      "Control programming",
      "Physical installation labour",
    ],
    requiredSkills: [
      { skill: "Signal flow", minimumLevel: 4, importance: 5 },
      { skill: "HDMI", minimumLevel: 4, importance: 4 },
      { skill: "HDCP troubleshooting", minimumLevel: 4, importance: 5 },
      { skill: "EDID management", minimumLevel: 4, importance: 5 },
      { skill: "Matrix switching", minimumLevel: 4, importance: 4 },
      { skill: "HDBaseT", minimumLevel: 4, importance: 4 },
      { skill: "Fault-finding method", minimumLevel: 4, importance: 5 },
      { skill: "Commissioning documentation", minimumLevel: 4, importance: 4 },
    ],
    siteReadiness: readiness({
      ownToolsRequired: true,
      evidenceRequired: true,
    }),
    mismatchWarnings: [
      "Do not infer commissioning competence from installation experience alone.",
      "Require evidence or previous project validation for specialist commissioning.",
    ],
  },
  {
    id: "avoip-networked-av-engineer",
    roleFamily: "Hybrid",
    roleTitle: "AVoIP / Networked AV Engineer",
    responsibilityBand: "specialist",
    canWorkAlone: true,
    canLeadOthers: false,
    requiresEvidence: true,
    requiresNamedSupervisor: false,
    typicalDayRateNote: "Specialist AV/network rate.",
    responsibilityStatement:
      "This role requires networked AV competence. The engineer should understand endpoints, VLANs, multicast behaviour, managed switches, PoE, IP addressing and fault isolation. A basic AV tag is not enough.",
    notIncludedUnlessSelected: [
      "Full enterprise network design",
      "Firewall administration",
      "DSP programming",
      "Control programming",
    ],
    requiredSkills: [
      { skill: "AV over IP", minimumLevel: 4, importance: 5 },
      { skill: "Managed switches", minimumLevel: 4, importance: 5 },
      { skill: "VLANs", minimumLevel: 4, importance: 5 },
      { skill: "Multicast", minimumLevel: 4, importance: 5 },
      { skill: "IGMP snooping and querier", minimumLevel: 4, importance: 5 },
      { skill: "PoE", minimumLevel: 3, importance: 4 },
      { skill: "IP addressing", minimumLevel: 4, importance: 5 },
      { skill: "AV/network fault isolation", minimumLevel: 4, importance: 5 },
    ],
    siteReadiness: readiness({
      ownToolsRequired: true,
      evidenceRequired: true,
    }),
    mismatchWarnings: [
      "Do not match using AVoIP tag alone.",
      "If switch configuration is required, networking competence must be mandatory.",
    ],
  },
  {
    id: "dsp-audio-engineer",
    roleFamily: "AV",
    roleTitle: "DSP / Audio Engineer",
    responsibilityBand: "specialist",
    canWorkAlone: true,
    canLeadOthers: false,
    requiresEvidence: true,
    requiresNamedSupervisor: false,
    typicalDayRateNote: "Specialist audio/DSP rate.",
    responsibilityStatement:
      "This role requires proven audio and DSP competence. Installing speakers is not the same as commissioning DSP, AEC, Dante, gain structure or meeting-room audio.",
    notIncludedUnlessSelected: [
      "Control programming",
      "Network switch configuration",
      "General installation labour",
    ],
    requiredSkills: [
      { skill: "DSP configuration", minimumLevel: 4, importance: 5 },
      { skill: "Gain structure", minimumLevel: 4, importance: 5 },
      { skill: "AEC setup", minimumLevel: 4, importance: 5 },
      { skill: "Dante", minimumLevel: 3, importance: 4 },
      { skill: "Microphone systems", minimumLevel: 4, importance: 4 },
      { skill: "Audio testing", minimumLevel: 4, importance: 5 },
      { skill: "Audio fault-finding", minimumLevel: 4, importance: 5 },
    ],
    siteReadiness: readiness({
      ownToolsRequired: true,
      evidenceRequired: true,
    }),
    mismatchWarnings: [
      "Ceiling speaker installation does not prove DSP competence.",
      "AEC and gain structure should be mandatory for meeting-room audio roles.",
    ],
  },
  {
    id: "uc-vc-engineer",
    roleFamily: "Hybrid",
    roleTitle: "UC / VC Engineer",
    responsibilityBand: "competent",
    canWorkAlone: true,
    canLeadOthers: false,
    requiresEvidence: false,
    requiresNamedSupervisor: false,
    typicalDayRateNote: "Standard to senior UC rate depending on platform and handover responsibility.",
    responsibilityStatement:
      "This role requires an engineer who can validate the meeting-room user experience, not just install equipment. Camera, audio, USB, display and platform behaviour must be checked together.",
    notIncludedUnlessSelected: [
      "DSP programming",
      "Network switch configuration",
      "Control programming",
      "Full room design",
    ],
    requiredSkills: [
      { skill: "Microsoft Teams Rooms", minimumLevel: 3, importance: 4 },
      { skill: "Zoom Rooms", minimumLevel: 3, importance: 3 },
      { skill: "BYOD and BYOM", minimumLevel: 4, importance: 5 },
      { skill: "USB routing", minimumLevel: 4, importance: 5 },
      { skill: "Camera setup", minimumLevel: 3, importance: 4 },
      { skill: "Audio echo checks", minimumLevel: 3, importance: 5 },
      { skill: "User acceptance testing", minimumLevel: 4, importance: 5 },
      { skill: "Client handover", minimumLevel: 4, importance: 4 },
    ],
    siteReadiness: readiness({
      ownToolsRequired: true,
    }),
    mismatchWarnings: [
      "UC work should validate real user experience.",
      "Audio and USB routing gaps create high project risk.",
    ],
  },

  {
    id: "it-labour-site-support",
    roleFamily: "IT",
    roleTitle: "IT Labour / Site Support",
    responsibilityBand: "labour",
    canWorkAlone: false,
    canLeadOthers: false,
    requiresEvidence: false,
    requiresNamedSupervisor: true,
    typicalDayRateNote: "Low support rate. Suitable for basic rollout support under instruction.",
    responsibilityStatement:
      "This role is for basic IT site support. The engineer can assist with moving kit, unpacking, labelling, desk drops, simple patching support and following instructions. They should not be expected to troubleshoot systems, make network changes, handle user migration decisions or work without a lead.",
    notIncludedUnlessSelected: [
      "Solo site responsibility",
      "Endpoint troubleshooting ownership",
      "Network configuration",
      "User migration decisions",
      "Admin access to client systems",
      "Cybersecurity work",
    ],
    requiredSkills: [
      { skill: "Site conduct", minimumLevel: 2, importance: 5 },
      { skill: "PPE and safety basics", minimumLevel: 2, importance: 4 },
      { skill: "Following instruction", minimumLevel: 3, importance: 5 },
      { skill: "Asset labelling support", minimumLevel: 2, importance: 3 },
      { skill: "Desk setup support", minimumLevel: 2, importance: 3 },
      { skill: "Basic patching support", minimumLevel: 1, importance: 2 },
    ],
    siteReadiness: readiness({
      namedSupervisorRequired: true,
    }),
    mismatchWarnings: [
      "Do not assign as sole engineer.",
      "Do not provide unsupervised admin access.",
      "A named IT lead or project supervisor should be present.",
    ],
  },
  {
    id: "junior-it-field-engineer",
    roleFamily: "IT",
    roleTitle: "Junior IT Field Engineer",
    responsibilityBand: "junior",
    canWorkAlone: false,
    canLeadOthers: false,
    requiresEvidence: false,
    requiresNamedSupervisor: true,
    typicalDayRateNote: "Junior IT rate. Suitable for supervised endpoint and rollout tasks.",
    responsibilityStatement:
      "This role is suitable for a junior IT engineer working under supervision. They can help with device setup, desk-side support, asset checks and basic user handover, but should not be expected to own faults, make system changes or work without escalation support.",
    notIncludedUnlessSelected: [
      "Network configuration",
      "Server administration",
      "Microsoft 365 administration",
      "Cybersecurity work",
      "Solo site ownership",
    ],
    requiredSkills: [
      { skill: "Desktop setup", minimumLevel: 2, importance: 4 },
      { skill: "Laptop setup", minimumLevel: 2, importance: 4 },
      { skill: "Asset tagging", minimumLevel: 3, importance: 4 },
      { skill: "Basic user handover", minimumLevel: 2, importance: 3 },
      { skill: "Printer setup support", minimumLevel: 1, importance: 2 },
      { skill: "Escalation discipline", minimumLevel: 3, importance: 5 },
      { skill: "Documentation photos", minimumLevel: 2, importance: 3 },
    ],
    siteReadiness: readiness({
      ownToolsRequired: false,
      namedSupervisorRequired: true,
    }),
    mismatchWarnings: [
      "Should not be used as sole IT engineer.",
      "Should not be given responsibility for complex troubleshooting.",
      "Needs a lead engineer or support desk escalation path.",
    ],
  },
  {
    id: "it-deployment-engineer",
    roleFamily: "IT",
    roleTitle: "IT Deployment Engineer",
    responsibilityBand: "competent",
    canWorkAlone: true,
    canLeadOthers: false,
    requiresEvidence: false,
    requiresNamedSupervisor: false,
    typicalDayRateNote: "Standard deployment rate. Suitable for device rollout work.",
    responsibilityStatement:
      "This role is for structured IT deployment work. The engineer should be able to deploy laptops, desktops, monitors, docks, peripherals and standard software images from a defined process, while recording assets and escalating exceptions.",
    notIncludedUnlessSelected: [
      "Image creation",
      "Advanced endpoint management",
      "Network configuration",
      "Server changes",
      "Cybersecurity investigation",
    ],
    requiredSkills: [
      { skill: "Laptop deployment", minimumLevel: 3, importance: 5 },
      { skill: "Desktop deployment", minimumLevel: 3, importance: 5 },
      { skill: "Docking station setup", minimumLevel: 3, importance: 4 },
      { skill: "Peripheral setup", minimumLevel: 3, importance: 4 },
      { skill: "Asset tagging", minimumLevel: 4, importance: 5 },
      { skill: "Deployment checklist discipline", minimumLevel: 4, importance: 5 },
      { skill: "Exception reporting", minimumLevel: 3, importance: 4 },
      { skill: "User handover", minimumLevel: 3, importance: 4 },
    ],
    siteReadiness: readiness({
      ownToolsRequired: true,
    }),
    mismatchWarnings: [
      "Deployment engineer does not automatically mean systems administrator.",
      "Check separately for Intune, SCCM, MDM or image management responsibility.",
    ],
  },
  {
    id: "it-field-engineer",
    roleFamily: "IT",
    roleTitle: "IT Field Engineer",
    responsibilityBand: "competent",
    canWorkAlone: true,
    canLeadOthers: false,
    requiresEvidence: false,
    requiresNamedSupervisor: false,
    typicalDayRateNote: "Standard IT field support rate.",
    responsibilityStatement:
      "This role is for standard IT deployment and field support work. The engineer can handle defined endpoint, user, asset and basic support tasks. Do not assume advanced networking, server or cyber capability unless separately selected.",
    notIncludedUnlessSelected: [
      "Advanced networking",
      "Cybersecurity specialist work",
      "Server administration",
      "AV commissioning",
    ],
    requiredSkills: [
      { skill: "Desktop deployment", minimumLevel: 3, importance: 4 },
      { skill: "Laptop deployment", minimumLevel: 3, importance: 4 },
      { skill: "Microsoft 365 basics", minimumLevel: 3, importance: 3 },
      { skill: "Active Directory basics", minimumLevel: 2, importance: 3 },
      { skill: "Endpoint troubleshooting", minimumLevel: 3, importance: 4 },
      { skill: "Asset tagging", minimumLevel: 3, importance: 3 },
      { skill: "User handover", minimumLevel: 3, importance: 4 },
    ],
    siteReadiness: readiness({
      ownToolsRequired: true,
    }),
    mismatchWarnings: [
      "IT field support is not the same as network engineering.",
      "Check separately for advanced networking, server or cyber tasks.",
    ],
  },
  {
    id: "senior-it-field-engineer",
    roleFamily: "IT",
    roleTitle: "Senior IT Field Engineer",
    responsibilityBand: "senior",
    canWorkAlone: true,
    canLeadOthers: true,
    requiresEvidence: true,
    requiresNamedSupervisor: false,
    typicalDayRateNote: "Senior IT field rate. Suitable for complex deskside support and small-site ownership.",
    responsibilityStatement:
      "This role requires a senior IT field engineer who can own a site visit, handle exceptions, supervise junior engineers, communicate clearly with users and project leads, and resolve common endpoint, peripheral, access and rollout issues.",
    notIncludedUnlessSelected: [
      "Network architecture",
      "Server architecture",
      "Cyber incident ownership",
      "Cloud tenant administration",
    ],
    requiredSkills: [
      { skill: "Endpoint troubleshooting", minimumLevel: 4, importance: 5 },
      { skill: "Microsoft 365 user support", minimumLevel: 4, importance: 4 },
      { skill: "Active Directory user support", minimumLevel: 3, importance: 4 },
      { skill: "Printer and peripheral troubleshooting", minimumLevel: 4, importance: 4 },
      { skill: "Junior supervision", minimumLevel: 4, importance: 4 },
      { skill: "User communication", minimumLevel: 4, importance: 5 },
      { skill: "Escalation judgement", minimumLevel: 4, importance: 5 },
      { skill: "Completion documentation", minimumLevel: 4, importance: 4 },
    ],
    siteReadiness: readiness({
      ownToolsRequired: true,
      evidenceRequired: true,
    }),
    mismatchWarnings: [
      "Senior IT field does not automatically mean network, cloud or server specialist.",
      "Evidence is recommended before using as sole senior site contact.",
    ],
  },
  {
    id: "data-cabling-infrastructure-engineer",
    roleFamily: "IT",
    roleTitle: "Data Cabling / IT Infrastructure Engineer",
    responsibilityBand: "competent",
    canWorkAlone: true,
    canLeadOthers: false,
    requiresEvidence: false,
    requiresNamedSupervisor: false,
    typicalDayRateNote: "Infrastructure install rate. May increase where certification testing is required.",
    responsibilityStatement:
      "This role is for structured data cabling, cabinet work, patching, labelling and physical IT infrastructure tasks. It does not automatically include network configuration unless separately required.",
    notIncludedUnlessSelected: [
      "Network switch configuration",
      "Fibre splicing",
      "Wireless survey",
      "Server administration",
      "Cybersecurity work",
    ],
    requiredSkills: [
      { skill: "Structured cabling", minimumLevel: 3, importance: 5 },
      { skill: "Patch panel termination", minimumLevel: 3, importance: 5 },
      { skill: "Cabinet dressing", minimumLevel: 3, importance: 4 },
      { skill: "Cable labelling", minimumLevel: 4, importance: 5 },
      { skill: "Cable testing", minimumLevel: 3, importance: 5 },
      { skill: "Drawing interpretation", minimumLevel: 3, importance: 4 },
      { skill: "As-built documentation", minimumLevel: 3, importance: 4 },
    ],
    siteReadiness: readiness({
      ownToolsRequired: true,
      workingAtHeightCheckRequired: true,
    }),
    mismatchWarnings: [
      "Cabling competence does not prove network configuration competence.",
      "Check whether certification testing, fibre work or working at height is required.",
    ],
  },
  {
    id: "network-support-engineer",
    roleFamily: "IT",
    roleTitle: "Network Support Engineer",
    responsibilityBand: "improver",
    canWorkAlone: false,
    canLeadOthers: false,
    requiresEvidence: false,
    requiresNamedSupervisor: true,
    typicalDayRateNote: "Improver to standard rate. Suitable for supervised network support tasks.",
    responsibilityStatement:
      "This role is for network support under direction. The engineer can assist with patching, switch replacement support, basic IP checks, port identification and documentation, but should not be expected to design or independently configure complex networks.",
    notIncludedUnlessSelected: [
      "Network design",
      "Firewall changes",
      "Routing changes",
      "Multicast design",
      "Cybersecurity configuration",
    ],
    requiredSkills: [
      { skill: "Basic IP networking", minimumLevel: 3, importance: 5 },
      { skill: "Switch patching", minimumLevel: 3, importance: 4 },
      { skill: "Port identification", minimumLevel: 3, importance: 4 },
      { skill: "VLAN awareness", minimumLevel: 2, importance: 4 },
      { skill: "PoE awareness", minimumLevel: 2, importance: 3 },
      { skill: "Network documentation", minimumLevel: 3, importance: 4 },
      { skill: "Escalation discipline", minimumLevel: 4, importance: 5 },
    ],
    siteReadiness: readiness({
      ownToolsRequired: true,
      namedSupervisorRequired: true,
    }),
    mismatchWarnings: [
      "Should not own network configuration without a senior engineer or clear change plan.",
      "Basic IP awareness is not enough for VLAN, routing or firewall ownership.",
    ],
  },
  {
    id: "network-engineer",
    roleFamily: "IT",
    roleTitle: "Network Engineer",
    responsibilityBand: "specialist",
    canWorkAlone: true,
    canLeadOthers: false,
    requiresEvidence: true,
    requiresNamedSupervisor: false,
    typicalDayRateNote: "Specialist network rate.",
    responsibilityStatement:
      "This role requires real network configuration and troubleshooting competence. Basic IP awareness is not enough for VLAN, PoE, multicast, switch or routing work.",
    notIncludedUnlessSelected: [
      "AV endpoint commissioning",
      "DSP programming",
      "Physical AV installation labour",
    ],
    requiredSkills: [
      { skill: "IP addressing", minimumLevel: 4, importance: 5 },
      { skill: "VLANs", minimumLevel: 4, importance: 5 },
      { skill: "Managed switches", minimumLevel: 4, importance: 5 },
      { skill: "Routing basics", minimumLevel: 3, importance: 4 },
      { skill: "Firewall coordination", minimumLevel: 3, importance: 4 },
      { skill: "PoE", minimumLevel: 4, importance: 4 },
      { skill: "Multicast", minimumLevel: 3, importance: 4 },
      { skill: "Network documentation", minimumLevel: 4, importance: 4 },
    ],
    siteReadiness: readiness({
      ownToolsRequired: true,
      evidenceRequired: true,
    }),
    mismatchWarnings: [
      "Separate basic networking from real network configuration.",
      "AV network work may also require AV context.",
    ],
  },
  {
    id: "senior-network-engineer",
    roleFamily: "IT",
    roleTitle: "Senior Network Engineer",
    responsibilityBand: "specialist",
    canWorkAlone: true,
    canLeadOthers: true,
    requiresEvidence: true,
    requiresNamedSupervisor: false,
    typicalDayRateNote: "Senior specialist network rate.",
    responsibilityStatement:
      "This role requires a senior network engineer who can own switch, VLAN, routing, PoE, multicast and site network readiness decisions, supervise network support engineers and coordinate safely with the client IT team.",
    notIncludedUnlessSelected: [
      "Full cybersecurity architecture",
      "Server administration",
      "AV endpoint commissioning",
      "Managed service ownership after handover",
    ],
    requiredSkills: [
      { skill: "Network design validation", minimumLevel: 4, importance: 5 },
      { skill: "Managed switch configuration", minimumLevel: 5, importance: 5 },
      { skill: "VLAN design and troubleshooting", minimumLevel: 5, importance: 5 },
      { skill: "Routing", minimumLevel: 4, importance: 4 },
      { skill: "Firewall coordination", minimumLevel: 4, importance: 4 },
      { skill: "PoE budgeting", minimumLevel: 4, importance: 4 },
      { skill: "Multicast troubleshooting", minimumLevel: 4, importance: 5 },
      { skill: "Network change control", minimumLevel: 4, importance: 5 },
      { skill: "Network documentation", minimumLevel: 5, importance: 4 },
    ],
    siteReadiness: readiness({
      ownToolsRequired: true,
      evidenceRequired: true,
    }),
    mismatchWarnings: [
      "Senior network work should require evidence.",
      "Confirm change control, admin access and rollback expectations before attendance.",
    ],
  },
  {
    id: "wifi-engineer",
    roleFamily: "IT",
    roleTitle: "Wi-Fi Engineer",
    responsibilityBand: "specialist",
    canWorkAlone: true,
    canLeadOthers: false,
    requiresEvidence: true,
    requiresNamedSupervisor: false,
    typicalDayRateNote: "Specialist wireless rate.",
    responsibilityStatement:
      "This role requires wireless survey, access point placement, channel planning, interference awareness and validation skills. Installing access points is not the same as designing or validating Wi-Fi performance.",
    notIncludedUnlessSelected: [
      "Full network switching configuration",
      "Firewall configuration",
      "Structured cabling",
      "AV commissioning",
    ],
    requiredSkills: [
      { skill: "Wi-Fi survey", minimumLevel: 4, importance: 5 },
      { skill: "Access point placement", minimumLevel: 4, importance: 5 },
      { skill: "Channel planning", minimumLevel: 4, importance: 4 },
      { skill: "RF interference awareness", minimumLevel: 4, importance: 5 },
      { skill: "SSID and security configuration", minimumLevel: 3, importance: 4 },
      { skill: "Wireless troubleshooting", minimumLevel: 4, importance: 5 },
      { skill: "Coverage validation", minimumLevel: 4, importance: 5 },
      { skill: "Wireless documentation", minimumLevel: 4, importance: 4 },
    ],
    siteReadiness: readiness({
      ownToolsRequired: true,
      evidenceRequired: true,
    }),
    mismatchWarnings: [
      "Do not infer wireless design skill from access point installation alone.",
      "Confirm whether a formal RF survey or only AP installation is required.",
    ],
  },
  {
    id: "m365-endpoint-engineer",
    roleFamily: "IT",
    roleTitle: "Microsoft 365 / Endpoint Engineer",
    responsibilityBand: "specialist",
    canWorkAlone: true,
    canLeadOthers: false,
    requiresEvidence: true,
    requiresNamedSupervisor: false,
    typicalDayRateNote: "Specialist endpoint/cloud administration rate.",
    responsibilityStatement:
      "This role requires Microsoft 365, endpoint management and user/device administration competence. It should not be treated as basic desktop deployment unless the scope is limited to simple rollout tasks.",
    notIncludedUnlessSelected: [
      "Server administration",
      "Network configuration",
      "Cybersecurity investigation",
      "AV installation",
    ],
    requiredSkills: [
      { skill: "Microsoft 365 administration", minimumLevel: 4, importance: 5 },
      { skill: "Intune / endpoint management", minimumLevel: 4, importance: 5 },
      { skill: "Azure AD / Entra ID basics", minimumLevel: 4, importance: 5 },
      { skill: "User and group administration", minimumLevel: 4, importance: 4 },
      { skill: "Device enrolment", minimumLevel: 4, importance: 4 },
      { skill: "Policy troubleshooting", minimumLevel: 4, importance: 5 },
      { skill: "Migration support", minimumLevel: 3, importance: 4 },
      { skill: "Admin documentation", minimumLevel: 4, importance: 4 },
    ],
    siteReadiness: readiness({
      ownToolsRequired: true,
      evidenceRequired: true,
    }),
    mismatchWarnings: [
      "Requires careful access control and client approval before admin changes.",
      "Do not confuse Microsoft 365 user support with tenant administration.",
    ],
  },
  {
    id: "server-infrastructure-engineer",
    roleFamily: "IT",
    roleTitle: "Server / Infrastructure Engineer",
    responsibilityBand: "specialist",
    canWorkAlone: true,
    canLeadOthers: false,
    requiresEvidence: true,
    requiresNamedSupervisor: false,
    typicalDayRateNote: "Specialist infrastructure rate.",
    responsibilityStatement:
      "This role requires server, virtualisation, backup, storage or core infrastructure competence. It should only be matched where the engineer has proven experience and the change scope is clear.",
    notIncludedUnlessSelected: [
      "Network architecture",
      "Cyber incident response",
      "Desktop rollout labour",
      "AV installation",
    ],
    requiredSkills: [
      { skill: "Windows Server administration", minimumLevel: 4, importance: 5 },
      { skill: "Virtualisation basics", minimumLevel: 3, importance: 4 },
      { skill: "Backup and restore awareness", minimumLevel: 4, importance: 5 },
      { skill: "Storage awareness", minimumLevel: 3, importance: 4 },
      { skill: "Patch management", minimumLevel: 4, importance: 4 },
      { skill: "Change control", minimumLevel: 4, importance: 5 },
      { skill: "Infrastructure troubleshooting", minimumLevel: 4, importance: 5 },
      { skill: "Infrastructure documentation", minimumLevel: 4, importance: 4 },
    ],
    siteReadiness: readiness({
      ownToolsRequired: true,
      evidenceRequired: true,
    }),
    mismatchWarnings: [
      "Server work should not be assigned from generic IT tags.",
      "Confirm backup, rollback and change-window requirements before attendance.",
    ],
  },
  {
    id: "cybersecurity-support-engineer",
    roleFamily: "IT",
    roleTitle: "Cybersecurity Support Engineer",
    responsibilityBand: "specialist",
    canWorkAlone: true,
    canLeadOthers: false,
    requiresEvidence: true,
    requiresNamedSupervisor: false,
    typicalDayRateNote: "Specialist cyber support rate.",
    responsibilityStatement:
      "This role is for defined cybersecurity support tasks such as baseline checks, endpoint security support, MFA rollout, patch compliance assistance and evidence collection. It is not a substitute for a cyber consultant or incident response lead unless separately specified.",
    notIncludedUnlessSelected: [
      "Incident response leadership",
      "Penetration testing",
      "Security architecture",
      "Firewall ownership",
      "Legal or compliance sign-off",
    ],
    requiredSkills: [
      { skill: "Security hygiene checks", minimumLevel: 4, importance: 5 },
      { skill: "MFA rollout support", minimumLevel: 4, importance: 4 },
      { skill: "Endpoint security support", minimumLevel: 4, importance: 5 },
      { skill: "Patch compliance support", minimumLevel: 4, importance: 4 },
      { skill: "Evidence collection", minimumLevel: 4, importance: 5 },
      { skill: "Secure escalation discipline", minimumLevel: 5, importance: 5 },
      { skill: "Confidentiality handling", minimumLevel: 5, importance: 5 },
      { skill: "Security documentation", minimumLevel: 4, importance: 4 },
    ],
    siteReadiness: readiness({
      ownToolsRequired: true,
      evidenceRequired: true,
    }),
    mismatchWarnings: [
      "Cybersecurity roles require trust, evidence and clear scope boundaries.",
      "Do not imply incident response or penetration testing unless specifically selected.",
    ],
  },
  {
    id: "it-lead-rollout-engineer",
    roleFamily: "IT",
    roleTitle: "IT Lead / Rollout Lead",
    responsibilityBand: "lead",
    canWorkAlone: true,
    canLeadOthers: true,
    requiresEvidence: true,
    requiresNamedSupervisor: false,
    typicalDayRateNote: "Lead rate. Should reflect site coordination and delivery responsibility.",
    responsibilityStatement:
      "This role is responsible for coordinating IT rollout or site activity, managing other engineers, escalating risks, tracking progress, validating completion quality and ensuring the agreed IT scope is delivered.",
    notIncludedUnlessSelected: [
      "Network architecture",
      "Server architecture",
      "Cybersecurity specialist work",
      "AV commissioning",
    ],
    requiredSkills: [
      { skill: "Site coordination", minimumLevel: 4, importance: 5 },
      { skill: "Engineer supervision", minimumLevel: 4, importance: 5 },
      { skill: "Rollout tracking", minimumLevel: 4, importance: 5 },
      { skill: "Client communication", minimumLevel: 4, importance: 5 },
      { skill: "Escalation judgement", minimumLevel: 4, importance: 5 },
      { skill: "Quality control", minimumLevel: 4, importance: 5 },
      { skill: "Completion documentation", minimumLevel: 4, importance: 4 },
      { skill: "Handover", minimumLevel: 4, importance: 4 },
    ],
    siteReadiness: readiness({
      ownToolsRequired: true,
      evidenceRequired: true,
    }),
    mismatchWarnings: [
      "Lead role requires operational responsibility, not just technical skill.",
      "A rollout lead may still need separate network, server or cyber specialists.",
    ],
  },
  {
    id: "control-programmer",
    roleFamily: "AV",
    roleTitle: "Control Programmer",
    responsibilityBand: "specialist",
    canWorkAlone: true,
    canLeadOthers: false,
    requiresEvidence: true,
    requiresNamedSupervisor: false,
    typicalDayRateNote: "Specialist control/programming rate.",
    responsibilityStatement:
      "This role requires device control, interface, logic and testing competence. It should not be treated as general installation work.",
    notIncludedUnlessSelected: [
      "DSP programming",
      "Network switch configuration",
      "General installation labour",
    ],
    requiredSkills: [
      { skill: "Control system commissioning", minimumLevel: 4, importance: 5 },
      { skill: "Touch panel setup", minimumLevel: 4, importance: 4 },
      { skill: "RS232 control", minimumLevel: 4, importance: 4 },
      { skill: "IP control", minimumLevel: 4, importance: 5 },
      { skill: "Relay and GPIO", minimumLevel: 3, importance: 3 },
      { skill: "Macro logic", minimumLevel: 4, importance: 4 },
      { skill: "API integration", minimumLevel: 3, importance: 3 },
      { skill: "User interface testing", minimumLevel: 4, importance: 4 },
    ],
    siteReadiness: readiness({
      ownToolsRequired: true,
      evidenceRequired: true,
    }),
    mismatchWarnings: [
      "Control programming requires proof of practical configuration and debugging.",
      "Do not treat as generic AV installation work.",
    ],
  },
  {
    id: "lead-site-engineer",
    roleFamily: "Hybrid",
    roleTitle: "Lead Engineer / Site Lead",
    responsibilityBand: "lead",
    canWorkAlone: true,
    canLeadOthers: true,
    requiresEvidence: true,
    requiresNamedSupervisor: false,
    typicalDayRateNote: "Lead rate. Should reflect responsibility for coordination and outcome.",
    responsibilityStatement:
      "This role is responsible for site coordination, managing other engineers, escalating risk, validating quality and ensuring the agreed scope is completed. Lead is not just the best technical engineer; it requires judgement, communication and ownership.",
    notIncludedUnlessSelected: [
      "Specialist DSP programming",
      "Specialist network configuration",
      "Specialist control programming",
    ],
    requiredSkills: [
      { skill: "Technical ownership", minimumLevel: 4, importance: 5 },
      { skill: "Site coordination", minimumLevel: 4, importance: 5 },
      { skill: "Junior supervision", minimumLevel: 4, importance: 4 },
      { skill: "Client communication", minimumLevel: 4, importance: 5 },
      { skill: "Escalation judgement", minimumLevel: 4, importance: 5 },
      { skill: "Quality control", minimumLevel: 4, importance: 5 },
      { skill: "Completion documentation", minimumLevel: 4, importance: 4 },
      { skill: "Handover", minimumLevel: 4, importance: 4 },
    ],
    siteReadiness: readiness({
      ownToolsRequired: true,
      evidenceRequired: true,
    }),
    mismatchWarnings: [
      "Lead role requires operational responsibility, not just technical ability.",
      "A lead installer may still need separate DSP, network or control specialists.",
    ],
  },
];

export function getRoleExpectation(id: string): RoleExpectation {
  return roleExpectations.find((item) => item.id === id) || roleExpectations[0];
}

export function cloneSkillRequirements(skills: SkillRequirement[]): SkillRequirement[] {
  return skills.map((skill) => ({ ...skill }));
}

export function getMatchBand(score: number): "Strong match" | "Viable match" | "Partial match" | "Poor match" {
  if (score >= 90) {
    return "Strong match";
  }

  if (score >= 70) {
    return "Viable match";
  }

  if (score >= 50) {
    return "Partial match";
  }

  return "Poor match";
}