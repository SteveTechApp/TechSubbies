import { GoogleGenAI, Type, Chat } from "@google/genai";
import { EngineerProfile, Job, ProfileTier, User, Message, CompanyProfile, JobSkillRequirement, JobType, ExperienceLevel } from '../types/index.ts';
import { JOB_ROLE_DEFINITIONS } from '../data/jobRoles.ts';
import { MOCK_TRAINING_PROVIDERS } from '../data/trainingProviders.ts';

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const SYSTEM_INSTRUCTION = `You are the TechSubbies.com AI Assistant. Your role is to help users navigate the platform and answer their questions.
TechSubbies is a platform that connects freelance AV & IT engineers with companies for contract work.

Key Platform Features:
- Companies can post contracts for free.
- Engineers can create a basic profile for free.
- Engineers can upgrade to a paid "Skills Profile" to get more features and better visibility.
- The platform has an integrated contract system with e-signatures for both Statement of Work (milestone-based) and Day Rate agreements.
- For milestone-based work, payments are secured via an escrow system. Companies fund a milestone, and the funds are released to the engineer upon approval.
- Engineers can submit timesheets for Day Rate work.
- Companies can create "Talent Pools" to build curated lists of their favorite freelancers.
- Engineers have a "My Connections" page to track their professional network of companies they've worked with.

Your Persona:
- Be friendly, concise, and helpful.
- Do not make up features that don't exist.
- If you don't know the answer, say "I'm not sure about that, but you can find detailed information in the User Guide or contact our support team at support@techsubbies.com."`;


