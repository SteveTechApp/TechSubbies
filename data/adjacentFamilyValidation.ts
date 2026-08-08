export type AdjacentFamilyDecision = 'advance' | 'conditional' | 'hold';
export type EvidenceStrength = 'strong' | 'moderate';

export interface AdjacentFamilyEvidence {
  organisation: string;
  label: string;
  url: string;
  strength: EvidenceStrength;
}

export interface AdjacentRoleCandidate {
  id: string;
  title: string;
  boundary: string;
}

export interface AdjacentFamilyValidation {
  id: string;
  label: string;
  decision: AdjacentFamilyDecision;
  summary: string;
  rationale: string;
  overlapsWith: string[];
  proposedRoles: AdjacentRoleCandidate[];
  evidence: AdjacentFamilyEvidence[];
  safeguards: string[];
  practitionerQuestions: string[];
}

export const adjacentFamilyValidations: AdjacentFamilyValidation[] = [
  {
    id: 'fibre-telecoms',
    label: 'Fibre & telecoms',
    decision: 'advance',
    summary: 'Distinct field capability with recognised technician KSAs for installation, splicing, termination, testing and fault finding.',
    rationale: 'FOA defines CFOT as a broad fibre technician credential and publishes specialist KSAs for splicing, connectors, testing and design. This is sufficiently distinct from generic AV/IT cabling to justify a dedicated practitioner-validation track.',
    overlapsWith: ['AV Installation Engineer', 'Network Infrastructure Engineer', 'Structured Cabling / field-service work'],
    proposedRoles: [
      {
        id: 'fibre-optic-technician',
        title: 'Fibre Optic Technician',
        boundary: 'Premises/field fibre installation, termination, splicing, testing and fault finding. Do not imply carrier-network design authority unless separately evidenced.',
      },
    ],
    evidence: [
      {
        organisation: 'Fiber Optic Association (FOA)',
        label: 'CFOT Certified Fiber Optic Technician',
        url: 'https://www.thefoa.org/cfot.htm',
        strength: 'strong',
      },
      {
        organisation: 'Fiber Optic Association (FOA)',
        label: 'Published fibre technician KSAs and specialist skill areas',
        url: 'https://www.thefoa.org/KSAs.html',
        strength: 'strong',
      },
    ],
    safeguards: [
      'Keep outside-plant/carrier design as a specialist evidence claim rather than a default technician capability.',
      'Require explicit evidence for fusion splicing, OTDR testing and advanced fault diagnosis.',
    ],
    practitionerQuestions: [
      'Should premises fibre and outside-plant fibre be separate marketplace roles?',
      'Which test instruments and result interpretation should be minimum evidence for an independent technician?',
    ],
  },
  {
    id: 'physical-security',
    label: 'Physical security systems',
    decision: 'conditional',
    summary: 'Clear UK technician occupation covering CCTV, access control and intruder systems, but life-safety/regulatory boundaries require explicit scope controls.',
    rationale: 'The UK Level 3 Fire Emergency and Security Systems Technician standard explicitly covers security systems installation, maintenance, CCTV and access control. TechSubbies should separate electronic-security work from fire/life-safety claims until compliance requirements are modelled.',
    overlapsWith: ['Network Infrastructure Engineer', 'AV Installation Engineer', 'IP networking and PoE'],
    proposedRoles: [
      {
        id: 'electronic-security-systems-technician',
        title: 'Electronic Security Systems Technician',
        boundary: 'CCTV, access control and intruder systems. Fire detection, emergency lighting and other life-safety work remain excluded until a dedicated compliance model exists.',
      },
    ],
    evidence: [
      {
        organisation: 'UK Apprenticeship Service / IfATE standard',
        label: 'Fire emergency and security systems technician Level 3 occupational scope',
        url: 'https://findapprenticeshiptraining.apprenticeships.education.gov.uk/courses/126',
        strength: 'strong',
      },
    ],
    safeguards: [
      'Do not bundle fire/life-safety competence into the first marketplace role.',
      'Model any required licences, scheme membership, standards competence and vetting before expanding scope.',
      'Do not infer electrical competence from electronic security experience.',
    ],
    practitionerQuestions: [
      'Should CCTV/access control and intruder systems be one role or separate specialisms?',
      'Which UK compliance credentials are mandatory versus desirable for subcontract marketplace work?',
    ],
  },
  {
    id: 'smart-buildings-bms-iot',
    label: 'Smart buildings / BMS / IoT',
    decision: 'advance',
    summary: 'Strong adjacent systems-integration family spanning building automation protocols, controls commissioning and interoperable smart-building systems.',
    rationale: 'KNX has a formal professional certification path covering ETS, system design and commissioning; BACnet is a global building-automation communications standard. The family is adjacent to AV control/networking but materially broader in HVAC, energy and building controls.',
    overlapsWith: ['AV Control / Programming', 'Network Engineer', 'Systems Integration'],
    proposedRoles: [
      {
        id: 'building-automation-bms-engineer',
        title: 'Building Automation / BMS Engineer',
        boundary: 'Integration, configuration, commissioning and diagnostics of building automation systems. Electrical installation and HVAC mechanical work remain separate trades unless explicitly evidenced.',
      },
    ],
    evidence: [
      {
        organisation: 'KNX Association',
        label: 'KNX professional certification: design, ETS and commissioning',
        url: 'https://www.knx.org/professionals/getting-knx-certified',
        strength: 'strong',
      },
      {
        organisation: 'BACnet International',
        label: 'BACnet global building automation and control networking standard',
        url: 'https://bacnetinternational.org/',
        strength: 'strong',
      },
    ],
    safeguards: [
      'Keep protocol/configuration competence separate from electrical and mechanical trade authority.',
      'Capture protocol/platform evidence such as KNX/ETS, BACnet and manufacturer BMS tools as explicit evidence tags.',
    ],
    practitionerQuestions: [
      'Should BMS commissioning and smart-building integration be separate seniority tracks?',
      'Which protocols should be mandatory core knowledge versus product/platform tags?',
    ],
  },
  {
    id: 'broadcast',
    label: 'Broadcast & IP media',
    decision: 'hold',
    summary: 'Clearly adjacent to AV-over-IP and networking, but the role boundary spans facility engineering, live production, RF, timing and media-over-IP and needs practitioner task analysis first.',
    rationale: 'SMPTE standards and current industry practice provide strong technology anchors, but a single “broadcast engineer” role would be too broad for reliable marketplace matching. Define the initial job-task boundary with broadcast practitioners before adding canonical roles.',
    overlapsWith: ['AV over IP', 'Network Engineer', 'Audio Engineer', 'Live Events'],
    proposedRoles: [
      {
        id: 'broadcast-ip-systems-engineer',
        title: 'Broadcast / IP Media Systems Engineer',
        boundary: 'Candidate only: media-over-IP infrastructure, timing, routing and systems integration. Excludes production editorial/creative roles and specialist RF unless separately defined.',
      },
    ],
    evidence: [
      {
        organisation: 'SMPTE',
        label: 'SMPTE standards/training ecosystem including ST 2110 media-over-IP',
        url: 'https://www.smpte.org/',
        strength: 'moderate',
      },
    ],
    safeguards: [
      'Do not launch a generic Broadcast Engineer role without a practitioner-reviewed job-task analysis.',
      'Separate media-over-IP systems engineering from live production operations and RF/broadcast transmission specialisms.',
    ],
    practitionerQuestions: [
      'Is IP media systems engineering the best first marketplace role, or should broadcast systems technician come first?',
      'Which timing, control and monitoring competencies are minimum requirements for independent delivery?',
    ],
  },
  {
    id: 'stage-systems',
    label: 'Stage & entertainment systems',
    decision: 'conditional',
    summary: 'Relevant adjacent market, but rigging, entertainment electrics and portable power are safety-critical disciplines that must not be collapsed into a generic AV technician claim.',
    rationale: 'ETCP maintains distinct professional certifications for arena/theatre rigging, entertainment electrics and portable power because these disciplines directly affect crew, performer and audience safety. TechSubbies should initially focus on stage AV/system integration and gate rigging/power separately.',
    overlapsWith: ['Live Events', 'Audio Engineer', 'AV Installation Engineer'],
    proposedRoles: [
      {
        id: 'stage-av-systems-technician',
        title: 'Stage AV Systems Technician',
        boundary: 'Stage audio/video/control setup and systems support only. Rigging, entertainment electrics and portable power require separate validated credentials and must not be implied by this role.',
      },
    ],
    evidence: [
      {
        organisation: 'ESTA / ETCP',
        label: 'Entertainment Technician Certification Program disciplines',
        url: 'https://etcp.esta.org/etcp/about.html',
        strength: 'strong',
      },
    ],
    safeguards: [
      'Explicitly exclude rigging and power-distribution competence from the initial stage AV role.',
      'If rigging/electrics are later added, require discipline-specific credential/compliance evidence and separate role definitions.',
    ],
    practitionerQuestions: [
      'Does the existing Live Events family already cover enough stage AV work to avoid a new role?',
      'Which stage-control, intercom, RF and show-networking skills materially distinguish this family?',
    ],
  },
  {
    id: 'residential-integration',
    label: 'Residential integration / smart home',
    decision: 'advance',
    summary: 'Mature adjacent integration profession with recognised role-specific technician, infrastructure, networking and design certifications.',
    rationale: 'CEDIA defines distinct CIT, IST, residential networking and design credentials with published job-task boundaries. This gives TechSubbies a strong evidence base for a residential integration family without simply relabelling commercial AV roles.',
    overlapsWith: ['AV Installation Engineer', 'Network Engineer', 'AV Design / Programming', 'Smart building controls'],
    proposedRoles: [
      {
        id: 'residential-integrated-systems-technician',
        title: 'Residential Integrated Systems Technician',
        boundary: 'Residential first-fix/second-fix, rack/equipment installation, system verification and troubleshooting. Advanced networking/design remain specialist evidence or future roles.',
      },
    ],
    evidence: [
      {
        organisation: 'CEDIA',
        label: 'Smart home professional certifications: CIT, IST, RNS and ESC-D',
        url: 'https://cedia.org/en-us/smart-home-professionals/education/certification/',
        strength: 'strong',
      },
      {
        organisation: 'CEDIA',
        label: 'Integrated Systems Technician job-task boundary',
        url: 'https://cedia.org/en-us/smart-home-professionals/certifications/ist-certification/',
        strength: 'strong',
      },
    ],
    safeguards: [
      'Do not assume domestic electrical competence from systems-integration experience.',
      'Keep advanced residential networking and system design as separately evidenced specialist capability.',
    ],
    practitionerQuestions: [
      'Should CIT-style supervised infrastructure work be a separate entry role?',
      'Should residential networking remain a skill specialism or become its own canonical role?',
    ],
  },
];

export const adjacentFamilyDecisionOrder: Record<AdjacentFamilyDecision, number> = {
  advance: 0,
  conditional: 1,
  hold: 2,
};
