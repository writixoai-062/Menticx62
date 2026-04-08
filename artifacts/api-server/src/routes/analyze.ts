import { Router, type IRouter, type Request, type Response } from "express";
import { GoogleGenerativeAI } from "@google/generative-ai";

const router: IRouter = Router();

// POST /api/analyze
router.post("/analyze", async (req: Request, res: Response) => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    res.status(503).json({ error: "GEMINI_API_KEY not configured on the server." });
    return;
  }

  const { question, context, language } = req.body as {
    question?: string;
    context?: string;
    language?: string;
  };

  if (!question || typeof question !== "string" || question.trim().length < 5) {
    res.status(400).json({ error: "question must be a non-empty string." });
    return;
  }

  const ctx = typeof context === "string" && context.trim() ? context.trim() : "Small Business Owner";
  const lang = typeof language === "string" && language.trim() ? language.trim() : "English";
  const langNote = lang === "English" ? "" : `\n\nIMPORTANT: Respond entirely in ${lang}.`;

  try {
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    // STEP 1: Validate and improve the question
    const validationPrompt =
      `You are an expert question analyst helping a ${ctx}.\n\n` +
      `The user asked: "${question.trim()}"\n\n` +
      `Analyze this question and respond in exactly this format:\n\n` +
      `**Question Score:** [X/10]\n\n` +
      `**What's unclear or missing:**\n- [point 1]\n- [point 2]\n\n` +
      `**Improved Question:**\n[Rewrite their question to be more specific and useful for a ${ctx}]\n\n` +
      `**Why this version is better:**\n[One sentence explanation]` + langNote;

    const validationResult = await model.generateContent(validationPrompt);
    const validation = validationResult.response.text();

    // Extract improved question from validation
    const improvedMatch = validation.match(/\*\*Improved Question:\*\*\s*([\s\S]*?)\n\n/);
    const improvedQuestion = improvedMatch ? improvedMatch[1].trim() : question.trim();

    // STEP 2: Deep answer with thinking process
    const answerPrompt =
      `You are a senior business consultant with 20 years experience helping small businesses.\n\n` +
      `Original question: "${question.trim()}"\n` +
      `Refined question: "${improvedQuestion}"\n` +
      `User type: ${ctx}\n\n` +
      `Provide a deep structured answer in exactly this format:\n\n` +
      `**Direct Answer:**\n[Clear, direct answer in 2-3 sentences]\n\n` +
      `**How I'm Thinking About This:**\n` +
      `→ Step 1 — Assumptions I'm making: [what context I'm assuming]\n` +
      `→ Step 2 — Key factors I'm considering: [what matters most here]\n` +
      `→ Step 3 — My reasoning: [how I'm working through this]\n` +
      `→ Step 4 — What I'm prioritizing: [why I chose this approach]\n\n` +
      `**Detailed Answer:**\n[Comprehensive practical advice with specific examples]\n\n` +
      `**Your Action Steps:**\n1. [Specific action — do this first]\n2. [Specific action — do this second]\n3. [Specific action — do this third]\n\n` +
      `**Watch Out For:**\n- [Common mistake 1]\n- [Common mistake 2]` + langNote;

    const answerResult = await model.generateContent(answerPrompt);
    const answer = answerResult.response.text();

    res.json({ validation, answer });

  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    res.status(502).json({ error: "Gemini API error", details: message });
  }
});

// POST /api/follow-up
router.post("/follow-up", async (req: Request, res: Response) => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    res.status(503).json({ error: "GEMINI_API_KEY not configured on the server." });
    return;
  }

  const { followUpQuestion, previousQuestion, previousAnalysis, language } = req.body as {
    followUpQuestion?: string;
    previousQuestion?: string;
    previousAnalysis?: string;
    language?: string;
  };

  if (!followUpQuestion || !previousAnalysis) {
    res.status(400).json({ error: "followUpQuestion and previousAnalysis are required." });
    return;
  }

  const lang = typeof language === "string" && language.trim() ? language.trim() : "English";
  const langNote =
    lang === "English"
      ? ""
      : `\n\nIMPORTANT: Respond entirely in ${lang}. All content must be in ${lang}.`;

  const prompt =
    `You are an expert business consultant helping a user with follow-up advice.\n\n` +
    `Previously analyzed question:\n"${(previousQuestion || "").substring(0, 600)}"\n\n` +
    `Previous analysis:\n${previousAnalysis.substring(0, 2000)}\n\n` +
    `The user now asks as a follow-up:\n"${followUpQuestion.trim()}"\n\n` +
    `Provide a focused, insightful answer that directly addresses the follow-up question, ` +
    `building on the context of the previous analysis. Be concise but thorough.` +
    langNote;

  try {
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
    const result = await model.generateContent(prompt);
    const content = result.response.text();
    res.json({ content });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    res.status(502).json({ error: "Gemini API error", details: message });
  }
});

export default router;
