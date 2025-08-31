import { EngineerProfile, CompanyProfile, Role, Discipline, Currency, Skill, RatedSkill, Compliance } from '../../types/index.ts';
import { JOB_ROLE_DEFINITIONS } from '../jobRoles.ts';
import { MALE_FIRST_NAMES, FEMALE_FIRST_NAMES, LAST_NAMES, LOCATIONS, COMPANY_NAMES, COMPANY_SUFFIXES } from './mockConstants.ts';

// --- Default Data and Helpers ---
const getRandom = (arr: any[]) => arr[Math.floor(Math.random() * arr.length)];
const getRandomInt = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1)) + min;

const DEFAULT_COMPLIANCE: Compliance = {
    professionalIndemnity: false, publicLiability: false, siteSafe: false, cscsCard: false,
    ownPPE: false, hasOwnTransport: false, hasOwnTools: false, powerToolCompetency: false,
    accessEquipmentTrained: false, firstAidTrained: false, carriesSpares: false,
};

// --- Key Static Profiles ---
export const MOCK_RESOURCING_COMPANY_1: CompanyProfile = { id: 'res-1', name: 'AV Placements', avatar: 'https://i.pravatar.cc/150?u=avplacements', status: 'active', logo: 'https://i.imgur.com/2yF5t1x.png', companyRegNumber: 'VALID-RES-01', isVerified: true };
export const MOCK_ADMIN_PROFILE: CompanyProfile = { id: 'admin-1', name: 'Steve Goodwin', avatar: 'https://i.imgur.com/RfjB4zR.jpg', status: 'active', logo: 'https://i.imgur.com/2yF5t1x.png', companyRegNumber: 'N/A', isVerified: true };

const MOCK_ENGINEER_STEVE: EngineerProfile = {
    id: 'eng-steve', name: 'Steve Goodwin', firstName: 'Steve', surname: 'Goodwin', status: 'active',
    discipline: Discipline.AV, avatar: 'https://i.imgur.com/RfjB4zR.jpg', location: 'London, UK',
    currency: Currency.GBP, dayRate: 750, experience: 20, availability: new Date('2024-09-01'),
    description: "Industry veteran with over 20 years of experience in technical project management and system design. Founder of TechSubbies.com, passionate about connecting expertise with opportunity.",
    profileTier: 'paid',
    jobDigestOptIn: true,
    skills: [ { name: 'Project Management', rating: 99 }, { name: 'System Design', rating: 95 }, { name: 'Client Relations', rating: 98 } ],
    selectedJobRoles: [ { roleName: 'AV Project Manager', skills: [ { name: 'Project Scoping', rating: 98 }, { name: 'Gantt Charts (MS Project)', rating: 92 }, { name: 'Budget Management', rating: 99 }, { name: 'Client Communication', rating: 99 }, { name: 'Risk Assessment', rating: 95 }, { name: 'Change Order Management', rating: 96 } ], overallScore: 97 } ],
    certifications: [{ name: 'PRINCE2® Practitioner', verified: true }],
    contact: { email: 'steve.goodwin@techsubbies.com', phone: '07000000000', website: 'www.techsubbies.com', linkedin: 'https://linkedin.com/in/steve-goodwin-tech' },
    compliance: { ...DEFAULT_COMPLIANCE, professionalIndemnity: true, publicLiability: true },
    customerRating: 5, peerRating: 5,
};

