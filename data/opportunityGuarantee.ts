import type { EngineerSubscriptionMonth, ServiceBoundaryPoint } from "../types/opportunityGuarantee";

export const techSubbiesServiceBoundary: ServiceBoundaryPoint[] = [
  {
    title: "Skills and availability matching only",
    description:
      "TechSubbies helps customers discover independent AV and IT contractors by skills, role profile, location and availability.",
  },
  {
    title: "No recruitment service",
    description:
      "TechSubbies does not act as a recruiter, employment agency, staffing supplier, employer, payroll provider or managed labour provider.",
  },
  {
    title: "Commercial arrangement is direct",
    description:
      "Rates, terms, scope, payment, tax, insurance and delivery responsibility are agreed directly between the customer and the contractor.",
  },
  {
    title: "Logged platform communication",
    description:
      "The platform records opportunity alerts, suitability reasons, responses and communication history to support transparency.",
  },
];

export const opportunityVisibilityGuaranteeFaq = [
  {
    question: "Is TechSubbies a recruitment service?",
    answer:
      "No. TechSubbies is a skills and availability matching platform. It helps customers find independent AV and IT contractors who appear suitable and available. The customer and contractor decide directly whether to work together.",
  },
  {
    question: "Does TechSubbies employ engineers or subcontractors?",
    answer:
      "No. Engineers and contractors remain independent. TechSubbies does not employ them, assign them, manage their work on site or control how they carry out their services.",
  },
  {
    question: "Does TechSubbies pay engineers?",
    answer:
      "No. TechSubbies does not collect, hold, release or process payment for work. Payment is agreed and handled directly between the customer and the contractor.",
  },
  {
    question: "What does a paid engineer membership provide?",
    answer:
      "A paid membership improves visibility, allows specialist skills profiles, supports availability matching and helps suitable customers discover the member's services.",
  },
  {
    question: "What is the Opportunity Visibility Guarantee?",
    answer:
      "If an eligible paying engineer member receives no suitable opportunity alerts during a paid subscription month, TechSubbies adds one additional month to their subscription at no extra cost.",
  },
  {
    question: "What counts as a suitable opportunity alert?",
    answer:
      "A suitable alert must match the member's active skills profile, location range, availability, role preferences and visible opportunity details at the time it is sent.",
  },
  {
    question: "What does not qualify for the extra month?",
    answer:
      "The extra month is not due where a suitable opportunity was sent and the member declined it, ignored it, let it expire, countered unsuccessfully or chose not to proceed with the customer.",
  },
  {
    question: "Can a member claim the guarantee if their profile is incomplete?",
    answer:
      "No. The member must keep their profile, contact details, location, availability and specialist skills settings complete enough for the matching service to work.",
  },
  {
    question: "Can a member claim if they marked themselves unavailable all month?",
    answer:
      "No. The guarantee only applies where the member has made themselves realistically matchable during the subscription month.",
  },
  {
    question: "Are customers required to use a matched contractor?",
    answer:
      "No. TechSubbies shows suitable skills and availability. Customers choose who to contact and whether to proceed directly.",
  },
];

export const sampleGuaranteeMonth: EngineerSubscriptionMonth = {
  memberId: "eng-demo-001",
  memberName: "Demo AV Engineer",
  paidPlanName: "Pro Specialist",
  monthLabel: "Current subscription month",
  profileComplete: true,
  availabilityConfigured: true,
  contactVerified: true,
  activeSpecialistProfiles: 3,
  blockedAllAvailability: false,
  suitableAlerts: [
    {
      id: "opp-demo-001",
      customerName: "Example Integrator",
      roleCategory: "AV installation support",
      requiredSkills: ["Display installation", "Rack support", "Cable testing"],
      location: "Birmingham",
      distanceMiles: 38,
      date: "2026-06-18",
      startTime: "08:30",
      durationHours: 8,
      rateVisible: true,
      availabilityMatched: true,
      skillMatched: true,
      locationMatched: true,
      preferenceMatched: true,
      status: "sent",
      sentAt: "2026-06-08T10:30:00.000Z",
    },
  ],
};
