import { Router } from "express";
import { z } from "zod";
import { genAI } from "../lib/gemini.js";

export const aiRouter = Router();

const MODEL = "gemini-2.5-flash";
const SYSTEM_INSTRUCTION =
  "You are a helpful AI assistant for the TechSubbies.com platform, a freelance network for AV and IT engineers. Be concise and helpful.";

function notConfigured(res: import("express").Response) {
  return res.status(503).json({ error: "AI features are not configured on the server (missing GEMINI_API_KEY)." });
}

// POST /api/ai/generate - schema-constrained JSON generation.
// Body: { prompt: string, schema: object }
const generateSchema = z.object({
  prompt: z.string().min(1),
  schema: z.record(z.any()),
});

aiRouter.post("/generate", async (req, res) => {
  if (!genAI) return notConfigured(res);

  const parsed = generateSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: "A prompt and schema are required." });
  }

  try {
    const response = await genAI.models.generateContent({
      model: MODEL,
      contents: parsed.data.prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: parsed.data.schema,
      },
    });

    const jsonStr = (response.text || "").trim();
    if (!jsonStr) throw new Error("Empty response from AI model.");
    return res.json({ result: JSON.parse(jsonStr) });
  } catch (error: any) {
    return res.status(502).json({ error: error.message || "Failed to get a valid response from the AI model." });
  }
});

// POST /api/ai/chat - stateless chat turn. The client keeps the running
// history and resends it each time, since this server holds no session.
// Body: { history: { role: 'user' | 'model', text: string }[], message: string }
const chatSchema = z.object({
  history: z.array(z.object({ role: z.enum(["user", "model"]), text: z.string() })).optional().default([]),
  message: z.string().min(1),
});

aiRouter.post("/chat", async (req, res) => {
  if (!genAI) return notConfigured(res);

  const parsed = chatSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: "A message is required." });
  }

  try {
    const chat = genAI.chats.create({
      model: MODEL,
      config: { systemInstruction: SYSTEM_INSTRUCTION },
      history: parsed.data.history.map((turn) => ({
        role: turn.role,
        parts: [{ text: turn.text }],
      })),
    });
    const result = await chat.sendMessage({ message: parsed.data.message });
    return res.json({ text: (result.text || "").trim() });
  } catch (error: any) {
    return res.status(502).json({ error: error.message || "Failed to get a valid response from the AI model." });
  }
});

// POST /api/ai/query-cv - answer a question grounded only in supplied CV text.
const queryCvSchema = z.object({
  cvContent: z.string().min(1),
  query: z.string().min(1),
});

aiRouter.post("/query-cv", async (req, res) => {
  if (!genAI) return notConfigured(res);

  const parsed = queryCvSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: "cvContent and query are required." });
  }

  try {
    const prompt = `You are an expert technical recruiter analyzing a CV. Based ONLY on the CV text provided below, answer the user's query concisely. If the information is not in the CV, state that clearly.

CV TEXT:
---
${parsed.data.cvContent}
---

USER QUERY: "${parsed.data.query}"`;

    const response = await genAI.models.generateContent({ model: MODEL, contents: prompt });
    const answer = (response.text || "").trim();
    if (!answer) throw new Error("Empty response from AI model.");
    return res.json({ answer });
  } catch (error: any) {
    return res.status(502).json({ error: error.message || "Failed to get a valid response from the AI model." });
  }
});

// POST /api/ai/translate - translate a chat message (or any short text)
// into the reader's preferred language. Also reports what language the
// text was detected as, so the UI can skip translating a message that's
// already in the reader's language and can label the original ("Show
// original (French)").
const translateSchema = z.object({
  text: z.string().min(1),
  targetLanguage: z.string().min(1),
});

aiRouter.post("/translate", async (req, res) => {
  if (!genAI) return notConfigured(res);

  const parsed = translateSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: "text and targetLanguage are required." });
  }

  try {
    const prompt = `Detect the language of the following message and translate it into ${parsed.data.targetLanguage}. Preserve the tone and meaning - this is a chat message between a freelance AV/IT engineer and a company, so keep it natural and professional, not overly literal.

MESSAGE:
"""
${parsed.data.text}
"""`;

    const response = await genAI.models.generateContent({
      model: MODEL,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: "OBJECT",
          properties: {
            detectedSourceLanguage: { type: "STRING", description: "Name of the language the original message was written in, e.g. 'French'." },
            translatedText: { type: "STRING" },
          },
          required: ["detectedSourceLanguage", "translatedText"],
        },
      },
    });

    const jsonStr = (response.text || "").trim();
    if (!jsonStr) throw new Error("Empty response from AI model.");
    const { detectedSourceLanguage, translatedText } = JSON.parse(jsonStr);
    return res.json({ detectedSourceLanguage, translatedText });
  } catch (error: any) {
    return res.status(502).json({ error: error.message || "Failed to translate the message." });
  }
});

// POST /api/ai/tutorial-video - script + video generation. This can take a
// while (real video generation is polled to completion server-side), which
// matches the app's existing behavior of awaiting the whole thing at once.
const tutorialVideoSchema = z.object({ topic: z.string().min(1) });

aiRouter.post("/tutorial-video", async (req, res) => {
  if (!genAI) return res.json({ title: "", script: "", videoUrl: "", error: "AI features are not configured on the server (missing GEMINI_API_KEY)." });

  const parsed = tutorialVideoSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: "topic is required." });
  }

  try {
    const scriptPrompt = `Create a script for a short, engaging tutorial video titled "${parsed.data.topic}". Break it into clear steps. The tone should be friendly and encouraging. Respond in JSON format with "title" and "script".`;
    const scriptResponse = await genAI.models.generateContent({
      model: MODEL,
      contents: scriptPrompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: { type: "OBJECT", properties: { title: { type: "STRING" }, script: { type: "STRING" } } },
      },
    });
    const { title, script } = JSON.parse((scriptResponse.text || "").trim());

    const videoPrompt = `An engaging, clean, corporate-style tutorial video for a software platform, with on-screen text callouts, based on the following script: ${script}`;
    let operation = await genAI.models.generateVideos({
      model: "veo-2.0-generate-001",
      prompt: videoPrompt,
      config: { numberOfVideos: 1 },
    });

    while (!operation.done) {
      await new Promise((resolve) => setTimeout(resolve, 10000));
      operation = await genAI.operations.getVideosOperation({ operation });
    }

    const downloadLink = operation.response?.generatedVideos?.[0]?.video?.uri;
    if (!downloadLink) throw new Error("Video generation completed but no download link was found.");

    const videoUrl = `${downloadLink}&key=${process.env.GEMINI_API_KEY}`;
    return res.json({ title, script, videoUrl });
  } catch (error: any) {
    return res.json({ title: "", script: "", videoUrl: "", error: error.message || "Failed to generate video." });
  }
});
