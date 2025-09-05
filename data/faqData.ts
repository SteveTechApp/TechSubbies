interface FaqItem {
    question: string;
    answer: string;
}

interface FaqData {
    engineers: FaqItem[];
    companies: FaqItem[];
    general: FaqItem[];
}

export const FAQ_DATA: FaqData = {
    engineers: [
        {
            question: "Is it free for engineers to join?",
            answer: "Yes! Creating a Basic Profile is completely free. This allows you to set your availability, appear in general searches, and apply for jobs. To unlock powerful features like a detailed Skills Profile, AI tools, and priority ranking, you can upgrade to a paid tier.",
        },
        {
            question: "How does the 'Skills Profile' work?",
            answer: "The Skills Profile (available on paid tiers) is your chance to shine. Instead of just listing technologies, you can add 'Specialist Roles' (e.g., 'AV Systems Engineer') and rate your competency on a granular list of industry-specific skills within that role. This data directly fuels our AI match engine, making you visible for the most relevant, high-value contracts.",
        },
        {
            question: "How do I get paid?",
            answer: "We use a secure, integrated payment system. For Statement of Work (SOW) contracts, the client funds project milestones into an escrow account before you begin. Once you complete the work and it's approved, the funds are automatically released to you. For Day Rate contracts, you submit timesheets for approval, and payment is processed accordingly.",
        },
        {
            question: "What is the 'Security Net Guarantee'?",
            answer: "This is a premium feature for our subscribers. If you're available for over 30 days and don't receive any contract offers, we'll credit you with an additional month's subscription, up to three times. It's our commitment to the value of the platform.",
        },
    ],
    companies: [
        {
            question: "How much does it cost for a company to post a job?",
            answer: "It is completely free for companies to sign up, post unlimited jobs, and find talent. Our business model is funded by engineers who subscribe for premium tools to showcase their skills for your projects. This allows us to attract the largest possible pool of high-quality talent for you.",
        },
        {
            question: "What is the 'AI Smart Match' feature?",
            answer: "AI Smart Match is our most powerful hiring tool. When you view your job applicants, our Gemini-powered AI analyzes every premium engineer's detailed Skills Profile against your job's specific requirements. It returns a ranked list of candidates with a precise Match Score, saving you hours of vetting and instantly showing you the best fits.",
        },
        {
            question: "How do contracts work on the platform?",
            answer: "You can create and send legally binding contracts directly through TechSubbies.com. Choose between a milestone-based Statement of Work (SOW) or a simple Day Rate agreement. Both parties e-sign on the platform, creating a secure and centralized record of your agreement.",
        },
        {
            question: "What is a 'Talent Pool'?",
            answer: "After a contract is completed, you can add your favorite engineers to a 'Talent Pool'. This creates a private, curated list of trusted freelancers. For future projects, you can directly message and invite people from your Talent Pool, bypassing the public job board entirely.",
        },
    ],
    general: [
        {
            question: "Is TechSubbies.com a recruitment agency?",
            answer: "No. We are a technology platform, not a recruitment agency. We do not have recruiters, we do not charge placement fees, and we do not get involved in your negotiations. Our purpose is to provide the tools for companies and engineers to connect directly and efficiently.",
        },
        {
            question: "How are disputes handled?",
            answer: "All contracts on the platform are direct agreements between the Company and the Engineer. TechSubbies.com is not a party to these agreements. While we provide the framework and secure payment system, any disputes regarding work quality or scope must be resolved directly between the two parties.",
        },
        {
            question: "How is my data protected?",
            answer: "We take data security very seriously. All data is encrypted in transit and at rest. We are GDPR compliant and have robust access control policies in place. For more details, please see our dedicated 'Data Security' page in the footer.",
        },
    ],
};
