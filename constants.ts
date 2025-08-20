
import { Engineer, Company, Job, Admin, SupportRequest } from './types';
import { generateEngineers, generateJobs, generateSupportRequests, generateCompanies } from './services/mockDataGenerator';


export const MOCK_ENGINEERS_BASE: Engineer[] = [
  {
    id: 'eng_steve',
    title: 'Mr',
    firstName: 'Steve',
    middleName: '',
    surname: 'Engineer',
    companyName: 'SE Engineering Services',
    travelRadius: '< 100 miles',
    email: 'steve.engineer@example.com',
    mobile: '07123456789',
    website: 'www.steve-engineer.com',
    linkedin: 'linkedin.com/in/steveengineer',
    professionalIndemnityInsurance: true,
    publicLiabilityInsurance: true,
    siteSafe: true,
    ownPPE: true,
    accessEquipmentTrained: true,
    firstAidTrained: true,
    customerRating: 5,
    peerRating: 4,
    associates: [{ name: 'John Smith', link: '#' }, { name: 'Emily White' }],
    caseStudies: [{ title: 'Corporate HQ Audiovisual Integration', link: '#' }],
    certifications: [
      { id: 'cert1', name: 'CSCS Card Holder', achieved: true },
      { id: 'cert2', name: 'AVIXA CTS', achieved: true },
      { id: 'cert_crestron_dm', name: 'Crestron DMC-E-4K', achieved: true },
      { id: 'cert_biamp', name: 'Biamp TesiraFORTE', achieved: false },
      { id: 'cert4', name: 'First Aid At Work', achieved: true },
    ],
    bio: 'Experienced AV installation engineer with over 15 years in the industry, specializing in corporate and educational sector projects. Proven ability to lead teams and deliver complex integrations on time and to the highest standard.',
    yearsOfExperience: 15,
    name: 'Steve Engineer',
    tagline: 'Lead AV Installation Engineer',
    profileImageUrl: 'https://i.imgur.com/8Qtm93t.jpeg',
    location: 'London, UK',
    radius: 100,
    transport: 'Own Van',
    insurance: true,
    reviews: { count: 25, rating: 4.5 },
    baseDayRate: 195,
    skillProfiles: [
      { id: 'sp1', roleTitle: 'Rack Builder', dayRate: 280, skills: [{id: 's1', name: 'Cable Lacing & Termination', rating: 5}, {id: 's2', name: 'Rack Elevation Schematics', rating: 4}, {id: 's3', name: 'Power Management Units', rating: 4}], customSkills: ['Neat Patch Certified', 'Fibre Optic Splicing'], isPremium: true},
      { id: 'sp_install', roleTitle: 'Installation Engineer', dayRate: 375, skills: [{id: 's12', name: 'Crestron/AMX Hardware Install', rating: 5}, {id: 's13', name: 'Video Wall Calibration', rating: 4}, {id: 's14', name: 'Site Safety Protocols', rating: 5}], customSkills: ['CSCS Certified', 'IPAF Licensed'], isPremium: true},
    ],
    availability: ['2024-08-15', '2024-08-16', '2024-08-22', '2024-08-23', '2024-09-02'],
  },
  {
    id: 'eng2',
    name: 'Jane Smith',
    location: 'New York, USA',
    radius: 75,
    transport: 'Company Vehicle',
    insurance: true,
    profileImageUrl: 'https://picsum.photos/seed/eng2/200/200',
    tagline: 'Senior Network & Cloud Engineer',
    reviews: { count: 31, rating: 4.8 },
    baseDayRate: 195,
    skillProfiles: [
      { id: 'sp3', roleTitle: 'Network Engineer', dayRate: 650, skills: [{id: 's6', name: 'Cisco IOS/NX-OS', rating: 5}, {id: 's7', name: 'Palo Alto Firewalls', rating: 5}, {id: 's8', name: 'BGP/OSPF Routing', rating: 4}, {id: 's9', name: 'Wireshark Analysis', rating: 4}], customSkills: ['CCNP Enterprise'], isPremium: true},
      { id: 'sp4', roleTitle: 'Cloud Engineer', dayRate: 700, skills: [{id: 's10', name: 'AWS VPC & Direct Connect', rating: 5}, {id: 's11', name: 'Azure Networking', rating: 4}, {id: 's15', name: 'Terraform IaC', rating: 4}], customSkills: ['AWS Advanced Networking'], isPremium: true},
    ],
    availability: ['2024-08-12', '2024-08-13', '2024-08-14', '2024-08-28', '2024-08-29'],
    title: 'Ms',
    firstName: 'Jane',
    middleName: 'Marie',
    surname: 'Smith',
    companyName: 'Self-Employed',
    travelRadius: '< 75 miles',
    bio: 'Senior Network Engineer with a focus on enterprise solutions and hybrid-cloud infrastructure. Expertise in designing, implementing, and securing complex network environments.',
    email: 'jane.smith@example.com',
    mobile: '07987654321',
    website: 'www.janesmith.net',
    linkedin: 'linkedin.com/in/janesmith',
    professionalIndemnityInsurance: true,
    publicLiabilityInsurance: true,
    siteSafe: true,
    ownPPE: true,
    accessEquipmentTrained: false,
    firstAidTrained: true,
    customerRating: 5,
    peerRating: 5,
    associates: [{ name: 'Carlos Ramirez', link: '#' }],
    caseStudies: [{title: 'Financial Firm Network Overhaul', link: '#'}],
    yearsOfExperience: 10,
    certifications: [
        { id: 'cert5', name: 'CCNP Enterprise', achieved: true },
        { id: 'cert_aws_net', name: 'AWS Advanced Networking', achieved: true },
        { id: 'cert6', name: 'CompTIA Security+', achieved: true },
    ],
  },
  {
    id: 'eng3',
    name: 'Carlos Ramirez',
    location: 'Manchester, UK',
    radius: 150,
    transport: 'Own Car',
    insurance: true,
    profileImageUrl: 'https://picsum.photos/seed/eng3/200/200',
    tagline: 'Control Systems & Web Developer',
    reviews: { count: 18, rating: 4.9 },
    baseDayRate: 195,
    skillProfiles: [
      { id: 'sp5', roleTitle: 'Control System Programmer', dayRate: 600, skills: [{id: 's16', name: 'Crestron SIMPL', rating: 5}, {id: 's17', name: 'C# (for SIMPL#)', rating: 4}, {id: 's18', name: 'DM-NVX Configuration', rating: 5}, {id: 's19', name: 'AV over IP Protocols', rating: 4}], customSkills: ['Crestron Certified Programmer'], isPremium: true },
      { id: 'sp6', roleTitle: 'Web Developer', dayRate: 550, skills: [{id: 's20', name: 'React.js & TypeScript', rating: 5}, {id: 's21', name: 'Node.js (Express)', rating: 4}, {id: 's22', name: 'WebSocket APIs', rating: 4}, {id: 's23', name: 'PostgreSQL', rating: 3}], customSkills: ['Full-Stack Integration'], isPremium: true},
    ],
    availability: ['2024-09-10', '2024-09-11', '2024-09-17', '2024-09-18', '2024-09-24'],
    title: 'Mr',
    firstName: 'Carlos',
    middleName: '',
    surname: 'Ramirez',
    companyName: 'Code & Control Ltd.',
    travelRadius: '< 150 miles',
    bio: 'A hybrid developer specializing in both high-level AV control systems and modern web technologies. Passionate about creating seamless user experiences by integrating physical hardware with custom software interfaces.',
    email: 'carlos.ramirez@example.com',
    mobile: '07111222333',
    website: 'www.carlosramirez.dev',
    linkedin: 'linkedin.com/in/carlosramirezdev',
    professionalIndemnityInsurance: true,
    publicLiabilityInsurance: true,
    siteSafe: true,
    ownPPE: true,
    accessEquipmentTrained: false,
    firstAidTrained: false,
    customerRating: 5,
    peerRating: 4,
    associates: [{ name: 'Jane Smith', link: '#' }],
    caseStudies: [{title: 'University Lecture Hall Automation', link: '#'}],
    yearsOfExperience: 8,
    certifications: [
        { id: 'cert7', name: 'Crestron Certified Programmer', achieved: true },
        { id: 'cert8', name: 'AWS Certified Developer', achieved: true },
        { id: 'cert9', name: 'AMX Certified Programmer', achieved: false },
    ],
  },
];

