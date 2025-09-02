import { EngineerProfile, CompanyProfile, Role, Discipline, Currency, Skill, RatedSkill, Compliance, ProfileTier } from '../../types/index.ts';
import { JOB_ROLE_DEFINITIONS } from '../jobRoles.ts';
import { MALE_FIRST_NAMES, FEMALE_FIRST_NAMES, LAST_NAMES, LOCATIONS, COMPANY_NAMES, COMPANY_SUFFIXES } from './mockConstants.ts';
import { AVATARS } from '../assets.ts';


// --- Default Data and Helpers ---
const getRandom = (arr: any[]) => arr[Math.floor(Math.random() * arr.length)];
const getRandomInt = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1)) + min;

const DEFAULT_COMPLIANCE: Compliance = {
    professionalIndemnity: { hasCoverage: false, isVerified: false, amount: 1000000 },
    publicLiability: { hasCoverage: false, isVerified: false, amount: 2000000 },
    siteSafe: false,
    cscsCard: false,
    ownPPE: true,
    hasOwnTransport: false,
    hasOwnTools: false,
    powerToolCompetency: 0,
    accessEquipmentTrained: 0,
    firstAidTrained: false,
    carriesSpares: false,
};

// --- Key Static Profiles ---
export const MOCK_RESOURCING_COMPANY_1: CompanyProfile = { id: 'res-1', name: 'AV Placements', avatar: AVATARS.defaultCompany, status: 'active', logo: '', companyRegNumber: 'VALID-RES-01', isVerified: true };
export const MOCK_ADMIN_PROFILE: CompanyProfile = { id: 'admin-1', name: 'Steve Goodwin', avatar: AVATARS.steve, status: 'active', logo: '', companyRegNumber: 'N/A', isVerified: true };

const MOCK_ENGINEER_STEVE: EngineerProfile = {
    id: 'eng-steve', name: 'Steve Goodwin', firstName: 'Steve', surname: 'Goodwin', status: 'active',
    discipline: Discipline.AV, avatar: AVATARS.steve, location: 'London, UK',
    currency: Currency.GBP, minDayRate: 700, maxDayRate: 800, experience: 20, availability: new Date('2024-09-01'),
    description: "Industry veteran with over 20 years of experience in technical project management and system design. Founder of TechSubbies.com, passionate about connecting expertise with opportunity.",
    profileTier: ProfileTier.BUSINESS,
    jobDigestOptIn: true,
    skills: [ { name: 'Project Management', rating: 99 }, { name: 'System Design', rating: 95 }, { name: 'Client Relations', rating: 98 } ],
    selectedJobRoles: [ { roleName: 'IT Project Manager', skills: [ { name: 'Project Management Professional (PMP) methodologies', rating: 98 }, { name: 'Agile/Scrum framework implementation', rating: 92 }, { name: 'Budget management and cost control', rating: 99 }, { name: 'Stakeholder management and engagement', rating: 99 }, { name: 'Technology risk assessment and mitigation', rating: 95 }, { name: 'Vendor management and procurement processes', rating: 96 } ], overallScore: 97 } ],
    certifications: [{ name: 'PRINCE2® Practitioner', verified: true }],
    contact: { email: 'steve.goodwin@techsubbies.com', phone: '07000000000', website: 'www.techsubbies.com', linkedin: 'https://linkedin.com/in/steve-goodwin-tech' },
    compliance: { 
        ...DEFAULT_COMPLIANCE, 
        professionalIndemnity: { hasCoverage: true, amount: 2000000, isVerified: true, certificateUrl: 'cert.pdf' },
        publicLiability: { hasCoverage: true, amount: 5000000, isVerified: true, certificateUrl: 'cert.pdf' },
    },
    identity: { documentType: 'passport', isVerified: true, documentUrl: 'id.pdf' },
    customerRating: 5, peerRating: 5,
    profileViews: 543, searchAppearances: 2109, jobInvites: 12,
    calendarSyncUrl: 'https://api.techsubbies.com/calendar/eng-steve.ics',
};

