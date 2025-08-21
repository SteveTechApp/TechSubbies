import { Currency, Role, EngineerProfile, CompanyProfile, Job, Skill } from '../types.ts';

const FIRST_NAMES = ['John', 'Jane', 'Alex', 'Emily', 'Chris', 'Katie', 'Michael', 'Sarah', 'David', 'Laura'];
const SURNAMES = ['Smith', 'Jones', 'Williams', 'Brown', 'Taylor', 'Davies', 'Wilson', 'Evans', 'Thomas', 'Roberts'];
const LOCATIONS = ['London, UK', 'Manchester, UK', 'New York, USA', 'San Francisco, USA', 'Berlin, DE', 'Paris, FR', 'Sydney, AU', 'Toronto, CA'];
const TAGLINES = ['Senior Network Engineer', 'AV Commissioning Specialist', 'Full-Stack Developer', 'Cloud Solutions Architect', 'IT Support Technician', 'Lead Installation Engineer', 'Control System Programmer', 'AV Commissioning Engineer'];
const SKILLS_BY_ROLE: { [key: string]: Skill[] } = {
    'Network Engineer': [
        { name: 'Cisco IOS/NX-OS', rating: 5 }, { name: 'Palo Alto Firewalls', rating: 4 }, { name: 'BGP/OSPF Routing', rating: 4 }, { name: 'VPN Configuration', rating: 5 }
    ],
    'Cloud Engineer': [
        { name: 'AWS VPC & Direct Connect', rating: 5 }, { name: 'Azure Networking', rating: 4 }, { name: 'Terraform IaC', rating: 4 }, { name: 'Kubernetes', rating: 3 }
    ],
    'Installation Engineer': [
        { name: 'Crestron/AMX Hardware Install', rating: 5 }, { name: 'Video Wall Calibration', rating: 4 }, { name: 'Site Safety Protocols', rating: 5 }, { name: 'Cable Termination', rating: 5 }
    ],
    'Rack Builder': [
        { name: 'Cable Lacing & Termination', rating: 5 }, { name: 'Rack Elevation Schematics', rating: 4 }, { name: 'Power Management Units', rating: 4 }, { name: 'Fibre Optic Splicing', rating: 3 }
    ],
    'Control System Programmer': [
        { name: 'Crestron SIMPL', rating: 5 }, { name: 'C# (for SIMPL#)', rating: 4 }, { name: 'DM-NVX Configuration', rating: 5 }, { name: 'Q-SYS Control', rating: 3 }
    ],
    'AV Commissioning Engineer': [
        { name: 'Crestron Toolbox', rating: 5 }, { name: 'Biamp Tesira Configuration', rating: 4 }, { name: 'Q-SYS Designer', rating: 4 }, { name: 'Dante Certification Level 2', rating: 5 }, { name: 'System Fault-Finding', rating: 5 },
    ],
    'Web Developer': [
        { name: 'React.js & TypeScript', rating: 5 }, { name: 'Node.js (Express)', rating: 4 }, { name: 'GraphQL APIs', rating: 4 }, { name: 'PostgreSQL', rating: 3 }
    ],
    'IT Support Specialist': [
        { name: 'Active Directory', rating: 5 }, { name: 'Office 365 Admin', rating: 4 }, { name: 'Hardware Troubleshooting', rating: 5 }, { name: 'Helpdesk Ticketing', rating: 4 }
    ],
};
const JOB_ADJECTIVES = ['Senior', 'Lead', 'Expert', 'Junior', 'Mid-Level', 'Principal'];
const JOB_NOUNS = ['Project', 'Deployment', 'Upgrade', 'Installation', 'Migration', 'Fit-Out'];
const COMPANY_ADJECTIVES = ['Global', 'Innovative', 'Dynamic', 'Apex', 'Summit', 'Stellar', 'Quantum', 'Nexus', 'Synergy', 'Visionary'];
const COMPANY_NOUNS = ['Solutions', 'Integrations', 'Dynamics', 'Technologies', 'Ventures', 'Systems', 'Networks', 'Consulting'];
const randomElement = (arr) => arr[Math.floor(Math.random() * arr.length)];
const randomInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
const generateUniqueId = () => Math.random().toString(36).substring(2, 10);