export const MOCK_COMPANIES_BASE: Company[] = [
    { id: 'com_steve', name: 'SteveCompany', logoUrl: 'https://picsum.photos/seed/com_steve/100/100', location: 'London, UK' },
    { id: 'com2', name: 'Global IT Integrators', logoUrl: 'https://picsum.photos/seed/com2/100/100', location: 'New York, USA' },
];

export const MOCK_ADMINS: Admin[] = [
    { id: 'admin1', name: 'Platform Admin', email: 'admin@techsubbies.com' },
];

export const MOCK_JOBS_BASE: Job[] = [
    { 
        id: 'job1',
        title: 'Lead Installation Engineer for Corporate HQ', 
        companyId: 'com_steve', 
        location: 'London, UK',
        startDate: '2024-09-01',
        endDate: '2024-09-30',
        description: 'We require a lead installation engineer for a major corporate headquarters AV fit-out. Must have experience with Crestron hardware, Biamp DSP, and large-scale video walls.',
        requiredSkills: ['Crestron/AMX Hardware Install', 'Video Wall Calibration', 'Biamp Tesira'],
        dayRate: 450,
        roleTitle: 'Installation Engineer',
    },
    { 
        id: 'job2',
        title: 'Network Infrastructure Upgrade', 
        companyId: 'com2', 
        location: 'New York, USA',
        startDate: '2024-08-26',
        endDate: '2024-09-06',
        description: 'Seeking a senior network specialist to lead an office-wide infrastructure upgrade. Deep knowledge of Cisco hardware and Palo Alto firewall policy is essential.',
        requiredSkills: ['Cisco IOS/NX-OS', 'Palo Alto Firewalls'],
        dayRate: 650,
        roleTitle: 'Network Engineer',
    },
    {
        id: 'job3',
        title: 'General AV Support',
        companyId: 'com_steve',
        location: 'London, UK',
        startDate: '2024-09-05',
        endDate: '2024-09-07',
        description: 'General assistance required for an event setup. Includes cable running, screen setup, and basic troubleshooting.',
        requiredSkills: ['Basic Troubleshooting', 'Cable Management'],
        dayRate: 200,
        roleTitle: 'Basic Engineer',
    },
    {
        id: 'job4',
        title: 'Crestron Programmer for University',
        companyId: 'com_steve',
        location: 'Manchester, UK',
        startDate: '2024-10-01',
        endDate: '2024-10-31',
        description: 'Experienced Crestron programmer needed for a campus-wide control system upgrade. Must be proficient with SIMPL, SIMPL# and DM-NVX endpoints.',
        requiredSkills: ['Crestron SIMPL', 'DM-NVX Configuration', 'C# (for SIMPL#)'],
        dayRate: 625,
        roleTitle: 'Control System Programmer',
    }
];

