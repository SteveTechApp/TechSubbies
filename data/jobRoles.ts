
import { JobRoleDefinition } from '../types';

// --- Comprehensive Skills & Knowledge Matrix for IT & AV Roles ---
export const JOB_ROLE_DEFINITIONS: JobRoleDefinition[] = [
    // --- Audio Visual & Media Technology ---
    {
        name: 'AV Systems Designer',
        category: 'Audio Visual & Media Technology',
        skillCategories: [
            { category: 'Technical Skills', skills: [
                { name: 'CAD software (AutoCAD, Visio, SketchUp)', description: 'Proficiency in creating and interpreting AV system drawings, layouts, and schematics using industry-standard CAD tools.' },
                { name: 'AV system design principles and signal flow', description: 'Deep understanding of how audio, video, and control signals are routed, processed, and managed within an AV system.' },
                { name: 'Audio acoustics and room modeling software (EASE, CATT-Acoustic)', description: 'Ability to model and predict the acoustic performance of a space to inform speaker placement and treatment.' },
                { name: 'Video display technologies (LCD, OLED, LED, projection)', description: 'Knowledge of the characteristics, limitations, and best-use cases for various display and projection technologies.' },
                { name: 'Control system design (Crestron, AMX, Extron)', description: 'Ability to design the logic and user interface for AV control systems to ensure intuitive operation.' },
                { name: 'Network infrastructure planning (switching, routing, VLANs)', description: 'Designing the underlying network to support AV-over-IP, control, and other system-related traffic.' },
                { name: 'Cable management and pathways design', description: 'Planning for efficient, scalable, and maintainable cable runs and physical infrastructure.' },
                { name: 'Power distribution and electrical requirements', description: 'Calculating power loads and specifying electrical needs to ensure system stability and safety.' },
                { name: 'System integration and interoperability', description: 'Ensuring all components from different manufacturers can communicate and work together seamlessly.' }
            ]},
            { category: 'Industry Knowledge', skills: [
                { name: 'Building codes and ADA compliance', description: 'Knowledge of relevant construction codes and accessibility standards that impact AV design.' },
                { name: 'Industry standards (InfoComm, AVIXA, SMPTE)', description: 'Familiarity with best practice standards for performance, installation, and safety in the AV industry.' },
                { name: 'Project management methodologies', description: 'Understanding of project lifecycles (e.g., Agile, Waterfall) to effectively collaborate with project teams.' },
                { name: 'Cost estimation and budgeting', description: 'Ability to create accurate project cost estimates, including hardware, labor, and contingency.' },
                { name: 'Client consultation and needs analysis', description: 'Skill in interviewing clients to understand their needs and translate them into technical requirements.' },
                { name: 'Vendor relationships and product specifications', description: 'Maintaining knowledge of current products and technologies from various manufacturers.' }
            ]},
            { category: 'Certifications', skills: [
                { name: 'CTS (Certified Technology Specialist)', description: 'General certification covering a broad range of AV knowledge, recognized globally.' },
                { name: 'CTS-D (Design)', description: 'A specialized CTS certification focused on the principles and practices of AV system design.' },
                { name: 'Manufacturer certifications (Crestron, AMX, etc.)', description: 'Certifications from major AV manufacturers demonstrating expertise in their specific product ecosystems.' },
                { name: 'AutoCAD certification', description: 'Official certification demonstrating proficiency in AutoCAD software.' }
            ]},
            { category: 'Experience Level', skills: [
                { name: '5+ years in AV design', description: 'Demonstrated history of successfully designing multiple AV systems.' },
                { name: 'Portfolio of completed projects', description: 'A collection of design documents, photos, or case studies from previous work.' },
                { name: 'Understanding of multiple vertical markets', description: 'Experience designing for different environments, such as corporate, education, healthcare, or entertainment.' }
            ]}
        ]
    },
    {
        name: 'AV Systems Engineer',
        category: 'Audio Visual & Media Technology',
        skillCategories: [
            { category: 'Technical Skills', skills: [
                { name: 'Signal processing and conversion', description: 'Expertise in manipulating and converting various audio and video signals (e.g., scaling, format conversion).' },
                { name: 'Digital and analog audio/video formats', description: 'In-depth knowledge of different signal types, connectors, and standards (e.g., HDMI, SDI, Dante, AES67).' },
                { name: 'Network protocols (TCP/IP, IGMP, PTP)', description: 'Understanding of networking protocols crucial for AV-over-IP systems and device control.' },
                { name: 'System commissioning and testing procedures', description: 'Systematic approach to testing and verifying that a system meets all design specifications.' },
                { name: 'Troubleshooting complex AV systems', description: 'Logical and efficient problem-solving skills to diagnose and resolve issues in integrated systems.' },
                { name: 'Programming control systems', description: 'Ability to write and debug code for control systems (e.g., Crestron, AMX) to implement the designed functionality.' },
                { name: 'Integration of IT and AV networks', description: 'Knowledge of how to safely and effectively merge AV systems with a client\'s existing IT infrastructure.' },
                { name: 'Cybersecurity for AV systems', description: 'Understanding of security best practices to protect networked AV devices from unauthorized access.' },
                { name: 'Performance optimization', description: 'Fine-tuning system settings to achieve the best possible audio and video quality.' }
            ]},
            { category: 'Software Proficiency', skills: [
                { name: 'System design software (D-Tools, XTEN-AV)', description: 'Ability to use specialized software for creating proposals, drawings, and managing project data.' },
                { name: 'Network analysis tools (Wireshark, ping, traceroute)', description: 'Using software tools to diagnose and troubleshoot network connectivity and performance issues.' },
                { name: 'Audio measurement software (Smaart, TEF)', description: 'Using tools to analyze room acoustics and calibrate audio systems for optimal performance.' },
                { name: 'Video test pattern generators', description: 'Using hardware or software to generate test patterns for calibrating and troubleshooting video displays.' },
                { name: 'Remote monitoring platforms', description: 'Experience with platforms that allow for remote monitoring and management of AV systems (e.g., Crestron XiO Cloud).' }
            ]},
            { category: 'Hardware Expertise', skills: [
                { name: 'Mixing consoles and DSP platforms', description: 'Hands-on experience with configuring and operating digital mixing consoles and audio digital signal processors (DSPs).' },
                { name: 'Video switchers and scalers', description: 'Knowledge of configuring and operating hardware for routing and processing video signals.' },
                { name: 'Display calibration equipment', description: 'Using colorimeters and other tools to professionally calibrate displays for accurate color reproduction.' },
                { name: 'Network switches and media converters', description: 'Experience with configuring network hardware specifically for AV-over-IP applications.' },
                { name: 'Test and measurement equipment', description: 'Proficiency with tools like multimeters, signal generators, and oscilloscopes for troubleshooting.' }
            ]},
            { category: 'Certifications', skills: [
                { name: 'CTS-I (Installation)', description: 'A specialized CTS certification focused on the best practices for installing and commissioning AV systems.' },
                { name: 'Network+ or CCNA', description: 'Industry-recognized IT networking certifications that demonstrate a strong foundation in networking principles.' },
                { name: 'Manufacturer technical certifications', description: 'Advanced certifications from manufacturers on the technical aspects of their products.' },
                { name: 'Safety certifications (OSHA 10/30)', description: 'Certifications related to job site safety, particularly relevant for installation work.' }
            ]}
        ]
    },
    {
        name: 'AV Sales Engineer',
        category: 'Audio Visual & Media Technology',
        skillCategories: [
             { category: 'Technical Skills', skills: [
                 { name: 'Product Demonstrations', description: 'Skillfully demonstrating AV hardware and software capabilities to potential clients.' },
                 { name: 'Needs Analysis', description: 'Conducting thorough needs analysis to understand client requirements and propose appropriate solutions.' },
                 { name: 'System Scoping', description: 'Defining the scope of a project, including hardware, software, and labor requirements.' },
                 { name: 'Proposal Writing', description: 'Creating detailed and persuasive technical proposals and statements of work (SOWs).' },
                 { name: 'Competitive Analysis', description: 'Understanding the competitive landscape and positioning products effectively.' }
             ]}
        ]
    }
];