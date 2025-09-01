import { JobRoleDefinition } from '../types/index.ts';

// --- Comprehensive Job Role Database (Expert Level) ---
export const JOB_ROLE_DEFINITIONS: JobRoleDefinition[] = [
    // --- AV Roles ---
    { 
        name: 'Lead AV Installer', 
        category: 'AV', 
        skillCategories: [
            { category: 'Structured Cabling & Standards (AVIXA/CEDIA)', skills: ['Terminate Cat 6/6a to TIA 568A/B standards', 'Solder various connectors (XLR, Phoenix, D-Sub)', 'Terminate & test coaxial cable (BNC, F-Type)', 'Fibre optic termination & testing (LC, SC)', 'Cable testing & certification (Fluke DSX)', 'Rack building & lacing to CEDIA standards'] },
            { category: 'Hardware Installation & Mounting', skills: ['Mounting large format displays & video walls', 'Installing projection systems & screens', 'Rigging and flying speakers', 'Installing ceiling microphones (e.g., Shure MXA910)', 'Precision camera mounting & alignment'] },
            { category: 'System Integration', skills: ['Reading & interpreting AV schematics (CAD/Stardraw)', 'Basic setup of Crestron/AMX/Extron hardware', 'Connecting and testing Biamp/QSC DSPs', 'Understanding signal flow for audio, video, and control', 'Basic HDBaseT & HDMI/HDCP troubleshooting'] },
            { category: 'On-Site Leadership', skills: ['Leading an installation team (2-5 engineers)', 'Conducting daily toolbox talks', 'Creating and managing site risk assessments (RAMS)', 'Coordinating with other trades (electrics, networking)', 'Client-facing progress reporting'] },
        ]
    },
    { 
        name: 'AV Commissioning Engineer', 
        category: 'AV', 
        skillCategories: [
            { category: 'Control System Commissioning', skills: ['Control system loading & debugging (Crestron Toolbox, Biamp SageVue)', 'AMX Netlinx Studio / Extron Global Configurator', 'UI/Touchpanel functionality testing', 'Interfacing with third-party APIs'] },
            { category: 'Audio DSP Commissioning', skills: ['DSP configuration (Gain structure, AEC, automixing)', 'Room tuning & equalization (EQ)', 'Configuring audio networking (Dante Level 3, AVB)', 'Mic programming & testing (Shure, Biamp)'] },
            { category: 'Video Commissioning', skills: ['EDID management & resolution scaling', 'Video wall calibration (e.g., Datapath, Barco)', 'Video processing & routing configuration', 'HDCP 2.x compliance troubleshooting'] },
            { category: 'Network & Handover', skills: ['AV-over-IP network configuration (IGMP Snooping, QoS/DSCP)', 'Network analysis for AV traffic (Wireshark basics)', 'As-built documentation creation', 'Delivering end-user & technical training'] },
        ]
    },
    { 
        name: 'Crestron Programmer', 
        category: 'AV', 
        skillCategories: [
            { category: 'Core Programming Logic', skills: ['SIMPL Windows (Advanced Logic)', 'SIMPL# Pro (C#)', 'Crestron Home OS Extensions', 'Object-Oriented Programming principles', 'Debugging with Crestron Toolbox'] },
            { category: 'User Interface Development', skills: ['Crestron HTML5 UI Development (HTML/CSS/JS)', 'CH5 Component Library integration', 'VT Pro-e for legacy systems', 'UI/UX best practices for AV'] },
            { category: 'Hardware & API Integration', skills: ['DM NVX API for custom routing', 'Interfacing with BACnet/KNX for BMS', 'Third-party device control via serial/IP', 'Microsoft Teams Rooms custom development'] },
        ]
    },
    { 
        name: 'Live Events Technician', 
        category: 'AV', 
        skillCategories: [
            { category: 'Live Audio Engineering', skills: ['Mixing on digital consoles (Yamaha, DiGiCo)', 'RF coordination & wireless mic management', 'PA system design & deployment (Line Array theory)', 'Dante/MADI routing for live shows'] },
            { category: 'Live Video & Vision Mixing', skills: ['Operating production switchers (vMix, ATEM)', 'LED wall processing & pixel mapping', 'Media server operation (Resolume, Disguise)', 'Multi-camera PTZ & broadcast camera operation'] },
            { category: 'Lighting & Stagecraft', skills: ['Basic lighting programming (MA, Avolites)', 'Power distribution & distro management', 'Rigging safety principles', 'Show calling & stage management'] },
        ]
    },
    
    // --- IT Roles ---
    { 
        name: 'Network Engineer', 
        category: 'IT', 
        skillCategories: [
            { category: 'Routing & Switching (Cisco/Juniper)', skills: ['Cisco IOS/NX-OS & Juniper JUNOS CLI', 'Routing protocols (BGP, OSPF, EIGRP)', 'Switching (VLANs, STP, LACP, 802.1x)', 'First-hop redundancy (HSRP, VRRP)'] },
            { category: 'Network Security', skills: ['Firewall management (Palo Alto, Fortinet, ASA)', 'VPN configuration (IPsec, SSL VPN)', 'Network Access Control (NAC - Cisco ISE, ClearPass)', 'Intrusion Prevention System (IPS) tuning'] },
            { category: 'Wireless Networking', skills: ['Wireless LAN controller (WLC) management', 'Wi-Fi site surveys & RF analysis (Ekahau)', 'Wireless security (WPA3-Enterprise, RADIUS)', 'AP deployment and configuration'] },
            { category: 'Network Services & Automation', skills: ['DNS, DHCP, and IPAM management', 'QoS configuration (DSCP, CoS)', 'Network monitoring (PRTG, SolarWinds, Zabbix)', 'Python/Ansible for network automation'] }
        ]
    },
    { 
        name: 'IT Support Engineer', 
        category: 'IT', 
        skillCategories: [
            { category: 'Endpoint & User Management', skills: ['Active Directory & Entra ID (Azure AD) administration', 'Microsoft Intune / MDM policy management', 'Advanced Windows/macOS troubleshooting', 'Software packaging & deployment (SCCM/Intune)'] },
            { category: 'Infrastructure Support', skills: ['Server hardware troubleshooting (Dell/HPE)', 'Virtualization management (VMware vSphere, Hyper-V)', 'Backup & disaster recovery operations', 'Basic network device configuration'] },
            { category: 'Scripting & Automation', skills: ['PowerShell scripting for automation', 'Managing Microsoft 365 services (Exchange Online, SharePoint)', 'IT service management (ITSM) tools (ServiceNow, Jira)', 'Endpoint security management (Antivirus, EDR)'] },
        ]
    },
    { 
        name: 'Cloud Engineer (AWS/Azure)', 
        category: 'IT', 
        skillCategories: [
            { category: 'Infrastructure as Code (IaC)', skills: ['Terraform or CloudFormation scripting', 'Azure Resource Manager (ARM) templates', 'Configuration management (Ansible, Puppet)', 'Building reusable modules'] },
            { category: 'Compute & Containers', skills: ['Managing EC2/Azure VMs at scale', 'Containerization (Docker, Kubernetes - EKS/AKS)', 'Serverless computing (Lambda, Azure Functions)', 'Auto-scaling and load balancing'] },
            { category: 'Cloud Networking & Security', skills: ['VPC / VNet design and peering', 'Cloud security (IAM, Security Groups, WAF)', 'Cloud monitoring & logging (CloudWatch, Azure Monitor)', 'Cost optimization strategies'] },
            { category: 'CI/CD Pipelines', skills: ['Building pipelines (Jenkins, Azure DevOps, GitLab CI)', 'Automated testing and deployment', 'Git-based workflows (GitFlow)'] },
        ]
    },

    // --- Management Roles ---
    { 
        name: 'AV Project Manager', 
        category: 'Management', 
        skillCategories: [
            { category: 'Project Planning & Methodology', skills: ['Project methodologies (Agile, Waterfall)', 'Scope of Work (SoW) creation', 'Work Breakdown Structure (WBS) development', 'Resource planning & scheduling'] },
            { category: 'Financial Management', skills: ['Budgeting, forecasting, and WIP reports', 'Change order management', 'Procurement and vendor negotiation', 'Margin analysis'] },
            { category: 'Execution & Control', skills: ['Risk management & mitigation (RAID logs)', 'Stakeholder communication & reporting', 'Contract management (NEC/JCT basics)', 'Quality assurance (QA) processes'] },
            { category: 'Software Proficiency', skills: ['MS Project or similar Gantt software', 'Collaboration tools (Asana, Jira, Trello)', 'Financial management software', 'Documentation tools (Confluence)'] },
        ]
    }
];
