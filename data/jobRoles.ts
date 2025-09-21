import { JobRoleDefinition } from '../types';

// --- Comprehensive Skills & Knowledge Matrix for IT & AV Roles ---
export const JOB_ROLE_DEFINITIONS: JobRoleDefinition[] = [
    // --- Audio Visual & Media Technology ---
    {
        name: 'AV Systems Designer',
        category: 'Audio Visual & Media Technology',
        skillCategories: [
            {
                category: 'Core Design Skills',
                skills: [
                    { name: 'AV System Signal Flow Design', description: 'Expertise in architecting and documenting the complete signal path for audio, video, control, and network signals, ensuring proper resolution, format, and protocol compatibility from source to destination.' },
                    { name: 'Needs Analysis & Client Consultation', description: 'Skill in conducting thorough stakeholder interviews and workshops to define functional requirements, user workflows, and translate business needs into a technical scope of work.' },
                    { name: 'System Interoperability Planning', description: 'Designing systems with components from various manufacturers to ensure seamless communication and functionality, including API and control protocol compatibility.' },
                    { name: 'Power & Thermal Management Strategy', description: 'Calculating power loads, specifying electrical requirements (including PoE budgets), and planning for adequate ventilation and heat dissipation within racks and equipment locations to ensure system stability and longevity.' },
                    { name: 'AV Network Infrastructure Design', description: 'Designing the underlying network topology (switching, VLANs, QoS, IGMP for AV-over-IP) to support real-time media, control, and system management traffic reliably.' },
                ]
            },
            {
                category: 'Software & Tool Proficiency',
                skills: [
                    { name: 'CAD Software (AutoCAD, Vectorworks)', description: 'Proficiency in creating and interpreting AV system drawings, elevation views, architectural plans, and creating detailed schematics.' },
                    { name: 'AV Design Software (D-Tools, Stardraw)', description: 'Using specialized software for creating comprehensive system schematics, proposals, bills of material, and project documentation.' },
                    { name: 'Acoustic Modeling (EASE, CATT-Acoustic)', description: 'Ability to model and predict the acoustic performance of a space to inform loudspeaker selection, placement, and required acoustic treatment for optimal intelligibility and sound quality.' },
                    { name: 'Video Projection & Display Modeling', description: 'Using software tools to calculate sightlines, required projector brightness (lumens), contrast ratios, and optimal display sizes for various viewing environments and ambient light conditions.' },
                ]
            },
            {
                category: 'Manufacturer Expertise (Design)',
                skills: [
                    { name: 'Crestron Ecosystem', description: 'In-depth knowledge of designing systems with Crestron control processors, video distribution (DM NVX, DM Lite), and audio solutions.' },
                    { name: 'Extron Global Configurator', description: 'Knowledge of Extron control systems, switchers, and signal processing product lines for integrated room designs.' },
                    { name: 'AMX (Harman)', description: 'Familiarity with AMX control and video distribution hardware and software ecosystems for enterprise-level solutions.' },
                    { name: 'Biamp Tesira Platform', description: 'Proficiency in designing complex audio systems using Biamp Tesira DSPs, AVB/Dante networking, and associated peripherals.' },
                    { name: 'QSC Q-SYS Ecosystem', description: 'Experience with the Q-SYS platform for integrated audio, video, and control design, leveraging its software-based architecture.' },
                    { name: 'Cisco Video Conferencing', description: 'Understanding of integrating Cisco Webex codecs, peripherals, and networking hardware into comprehensive AV designs.' },
                ]
            },
            {
                category: 'Industry Knowledge & Certifications',
                skills: [
                    { name: 'AVIXA CTS-D Certification', description: 'A specialized AVIXA certification demonstrating mastery of the principles and best practices of AV system design.' },
                    { name: 'Building & Safety Codes (ADA, IBC)', description: 'Knowledge of relevant construction codes, accessibility standards (ADA), and safety regulations that impact AV system design and installation.' },
                    { name: 'AVIXA Standards Application', description: 'Familiarity and application of best practice standards for AV performance, installation, and safety as defined by the industry association.' },
                    { name: 'Project Budgeting & Cost Estimation', description: 'Ability to create accurate and detailed project cost estimates, including hardware, labor, programming, and contingency planning.' },
                ]
            }
        ]
    },
    {
        name: 'AV Systems Engineer / Commissioner',
        category: 'Audio Visual & Media Technology',
        skillCategories: [
            {
                category: 'Technical Commissioning & Programming',
                skills: [
                    { name: 'Systematic Troubleshooting', description: 'Applying logical and efficient problem-solving methodologies to diagnose and resolve complex hardware, software, and network issues in integrated AV systems.' },
                    { name: 'Formal Commissioning Procedures', description: 'Executing a methodical approach to testing, verifying, and documenting that a system meets all design specifications and performance standards before client handover.' },
                    { name: 'Control System Programming', description: 'Advanced ability to write, debug, and deploy custom code for control systems (e.g., Crestron SIMPL/C#, AMX Netlinx) to implement the designed functionality and user interface.' },
                    { name: 'DSP Configuration & Audio Calibration', description: 'Expertise in configuring digital signal processors (DSPs) including AEC, gain structure, and auto-mixing. Using measurement tools (e.g., Smaart, REW) to calibrate audio systems for optimal performance.' },
                    { name: 'AV Network Configuration & Validation', description: 'Hands-on configuration of managed network switches (e.g., Cisco, Juniper) for AV-over-IP systems, including VLANs, QoS, IGMP Snooping/Querier, and PTPv2 for clocking.' },
                    { name: 'AV Cybersecurity Implementation', description: 'Understanding and implementing security measures such as 802.1x, Active Directory integration, and certificate management to protect networked AV devices from unauthorized access.' },
                ]
            },
            {
                category: 'Software & Diagnostic Tools',
                skills: [
                    { name: 'Network Analysis (Wireshark)', description: 'Using packet capture tools like Wireshark to diagnose complex connectivity, multicast, and protocol-specific issues on AV networks.' },
                    { name: 'Acoustic Analysis (Smaart, REW)', description: 'Using acoustic analysis software with measurement microphones to measure and optimize room acoustics and audio system performance.' },
                    { name: 'Manufacturer Configuration Suites', description: 'Mastery of tools like Biamp Tesira software, Q-SYS Designer, Crestron Toolbox, and Extron PCS for device configuration, monitoring, and firmware management.' },
                    { name: 'Remote Management Platforms (XiO Cloud)', description: 'Experience with cloud-based platforms for remote monitoring, management, firmware deployment, and troubleshooting of enterprise-wide AV systems.' },
                ]
            },
            {
                category: 'Hardware & Test Equipment',
                skills: [
                    { name: 'Advanced Test & Measurement', description: 'Proficiency with multimeters, oscilloscopes, video/audio signal generators, and network cable certifiers (e.g., Fluke) for in-depth system verification.' },
                    { name: 'Video Display Calibration', description: 'Using colorimeters, spectroradiometers, and calibration software (e.g., Calman) to professionally calibrate video displays for accurate color and brightness.' },
                    { name: 'Managed Network Switches', description: 'Hands-on experience with CLI and GUI configuration of managed network hardware from brands like Cisco, Juniper, and Aruba specifically for AV applications.' },
                    { name: 'DSP & Control Hardware', description: 'In-depth knowledge of configuring, loading, and troubleshooting hardware like Biamp TesiraFORTE, Q-SYS Core processors, and Crestron 4-Series control processors.' },
                ]
            },
            {
                category: 'Key Certifications',
                skills: [
                    { name: 'AVIXA CTS-I Certification', description: 'Specialized AVIXA certification focused on best practices for installing and commissioning AV systems to a high standard.' },
                    { name: 'Networking Certifications (CCNA/Network+)', description: 'Industry-recognized IT networking certifications demonstrating a strong foundation in networking principles, essential for modern AV.' },
                    { name: 'Crestron Certified Programmer (CCP)', description: 'Advanced certification demonstrating expertise in programming and deploying complex Crestron control systems.' },
                    { name: 'Biamp Tesira / Q-SYS Level 2 Certified', description: 'Manufacturer certifications for advanced audio DSP programming and configuration.' },
                    { name: 'Audinate Dante Certification (Level 3)', description: 'Audinate certification for proficiency in setting up, managing, and troubleshooting complex Dante audio networks.' },
                ]
            }
        ]
    },
     {
        name: 'Control System Programmer',
        category: 'Audio Visual & Media Technology',
        skillCategories: [
            {
                category: 'Core Programming Skills',
                skills: [
                    { name: 'Crestron SIMPL/SIMPL+ Programming', description: 'Developing and debugging control logic using Crestron\'s proprietary SIMPL and SIMPL+ languages.' },
                    { name: 'Crestron C# Programming (VS Code)', description: 'Building complex control solutions using the C# SDK for Crestron 4-Series processors within Visual Studio Code.' },
                    { name: 'AMX NetLinx Programming', description: 'Programming AMX control systems using NetLinx Studio and the NetLinx language.' },
                    { name: 'Q-SYS Control Programming (Lua)', description: 'Scripting custom control components and logic within the Q-SYS ecosystem using Lua.' },
                    { name: 'Extron Control Professional (Python)', description: 'Developing control logic for Extron Pro Series systems using Global Scripter and Python.' },
                    { name: 'UI/UX Design for Touch Panels', description: 'Designing intuitive and user-friendly graphical interfaces for touch panels using tools like VT Pro-e, or native HTML5/JS.' },
                    { name: 'API Integration & Web Services', description: 'Integrating with third-party devices and services via REST APIs, SOAP, and other web technologies.' },
                ]
            },
            {
                category: 'System Knowledge',
                skills: [
                    { name: 'AV Signal Flow & Protocols', description: 'Deep understanding of audio, video, and control signal paths, including protocols like HDMI, HDCP, EDID, RS-232, and IP.' },
                    { name: 'Networked AV (AV-over-IP)', description: 'Understanding of networking principles as they apply to AV systems, including multicast, QoS, and protocols like DM NVX, SVSI, and Dante.' },
                    { name: 'Hardware & System Architecture', description: 'Familiarity with the physical hardware (processors, switchers, DSPs) and how they fit into a larger system architecture.' },
                ]
            },
            {
                category: 'Manufacturer Certifications',
                skills: [
                    { name: 'Crestron Certified Programmer (CCP)', description: 'Advanced certification demonstrating expertise in programming and deploying complex Crestron control systems.' },
                    { name: 'AMX Certified Programmer (ACE-P)', description: 'Certification for proficiency in programming AMX NetLinx control systems.' },
                    { name: 'Q-SYS Control 201 Certified', description: 'Certification for advanced control programming within the Q-SYS ecosystem.' },
                    { name: 'Extron Control Professional', description: 'Certification for programming Extron Pro Series control systems.' },
                ]
            }
        ]
    },
    {
        name: 'AV Technician / Installer',
        category: 'Audio Visual & Media Technology',
        skillCategories: [
             {
                category: 'Practical Tasks & Installation Skills',
                skills: [
                    { name: 'Rack Building & Wiring', description: 'Physically assembling and wiring equipment racks according to elevation drawings and wiring schematics. Performing neat cable management (lacing, dressing) for serviceability and reliability.' },
                    { name: 'Cable Termination & Testing', description: 'Proficiently terminating various cable types including Cat6/6a (T568A/B), coaxial (BNC), and audio (XLR, Phoenix). Verifying all terminations with appropriate testers.' },
                    { name: 'Physical Equipment Installation', description: 'Experience installing equipment such as displays, projectors, screens, speakers, and cameras according to plans, including mounting and securing hardware safely and accurately.' },
                    { name: 'Reading Schematics & Plans', description: 'Ability to interpret system drawings, architectural plans, and wiring diagrams to execute installation correctly and identify potential issues on site.' },
                    { name: 'Device Firmware Management', description: 'Experience updating firmware on various AV devices as a standard part of the commissioning process to ensure stability and feature compatibility.' },
                ]
            },
            {
                category: 'Hardware & Tool Handling',
                skills: [
                    { name: 'Hand & Power Tools', description: 'Safe and proficient use of common construction and installation tools, including drills, saws, and specialized termination tools (RJ45 crimpers, punch-down tools, BNC crimpers).' },
                    { name: 'Cable Testers & Signal Generators', description: 'Using basic test equipment to verify signal flow and cable integrity during and after installation to ensure a fault-free system.' },
                    { name: 'Ladders & Powered Access Lifts', description: 'Certified and experienced in safely using ladders, scaffolding, and scissor lifts (e.g., IPAF PAL card) for installations at height.' },
                ]
            },
            {
                category: 'Software Knowledge',
                skills: [
                    { name: 'Basic IP Addressing', description: 'Understanding how to set static IP addresses, check network connectivity (ping), and verify device status on a network.' },
                    { name: 'User Interface Navigation', description: 'Ability to navigate and perform basic tests using a system\'s user interface (e.g., touch panel, web GUI) to confirm functionality.' },
                    { name: 'Manufacturer Utility Tools', description: 'Basic use of tools like Crestron Toolbox or Extron Toolbelt for device discovery, addressing, and initial setup.' },
                ]
            },
            {
                category: 'Manufacturer & Certifications',
                skills: [
                    { name: 'AVIXA CTS Certification', description: 'General AVIXA certification covering a broad range of AV knowledge, recognized globally as a baseline for competency.' },
                    { name: 'Job Site Safety Certifications (CSCS, OSHA, etc.)', description: 'Holding relevant and current job site safety certifications required for construction environments, including card-based schemes and powered access licenses (PAL).' },
                    { name: 'Physical Product Familiarity', description: 'Hands-on familiarity with the physical characteristics and mounting requirements of major brands like Crestron, Extron, Biamp, Shure, and major display manufacturers.' },
                ]
            }
        ]
    },
    {
        name: 'AV Sales Engineer',
        category: 'Audio Visual & Media Technology',
        skillCategories: [
             {
                category: 'Technical Acumen',
                skills: [
                     { name: 'Solution Architecture', description: 'Ability to deeply understand client business needs and architect a high-level technical solution that meets their functional requirements and budget.' },
                     { name: 'Broad AV/IT Ecosystem Knowledge', description: 'Wide-ranging knowledge of various manufacturers, technologies (e.g., AV-over-IP, UC, wireless presentation), and industry trends to propose effective and current solutions.' },
                     { name: 'Conceptual Signal Flow', description: 'Ability to conceptually map out how a system will function to ensure a proposed design is viable and communicate it effectively to clients and internal teams.' },
                ]
            },
            {
                category: 'Sales & Business Skills',
                skills: [
                    { name: 'Technical Proposal Writing', description: 'Creating detailed, accurate, and persuasive technical proposals and statements of work (SOWs) that clearly outline the solution, deliverables, and value proposition.' },
                    { name: 'Product & Solution Demonstrations', description: 'Skillfully demonstrating AV hardware and software capabilities to both technical and non-technical audiences, focusing on benefits and user experience.' },
                    { name: 'Client Relationship Management', description: 'Building and maintaining strong, long-term relationships with clients, acting as a trusted technical advisor throughout the sales cycle.' },
                    { name: 'Public Speaking & Presentation Skills', description: 'Clearly and confidently presenting complex technical solutions to individuals and groups, from engineers to C-level executives.' },
                ]
            },
             {
                category: 'Software Proficiency',
                skills: [
                    { name: 'CRM Software (Salesforce, HubSpot)', description: 'Using CRM platforms to manage leads, opportunities, client interactions, and sales pipelines efficiently.' },
                    { name: 'Proposal Software (D-Tools, QuoteWerks)', description: 'Proficiency with software designed for quoting and creating detailed AV system proposals, including bills of material and labor estimates.' },
                    { name: 'Microsoft Office Suite', description: 'Advanced skills in creating professional documents (Word), detailed spreadsheets (Excel), and compelling presentations (PowerPoint).' },
                ]
            },
            {
                category: 'Manufacturer Product Lines',
                skills: [
                    { name: 'Crestron / AMX / Extron', description: 'Strong familiarity with the control and video distribution product lines to specify appropriate hardware for various applications.' },
                    { name: 'Biamp / QSC / Shure', description: 'Knowledge of audio DSP, microphone, and loudspeaker product families and their capabilities for different acoustic environments.' },
                    { name: 'Poly / Cisco / Microsoft Teams', description: 'Understanding of unified communications (UC) and video conferencing ecosystems and how they integrate into meeting room environments.' },
                    { name: 'Major Display Brands (LG, Samsung, NEC)', description: 'Familiarity with the commercial display offerings from major manufacturers, including video walls, interactive panels, and professional displays.' },
                ]
            }
        ]
    },
    // --- Information Technology ---
    {
        name: 'IT Support Engineer',
        category: 'Information Technology',
        skillCategories: [
            {
                category: 'Core IT Support',
                skills: [
                    { name: 'Desktop Support (Windows/macOS)', description: 'Troubleshooting and resolving user issues on Windows and macOS operating systems, including software installation and hardware diagnostics.' },
                    { name: 'Microsoft 365 Administration', description: 'Managing users, groups, and licenses in Microsoft 365. Troubleshooting Exchange Online, SharePoint, and Teams issues.' },
                    { name: 'Active Directory Management', description: 'Creating and managing user accounts, groups, and OUs. Understanding of Group Policy Objects (GPOs).' },
                    { name: 'Mobile Device Management (MDM)', description: 'Enrolling and managing mobile devices (iOS/Android) using platforms like Microsoft Intune or Jamf.' },
                    { name: 'Hardware Troubleshooting & Repair', description: 'Diagnosing and replacing common hardware components in laptops and desktops, such as RAM, SSDs, and power supplies.' },
                ]
            },
            {
                category: 'Networking',
                skills: [
                    { name: 'TCP/IP Networking Fundamentals', description: 'Solid understanding of IP addressing, subnetting, DNS, DHCP, and core networking concepts.' },
                    { name: 'Network Troubleshooting (Ping, Tracert)', description: 'Using command-line tools to diagnose network connectivity issues.' },
                    { name: 'Wireless Network Support', description: 'Troubleshooting common Wi-Fi connectivity issues for end-users.' },
                    { name: 'VPN Client Configuration', description: 'Assisting users with the setup and troubleshooting of VPN client software.' },
                ]
            },
            {
                category: 'Software & Systems',
                skills: [
                    { name: 'IT Service Management (ITSM)', description: 'Experience using ticketing systems like ServiceNow, Jira Service Desk, or Zendesk to manage and document support requests.' },
                    { name: 'Antivirus & Endpoint Security', description: 'Managing endpoint security software and responding to basic security alerts.' },
                    { name: 'Backup & Recovery Procedures', description: 'Performing data backups and restorations for end-user devices.' },
                ]
            },
            {
                category: 'Key Certifications',
                skills: [
                    { name: 'CompTIA A+', description: 'A foundational certification for IT support professionals covering hardware, software, and troubleshooting.' },
                    { name: 'CompTIA Network+', description: 'A certification covering the fundamentals of computer networking.' },
                    { name: 'Microsoft 365 Certified: Modern Desktop Administrator Associate', description: 'A certification focused on deploying, configuring, and managing Windows 10/11 and Microsoft 365 apps.' },
                ]
            }
        ]
    },
];