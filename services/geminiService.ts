import { GoogleGenAI, Type } from "@google/genai";
import { SkillDiscoveryResult, Currency } from '../types';

// Ensure the API key is available in the environment variables
const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  // In a real app, you might have a more robust error handling or config setup
  console.error("Gemini API key not found. Please set the API_KEY environment variable.");
}

const ai = new GoogleGenAI({ apiKey: API_KEY! });

export const generateJobDescription = async (title: string, keywords: string): Promise<string> => {
  if (!API_KEY) {
    return "API Key not configured. Please check the environment setup.";
  }
  
  const prompt = `
    You are an expert recruitment consultant for the tech industry.
    Your task is to write a professional, clear, and appealing job description.

    Job Title: ${title}

    Keywords and Key Responsibilities/Skills to include: ${keywords}

    Based on the information above, generate a job description that is approximately 100-150 words long. 
    Structure it with the following sections:
    1.  **Role Overview:** A brief summary of the position.
    2.  **Key Responsibilities:** A bulleted list of main duties.
    3.  **Required Skills:** A bulleted list of essential qualifications and skills.

    Do not include any information about salary, company details, or how to apply. Focus only on the role itself.
    `;

  try {
    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
        config: {
          temperature: 0.7,
        }
    });
    return response.text;
  } catch (error) {
    console.error("Error generating job description with Gemini:", error);
    return "There was an error generating the job description. Please try again.";
  }
};


export const generateSkillsForRole = async (jobCategory: string): Promise<SkillDiscoveryResult | null> => {
    if (!API_KEY) {
        console.error("API Key not configured.");
        return null;
    }

    const prompt = `
        Acting as an expert recruitment consultant and tech industry analyst for a platform connecting freelance engineers with jobs, your task is to analyze the following high-level job category and break it down into more specific, niche job titles and skills.

        Job Category: "${jobCategory}"

        Based on this category, provide:
        1. A list of 3-5 specific, modern, and hireable job titles that fall under this category.
        2. A list of 8-10 niche, in-demand technical skills associated with this category. For each skill, provide a brief, one-sentence description of what it is.

        Return the result in a structured JSON format.
    `;

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
            config: {
                temperature: 0.5,
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        suggestedJobTitles: {
                            type: Type.ARRAY,
                            items: { type: Type.STRING },
                            description: "A list of specific job titles related to the category."
                        },
                        nicheSkills: {
                            type: Type.ARRAY,
                            items: {
                                type: Type.OBJECT,
                                properties: {
                                    name: { type: Type.STRING, description: "The name of the niche skill." },
                                    description: { type: Type.STRING, description: "A brief, one-sentence description of the skill." }
                                },
                                required: ["name", "description"]
                            },
                            description: "A list of niche skills with their descriptions."
                        }
                    },
                    required: ["suggestedJobTitles", "nicheSkills"]
                },
            }
        });

        const jsonString = response.text.trim();
        return JSON.parse(jsonString) as SkillDiscoveryResult;

    } catch (error) {
        console.error("Error generating skills with Gemini:", error);
        return null;
    }
};

export const analyzeEngineerRates = async (roleTitle: string, avgDayRate: number, engineerCount: number, currency: Currency): Promise<string> => {
    if (!API_KEY) {
        return "API Key not configured. Please check the environment setup.";
    }

    const prompt = `
        You are an expert financial analyst for a tech recruitment platform.
        Your task is to provide a concise summary of the market rates for a specific freelance role based on internal data.

        Role Title: "${roleTitle}"
        Average Day Rate: ${currency}${avgDayRate}
        Number of Data Points (Engineers): ${engineerCount}

        Based on this data, provide a brief analysis. The tone should be professional and informative, suitable for advising clients or platform users.
        
        The analysis must include:
        1. A statement confirming the average day rate based on the provided data points.
        2. A concluding sentence about the market position of this role (e.g., "This suggests a strong market demand for skilled ${roleTitle}s.").

        Format the output as a single paragraph of plain text. Do not use markdown or bullet points.
        Example output structure:
        "Based on data from ${engineerCount} engineers, the average day rate for a ${roleTitle} is approximately ${currency}${avgDayRate}. This rate indicates a competitive market for professionals with these specialized skills."
    `;

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
            config: {
                temperature: 0.3,
            }
        });
        return response.text;
    } catch (error) {
        console.error("Error generating engineer rate analysis with Gemini:", error);
        return "There was an error generating the rate analysis. Please try again.";
    }
};