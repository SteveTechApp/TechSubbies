import type { CandidateSkillProfile, OpportunityRequirement } from "../types/opportunityMatching";

export const sampleOpportunityRequirements: OpportunityRequirement[] = [
  {
    id: "opp-av-video-wall-001",
    title: "Commission 3x3 LED wall and source routing",
    market: "AV",
    roleIds: ["video-wall-led-specialist", "video-commissioning-engineer"],
    summary: "Customer needs an engineer to validate LED processor setup, canvas mapping, HDMI source routing and source layout handover.",
    locationMode: "onsite",
    skillRequirements: [
      { id: "skill-canvas", label: "Canvas mapping and scaling", priority: "must-have", aliases: ["canvas mapping", "scaling"] },
      { id: "skill-led", label: "LED processor signal flow", priority: "must-have", aliases: ["LED processor", "LED wall processor"] },
      { id: "skill-hdmi", label: "HDMI signal testing", priority: "must-have", aliases: ["HDMI testing"] },
      { id: "skill-layout", label: "Source layout validation", priority: "nice-to-have", aliases: ["source layout"] },
      { id: "skill-colour", label: "Colour calibration and brightness matching", priority: "nice-to-have", aliases: ["brightness matching", "colour calibration"] }
    ],
    productRequirements: [
      { tagId: "novastar", label: "Novastar", minimumLevel: "configured", priority: "must-have" },
      { tagId: "led-processing", label: "LED Processing", minimumLevel: "commissioned", priority: "must-have" },
      { tagId: "hdmi", label: "HDMI", minimumLevel: "troubleshot", priority: "nice-to-have" }
    ],
    notes: ["Availability and travel radius should be checked separately."]
  },
  {
    id: "opp-it-m365-001",
    title: "Migrate small business users to Microsoft 365",
    market: "IT",
    roleIds: ["microsoft-365-modern-workplace-administrator", "it-service-desk-helpdesk-technician"],
    summary: "Customer needs user setup, mailbox migration support, MFA checks and endpoint readiness validation.",
    locationMode: "hybrid",
    skillRequirements: [
      { id: "skill-m365-admin", label: "Microsoft 365 administration", priority: "must-have", aliases: ["M365 admin", "Microsoft 365 admin"] },
      { id: "skill-users", label: "User account setup", priority: "must-have", aliases: ["user setup", "account setup"] },
      { id: "skill-mfa", label: "MFA support", priority: "must-have", aliases: ["multi-factor authentication"] },
      { id: "skill-mail", label: "Mailbox migration support", priority: "nice-to-have", aliases: ["mail migration", "Exchange Online"] },
      { id: "skill-doc", label: "User handover documentation", priority: "nice-to-have", aliases: ["handover notes"] }
    ],
    productRequirements: [
      { tagId: "microsoft-365", label: "Microsoft 365", minimumLevel: "administered", priority: "must-have" },
      { tagId: "entra-id", label: "Microsoft Entra ID", minimumLevel: "configured", priority: "must-have" },
      { tagId: "intune", label: "Microsoft Intune", minimumLevel: "aware", priority: "nice-to-have" }
    ],
    notes: ["Customer data handling and admin access rules must be confirmed."]
  },
  {
    id: "opp-av-uc-room-001",
    title: "Validate hybrid meeting room audio and USB routing",
    market: "AV",
    roleIds: ["uc-meeting-room-engineer", "audio-commissioning-engineer"],
    summary: "Customer needs test calls, USB route validation, microphone pickup checks and basic audio handover.",
    locationMode: "onsite",
    skillRequirements: [
      { id: "skill-uc-flow", label: "Understand UC room signal flow", priority: "must-have", aliases: ["UC room signal flow"] },
      { id: "skill-usb", label: "USB camera/audio routing awareness", priority: "must-have", aliases: ["USB routing"] },
      { id: "skill-mic", label: "Validate microphone pickup", priority: "must-have", aliases: ["microphone pickup"] },
      { id: "skill-test-call", label: "Test Teams, Zoom or Webex calls", priority: "must-have", aliases: ["test calls"] },
      { id: "skill-ceiling", label: "Ceiling microphone setup", priority: "nice-to-have", aliases: ["ceiling microphone"] }
    ],
    productRequirements: [
      { tagId: "usb-byod-byom", label: "USB / BYOD / BYOM", minimumLevel: "configured", priority: "must-have" },
      { tagId: "logitech", label: "Logitech", minimumLevel: "installed", priority: "nice-to-have" },
      { tagId: "shure", label: "Shure", minimumLevel: "configured", priority: "nice-to-have" }
    ]
  }
];

