// FIX: Corrected module import to remove file extension.
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
                 { name: 'AV system architecture understanding', description: 'Ability to grasp and articulate how different AV components work together to form a cohesive system.' },
                 { name: 'ROI calculation and cost-benefit analysis', description: 'Skill in demonstrating the financial value and return on investment of a proposed AV solution to a client.' },
                 { name: 'Solution design and specification', description: 'Translating client needs into a specific bill of materials and a high-level system design.' },
                 { name: 'Competitive analysis and positioning', description: 'Understanding the strengths and weaknesses of competitor products and solutions.' },
                 { name: 'Technical presentation skills', description: 'Clearly and confidently presenting complex technical solutions to both technical and non-technical audiences.' },
                 { name: 'Proof of concept development', description: 'Setting up and demonstrating a small-scale version of the proposed solution to prove its viability.' },
                 { name: 'Integration complexity assessment', description: 'Ability to identify potential challenges and risks in integrating a new AV system with existing infrastructure.' },
                 { name: 'Scalability planning', description: 'Designing solutions that can grow and adapt to the client\'s future needs.' }
             ]},
             { category: 'Sales Skills', skills: [
                 { name: 'Consultative selling methodology', description: 'Using a question-based approach to understand client needs deeply before proposing a solution.' },
                 { name: 'Discovery questioning techniques', description: 'Skill in asking effective questions to uncover a client\'s underlying problems and goals.' },
                 { name: 'Objection handling strategies', description: 'Effectively addressing and resolving client concerns or objections during the sales process.' },
                 { name: 'Proposal writing and presentation', description: 'Creating clear, persuasive proposals that articulate the value and scope of the proposed solution.' },
                 { name: 'Contract negotiation basics', description: 'Understanding the key elements of a sales contract and being able to negotiate terms effectively.' },
                 { name: 'CRM system proficiency (Salesforce, HubSpot)', description: 'Using Customer Relationship Management software to manage leads, opportunities, and client interactions.' },
                 { name: 'Lead qualification (BANT, MEDDIC)', description: 'Using established frameworks to determine if a potential client is a good fit and ready to buy.' },
                 { name: 'Sales process management', description: 'Effectively managing a sales opportunity through all stages, from initial contact to closing the deal.' }
             ]},
             { category: 'Industry Knowledge', skills: [
                 { name: 'Vertical market understanding (corporate, education, healthcare)', description: 'Knowledge of the specific needs, challenges, and terminology of different industries.' },
                 { name: 'Regulatory requirements by industry', description: 'Awareness of any specific regulations (e.g., HIPAA in healthcare) that might impact AV system design.' },
                 { name: 'Budget cycles and procurement processes', description: 'Understanding how and when different types of organizations allocate budgets and make purchasing decisions.' },
                 { name: 'Decision-making hierarchies', description: 'Ability to identify and engage with the key stakeholders and decision-makers in a client organization.' },
                 { name: 'Competitive landscape analysis', description: 'Staying informed about the offerings and strategies of competing AV integrators and manufacturers.' },
                 { name: 'Market trends and emerging technologies', description: 'Keeping up-to-date with the latest advancements in AV technology and how they can benefit clients.' }
             ]},
             { category: 'Required Experience', skills: [
                 { name: '3+ years in technical sales or AV industry', description: 'A proven track record in a role that combines technical knowledge with client-facing responsibilities.' },
                 { name: 'Demonstrated quota achievement', description: 'A history of meeting or exceeding sales targets and performance goals.' },
                 { name: 'Client relationship management experience', description: 'Experience in building and maintaining long-term, positive relationships with clients.' },
                 { name: 'Public speaking and presentation skills', description: 'Comfort and skill in presenting to groups, both in-person and virtually.' }
             ]},
             { category: 'Certifications', skills: [
                 { name: 'CTS or CTS-D preferred', description: 'AVIXA certifications that provide a strong, vendor-neutral technical foundation.' },
                 { name: 'Sales methodology training (Sandler, SPIN, Challenger)', description: 'Formal training in recognized sales methodologies, indicating a structured approach to selling.' },
                 { name: 'Manufacturer product certifications', description: 'Certifications that demonstrate deep knowledge of specific product lines.' }
             ]}
        ]
    },
    {
        name: 'Control Systems Programmer (Crestron)',
        category: 'Audio Visual & Media Technology',
        skillCategories: [
             { category: 'Core Programming Skills', skills: [
                 { name: 'Crestron SIMPL Windows programming', description: 'Core proficiency in Crestron\'s logic-based programming environment for control processors.' },
                 { name: 'Crestron SIMPL# Pro (C# .NET)', description: 'Advanced skill in using C#