const MOCK_ENGINEER_1: EngineerProfile = {
    id: 'eng-1', name: 'Neil Bishop', firstName: 'Neil', middleName: 'John', surname: 'Bishop', title: 'Mr', status: 'active',
    discipline: Discipline.AV, avatar: 'https://xsgames.co/randomusers/assets/avatars/male/74.jpg', location: 'London, UK',
    currency: Currency.GBP, dayRate: 550, experience: 15, availability: new Date('2024-08-01'),
    description: "Senior AV commissioning engineer with 15+ years' experience specializing in corporate and residential projects. Expert in Crestron, Biamp, and Q-SYS ecosystems, ensuring flawless system integration and performance.",
    companyName: 'AV Innovations', travelRadius: '< 500 miles', profileTier: 'paid',
    subscriptionEndDate: new Date(new Date().setDate(new Date().getDate() + 20)), securityNetCreditsUsed: 0,
    jobDigestOptIn: true,
    skills: [ { name: 'AV Commissioning', rating: 98 }, { name: 'Crestron Toolbox', rating: 95 }, { name: 'Biamp Tesira', rating: 92 }, { name: 'C# (for SIMPL#)', rating: 72 } ],
    selectedJobRoles: [
        { roleName: 'AV Commissioning Engineer', skills: [ { name: 'System Commissioning', rating: 98 }, { name: 'Crestron Toolbox', rating: 95 }, { name: 'Biamp Tesira', rating: 92 }, { name: 'Q-SYS Designer', rating: 88 }, { name: 'Dante Level 3', rating: 96 }, { name: 'Network Troubleshooting', rating: 90 } ], overallScore: 93 },
        { roleName: 'Crestron Programmer', skills: [ { name: 'SIMPL Windows', rating: 94 }, { name: 'C# (for SIMPL#)', rating: 72 }, { name: 'Crestron HTML5 UI', rating: 82 }, { name: 'DM NVX Configuration', rating: 95 }, { name: 'System Architecture', rating: 90 }, { name: 'API Integration', rating: 85 } ], overallScore: 87 }
    ],
    certifications: [ { name: 'Crestron Certified Programmer', verified: true }, { name: 'Biamp TesiraFORTE Certified', verified: true }, { name: 'Dante Certification Level 3', verified: true } ],
    contact: { email: 'neil.bishop@example.com', phone: '07123456789', website: 'www.neilbishop.com', linkedin: 'linkedin.com/in/nelib' },
    socials: [ { name: 'Social 1', url: 'social 1' }, { name: 'Social 2', url: 'social 2' }, { name: 'Social 3', url: 'social 3' } ],
    associates: [ { name: 'Associate', value: 'John Smith' }, { name: 'Associate 2', value: 'Jane Doe' } ],
    compliance: { professionalIndemnity: true, publicLiability: true, siteSafe: true, cscsCard: true, ownPPE: true, hasOwnTransport: true, hasOwnTools: true, powerToolCompetency: true, accessEquipmentTrained: true, firstAidTrained: true, carriesSpares: true },
    generalAvailability: 'Medium', caseStudies: [ { id: 'cs-1', name: 'Corporate HQ Audiovisual Integration', url: 'https://example.com/case-study-1' }, { id: 'cs-2', name: 'Luxury Residential Smart Home System', url: 'https://example.com/case-study-2' } ],
    isBoosted: true, customerRating: 5, peerRating: 5,
};

const MOCK_ENGINEER_2: EngineerProfile = {
    id: 'eng-2', name: 'Samantha Greene', firstName: 'Samantha', surname: 'Greene', title: 'Ms', status: 'active',
    discipline: Discipline.IT, avatar: 'https://xsgames.co/randomusers/assets/avatars/female/10.jpg', location: 'Manchester, UK',
    currency: Currency.GBP, dayRate: 180, experience: 8, availability: new Date('2024-07-20'),
    description: "Microsoft Certified support specialist focusing on SME infrastructure, Office 35, and user support. Eager to take on new challenges and contribute to successful project outcomes.",
    companyName: 'Greene IT Solutions', travelRadius: '< 100 miles', profileTier: 'free',
    resourcingCompanyId: 'res-1', certifications: [ { name: 'Microsoft 365 Certified: Modern Desktop Administrator Associate', verified: true } ],
    contact: { email: 'sam.greene@example.com', phone: '01234 567891', website: 'https://sgreene.com', linkedin: 'https://linkedin.com/in/samanthagreene' },
    socials: [ { name: 'Social 1', url: 'social 1 link' } ], associates: [ { name: 'Associate 1', value: 'Managed by AV Placements' } ],
    compliance: { professionalIndemnity: true, publicLiability: true, siteSafe: false, cscsCard: true, ownPPE: true, hasOwnTransport: true, hasOwnTools: false, powerToolCompetency: true, accessEquipmentTrained: false, firstAidTrained: true, carriesSpares: false },
    generalAvailability: 'High', caseStudies: [ { id: 'cs-3', name: 'SME Office 365 Migration', url: 'https://example.com/case-study-3'} ],
    customerRating: 4, peerRating: 5, googleCalendarLink: '#',
};

