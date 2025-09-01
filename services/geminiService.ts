import { GoogleGenAI, Type, Chat } from "@google/genai";
import { EngineerProfile, Job, ProfileTier, User, Message, CompanyProfile, JobSkillRequirement } from '../types/index.ts';

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const SYSTEM_INSTRUCTION = `You are the TechSubbies.com AI Assistant. Your role is to help users navigate the platform and answer their questions. 
TechSubbies is a platform that connects freelance AV & IT engineers with companies.
- Companies can post jobs for free.
- Engineers can create a basic profile for free.
- Engineers can upgrade to a paid "Skills Profile" to get more features and better visibility.
- Be friendly, concise, and helpful. Do not make up features that don't exist.
- If you don't know the answer, say "I'm not sure about that, but you can contact our support team at support@techsubbies.com."`;


export const geminiService = {
    startChat: (): Chat => {
        return ai.chats.create({
            model: 'gemini-2.5-flash',
            config: {
                systemInstruction: SYSTEM_INSTRUCTION,
            },
        });
    },

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
            return String(response.text).trim();
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
            return JSON.parse(String(response.text));
        } catch (error) {
            console.error("Error generating skills:", error);
            return null;
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
            return JSON.parse(String(response.text));
        } catch (error) {
            console.error("Error suggesting team:", error);
            return null;
        }
    },
    analyzeEngineerCost: async (jobDescription: string, engineerProfile: EngineerProfile) => {
        const prompt = `Analyze the cost-effectiveness of hiring a freelance tech engineer for a project.
        Project Description: "${jobDescription}"
        Engineer Profile:
        - Role: ${engineerProfile.discipline}
        - Experience: ${engineerProfile.experience} years
        - Day Rate: ${engineerProfile.currency}${engineerProfile.dayRate}
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
            return JSON.parse(String(response.text));
        } catch (error) {
            console.error("Error analyzing cost:", error);
            return null;
        }
    },
    getTrainingRecommendations: async (profile: EngineerProfile) => {
        const lowRatedSkills = profile.skills?.filter(s => s.rating < 75).map(s => s.name).join(', ');
        const highRatedSkills = profile.skills?.filter(s => s.rating >= 75).map(s => s.name).join(', ');

        const prompt = `Act as a career advisor for a freelance ${profile.discipline}.
        Their goal is to increase their day rate and get more contract offers.
        
        Here is their current skill profile:
        - High-rated skills (>75/100): ${highRatedSkills || 'None'}
        - Lower-rated skills (<75/100): ${lowRatedSkills || 'None'}

        Based on this, suggest 2 or 3 specific, actionable training courses or certifications that would provide the highest return on investment. 
        For each suggestion, provide:
        1. "courseName" (string): The name of the certification or course (e.g., "Cisco CCNP Enterprise", "AWS Certified Solutions Architect - Associate").
        2. "reason" (string): A brief, compelling reason why this is a good choice for them, explaining how it complements their existing skills or addresses a weakness.
        3. "keywords" (array of strings): A list of 2-3 keywords related to the course (e.g., ["Networking", "Routing", "Cisco"]).

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
                                        keywords: { type: Type.ARRAY, items: { type: Type.STRING } }
                                    },
                                    required: ["courseName", "reason", "keywords"]
                                }
                            }
                        }
                    },
                },
            });
            return JSON.parse(String(response.text));
        } catch (error) {
            console.error("Error getting training recommendations:", error);
            return null;
        }
    },
     findBestMatchesForJob: async (job: Job, engineers: EngineerProfile[]) => {
        const summarizedEngineers = engineers
            .filter(eng => eng.profileTier !== ProfileTier.BASIC && eng.selectedJobRoles && eng.selectedJobRoles.length > 0)
            .map(eng => ({
                id: eng.id,
                experience: eng.experience,
                dayRate: eng.dayRate,
                rated_skills: eng.selectedJobRoles?.flatMap(role => role.skills) || [],
            }));

        const essentialSkills = job.skillRequirements?.filter(s => s.importance === 'essential').map(s => s.name) || [];
        const desirableSkills = job.skillRequirements?.filter(s => s.importance === 'desirable').map(s => s.name) || [];

        const prompt = `You are an AI-powered talent matching engine for TechSubbies.com. Your task is to analyze a job's specific skill requirements and compare them against a list of freelance engineers to generate a match score for each.

        Job Requirement Profile:
        - Title: ${job.title}
        - Required Experience Level: ${job.experienceLevel}
        - Essential Skills: ${JSON.stringify(essentialSkills)}
        - Desirable Skills: ${JSON.stringify(desirableSkills)}

        Available Engineers (only premium profiles with rated skills are provided):
        ${JSON.stringify(summarizedEngineers, null, 2)}

        Analysis Rules:
        1.  Calculate a 'match_score' (0-100) for each engineer.
        2.  Essential Skills are critical. An engineer's score should be heavily penalized if their self-rated score for any essential skill is below 75. Give a significant bonus if all essential skills are rated 85+.
        3.  Desirable Skills add to the score. For each desirable skill an engineer has, add points proportional to their self-rated score.
        4.  Factor in experience. An engineer's experience should be appropriate for the role's required level.
        5.  Return a ranked list of ALL provided engineers, from best match to worst.

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
            return JSON.parse(String(response.text));
        } catch (error) {
            console.error("Error finding best matches:", error);
            return null;
        }
    },
    // NEW: AI Forum Moderator
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
            return JSON.parse(String(response.text));
        } catch (error) {
            console.error("Error moderating forum post:", error);
            return { decision: 'reject', reason: 'AI moderation service failed.' };
        }
    },
    // NEW: AI Day Rate Suggester
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
            return JSON.parse(String(response.text));
        } catch (error) {
            console.error("Error suggesting day rate:", error);
            return null;
        }
    },
    // NEW: AI Chat Responder
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
            return String(response.text).trim();

        } catch (error) {
            console.error("Error generating chat response:", error);
            return "Sorry, I'm having trouble responding right now. Please try again later.";
        }
    },
};