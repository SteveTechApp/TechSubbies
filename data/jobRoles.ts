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
                    { name: 'AV System Signal Flow', description: 'Deep understanding of how audio, video, and control signals are routed, processed, and managed within complex AV systems.' },
                    { name: 'Needs Analysis & Client Consultation', description: 'Skill in interviewing clients and stakeholders to understand their needs and translate them into technical system requirements.' },
                    { name: 'System Interoperability', description: 'Ensuring all components from different manufacturers can communicate and work together seamlessly within an integrated system.' },
                    { name: 'Power & Thermal Management', description: 'Calculating power loads, specifying electrical needs, and planning for heat dissipation to ensure system stability and safety.' },
                    { name: 'Network Infrastructure Design', description: 'Designing the underlying network topology (switching, VLANs, QoS) to support AV-over-IP, control, and system traffic.' },
                ]
            },
            {
                category: 'Software & Tool Proficiency',
                skills: [
                    { name: 'CAD Software (AutoCAD, Vectorworks)', description: 'Proficiency in creating and interpreting AV system drawings, layouts, and architectural plans.' },
                    { name: 'AV Design Software (D-Tools, Stardraw)', description: 'Using specialized software for creating system schematics, proposals, and project documentation.' },
                    { name: 'Acoustic Modeling (EASE, CATT-Acoustic)', description: 'Ability to model and predict the acoustic performance of a space to inform speaker placement and treatment.' },
                    { name: 'Video Modeling Tools (DisplayView, Modeler)', description: 'Using software to calculate sightlines, projector brightness, and optimal display sizes for various viewing environments.' },
                ]
            },
            {
                category: 'Manufacturer Expertise',
                skills: [
                    { name: 'Crestron', description: 'Experience designing systems with Crestron control, video distribution (DM), and audio solutions.' },
                    // FIX: Corrected typo from `name::` to `name:`
                    { name: 'Extron', description: 'Knowledge of Extron control systems, switchers, and signal processing product lines.' },
                    { name: 'AMX', description: 'Familiarity with AMX control and video distribution hardware and software ecosystems.' },
                    { name: 'Biamp', description: 'Proficiency in designing audio systems using Biamp Tesira DSPs and loudspeakers.' },
                    { name: 'QSC', description: 'Experience with the Q-SYS ecosystem for integrated audio, video, and control design.' },
                    { name: 'Cisco', description: 'Understanding of Cisco networking hardware and video conferencing codecs in AV design.' },
                ]
            },
            {
                category: 'Industry Knowledge & Certifications',
                skills: [
                    { name: 'CTS-D (Certified Technology Specialist - Design)', description: 'A specialized AVIXA certification focused on the principles and best practices of AV system design.' },
                    { name: 'Building Codes & ADA Compliance', description: 'Knowledge of relevant construction codes, accessibility standards, and safety regulations that impact AV design.' },
                    { name: 'AVIXA Standards', description: 'Familiarity with best practice standards for performance, installation, and safety in the AV industry.' },
                    { name: 'Cost Estimation & Budgeting', description: 'Ability to create accurate project cost estimates, including hardware, labor, and contingency.' },
                ]
            }
        ]
    },
    {
        name: 'AV Systems Engineer / Commissioner',
        category: 'Audio Visual & Media Technology',
        skillCategories: [
            {
                category: 'Technical Skills & Commissioning',
                skills: [
                    { name: 'Systematic Troubleshooting', description: 'Logical and efficient problem-solving skills to diagnose and resolve complex issues in integrated AV systems.' },
                    { name: 'System Commissioning Procedures', description: 'A methodical approach to testing, verifying, and documenting that a system meets all design specifications and performance standards.' },
                    { name: 'Control System Programming (Crestron, AMX)', description: 'Ability to write, debug, and deploy code for control systems to implement the designed functionality.' },
                    { name: 'DSP Configuration & Audio Calibration', description: 'Expertise in configuring digital signal processors (DSPs) and using measurement tools to calibrate audio systems for optimal performance.' },
                    { name: 'Network Configuration (TCP/IP, IGMP, QoS)', description: 'Hands-on configuration of network switches and protocols crucial for AV-over-IP systems and device control.' },
                    { name: 'AV Cybersecurity Best Practices', description: 'Understanding and implementing security measures to protect networked AV devices from unauthorized access.' },
                ]
            },
            {
                category: 'Software & Tool Proficiency',
                skills: [
                    { name: 'Network Analysis Tools (Wireshark)', description: 'Using software tools to capture and analyze network packets to diagnose connectivity and performance issues.' },
                    { name: 'Audio Measurement Software (Smaart, REW)', description: 'Using acoustic analysis software to measure and optimize room acoustics and audio system performance.' },
                    { name: 'Manufacturer Configuration Software', description: 'Proficiency with tools like Biamp Tesira software, Q-SYS Designer, and Crestron Toolbox.' },
                    { name: 'Remote Monitoring Platforms (XiO Cloud)', description: 'Experience with platforms that allow for remote monitoring, management, and troubleshooting of AV systems.' },
                ]
            },
             {
                category: 'Hardware & Tool Handling',
                skills: [
                    { name: 'Test & Measurement Equipment', description: 'Proficiency with multimeters, signal generators, oscilloscopes, and cable certifiers for in-depth troubleshooting.' },
                    { name: 'Display Calibration Equipment', description: 'Using colorimeters and light meters to professionally calibrate video displays for accurate color and brightness.' },
                    { name: 'Network Switches & Routers', description: 'Hands-on experience with configuring managed network hardware specifically for AV applications.' },
                    { name: 'DSP Hardware Platforms', description: 'In-depth knowledge of configuring and troubleshooting hardware like Biamp TesiraFORTE and Q-SYS Core processors.' },
                ]
            },
            {
                category: 'Manufacturer Expertise & Certifications',
                skills: [
                    { name: 'CTS-I (Certified Technology Specialist - Installation)', description: 'Specialized AVIXA certification focused on best practices for installing and commissioning AV systems.' },
                    { name: 'Network+ / CCNA', description: 'Industry-recognized IT networking certifications demonstrating a strong foundation in networking principles.' },
                    { name: 'Crestron Certified Programmer', description: 'Advanced certification demonstrating expertise in programming Crestron control systems.' },
                    { name: 'Biamp Tesira / Q-SYS Certified', description: 'Manufacturer certifications for advanced audio DSP programming and configuration.' },
                    { name: 'Dante Certification (Levels 1-3)', description: 'Audinate certification for proficiency in setting up and managing Dante audio networks.' },
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
                    { name: 'Rack Building & Wiring', description: 'Ability to build, wire, and dress equipment racks to a high standard for serviceability and reliability.' },
                    { name: 'Cable Termination & Testing', description: 'Proficiency in terminating various cable types (e.g., RJ45, BNC, XLR, coaxial) and using testers to verify integrity.' },
                    { name: 'Physical Installation', description: 'Experience installing equipment such as displays, projectors, screens, speakers, and cameras according to plans.' },
                    { name: 'Reading Schematics & Drawings', description: 'Ability to interpret system drawings, architectural plans, and wiring diagrams to execute installation correctly.' },
                    { name: 'Loading Device Firmware', description: 'Experience updating firmware on various AV devices as part of the commissioning process.' },
                ]
            },
            {
                category: 'Hardware & Tool Handling',
                skills: [
                    { name: 'Hand & Power Tools', description: 'Safe and proficient use of common construction and installation tools.' },
                    { name: 'Cable Testers & Signal Generators', description: 'Using basic test equipment to verify signal flow and cable integrity during installation.' },
                    { name: 'Ladders & Lifts', description: 'Certified and experienced in safely using ladders, scaffolding, and scissor lifts for installations at height.' },
                ]
            },
            {
                category: 'Software Knowledge',
                skills: [
                    { name: 'Basic IP Configuration', description: 'Understanding how to set static IP addresses and check network connectivity on AV devices.' },
                    { name: 'Control System GUI', description: 'Ability to navigate and perform basic tests using a system\'s user interface (e.g., touch panel).' },
                    { name: 'Manufacturer Utility Software', description: 'Basic use of tools like Crestron Toolbox or Extron Toolbelt for device discovery and setup.' },
                ]
            },
            {
                category: 'Manufacturer & Certifications',
                skills: [
                    { name: 'CTS (Certified Technology Specialist)', description: 'General AVIXA certification covering a broad range of AV knowledge, recognized globally.' },
                    { name: 'Safety Certifications (CSCS, OSHA)', description: 'Holding relevant job site safety certifications required for construction environments.' },
                    { name: 'Physical Product Knowledge', description: 'Hands-on familiarity with the physical characteristics and mounting requirements of major brands like Crestron, Extron, Biamp, Shure, etc.' },
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
                     { name: 'Solution Architecture', description: 'Ability to understand client needs and architect a high-level technical solution that meets their requirements and budget.' },
                     { name: 'Broad AV/IT Ecosystem Knowledge', description: 'Wide-ranging knowledge of various manufacturers, technologies, and industry trends to propose effective solutions.' },
                     { name: 'Understanding of Signal Flow', description: 'Ability to conceptually map out how a system will function to ensure a proposed design is viable.' },
                ]
            },
            {
                category: 'Sales & Business Skills',
                skills: [
                    { name: 'Technical Proposal Writing', description: 'Creating detailed, accurate, and persuasive technical proposals and statements of work (SOWs).' },
                    { name: 'Product Demonstrations', description: 'Skillfully demonstrating AV hardware and software capabilities to technical and non-technical audiences.' },
                    { name: 'Client Relationship Management', description: 'Building and maintaining strong relationships with clients, acting as a trusted technical advisor.' },
                    { name: 'Presentation Skills', description: 'Clearly and confidently presenting complex technical solutions to potential clients.' },
                ]
            },
             {
                category: 'Software Proficiency',
                skills: [
                    { name: 'CRM Software (Salesforce, HubSpot)', description: 'Using CRM platforms to manage leads, opportunities, and client interactions.' },
                    { name: 'Proposal Software (D-Tools, QuoteWerks)', description: 'Proficiency with software designed for quoting and creating AV system proposals.' },
                    { name: 'Microsoft Office Suite (Word, Excel, PowerPoint)', description: 'Advanced skills in creating professional documents, spreadsheets, and presentations.' },
                ]
            },
            {
                category: 'Manufacturer Knowledge',
                skills: [
                    { name: 'Crestron / AMX / Extron', description: 'Strong familiarity with the control and video distribution product lines to specify appropriate hardware.' },
                    { name: 'Biamp / QSC', description: 'Knowledge of audio DSP product families and their capabilities for different applications.' },
                    { name: 'Poly / Cisco / Teams', description: 'Understanding of unified communications (UC) and video conferencing ecosystems.' },
                    { name: 'Shure / Sennheiser', description: 'Familiarity with professional microphone and wireless audio solutions.' },
                ]
            }
        ]
    }
];