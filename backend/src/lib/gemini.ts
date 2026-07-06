import { GoogleGenAI } from "@google/genai";

// The Gemini API key lives only here, on the server, read from the
// environment. It is never sent to, or embedded in, the browser bundle.
const apiKey = process.env.GEMINI_API_KEY;

export const genAI = apiKey ? new GoogleGenAI({ apiKey }) : null;

export function requireGenAI() {
  if (!genAI) {
    throw new Error("GEMINI_API_KEY is not configured on the server.");
  }
  return genAI;
}
