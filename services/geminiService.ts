// FIX: Corrected imports to include necessary types for mock implementation and function signatures.
import { GoogleGenAI, Type, Chat, GenerateContentResponse, SendMessageParameters } from "@google/genai";
import { EngineerProfile, Job, JobSkillRequirement, Skill, ExperienceLevel } from "../types";
import { JOB_ROLE_DEFINITIONS } from "../data/jobRoles";
import { AnalysisResult } from "../components/AIEngineerCostAnalysis";

class GeminiService {
    private ai: GoogleGenAI;
    public chatSession: Chat;

    constructor() {
        if (!process.env.API_KEY) {
            console.error("API_KEY environment variable not set. Using a mock implementation.");
            // @ts-ignore
            this.ai = {
                chats: {
                    // FIX: Updated mock to match the expected signature and return type of the Gemini API.
                    create: () => ({
                        sendMessage: async (params: SendMessageParameters): Promise<GenerateContentResponse> => {
                            await this.mockApiDelay();
                            const messageText = typeof params.message === 'string' ? params.message : 'a complex prompt';
                            // FIX: Simplified the mock response to only include the 'text' property and cast it.
                            // This resolves obscure type errors caused by the complex GenerateContentResponse interface.
                            const response = {
                                text: `This is a mocked AI response to: "${messageText}"`,
                            };
                            return response as GenerateContentResponse;
                        }
                    } as Chat) // FIX: Cast the mock chat session object to the Chat type to resolve the type error.
                }
            };
        } else {
             this.ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
        }
        
        this.chatSession = this.ai.chats.create({
            model: 'gemini-2.5-flash',
            config: {
                systemInstruction: "You are a helpful AI assistant for the TechSubbies.com platform, a freelance marketplace for AV and IT engineers. Your goal is to provide concise, helpful, and context-aware answers to user questions. Be friendly and professional.",
            }
        });
    }

    private mockApiDelay(ms = 1000) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    // --- MOCK IMPLEMENTATIONS ---

    async generateSkillsForRole(roleName: string): Promise<{ skills?: Skill[], error?: string }> {
        await this.mockApiDelay();
        try {
            const roleDef = JOB_ROLE_DEFINITIONS.find(r => r.name === roleName);
            if (!roleDef) {
                return { error: `Could not find definition for role: ${roleName}` };
            }
            const allSkills = roleDef.skillCategories.flatMap(sc => sc.skills);
            const selectedSkills = allSkills.sort(() => 0.5 - Math.random()).slice(0, 10);
            const skills: Skill[] = selectedSkills.map(s => ({
                name: s.name,
                rating: Math.floor(Math.random() * 50) + 25, // Random rating between 25 and 75
            }));
            return { skills };
        } catch (e: any) {
            return { error: e.message };
        }
    }

    async analyzeEngineerCost(jobDescription: string, engineer: EngineerProfile): Promise<AnalysisResult | { error: string }> {
        await this.mockApiDelay(1500);
        const avgRate = (engineer.minDayRate + engineer.maxDayRate) / 2;
        const confidence = Math.round(Math.random() * 20 + 75); // 75-95%
        return {
            skill_match_assessment: `The engineer's skills in ${engineer.skills?.slice(0, 2).map(s => s.name).join(', ')} are a strong fit for the job requirements.`,
            rate_justification: `Their average day rate of £${avgRate} is within the expected market range for an engineer with ${engineer.experience} years of experience.`,
            overall_recommendation: "This engineer represents good value for the cost. Recommend proceeding with an interview.",
            confidence_score: confidence,
        };
    }

    async getTrainingRecommendations(profile: EngineerProfile): Promise<{ recommendations?: any[], error?: string }> {
        await this.mockApiDelay(1500);
        return {
            recommendations: [
                { courseName: "Advanced Crestron DM NVX-D Certification", reason: "Your profile shows strong Crestron skills but lacks the latest network AV certification, which is in high demand for corporate projects.", keywords: ["Crestron", "DM NVX"], providerName: "Crestron Technical Institute" },
                { courseName: "Cisco CCNA 200-301", reason: "Adding a formal networking certification like CCNA would complement your AV expertise and open up more complex integration roles.", keywords: ["Cisco", "Networking"], providerName: "Cisco Networking Academy" },
                { courseName: "AVIXA CTS-D (Design Specialization)", reason: "With your years of experience, pursuing the CTS-D certification would validate your design skills and allow you to command a higher day rate on design-and-build projects.", keywords: ["CTS", "CTS-D"], providerName: "AVIXA Training" },
            ]
        };
    }

    async findBestMatchesForJob(job: Job, engineers: EngineerProfile[]): Promise<{ matches?: {id: string, match_score: number}[], error?: string }> {
        await this.mockApiDelay(2000);
        const matches = engineers
            .map(eng => ({
                id: eng.id,
                match_score: Math.floor(Math.random() * (98 - 65 + 1)) + 65, // Random score between 65 and 98
            }))
            .sort((a, b) => b.match_score - a.match_score);
        return { matches };
    }
    
    async analyzeJobDescription(title: string, description: string): Promise<any> {
        await this.mockApiDelay(1500);
        return {
            improved_description: `${description}\n\nKey Responsibilities:\n- Commissioning and testing of AV systems.\n- Troubleshooting and resolving issues on-site.\n- Maintaining clear documentation.`,
            suggested_job_role: "AV Commissioning Engineer",
            // FIX: `ExperienceLevel` was not defined. Imported it from types.
            suggested_experience_level: ExperienceLevel.SENIOR,
            suggested_day_rate: { min_rate: 500, max_rate: 600 },
            suggested_titles: [ "Senior AV Engineer", "AV Commissioning Lead", "Site Lead (AV)" ]
        };
    }
    
    async suggestSkillsForJobRole(roleName: string): Promise<{ skills?: JobSkillRequirement[], error?: string }> {
        await this.mockApiDelay(800);
        const roleDef = JOB_ROLE_DEFINITIONS.find(r => r.name === roleName);
        if (!roleDef) return { error: "Role not found" };
        
        const allSkills = roleDef.skillCategories.flatMap(sc => sc.skills.map(s => s.name));
        const skills: JobSkillRequirement[] = allSkills.slice(0, 10).map((name, index) => ({
            name,
            importance: index < 4 ? 'essential' : 'desirable',
        }));
        return { skills };
    }
}

export const geminiService = new GeminiService();