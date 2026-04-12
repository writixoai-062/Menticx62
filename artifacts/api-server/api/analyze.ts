import type { VercelRequest, VercelResponse } from '@vercel/node';
import { GoogleGenerativeAI } from "@google/generative-ai";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return res.status(503).json({ error: 'GEMINI_API_KEY not configured' });
  }

  const { question, context, language } = req.body;

  if (!question || question.trim().length < 5) {
    return res.status(400).json({ error: 'question is required' });
  }

  const ctx = context || 'Small Business Owner';
  const lang = language || 'English';
  const langNote = lang === 'English' ? '' : `\n\nIMPORTANT: Respond entirely in ${lang}.`;

  try {
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });

    // Step 1: Validate question
    const validationPrompt = `You are an expert question analyst helping a ${ctx}.
The user asked: "${question.trim()}"
Analyze and respond in exactly this format:

**Question Score:** [X/10]

**What's unclear or missing:**
- [point 1]
- [point 2]

**Improved Question:**
[Rewrite their question to be more specific]

**Why this version is better:**
[One sentence explanation]` + langNote;

    const validationResult = await model.generateContent(validationPrompt);
    const validation = validationResult.response.text();

    const improvedMatch = validation.match(/\*\*Improved Question:\*\*\s*([\s\S]*?)\n\n/);
    const improvedQuestion = improvedMatch ? improvedMatch[1].trim() : question.trim();

    // Step 2: Deep answer
    const answerPrompt = `You are a senior business consultant with 20 years experience.

Original question: "${question.trim()}"
Refined question: "${improvedQuestion}"
User type: ${ctx}

Provide a deep structured answer:

**Direct Answer:**
[Clear answer in 2-3 sentences]

**How I'm Thinking About This:**
→ Step 1 — Assumptions: [what I'm assuming]
→ Step 2 — Key factors: [what matters most]
→ Step 3 — My reasoning: [how I'm working through this]
→ Step 4 — Priority: [why I chose this approach]

**Detailed Answer:**
[Comprehensive practical advice]

**Your Action Steps:**
1. [Specific action]
2. [Specific action]
3. [Specific action]

**Watch Out For:**
- [Common mistake 1]
- [Common mistake 2]` + langNote;

    const answerResult = await model.generateContent(answerPrompt);
    const answer = answerResult.response.text();

    return res.json({ validation, answer });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    return res.status(502).json({ error: 'Gemini API error', details: message });
  }
}
