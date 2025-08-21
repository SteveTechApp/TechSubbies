import { GoogleGenAI, Type } from "@google/genai";
import { EngineerProfile } from '../types.ts';

export const geminiService = (() => {
    if (!process.env.API_KEY || process.env.API_KEY === 'PASTE_YOUR_GEMINI_API_KEY_HERE') {
        console.warn("Gemini API key is not configured. AI features will be disabled.");
        const disabledService = {
            generateDescriptionForProfile: async () => "AI functionality is disabled. Please configure your API key in index.html.",
            generateSkillsForRole: async () => null,
            parseSearchQuery: async () => null,
            suggestTeamForProject: async () => null,
            analyzeEngineerCost: async () => null,
        };
        return disabledService;
    }

    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

    const safeApiCall = async (call) => {
        try {
            return await call();
        } catch (error) {
            console.error("Error calling Gemini API:", error);
            return null;
        }
    };

    const generateDescriptionForProfile = async (profile: EngineerProfile) => {
        const result = await safeApiCall(() => ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: `Create a professional, one-paragraph summary for a freelance tech engineer's profile.
                     Base it on this information:
                     - Role: ${profile.tagline}
                     - Key Skills: ${profile.skills.map(s => `${s.name} (${s.rating}/5)`).join(', ')}
                     - Years of Experience: ${profile.experience}
                     - Location: ${profile.location}
                     Make it concise, impactful, and suitable for a platform connecting engineers with companies.`,
        }));
        return result?.text?.trim() || "Could not generate a description.";
    };

    const generateSkillsForRole = async (role: string) => {
        const result = await safeApiCall(() => ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: `Based on the job title "${role}", list the top 8 most relevant technical skills. 
                     For each skill, provide a rating from 1 to 5 representing its importance for this role, where 5 is most important.`,
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        skills: {
                            type: Type.ARRAY,
                            items: {
                                type: Type.OBJECT,
                                properties: {
                                    name: { type: Type.STRING },
                                    rating: { type: Type.INTEGER }
                                }
                            }
                        }
                    }
                }
            }
        }));

        const text = result?.text;
        if (!text) return null;

        try {
            return JSON.parse(text);
        } catch (e) {
            console.error("Failed to parse Gemini JSON response for skills:", text, e);
            return null;
        }
    };

    const parseSearchQuery = async (query: string) => {
        const result = await safeApiCall(() => ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: `Parse this search query: "${query}" into structured data. Extract key skills, desired location, minimum experience in years (as an integer), and day rate budget (as an integer, without currency symbols).`,
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        skills: { type: Type.ARRAY, items: { type: Type.STRING } },
                        location: { type: Type.STRING },
                        minExperience: { type: Type.INTEGER },
                        maxDayRate: { type: Type.INTEGER }
                    }
                }
            }
        }));
        
        const text = result?.text;
        if (!text) return null;

        try {
            return JSON.parse(text);
        } catch (e) {
            console.error("Failed to parse Gemini JSON response for search query:", text, e);
            return null;
        }
    };

    const suggestTeamForProject = async (description: string) => {
        const result = await safeApiCall(() => ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: `A company needs a team for this project: "${description}". 
                     Suggest 3 distinct job roles (e.g., 'Lead Network Engineer', 'AV Programmer') required for this project. 
                     For each role, list the 3 most critical skills.`,
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        team: {
                            type: Type.ARRAY,
                            items: {
                                type: Type.OBJECT,
                                properties: {
                                    role: { type: Type.STRING },
                                    skills: { type: Type.ARRAY, items: { type: Type.STRING } }
                                }
                            }
                        }
                    }
                }
            }
        }));

        const text = result?.text;
        if (!text) return null;

        try {
            return JSON.parse(text);
        } catch (e) {
            console.error("Failed to parse Gemini JSON response for team suggestion:", text, e);
            return null;
        }
    };

    const analyzeEngineerCost = async (jobDescription: string, engineerProfile: EngineerProfile) => {
        const prompt = `Analyze the cost-effectiveness of hiring a freelance engineer for a specific job.
        Job Description: "${jobDescription}"
        Engineer Profile:
        - Role: ${engineerProfile.tagline}
        - Day Rate: ${engineerProfile.currency}${engineerProfile.dayRate}
        - Key Skills: ${engineerProfile.skills.map(s => s.name).join(', ')}
        - Experience: ${engineerProfile.experience} years
        
        Provide a brief analysis covering:
        1.  skill_match_assessment (string): How well do the engineer's skills match the job? (e.g., "Excellent", "Good", "Partial")
        2.  rate_justification (string): Is the day rate appropriate for their experience and skills? Explain briefly.
        3.  overall_recommendation (string): A concluding recommendation (e.g., "Strong candidate", "Cost-effective choice", "Potentially overpriced").
        4.  confidence_score (number): A score from 0 to 100 on how confident you are in this assessment.`;

        const result = await safeApiCall(() => ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        skill_match_assessment: { type: Type.STRING },
                        rate_justification: { type: Type.STRING },
                        overall_recommendation: { type: Type.STRING },
                        confidence_score: { type: Type.NUMBER }
                    }
                }
            }
        }));
        
        const text = result?.text;
        if (!text) return null;

        try {
            return JSON.parse(text);
        } catch (e) {
            console.error("Failed to parse Gemini JSON response for cost analysis:", text, e);
            return null;
        }
    };

    return {
        generateDescriptionForProfile,
        generateSkillsForRole,
        parseSearchQuery,
        suggestTeamForProject,
        analyzeEngineerCost,
    };
})();