const MOCK_ENGINEER_1: EngineerProfile = {
    id: 'eng-1', name: 'Neil Bishop', firstName: 'Neil', middleName: 'John', surname: 'Bishop', title: 'Mr', status: 'active',
    discipline: Discipline.AV, avatar: AVATARS.neil, location: 'London, UK',
    currency: Currency.GBP, minDayRate: 500, maxDayRate: 600, experience: 15, availability: new Date('2024-08-01'),
    description: "Senior AV commissioning engineer with 15+ years' experience specializing in corporate and residential projects. Expert in Crestron, Biamp, and Q-SYS ecosystems, ensuring flawless system integration and performance.",
    companyName: 'AV Innovations', travelRadius: '< 500 miles', profileTier: ProfileTier.SKILLS,
    subscriptionEndDate: new Date(new Date().setDate(new Date().getDate() + 20)), securityNetCreditsUsed: 0,
    jobDigestOptIn: true,
    skills: [ { name: 'AV Commissioning', rating: 98 }, { name: 'Crestron Toolbox', rating: 95 }, { name: 'Biamp Tesira', rating: 92 }, { name: 'C# (for SIMPL#)', rating: 72 } ],
    selectedJobRoles: [
        { roleName: 'AV Systems Engineer', skills: [ { name: 'System commissioning and testing procedures', rating: 98 }, { name: 'Programming control systems', rating: 95 }, { name: 'Audio measurement software (Smaart, TEF)', rating: 92 }, { name: 'Video test pattern generators', rating: 88 }, { name: 'Network analysis tools (Wireshark, ping, traceroute)', rating: 96 }, { name: 'Troubleshooting complex AV systems', rating: 90 } ], overallScore: 93 },
        { roleName: 'Control Systems Programmer (Crestron)', skills: [ { name: 'Crestron SIMPL Windows programming', rating: 94 }, { name: 'Crestron SIMPL# Pro (C# .NET)', rating: 72 }, { name: 'VTPro-e touch panel design', rating: 82 }, { name: 'DM switching and distribution', rating: 95 }, { name: 'Network & IT Skills', rating: 90 }, { name: 'API integration and web services', rating: 85 } ], overallScore: 87 }
    ],
    certifications: [ { name: 'Crestron Certified Programmer', verified: true }, { name: 'Biamp TesiraFORTE Certified', verified: true }, { name: 'Dante Certification Level 3', verified: true } ],
    contact: { email: 'neil.bishop@example.com', phone: '07123456789', website: 'www.neilbishop.com', linkedin: 'linkedin.com/in/nelib' },
    socials: [ { name: 'Social 1', url: 'social 1' }, { name: 'Social 2', url: 'social 2' }, { name: 'Social 3', url: 'social 3' } ],
    associates: [ { name: 'Associate', value: 'John Smith' }, { name: 'Associate 2', value: 'Jane Doe' } ],
    compliance: {
        professionalIndemnity: { hasCoverage: true, amount: 2000000, certificateUrl: 'cert.pdf', isVerified: true },
        publicLiability: { hasCoverage: true, amount: 5000000, certificateUrl: 'cert.pdf', isVerified: true },
        siteSafe: true, cscsCard: true, ownPPE: true, hasOwnTransport: true, hasOwnTools: true,
        powerToolCompetency: 90, accessEquipmentTrained: 80, firstAidTrained: true, carriesSpares: true,
    },
    identity: { documentType: 'drivers_license', documentUrl: 'id.pdf', isVerified: true },
    generalAvailability: 'Medium', caseStudies: [ { id: 'cs-1', name: 'Corporate HQ Audiovisual Integration', url: 'https://example.com/case-study-1' }, { id: 'cs-2', name: 'Luxury Residential Smart Home System', url: 'https://example.com/case-study-2' } ],
    isBoosted: false, customerRating: 5, peerRating: 5,
    profileViews: 142, searchAppearances: 980, jobInvites: 3,
    calendarSyncUrl: 'https://api.techsubbies.com/calendar/eng-1.ics',
};

