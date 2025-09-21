import { GoogleGenAI, Type, Chat } from "@google/genai";
// FIX: Add Product and ProductFeatures types for new AI method.
import { EngineerProfile, Job, JobSkillRequirement, Skill, Insight, ExperienceLevel, Product, ProductFeatures } from "../types";
import { JOB_ROLE_DEFINITIONS } from '../data/jobRoles';

class GeminiService {
    private ai: GoogleGenAI;
    public chat: Chat | null = null;

    constructor() {
        if (!process.env.API_KEY) {
            console.error("API_KEY environment variable not set.");
            // Allow app to load, features will fail gracefully.
            this.ai = null!; 
            return;
        }
        this.ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
        this.chat = this.ai.chats.create({
            model: "gemini-2.5-flash",
            config: {
                systemInstruction: "You are a helpful AI assistant for the TechSubbies.com platform, a freelance network for AV and IT engineers. Be concise and helpful.",
            }
        });
    }

    private async generateWithSchema(prompt: string, schema: any): Promise<any> {
        if (!this.ai) return { error: "Gemini Service not initialized. Check API Key." };
        try {
            const response = await this.ai.models.generateContent({
                model: "gemini-2.5-flash",
                contents: prompt,
                config: {
                    responseMimeType: "application/json",
                    responseSchema: schema,
                },
            });

            const jsonStr = response.text.trim();
            if (!jsonStr) {
                throw new Error("Empty response from AI model.");
            }
            return JSON.parse(jsonStr);
        } catch (error: any) {
            console.error("Error generating content with schema:", error);
            const errorMessage = error.message || "Failed to get a valid response from the AI model.";
            return { error: errorMessage };
        }
    }
    
    private getEngineerSkillsString(engineer: EngineerProfile, includeRating: boolean = true): string {
        const skillsFromRoles = engineer.selectedJobRoles?.flatMap(role => 
            role.skills.map(skill => includeRating ? `${skill.name} (${skill.rating})` : skill.name)
        ) || [];
        return [...new Set(skillsFromRoles)].join(', ');
    }

    // Method used in AISkillDiscovery.tsx
    async generateSkillsForRole(role: string): Promise<{ skills?: Skill[], error?: string }> {
        const prompt = `Based on the job role "${role}", suggest 5-8 relevant, granular technical skills an engineer should have. Provide a default competency rating between 40-70 for each skill.`;
        const schema = {
            type: Type.OBJECT,
            properties: {
                skills: {
                    type: Type.ARRAY,
                    items: {
                        type: Type.OBJECT,
                        properties: {
                            name: { type: Type.STRING },
                            rating: { type: Type.INTEGER },
                        }
                    }
                }
            }
        };
        return this.generateWithSchema(prompt, schema);
    }
    
    // Method used in AIEngineerCostAnalysis.tsx
    async analyzeEngineerCost(jobDescription: string, engineer: EngineerProfile): Promise<any> {
        const engineerSkills = this.getEngineerSkillsString(engineer);
        const prompt = `Analyze the cost-effectiveness of an engineer for a specific job.
        Job Description: "${jobDescription}"
        Engineer Profile: Name: ${engineer.name}, Experience: ${engineer.experience} years, Day Rate Range: £${engineer.minDayRate}-£${engineer.maxDayRate}, Skills from Specialist Roles: ${engineerSkills}.
        
        Provide a JSON response assessing skill match, justifying the rate, giving an overall recommendation, and a confidence score.`;
        
         const schema = {
            type: Type.OBJECT,
            properties: {
                skill_match_assessment: { type: Type.STRING },
                rate_justification: { type: Type.STRING },
                overall_recommendation: { type: Type.STRING },
                confidence_score: { type: Type.INTEGER },
            }
        };
        return this.generateWithSchema(prompt, schema);
    }

