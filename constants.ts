
import { Engineer, Company, Job } from './types';

export const MOCK_ENGINEERS: Engineer[] = [
  {
    id: 'eng1',
    // New fields from image for "Neil Bishop"
    title: 'Mr',
    firstName: 'Neil',
    middleName: 'John',
    surname: 'Bishop',
    companyName: 'AV Innovations',
    travelRadius: '< 500 miles',
    email: 'neil.bishop@example.com',
    mobile: '07123456789',
    website: 'www.neilbishop.com',
    linkedin: 'linkedin.com/in/nelib',
    social1: 'social 1',
    social2: 'social 2',
    social3: 'social 3',
    professionalIndemnityInsurance: true,
    publicLiabilityInsurance: true,
    siteSafe: true,
    ownPPE: true,
    accessEquipmentTrained: true,
    firstAidTrained: true,
    generalAvailability: 'Medium',
    customerRating: 4,
    peerRating: 3,
    associates: [{ name: 'John Smith' }],
    caseStudies: [{ title: 'Case study 1', link: '#' }],
    certifications: [
      { id: 'cert1', name: 'CSCS Card Holder', achieved: true },
      { id: 'cert2', name: 'AVIXA CTS', achieved: true },
      { id: 'cert3', name: 'AVIXA CTS-D', achieved: false },
      { id: 'cert4', name: 'First Aid At Work', achieved: true },
    ],
    bio: 'Experienced AV technician with over 15 years in the industry, specializing in installation, maintenance, and troubleshooting of audio-visual systems.',
    yearsOfExperience: 15,
    
    // Original/adapted fields
    name: 'Neil Bishop',
    tagline: 'AV Technician',
    profileImageUrl: 'https://i.imgur.com/8Qtm93t.jpeg',
    location: 'London, UK',
    radius: 50,
    transport: 'Own Van',
    insurance: true, // Derived from specific insurances
    reviews: { count: 25, rating: 4.0 }, // Rating now comes from customerRating
    baseDayRate: 195,
    skillProfiles: [
      { id: 'sp1', roleTitle: 'Rack Builder', dayRate: 250, skills: [{id: 's1', name: 'Cable Lacing', rating: 5}, {id: 's2', name: 'Schematic Interpretation', rating: 4}], customSkills: ['Neat Patch Certified'], isPremium: true},
      { id: 'sp_install', roleTitle: 'Installation Engineer', dayRate: 350, skills: [{id: 's12', name: 'Site Safety', rating: 4}, {id: 's2', name: 'Schematic Interpretation', rating: 4}], customSkills: ['CSCS Card Holder'], isPremium: true},
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
    tagline: 'Senior Network Engineer',
    reviews: { count: 31, rating: 4.8 },
    baseDayRate: 195,
    skillProfiles: [
      { id: 'sp3', roleTitle: 'Network Specialist', dayRate: 600, skills: [{id: 's6', name: 'Cisco Routing', rating: 5}, {id: 's7', name: 'Firewall Config', rating: 5}, {id: 's8', name: 'QoS', rating: 4}], customSkills: ['CCNP Certified'], isPremium: true},
    ],
    availability: ['2024-08-12', '2024-08-13', '2024-08-14', '2024-08-28', '2024-08-29'],
     // Filling in new fields with defaults for Jane
    title: 'Ms',
    firstName: 'Jane',
    middleName: 'Marie',
    surname: 'Smith',
    companyName: 'Self-Employed',
    travelRadius: '< 75 miles',
    bio: 'Senior Network Engineer with a focus on enterprise solutions and cloud infrastructure security.',
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
    generalAvailability: 'High',
    customerRating: 5,
    peerRating: 5,
    associates: [],
    caseStudies: [],
    yearsOfExperience: 10,
    certifications: [
        { id: 'cert5', name: 'CCNP Enterprise', achieved: true },
        { id: 'cert6', name: 'CompTIA Security+', achieved: true },
    ],
  },
];

export const MOCK_COMPANIES: Company[] = [
    { id: 'com1', name: 'AV Solutions Inc.', logoUrl: 'https://picsum.photos/seed/com1/100/100'},
    { id: 'com2', name: 'Global IT Integrators', logoUrl: 'https://picsum.photos/seed/com2/100/100'},
];

export const MOCK_JOBS: Job[] = [
    { 
        id: 'job1',
        title: 'Lead Installation Engineer for Corporate HQ', 
        companyId: 'com1', 
        location: 'London, UK',
        startDate: '2024-09-01',
        endDate: '2024-09-30',
        description: 'We require a lead installation engineer for a major corporate headquarters AV fit-out. Must have experience with Crestron, Biamp, and large-scale video walls.',
        requiredSkills: ['Crestron SIMPL', 'Schematic Interpretation', 'AV Networking'],
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
        description: 'Seeking a senior network specialist to lead an office-wide infrastructure upgrade. Deep knowledge of Cisco hardware and firewall policy is essential.',
        requiredSkills: ['Cisco Routing', 'Firewall Config'],
        dayRate: 650,
        roleTitle: 'Network Specialist',
    },
    {
        id: 'job3',
        title: 'General AV Support',
        companyId: 'com1',
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
        title: 'AMX Programmer for University',
        companyId: 'com2',
        location: 'Manchester, UK',
        startDate: '2024-10-01',
        endDate: '2024-10-31',
        description: 'Programmer needed for a campus-wide AMX control system upgrade.',
        requiredSkills: ['AMX Netlinx', 'UI Design'],
        dayRate: 500,
        roleTitle: 'AMX Programmer',
    }
];

export const SKILL_ROLES = [
  'Basic Engineer',
  'Rack Builder', 'Installation Engineer', 'Commissioning Engineer', 
  'Crestron Programmer', 'AMX Programmer', 'Audio Specialist', 
  'Video Specialist', 'Network Specialist', 'IT Manager', 'Software Developer'
];

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