const MOCK_ENGINEER_2: EngineerProfile = {
    id: 'eng-2', name: 'Samantha Greene', firstName: 'Samantha', surname: 'Greene', title: 'Ms', status: 'active',
    discipline: Discipline.IT, avatar: AVATARS.samantha, location: 'Manchester, UK',
    currency: Currency.GBP, minDayRate: 160, maxDayRate: 180, experience: 8, availability: new Date('2024-07-20'),
    description: "Microsoft Certified support specialist focusing on SME infrastructure, Office 35, and user support. Eager to take on new challenges and contribute to successful project outcomes.",
    companyName: 'Greene IT Solutions', travelRadius: '< 100 miles', profileTier: ProfileTier.BASIC,
    resourcingCompanyId: 'res-1', certifications: [ { name: 'Microsoft 365 Certified: Modern Desktop Administrator Associate', verified: false } ],
    contact: { email: 'sam.greene@example.com', phone: '01234 567891', website: 'https://sgreene.com', linkedin: 'https://linkedin.com/in/samanthagreene' },
    socials: [ { name: 'Social 1', url: 'social 1 link' } ], associates: [ { name: 'Associate 1', value: 'Managed by AV Placements' } ],
    compliance: {
        professionalIndemnity: { hasCoverage: true, amount: 1000000, isVerified: false },
        publicLiability: { hasCoverage: true, amount: 2000000, isVerified: false },
        siteSafe: false, cscsCard: true, ownPPE: true, hasOwnTransport: true, hasOwnTools: false,
        powerToolCompetency: 75, accessEquipmentTrained: 25, firstAidTrained: true, carriesSpares: false,
    },
    identity: { documentType: 'none', isVerified: false },
    generalAvailability: 'High', caseStudies: [ { id: 'cs-3', name: 'SME Office 365 Migration', url: 'https://example.com/case-study-3'} ],
    customerRating: 4, peerRating: 5, googleCalendarLink: '#',
    profileViews: 45, searchAppearances: 312, jobInvites: 1,
    calendarSyncUrl: 'https://api.techsubbies.com/calendar/eng-2.ics',
};

const MOCK_ENGINEER_3: EngineerProfile = {
    id: 'eng-3', name: 'David Chen', firstName: 'David', surname: 'Chen', status: 'active',
    discipline: Discipline.IT, avatar: AVATARS.david, location: 'Birmingham, UK',
    currency: Currency.GBP, minDayRate: 550, maxDayRate: 650, experience: 10, availability: new Date('2024-09-15'),
    description: "AWS Certified Solutions Architect with a deep background in Cisco networking. Specializes in designing and implementing scalable, secure cloud infrastructure and hybrid networks.",
    profileTier: ProfileTier.BUSINESS, subscriptionEndDate: new Date(new Date().setDate(new Date().getDate() + 15)), securityNetCreditsUsed: 1, resourcingCompanyId: 'res-1',
    jobDigestOptIn: true,
    skills: [ { name: 'Cloud Architecture (AWS)', rating: 95 }, { name: 'Network Engineering', rating: 94 }, { name: 'Cybersecurity', rating: 88 } ],
    selectedJobRoles: [
        { roleName: 'Cloud Architect', skills: [ { name: 'AWS architecture and services deep dive', rating: 98 }, { name: 'Azure architecture patterns and best practices', rating: 92 }, { name: 'Identity and access management (IAM)', rating: 94 }, { name: 'Infrastructure as Code implementation', rating: 90 }, { name: 'Serverless computing patterns', rating: 85 }, { name: 'Cloud cost optimization and resource governance', rating: 88 } ], overallScore: 91 },
        { roleName: 'Network Engineer', skills: [ { name: 'Cisco router and switch configuration (IOS/IOS-XE)', rating: 96 }, { name: 'Routing protocols (OSPF, EIGRP, BGP)', rating: 94 }, { name: 'Switching technologies (VLANs, STP, LACP)', rating: 95 }, { name: 'Palo Alto Networks firewalls', rating: 89 }, { name: 'Network monitoring tools (SolarWinds, PRTG, LibreNMS)', rating: 90 }, { name: 'Wireless Network Engineer', rating: 85 } ], overallScore: 92 }
    ],
    certifications: [ { name: 'AWS Certified Solutions Architect - Professional', verified: true }, { name: 'Cisco Certified Network Professional (CCNP)', verified: true } ],
    contact: { email: 'david.chen@example.com', phone: '07111222333', website: 'https://chencloud.dev', linkedin: 'https://linkedin.com/in/davidchen' },
    compliance: { 
        ...DEFAULT_COMPLIANCE, 
        professionalIndemnity: { hasCoverage: true, amount: 2000000, isVerified: true },
        publicLiability: { hasCoverage: true, amount: 10000000, isVerified: true },
        siteSafe: true, cscsCard: true, ownPPE: true, hasOwnTransport: true
    },
    identity: { documentType: 'passport', isVerified: true },
    caseStudies: [],
    profileViews: 310, searchAppearances: 1500, jobInvites: 8,
    calendarSyncUrl: 'https://api.techsubbies.com/calendar/eng-3.ics',
};

