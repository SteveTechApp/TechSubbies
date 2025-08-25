import { JobRoleDefinition } from '../types/index.ts';

// --- Comprehensive Job Role Database ---
export const JOB_ROLE_DEFINITIONS: JobRoleDefinition[] = [
    // --- AV Roles ---
    { name: 'AV Commissioning Engineer', category: 'AV', skills: ['System Commissioning', 'Crestron Toolbox', 'Biamp Tesira', 'Q-SYS Designer', 'Dante Level 3', 'Network Troubleshooting', 'Final Handover'] },
    { name: 'Lead AV Installer', category: 'AV', skills: ['Rack Building & Wiring', 'Reading Schematics', 'Cable Termination', 'Team Leadership', 'Health & Safety (H&S)', 'On-site Problem Solving'] },
    { name: 'AV Service Engineer', category: 'AV', skills: ['Fault Finding', 'Preventative Maintenance', 'Client Communication', 'RMAs & Ticketing', 'Remote Diagnostics', 'Firmware Management'] },
    { name: 'Rack Builder / Wirer', category: 'AV', skills: ['Wiring to Schematic', 'Cable Looming', 'Soldering', 'Neat Patching', 'Metalwork Fabrication', 'Rack Elevation Accuracy'] },
    { name: 'Crestron Programmer', category: 'AV', skills: ['SIMPL Windows', 'C# (for SIMPL#)', 'Crestron HTML5 UI', 'DM NVX Configuration', 'System Architecture', 'API Integration'] },
    { name: 'Q-SYS Programmer', category: 'AV', skills: ['Q-SYS Designer Software', 'Lua Scripting', 'UCI Design', 'Core Manager', 'AES67/Dante Integration', 'Telephony/VoIP'] },
    { name: 'Live Events Technician', category: 'AV', skills: ['Live Sound Mixing', 'Vision Mixing (vMix/Blackmagic)', 'LED Wall Configuration', 'Power Distribution', 'Projection Mapping', 'Client Facing Skills'] },
    { name: 'Video Conference Specialist', category: 'AV', skills: ['MS Teams Rooms', 'Zoom Rooms', 'Cisco Webex Devices', 'Poly Studio Series', 'Device Provisioning', 'End-User Training'] },
    { name: 'AV System Designer', category: 'AV', skills: ['AutoCAD/Visio', 'System Flow Diagrams', 'Acoustic Modelling', 'Bill of Materials (BoM)', 'Product Knowledge', 'Tender Response'] },
    { name: 'Digital Signage Specialist', category: 'AV', skills: ['CMS Platforms (e.g., BrightSign)', 'Content Scheduling', 'Player Hardware', 'Network Configuration', 'Video Wall Setup', 'API Integration'] },
    
    // --- IT Roles ---
    { name: 'Network Engineer', category: 'IT', skills: ['Cisco iOS/NX-OS', 'Routing (BGP/OSPF)', 'Switching (VLANs/STP)', 'Firewall Management', 'Network Monitoring', 'Wi-Fi Surveys'] },
    { name: 'IT Support Engineer', category: 'IT', skills: ['Active Directory', 'Microsoft 365 Admin', 'Hardware Troubleshooting', 'Windows/macOS Support', 'Basic Networking', 'Ticketing Systems'] },
    { name: 'Cloud Engineer (AWS/Azure)', category: 'IT', skills: ['AWS EC2/Azure VMs', 'VPC/VNet Networking', 'IAM/Azure AD', 'CloudFormation/Terraform', 'Serverless Functions', 'Cloud Monitoring'] },
    { name: 'Cybersecurity Analyst', category: 'IT', skills: ['SIEM Tools (e.g., Splunk)', 'Vulnerability Scanning', 'Firewall Policy Analysis', 'Incident Response', 'Phishing Analysis', 'Penetration Testing Concepts'] },
    { name: 'Unified Comms (UC) Engineer', category: 'IT', skills: ['MS Teams Telephony', 'Cisco CUCM', 'SBC Configuration (e.g., Ribbon/AudioCodes)', 'PowerShell', 'SIP Trunking', 'Voice Gateway Management'] },
    { name: 'Solutions Architect', category: 'IT', skills: ['High-Level Design', 'Technical Documentation', 'Stakeholder Management', 'Cloud Architecture', 'Cost Analysis', 'Proof of Concept Dev'] },
    { name: 'DevOps Engineer', category: 'IT', skills: ['CI/CD Pipelines (Jenkins/GitLab)', 'Docker & Kubernetes', 'Infrastructure as Code (IaC)', 'Scripting (Bash/Python)', 'Configuration Management', 'Monitoring & Logging'] },
    { name: 'Database Administrator (DBA)', category: 'IT', skills: ['SQL Server/PostgreSQL', 'Backup & Recovery', 'Performance Tuning', 'Database Security', 'Query Optimization', 'High Availability Setup'] },

    // --- Management Roles ---
    { name: 'AV Project Manager', category: 'Management', skills: ['Project Scoping', 'Gantt Charts (MS Project)', 'Budget Management', 'Client Communication', 'Risk Assessment', 'Change Order Management'] },
    { name: 'IT Project Manager', category: 'Management', skills: ['Agile/Scrum Methodology', 'Jira/Confluence', 'Resource Planning', 'Vendor Management', 'Status Reporting', 'Risk Mitigation'] },
    { name: 'Technical Sales / Pre-Sales', category: 'Management', skills: ['Requirement Gathering', 'Solution Demonstration', 'Proposal Writing', 'Client Relationship', 'Technical Presentations', 'Competitive Analysis'] },
];
