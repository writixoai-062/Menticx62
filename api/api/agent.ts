import type { VercelRequest, VercelResponse } from '@vercel/node';
import { GoogleGenerativeAI } from "@google/generative-ai";

function buildPrompt(agentId: string, inputs: Record<string, string>, lang: string): string {
  const lNote = lang && lang !== 'English' ? `\n\nIMPORTANT: Your entire response must be in ${lang}.` : '';

  switch (agentId) {
    case 'whatsapp':
      return `You are a friendly small business WhatsApp assistant.\n\nProduct: ${inputs.product}\nPrice: ${inputs.price}\nStock: ${inputs.stock}\nDelivery area: ${inputs.area}\nDelivery days: ${inputs.days}\n\nWrite a warm friendly WhatsApp reply. Max 5-6 lines. Use 1-2 emojis.` + lNote;

    case 'complaint':
      return `You are a customer relationship expert.\n\nBusiness: ${inputs.business}\nComplaint: ${inputs.complaint}\n\nWrite a reply that calms the customer, acknowledges issue, offers solution. Use 1-2 😊 emojis.` + lNote;

    case 'review':
      return `Write a natural review request.\n\nCustomer: ${inputs.name}\nProduct: ${inputs.product}\nExperience: ${inputs.experience}\n\nWarm personal message asking for Google/Facebook review. Short, genuine, not pushy.` + lNote;

    case 'valuedefender':
      return `You are a sales expert.\n\nProduct: ${inputs.product}\nObjection: ${inputs.objection}\nAdvantages: ${inputs.advantages}\n\nConfident reply highlighting value without being pushy.` + lNote;

    case 'supplier':
      return `You are a B2B negotiation expert.\n\nProduct: ${inputs.product}\nQuantity: ${inputs.quantity}\nCurrent price: ${inputs.currentPrice}\nTarget price: ${inputs.targetPrice}\n\nProfessional negotiation message.\n\n**Key points:**\n[3 bullets]\n\n**If price is fixed:**\n[What to say]` + lNote;

    default:
      return `Help with: ${JSON.stringify(inputs)}${lNote}`;
  }
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) return res.status(503).json({ error: 'GEMINI_API_KEY not configured' });

  const { agentId, inputs, language } = req.body;
  if (!agentId || !inputs) return res.status(400).json({ error: 'agentId and inputs required' });

  const lang = language || 'English';
  const prompt = buildPrompt(agentId, inputs, lang);

  try {
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });
    const result = await model.generateContent(prompt);
    return res.json({ content: result.response.text() });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    return res.status(502).json({ error: 'Gemini API error', details: message });
  }
}
