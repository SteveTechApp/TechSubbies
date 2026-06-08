import {
  ComplianceCredentialDefinition,
  ComplianceRequirementLevelDefinition,
  RoleComplianceRequirement,
  TrustBadgeDefinition,
} from "../types/compliance";

export const COMPLIANCE_REQUIREMENT_LEVELS: ComplianceRequirementLevelDefinition[] = [
  {
    key: "PROJECT_MANDATORY",
    label: "Mandatory for this project",
    description:
      "Required because the project, site, customer, country or work type needs it.",
    matchScoreWeight: 100,
  },
  {
    key: "STRONGLY_PREFERRED",
    label: "Strongly preferred",
    description:
      "Not always mandatory, but materially improves suitability and confidence.",
    matchScoreWeight: 35,
  },
  {
    key: "USEFUL_EVIDENCE",
    label: "Useful evidence",
    description:
      "Helpful proof of capability, but not enough on its own to block a match.",
    matchScoreWeight: 15,
  },
  {
    key: "COMPANY_LEVEL_ONLY",
    label: "Company-level only",
    description:
      "Usually applies to a company, resourcing firm or managed service provider rather than an individual freelancer.",
    matchScoreWeight: 20,
  },
  {
    key: "REGION_SPECIFIC",
    label: "Region-specific",
    description:
      "Relevant only in certain countries, site types, sectors or customer environments.",
    matchScoreWeight: 25,
  },
  {
    key: "ROLE_NOT_RELEVANT",
    label: "Not relevant to this role",
    description:
      "Should not be requested by default because it adds friction without improving match quality.",
    matchScoreWeight: 0,
  },
];

