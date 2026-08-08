// FIX: Add Product and ProductFeatures types for new AI method.
import { EngineerProfile, Job, JobSkillRequirement, Skill, Insight, ExperienceLevel, Product, ProductFeatures } from "../types";
import { JOB_ROLE_DEFINITIONS } from '../data/jobRoles';
import { shortlistByRequirementScore, getRequiredLevel, type EvidenceContext } from './skillMatching';
import { secureFetch } from './httpClient';
import { API_BASE_URL } from './apiConfig';

// All AI calls go through the backend now instead of talking to Google's
// Gemini API directly from the browser. The API key lives only on the
// server (backend/.env) - see backend/src/routes/ai.ts. This file keeps
// the exact same public methods as before so nothing else in the app has
// to change.
const fetch = secureFetch;

// These are the JSON schema primitive names accepted by the backend AI
// endpoint. Importing the full browser SDK for this five-value enum added
// hundreds of kilobytes to every initial page despite all model calls being
// server-side.
const Type = {
    OBJECT: 'OBJECT',
    ARRAY: 'ARRAY',
    STRING: 'STRING',
    INTEGER: 'INTEGER',
    BOOLEAN: 'BOOLEAN',
} as const;

async function postJSON(path: string, body: unknown): Promise<any> {
    try {
        const response = await fetch(`${API_BASE_URL}${path}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body),
        });
        const data = await response.json();
        if (!response.ok) {
            return { error: data?.error || `Request failed with status ${response.status}.` };
        }
        return data;
    } catch (error: any) {
        return { error: error.message || "Could not reach the AI service." };
    }
}

export interface ChatTurn {
    role: 'user' | 'model';
    text: string;
}

// Mimics the small slice of the @google/genai Chat interface the app
// actually uses (sendMessage), but talks to our backend instead. The
// server holds no session state, so this class keeps the running
// history and resends it with every message.
export class BackendChatSession {
    private history: ChatTurn[] = [];

    async sendMessage({ message }: { message: string }): Promise<{ text: string }> {
        const result = await postJSON('/ai/chat', { history: this.history, message });
        if (result.error) {
            throw new Error(result.error);
        }
        this.history.push({ role: 'user', text: message });
        this.history.push({ role: 'model', text: result.text });
        return { text: result.text };
    }
}

class GeminiService {
    public chat: BackendChatSession = new BackendChatSession();

    private async generateWithSchema(prompt: string, schema: any): Promise<any> {
        const result = await postJSON('/ai/generate', { prompt, schema });
        if (result.error) {
            console.error("Error generating content with schema:", result.error);
            return { error: result.error };
        }
        return result.result;
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
             // First 4 default to a higher required level ("Excellent"), the
             // rest to "Good" - a reasonable starting point the company can
             // then adjust with the slider.
             const suggestedSkills = skills.map((skill, index) => {
                 const requiredLevel = index < 4 ? 65 : 35;
                 return {
                     name: skill.name,
                     requiredLevel,
                     importance: requiredLevel >= 60 ? 'essential' : 'desirable',
                 } as JobSkillRequirement;
             });
             return { skills: suggestedSkills };
         }
         return { error: 'Could not find definition for the selected role.' };
    }

    // Method used in InstantInviteModal.tsx and FindTalentFilters.tsx.
    // Numeric skill levels do real work here: engineers are first ranked
    // deterministically by how well their own 0-100 skill ratings meet each
    // required level (see services/skillMatching.ts), and only that
    // shortlist is handed to the AI for final ranking/explanation - so the
    // sliders actually gate who's considered, not just wording in a prompt.
    async findBestMatchesForJob(job: Job, engineers: EngineerProfile[], evidenceContext?: EvidenceContext): Promise<any> {
        const shortlisted = shortlistByRequirementScore(engineers, job, 15, evidenceContext);

        const engineerProfiles = shortlisted.map(e => {
            const engineerSkills = e.selectedJobRoles?.flatMap(r => r.skills.map(s => `${s.name} (${s.rating})`)).join(', ') || 'No detailed skills listed';
            return `ID: ${e.id}, Role: ${e.selectedJobRoles?.map(r => r.roleName).join(', ') || e.discipline}, Skills: ${engineerSkills}, Requirement match: ${e.requirementScore}/100, Experience: ${e.experience}yrs, Rate: £${e.minDayRate}-${e.maxDayRate}`;
        }).join('\n');

        const jobReqs = `Title: ${job.title}, Required Skills: ${job.skillRequirements.map(s => `${s.name} (level ${getRequiredLevel(s)}/100, ${s.importance})`).join(', ')}`;

        const prompt = `From the following list of engineers, find the top 5 best matches for the job. Provide only a JSON array of objects with "id" and "match_score" (0-100). Each engineer's "Requirement match" score already reflects how well their own skill levels meet the job's required levels - use it as a strong signal alongside relevant role and experience.

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

        const result = await this.generateWithSchema(prompt, schema);

        // Blend the AI's contextual score with the deterministic requirement
        // score so a fluky AI number can't override a candidate who
        // genuinely doesn't meet the required levels, or bury one who does.
        if (result && Array.isArray(result.matches)) {
            result.matches = result.matches.map((match: { id: string; match_score: number }) => {
                const candidate = shortlisted.find(e => e.id === match.id);
                if (!candidate) return match;
                const blended = Math.round((match.match_score + candidate.requirementScore) / 2);
                return { ...match, match_score: blended };
            });
        }

        return result;
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
        return postJSON('/ai/query-cv', { cvContent, query });
    }

    // Method for tutorial video generation (script + video)
    async generateTutorialVideo(topic: string): Promise<{ title: string; script: string; videoUrl: string; error?: string }> {
        const result = await postJSON('/ai/tutorial-video', { topic });
        if (result.error && !result.title) {
            return { title: '', script: '', videoUrl: '', error: result.error };
        }
        return result;
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

    // Used by ChatWindow.tsx to translate an incoming message into the
    // reader's preferred language (SettingsContext's `language`). Detects
    // the source language server-side so the UI can label the original
    // ("Show original (French)") without asking the user what language
    // they wrote in.
    async translateText(text: string, targetLanguage: string): Promise<{ translatedText?: string; detectedSourceLanguage?: string; error?: string }> {
        return postJSON('/ai/translate', { text, targetLanguage });
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
