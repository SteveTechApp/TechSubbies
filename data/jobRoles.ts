import { JobRoleDefinition } from '../types/index.ts';

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
                 { name: 'Crestron SIMPL# Pro (C# .NET)', description: 'Advanced skill in using C# to create custom libraries and complex logic for Crestron systems.' },
                 { name: 'VTPro-e touch panel design', description: 'Ability to design and build user interfaces for Crestron touch panels using the VTPro-e software.' },
                 { name: 'Crestron Studio (HTML5/CSS/JavaScript)', description: 'Experience with modern web technologies for creating custom, dynamic touch panel interfaces.' },
                 { name: 'Database integration (SQL, XML)', description: 'Ability to connect control systems with external databases for more advanced functionality.' },
                 { name: 'API integration and web services', description: 'Skill in integrating with third-party devices and services using REST, SOAP, and other web APIs.' },
                 { name: 'Version control systems (Git, SVN)', description: 'Using tools like Git to manage code changes, track versions, and collaborate with other programmers.' }
             ]},
             { category: 'Hardware Knowledge', skills: [
                 { name: 'Crestron control processors (3-Series, 4-Series)', description: 'Deep understanding of the capabilities and limitations of Crestron\'s core control hardware.' },
                 { name: 'Touch panels and keypads', description: 'Familiarity with the range of Crestron user interface hardware and their specific features.' },
                 { name: 'DM switching and distribution', description: 'Knowledge of Crestron\'s DigitalMedia product line for video signal routing and management.' },
                 { name: 'Audio DSP integration', description: 'Experience in controlling and integrating with audio digital signal processors from various manufacturers.' },
                 { name: 'Lighting control protocols (DMX, DALI)', description: 'Understanding how to integrate with and control standard lighting systems.' },
                 { name: 'Climate control integration', description: 'Experience with controlling HVAC systems through protocols like BACnet or direct integrations.' },
                 { name: 'Security system interfaces', description: 'Knowledge of how to interface with and control building security and access control systems.' }
             ]},
             { category: 'Network & IT Skills', skills: [
                 { name: 'TCP/IP networking fundamentals', description: 'A solid understanding of basic networking concepts like IP addresses, subnets, and ports.' },
                 { name: 'VLAN configuration and management', description: 'Knowledge of how to use Virtual LANs to segment and secure control system traffic.' },
                 { name: 'Network security protocols', description: 'Familiarity with protocols like SSH, SSL/TLS, and 802.1x to secure control system communications.' },
                 { name: 'Remote access and VPN', description: 'Ability to securely access and manage control systems remotely.' },
                 { name: 'Active Directory integration', description: 'Experience with integrating Crestron systems with Microsoft Active Directory for user authentication.' },
                 { name: 'Certificate management', description: 'Knowledge of how to install and manage security certificates on Crestron devices.' },
                 { name: 'Firewall configuration basics', description: 'Understanding of how to configure firewall rules to allow for proper control system communication.' }
             ]},
             { category: 'Certifications', skills: [
                 { name: 'Crestron Certified Programmer (CCP)', description: 'The foundational certification for professional Crestron programmers.' },
                 { name: 'Crestron Master Programmer (CMP)', description: 'An advanced, invite-only certification demonstrating the highest level of Crestron programming expertise.' },
                 { name: 'Network+ or equivalent', description: 'A certification that validates fundamental IT networking skills.' },
                 { name: 'Crestron product-specific certifications', description: 'Specialized certifications for specific Crestron technologies like DM NVX or Crestron Home.' }
             ]},
             { category: 'Experience Requirements', skills: [
                 { name: '2+ years Crestron programming experience', description: 'Demonstrated hands-on experience in developing and deploying Crestron control systems.' },
                 { name: 'Portfolio of completed control systems', description: 'A collection of code samples, UI designs, or project descriptions from previous work.' },
                 { name: 'Understanding of user interface design principles', description: 'Knowledge of how to create user interfaces that are intuitive, efficient, and easy to use.' },
                 { name: 'Experience with large-scale deployments', description: 'Experience in programming and managing control systems for large or complex environments.' }
             ]}
        ]
    },
    {
        name: 'Video Conferencing Engineer',
        category: 'Audio Visual & Media Technology',
        skillCategories: [
             { category: 'Video Conferencing Platforms', skills: [
                 { name: 'Microsoft Teams administration and deployment', description: 'Expertise in managing the Teams Admin Center, deploying Teams Rooms systems, and setting policies.' },
                 { name: 'Zoom infrastructure and management', description: 'Knowledge of managing a Zoom account, including Zoom Rooms, user policies, and reporting.' },
                 { name: 'Cisco Webex configuration', description: 'Experience with Cisco Control Hub, registering and managing Webex devices, and configuring meetings.' },
                 { name: 'Google Meet enterprise deployment', description: 'Familiarity with deploying and managing Google Meet hardware and settings in a corporate environment.' },
                 { name: 'BlueJeans platform management', description: 'Experience with the administrative side of the BlueJeans video conferencing platform.' },
                 { name: 'Pexip or Vidyo infrastructure', description: 'Knowledge of self-hosted or hybrid video conferencing infrastructure for interoperability.' }
             ]},
             { category: 'Network Requirements', skills: [
                 { name: 'QoS configuration and bandwidth management', description: 'Skill in prioritizing real-time video and audio traffic on a network to ensure high quality.' },
                 { name: 'Firewall port management for UC traffic', description: 'Understanding of the specific network ports and protocols that need to be opened for video conferencing.' },
                 { name: 'SIP trunk configuration and management', description: 'Experience with connecting video conferencing systems to traditional phone systems using SIP.' },
                 { name: 'STUN/TURN server deployment', description: 'Knowledge of technologies used to help video traffic traverse firewalls and NATs.' },
                 { name: 'Network latency and jitter optimization', description: 'Ability to diagnose and resolve network issues that can degrade call quality.' },
                 { name: 'Call quality monitoring and analytics', description: 'Using platform-specific tools to monitor call quality and troubleshoot issues proactively.' }
             ]},
             { category: 'Hardware Integration', skills: [
                 { name: 'Room system deployment (Cisco, Poly, Logitech)', description: 'Hands-on experience with installing, configuring, and updating dedicated video conferencing room hardware.' },
                 { name: 'Camera and microphone selection and positioning', description: 'Knowledge of how to choose the right peripherals for a room and place them for optimal performance.' },
                 { name: 'Audio echo cancellation and noise reduction', description: 'Understanding of how to configure and troubleshoot audio processing to ensure clear, echo-free audio.' },
                 { name: 'Display integration and content sharing', description: 'Ensuring that displays are properly configured and that content sharing works reliably.' },
                 { name: 'Lighting optimization for video quality', description: 'Ability to advise on or make adjustments to room lighting to improve camera performance.' },
                 { name: 'Room acoustics for audio quality', description: 'Understanding of basic acoustic principles to identify and mitigate issues like reverberation.' }
             ]},
             { category: 'UC Integration', skills: [
                 { name: 'Active Directory and SSO integration', description: 'Experience with connecting video conferencing platforms to corporate directories for single sign-on.' },
                 { name: 'Calendar system integration (Exchange, Google)', description: 'Configuring systems to allow for one-touch meeting joins from a room calendar.' },
                 { name: 'Phone system integration (PBX, SIP)', description: 'Connecting video conferencing systems with traditional telephony for audio dial-in/out.' },
                 { name: 'Contact center integration', description: 'Knowledge of how video can be integrated into a customer contact center environment.' },
                 { name: 'Mobile device management (MDM) integration', description: 'Managing video conferencing applications on corporate mobile devices.' },
                 { name: 'Recording and compliance solutions', description: 'Experience with systems for recording, archiving, and retrieving video meetings for compliance.' }
             ]},
             { category: 'Certifications', skills: [
                 { name: 'Microsoft Teams certification', description: 'Official certifications from Microsoft related to Teams administration or Teams Rooms.' },
                 { name: 'Cisco Collaboration certification', description: 'Certifications like CCNA Collaboration that validate skills in Cisco UC technologies.' },
                 { name: 'Zoom certified engineer', description: 'Official certifications from Zoom on their platform and room systems.' },
                 { name: 'CTS certification preferred', description: 'A general AV certification that provides a strong foundation.' },
                 { name: 'Network security certifications', description: 'Certifications like Security+ that demonstrate knowledge of securing networked devices.' }
             ]}
        ]
    },
    {
        name: 'Digital Signage Specialist',
        category: 'Audio Visual & Media Technology',
        skillCategories: [
             { category: 'Content Management Systems', skills: [
                 { name: 'BrightSign network management', description: 'Experience with BrightAuthor, BrightSign Network, and configuring BrightSign media players.' },
                 { name: 'Samsung MagicInfo platform', description: 'Proficiency with Samsung\'s proprietary CMS for their commercial displays.' },
                 { name: 'LG webOS signage platform', description: 'Knowledge of using LG\'s webOS-based platform for content deployment and management.' },
                 { name: 'Scala digital signage software', description: 'Experience with the Scala enterprise-level digital signage platform.' },
                 { name: 'Four Winds Interactive (FWI)', description: 'Familiarity with the FWI platform, often used in corporate and hospitality environments.' },
                 { name: 'Navori QL content management', description: 'Experience with the Navori QL digital signage software suite.' },
                 { name: 'Custom CMS development and integration', description: 'Ability to work with custom-built or integrated content management systems, often involving web technologies.' }
             ]},
             { category: 'Display Technologies', skills: [
                 { name: 'LED display specifications and installation', description: 'Understanding of pixel pitch, brightness, and the physical installation of direct-view LED video walls.' },
                 { name: 'LCD display calibration and maintenance', description: 'Skill in calibrating commercial LCD displays for color accuracy and performing routine maintenance.' },
                 { name: 'Projection mapping and edge blending', description: 'Using projectors to create seamless images on non-standard surfaces or across multiple projectors.' },
                 { name: 'Interactive display technologies (touch, gesture)', description: 'Experience with touchscreens, IR overlays, and other interactive hardware.' },
                 { name: 'Outdoor display considerations (brightness, weatherproofing)', description: 'Knowledge of the specific requirements for displays that will be exposed to the elements.' },
                 { name: 'Video wall processing and synchronization', description: 'Configuring video wall processors to correctly display content across multiple screens.' }
             ]},
             { category: 'Network & Streaming', skills: [
                 { name: 'Content delivery network (CDN) configuration', description: 'Understanding how to use CDNs to efficiently distribute content to a large number of displays.' },
                 { name: 'Streaming protocols (RTMP, HLS, WebRTC)', description: 'Knowledge of different protocols for streaming live video to digital signage players.' },
                 { name: 'Bandwidth calculation and optimization', description: 'Ability to calculate the network bandwidth required for a signage deployment and optimize content accordingly.' },
                 { name: 'Remote monitoring and management', description: 'Using software to remotely monitor the health and status of a fleet of media players.' },
                 { name: 'Security protocols for digital signage networks', description: 'Implementing security measures to protect the signage network from being compromised.' },
                 { name: 'Cloud vs. on-premise deployment strategies', description: 'Understanding the pros and cons of hosting the CMS in the cloud versus on a local server.' }
             ]},
             { category: 'Creative & Technical Skills', skills: [
                 { name: 'Video encoding and compression standards', description: 'Knowledge of codecs (like H.264, H.265) and how to encode video for efficient playback on media players.' },
                 { name: 'Graphic design software proficiency', description: 'Basic to intermediate skills in tools like Adobe Photoshop or Illustrator for content creation and modification.' },
                 { name: 'Animation and motion graphics creation', description: 'Ability to create simple animations or motion graphics using tools like Adobe After Effects.' },
                 { name: 'Content scheduling and playlist management', description: 'Skill in using the CMS to schedule content to play at specific times and in specific sequences.' },
                 { name: 'Interactive content development', description: 'Experience with creating content for touchscreens, often using HTML5 or specialized software.' },
                 { name: 'Data integration for dynamic content', description: 'Ability to connect digital signage to data sources (like weather, news, or databases) to display real-time information.' }
             ]},
             { category: 'Certifications', skills: [
                 { name: 'Digital signage manufacturer certifications', description: 'Official certifications from CMS providers like BrightSign, Scala, or others.' },
                 { name: 'Adobe Creative Suite certifications', description: 'Certifications that validate skills in Adobe\'s creative tools, useful for content creation.' },
                 { name: 'Network+ or equivalent', description: 'A certification that demonstrates a solid understanding of IT networking, crucial for deployment.' },
                 { name: 'Project management certification (PMP)', description: 'Useful for specialists who also manage the deployment and rollout of large signage projects.' }
             ]}
        ]
    },

    // --- Software Development ---
    {
        name: 'Full Stack Developer',
        category: 'Software Development',
        skillCategories: [
            { category: 'Frontend Technologies', skills: [
                { name: 'HTML5, CSS3, JavaScript (ES6+)', description: 'Core proficiency in the fundamental languages of the web.' },
                { name: 'React.js, Angular, or Vue.js', description: 'Expertise in at least one major modern JavaScript framework for building user interfaces.' },
                { name: 'TypeScript for type safety', description: 'Ability to use TypeScript to write more robust and maintainable code.' },
                { name: 'Responsive design and CSS frameworks (Bootstrap, Tailwind)', description: 'Skill in creating web pages that work well on all devices, often using frameworks.' },
                { name: 'State management (Redux, Vuex, NgRx)', description: 'Knowledge of state management libraries for handling complex application data.' },
                { name: 'Build tools (Webpack, Vite, Parcel)', description: 'Experience with tools that bundle and optimize code for production.' },
                { name: 'Testing frameworks (Jest, Cypress, Playwright)', description: 'Ability to write and run automated tests to ensure code quality.' }
            ]},
            { category: 'Backend Technologies', skills: [
                { name: 'Server-side languages (Node.js, Python, Java, C#, PHP)', description: 'Proficiency in at least one language for writing server-side logic.' },
                { name: 'RESTful API design and GraphQL', description: 'Skill in designing and building APIs to allow communication between the frontend and backend.' },
                { name: 'Database design and optimization (SQL and NoSQL)', description: 'Knowledge of how to design, manage, and optimize databases like PostgreSQL, MongoDB, etc.' },
                { name: 'Authentication and authorization (JWT, OAuth, SAML)', description: 'Implementing secure systems for user login and permissions.' },
                { name: 'Caching strategies (Redis, Memcached)', description: 'Using caching to improve the performance and scalability of the application.' },
                { name: 'Message queues (RabbitMQ, Apache Kafka)', description: 'Experience with systems for handling asynchronous communication between different parts of an application.' },
                { name: 'Microservices architecture', description: 'Understanding of how to build applications as a collection of smaller, independent services.' }
            ]},
            { category: 'DevOps & Deployment', skills: [
                { name: 'Version control (Git, GitHub, GitLab)', description: 'Essential skill for managing code changes and collaborating with a team.' },
                { name: 'CI/CD pipeline configuration', description: 'Automating the process of building, testing, and deploying code changes.' },
                { name: 'Docker containerization', description: 'Using Docker to package applications and their dependencies into portable containers.' },
                { name: 'Cloud platform deployment (AWS, Azure, GCP)', description: 'Experience with deploying and managing applications on major cloud providers.' },
                { name: 'Infrastructure as Code (Terraform, CloudFormation)', description: 'Managing and provisioning infrastructure using code.' },
                { name: 'Monitoring and logging tools', description: 'Using tools to monitor application performance and troubleshoot issues.' },
                { name: 'Performance optimization and scaling', description: 'Ability to identify and fix performance bottlenecks and scale the application to handle more users.' }
            ]},
            { category: 'Database Skills', skills: [
                { name: 'SQL databases (PostgreSQL, MySQL, SQL Server)', description: 'Proficiency in working with relational databases.' },
                { name: 'NoSQL databases (MongoDB, Cassandra, DynamoDB)', description: 'Experience with non-relational databases for specific use cases.' },
                { name: 'Database design and normalization', description: 'Knowledge of how to structure a database efficiently and reduce data redundancy.' },
                { name: 'Query optimization and indexing', description: 'Skill in writing efficient database queries and using indexes to speed them up.' },
                { name: 'Data migration and ETL processes', description: 'Experience with moving data between different systems.' },
                { name: 'Backup and disaster recovery strategies', description: 'Understanding how to back up data and restore it in case of failure.' }
            ]},
            { category: 'Required Experience', skills: [
                { name: '3+ years full-stack development', description: 'Demonstrated professional experience working on both frontend and backend systems.' },
                { name: 'Portfolio of complete applications', description: 'A collection of projects (e.g., on GitHub) that showcase your skills.' },
                { name: 'Experience with agile development methodologies', description: 'Familiarity with working in an agile environment (e.g., Scrum, Kanban).' },
                { name: 'Understanding of software architecture patterns', description: 'Knowledge of common patterns for structuring software applications (e.g., MVC, Microservices).' }
            ]}
        ]
    },
    {
        name: 'DevOps Engineer',
        category: 'Software Development',
        skillCategories: [
            { category: 'Infrastructure Automation', skills: [
                { name: 'Infrastructure as Code (Terraform, CloudFormation, Pulumi)', description: 'Managing and provisioning infrastructure through code for consistency and repeatability.' },
                { name: 'Configuration management (Ansible, Puppet, Chef)', description: 'Automating the configuration of servers and software.' },
                { name: 'Container orchestration (Kubernetes, Docker Swarm)', description: 'Deploying, managing, and scaling containerized applications.' },
                { name: 'Service mesh technologies (Istio, Linkerd)', description: 'Managing communication between microservices to improve reliability and observability.' },
                { name: 'GitOps practices and tools (ArgoCD, Flux)', description: 'Using Git as the single source of truth for declarative infrastructure and applications.' }
            ]},
            { category: 'Cloud Platforms', skills: [
                { name: 'AWS services (EC2, RDS, Lambda, S3, CloudFront)', description: 'Deep knowledge of core Amazon Web Services for building and deploying applications.' },
                { name: 'Azure services (VMs, SQL Database, Functions, Blob Storage)', description: 'Proficiency with Microsoft Azure\'s core infrastructure and platform services.' },
                { name: 'Google Cloud Platform (Compute Engine, Cloud SQL, Functions)', description: 'Experience with Google Cloud\'s key services for application deployment.' },
                { name: 'Multi-cloud and hybrid cloud strategies', description: 'Understanding of how to build and manage infrastructure that spans multiple cloud providers or on-premise data centers.' },
                { name: 'Cloud cost optimization and governance', description: 'Using tools and strategies to manage and reduce cloud spending.' }
            ]},
            { category: 'CI/CD & Automation', skills: [
                { name: 'Pipeline tools (Jenkins, GitLab CI, GitHub Actions, Azure DevOps)', description: 'Building and managing automated pipelines for continuous integration and continuous delivery.' },
                { name: 'Build automation and artifact management', description: 'Managing the process of compiling code and storing the resulting artifacts (e.g., Docker images, JAR files).' },
                { name: 'Automated testing integration', description: 'Incorporating various types of automated tests into the CI/CD pipeline.' },
                { name: 'Blue-green and canary deployment strategies', description: 'Implementing advanced deployment strategies to reduce risk and downtime.' },
                { name: 'Feature flags and progressive delivery', description: 'Using feature flags to control the release of new features to users.' },
                { name: 'Release management and rollback procedures', description: 'Managing the release process and having a plan to quickly roll back changes if something goes wrong.' }
            ]},
            { category: 'Monitoring & Observability', skills: [
                { name: 'Application Performance Monitoring (APM) tools', description: 'Using tools like DataDog or New Relic to monitor the performance of applications.' },
                { name: 'Log aggregation (ELK Stack, Splunk, Fluentd)', description: 'Collecting and analyzing logs from all parts of the system in a centralized place.' },
                { name: 'Metrics collection (Prometheus, Grafana, DataDog)', description: 'Collecting and visualizing time-series data to understand system behavior.' },
                { name: 'Distributed tracing (Jaeger, Zipkin)', description: 'Tracing requests as they travel through a distributed system to identify bottlenecks.' },
                { name: 'Alerting and incident response automation', description: 'Setting up automated alerts for system issues and integrating with incident response tools.' },
                { name: 'SLA/SLO monitoring and reporting', description: 'Defining and monitoring service level agreements and objectives.' }
            ]},
            { category: 'Security & Compliance', skills: [
                { name: 'Security scanning and vulnerability management', description: 'Integrating security scanning tools into the CI/CD pipeline to find vulnerabilities early.' },
                { name: 'Secret management (HashiCorp Vault, AWS Secrets Manager)', description: 'Securely storing and managing secrets like API keys and passwords.' },
                { name: 'Network security and firewall management', description: 'Configuring firewalls, security groups, and other network security controls.' },
                { name: 'Compliance automation (SOX, HIPAA, PCI DSS)', description: 'Automating the process of meeting and documenting compliance requirements.' },
                { name: 'Identity and access management integration', description: 'Managing user access to infrastructure and applications.' },
                { name: 'Security incident response procedures', description: 'Having a plan and the tools to respond to security incidents.' }
            ]},
            { category: 'Certifications', skills: [
                { name: 'AWS Certified Solutions Architect', description: 'A popular AWS certification covering the design of distributed systems.' },
                { name: 'Azure DevOps Engineer Expert', description: 'Microsoft\'s expert-level certification for DevOps on Azure.' },
                { name: 'Google Cloud Professional DevOps Engineer', description: 'Google\'s professional-level certification for DevOps on GCP.' },
                { name: 'Kubernetes certifications (CKA, CKAD, CKS)', description: 'Certifications from the CNCF that validate Kubernetes skills.' },
                { name: 'Docker Certified Associate', description: 'A certification that validates fundamental Docker skills.' }
            ]}
        ]
    },

    // --- Networking & Infrastructure ---
    {
        name: 'Network Engineer',
        category: 'Networking & Infrastructure',
        skillCategories: [
            { category: 'Core Networking', skills: [
                { name: 'OSI model and TCP/IP stack', description: 'A fundamental understanding of the layers of networking.' },
                { name: 'Routing protocols (OSPF, EIGRP, BGP)', description: 'Configuring and troubleshooting protocols that determine how data travels between networks.' },
                { name: 'Switching technologies (VLANs, STP, LACP)', description: 'Configuring and managing the local area network (LAN).' },
                { name: 'Network Address Translation (NAT/PAT)', description: 'Understanding and configuring how private IP addresses are translated to public IP addresses.' },
                { name: 'Quality of Service (QoS) implementation', description: 'Prioritizing critical network traffic (like voice and video) to ensure performance.' },
                { name: 'Network security protocols (IPSec, SSL/TLS)', description: 'Implementing protocols to secure data in transit.' }
            ]},
            { category: 'Hardware Proficiency', skills: [
                { name: 'Cisco router and switch configuration (IOS/IOS-XE)', description: 'Hands-on experience with the command-line interface of Cisco networking equipment.' },
                { name: 'Juniper Networks equipment (Junos)', description: 'Experience with the Junos operating system for Juniper routers and switches.' },
                { name: 'Aruba/HP networking solutions', description: 'Familiarity with networking hardware from Aruba and HP.' },
                { name: 'Fortinet security appliances', description: 'Experience with configuring FortiGate firewalls and other security products.' },
                { name: 'Palo Alto Networks firewalls', description: 'Knowledge of configuring and managing Palo Alto firewalls.' },
                { name: 'F5 load balancers and application delivery controllers', description: 'Experience with distributing traffic across multiple servers for performance and reliability.' }
            ]},
            { category: 'Network Services', skills: [
                { name: 'DNS configuration and management', description: 'Managing the Domain Name System, which translates domain names to IP addresses.' },
                { name: 'DHCP server deployment and management', description: 'Setting up and managing servers that automatically assign IP addresses to devices.' },
                { name: 'Network Time Protocol (NTP) implementation', description: 'Ensuring that all network devices have synchronized time.' },
                { name: 'SNMP monitoring and management', description: 'Using the Simple Network Management Protocol to monitor the health of network devices.' },
                { name: 'RADIUS/TACACS+ authentication services', description: 'Implementing centralized authentication for network devices.' },
                { name: 'Network access control (NAC) solutions', description: 'Implementing systems that control which devices can connect to the network.' }
            ]},
            { category: 'Wireless Networking', skills: [
                { name: 'Wi-Fi standards (802.11a/b/g/n/ac/ax)', description: 'Understanding the different Wi-Fi standards and their capabilities.' },
                { name: 'Wireless controller configuration', description: 'Managing a fleet of wireless access points from a central controller.' },
                { name: 'Site survey and RF planning', description: 'Planning the placement of access points for optimal coverage and performance.' },
                { name: 'Wireless security protocols (WPA2/WPA3, 802.1X)', description: 'Implementing security measures to protect the wireless network.' },
                { name: 'Guest network isolation and management', description: 'Providing secure Wi-Fi access for guests without giving them access to the internal network.' },
                { name: 'Wireless intrusion detection and prevention', description: 'Detecting and blocking unauthorized wireless devices.' }
            ]},
            { category: 'Network Monitoring & Troubleshooting', skills: [
                { name: 'Protocol analyzers (Wireshark, tcpdump)', description: 'Using tools to capture and analyze network traffic to troubleshoot issues.' },
                { name: 'Network monitoring tools (SolarWinds, PRTG, LibreNMS)', description: 'Using software to monitor the health and performance of the network.' },
                { name: 'Performance testing tools (iPerf, IXIA)', description: 'Using tools to measure network performance and identify bottlenecks.' },
                { name: 'Cable testing and certification', description: 'Using hardware tools to test and certify network cabling.' },
                { name: 'Optical power meters and OTDRs', description: 'Using specialized tools for troubleshooting fiber optic connections.' },
                { name: 'Network documentation and diagramming', description: 'Creating and maintaining accurate diagrams and documentation of the network.' }
            ]},
            { category: 'Certifications', skills: [
                { name: 'CCNA (Cisco Certified Network Associate)', description: 'A foundational certification for Cisco networking.' },
                { name: 'CCNP (Cisco Certified Network Professional)', description: 'A professional-level certification covering advanced routing, switching, and troubleshooting.' },
                { name: 'CCIE (Cisco Certified Internetwork Expert)', description: 'Cisco\'s expert-level certification, one of the most respected in the industry.' },
                { name: 'CompTIA Network+', description: 'A vendor-neutral certification covering networking fundamentals.' },
                { name: 'Juniper JNCIA/JNCIS', description: 'Associate and specialist level certifications for Juniper networking equipment.' },
                { name: 'Vendor-specific certifications', description: 'Certifications from other networking vendors like Aruba, Palo Alto, or Fortinet.' }
            ]}
        ]
    },
    {
        name: 'Cloud Architect',
        category: 'Networking & Infrastructure',
        skillCategories: [
            { category: 'Cloud Platform Expertise', skills: [
                { name: 'AWS architecture and services deep dive', description: 'Expert-level knowledge of AWS services and how to combine them to build solutions.' },
                { name: 'Azure architecture patterns and best practices', description: 'Deep understanding of Microsoft Azure services and design patterns.' },
                { name: 'Google Cloud Platform design principles', description: 'Proficiency in designing solutions on GCP using their core services.' },
                { name: 'Multi-cloud and hybrid cloud strategies', description: 'Designing solutions that span multiple cloud providers or integrate with on-premise data centers.' },
                { name: 'Cloud migration planning and execution', description: 'Planning and executing the migration of applications and data from on-premise to the cloud.' },
                { name: 'Cost optimization and resource governance', description: 'Designing for cost-effectiveness and implementing policies to control cloud spending.' }
            ]},
            { category: 'Architecture Patterns', skills: [
                { name: 'Microservices architecture design', description: 'Designing applications as a set of small, independent services.' },
                { name: 'Serverless computing patterns', description: 'Using services like AWS Lambda or Azure Functions to build event-driven applications without managing servers.' },
                { name: 'Event-driven architecture', description: 'Designing systems that communicate through asynchronous events.' },
                { name: 'Container orchestration strategies', description: 'Designing the architecture for running containerized applications at scale using Kubernetes or similar.' },
                { name: 'API gateway and service mesh implementation', description: 'Designing how APIs are exposed and how microservices communicate.' },
                { name: 'Disaster recovery and business continuity planning', description: 'Designing for high availability and creating a plan to recover from failures.' }
            ]},
            { category: 'Security & Compliance', skills: [
                { name: 'Cloud security frameworks (NIST, ISO 27001)', description: 'Applying industry-standard security frameworks to cloud environments.' },
                { name: 'Identity and access management (IAM)', description: 'Designing and implementing a secure system for managing user access to cloud resources.' },
                { name: 'Network security in cloud environments', description: 'Designing secure network architectures in the cloud using VPCs, security groups, etc.' },
                { name: 'Data encryption and key management', description: 'Designing a strategy for encrypting data at rest and in transit, and managing the encryption keys.' },
                { name: 'Compliance automation and auditing', description: 'Designing systems that automatically enforce and audit compliance with regulations.' },
                { name: 'Security incident response in the cloud', description: 'Planning how to respond to security incidents in a cloud environment.' }
            ]},
            { category: 'DevOps Integration', skills: [
                { name: 'Infrastructure as Code implementation', description: 'Leading the adoption of tools like Terraform to manage infrastructure as code.' },
                { name: 'CI/CD pipeline design for cloud deployments', description: 'Designing the automated pipelines for building, testing, and deploying applications to the cloud.' },
                { name: 'Container orchestration (Kubernetes, ECS, AKS)', description: 'Architecting the platform for running containers in a specific cloud environment.' },
                { name: 'Monitoring and observability strategies', description: 'Designing a comprehensive strategy for monitoring the health and performance of the entire system.' },
                { name: 'Automated scaling and performance optimization', description: 'Designing systems that can automatically scale to meet demand and perform efficiently.' },
                { name: 'GitOps and continuous delivery practices', description: 'Architecting a deployment system based on GitOps principles.' }
            ]},
            { category: 'Business & Strategy', skills: [
                { name: 'Cloud ROI analysis and business case development', description: 'Working with business stakeholders to understand the financial implications of cloud adoption.' },
                { name: 'Technology roadmap planning', description: 'Helping to plan the long-term technology strategy for the organization.' },
                { name: 'Vendor evaluation and selection', description: 'Evaluating and selecting cloud services and third-party tools.' },
                { name: 'Risk assessment and mitigation strategies', description: 'Identifying and planning for potential risks in a cloud architecture.' },
                { name: 'Team training and capability development', description: 'Helping to upskill the team on cloud technologies.' },
                { name: 'Executive reporting and communication', description: 'Communicating complex technical concepts to business leaders.' }
            ]},
            { category: 'Required Certifications', skills: [
                { name: 'AWS Solutions Architect Professional', description: 'AWS\'s top-tier certification for cloud architects.' },
                { name: 'Azure Solutions Architect Expert', description: 'Microsoft\'s expert-level certification for Azure architects.' },
                { name: 'Google Cloud Professional Cloud Architect', description: 'Google\'s professional-level certification for cloud architects.' },
                { name: 'Cloud security certifications (CCSP, AWS Security)', description: 'Certifications focused on cloud security.' },
                { name: 'Enterprise architecture certifications (TOGAF)', description: 'Certifications in broader enterprise architecture frameworks.' }
            ]}
        ]
    },
    
    // --- Cybersecurity ---
    {
        name: 'Information Security Engineer',
        category: 'Cybersecurity',
        skillCategories: [
            { category: 'Security Fundamentals', skills: [
                { name: 'Risk assessment and management frameworks', description: 'Applying frameworks like NIST to identify, assess, and mitigate security risks.' },
                { name: 'Security controls implementation (NIST, ISO 27001)', description: 'Implementing technical and procedural controls to protect information systems.' },
                { name: 'Threat modeling and attack surface analysis', description: 'Proactively identifying potential threats and vulnerabilities in a system.' },
                { name: 'Vulnerability assessment and penetration testing', description: 'Actively searching for and exploiting vulnerabilities to test security.' },
                { name: 'Incident response and forensics procedures', description: 'Following a structured process to respond to security incidents and investigate them.' },
                { name: 'Business continuity and disaster recovery planning', description: 'Contributing to plans that ensure the organization can continue to operate during and after a disaster.' }
            ]},
            { category: 'Network Security', skills: [
                { name: 'Firewall configuration and management', description: 'Implementing and managing firewalls to control network traffic.' },
                { name: 'Intrusion Detection/Prevention Systems (IDS/IPS)', description: 'Deploying systems that monitor network traffic for malicious activity.' },
                { name: 'VPN deployment and management', description: 'Setting up and managing secure remote access for users.' },
                { name: 'Network segmentation and microsegmentation', description: 'Dividing the network into smaller zones to contain security breaches.' },
                { name: 'DNS security and filtering', description: 'Implementing measures to protect against DNS-based attacks and block access to malicious sites.' },
                { name: 'Network access control (NAC) implementation', description: 'Implementing systems that enforce security policies on devices connecting to the network.' }
            ]},
            { category: 'Endpoint Security', skills: [
                { name: 'Antivirus/anti-malware deployment and management', description: 'Managing software that protects computers and servers from malware.' },
                { name: 'Endpoint Detection and Response (EDR) solutions', description: 'Using advanced tools to detect and respond to threats on endpoints.' },
                { name: 'Mobile Device Management (MDM) and security', description: 'Securing mobile phones and tablets that access corporate data.' },
                { name: 'Data Loss Prevention (DLP) implementation', description: 'Implementing systems that prevent sensitive data from leaving the organization.' },
                { name: 'Privileged Access Management (PAM) systems', description: 'Controlling and monitoring access for privileged users (like administrators).' },
                { name: 'Application whitelisting and control', description: 'Allowing only approved applications to run on endpoints.' }
            ]},
            { category: 'Cloud Security', skills: [
                { name: 'Cloud Security Posture Management (CSPM)', description: 'Using tools to identify and remediate misconfigurations in cloud environments.' },
                { name: 'Container and serverless security', description: 'Securing applications that are built using containers and serverless technologies.' },
                { name: 'Cloud identity and access management', description: 'Managing user access to cloud resources in a secure way.' },
                { name: 'Data classification and protection in the cloud', description: 'Classifying data and applying appropriate security controls in a cloud environment.' },
                { name: 'Cloud compliance and governance', description: 'Ensuring that the cloud environment meets regulatory and corporate compliance requirements.' },
                { name: 'Multi-cloud security strategies', description: 'Implementing a consistent security strategy across multiple cloud providers.' }
            ]},
            { category: 'Security Tools & Technologies', skills: [
                { name: 'SIEM platforms (Splunk, IBM QRadar, ArcSight)', description: 'Using Security Information and Event Management platforms to collect and analyze security data.' },
                { name: 'Vulnerability scanners (Nessus, Qualys, Rapid7)', description: 'Using tools to scan for and identify vulnerabilities in systems.' },
                { name: 'Penetration testing tools (Metasploit, Burp Suite, Nmap)', description: 'Using a variety of tools to simulate attacks and test security.' },
                { name: 'Forensics tools (EnCase, FTK, Volatility)', description: 'Using specialized tools to investigate security incidents.' },
                { name: 'Threat intelligence platforms', description: 'Using platforms that provide information about current and emerging threats.' },
                { name: 'Security orchestration and automated response (SOAR)', description: 'Using tools to automate the response to security incidents.' }
            ]},
            { category: 'Certifications', skills: [
                { name: 'CISSP (Certified Information Systems Security Professional)', description: 'A globally recognized certification covering a broad range of security topics.' },
                { name: 'CISM (Certified Information Security Manager)', description: 'A certification focused on the management of information security.' },
                { name: 'CEH (Certified Ethical Hacker)', description: 'A certification focused on penetration testing and ethical hacking.' },
                { name: 'GCIH (GIAC Certified Incident Handler)', description: 'A certification focused on incident response.' },
                { name: 'Cloud security certifications (CCSP, AWS Security)', description: 'Certifications focused on securing cloud environments.' },
                { name: 'Vendor-specific certifications (Cisco, Palo Alto, Fortinet)', description: 'Certifications for specific security products.' }
            ]}
        ]
    },

    // --- Database Administration ---
    {
        name: 'Database Administrator (DBA)',
        category: 'Database Administration',
        skillCategories: [
            { category: 'Database Platforms', skills: [
                { name: 'Microsoft SQL Server administration and optimization', description: 'Managing and tuning SQL Server databases.' },
                { name: 'Oracle Database management and tuning', description: 'Experience with Oracle databases.' },
                { name: 'MySQL/MariaDB deployment and maintenance', description: 'Managing open-source relational databases.' },
                { name: 'PostgreSQL administration and performance tuning', description: 'Experience with the advanced open-source database PostgreSQL.' },
                { name: 'MongoDB and NoSQL database management', description: 'Managing non-relational databases like MongoDB.' },
                { name: 'Cloud database services (RDS, Azure SQL, Cloud SQL)', description: 'Using managed database services from cloud providers.' }
            ]},
            { category: 'Performance Optimization', skills: [
                { name: 'Query optimization and execution plan analysis', description: 'Analyzing and rewriting queries to improve performance.' },
                { name: 'Index design and maintenance strategies', description: 'Creating and managing indexes to speed up data retrieval.' },
                { name: 'Database partitioning and sharding', description: 'Splitting large tables or databases into smaller, more manageable pieces.' },
                { name: 'Memory and storage optimization', description: 'Configuring the database to make efficient use of memory and storage.' },
                { name: 'Connection pooling and resource management', description: 'Managing database connections to improve performance and scalability.' },
                { name: 'Database monitoring and alerting', description: 'Using tools to monitor database performance and get alerted to issues.' }
            ]},
            { category: 'Backup & Recovery', skills: [
                { name: 'Backup strategy design and implementation', description: 'Designing and implementing a reliable backup plan.' },
                { name: 'Point-in-time recovery procedures', description: 'Being able to restore a database to a specific point in time.' },
                { name: 'High availability and clustering solutions', description: 'Setting up systems that ensure the database is always available.' },
                { name: 'Disaster recovery planning and testing', description: 'Creating and testing a plan to recover the database after a major disaster.' },
                { name: 'Database replication and synchronization', description: 'Setting up and managing copies of the database for redundancy or read scaling.' },
                { name: 'Data archiving and retention policies', description: 'Managing the process of archiving old data and enforcing data retention policies.' }
            ]},
            { category: 'Security & Compliance', skills: [
                { name: 'Database access control and user management', description: 'Managing who can access the database and what they can do.' },
                { name: 'Data encryption at rest and in transit', description: 'Encrypting data to protect it from unauthorized access.' },
                { name: 'Audit trail configuration and monitoring', description: 'Tracking who did what in the database and when.' },
                { name: 'Compliance with regulations (GDPR, HIPAA, SOX)', description: 'Ensuring the database meets the requirements of relevant regulations.' },
                { name: 'Data masking and anonymization techniques', description: 'Hiding sensitive data in non-production environments.' },
                { name: 'Privilege management and separation of duties', description: 'Enforcing the principle of least privilege for database users.' }
            ]},
            { category: 'Database Development', skills: [
                { name: 'Stored procedure and function development', description: 'Writing code that runs inside the database.' },
                { name: 'Database schema design and normalization', description: 'Designing the structure of the database.' },
                { name: 'Data modeling and entity relationship diagrams', description: 'Creating diagrams that represent the structure of the database.' },
                { name: 'ETL process design and implementation', description: 'Designing processes to extract, transform, and load data.' },
                { name: 'Data warehouse and OLAP cube design', description: 'Designing databases for business intelligence and analytics.' },
                { name: 'Database version control and change management', description: 'Managing changes to the database schema in a controlled way.' }
            ]},
            { category: 'Certifications', skills: [
                { name: 'Microsoft Certified: Azure Database Administrator', description: 'Microsoft\'s certification for DBAs on Azure.' },
                { name: 'Oracle Certified Professional (OCP)', description: 'A professional-level certification for Oracle DBAs.' },
                { name: 'MySQL Database Administrator Certification', description: 'Oracle\'s certification for MySQL DBAs.' },
                { name: 'MongoDB Certified DBA', description: 'A certification for MongoDB database administrators.' },
                { name: 'AWS Certified Database Specialty', description: 'AWS\'s specialty certification for databases.' },
                { name: 'Google Cloud Professional Data Engineer', description: 'A Google certification that covers database management among other topics.' }
            ]}
        ]
    },

    // --- Project Management & Leadership ---
    {
        name: 'IT Project Manager',
        category: 'Project Management & Leadership',
        skillCategories: [
            { category: 'Project Management Methodologies', skills: [
                { name: 'Project Management Professional (PMP) methodologies', description: 'Applying the principles of the PMBOK guide to manage projects.' },
                { name: 'Agile/Scrum framework implementation', description: 'Managing projects using an iterative, adaptive approach.' },
                { name: 'Lean project management principles', description: 'Focusing on delivering value and eliminating waste in the project process.' },
                { name: 'PRINCE2 methodology application', description: 'Using the PRojects IN Controlled Environments methodology.' },
                { name: 'Waterfall project lifecycle management', description: 'Managing projects in a sequential, linear fashion.' },
                { name: 'Hybrid project management approaches', description: 'Combining different methodologies to fit the needs of the project.' }
            ]},
            { category: 'Technical Understanding', skills: [
                { name: 'Software development lifecycle (SDLC)', description: 'Understanding the stages of software development, from planning to deployment.' },
                { name: 'Infrastructure deployment processes', description: 'Familiarity with the process of deploying new IT infrastructure.' },
                { name: 'Cloud migration project planning', description: 'Understanding the steps involved in migrating applications to the cloud.' },
                { name: 'System integration complexity assessment', description: 'Ability to understand and plan for the challenges of integrating different systems.' },
                { name: 'Technology risk assessment and mitigation', description: 'Identifying and planning for potential technical risks.' },
                { name: 'Vendor management and procurement processes', description: 'Managing relationships with technology vendors and the process of procuring hardware and software.' }
            ]},
            { category: 'Leadership & Communication', skills: [
                { name: 'Stakeholder management and engagement', description: 'Communicating with and managing the expectations of everyone involved in the project.' },
                { name: 'Executive reporting and communication', description: 'Providing clear and concise updates to senior leadership.' },
                { name: 'Team leadership and conflict resolution', description: 'Leading the project team and resolving any conflicts that arise.' },
                { name: 'Change management and organizational adoption', description: 'Managing the human side of a technology change to ensure it is adopted successfully.' },
                { name: 'Budget management and cost control', description: 'Managing the project budget and controlling costs.' },
                { name: 'Resource allocation and capacity planning', description: 'Assigning people to tasks and ensuring the team has the capacity to complete the work.' }
            ]},
            { category: 'Tools & Software', skills: [
                { name: 'Project management software (Microsoft Project, Smartsheet, Asana)', description: 'Using software to plan, execute, and track projects.' },
                { name: 'Collaboration tools (Confluence, SharePoint, Teams)', description: 'Using tools to facilitate communication and collaboration within the project team.' },
                { name: 'Reporting and analytics tools', description: 'Using tools to create reports and dashboards to track project progress.' },
                { name: 'Risk management software', description: 'Using software to identify, assess, and manage project risks.' },
                { name: 'Time tracking and resource management tools', description: 'Using tools to track time spent on tasks and manage resource allocation.' },
                { name: 'Financial management and budgeting tools', description: 'Using tools to manage the project budget.' }
            ]},
            { category: 'Industry Knowledge', skills: [
                { name: 'IT governance frameworks (ITIL, COBIT)', description: 'Understanding frameworks that provide best practices for managing IT.' },
                { name: 'Regulatory compliance requirements', description: 'Awareness of regulations that may impact the project (e.g., GDPR, SOX).' },
                { name: 'Technology trends and emerging solutions', description: 'Staying up-to-date with the latest trends in technology.' },
                { name: 'Vendor ecosystem and partnership models', description: 'Understanding the landscape of technology vendors.' },
                { name: 'IT service management principles', description: 'Applying the principles of ITSM to deliver high-quality IT services.' },
                { name: 'Digital transformation strategies', description: 'Understanding how technology can be used to transform an organization.' }
            ]},
            { category: 'Required Certifications', skills: [
                { name: 'Project Management Professional (PMP)', description: 'A globally recognized certification for project managers.' },
                { name: 'Certified ScrumMaster (CSM) or equivalent', description: 'A certification for those practicing Scrum.' },
                { name: 'ITIL Foundation or higher', description: 'A certification in IT service management.' },
                { name: 'Agile certifications (PMI-ACP, SAFe)', description: 'Certifications in various agile methodologies.' },
                { name: 'Change management certification (Prosci)', description: 'A certification in the practice of change management.' }
            ]}
        ]
    },
];