export const COMPLIANCE_CREDENTIALS: ComplianceCredentialDefinition[] = [
  {
    key: "right-to-work",
    category: "REGIONAL_COMPLIANCE",
    title: "Right to work / operating eligibility",
    description:
      "Evidence that the engineer or business is eligible to work in the relevant country or region.",
    typicalOwners: ["ENGINEER", "COMPANY", "RESOURCING_COMPANY"],
    appliesToMarkets: ["GENERAL"],
    examples: ["Right-to-work declaration", "Local operating permission", "Business registration"],
    defaultRequirementLevel: "REGION_SPECIFIC",
    expires: true,
    recommendedExpiryMonths: 12,
    requiresOfficialDocument: true,
    notes:
      "Do not expose sensitive document details to customers. Store only verification status where possible.",
  },
  {
    key: "id-verification",
    category: "REGIONAL_COMPLIANCE",
    title: "Identity verification",
    description:
      "Official identity verification for platform trust, country validation and fraud reduction.",
    typicalOwners: ["ENGINEER"],
    appliesToMarkets: ["GENERAL"],
    examples: ["Passport", "National ID", "Driving licence where accepted"],
    defaultRequirementLevel: "USEFUL_EVIDENCE",
    expires: true,
    recommendedExpiryMonths: 36,
    requiresOfficialDocument: true,
    notes:
      "Used for trust and country verification. Avoid long-term storage of full ID images unless required.",
  },
  {
    key: "proof-of-address",
    category: "REGIONAL_COMPLIANCE",
    title: "Proof of address",
    description:
      "Address evidence used to support regional pricing, country verification and anti-VPN checks.",
    typicalOwners: ["ENGINEER", "COMPANY", "RESOURCING_COMPANY"],
    appliesToMarkets: ["GENERAL"],
    examples: ["Utility bill", "Bank statement", "Government correspondence"],
    defaultRequirementLevel: "REGION_SPECIFIC",
    expires: true,
    recommendedExpiryMonths: 12,
    requiresOfficialDocument: true,
    notes:
      "Should be used to verify country/region, not displayed as public profile information.",
  },
  {
    key: "public-liability-insurance",
    category: "INSURANCE",
    title: "Public liability insurance",
    description:
      "Insurance covering third-party injury or property damage risks during site work.",
    typicalOwners: ["ENGINEER", "COMPANY", "RESOURCING_COMPANY"],
    appliesToMarkets: ["GENERAL"],
    examples: ["Public liability certificate", "Contractor liability insurance"],
    defaultRequirementLevel: "STRONGLY_PREFERRED",
    expires: true,
    recommendedExpiryMonths: 12,
    requiresOfficialDocument: true,
    notes:
      "Often essential for site attendance, installation work and customer premises access.",
  },
  {
    key: "professional-indemnity-insurance",
    category: "INSURANCE",
    title: "Professional indemnity insurance",
    description:
      "Insurance relevant where advice, design, programming, commissioning or consultancy could cause commercial loss.",
    typicalOwners: ["ENGINEER", "COMPANY", "RESOURCING_COMPANY"],
    appliesToMarkets: ["AV", "IT", "AV_IT"],
    examples: ["Professional indemnity certificate", "Errors and omissions cover"],
    defaultRequirementLevel: "USEFUL_EVIDENCE",
    expires: true,
    recommendedExpiryMonths: 12,
    requiresOfficialDocument: true,
    notes:
      "More relevant for design, commissioning, control programming, network/security and consultancy work.",
  },
  {
    key: "employers-liability-insurance",
    category: "INSURANCE",
    title: "Employers' liability insurance",
    description:
      "Insurance relevant to companies that employ or manage staff.",
    typicalOwners: ["COMPANY", "RESOURCING_COMPANY"],
    appliesToMarkets: ["GENERAL"],
    examples: ["Employers' liability certificate"],
    defaultRequirementLevel: "COMPANY_LEVEL_ONLY",
    expires: true,
    recommendedExpiryMonths: 12,
    requiresOfficialDocument: true,
    notes:
      "Usually company-level only, not required for a lone freelancer unless legally applicable.",
  },
  {
    key: "site-safety-card",
    category: "SAFETY_SITE_ACCESS",
    title: "Site safety card",
    description:
      "A construction or site access safety card relevant to the local region.",
    typicalOwners: ["ENGINEER"],
    appliesToMarkets: ["GENERAL"],
    examples: ["CSCS", "ECS", "SST", "White Card", "Local site-safety card"],
    defaultRequirementLevel: "REGION_SPECIFIC",
    expires: true,
    recommendedExpiryMonths: 60,
    requiresOfficialDocument: true,
    notes:
      "Do not make globally mandatory. Require only when the site, country or customer needs it.",
  },
  {
    key: "ipaf-mewp",
    category: "SAFETY_SITE_ACCESS",
    title: "IPAF / MEWP powered access",
    description:
      "Powered access certification for working from mobile elevated work platforms.",
    typicalOwners: ["ENGINEER"],
    appliesToMarkets: ["AV", "IT", "AV_IT"],
    examples: ["IPAF PAL card", "Local MEWP certification"],
    defaultRequirementLevel: "PROJECT_MANDATORY",
    expires: true,
    recommendedExpiryMonths: 60,
    requiresOfficialDocument: true,
    notes:
      "Only mandatory where powered access equipment is required.",
  },
  {
    key: "pasma-tower",
    category: "SAFETY_SITE_ACCESS",
    title: "PASMA / mobile tower scaffold",
    description:
      "Mobile access tower training for safe tower assembly and use.",
    typicalOwners: ["ENGINEER"],
    appliesToMarkets: ["AV", "IT", "AV_IT"],
    examples: ["PASMA", "Local tower scaffold training"],
    defaultRequirementLevel: "PROJECT_MANDATORY",
    expires: true,
    recommendedExpiryMonths: 60,
    requiresOfficialDocument: true,
    notes:
      "Only mandatory where tower scaffold access is required.",
  },
  {
    key: "working-at-height",
    category: "SAFETY_SITE_ACCESS",
    title: "Working at height",
    description:
      "Safety training for work above floor level, including mounting, ceiling work and high-level cabling.",
    typicalOwners: ["ENGINEER"],
    appliesToMarkets: ["AV", "IT", "AV_IT"],
    examples: ["Working at height certificate", "Customer site induction"],
    defaultRequirementLevel: "STRONGLY_PREFERRED",
    expires: true,
    recommendedExpiryMonths: 36,
    requiresOfficialDocument: true,
    notes:
      "Relevant to display mounting, projector work, speaker installation, wireless APs and cable routes.",
  },
  {
    key: "manual-handling",
    category: "SAFETY_SITE_ACCESS",
    title: "Manual handling",
    description:
      "Training for safe lifting, moving equipment and general site handling.",
    typicalOwners: ["ENGINEER"],
    appliesToMarkets: ["GENERAL"],
    examples: ["Manual handling certificate", "Site induction record"],
    defaultRequirementLevel: "USEFUL_EVIDENCE",
    expires: true,
    recommendedExpiryMonths: 36,
    requiresOfficialDocument: false,
    notes:
      "Useful for physical installation and labour-only work, but should not block most matches.",
  },
  {
    key: "asbestos-awareness",
    category: "SAFETY_SITE_ACCESS",
    title: "Asbestos awareness",
    description:
      "Awareness training for refurbishment, ceiling void, older building and pre-demolition environments.",
    typicalOwners: ["ENGINEER"],
    appliesToMarkets: ["GENERAL"],
    examples: ["Asbestos awareness certificate"],
    defaultRequirementLevel: "REGION_SPECIFIC",
    expires: true,
    recommendedExpiryMonths: 12,
    requiresOfficialDocument: true,
    notes:
      "Relevant for older buildings and refurbishment sites. Not required for every project.",
  },
  {
    key: "first-aid",
    category: "SAFETY_SITE_ACCESS",
    title: "First aid",
    description:
      "First-aid training useful for site teams and lone-worker risk mitigation.",
    typicalOwners: ["ENGINEER"],
    appliesToMarkets: ["GENERAL"],
    examples: ["Emergency first aid at work", "Local first-aid certificate"],
    defaultRequirementLevel: "USEFUL_EVIDENCE",
    expires: true,
    recommendedExpiryMonths: 36,
    requiresOfficialDocument: true,
    notes:
      "Useful but normally not mandatory unless the customer or site requires it.",
  },
  {
    key: "avixa-cts",
    category: "AV_INDUSTRY",
    title: "AVIXA CTS",
    description:
      "General professional AV credential for AV knowledge and terminology.",
    typicalOwners: ["ENGINEER"],
    appliesToMarkets: ["AV", "AV_IT"],
    examples: ["CTS"],
    defaultRequirementLevel: "USEFUL_EVIDENCE",
    expires: true,
    recommendedExpiryMonths: 36,
    requiresOfficialDocument: true,
    notes:
      "Do not make mandatory for basic AV labour. Useful for credibility and general AV understanding.",
  },
  {
    key: "avixa-cts-i",
    category: "AV_INDUSTRY",
    title: "AVIXA CTS-I",
    description:
      "Installation-focused AV credential for AV installation and implementation competence.",
    typicalOwners: ["ENGINEER"],
    appliesToMarkets: ["AV", "AV_IT"],
    examples: ["CTS-I"],
    defaultRequirementLevel: "STRONGLY_PREFERRED",
    expires: true,
    recommendedExpiryMonths: 36,
    requiresOfficialDocument: true,
    notes:
      "Relevant to installation engineer, commissioning and site lead roles.",
  },
  {
    key: "avixa-cts-d",
    category: "AV_INDUSTRY",
    title: "AVIXA CTS-D",
    description:
      "Design-focused AV credential for AV system design capability.",
    typicalOwners: ["ENGINEER"],
    appliesToMarkets: ["AV", "AV_IT"],
    examples: ["CTS-D"],
    defaultRequirementLevel: "STRONGLY_PREFERRED",
    expires: true,
    recommendedExpiryMonths: 36,
    requiresOfficialDocument: true,
    notes:
      "Relevant to design, consultancy, senior pre-sales and project design roles.",
  },
  {
    key: "dante-certification",
    category: "AV_INDUSTRY",
    title: "Dante certification",
    description:
      "Networked audio certification for Dante audio design, deployment and troubleshooting.",
    typicalOwners: ["ENGINEER"],
    appliesToMarkets: ["AV", "AV_IT", "IT"],
    examples: ["Dante Level 1", "Dante Level 2", "Dante Level 3"],
    defaultRequirementLevel: "STRONGLY_PREFERRED",
    expires: false,
    requiresOfficialDocument: true,
    notes:
      "Highly relevant for DSP, audio, conferencing, AVoIP and networked AV work.",
  },
  {
    key: "sdvoe-training",
    category: "AV_INDUSTRY",
    title: "SDVoE training",
    description:
      "Training for SDVoE-based 10GbE AV-over-IP systems.",
    typicalOwners: ["ENGINEER"],
    appliesToMarkets: ["AV", "AV_IT"],
    examples: ["SDVoE Design Partner", "SDVoE training certificate"],
    defaultRequirementLevel: "USEFUL_EVIDENCE",
    expires: false,
    requiresOfficialDocument: true,
    notes:
      "Relevant to SDVoE deployments, especially larger AVoIP systems.",
  },
  {
    key: "hdbaset-training",
    category: "AV_INDUSTRY",
    title: "HDBaseT training",
    description:
      "Training or evidence of competence with HDBaseT extension, distance limits and troubleshooting.",
    typicalOwners: ["ENGINEER"],
    appliesToMarkets: ["AV"],
    examples: ["HDBaseT training", "Manufacturer HDBaseT course"],
    defaultRequirementLevel: "USEFUL_EVIDENCE",
    expires: false,
    requiresOfficialDocument: false,
    notes:
      "Helpful for AV installation and commissioning, but not usually mandatory.",
  },
  {
    key: "comptia-a-plus",
    category: "IT_NETWORKING_SECURITY",
    title: "CompTIA A+",
    description:
      "Entry-level IT support credential for device, desktop and support work.",
    typicalOwners: ["ENGINEER"],
    appliesToMarkets: ["IT"],
    examples: ["CompTIA A+"],
    defaultRequirementLevel: "USEFUL_EVIDENCE",
    expires: true,
    recommendedExpiryMonths: 36,
    requiresOfficialDocument: true,
    notes:
      "Useful for IT support and field deployment roles.",
  },
  {
    key: "comptia-network-plus",
    category: "IT_NETWORKING_SECURITY",
    title: "CompTIA Network+",
    description:
      "Vendor-neutral networking credential for network fundamentals and troubleshooting.",
    typicalOwners: ["ENGINEER"],
    appliesToMarkets: ["IT", "AV_IT"],
    examples: ["Network+"],
    defaultRequirementLevel: "STRONGLY_PREFERRED",
    expires: true,
    recommendedExpiryMonths: 36,
    requiresOfficialDocument: true,
    notes:
      "Useful for AVoIP, UC and network deployment roles.",
  },
  {
    key: "comptia-security-plus",
    category: "IT_NETWORKING_SECURITY",
    title: "CompTIA Security+",
    description:
      "Cybersecurity fundamentals credential for security-aware IT roles.",
    typicalOwners: ["ENGINEER"],
    appliesToMarkets: ["IT", "AV_IT"],
    examples: ["Security+"],
    defaultRequirementLevel: "USEFUL_EVIDENCE",
    expires: true,
    recommendedExpiryMonths: 36,
    requiresOfficialDocument: true,
    notes:
      "Useful for security-sensitive customer environments and IT support.",
  },
  {
    key: "cisco-ccna",
    category: "IT_NETWORKING_SECURITY",
    title: "Cisco CCNA",
    description:
      "Networking certification for IP networking, switching, routing and core infrastructure knowledge.",
    typicalOwners: ["ENGINEER"],
    appliesToMarkets: ["IT", "AV_IT"],
    examples: ["CCNA"],
    defaultRequirementLevel: "STRONGLY_PREFERRED",
    expires: true,
    recommendedExpiryMonths: 36,
    requiresOfficialDocument: true,
    notes:
      "Highly relevant to networking, AVoIP, UC, Wi-Fi and enterprise deployment roles.",
  },
  {
    key: "cisco-ccnp",
    category: "IT_NETWORKING_SECURITY",
    title: "Cisco CCNP",
    description:
      "Advanced Cisco networking certification.",
    typicalOwners: ["ENGINEER"],
    appliesToMarkets: ["IT", "AV_IT"],
    examples: ["CCNP Enterprise", "CCNP Security"],
    defaultRequirementLevel: "STRONGLY_PREFERRED",
    expires: true,
    recommendedExpiryMonths: 36,
    requiresOfficialDocument: true,
    notes:
      "Relevant to senior network engineers and complex enterprise projects.",
  },
  {
    key: "microsoft-365-teams-admin",
    category: "IT_NETWORKING_SECURITY",
    title: "Microsoft 365 / Teams administration",
    description:
      "Microsoft 365 and Teams administration competence for UC and meeting-room environments.",
    typicalOwners: ["ENGINEER"],
    appliesToMarkets: ["IT", "AV_IT"],
    examples: ["Microsoft 365 Certified", "Teams Administrator", "Teams Rooms training"],
    defaultRequirementLevel: "STRONGLY_PREFERRED",
    expires: true,
    recommendedExpiryMonths: 12,
    requiresOfficialDocument: true,
    notes:
      "Relevant to Teams Rooms, Microsoft 365, UC and enterprise meeting spaces.",
  },
  {
    key: "crestron-certified",
    category: "MANUFACTURER_PLATFORM",
    title: "Crestron certification / training",
    description:
      "Manufacturer training or certification for Crestron control, DM, NVX, programming or commissioning.",
    typicalOwners: ["ENGINEER"],
    appliesToMarkets: ["AV", "AV_IT"],
    examples: ["Crestron CTI", "Crestron programming", "DM NVX training"],
    defaultRequirementLevel: "USEFUL_EVIDENCE",
    expires: false,
    requiresOfficialDocument: true,
    notes:
      "Relevant where the project specifically includes Crestron systems.",
  },
  {
    key: "extron-certified",
    category: "MANUFACTURER_PLATFORM",
    title: "Extron certification / training",
    description:
      "Manufacturer training or certification for Extron switching, NAV, control, DSP or commissioning.",
    typicalOwners: ["ENGINEER"],
    appliesToMarkets: ["AV", "AV_IT"],
    examples: ["Extron AV Associate", "Extron control training", "NAV training"],
    defaultRequirementLevel: "USEFUL_EVIDENCE",
    expires: false,
    requiresOfficialDocument: true,
    notes:
      "Relevant where the project specifically includes Extron systems.",
  },
  {
    key: "qsys-certified",
    category: "MANUFACTURER_PLATFORM",
    title: "Q-SYS certification / training",
    description:
      "Training for Q-SYS DSP, control, video, UC and networked AV systems.",
    typicalOwners: ["ENGINEER"],
    appliesToMarkets: ["AV", "AV_IT"],
    examples: ["Q-SYS Level 1", "Q-SYS Level 2", "Q-SYS Control"],
    defaultRequirementLevel: "STRONGLY_PREFERRED",
    expires: false,
    requiresOfficialDocument: true,
    notes:
      "Relevant to DSP, UC, control and Q-SYS ecosystem projects.",
  },
  {
    key: "biamp-certified",
    category: "MANUFACTURER_PLATFORM",
    title: "Biamp certification / training",
    description:
      "Training for Biamp DSP, conferencing, Tesira and related audio systems.",
    typicalOwners: ["ENGINEER"],
    appliesToMarkets: ["AV", "AV_IT"],
    examples: ["Biamp Tesira", "Biamp conferencing training"],
    defaultRequirementLevel: "STRONGLY_PREFERRED",
    expires: false,
    requiresOfficialDocument: true,
    notes:
      "Relevant to DSP, conferencing audio and audio commissioning roles.",
  },
  {
    key: "wyrestorm-training",
    category: "MANUFACTURER_PLATFORM",
    title: "WyreStorm product training",
    description:
      "Evidence of WyreStorm product knowledge across NetworkHD, presentation switching, matrices and extender systems.",
    typicalOwners: ["ENGINEER"],
    appliesToMarkets: ["AV", "AV_IT"],
    examples: ["NetworkHD training", "WyreStorm product training", "Manufacturer session attendance"],
    defaultRequirementLevel: "USEFUL_EVIDENCE",
    expires: false,
    requiresOfficialDocument: false,
    notes:
      "Useful for WyreStorm deployments, but role skills and project evidence still matter.",
  },
  {
    key: "prince2",
    category: "PROJECT_MANAGEMENT",
    title: "PRINCE2",
    description:
      "Project management qualification relevant to formal project delivery, public-sector work and structured delivery environments.",
    typicalOwners: ["ENGINEER", "COMPANY"],
    appliesToMarkets: ["GENERAL"],
    examples: ["PRINCE2 Foundation", "PRINCE2 Practitioner"],
    defaultRequirementLevel: "USEFUL_EVIDENCE",
    expires: true,
    recommendedExpiryMonths: 36,
    requiresOfficialDocument: true,
    notes:
      "Relevant to project manager and delivery lead roles, not basic engineering roles.",
  },
  {
    key: "pmp",
    category: "PROJECT_MANAGEMENT",
    title: "PMP",
    description:
      "Project Management Professional qualification relevant to project leadership and structured project delivery.",
    typicalOwners: ["ENGINEER", "COMPANY"],
    appliesToMarkets: ["GENERAL"],
    examples: ["PMP"],
    defaultRequirementLevel: "USEFUL_EVIDENCE",
    expires: true,
    recommendedExpiryMonths: 36,
    requiresOfficialDocument: true,
    notes:
      "Relevant to senior PM roles, programme work and project leadership.",
  },
  {
    key: "iso-9001",
    category: "COMPANY_QUALITY_STANDARD",
    title: "ISO 9001 quality management",
    description:
      "Company-level quality management system certification.",
    typicalOwners: ["COMPANY", "RESOURCING_COMPANY"],
    appliesToMarkets: ["GENERAL"],
    examples: ["ISO 9001 certificate"],
    defaultRequirementLevel: "COMPANY_LEVEL_ONLY",
    expires: true,
    recommendedExpiryMonths: 36,
    requiresOfficialDocument: true,
    notes:
      "Usually company-level only. Do not request from ordinary individual freelancers by default.",
  },
  {
    key: "iso-14001",
    category: "COMPANY_QUALITY_STANDARD",
    title: "ISO 14001 environmental management",
    description:
      "Company-level environmental management certification.",
    typicalOwners: ["COMPANY", "RESOURCING_COMPANY"],
    appliesToMarkets: ["GENERAL"],
    examples: ["ISO 14001 certificate"],
    defaultRequirementLevel: "COMPANY_LEVEL_ONLY",
    expires: true,
    recommendedExpiryMonths: 36,
    requiresOfficialDocument: true,
    notes:
      "Company-level standard, useful for larger customers and procurement-led work.",
  },
  {
    key: "iso-45001",
    category: "COMPANY_QUALITY_STANDARD",
    title: "ISO 45001 occupational health and safety",
    description:
      "Company-level occupational health and safety management certification.",
    typicalOwners: ["COMPANY", "RESOURCING_COMPANY"],
    appliesToMarkets: ["GENERAL"],
    examples: ["ISO 45001 certificate"],
    defaultRequirementLevel: "COMPANY_LEVEL_ONLY",
    expires: true,
    recommendedExpiryMonths: 36,
    requiresOfficialDocument: true,
    notes:
      "Company-level standard, valuable for high-risk and procurement-led environments.",
  },
  {
    key: "iso-27001",
    category: "COMPANY_QUALITY_STANDARD",
    title: "ISO/IEC 27001 information security",
    description:
      "Company-level information security management certification.",
    typicalOwners: ["COMPANY", "RESOURCING_COMPANY"],
    appliesToMarkets: ["IT", "AV_IT", "GENERAL"],
    examples: ["ISO/IEC 27001 certificate"],
    defaultRequirementLevel: "COMPANY_LEVEL_ONLY",
    expires: true,
    recommendedExpiryMonths: 36,
    requiresOfficialDocument: true,
    notes:
      "Useful for security-sensitive IT, managed service and enterprise customer work.",
  },
  {
    key: "cyber-essentials",
    category: "COMPANY_QUALITY_STANDARD",
    title: "Cyber Essentials / Cyber Essentials Plus",
    description:
      "UK cybersecurity assurance scheme for organisations.",
    typicalOwners: ["COMPANY", "RESOURCING_COMPANY"],
    appliesToMarkets: ["IT", "AV_IT", "GENERAL"],
    examples: ["Cyber Essentials", "Cyber Essentials Plus"],
    defaultRequirementLevel: "COMPANY_LEVEL_ONLY",
    expires: true,
    recommendedExpiryMonths: 12,
    requiresOfficialDocument: true,
    notes:
      "UK-specific company-level evidence, useful for public-sector and security-sensitive work.",
  },
  {
    key: "chas-safecontractor-constructionline",
    category: "COMPANY_QUALITY_STANDARD",
    title: "Contractor prequalification",
    description:
      "Company-level contractor prequalification schemes used by some customers and sites.",
    typicalOwners: ["COMPANY", "RESOURCING_COMPANY"],
    appliesToMarkets: ["GENERAL"],
    examples: ["CHAS", "SafeContractor", "Constructionline", "Local equivalent"],
    defaultRequirementLevel: "COMPANY_LEVEL_ONLY",
    expires: true,
    recommendedExpiryMonths: 12,
    requiresOfficialDocument: true,
    notes:
      "Usually company-level and region-specific. Useful for construction/public-sector procurement.",
  },
  {
    key: "dbs-background-check",
    category: "BACKGROUND_CHECK",
    title: "DBS / background check",
    description:
      "Background check for sensitive environments such as education, healthcare, government or vulnerable-person settings.",
    typicalOwners: ["ENGINEER"],
    appliesToMarkets: ["GENERAL"],
    examples: ["DBS", "Enhanced DBS", "Local police/background check"],
    defaultRequirementLevel: "REGION_SPECIFIC",
    expires: true,
    recommendedExpiryMonths: 36,
    requiresOfficialDocument: true,
    notes:
      "Must be project-specific and privacy-controlled. Do not display sensitive details publicly.",
  },
  {
    key: "project-reference",
    category: "WORK_EVIDENCE",
    title: "Project reference / work evidence",
    description:
      "Evidence of completed work, references, photos, handover documents or customer feedback.",
    typicalOwners: ["ENGINEER", "COMPANY", "RESOURCING_COMPANY"],
    appliesToMarkets: ["GENERAL"],
    examples: ["Project photos", "Reference contact", "Commissioning report", "Handover pack"],
    defaultRequirementLevel: "USEFUL_EVIDENCE",
    expires: false,
    requiresOfficialDocument: false,
    notes:
      "Useful for practical competence, especially where engineers do not yet hold formal certificates.",
  },
];

