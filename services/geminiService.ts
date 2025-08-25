import { GoogleGenAI, Type, Chat } from "@google/genai";
import { EngineerProfile } from '../types/index.ts';

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

        if (profile.profileTier === 'paid') {
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
        - Key Skills: ${engineerProfile.skills.map(s => `${s.name} (rated ${s.rating}/100)`).join(', ')}
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
        const lowRatedSkills = profile.skills.filter(s => s.rating < 75).map(s => s.name).join(', ');
        const highRatedSkills = profile.skills.filter(s => s.rating >= 75).map(s => s.name).join(', ');

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
};