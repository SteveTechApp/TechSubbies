
import { Engineer, Job, SupportRequest, Role, Company } from '../types';

// --- SEED DATA ---
const FIRST_NAMES = ['John', 'Jane', 'Alex', 'Emily', 'Chris', 'Katie', 'Michael', 'Sarah', 'David', 'Laura'];
const SURNAMES = ['Smith', 'Jones', 'Williams', 'Brown', 'Taylor', 'Davies', 'Wilson', 'Evans', 'Thomas', 'Roberts'];
const LOCATIONS = ['London, UK', 'Manchester, UK', 'New York, USA', 'San Francisco, USA', 'Berlin, DE', 'Paris, FR', 'Sydney, AU', 'Toronto, CA'];
const TAGLINES = ['Senior Network Engineer', 'AV Commissioning Specialist', 'Full-Stack Developer', 'Cloud Solutions Architect', 'IT Support Technician', 'Lead Installation Engineer', 'Control System Programmer', 'AV Commissioning Engineer'];
const SKILLS_BY_ROLE: { [key: string]: { name: string, rating: number }[] } = {
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
const COMPANY_NOUNS = ['Solutions', 'Integrators', 'Systems', 'Technologies', 'Group', 'Ventures', 'Dynamics', 'Partners', 'Labs', 'Consulting'];
const COMPANY_SUFFIXES = ['Inc.', 'Ltd.', 'Corp.', 'LLC'];


const getRandom = <T>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)];
const getRandomInt = (min: number, max: number): number => Math.floor(Math.random() * (max - min + 1)) + min;

export const generateEngineers = (count: number): Engineer[] => {
    const engineers: Engineer[] = [];
    for (let i = 0; i < count; i++) {
        const id = `gen_eng_${i + 4}`;
        const firstName = getRandom(FIRST_NAMES);
        const surname = getRandom(SURNAMES);
        const name = `${firstName} ${surname}`;
        const location = getRandom(LOCATIONS);
        const tagline = getRandom(TAGLINES);
        const yearsOfExperience = getRandomInt(3, 20);

        const numSkillProfiles = getRandomInt(1, 3);
        const skillProfiles = [];
        const usedRoles = new Set();
        
        for (let j = 0; j < numSkillProfiles; j++) {
            let roleTitle = getRandom(Object.keys(SKILLS_BY_ROLE));
            while(usedRoles.has(roleTitle)) {
                 roleTitle = getRandom(Object.keys(SKILLS_BY_ROLE));
            }
            usedRoles.add(roleTitle);

            skillProfiles.push({
                id: `gen_sp_${i}_${j}`,
                roleTitle: roleTitle,
                dayRate: getRandomInt(300, 800),
                skills: SKILLS_BY_ROLE[roleTitle].map(s => ({...s, id: `gen_skill_${i}_${j}_${s.name}`})),
                customSkills: ['Team Leadership', 'Client Facing'],
                isPremium: true,
            });
        }

        engineers.push({
            id,
            name,
            firstName,
            surname,
            location,
            tagline,
            yearsOfExperience,
            profileImageUrl: `https://i.pravatar.cc/200?u=${id}`,
            baseDayRate: 195,
            radius: getRandomInt(50, 150),
            transport: 'Own Vehicle',
            insurance: Math.random() > 0.3,
            reviews: { count: getRandomInt(5, 50), rating: getRandomInt(35, 50) / 10 },
            skillProfiles,
            availability: Array.from({ length: getRandomInt(2, 10) }, () => `2024-09-${getRandomInt(1, 30).toString().padStart(2, '0')}`),
            title: 'Mr',
            middleName: '',
            companyName: 'Self-Employed',
            travelRadius: `< ${getRandomInt(50,150)} miles`,
            bio: `Dedicated ${tagline} with ${yearsOfExperience} years of experience in the tech industry.`,
            email: `${firstName.toLowerCase()}.${surname.toLowerCase()}@example.com`,
            mobile: '07123456789',
            website: 'www.example.com',
            linkedin: `linkedin.com/in/${firstName.toLowerCase()}${surname.toLowerCase()}`,
            professionalIndemnityInsurance: true,
            publicLiabilityInsurance: true,
            siteSafe: true,
            ownPPE: true,
            accessEquipmentTrained: Math.random() > 0.5,
            firstAidTrained: Math.random() > 0.5,
            customerRating: getRandomInt(3, 5),
            peerRating: getRandomInt(3, 5),
            associates: [],
            caseStudies: [],
            certifications: [{ id: 'cert_cscs', name: 'CSCS Card Holder', achieved: true }],
        });
    }
    return engineers;
};

export const generateCompanies = (count: number): Company[] => {
    const companies: Company[] = [];
    for (let i = 0; i < count; i++) {
        const id = `gen_com_${i + 3}`;
        const name = `${getRandom(COMPANY_ADJECTIVES)} ${getRandom(COMPANY_NOUNS)} ${getRandom(COMPANY_SUFFIXES)}`;
        companies.push({
            id,
            name,
            logoUrl: `https://picsum.photos/seed/${id}/100/100`,
        });
    }
    return companies;
};


export const generateJobs = (count: number, companyIds: string[], skillRoles: string[]): Job[] => {
    const jobs: Job[] = [];
    for (let i = 0; i < count; i++) {
        const roleTitle = getRandom(skillRoles.filter(r => r !== 'Basic Engineer'));
        const requiredSkills = SKILLS_BY_ROLE[roleTitle as keyof typeof SKILLS_BY_ROLE]?.map(s => s.name).slice(0,2) || [];
        jobs.push({
            id: `gen_job_${i + 5}`,
            title: `${getRandom(JOB_ADJECTIVES)} ${roleTitle} for ${getRandom(JOB_NOUNS)}`,
            companyId: getRandom(companyIds),
            location: getRandom(LOCATIONS),
            startDate: `2024-10-${getRandomInt(1, 28).toString().padStart(2, '0')}`,
            endDate: `2024-11-${getRandomInt(1, 28).toString().padStart(2, '0')}`,
            description: `Seeking an experienced ${roleTitle} for an upcoming project. Key skills required include ${requiredSkills.join(', ')}.`,
            requiredSkills,
            dayRate: getRandomInt(350, 700),
            roleTitle,
        });
    }
    return jobs;
};

const SUPPORT_SUBJECTS = ['Login Issue', 'Profile Update Failed', 'Billing Query', 'Cannot find engineer', 'Feature Request'];
const SUPPORT_MESSAGES = [
    "Hi, I'm having trouble logging into my account. Can you please reset my password?",
    "I updated my profile but the changes are not showing. Please help.",
    "I have a question about my last invoice. Can someone from billing contact me?",
    "I'm trying to find an engineer with specific skills but the search isn't working.",
    "It would be great if the platform had a direct messaging feature."
];

export const generateSupportRequests = (count: number, users: (Engineer | Company)[]): SupportRequest[] => {
    const requests: SupportRequest[] = [];
    for (let i = 0; i < count; i++) {
        const user = getRandom(users);
        const userRole = 'logoUrl' in user ? Role.COMPANY : Role.ENGINEER;
        requests.push({
            id: `sr_${i}`,
            userId: user.id,
            userName: user.name,
            userRole,
            subject: getRandom(SUPPORT_SUBJECTS),
            message: getRandom(SUPPORT_MESSAGES),
            date: new Date(Date.now() - getRandomInt(1, 30) * 24 * 60 * 60 * 1000).toISOString(),
            status: Math.random() > 0.4 ? 'Open' : 'Resolved',
        });
    }
    return requests;
};