export const SKILL_ROLES = [
  'Basic Engineer',
  'Rack Builder', 
  'Installation Engineer', 
  'AV Commissioning Engineer', 
  'Control System Programmer',
  'Audio DSP Specialist', 
  'Video Wall Specialist', 
  'Network Engineer', 
  'IT Support Specialist',
  'Web Developer',
  'Cloud Engineer'
];

// --- GENERATE AND COMBINE DATA ---
const generatedEngineers = generateEngineers(997);
export const MOCK_ENGINEERS: Engineer[] = [...MOCK_ENGINEERS_BASE, ...generatedEngineers];

const generatedCompanies = generateCompanies(98);
export const MOCK_COMPANIES: Company[] = [...MOCK_COMPANIES_BASE, ...generatedCompanies];

const generatedJobs = generateJobs(96, MOCK_COMPANIES.map(c => c.id), SKILL_ROLES);
export const MOCK_JOBS: Job[] = [...MOCK_JOBS_BASE, ...generatedJobs];

const allUsers = [...MOCK_ENGINEERS, ...MOCK_COMPANIES];
export const MOCK_SUPPORT_REQUESTS: SupportRequest[] = generateSupportRequests(50, allUsers);

export const SUBSCRIPTION_PLANS = [
  { name: 'Basic', price: 0, features: ['1 Basic Profile', 'Fixed Day Rate (£195 / $195)', 'Limited visibility'] },
  { name: 'Pro', price: 10, features: ['Up to 3 Skill Profiles', 'Custom Day Rates', 'Increased Visibility', 'Peer Endorsements'] },
  { name: 'Expert', price: 20, features: ['Unlimited Skill Profiles', 'Top Search Placement', 'Advanced Analytics', 'Direct Support'] },
];

export const COMPANY_SUBSCRIPTION_PLANS = [
    { name: 'Small Team', price: 49, engineers: 10, description: 'Perfect for small to medium businesses managing a team of freelancers.'},
    { name: 'Growing Business', price: 99, engineers: 25, description: 'Ideal for growing companies with increasing project demands.'},
    { name: 'Enterprise', price: 0, engineers: 0, description: 'Custom solutions for large integrators. Contact us for a quote.'},
];