export const sampleCandidateProfiles: CandidateSkillProfile[] = [
  {
    id: "candidate-av-led-specialist",
    displayName: "Sample AV LED Specialist",
    market: "AV",
    roleIds: ["video-wall-led-specialist", "video-commissioning-engineer"],
    roleTitles: ["Video Wall / LED Specialist", "Video Commissioning Engineer"],
    availabilitySummary: "Available weekdays within 80 miles.",
    skills: [
      "Understand video wall signal chain",
      "Canvas mapping and scaling",
      "Source layout validation",
      "LED processor signal flow",
      "HDMI signal testing",
      "EDID management",
      "Resolution and refresh-rate validation",
      "Colour calibration and brightness matching"
    ],
    productExperience: {
      novastar: "commissioned",
      "led-processing": "commissioned",
      hdmi: "troubleshot",
      samsung: "installed"
    },
    evidence: ["LED wall commissioning report", "Video wall source layout handover"]
  },
  {
    id: "candidate-av-basic-installer",
    displayName: "Sample Basic AV Installer",
    market: "AV",
    roleIds: ["free-basic-av-installation-engineer", "av-installation-engineer"],
    roleTitles: ["Free Basic AV Installation Engineer", "AV Installation Engineer"],
    availabilitySummary: "Available weekends and evenings locally.",
    skills: [
      "Identify HDMI, USB, CAT, speaker, control and basic audio cables",
      "Understand source-to-display signal flow",
      "Follow cable schedules and basic drawings",
      "Route, dress and label cables neatly",
      "Work safely under instruction from a lead engineer",
      "Display and bracket installation awareness"
    ],
    productExperience: {
      hdmi: "installed",
      "usb-byod-byom": "assisted",
      hdbaset: "aware",
      logitech: "assisted"
    },
    evidence: ["Lead engineer reference", "Cable labelling examples"]
  },
  {
    id: "candidate-av-uc-audio",
    displayName: "Sample UC Audio Engineer",
    market: "AV",
    roleIds: ["uc-meeting-room-engineer", "audio-commissioning-engineer"],
    roleTitles: ["UC / Meeting Room Engineer", "Audio Commissioning Engineer"],
    availabilitySummary: "Available for onsite commissioning next week.",
    skills: [
      "Understand UC room signal flow",
      "USB camera/audio routing awareness",
      "Test Teams, Zoom or Webex calls",
      "Validate microphone pickup",
      "Validate speaker playback",
      "DSP routing and matrix setup",
      "Gain structure",
      "AEC setup and optimisation",
      "Conferencing audio validation"
    ],
    productExperience: {
      "usb-byod-byom": "commissioned",
      logitech: "configured",
      shure: "commissioned",
      qsys: "commissioned",
      biamp: "configured"
    },
    evidence: ["Meeting-room validation checklist", "DSP commissioning notes"]
  },
  {
    id: "candidate-it-m365-admin",
    displayName: "Sample Microsoft 365 Administrator",
    market: "IT",
    roleIds: ["microsoft-365-modern-workplace-administrator", "it-service-desk-helpdesk-technician"],
    roleTitles: ["Microsoft 365 / Modern Workplace Administrator", "IT Service Desk / Helpdesk Technician"],
    availabilitySummary: "Available remotely with one onsite day possible.",
    skills: [
      "Microsoft 365 administration",
      "User account setup",
      "MFA support",
      "Mailbox migration support",
      "Exchange Online support",
      "User handover documentation",
      "Endpoint readiness checks"
    ],
    productExperience: {
      "microsoft-365": "administered",
      "entra-id": "configured",
      intune: "configured",
      "exchange-online": "administered"
    },
    evidence: ["M365 migration checklist", "Admin support references"]
  }
];