const MOCK_ENGINEER_3: EngineerProfile = {
    id: 'eng-3', name: 'David Chen', firstName: 'David', surname: 'Chen', status: 'active',
    discipline: Discipline.IT, avatar: 'https://xsgames.co/randomusers/assets/avatars/male/15.jpg', location: 'Birmingham, UK',
    currency: Currency.GBP, dayRate: 600, experience: 10, availability: new Date('2024-09-15'),
    description: "AWS Certified Solutions Architect with a deep background in Cisco networking. Specializes in designing and implementing scalable, secure cloud infrastructure and hybrid networks.",
    profileTier: 'paid', subscriptionEndDate: new Date(new Date().setDate(new Date().getDate() + 15)), securityNetCreditsUsed: 1, resourcingCompanyId: 'res-1',
    jobDigestOptIn: true,
    skills: [ { name: 'Cloud Architecture (AWS)', rating: 95 }, { name: 'Network Engineering', rating: 94 }, { name: 'Cybersecurity', rating: 88 } ],
    selectedJobRoles: [
        { roleName: 'Cloud Engineer (AWS/Azure)', skills: [ { name: 'AWS EC2/Azure VMs', rating: 98 }, { name: 'VPC/VNet Networking', rating: 92 }, { name: 'IAM/Azure AD', rating: 94 }, { name: 'CloudFormation/Terraform', rating: 90 }, { name: 'Serverless Functions', rating: 85 }, { name: 'Cloud Monitoring', rating: 88 } ], overallScore: 91 },
        { roleName: 'Network Engineer', skills: [ { name: 'Cisco iOS/NX-OS', rating: 96 }, { name: 'Routing (BGP/OSPF)', rating: 94 }, { name: 'Switching (VLANs/STP)', rating: 95 }, { name: 'Firewall Management', rating: 89 }, { name: 'Network Monitoring', rating: 90 }, { name: 'Wi-Fi Surveys', rating: 85 } ], overallScore: 92 }
    ],
    certifications: [ { name: 'AWS Certified Solutions Architect - Professional', verified: true }, { name: 'Cisco Certified Network Professional (CCNP)', verified: true } ],
    contact: { email: 'david.chen@example.com', phone: '07111222333', website: 'https://chencloud.dev', linkedin: 'https://linkedin.com/in/davidchen' },
    compliance: { ...DEFAULT_COMPLIANCE, professionalIndemnity: true, publicLiability: true, siteSafe: true, cscsCard: true, ownPPE: true, hasOwnTransport: true },
    caseStudies: [],
};

export const MOCK_FREE_ENGINEER: EngineerProfile = {
    ...MOCK_ENGINEER_2, id: 'eng-free', name: 'Emily Carter', firstName: 'Emily', surname: 'Carter', status: 'active',
    avatar: 'https://xsgames.co/randomusers/assets/avatars/female/20.jpg', profileTier: 'free', dayRate: 190, skills: undefined,
    resourcingCompanyId: undefined, contact: { ...MOCK_ENGINEER_2.contact, email: 'emily.carter@example.com' },
    compliance: { ...DEFAULT_COMPLIANCE, professionalIndemnity: true, publicLiability: true, cscsCard: true, ownPPE: true, hasOwnTransport: true }
};


