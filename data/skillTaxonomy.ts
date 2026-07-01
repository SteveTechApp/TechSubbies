export type SkillMarket = "AV" | "IT" | "Hybrid";

export type SkillCategory = {
  id: string;
  name: string;
  skills: string[];
};

export type EngineerRoleTemplate = {
  id: string;
  market: SkillMarket;
  title: string;
  summary: string;
  defaultSkills: string[];
};

export const competencyLevels = [
  { level: 1, label: "Aware", description: "Understands the task but needs supervision." },
  { level: 2, label: "Assisted", description: "Can complete basic work with guidance." },
  { level: 3, label: "Competent", description: "Can complete normal project work independently." },
  { level: 4, label: "Advanced", description: "Can handle complex sites, faults and variations." },
  { level: 5, label: "Lead / Specialist", description: "Can lead others, validate design and resolve high-risk issues." },
] as const;

export const skillCategories: SkillCategory[] = [
  {
    id: "av-install",
    name: "AV installation",
    skills: [
      "Display mounting",
      "Projector installation",
      "Projection alignment",
      "Interactive display installation",
      "Video wall mounting",
      "LED wall installation",
      "Rack build",
      "Cable containment",
      "Cable pulling",
      "Cable termination",
      "Site survey",
      "Working at height",
      "Tool handling",
      "Snagging and handover",
    ],
  },
  {
    id: "av-signal",
    name: "AV signal management",
    skills: [
      "HDMI",
      "HDBaseT",
      "AV over IP",
      "Video matrix systems",
      "Multiview systems",
      "EDID management",
      "HDCP troubleshooting",
      "USB extension",
      "USB-C presentation systems",
      "Wireless presentation",
      "KVM",
      "Fibre AV links",
      "Signal testing",
      "Fault finding",
    ],
  },
  {
    id: "uc-vc",
    name: "UC / VC rooms",
    skills: [
      "Microsoft Teams Rooms",
      "Zoom Rooms",
      "BYOD meeting rooms",
      "BYOM systems",
      "USB cameras",
      "PTZ cameras",
      "Speakerphones",
      "Beamforming microphones",
      "Room scheduling panels",
      "Camera framing",
      "Audio echo checks",
      "User acceptance testing",
    ],
  },
  {
    id: "audio-dsp",
    name: "Audio and DSP",
    skills: [
      "Ceiling speakers",
      "Amplifiers",
      "Microphone systems",
      "DSP configuration",
      "Dante",
      "AEC setup",
      "Gain structure",
      "Audio testing",
      "Zoned audio",
      "Assistive listening",
      "Background music systems",
      "Speech reinforcement",
    ],
  },
  {
    id: "control",
    name: "Control and automation",
    skills: [
      "Control system commissioning",
      "Touch panel setup",
      "RS232 control",
      "IR control",
      "IP control",
      "Relay control",
      "GPIO",
      "Macro programming",
      "API integration",
      "User interface testing",
      "System documentation",
    ],
  },
  {
    id: "networking",
    name: "Networking",
    skills: [
      "Basic IP networking",
      "VLANs",
      "Managed switches",
      "PoE",
      "QoS",
      "Multicast",
      "IGMP snooping",
      "10Gb networking",
      "Wi-Fi survey support",
      "Firewall coordination",
      "Network documentation",
      "Remote support access",
    ],
  },
  {
    id: "it-field",
    name: "IT field support",
    skills: [
      "Desktop deployment",
      "Laptop deployment",
      "Printer setup",
      "Patch management support",
      "Microsoft 365 support",
      "Active Directory basics",
      "Endpoint troubleshooting",
      "Basic cyber hygiene",
      "Asset tagging",
      "User handover",
    ],
  },
  {
    id: "compliance",
    name: "Compliance and paperwork",
    skills: [
      "RAMS",
      "Method statements",
      "Risk assessments",
      "Public liability insurance",
      "Professional indemnity insurance",
      "DBS requirement",
      "ECS / CSCS card",
      "IPAF",
      "PASMA",
      "First aid",
      "As-built documentation",
      "O&M documentation",
    ],
  },
];

export const engineerRoleTemplates: EngineerRoleTemplate[] = [
  {
    id: "av-installer",
    market: "AV",
    title: "AV Installation Engineer",
    summary: "Physical installation, cabling, mounting, rack work and site handover.",
    defaultSkills: ["Display mounting", "Rack build", "Cable pulling", "Cable termination", "HDMI", "HDBaseT", "Snagging and handover"],
  },
  {
    id: "av-commissioning",
    market: "AV",
    title: "AV Commissioning Engineer",
    summary: "System setup, signal testing, fault finding and final validation.",
    defaultSkills: ["AV over IP", "Video matrix systems", "EDID management", "HDCP troubleshooting", "Signal testing", "Fault finding", "System documentation"],
  },
  {
    id: "uc-vc-engineer",
    market: "Hybrid",
    title: "UC / VC Engineer",
    summary: "Meeting room setup, camera/audio validation and platform handover.",
    defaultSkills: ["Microsoft Teams Rooms", "Zoom Rooms", "BYOD meeting rooms", "USB cameras", "PTZ cameras", "Audio echo checks", "User acceptance testing"],
  },
  {
    id: "dsp-audio-engineer",
    market: "AV",
    title: "Audio / DSP Engineer",
    summary: "Microphones, DSP, Dante, AEC, gain structure and audio commissioning.",
    defaultSkills: ["DSP configuration", "Dante", "AEC setup", "Gain structure", "Audio testing", "Microphone systems"],
  },
  {
    id: "control-programmer",
    market: "AV",
    title: "Control Programmer",
    summary: "Control logic, interfaces, device control and user testing.",
    defaultSkills: ["Control system commissioning", "Touch panel setup", "RS232 control", "IP control", "Macro programming", "API integration"],
  },
  {
    id: "network-engineer",
    market: "IT",
    title: "Network Engineer",
    summary: "Switching, VLANs, multicast, PoE and network readiness for AV/IT systems.",
    defaultSkills: ["Basic IP networking", "VLANs", "Managed switches", "PoE", "QoS", "Multicast", "IGMP snooping"],
  },
  {
    id: "it-field-engineer",
    market: "IT",
    title: "IT Field Engineer",
    summary: "Endpoint, desktop, M365 and general IT field deployment support.",
    defaultSkills: ["Desktop deployment", "Laptop deployment", "Microsoft 365 support", "Endpoint troubleshooting", "Asset tagging", "User handover"],
  },
  {
    id: "video-wall-engineer",
    market: "AV",
    title: "Video Wall / LED Engineer",
    summary: "LCD video wall or LED installation, alignment and commissioning support.",
    defaultSkills: ["Video wall mounting", "LED wall installation", "Multiview systems", "Projection alignment", "Signal testing", "Fault finding"],
  },
];

export const allSkills = skillCategories.flatMap((category) => category.skills);