export const ROLE_COMPLIANCE_REQUIREMENTS: RoleComplianceRequirement[] = [
  {
    roleKey: "av-technician-installer",
    roleTitle: "AV Technician / Installer",
    requirementSummary:
      "Keep the role accessible, but increase confidence with site safety, insurance and installation evidence.",
    requirements: [
      {
        requirementLevel: "PROJECT_MANDATORY",
        credentialKeys: ["right-to-work", "site-safety-card"],
        reason:
          "Required only when the site or country requires formal access or work eligibility evidence.",
      },
      {
        requirementLevel: "STRONGLY_PREFERRED",
        credentialKeys: [
          "public-liability-insurance",
          "working-at-height",
          "manual-handling",
          "avixa-cts-i",
        ],
        reason:
          "Improves confidence for physical installation, mounting, containment and site-based work.",
      },
      {
        requirementLevel: "USEFUL_EVIDENCE",
        credentialKeys: [
          "avixa-cts",
          "hdbaset-training",
          "wyrestorm-training",
          "project-reference",
        ],
        reason:
          "Useful evidence of AV understanding and practical experience without blocking lower-earning engineers.",
      },
    ],
  },
  {
    roleKey: "av-systems-commissioner",
    roleTitle: "AV Systems Engineer / Commissioner",
    requirementSummary:
      "Commissioning should prioritise technical proof, insurance and manufacturer/product competence.",
    requirements: [
      {
        requirementLevel: "STRONGLY_PREFERRED",
        credentialKeys: [
          "avixa-cts",
          "avixa-cts-i",
          "professional-indemnity-insurance",
          "public-liability-insurance",
        ],
        reason:
          "Commissioning carries technical and commercial risk, so AV competence and insurance matter.",
      },
      {
        requirementLevel: "USEFUL_EVIDENCE",
        credentialKeys: [
          "dante-certification",
          "qsys-certified",
          "biamp-certified",
          "crestron-certified",
          "extron-certified",
          "wyrestorm-training",
          "project-reference",
        ],
        reason:
          "Manufacturer and platform evidence helps match the engineer to the installed system.",
      },
    ],
  },
  {
    roleKey: "avoip-engineer",
    roleTitle: "AV-over-IP Engineer",
    requirementSummary:
      "AV-over-IP should reward both AV knowledge and network competence.",
    requirements: [
      {
        requirementLevel: "STRONGLY_PREFERRED",
        credentialKeys: [
          "comptia-network-plus",
          "cisco-ccna",
          "dante-certification",
          "professional-indemnity-insurance",
        ],
        reason:
          "AV-over-IP projects often depend on VLANs, multicast, managed switching and network troubleshooting.",
      },
      {
        requirementLevel: "USEFUL_EVIDENCE",
        credentialKeys: [
          "avixa-cts",
          "sdvoe-training",
          "wyrestorm-training",
          "crestron-certified",
          "project-reference",
        ],
        reason:
          "Product and AV evidence helps separate genuine AVoIP capability from generic networking claims.",
      },
    ],
  },
  {
    roleKey: "uc-meeting-room-engineer",
    roleTitle: "UC / Meeting Room Engineer",
    requirementSummary:
      "UC roles should consider Microsoft/Teams knowledge, USB/AV skills, customer-facing competence and site trust.",
    requirements: [
      {
        requirementLevel: "STRONGLY_PREFERRED",
        credentialKeys: [
          "microsoft-365-teams-admin",
          "public-liability-insurance",
          "avixa-cts",
        ],
        reason:
          "UC rooms often combine Microsoft 365, USB devices, displays, cameras, audio and user testing.",
      },
      {
        requirementLevel: "USEFUL_EVIDENCE",
        credentialKeys: [
          "qsys-certified",
          "biamp-certified",
          "dante-certification",
          "wyrestorm-training",
          "project-reference",
        ],
        reason:
          "Manufacturer evidence improves match quality for specific room ecosystems.",
      },
      {
        requirementLevel: "REGION_SPECIFIC",
        credentialKeys: ["dbs-background-check"],
        reason:
          "Background checks may be required for education, healthcare, government or sensitive environments.",
      },
    ],
  },
  {
    roleKey: "it-support-engineer",
    roleTitle: "IT Support Engineer",
    requirementSummary:
      "IT support should stay accessible, with stronger confidence from entry IT credentials and data-handling awareness.",
    requirements: [
      {
        requirementLevel: "STRONGLY_PREFERRED",
        credentialKeys: ["comptia-a-plus", "right-to-work"],
        reason:
          "Entry IT credentials and operating eligibility improve basic support confidence.",
      },
      {
        requirementLevel: "USEFUL_EVIDENCE",
        credentialKeys: [
          "microsoft-365-teams-admin",
          "comptia-security-plus",
          "project-reference",
        ],
        reason:
          "Useful for Microsoft 365, endpoint support and security-sensitive customer environments.",
      },
    ],
  },
  {
    roleKey: "network-engineer",
    roleTitle: "Network Engineer",
    requirementSummary:
      "Network roles should place real value on vendor-neutral and vendor-specific networking credentials.",
    requirements: [
      {
        requirementLevel: "STRONGLY_PREFERRED",
        credentialKeys: [
          "comptia-network-plus",
          "cisco-ccna",
          "professional-indemnity-insurance",
        ],
        reason:
          "Network changes can affect customer operations, so verified competence and insurance matter.",
      },
      {
        requirementLevel: "USEFUL_EVIDENCE",
        credentialKeys: [
          "cisco-ccnp",
          "comptia-security-plus",
          "iso-27001",
          "project-reference",
        ],
        reason:
          "Advanced and security-related evidence improves suitability for complex enterprise environments.",
      },
    ],
  },
  {
    roleKey: "project-manager",
    roleTitle: "Project Manager / Delivery Lead",
    requirementSummary:
      "Project management credentials should matter for delivery roles, not general engineering roles.",
    requirements: [
      {
        requirementLevel: "STRONGLY_PREFERRED",
        credentialKeys: ["prince2", "pmp", "professional-indemnity-insurance"],
        reason:
          "Structured project-management evidence is useful for formal delivery, public-sector work and larger programmes.",
      },
      {
        requirementLevel: "USEFUL_EVIDENCE",
        credentialKeys: ["project-reference", "iso-9001", "iso-45001"],
        reason:
          "References and company-level systems can improve confidence for larger delivery environments.",
      },
    ],
  },
  {
    roleKey: "resourcing-company",
    roleTitle: "Resourcing Company",
    requirementSummary:
      "Resourcing companies require stronger verification because they are commercial intermediaries.",
    requirements: [
      {
        requirementLevel: "PROJECT_MANDATORY",
        credentialKeys: [
          "right-to-work",
          "proof-of-address",
          "public-liability-insurance",
          "employers-liability-insurance",
        ],
        reason:
          "Resourcing businesses should be verified before operating commercially on the platform.",
      },
      {
        requirementLevel: "STRONGLY_PREFERRED",
        credentialKeys: [
          "professional-indemnity-insurance",
          "iso-9001",
          "iso-45001",
          "cyber-essentials",
        ],
        reason:
          "Quality, safety and cyber assurance matter when managing multiple engineers or customer accounts.",
      },
      {
        requirementLevel: "REGION_SPECIFIC",
        credentialKeys: ["chas-safecontractor-constructionline", "iso-27001"],
        reason:
          "Some sectors, regions and procurement-led customers may require additional standards.",
      },
    ],
  },
];