export const generateEngineerProfile = (id: number): EngineerProfile => {
    const name = `${randomElement(FIRST_NAMES)} ${randomElement(SURNAMES)}`;
    const taglineKey = randomElement(Object.keys(SKILLS_BY_ROLE));
    const skills = SKILLS_BY_ROLE[taglineKey] || SKILLS_BY_ROLE['Network Engineer'];
    const location = randomElement(LOCATIONS);
    const currency = location.includes('UK') ? Currency.GBP : Currency.USD;
    return {
        id: `eng-${id}`,
        name,
        tagline: taglineKey,
        location,
        currency,
        dayRate: randomInt(350, 800),
        experience: randomInt(3, 15),
        availability: new Date(2024, randomInt(6, 8), randomInt(1, 30)),
        skills,
        description: `Highly motivated and results-oriented ${taglineKey} with ${randomInt(3, 15)} years of experience in designing, implementing, and managing complex systems. Proven ability to deliver high-quality solutions.`,
        avatar: `https://i.pravatar.cc/150?u=eng${id}`,
        certifications: [
            { name: 'Cisco Certified Network Professional (CCNP)', verified: true },
            { name: 'Crestron Certified Programmer', verified: false },
        ],
        contact: {
            email: `${name.toLowerCase().replace(' ', '.')}@example.com`,
            phone: `+44 7700 900${randomInt(100, 999)}`,
            website: `https://${name.toLowerCase().replace(' ', '')}.com`,
            linkedin: `https://linkedin.com/in/${name.toLowerCase().replace(' ', '')}`
        },
    };
};

export const generateCompanyProfile = (id: number): CompanyProfile => {
    const name = `${randomElement(COMPANY_ADJECTIVES)} ${randomElement(COMPANY_NOUNS)}`;
    return {
        id: `comp-${id}`,
        name,
        location: randomElement(LOCATIONS),
        logo: `https://logo.clearbit.com/${name.toLowerCase().replace(/ /g, '').replace('solutions', '')}.com?size=150`,
        bio: `A leading provider of innovative technology solutions, specializing in enterprise-level integrations and digital transformation.`,
        website: `https://${name.toLowerCase().replace(/ /g, '')}.com`
    };
};

export const generateJob = (companyId: string): Job => {
    const baseRole = randomElement(Object.keys(SKILLS_BY_ROLE));
    const fullRole = `${randomElement(JOB_ADJECTIVES)} ${baseRole}`;
    return {
        id: `job-${generateUniqueId()}`,
        companyId,
        title: `${fullRole} for ${randomElement(JOB_NOUNS)}`,
        location: randomElement(LOCATIONS),
        postedDate: new Date(2024, 5, randomInt(1, 28)),
        startDate: new Date(2024, 6, randomInt(1, 15)),
        duration: `${randomInt(2, 12)} weeks`,
        dayRate: randomInt(400, 900),
        currency: randomElement(Object.values(Currency)),
        description: `We are seeking a skilled ${fullRole} for an exciting ${randomElement(JOB_NOUNS)} project. The ideal candidate will have extensive experience with key technologies and a proven track record of success.`,
        requiredSkills: (SKILLS_BY_ROLE[baseRole] || []).slice(0, 3).map(s => s.name),
    };
};

export const MOCK_ENGINEERS = Array.from({ length: 25 }, (_, i) => generateEngineerProfile(i + 1));
export const MOCK_COMPANIES = Array.from({ length: 10 }, (_, i) => generateCompanyProfile(i + 1));
export const MOCK_JOBS = MOCK_COMPANIES.flatMap(c => Array.from({ length: randomInt(1, 4) }, () => generateJob(c.id)));

export const MOCK_USERS = {
    engineer: {
        id: 'user-eng-1',
        role: Role.ENGINEER,
        profile: generateEngineerProfile(1),
    },
    company: {
        id: 'user-comp-1',
        role: Role.COMPANY,
        profile: generateCompanyProfile(1),
    },
    resourcing_company: {
        id: 'user-res-1',
        role: Role.RESOURCING_COMPANY,
        profile: { ...generateCompanyProfile(100), name: "Resource Solutions Inc." },
    },
    admin: {
        id: 'user-adm-1',
        role: Role.ADMIN,
        profile: {
            name: 'Admin User',
            avatar: `https://i.pravatar.cc/150?u=admin`,
        }
    }
};
