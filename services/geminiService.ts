import { GoogleGenAI } from "@google/genai";

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