import type { RoleFamily, RoleMarket, RoleSkillDefinition } from "../types/roleSkills";

type MarketRoleSeed = {
  id: string; market: RoleMarket; family: RoleFamily; title: string; shortTitle: string;
  level: RoleSkillDefinition["level"]; summary: string; aliases: string[];
  responsibilities: string[]; contexts: string[]; tags: string[];
  skills: Array<[string, string, string, boolean, string[]]>;
};

function role(seed: MarketRoleSeed): RoleSkillDefinition {
  return {
    id: seed.id, market: seed.market, family: seed.family, title: seed.title,
    shortTitle: seed.shortTitle, level: seed.level, profileKind: "job-role",
    summary: seed.summary, aliases: seed.aliases,
    coreResponsibilities: seed.responsibilities, workContexts: seed.contexts,
    suitableFor: seed.responsibilities, typicalProjects: seed.contexts,
    recommendedTags: seed.tags,
    evidenceTypes: ["Project reference", "Work sample", "Relevant certification", "Client or manager reference"],
    skillGroups: [{ id: `${seed.id}-core`, title: "Role-specific delivery", description: "Practical capabilities repeatedly requested in current recruitment specifications.", skills: seed.skills.map(([id, label, description, requiredForGoodMatch, suggestedTags]) => ({ id, label, description, requiredForGoodMatch, evidenceRecommended: requiredForGoodMatch, suggestedTags })) }],
  };
}