    // Method used in TrainingRecommendations.tsx
    async getTrainingRecommendations(profile: EngineerProfile): Promise<any> {
        const existingCerts = profile.certifications?.map(c => c.name).join(', ') || 'None';
        const engineerSkills = this.getEngineerSkillsString(profile, false);
        const prompt = `Analyze this AV/IT engineer's profile and suggest 2-3 specific, valuable training courses or certifications that would likely increase their day rate or job opportunities. For each, provide a brief reason.
        Profile: Experience: ${profile.experience} years, Discipline: ${profile.discipline}, Existing Certs: ${existingCerts}, Skills from Specialist Roles: ${engineerSkills}.`;

        const schema = {
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
                        }
                    }
                }
            }
        };
        return this.generateWithSchema(prompt, schema);
    }
    
    // Method used in AICoachView.tsx
    async getCareerCoaching(profile: EngineerProfile): Promise<{ insights?: Insight[], error?: string }> {
        const engineerSkills = this.getEngineerSkillsString(profile, false);
        const prompt = `Analyze this AV/IT engineer's profile against current market trends for freelance contracts. Provide 3 actionable insights to help them advance their career and increase their day rate. For each insight, suggest a type ('Upskill', 'Certification', 'Profile Enhancement'), a specific suggestion, and a call-to-action with text and a relevant dashboard view from this list: ['AI Tools', 'Manage Profile', 'Job Search'].

        Engineer Profile:
        - Experience: ${profile.experience} years
        - Discipline: ${profile.discipline}
        - Current Certifications: ${profile.certifications?.map(c => c.name).join(', ') || 'None'}
        - Skills from Specialist Roles: ${engineerSkills}
        - Specialist Roles: ${profile.selectedJobRoles?.map(r => r.roleName).join(', ') || 'None'}

        Respond in JSON format.`;

        const schema = {
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
                                }
                            }
                        },
                        required: ['type', 'suggestion', 'callToAction']
                    }
                }
            }
        };

        return this.generateWithSchema(prompt, schema);
    }

    // Method used in AIJobHelper.tsx
    async analyzeJobDescription(title: string, description: string): Promise<any> {
        const prompt = `Analyze and improve the following job description for a freelance tech role.
        Original Title: "${title}"
        Original Description: "${description}"

        Based on the text, provide:
        1. An improved, clearer, and more engaging description.
        2. A suggested standardized job role from this list: [${JOB_ROLE_DEFINITIONS.map(r => `"${r.name}"`).join(', ')}].
        3. A suggested experience level (Junior, Mid-level, Senior, Expert).
        4. A suggested market-rate day rate range (min and max).
        5. Three alternative, compelling job titles.`;
        
        const schema = {
            type: Type.OBJECT,
            properties: {
                improved_description: { type: Type.STRING },
                suggested_job_role: { type: Type.STRING },
                suggested_experience_level: { type: Type.STRING },
                suggested_day_rate: {
                    type: Type.OBJECT,
                    properties: { min_rate: { type: Type.INTEGER }, max_rate: { type: Type.INTEGER } }
                },
                suggested_titles: { type: Type.ARRAY, items: { type: Type.STRING } }
            }
        };
        return this.generateWithSchema(prompt, schema);
    }
    
     // Method used in JobPostStep2.tsx
    async suggestSkillsForJobRole(jobRole: string): Promise<{ skills?: JobSkillRequirement[], error?: string }> {
         const roleDef = JOB_ROLE_DEFINITIONS.find(r => r.name === jobRole);
         if (roleDef) {
             const skills = roleDef.skillCategories.flatMap(cat => cat.skills).slice(0, 10);
             const suggestedSkills = skills.map((skill, index) => ({
                 name: skill.name,
                 importance: index < 4 ? 'essential' : 'desirable'
             } as JobSkillRequirement));
             return { skills: suggestedSkills };
         }
         return { error: 'Could not find definition for the selected role.' };
    }
    
    // Method used in InstantInviteModal.tsx
    async findBestMatchesForJob(job: Job, engineers: EngineerProfile[]): Promise<any> {
        const engineerProfiles = engineers.map(e => {
            const engineerSkills = e.selectedJobRoles?.flatMap(r => r.skills.map(s => `${s.name} (${s.rating})`)).join(', ') || 'No detailed skills listed';
            return `ID: ${e.id}, Role: ${e.selectedJobRoles?.map(r => r.roleName).join(', ') || e.discipline}, Skills: ${engineerSkills}, Experience: ${e.experience}yrs, Rate: £${e.minDayRate}-${e.maxDayRate}`;
        }).join('\n');
        
        const jobReqs = `Title: ${job.title}, Required Skills: ${job.skillRequirements.map(s => `${s.name} (${s.importance})`).join(', ')}`;
        
        const prompt = `From the following list of engineers, find the top 5 best matches for the job. Provide only a JSON array of objects with "id" and "match_score" (0-100). Prioritize essential skills, relevant roles, and experience.
        
        Job Requirements:
        ${jobReqs}
        
        Available Engineers:
        ${engineerProfiles}`;
        
         const schema = {
            type: Type.OBJECT,
            properties: {
                matches: {
                    type: Type.ARRAY,
                    items: {
                        type: Type.OBJECT,
                        properties: {
                            id: { type: Type.STRING },
                            match_score: { type: Type.INTEGER }
                        }
                    }
                }
            }
        };
        return this.generateWithSchema(prompt, schema);
    }
    
     // Method for Forum Moderation
    async moderateForumPost(title: string, content: string): Promise<{ is_safe: boolean, reason: string }> {
        const prompt = `Analyze the following forum post for violations. The forum is for technical AV/IT discussion only. Prohibited content includes job listings, advertisements, requests for work, spam, or abusive language.
        
        Title: "${title}"
        Content: "${content}"
        
        Is this post safe for the forum? Respond in JSON format.`;

        const schema = {
            type: Type.OBJECT,
            properties: {
                is_safe: { type: Type.BOOLEAN },
                reason: { type: Type.STRING, description: "If not safe, provide a brief reason for rejection." }
            }
        };
        const result = await this.generateWithSchema(prompt, schema);
        if (result.error) {
            // Default to safe if AI fails, to avoid blocking legitimate posts.
            return { is_safe: true, reason: 'AI moderation failed.' };
        }
        return result;
    }
    
    // Method for CV Querying
    async queryCV(cvContent: string, query: string): Promise<{ answer?: string, error?: string }> {
        if (!this.ai) return { error: "Gemini Service not initialized. Check API Key." };
        try {
            const prompt = `You are an expert technical recruiter analyzing a CV. Based ONLY on the CV text provided below, answer the user's query concisely. If the information is not in the CV, state that clearly.

            CV TEXT:
            ---
            ${cvContent}
            ---

            USER QUERY: "${query}"`;
            
            const response = await this.ai.models.generateContent({
                model: "gemini-2.5-flash",
                contents: prompt,
            });
            
            const answer = response.text.trim();
            if (!answer) {
                throw new Error("Empty response from AI model.");
            }
            return { answer };
        } catch (error: any) {
            console.error("Error querying CV:", error);
            return { error: error.message || "Failed to get a valid response from the AI model." };
        }
    }

    // Updated method for Live Video Generation
    async generateTutorialVideo(topic: string): Promise<{ title: string; script: string; videoUrl: string; error?: string }> {
        if (!this.ai) return { title: '', script: '', videoUrl: '', error: "Gemini Service not initialized. Check API Key." };

        try {
            // Step 1: Generate the script first
            const scriptPrompt = `Create a script for a short, engaging tutorial video titled "${topic}". Break it into clear steps. The tone should be friendly and encouraging. Respond in JSON format with "title" and "script".`;
            const scriptSchema = {
                type: Type.OBJECT,
                properties: { title: { type: Type.STRING }, script: { type: Type.STRING } }
            };
            const scriptResponse = await this.generateWithSchema(scriptPrompt, scriptSchema);
            if (scriptResponse.error) throw new Error(scriptResponse.error);
            const { title, script } = scriptResponse;

            // Step 2: Start the video generation operation using the generated script
            console.log("[Gemini] Starting video generation for:", title);
            const videoPrompt = `An engaging, clean, corporate-style tutorial video for a software platform, with on-screen text callouts, based on the following script: ${script}`;
            let operation = await this.ai.models.generateVideos({
                model: 'veo-2.0-generate-001',
                prompt: videoPrompt,
                config: { numberOfVideos: 1 }
            });
            console.log("[Gemini] Video operation started:", operation);

            // Step 3: Poll for completion
            while (!operation.done) {
                console.log("[Gemini] Waiting for video generation... Polling again in 10s.");
                await new Promise(resolve => setTimeout(resolve, 10000));
                operation = await this.ai.operations.getVideosOperation({ operation: operation });
            }
            console.log("[Gemini] Video generation finished:", operation);

            // Step 4: Extract and return the video URI
            const downloadLink = operation.response?.generatedVideos?.[0]?.video?.uri;
            if (!downloadLink) throw new Error("Video generation completed but no download link was found.");
            
            const videoUrl = `${downloadLink}&key=${process.env.API_KEY}`;
            
            return { title, script, videoUrl };
        } catch (error: any) {
            console.error("Error in generateTutorialVideo:", error);
            return { error: error.message || "Failed to generate video.", title: '', script: '', videoUrl: '' };
        }
    }

    // FIX: Add method for Product Analysis
    // Method for Product Analysis
    async analyzeProductForFeatures(product: Product): Promise<ProductFeatures | { error: string }> {
        const prompt = `Analyze the following AV product description and extract its key technical features.
        
        Product SKU: ${product.sku}
        Product Name: ${product.name}
        Description: "${product.description}"

        Provide a JSON response with the following structure:
        - maxResolution (string, e.g., "4K60 4:4:4", "1080p")
        - ioPorts (object with 'inputs' and 'outputs' arrays. Each item in the array should be an object with 'count' and 'type', e.g., {count: 2, type: "HDMI"})
        - keyFeatures (array of strings, e.g., ["Video Wall", "PoE", "USB 2.0"])
        - idealApplication (string, a brief description of the best use case for this product)
        `;
        
        const schema = {
            type: Type.OBJECT,
            properties: {
                maxResolution: { type: Type.STRING },
                ioPorts: {
                    type: Type.OBJECT,
                    properties: {
                        inputs: { type: Type.ARRAY, items: { type: Type.OBJECT, properties: { count: { type: Type.INTEGER }, type: { type: Type.STRING } } } },
                        outputs: { type: Type.ARRAY, items: { type: Type.OBJECT, properties: { count: { type: Type.INTEGER }, type: { type: Type.STRING } } } }
                    }
                },
                keyFeatures: { type: Type.ARRAY, items: { type: Type.STRING } },
                idealApplication: { type: Type.STRING }
            }
        };

        return this.generateWithSchema(prompt, schema);
    }

    // Simple mock for AI auto-reply
    getAutoReply(incomingMessage: string): string {
        const lowerCaseMessage = incomingMessage.toLowerCase();
        if (lowerCaseMessage.includes("bonjour") || lowerCaseMessage.includes("comment vas tu")) {
            return "Bonjour! Je vais bien, merci. Comment puis-je vous aider avec votre projet AV?";
        }
        if (lowerCaseMessage.includes("spec sheet") || lowerCaseMessage.includes("quote")) {
            return "Great, I've received that. I will review it and get back to you with a quote shortly.";
        }
        if (lowerCaseMessage.includes("available")) {
            return "Thanks for confirming. My availability is up-to-date on my profile, but let me know the exact dates you have in mind.";
        }
        return "Acknowledged. I will get back to you on this as soon as possible.";
    }
}

export const geminiService = new GeminiService();