export const TRUST_BADGES: TrustBadgeDefinition[] = [
  {
    key: "ID_VERIFIED",
    label: "ID verified",
    description: "Identity has been checked through an approved process.",
    credentialKeys: ["id-verification"],
  },
  {
    key: "COUNTRY_VERIFIED",
    label: "Country verified",
    description: "Country or region has been checked for pricing and marketplace trust.",
    credentialKeys: ["proof-of-address", "right-to-work"],
  },
  {
    key: "INSURANCE_VERIFIED",
    label: "Insurance verified",
    description: "Current insurance evidence has been checked.",
    credentialKeys: [
      "public-liability-insurance",
      "professional-indemnity-insurance",
      "employers-liability-insurance",
    ],
  },
  {
    key: "SAFETY_VERIFIED",
    label: "Safety verified",
    description: "Relevant site safety evidence has been checked.",
    credentialKeys: [
      "site-safety-card",
      "ipaf-mewp",
      "pasma-tower",
      "working-at-height",
      "manual-handling",
      "asbestos-awareness",
      "first-aid",
    ],
  },
  {
    key: "SKILL_EVIDENCE_SUPPLIED",
    label: "Skill evidence supplied",
    description: "Work examples, references or project evidence have been supplied.",
    credentialKeys: ["project-reference"],
  },
  {
    key: "CERTIFIED",
    label: "Certified",
    description: "Relevant industry or IT certificate has been supplied and checked.",
    credentialKeys: [
      "avixa-cts",
      "avixa-cts-i",
      "avixa-cts-d",
      "dante-certification",
      "comptia-a-plus",
      "comptia-network-plus",
      "comptia-security-plus",
      "cisco-ccna",
      "cisco-ccnp",
      "microsoft-365-teams-admin",
    ],
  },
  {
    key: "MANUFACTURER_CERTIFIED",
    label: "Manufacturer certified",
    description: "Manufacturer or platform training evidence has been supplied.",
    credentialKeys: [
      "crestron-certified",
      "extron-certified",
      "qsys-certified",
      "biamp-certified",
      "wyrestorm-training",
    ],
  },
  {
    key: "COMPANY_QUALITY_VERIFIED",
    label: "Company quality verified",
    description: "Company-level quality, safety, environmental or security standard has been supplied.",
    credentialKeys: [
      "iso-9001",
      "iso-14001",
      "iso-45001",
      "iso-27001",
      "cyber-essentials",
      "chas-safecontractor-constructionline",
    ],
  },
  {
    key: "PROJECT_MANAGEMENT_VERIFIED",
    label: "Project management verified",
    description: "Project management qualification or project delivery evidence has been supplied.",
    credentialKeys: ["prince2", "pmp"],
  },
  {
    key: "BACKGROUND_CHECKED",
    label: "Background checked",
    description: "A suitable background check has been verified for a relevant project environment.",
    credentialKeys: ["dbs-background-check"],
  },
];