export const marketRoleExtensions: RoleSkillDefinition[] = [
  role({ id: "av-systems-designer", market: "av", family: "design", title: "AV Systems Designer / Pre-Sales Engineer", shortTitle: "AV Systems Designer", level: "specialist", aliases: ["AV Designer", "Technical Designer", "AV Solutions Designer", "Pre-Sales AV Designer", "AV Estimator"], summary: "Translates user and room requirements into coordinated AV designs, drawings, bills of materials and costed technical proposals.", responsibilities: ["Requirements capture and site surveys", "Signal-flow and system design", "Drawings, schematics and equipment schedules", "Bills of materials, estimation and design handover"], contexts: ["Corporate AV design", "Tender response", "Consultant specification", "Design-and-build integration"], tags: ["AutoCAD", "D-Tools", "Visio", "Revit", "Bluebeam", "EASE", "AVIXA CTS-D"], skills: [
    ["avd-requirements", "Capture operational and technical requirements", "Can turn stakeholder needs and room use cases into testable requirements.", true, ["Needs analysis"]],
    ["avd-signal", "Design AV signal flow and system topology", "Can select appropriate transport, switching, audio, control and UC architecture.", true, ["AVoIP", "HDBaseT", "Dante"]],
    ["avd-drawings", "Produce coordinated AV drawings and schematics", "Can create plans, elevations, rack layouts, schematics and cable schedules.", true, ["AutoCAD", "Revit", "Visio"]],
    ["avd-bom", "Build and validate bills of materials", "Can select compatible products, licences, accessories and allowances.", true, ["D-Tools", "Excel"]],
    ["avd-acoustic-visual", "Calculate viewing, projection, audio and coverage needs", "Can apply design calculations and document assumptions.", false, ["EASE", "AVIXA CTS-D"]],
  ] }),
  role({ id: "av-project-engineer", market: "av", family: "project-delivery", title: "AV Project Engineer", shortTitle: "Project Engineer", level: "specialist", aliases: ["Systems Integration Engineer", "Technical Project Engineer"], summary: "Owns the technical translation from design into buildable, coordinated and commissionable project delivery.", responsibilities: ["Technical submittals and design review", "Site surveys and coordination", "Engineering change control", "Installation and commissioning support"], contexts: ["Complex integration", "Multi-room rollout", "Experiential installation", "Construction projects"], tags: ["AutoCAD", "Bluebeam", "RFI", "BOM", "As-built drawings"], skills: [
    ["avpe-review", "Review designs for buildability and completeness", "Can identify coordination, compatibility, access and sequencing risks.", true, ["Design review"]],
    ["avpe-submittals", "Produce technical submittals and installation information", "Can issue schematics, schedules, method information and approved changes.", true, ["AutoCAD", "Bluebeam"]],
    ["avpe-coordination", "Coordinate with PM, trades, design and site teams", "Can resolve RFIs and communicate technical dependencies.", true, ["RFI"]],
    ["avpe-handover", "Support commissioning, as-builts and handover", "Can reconcile delivered configuration with final documentation.", true, ["As-built drawings"]],
  ] }),
  role({ id: "av-project-manager", market: "av", family: "project-delivery", title: "AV Project Manager", shortTitle: "AV Project Manager", level: "lead", aliases: ["AV Technical Project Manager", "AV Delivery Lead", "AV Integration Project Manager"], summary: "Owns AV project scope, programme, commercial control, resources, risk, stakeholders and acceptance without being assumed to perform specialist engineering.", responsibilities: ["Scope, programme and resource ownership", "Commercial, change and risk control", "Client and construction coordination", "Quality, acceptance and handover governance"], contexts: ["Office fit-out", "Global rollout", "Construction integration", "Large system upgrade"], tags: ["MS Project", "Smartsheet", "Prince2", "APM", "Jira", "RAMS"], skills: [
    ["avpm-plan", "Plan programme, resources and dependencies", "Can build and maintain a credible delivery plan.", true, ["MS Project", "Smartsheet"]],
    ["avpm-commercial", "Control scope, variation, budget and procurement", "Can recognise and govern commercial impact without hiding change.", true, ["Change control"]],
    ["avpm-risk", "Manage delivery risk, site readiness and escalation", "Can maintain actions, risks, decisions and dependencies.", true, ["RAID"]],
    ["avpm-client", "Lead client, contractor and internal communication", "Can set expectations and report evidence-based status.", true, []],
    ["avpm-handover", "Govern QA, commissioning and acceptance", "Can ensure documentation, training and completion criteria are met.", true, ["Handover"]],
  ] }),
  role({ id: "av-field-service-engineer", market: "av", family: "field-service", title: "AV Field Service Engineer", shortTitle: "AV Service Engineer", level: "specialist", aliases: ["AV Maintenance Engineer", "AV Break-Fix Engineer", "Field Support Engineer"], summary: "Diagnoses and restores installed AV and UC systems under service-level and customer-site constraints.", responsibilities: ["Break-fix diagnosis", "Preventive maintenance", "Firmware and configuration recovery", "Service reporting and escalation"], contexts: ["Corporate service calls", "Managed AV estates", "Preventive maintenance", "Warranty support"], tags: ["ServiceNow", "Remote monitoring", "Crestron", "Extron", "Q-SYS", "Teams Rooms", "Zoom Rooms"], skills: [
    ["avfs-triage", "Triage AV incidents methodically", "Can reproduce faults and isolate environmental, cabling, configuration and device causes.", true, ["ServiceNow"]],
    ["avfs-multidiscipline", "Fault-find audio, video, control, USB and network dependencies", "Can diagnose across systems while escalating outside competence.", true, ["HDMI", "USB", "TCP/IP"]],
    ["avfs-recovery", "Back up and restore supported configurations", "Can handle firmware and known-good files without uncontrolled change.", true, ["Firmware"]],
    ["avfs-report", "Produce actionable service reports", "Can record cause, action, parts, configuration and follow-up.", true, ["SLA"]],
  ] }),
  role({ id: "av-onsite-support-technician", market: "av", family: "support", title: "AV / VC Onsite Support Technician", shortTitle: "Onsite AV Support", level: "skilled", aliases: ["AV Technician", "Resident AV Technician", "Meeting Room Support Technician", "Event Support Technician"], summary: "Operates and supports meeting-room and presentation technology in a customer environment, prioritising rapid user recovery and service quality.", responsibilities: ["Room readiness checks", "Live meeting and event assistance", "First-line incident resolution", "Asset, ticket and user communication"], contexts: ["Corporate onsite support", "Meeting rooms", "Town halls", "Executive support"], tags: ["Microsoft Teams Rooms", "Zoom Rooms", "ServiceNow", "Logitech", "Cisco Webex", "Q-SYS"], skills: [
    ["avos-room", "Perform room readiness and functional checks", "Can validate displays, content sharing, camera, microphone and calls.", true, ["Teams Rooms", "Zoom Rooms"]],
    ["avos-live", "Support users during meetings and events", "Can recover service discreetly and communicate clearly under time pressure.", true, []],
    ["avos-firstline", "Resolve first-line room faults", "Can isolate common source, cable, USB, account and peripheral issues.", true, ["USB", "HDMI"]],
    ["avos-ticket", "Record incidents, trends and escalations", "Can maintain useful support records and identify repeat problems.", true, ["ServiceNow"]],
  ] }),
  role({ id: "live-events-av-technician", market: "av", family: "live-events", title: "Live Events AV Technician", shortTitle: "Live Events Technician", level: "skilled", aliases: ["Event AV Technician", "Staging Technician", "Conference Technician"], summary: "Prepares, rigs, operates and de-rigs event audio, video, presentation and streaming systems in time-critical production environments.", responsibilities: ["Equipment preparation and rigging", "Show operation", "Signal and content management", "De-rig, inventory and incident reporting"], contexts: ["Conferences", "Corporate events", "Live streaming", "Awards and productions"], tags: ["vMix", "OBS", "Resolume", "Dante", "Shure", "Blackmagic", "Barco", "Lighting desks"], skills: [
    ["live-rig", "Rig and test event systems safely", "Can work to a production plan, patch and power systems safely.", true, ["Rigging", "PAT"]],
    ["live-show", "Operate assigned systems during a live show", "Can follow cues, monitor signals and recover without disrupting the event.", true, ["Show calling"]],
    ["live-video", "Manage presentation, playback and switching", "Can handle content, confidence feeds and common live-video workflows.", false, ["vMix", "Resolume", "Blackmagic"]],
    ["live-audio", "Operate basic live audio paths", "Can patch, line-check and manage speech-focused sound within declared competence.", false, ["Dante", "Shure"]],
  ] }),
  role({ id: "end-user-computing-engineer", market: "it", family: "support", title: "End User Computing / Desktop Engineer", shortTitle: "Desktop Engineer", level: "skilled", aliases: ["Desktop Support Engineer", "2nd Line Support Engineer", "EUC Engineer", "Field IT Engineer"], summary: "Deploys and supports managed endpoints, applications, peripherals and user workspace services beyond first-line triage.", responsibilities: ["Endpoint build and deployment", "Second-line diagnosis", "Application and peripheral support", "Device lifecycle and documentation"], contexts: ["Office support", "Device refresh", "Remote workforce", "Site migration"], tags: ["Windows 11", "macOS", "Intune", "Autopilot", "SCCM", "Jamf", "Microsoft 365"], skills: [
    ["euc-build", "Build and enrol managed endpoints", "Can provision devices through the declared management platform.", true, ["Intune", "Autopilot", "SCCM", "Jamf"]],
    ["euc-diagnose", "Resolve second-line endpoint and application faults", "Can use logs, policy and systematic isolation rather than reimaging by default.", true, ["Windows 11", "macOS"]],
    ["euc-security", "Apply endpoint security and access controls", "Can work within least privilege and approved policy.", true, ["BitLocker", "FileVault", "EDR"]],
    ["euc-lifecycle", "Maintain asset and deployment records", "Can manage handover, return, wipe and disposal evidence.", true, ["ITAM"]],
  ] }),
  role({ id: "cloud-engineer", market: "it", family: "cloud-platform", title: "Cloud Engineer", shortTitle: "Cloud Engineer", level: "specialist", aliases: ["Azure Engineer", "AWS Engineer", "Cloud Infrastructure Engineer"], summary: "Builds, secures and operates cloud infrastructure using declared provider services and infrastructure-as-code practices.", responsibilities: ["Cloud resource design and deployment", "Identity, network and security configuration", "Infrastructure as code", "Monitoring, cost and operational support"], contexts: ["Cloud migration", "Landing zones", "Hybrid cloud", "Service modernisation"], tags: ["Azure", "AWS", "Google Cloud", "Terraform", "Bicep", "CloudFormation", "IAM", "FinOps"], skills: [
    ["cloud-core", "Deploy compute, storage and managed services", "Can implement supported cloud services in the declared provider.", true, ["Azure", "AWS", "Google Cloud"]],
    ["cloud-network", "Configure cloud networking and connectivity", "Can implement segmentation, routing, DNS and hybrid connectivity.", true, ["VNet", "VPC", "VPN"]],
    ["cloud-iam", "Implement cloud identity and least privilege", "Can work with roles, policies, service identities and secrets.", true, ["IAM", "Entra ID"]],
    ["cloud-iac", "Deliver infrastructure as code", "Can review, test and safely apply repeatable infrastructure definitions.", true, ["Terraform", "Bicep", "CloudFormation"]],
    ["cloud-ops", "Monitor reliability, security and cost", "Can configure observability, backup and cost controls.", true, ["FinOps", "CloudWatch", "Azure Monitor"]],
  ] }),
  role({ id: "devops-platform-engineer", market: "it", family: "cloud-platform", title: "DevOps / Platform Engineer", shortTitle: "DevOps Engineer", level: "specialist", aliases: ["Platform Engineer", "Build and Release Engineer", "CI/CD Engineer"], summary: "Builds delivery platforms, automation and deployment pipelines that allow software teams to release safely and repeatedly.", responsibilities: ["CI/CD engineering", "Platform and environment automation", "Container orchestration", "Observability and developer enablement"], contexts: ["Delivery-platform build", "Cloud-native migration", "Release automation", "Internal developer platform"], tags: ["GitHub Actions", "Azure DevOps", "GitLab CI", "Jenkins", "Docker", "Kubernetes", "Terraform", "Ansible"], skills: [
    ["devops-cicd", "Design and operate CI/CD pipelines", "Can implement build, test, security and deployment stages with controlled promotion.", true, ["GitHub Actions", "Azure DevOps", "GitLab CI", "Jenkins"]],
    ["devops-containers", "Build and operate container platforms", "Can manage images, runtime configuration and orchestration.", true, ["Docker", "Kubernetes"]],
    ["devops-iac", "Automate infrastructure and configuration", "Can deliver reviewable, idempotent automation.", true, ["Terraform", "Ansible"]],
    ["devops-observe", "Implement monitoring, logging and alerting", "Can create actionable signals and support incident diagnosis.", true, ["Prometheus", "Grafana", "ELK"]],
  ] }),
  role({ id: "site-reliability-engineer", market: "it", family: "cloud-platform", title: "Site Reliability Engineer", shortTitle: "SRE", level: "specialist", aliases: ["Reliability Engineer", "Production Engineer"], summary: "Applies software engineering to production reliability, observability, incident response and sustainable service operations.", responsibilities: ["Service-level objectives", "Production automation", "Incident response and learning", "Capacity and resilience engineering"], contexts: ["High-availability services", "Production operations", "Reliability improvement"], tags: ["SLO", "SLI", "Prometheus", "Grafana", "Kubernetes", "Python", "Go", "PagerDuty"], skills: [
    ["sre-slo", "Define and use SLIs, SLOs and error budgets", "Can connect reliability measures to user outcomes and delivery decisions.", true, ["SLO", "SLI"]],
    ["sre-automation", "Automate production operations", "Can write reliable tooling that removes repetitive operational work.", true, ["Python", "Go"]],
    ["sre-incident", "Lead or support incident response", "Can diagnose, communicate and facilitate blameless learning.", true, ["PagerDuty"]],
    ["sre-resilience", "Test capacity, failure and recovery", "Can validate resilience assumptions and recovery controls.", true, ["Chaos engineering"]],
  ] }),
  role({ id: "cyber-security-analyst", market: "it", family: "security", title: "Cyber Security / SOC Analyst", shortTitle: "Security Analyst", level: "specialist", aliases: ["SOC Analyst", "Security Operations Analyst", "Cybersecurity Analyst"], summary: "Monitors, investigates and responds to security events while maintaining evidence, escalation and operational security controls.", responsibilities: ["Security monitoring and triage", "Incident investigation", "Vulnerability and control support", "Threat and case reporting"], contexts: ["Security operations centre", "Managed security service", "Incident response", "Vulnerability management"], tags: ["Microsoft Sentinel", "Splunk", "Defender XDR", "CrowdStrike", "SIEM", "EDR", "MITRE ATT&CK", "Security+"], skills: [
    ["soc-monitor", "Triage SIEM and EDR alerts", "Can validate signals, establish severity and avoid unsafe assumptions.", true, ["Sentinel", "Splunk", "EDR"]],
    ["soc-investigate", "Investigate identity, endpoint and network evidence", "Can build a defensible incident timeline and preserve evidence.", true, ["MITRE ATT&CK"]],
    ["soc-respond", "Contain and escalate security incidents", "Can follow authority boundaries and documented playbooks.", true, ["Incident response"]],
    ["soc-vulnerability", "Support vulnerability prioritisation and remediation", "Can interpret exposure and track remediation evidence.", false, ["Nessus", "Qualys"]],
  ] }),
  role({ id: "data-engineer", market: "it", family: "data", title: "Data Engineer", shortTitle: "Data Engineer", level: "specialist", aliases: ["Analytics Engineer", "ETL Developer", "Data Platform Engineer"], summary: "Designs and operates governed data ingestion, transformation, storage and serving pipelines.", responsibilities: ["Data pipeline engineering", "Data modelling and quality", "Platform and orchestration", "Security, lineage and operational support"], contexts: ["Data warehouse", "Lakehouse", "Analytics platform", "System integration"], tags: ["SQL", "Python", "dbt", "Airflow", "Spark", "Databricks", "Snowflake", "Azure Data Factory"], skills: [
    ["data-pipeline", "Build reliable ingestion and transformation pipelines", "Can implement recoverable batch or streaming workflows.", true, ["Python", "Airflow", "Azure Data Factory"]],
    ["data-model", "Design analytical data models", "Can create understandable, performant and governed datasets.", true, ["SQL", "dbt"]],
    ["data-quality", "Implement data quality and observability", "Can detect schema, freshness, completeness and reconciliation failures.", true, ["Data quality"]],
    ["data-platform", "Operate declared data platforms", "Can tune, secure and support the chosen warehouse or lakehouse.", true, ["Databricks", "Snowflake", "Spark"]],
  ] }),
  role({ id: "data-analyst-bi", market: "it", family: "data", title: "Data Analyst / BI Developer", shortTitle: "Data Analyst", level: "skilled", aliases: ["BI Analyst", "Power BI Developer", "Reporting Analyst"], summary: "Turns governed data into validated analysis, reporting and decision-support products.", responsibilities: ["Requirements and metric definition", "Data analysis and validation", "Dashboard and report development", "Insight communication"], contexts: ["Management reporting", "Operational analytics", "Power BI delivery"], tags: ["SQL", "Power BI", "Tableau", "Excel", "DAX", "Python"], skills: [
    ["bi-requirements", "Define measures and reporting requirements", "Can remove ambiguity and agree business rules.", true, ["KPI"]],
    ["bi-sql", "Query and validate structured data", "Can join, aggregate and reconcile data accurately.", true, ["SQL"]],
    ["bi-dashboard", "Build usable analytical reports", "Can model and visualise information for the intended audience.", true, ["Power BI", "Tableau", "DAX"]],
    ["bi-communicate", "Explain insight, caveats and data quality", "Can distinguish evidence from inference and document limitations.", true, []],
  ] }),
  role({ id: "qa-test-engineer", market: "it", family: "quality-assurance", title: "QA / Test Engineer", shortTitle: "Test Engineer", level: "specialist", aliases: ["QA Engineer", "Software Test Engineer", "Automation Test Engineer", "QAT Analyst"], summary: "Designs risk-based test coverage and implements repeatable manual and automated verification across software and integrations.", responsibilities: ["Test analysis and planning", "Functional and integration testing", "Automation engineering", "Defect evidence and quality reporting"], contexts: ["Web application", "API platform", "System migration", "Release assurance"], tags: ["Playwright", "Cypress", "Selenium", "Postman", "JMeter", "Jira", "CI/CD"], skills: [
    ["qa-analysis", "Design risk-based test coverage", "Can derive scenarios, boundaries and acceptance evidence from requirements.", true, ["Test strategy"]],
    ["qa-automation", "Implement maintainable automated tests", "Can select the appropriate test level and avoid brittle automation.", true, ["Playwright", "Cypress", "Selenium"]],
    ["qa-api", "Test APIs and integrations", "Can validate contracts, errors, state and non-happy paths.", true, ["Postman"]],
    ["qa-defects", "Produce reproducible defect evidence", "Can communicate severity, impact and diagnostic context.", true, ["Jira"]],
  ] }),
  role({ id: "it-project-delivery-manager", market: "it", family: "project-delivery", title: "IT Project / Delivery Manager", shortTitle: "IT Project Manager", level: "lead", aliases: ["Technical Project Manager", "Delivery Manager", "IT Programme Manager"], summary: "Leads technology delivery across scope, teams, suppliers, dependencies, risk, change and operational transition.", responsibilities: ["Delivery planning and governance", "Stakeholder and supplier leadership", "Risk, dependency and change management", "Service transition and benefits"], contexts: ["Cloud migration", "Infrastructure refresh", "Application delivery", "Business transformation"], tags: ["Agile", "Scrum", "Prince2", "APM", "Jira", "MS Project", "ITIL"], skills: [
    ["itpm-plan", "Build and govern a delivery plan", "Can manage milestones, dependencies, capacity and critical path.", true, ["MS Project", "Jira"]],
    ["itpm-stakeholder", "Lead technical and business stakeholders", "Can communicate decisions, trade-offs and accountable actions.", true, []],
    ["itpm-risk", "Manage risk, issue, change and supplier performance", "Can keep delivery evidence current and escalate early.", true, ["RAID"]],
    ["itpm-transition", "Plan operational readiness and transition", "Can coordinate support, security, data, training and acceptance.", true, ["ITIL"]],
  ] }),
  role({ id: "technical-solution-architect", market: "it", family: "architecture", title: "Technical / Solution Architect", shortTitle: "Solution Architect", level: "lead", aliases: ["Technical Architect", "Infrastructure Architect", "Cloud Solution Architect"], summary: "Owns coherent technical solution design, constraints, decisions and assurance across multiple systems and delivery teams.", responsibilities: ["Architecture requirements and options", "End-to-end solution design", "Security, operability and integration assurance", "Decision records and delivery governance"], contexts: ["Enterprise integration", "Cloud transformation", "Platform selection", "Complex procurement"], tags: ["TOGAF", "ArchiMate", "C4", "Azure", "AWS", "Security architecture"], skills: [
    ["arch-requirements", "Translate business needs into architecture requirements", "Can expose constraints, qualities and measurable outcomes.", true, ["NFR"]],
    ["arch-design", "Design coherent end-to-end technical solutions", "Can define components, integration, data, security and operational model.", true, ["C4", "ArchiMate"]],
    ["arch-decisions", "Evaluate options and record decisions", "Can make trade-offs explicit and maintain traceable rationale.", true, ["ADR"]],
    ["arch-assure", "Assure implementation against architecture", "Can guide teams without substituting diagrams for engineering evidence.", true, ["Architecture governance"]],
  ] }),
];