export const geminiService = {
    // --- CHAT & GENERAL ASSISTANCE ---
    startChat: (): Chat => {
        return ai.chats.create({
            model: 'gemini-2.5-flash',
            config: {
                systemInstruction: SYSTEM_INSTRUCTION,
            },
        });
    },

    generateChatResponse: async (
        conversationHistory: Message[],
        currentUser: User,
        otherParticipant: User
    ): Promise<string> => {
        const otherUserProfile = otherParticipant.profile;
        
        let personaInstruction = `You are impersonating ${otherUserProfile.name}. Your role is ${otherParticipant.role}.`;
        if ('discipline' in otherUserProfile) {
            const engineerProfile = otherUserProfile as EngineerProfile;
            personaInstruction += ` You are a freelance ${engineerProfile.discipline} with ${engineerProfile.experience} years of experience.`;
            if (engineerProfile.skills && engineerProfile.skills.length > 0) {
                 personaInstruction += ` Your key skills are: ${engineerProfile.skills.map(s => s.name).join(', ')}.`;
            }
        } else {
            const companyProfile = otherUserProfile as CompanyProfile;
            personaInstruction += ` You represent the company ${companyProfile.name}.`;
        }
        personaInstruction += ` Keep your responses concise, professional, and relevant to a tech subcontracting platform called TechSubbies.com. The current user's name is ${currentUser.profile.name}.`;

        const contents = conversationHistory.map(msg => ({
            role: msg.senderId === otherParticipant.id ? 'model' as const : 'user' as const,
            parts: [{ text: msg.text }]
        }));

        try {
            const response = await ai.models.generateContent({
                model: 'gemini-2.5-flash',
                contents,
                config: {
                    systemInstruction: personaInstruction,
                },
            });
            return response.text.trim();

        } catch (error) {
            console.error("Error generating chat response:", error);
            return "Sorry, I'm having trouble responding right now. Please try again later.";
        }
    },

    // --- PROFILE ENHANCEMENT ---
    generateDescriptionForProfile: async (profile: EngineerProfile) => {
        let prompt: string;

        if (profile.profileTier !== ProfileTier.BASIC && profile.skills && profile.skills.length > 0) {
            // Paid users get a detailed bio leveraging their listed skills
            prompt = `Generate a compelling but brief professional bio (around 50-70 words) for a freelance Tech engineer. Here are their details:\n- Name: ${profile.name}\n- Role/Discipline: ${profile.discipline}\n- Experience: ${profile.experience} years\n- Key Skills: ${profile.skills.slice(0, 5).map(s => s.name).join(', ')}\n\nWrite a professional, first-person summary highlighting their expertise based on the provided skills.`;
        } else {
            // Free users get a more general bio to encourage upgrading
            prompt = `Generate a compelling but brief professional bio (around 50-70 words) for a freelance Tech engineer. Do not mention any specific technical skills or technologies from a list. Focus on their general role and years of experience. Here are their details:\n- Name: ${profile.name}\n- Role/Discipline: ${profile.discipline}\n- Experience: ${profile.experience} years\n\nWrite a professional, first-person summary that encourages companies to unlock their full profile to see detailed skills.`;
        }
        
        try {
            const response = await ai.models.generateContent({ model: 'gemini-2.5-flash', contents: prompt });
            return response.text.trim();
        } catch (error) {
            console.error("Error generating description:", error);
            return profile.description;
        }
    },

    generateSkillsForRole: async (role: string) => {
        const prompt = `Based on the Tech industry job title "${role}", suggest 5 to 7 key technical skills. For each skill, provide a "rating" from 60 to 95, where 60 is proficient and 95 is expert. This rating should reflect the typical proficiency expected for someone in that role.`;
        try {
            const response = await ai.models.generateContent({
                model: "gemini-2.5-flash", contents: prompt,
                config: {
                    responseMimeType: "application/json",
                    responseSchema: {
                        type: Type.OBJECT,
                        properties: { skills: { type: Type.ARRAY, items: { type: Type.OBJECT, properties: { name: { type: Type.STRING }, rating: { type: Type.INTEGER } }, required: ["name", "rating"] } } }
                    },
                },
            });
            return JSON.parse(response.text);
        } catch (error) {
            console.error("Error generating skills:", error);
            return { error: "Failed to generate skills. The AI service may be busy or unavailable. Please try again." };
        }
    },

    getTrainingRecommendations: async (profile: EngineerProfile) => {
        const lowRatedSkills = profile.skills?.filter(s => s.rating < 75).map(s => s.name).join(', ');
        const highRatedSkills = profile.skills?.filter(s => s.rating >= 75).map(s => s.name).join(', ');

        const providerList = MOCK_TRAINING_PROVIDERS.map(p => p.name);

        const prompt = `Act as a career advisor for a freelance ${profile.discipline}.
        Their goal is to increase their day rate and get more contract offers.
        
        Here is their current skill profile:
        - High-rated skills (>75/100): ${highRatedSkills || 'None'}
        - Lower-rated skills (<75/100): ${lowRatedSkills || 'None'}

        Based on this, suggest 2 or 3 specific, actionable training courses or certifications that would provide the highest return on investment. 
        For each suggestion, provide:
        1. "courseName" (string): The name of the certification or course (e.g., "Cisco CCNP Enterprise", "AVIXA CTS").
        2. "reason" (string): A brief, compelling reason why this is a good choice for them, explaining how it complements their existing skills or addresses a weakness.
        3. "keywords" (array of strings): A list of 2-3 keywords related to the course (e.g., ["Networking", "Routing", "Cisco"]).
        4. "providerName" (string, optional): If the course is directly offered by one of the following official providers, include its exact name from this list. Otherwise, this field should be omitted or null.
           Available Providers: ${JSON.stringify(providerList)}

        Keep the reasons concise and focused on career benefits.`;
        
        try {
            const response = await ai.models.generateContent({
                model: "gemini-2.5-flash",
                contents: prompt,
                config: {
                    responseMimeType: "application/json",
                    responseSchema: {
                        type: Type.OBJECT,
                        properties: {
                            recommendations: {
                                type: Type.ARRAY,
                                items: {
                                    type: Type.OBJECT,
                                    properties: {
                                        courseName: { type: Type.STRING },
                                        reason: { type: Type.STRING },
                                        keywords: { type: Type.ARRAY, items: { type: Type.STRING } },
                                        providerName: { type: Type.STRING }
                                    },
                                    required: ["courseName", "reason", "keywords"]
                                }
                            }
                        }
                    },
                },
            });
            return JSON.parse(response.text);
        } catch (error) {
            console.error("Error getting training recommendations:", error);
            return { error: "Failed to get recommendations. The AI service may be busy or unavailable. Please try again." };
        }
    },
    
    getCareerCoaching: async (profile: EngineerProfile, trendingSkills: string[]) => {
        const profileSummary = `
        - Discipline: ${profile.discipline}
        - Experience: ${profile.experience} years
        - Current Profile Tier: ${profile.profileTier}
        - Specialist Roles: ${profile.selectedJobRoles?.map(r => `${r.roleName} (Score: ${r.overallScore})`).join(', ') || 'None'}
        - Certifications: ${profile.certifications.map(c => `${c.name} (${c.verified ? 'Verified' : 'Not Verified'})`).join(', ') || 'None'}
        `;

        const prompt = `You are an expert career coach for a freelance AV/IT engineer in the UK. Your goal is to provide actionable, personalized advice to help them get more high-value contracts.

        Analyze the following engineer's profile:
        ${profileSummary}

        Compare their profile against these top trending skills currently in demand on the platform:
        ${trendingSkills.join(', ')}

        Based on your analysis, provide 3 to 4 actionable insights. Each insight must be concise and categorized into one of three types: 'Upskill', 'Certification', or 'Profile Enhancement'.
        - 'Upskill': Suggest a specific technology or skill they should learn that is in high demand but missing or underrepresented in their profile.
        - 'Certification': Recommend a specific, valuable certification that would justify a higher day rate.
        - 'Profile Enhancement': Suggest a way to better present their existing skills or experience on their profile.
        
        For each insight, also provide a call to action object with text and a target view.
        `;
        
        try {
            const response = await ai.models.generateContent({
                model: "gemini-2.5-flash",
                contents: prompt,
                config: {
                    responseMimeType: "application/json",
                    responseSchema: {
                        type: Type.OBJECT,
                        properties: {
                            insights: {
                                type: Type.ARRAY,
                                items: {
                                    type: Type.OBJECT,
                                    properties: {
                                        type: { type: Type.STRING, enum: ['Upskill', 'Certification', 'Profile Enhancement'] },
                                        suggestion: { type: Type.STRING },
                                        callToAction: {
                                            type: Type.OBJECT,
                                            properties: {
                                                text: { type: Type.STRING },
                                                view: { type: Type.STRING }
                                            },
                                            required: ["text", "view"]
                                        }
                                    },
                                    required: ["type", "suggestion", "callToAction"]
                                }
                            }
                        },
                        required: ["insights"]
                    },
                },
            });
            return JSON.parse(response.text);
        } catch (error) {
            console.error("Error getting career coaching:", error);
            return { error: "Failed to get career insights. The AI service may be busy or unavailable. Please try again." };
        }
    },

    // --- JOB & TALENT MATCHING ---
     analyzeJobDescription: async (title: string, description: string) => {
        const roleNames = JOB_ROLE_DEFINITIONS.map(r => r.name);
        const prompt = `You are an expert recruitment consultant for the UK's freelance AV & IT sector. Analyze the following job posting. Your goal is to standardize and enrich the post to attract top-tier talent.
    
        Job Title: "${title}"
        Job Description: "${description}"
    
        Here is the list of standard specialist roles you must choose from: ${JSON.stringify(roleNames)}
    
        Based on the job details, provide a strict JSON response with:
        1. "improved_description" (string): A revised, professional job description of about 100-150 words. It should be engaging and clear.
        2. "suggested_job_role" (string): The single most appropriate specialist role from the provided list.
        3. "suggested_experience_level" (enum from ['Junior', 'Mid-level', 'Senior', 'Expert']): The most appropriate experience level.
        4. "suggested_day_rate" (object with "min_rate": number, "max_rate": number): A fair day rate range in GBP. Min rate should not be lower than 150.`;
    
        try {
            const response = await ai.models.generateContent({
                model: "gemini-2.5-flash",
                contents: prompt,
                config: {
                    responseMimeType: "application/json",
                    responseSchema: {
                        type: Type.OBJECT,
                        properties: {
                            improved_description: { type: Type.STRING },
                            suggested_job_role: { type: Type.STRING, enum: roleNames },
                            suggested_experience_level: { type: Type.STRING, enum: Object.values(ExperienceLevel) },
                            suggested_day_rate: {
                                type: Type.OBJECT,
                                properties: {
                                    min_rate: { type: Type.NUMBER },
                                    max_rate: { type: Type.NUMBER },
                                },
                                required: ["min_rate", "max_rate"],
                            },
                        },
                        required: ["improved_description", "suggested_job_role", "suggested_experience_level", "suggested_day_rate"],
                    },
                },
            });
            return JSON.parse(response.text);
        } catch (error) {
            console.error("Error analyzing job description:", error);
            return { error: "Failed to analyze job description. The AI service may be busy or unavailable. Please try again." };
        }
    },

    suggestTeamForProject: async (description: string) => {
        const prompt = `Based on this IT/AV project description, suggest a small team of freelance specialists that would be required. For each role, list 2-3 key skills needed.\n\nProject Description: "${description}"`;
        try {
            const response = await ai.models.generateContent({
                model: "gemini-2.5-flash", contents: prompt,
                config: {
                    responseMimeType: "application/json",
                    responseSchema: {
                        type: Type.OBJECT,
                        properties: { team: { type: Type.ARRAY, items: { type: Type.OBJECT, properties: { role: { type: Type.STRING }, skills: { type: Type.ARRAY, items: { type: Type.STRING } } }, required: ["role", "skills"] } } }
                    },
                },
            });
            return JSON.parse(response.text);
        } catch (error) {
            console.error("Error suggesting team:", error);
            return { error: "Failed to suggest a team. The AI service may be busy or unavailable. Please try again." };
        }
    },

    analyzeEngineerCost: async (jobDescription: string, engineerProfile: EngineerProfile) => {
        const prompt = `Analyze the cost-effectiveness of hiring a freelance tech engineer for a project.
        Project Description: "${jobDescription}"
        Engineer Profile:
        - Role: ${engineerProfile.discipline}
        - Experience: ${engineerProfile.experience} years
        - Day Rate Range: ${engineerProfile.currency}${engineerProfile.minDayRate} - ${engineerProfile.maxDayRate}
        - Key Skills: ${engineerProfile.skills?.map(s => `${s.name} (rated ${s.rating}/100)`).join(', ') || 'Not specified'}
        Provide a JSON response with:
        1. "skill_match_assessment" (string): A brief sentence on how well their skills match the project.
        2. "rate_justification" (string): A brief sentence justifying if their day rate is fair, high, or low based on their experience and skills for this project.
        3. "overall_recommendation" (string): A concluding recommendation (e.g., "Highly Recommended", "Good Value", "Consider Alternatives").
        4. "confidence_score" (number): A score from 0 to 100 on your confidence in this analysis.`;
        try {
            const response = await ai.models.generateContent({
                model: "gemini-2.5-flash", contents: prompt,
                config: {
                    responseMimeType: "application/json",
                    responseSchema: {
                        type: Type.OBJECT,
                        properties: {
                            skill_match_assessment: { type: Type.STRING },
                            rate_justification: { type: Type.STRING },
                            overall_recommendation: { type: Type.STRING },
                            confidence_score: { type: Type.NUMBER },
                        }, required: ["skill_match_assessment", "rate_justification", "overall_recommendation", "confidence_score"],
                    },
                },
            });
            return JSON.parse(response.text);
        } catch (error) {
            console.error("Error analyzing cost:", error);
            return { error: "Failed to perform analysis. The AI service may be busy or unavailable. Please try again." };
        }
    },

     findBestMatchesForJob: async (job: Job, engineers: EngineerProfile[]) => {
        const summarizedEngineers = engineers
            .filter(eng => eng.profileTier !== ProfileTier.BASIC && eng.selectedJobRoles && eng.selectedJobRoles.length > 0)
            .map(eng => ({
                id: eng.id,
                experience: eng.experience,
                dayRateRange: `${eng.minDayRate}-${eng.maxDayRate}`,
                rated_skills: eng.selectedJobRoles?.flatMap(role => role.skills) || [],
            }));

        const essentialSkills = job.skillRequirements?.filter(s => s.importance === 'essential').map(s => s.name) || [];
        const desirableSkills = job.skillRequirements?.filter(s => s.importance === 'desirable').map(s => s.name) || [];

        const prompt = `You are an AI-powered talent matching engine for TechSubbies.com. Your task is to analyze a contract job's specific requirements and compare them against a list of freelance engineers to generate a match score for each.

        Contract Requirement Profile:
        - Title: ${job.title}
        - Required Experience Level: ${job.experienceLevel}
        - Essential Skills: ${JSON.stringify(essentialSkills)}
        - Desirable Skills: ${JSON.stringify(desirableSkills)}

        Available Engineers (only premium profiles with rated skills are provided):
        ${JSON.stringify(summarizedEngineers, null, 2)}

        Analysis Rules:
        1.  Calculate a 'match_score' (0-100) for each engineer based on a weighted analysis.
        2.  **Skill Match (70% weight):**
            -   Essential Skills are critical. An engineer's score should be heavily penalized if their self-rated score for any essential skill is below 75. Give a significant bonus if all essential skills are rated 85+.
            -   Desirable Skills add to the score. For each desirable skill an engineer has, add points proportional to their self-rated score.
        3.  **Experience Match (30% weight):**
            -   Compare the engineer's years of experience with the 'Required Experience Level'. An engineer with significantly less experience than required should be scored lower, while someone within or above the expected range should score highly. For contract roles, prioritize skill match slightly over years of experience if the skills are a perfect fit.
        4.  Return a ranked list of ALL provided engineers, from best match to worst.

        Provide the output in JSON format.`;

        try {
            const response = await ai.models.generateContent({
                model: "gemini-2.5-flash", 
                contents: prompt,
                config: {
                    responseMimeType: "application/json",
                    responseSchema: {
                        type: Type.OBJECT,
                        properties: {
                            matches: {
                                type: Type.ARRAY,
                                items: {
                                    type: Type.OBJECT,
                                    properties: {
                                        id: { type: Type.STRING },
                                        match_score: { type: Type.NUMBER },
                                    },
                                    required: ["id", "match_score"]
                                }
                            }
                        },
                        required: ["matches"]
                    },
                },
            });
            return JSON.parse(response.text);
        } catch (error) {
            console.error("Error finding best matches:", error);
            return { error: "Failed to find matches. The AI service may be busy or unavailable. Please try again." };
        }
    },

    suggestDayRate: async (title: string, description: string) => {
        const prompt = `Based on the following freelance job details for the UK tech market (AV & IT), suggest a fair day rate range in GBP.
        
        Job Title: "${title}"
        Job Description: "${description}"
    
        Provide a JSON response with:
        1. "min_rate" (number): The lower end of the suggested day rate range.
        2. "max_rate" (number): The upper end of the suggested day rate range.
        3. "reasoning" (string): A brief, one-sentence justification for this range.`;
        
        try {
            const response = await ai.models.generateContent({
                model: "gemini-2.5-flash",
                contents: prompt,
                config: {
                    responseMimeType: "application/json",
                    responseSchema: {
                        type: Type.OBJECT,
                        properties: {
                            min_rate: { type: Type.NUMBER },
                            max_rate: { type: Type.NUMBER },
                            reasoning: { type: Type.STRING },
                        },
                        required: ["min_rate", "max_rate", "reasoning"],
                    },
                },
            });
            return JSON.parse(response.text);
        } catch (error) {
            console.error("Error suggesting day rate:", error);
            return { error: "Failed to suggest a day rate. The AI service may be busy or unavailable. Please try again." };
        }
    },

    // --- MODERATION ---
    moderateForumPost: async (post: { title: string; content: string }): Promise<{ decision: 'approve' | 'reject'; reason: string } | null> => {
        const prompt = `You are a content moderator for a tech forum called TechSubbies.com. Your ONLY task is to determine if a new post is a job posting, an advertisement for services, or a request for work. The forum is strictly for technical discussions, sharing ideas, and asking for help. It is NOT for job listings.

        Analyze the following post title and content.
        Title: "${post.title}"
        Content: "${post.content}"
        
        The decision should be "approve" if it is clearly a technical discussion, question, or news item.
        The decision should be "reject" if it mentions hiring, job vacancies, looking for work, day rates, or is otherwise an advertisement.
        
        Provide a brief, one-sentence reason for your decision.`;
        
        try {
            const response = await ai.models.generateContent({
                model: "gemini-2.5-flash",
                contents: prompt,
                config: {
                    responseMimeType: "application/json",
                    responseSchema: {
                        type: Type.OBJECT,
                        properties: {
                            decision: {
                                type: Type.STRING,
                                enum: ['approve', 'reject'],
                            },
                            reason: {
                                type: Type.STRING,
                            },
                        },
                        required: ["decision", "reason"]
                    },
                },
            });
            return JSON.parse(response.text);
        } catch (error) {
            console.error("Error moderating forum post:", error);
            return { decision: 'reject', reason: 'AI moderation service failed.' };
        }
    },
};