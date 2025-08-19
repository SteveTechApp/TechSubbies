
import { Engineer, Company, Job } from './types';

export const MOCK_ENGINEERS: Engineer[] = [
  {
    id: 'eng1',
    name: 'John Doe',
    location: 'London, UK',
    radius: 50,
    transport: 'Own Van',
    insurance: true,
    profileImageUrl: 'https://picsum.photos/seed/eng1/200/200',
    tagline: 'Certified Crestron Programmer & AV Specialist',
    reviews: { count: 42, rating: 4.9 },
    baseDayRate: 195,
    skillProfiles: [
      { id: 'sp1', roleTitle: 'Rack Builder', dayRate: 250, skills: [{id: 's1', name: 'Cable Lacing', rating: 5}, {id: 's2', name: 'Schematic Interpretation', rating: 4}], customSkills: ['Neat Patch Certified'], isPremium: true},
      { id: 'sp_install', roleTitle: 'Installation Engineer', dayRate: 350, skills: [{id: 's12', name: 'Site Safety', rating: 4}, {id: 's2', name: 'Schematic Interpretation', rating: 4}], customSkills: ['CSCS Card Holder'], isPremium: true},
      { id: 'sp2', roleTitle: 'Crestron Programmer', dayRate: 550, skills: [{id: 's3', name: 'Crestron SIMPL', rating: 5}, {id: 's4', name: 'C#', rating: 4}, {id: 's5', name: 'AV Networking', rating: 5}], customSkills: ['Crestron Masters 2023 Attendee'], isPremium: true},
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
    tagline: 'Senior Network Engineer with a focus on enterprise solutions.',
    reviews: { count: 31, rating: 4.8 },
    baseDayRate: 195,
    skillProfiles: [
      { id: 'sp3', roleTitle: 'Network Specialist', dayRate: 600, skills: [{id: 's6', name: 'Cisco Routing', rating: 5}, {id: 's7', name: 'Firewall Config', rating: 5}, {id: 's8', name: 'QoS', rating: 4}], customSkills: ['CCNP Certified'], isPremium: true},
    ],
    availability: ['2024-08-12', '2024-08-13', '2024-08-14', '2024-08-28', '2024-08-29'],
  },
  {
    id: 'eng3',
    name: 'Carlos Rivera',
    location: 'Madrid, ES',
    radius: 100,
    transport: 'Own Car',
    insurance: false,
    profileImageUrl: 'https://picsum.photos/seed/eng3/200/200',
    tagline: 'Live Event Technician & Audio Specialist',
    reviews: { count: 18, rating: 4.5 },
    baseDayRate: 195,
    skillProfiles: [
       { id: 'sp4', roleTitle: 'Audio Specialist', dayRate: 400, skills: [{id: 's9', name: 'Dante Level 3', rating: 5}, {id: 's10', name: 'Sound System Tuning', rating: 4}, {id: 's11', name: 'Wireless Mic Coordination', rating: 5}], customSkills: ['Shure Axient Digital Expert'], isPremium: true},
    ],
    availability: ['2024-08-19', '2024-08-20', '2024-08-21'],
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