import type { DemoJourney } from "../types/demoJourney";

export const demoJourneys: DemoJourney[] = [
  {
    id: "engineer",
    label: "Engineer / subcontractor",
    shortLabel: "Engineer",
    headline: "See how an engineer creates a profile and starts receiving better-fit work.",
    summary: "This demo follows an AV/IT engineer from profile setup through skills, documents, availability and matching.",
    primaryOutcome: "A searchable, verified engineer profile that can be matched to real project requirements.",
    steps: [
      {
        id: "engineer-step-1",
        status: "setup",
        pageName: "Engineer profile setup",
        povTitle: "The engineer chooses their working profile",
        userAction: "Select AV, IT or both, then choose whether to accept basic work, specialist work or both.",
        platformResponse: "TechSubbies builds the base profile around practical work types rather than a generic CV.",
        expectedResult: "The engineer appears in the correct search category from the start.",
        description: "The first screen should feel quick. A new engineer should not need to understand every category before joining.",
        metrics: [
          { label: "Profile mode", value: "AV + IT", detail: "Can be narrowed later" },
          { label: "Work preference", value: "Specialist + basic", detail: "Keeps spare time visible" },
          { label: "Setup time", value: "3-5 min", detail: "Initial profile only" }
        ],
        mockPanels: [
          {
            title: "Profile choice",
            lines: ["AV engineer", "IT engineer", "Both AV and IT", "Accept basic work when available"]
          },
          {
            title: "Platform guidance",
            lines: ["Start broad", "Add specialist profiles later", "Calendar sync improves matching"]
          }
        ]
      },
      {
        id: "engineer-step-2",
        status: "action",
        pageName: "Skills and specialist profiles",
        povTitle: "The engineer adds real-world capability",
        userAction: "Choose practical skills, product knowledge, certifications and specialist role profiles.",
        platformResponse: "The profile becomes searchable by actual project needs such as UC support, rack build, fibre, networking or commissioning.",
        expectedResult: "The engineer can be found for the type of work they actually want.",
        description: "The value is not just listing skills. It is turning real capability into structured search and matching data.",
        metrics: [
          { label: "Specialist profiles", value: "3", detail: "UC, rack build, networking" },
          { label: "Skill tags", value: "18", detail: "Searchable criteria" },
          { label: "Completeness", value: "72%", detail: "Documents still needed" }
        ],
        mockPanels: [
          {
            title: "Selected skills",
            lines: ["UC room support", "Rack build", "Network troubleshooting", "Display installation"]
          },
          {
            title: "Product knowledge",
            lines: ["Teams Rooms", "Zoom Rooms", "AVoIP", "Managed switches"]
          }
        ]
      },
      {
        id: "engineer-step-3",
        status: "review",
        pageName: "Documents and verification",
        povTitle: "The engineer uploads proof and compliance documents",
        userAction: "Upload insurance, training records, ID checks, safety cards and manufacturer certificates where relevant.",
        platformResponse: "TechSubbies flags missing, pending, verified and expired items.",
        expectedResult: "Businesses can trust the profile before making contact.",
        description: "Verification is what stops the marketplace becoming a weak directory of unproven claims.",
        metrics: [
          { label: "Verification", value: "Pending", detail: "2 documents under review" },
          { label: "Expired docs", value: "0", detail: "No blockers" },
          { label: "Profile strength", value: "Good", detail: "Visible to relevant searches" }
        ],
        mockPanels: [
          {
            title: "Documents",
            lines: ["Public liability: pending", "IPAF: verified", "ECS/CSCS: missing", "Manufacturer training: uploaded"]
          },
          {
            title: "Trust signals",
            lines: ["Document dates", "Verification status", "Profile owner type", "Region consistency"]
          }
        ]
      },
      {
        id: "engineer-step-4",
        status: "matching",
        pageName: "Availability and project matches",
        povTitle: "The engineer syncs availability and sees suitable work",
        userAction: "Connect calendar or manually add available dates, travel range and preferred work types.",
        platformResponse: "The system uses time, location, skill and compliance fit to prioritise matches.",
        expectedResult: "The engineer receives fewer irrelevant enquiries and better-fit opportunities.",
        description: "Availability is central to TechSubbies because the platform is designed around short-term and freelance work.",
        metrics: [
          { label: "Available slots", value: "6", detail: "Next 30 days" },
          { label: "Project matches", value: "4", detail: "Within travel range" },
          { label: "Match confidence", value: "82%", detail: "Skills and documents fit" }
        ],
        mockPanels: [
          {
            title: "Matched projects",
            lines: ["London UC rollout", "Birmingham rack build", "Oxford display install", "Remote network prep"]
          },
          {
            title: "Why matched",
            lines: ["Skills fit", "Available dates", "Travel radius", "Verified documents"]
          }
        ]
      },
      {
        id: "engineer-step-5",
        status: "result",
        pageName: "Expected result",
        povTitle: "The engineer has a useful working profile",
        userAction: "Review incoming requests and decide which work to pursue.",
        platformResponse: "TechSubbies keeps the profile active, searchable and matched to future work windows.",
        expectedResult: "The engineer can fill spare time without losing control of preferred work and rates.",
        description: "The result is not just a profile. It is a live availability and skills record.",
        metrics: [
          { label: "Outcome", value: "Visible", detail: "Profile ready for matching" },
          { label: "Admin effort", value: "Lower", detail: "Documents reused" },
          { label: "Control", value: "Engineer-led", detail: "Preferences stay editable" }
        ],
        mockPanels: [
          {
            title: "Engineer outcome",
            lines: ["Better enquiries", "Less wasted time", "Clearer proof of skills", "Calendar-driven matching"]
          },
          {
            title: "Next actions",
            lines: ["Keep availability updated", "Add missing certificates", "Accept or decline project requests"]
          }
        ]
      }
    ]
  },
  {
    id: "hiring_company",
    label: "Hiring company / project owner",
    shortLabel: "Hiring company",
    headline: "See how a business finds available technical people for a project.",
    summary: "This demo follows a company that needs the right AV/IT skills for a specific installation or support requirement.",
    primaryOutcome: "A shortlist of available, relevant and verified engineers matched to the job.",
    steps: [
      {
        id: "hiring-step-1",
        status: "setup",
        pageName: "Project requirement",
        povTitle: "The company describes the work needed",
        userAction: "Enter location, project date, required skills, site type and expected task outcomes.",
        platformResponse: "TechSubbies turns the requirement into searchable matching criteria.",
        expectedResult: "The project is structured enough to find suitable engineers without becoming a recruitment advert.",
        description: "This needs to feel like resourcing a job, not posting a traditional vacancy.",
        metrics: [
          { label: "Project type", value: "AV install", detail: "Short-term requirement" },
          { label: "Location", value: "London", detail: "Travel radius applied" },
          { label: "Duration", value: "3 days", detail: "Calendar match required" }
        ],
        mockPanels: [
          {
            title: "Project inputs",
            lines: ["Install 12 meeting rooms", "Need UC + display skills", "Dates fixed", "RAMS required"]
          },
          {
            title: "Matching criteria",
            lines: ["Skills", "Availability", "Distance", "Compliance", "Specialist profile"]
          }
        ]
      },
      {
        id: "hiring-step-2",
        status: "matching",
        pageName: "Engineer search results",
        povTitle: "The company sees matched engineers",
        userAction: "Review matched engineers and filter by skill, availability, distance and verification.",
        platformResponse: "The platform explains why each engineer appears in the results.",
        expectedResult: "The company can quickly tell who is a good fit and who is only a partial fit.",
        description: "Search results should be transparent. The user needs to see the reason for each match.",
        metrics: [
          { label: "Good matches", value: "7", detail: "Strong skill and date fit" },
          { label: "Partial matches", value: "5", detail: "One gap each" },
          { label: "Unavailable", value: "14", detail: "Hidden by default" }
        ],
        mockPanels: [
          {
            title: "Engineer cards",
            lines: ["Alex Carter: 91% match", "Priya Shah: 84% match", "Daniel Hughes: 76% match"]
          },
          {
            title: "Match reasons",
            lines: ["Available on required dates", "UC skill fit", "Insurance verified", "Within travel radius"]
          }
        ]
      },
      {
        id: "hiring-step-3",
        status: "review",
        pageName: "Shortlist review",
        povTitle: "The company compares the best options",
        userAction: "Open engineer profiles, check documents and add preferred engineers to a shortlist.",
        platformResponse: "TechSubbies keeps the shortlist focused on readiness, trust and project suitability.",
        expectedResult: "The company can make a practical resourcing decision faster.",
        description: "This screen should reduce uncertainty rather than add more profile clutter.",
        metrics: [
          { label: "Shortlist", value: "3", detail: "Recommended options" },
          { label: "Verified", value: "3/3", detail: "No document blockers" },
          { label: "Availability", value: "Confirmed", detail: "Dates aligned" }
        ],
        mockPanels: [
          {
            title: "Shortlist",
            lines: ["Best overall fit", "Best UC specialist", "Best local installer"]
          },
          {
            title: "Decision support",
            lines: ["Compliance ready", "Skills evidence", "Project history", "Availability confidence"]
          }
        ]
      },
      {
        id: "hiring-step-4",
        status: "action",
        pageName: "Contact and request",
        povTitle: "The company sends a targeted work request",
        userAction: "Send the project request to one or more shortlisted engineers.",
        platformResponse: "The request includes project context, dates, location and required documents.",
        expectedResult: "The engineer receives a useful request instead of a vague message.",
        description: "The request should be structured enough that the engineer can accept, ask a question or decline quickly.",
        metrics: [
          { label: "Requests sent", value: "3", detail: "To shortlisted engineers" },
          { label: "Missing info", value: "0", detail: "Ready to send" },
          { label: "Response path", value: "Clear", detail: "Accept, question, decline" }
        ],
        mockPanels: [
          {
            title: "Request summary",
            lines: ["3-day London install", "UC + display skills", "Insurance required", "Site access notes included"]
          },
          {
            title: "Engineer response",
            lines: ["Accept", "Ask question", "Decline", "Suggest alternate date"]
          }
        ]
      },
      {
        id: "hiring-step-5",
        status: "result",
        pageName: "Expected result",
        povTitle: "The company has a practical project shortlist",
        userAction: "Confirm who to use and keep alternatives visible.",
        platformResponse: "TechSubbies keeps the project, shortlist and communication trail together.",
        expectedResult: "The business finds relevant available engineers without using a traditional recruitment process.",
        description: "The expected result is speed, clarity and reduced admin around short-term skilled labour.",
        metrics: [
          { label: "Outcome", value: "Shortlist ready", detail: "Suitable engineers identified" },
          { label: "Admin reduction", value: "High", detail: "Less manual searching" },
          { label: "Confidence", value: "Improved", detail: "Verification visible" }
        ],
        mockPanels: [
          {
            title: "Business outcome",
            lines: ["Matched technical skills", "Verified documents", "Availability checked", "Clear next step"]
          },
          {
            title: "Project record",
            lines: ["Requirement saved", "Shortlist saved", "Messages tracked", "Future repeat search possible"]
          }
        ]
      }
    ]
  },
  {
    id: "resourcing_company",
    label: "Resourcing company / company account",
    shortLabel: "Company account",
    headline: "See how a company manages all engineers, groups and compliance in one place.",
    summary: "This demo follows a resourcing company managing multiple engineers, central documents and group-level updates.",
    primaryOutcome: "A managed company engineer pool with bulk updates, compliance visibility and individual drill-down.",
    steps: [
      {
        id: "company-step-1",
        status: "setup",
        pageName: "Company dashboard",
        povTitle: "The company sees its engineer pool",
        userAction: "Open the company dashboard to view engineers, availability, compliance and groups.",
        platformResponse: "TechSubbies summarises the company engineer pool in operational terms.",
        expectedResult: "The company knows who is active, who needs attention and which documents are close to expiry.",
        description: "This is the control centre for company-tier users.",
        metrics: [
          { label: "Engineers", value: "42", detail: "Company pool" },
          { label: "Need attention", value: "6", detail: "Profile or compliance gaps" },
          { label: "Groups", value: "8", detail: "Managed teams" }
        ],
        mockPanels: [
          {
            title: "Dashboard cards",
            lines: ["Total engineers", "Available this week", "Compliance attention", "Groups"]
          },
          {
            title: "Operational alerts",
            lines: ["Insurance expiring", "Pending invites", "Suspended records", "Incomplete profiles"]
          }
        ]
      },
      {
        id: "company-step-2",
        status: "action",
        pageName: "Central company update",
        povTitle: "The company applies a new insurance document",
        userAction: "Upload a new company insurance certificate and choose who it applies to.",
        platformResponse: "The update can be applied to all engineers, selected groups or individual records.",
        expectedResult: "A single company update refreshes many engineer profiles without manual duplication.",
        description: "This is one of the key paid-tier reasons for company accounts.",
        metrics: [
          { label: "Update target", value: "All active", detail: "Applied company-wide" },
          { label: "Profiles affected", value: "38", detail: "Excludes suspended records" },
          { label: "Audit entry", value: "Created", detail: "Traceable admin action" }
        ],
        mockPanels: [
          {
            title: "Bulk update",
            lines: ["Upload certificate", "Set expiry date", "Select target group", "Apply to records"]
          },
          {
            title: "Compliance effect",
            lines: ["Public liability updated", "Expiry refreshed", "Audit trail created", "Alerts reduced"]
          }
        ]
      },
      {
        id: "company-step-3",
        status: "review",
        pageName: "Group management",
        povTitle: "The company drills into a specialist group",
        userAction: "Open a group such as UC specialists, network engineers or AV installers.",
        platformResponse: "TechSubbies shows the people, skills, documents and availability inside that group.",
        expectedResult: "The company can manage teams without editing every profile individually.",
        description: "Groups allow companies to manage real operational structures.",
        metrics: [
          { label: "Selected group", value: "UC specialists", detail: "12 engineers" },
          { label: "Available", value: "5", detail: "Next 14 days" },
          { label: "Document gaps", value: "2", detail: "Need attention" }
        ],
        mockPanels: [
          {
            title: "Group view",
            lines: ["Engineer list", "Shared skills", "Regional coverage", "Compliance status"]
          },
          {
            title: "Group actions",
            lines: ["Apply document", "Send update request", "Hide group", "Export compliance view"]
          }
        ]
      },
      {
        id: "company-step-4",
        status: "action",
        pageName: "Individual engineer record",
        povTitle: "The company updates one engineer",
        userAction: "Open an engineer record to update status, groups, notes or company-managed documents.",
        platformResponse: "The platform separates company-owned information from engineer-owned profile details.",
        expectedResult: "The company can manage its pool without taking control of an independent engineer€™s personal profile.",
        description: "This is important for fairness and trust. Company control should not erase engineer independence.",
        metrics: [
          { label: "Record type", value: "Linked shared", detail: "Engineer + company data" },
          { label: "Action", value: "Suspend", detail: "Hide from matching" },
          { label: "Audit", value: "Recorded", detail: "Admin traceability" }
        ],
        mockPanels: [
          {
            title: "Engineer record",
            lines: ["Status", "Groups", "Company notes", "Documents", "Availability"]
          },
          {
            title: "Safe controls",
            lines: ["Suspend", "Hide", "Remove from company", "Do not delete independent account"]
          }
        ]
      },
      {
        id: "company-step-5",
        status: "result",
        pageName: "Expected result",
        povTitle: "The company has a managed resource pool",
        userAction: "Use the dashboard to keep engineers, documents and availability current.",
        platformResponse: "TechSubbies becomes a live operational resource-management layer.",
        expectedResult: "The company saves admin time, improves compliance visibility and can respond faster to project demand.",
        description: "This is where company-tier value becomes clear.",
        metrics: [
          { label: "Outcome", value: "Managed pool", detail: "Company-wide visibility" },
          { label: "Risk", value: "Reduced", detail: "Compliance gaps visible" },
          { label: "Value", value: "Paid tier", detail: "Clear company account benefit" }
        ],
        mockPanels: [
          {
            title: "Company outcome",
            lines: ["Central updates", "Group control", "Engineer drill-down", "Audit trail"]
          },
          {
            title: "Commercial value",
            lines: ["Saves admin time", "Supports larger teams", "Improves matching", "Justifies company tiers"]
          }
        ]
      }
    ]
  }
];

export const defaultDemoJourneyId = "engineer";