export const MOCK_FREE_ENGINEER: EngineerProfile = {
    ...MOCK_ENGINEER_2, id: 'eng-free', name: 'Emily Carter', firstName: 'Emily', surname: 'Carter', status: 'active',
    avatar: AVATARS.emily, profileTier: ProfileTier.BASIC, minDayRate: 170, maxDayRate: 190, skills: undefined,
    resourcingCompanyId: undefined, contact: { ...MOCK_ENGINEER_2.contact, email: 'emily.carter@example.com' },
    compliance: { 
        ...DEFAULT_COMPLIANCE,
        professionalIndemnity: { hasCoverage: true, amount: 1000000, isVerified: false },
        publicLiability: { hasCoverage: true, amount: 2000000, isVerified: false },
        cscsCard: true, ownPPE: true, hasOwnTransport: true
    },
    identity: { documentType: 'none', isVerified: false },
    profileViews: 12, searchAppearances: 88, jobInvites: 0,
    calendarSyncUrl: 'https://api.techsubbies.com/calendar/eng-free.ics',
};


// --- Generator Functions ---
const generateMockEngineers = (count: number): EngineerProfile[] => {
    const engineers: EngineerProfile[] = [];
    for (let i = 0; i < count; i++) {
        // Weighted distribution for Profile Tiers
        const tierRoll = Math.random();
        let profileTier: ProfileTier;
        if (tierRoll < 0.6) profileTier = ProfileTier.BASIC; // 60%
        else if (tierRoll < 0.85) profileTier = ProfileTier.PROFESSIONAL; // 25%
        else if (tierRoll < 0.98) profileTier = ProfileTier.SKILLS; // 13%
        else profileTier = ProfileTier.BUSINESS; // 2%

        const jobRoleDef = getRandom(JOB_ROLE_DEFINITIONS);
        const allSkillsForRole = jobRoleDef.skillCategories.flatMap(category => category.skills.map(s => s.name));
        const isMale = Math.random() > 0.5;
        const firstName = isMale ? getRandom(MALE_FIRST_NAMES) : getRandom(FEMALE_FIRST_NAMES);
        const name = `${firstName} ${getRandom(LAST_NAMES)}`;
        
        let minDayRate, maxDayRate;
        if (profileTier === ProfileTier.BASIC) {
            maxDayRate = getRandomInt(150, 195);
            minDayRate = Math.max(120, maxDayRate - getRandomInt(20, 40));
        } else {
            minDayRate = getRandomInt(10, 30) * 25;
            maxDayRate = minDayRate + getRandomInt(2, 10) * 25;
        }

        const engineer: EngineerProfile = {
            id: `gen-eng-${i}`, name, firstName, surname: name.split(' ')[1], status: 'active',
            discipline: getRandom([Discipline.AV, Discipline.IT, Discipline.BOTH]),
            avatar: `https://i.pravatar.cc/150?u=gen-eng-${i}`,
            location: `${getRandom(LOCATIONS)}, UK`, currency: Currency.GBP,
            minDayRate,
            maxDayRate,
            experience: getRandomInt(3, 20), availability: new Date(new Date().getTime() + getRandomInt(1, 90) * 24 * 60 * 60 * 1000),
            description: `A skilled ${name.split(' ')[1]} with ${name.length % 10 + 5} years of experience.`,
            profileTier, certifications: [], caseStudies: [],
            contact: { email: `${firstName.toLowerCase()}@example.com`, phone: `07${getRandomInt(100000000, 999999999)}`, website: ``, linkedin: `` },
            compliance: { 
                professionalIndemnity: { hasCoverage: Math.random() < 0.8, amount: 1000000, isVerified: false },
                publicLiability: { hasCoverage: Math.random() < 0.8, amount: 2000000, isVerified: false },
                siteSafe: Math.random() < 0.6,
                cscsCard: Math.random() < 0.7,
                ownPPE: Math.random() < 0.9,
                hasOwnTransport: Math.random() < 0.85,
                hasOwnTools: Math.random() < 0.7,
                powerToolCompetency: Math.random() < 0.5 ? getRandomInt(50, 90) : 0,
                accessEquipmentTrained: Math.random() < 0.4 ? getRandomInt(50, 90) : 0,
                firstAidTrained: Math.random() < 0.3,
                carriesSpares: Math.random() < 0.4 
            },
            identity: { documentType: 'none', isVerified: false },
            resourcingCompanyId: Math.random() < 0.1 ? 'res-1' : undefined,
            profileViews: getRandomInt(0, 500),
            searchAppearances: getRandomInt(0, 3000),
            jobInvites: getRandomInt(0, 10),
            calendarSyncUrl: `https://api.techsubbies.com/calendar/gen-eng-${i}.ics`,
        };

        if (profileTier !== ProfileTier.BASIC) {
            engineer.skills = allSkillsForRole.slice(0, 3).map(skillName => ({ name: skillName, rating: getRandomInt(70, 98) }));
            engineer.subscriptionEndDate = new Date(new Date().setDate(new Date().getDate() + getRandomInt(1, 30)));
            engineer.securityNetCreditsUsed = 0;
            engineer.jobDigestOptIn = true;

            if (profileTier === ProfileTier.SKILLS || profileTier === ProfileTier.BUSINESS) {
                 const ratedSkills: RatedSkill[] = allSkillsForRole.map(skillName => ({ name: skillName, rating: getRandomInt(65, 99) }));
                engineer.selectedJobRoles = [{ roleName: jobRoleDef.name, skills: ratedSkills, overallScore: Math.round(ratedSkills.reduce((acc, s) => acc + s.rating, 0) / ratedSkills.length) }];
            }
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
            avatar: `https://i.pravatar.cc/150?u=gen-comp-${i}`,
            website: `www.${name.replace(/\s/g, '').toLowerCase()}.com`,
            consentToFeature: Math.random() < 0.2,
            logo: '', // Let the UI handle this with the new components
            companyRegNumber: `GB${getRandomInt(10000000, 99999999)}`, isVerified: true,
        };
    });
};


// --- Final Exports ---
export const MOCK_ENGINEERS = [MOCK_ENGINEER_STEVE, MOCK_ENGINEER_1, MOCK_ENGINEER_2, MOCK_ENGINEER_3, ...generateMockEngineers(20)];

export const MOCK_COMPANIES: CompanyProfile[] = [
    { id: 'comp-1', name: 'Pro AV Solutions', avatar: AVATARS.defaultCompany, consentToFeature: true, status: 'active', logo: 'proav', companyRegNumber: 'VALID-12345', isVerified: true },
    { id: 'comp-2', name: 'Starlight Events', avatar: AVATARS.defaultCompany, consentToFeature: true, status: 'active', logo: 'starlight', companyRegNumber: 'VALID-67890', isVerified: true },
    { id: 'comp-3', name: 'Nexus IT Integrators', avatar: AVATARS.defaultCompany, consentToFeature: true, status: 'active', logo: 'nexus', companyRegNumber: 'VALID-11223', isVerified: true },
    MOCK_RESOURCING_COMPANY_1,
    ...generateMockCompanies(15)
];