// --- Generator Functions ---
const generateMockEngineers = (count: number): EngineerProfile[] => {
    const engineers: EngineerProfile[] = [];
    for (let i = 0; i < count; i++) {
        const profileTier = Math.random() > 0.6 ? 'paid' : 'free';
        const jobRoleDef = getRandom(JOB_ROLE_DEFINITIONS);
        const isMale = Math.random() > 0.5;
        const firstName = isMale ? getRandom(MALE_FIRST_NAMES) : getRandom(FEMALE_FIRST_NAMES);
        const name = `${firstName} ${getRandom(LAST_NAMES)}`;
        
        const engineer: EngineerProfile = {
            id: `gen-eng-${i}`, name, firstName, surname: name.split(' ')[1], status: 'active',
            discipline: getRandom([Discipline.AV, Discipline.IT, Discipline.BOTH]),
            avatar: `https://xsgames.co/randomusers/assets/avatars/${isMale ? 'male' : 'female'}/${getRandomInt(0, 78)}.jpg`,
            location: `${getRandom(LOCATIONS)}, UK`, currency: Currency.GBP,
            dayRate: profileTier === 'paid' ? getRandomInt(10, 30) * 25 : getRandomInt(6, 7) * 25,
            experience: getRandomInt(3, 20), availability: new Date(new Date().getTime() + getRandomInt(1, 90) * 24 * 60 * 60 * 1000),
            description: `A skilled ${name.split(' ')[1]} with ${name.length % 10 + 5} years of experience.`,
            profileTier, certifications: [], caseStudies: [],
            contact: { email: `${firstName.toLowerCase()}@example.com`, phone: `07${getRandomInt(100000000, 999999999)}`, website: ``, linkedin: `` },
            compliance: { professionalIndemnity: Math.random() < 0.8, publicLiability: Math.random() < 0.8, siteSafe: Math.random() < 0.6, cscsCard: Math.random() < 0.7, ownPPE: Math.random() < 0.9, hasOwnTransport: Math.random() < 0.85, hasOwnTools: Math.random() < 0.7, powerToolCompetency: Math.random() < 0.5, accessEquipmentTrained: Math.random() < 0.4, firstAidTrained: Math.random() < 0.3, carriesSpares: Math.random() < 0.4 },
            resourcingCompanyId: Math.random() < 0.1 ? 'res-1' : undefined,
        };

        if (profileTier === 'paid') {
            engineer.skills = jobRoleDef.skills.slice(0, 3).map(skillName => ({ name: skillName, rating: getRandomInt(70, 98) }));
            const ratedSkills: RatedSkill[] = jobRoleDef.skills.map(skillName => ({ name: skillName, rating: getRandomInt(65, 99) }));
            engineer.selectedJobRoles = [{ roleName: jobRoleDef.name, skills: ratedSkills, overallScore: Math.round(ratedSkills.reduce((acc, s) => acc + s.rating, 0) / ratedSkills.length) }];
            if (Math.random() < 0.2) engineer.isBoosted = true;
            engineer.subscriptionEndDate = new Date(new Date().setDate(new Date().getDate() + getRandomInt(1, 30)));
            engineer.securityNetCreditsUsed = 0;
            engineer.jobDigestOptIn = true;
        }
        engineers.push(engineer);
    }
    return engineers;
};

const generateMockCompanies = (count: number): CompanyProfile[] => {
    return Array.from({ length: count }, (_, i) => {
        const name = `${getRandom(COMPANY_NAMES)} ${getRandom(COMPANY_SUFFIXES)}`;
        return {
            id: `gen-comp-${i}`, name, status: 'active',
            avatar: `https://i.pravatar.cc/150?u=${name.replace(/\s/g, '')}`,
            website: `www.${name.replace(/\s/g, '').toLowerCase()}.com`,
            consentToFeature: Math.random() < 0.2,
            logo: `https://logo.clearbit.com/${name.replace(/\s/g, '').toLowerCase().replace('ltd', '')}.com?size=100`,
            companyRegNumber: `GB${getRandomInt(10000000, 99999999)}`, isVerified: true,
        };
    });
};


// --- Final Exports ---
export const MOCK_ENGINEERS = [MOCK_ENGINEER_STEVE, MOCK_ENGINEER_1, MOCK_ENGINEER_2, MOCK_ENGINEER_3, ...generateMockEngineers(20)];

export const MOCK_COMPANIES: CompanyProfile[] = [
    { id: 'comp-1', name: 'Pro AV Solutions', avatar: 'https://i.pravatar.cc/150?u=proav', consentToFeature: true, status: 'active', logo: 'https://i.imgur.com/cO0k4Sj.png', companyRegNumber: 'VALID-12345', isVerified: true },
    { id: 'comp-2', name: 'Starlight Events', avatar: 'https://i.pravatar.cc/150?u=starlight', consentToFeature: true, status: 'active', logo: 'https://i.imgur.com/U5n41QT.png', companyRegNumber: 'VALID-67890', isVerified: true },
    { id: 'comp-3', name: 'Nexus IT Integrators', avatar: 'https://i.pravatar.cc/150?u=nexusit', consentToFeature: true, status: 'active', logo: 'https://i.imgur.com/dJeEvD5.png', companyRegNumber: 'VALID-11223', isVerified: true },
    MOCK_RESOURCING_COMPANY_1,
    ...generateMockCompanies(15)
];