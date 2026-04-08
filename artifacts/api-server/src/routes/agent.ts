import { Router, type IRouter, type Request, type Response } from "express";
import { GoogleGenerativeAI } from "@google/generative-ai";

const router: IRouter = Router();

function buildPrompt(agentId: string, inputs: Record<string, string>, lang: string): string {
  const lNote = lang && lang !== "English"
    ? `\n\nIMPORTANT: Your entire response must be in ${lang}.`
    : "";

  switch (agentId) {

    case "whatsapp":
      return (
        `You are a friendly small business WhatsApp assistant. Write a fast, professional WhatsApp reply.\n\n` +
        `Product: ${inputs.product}\n` +
        `Price: ${inputs.price}\n` +
        `Stock available: ${inputs.stock}\n` +
        `Delivery area: ${inputs.area}\n` +
        `Estimated delivery days: ${inputs.days}\n\n` +
        `Write a warm, friendly WhatsApp reply that:\n` +
        `- Answers clearly and quickly\n` +
        `- Sounds like a real helpful shop owner, not a robot\n` +
        `- Includes price, stock status, and delivery info naturally\n` +
        `- Ends with an invitation to order or ask more\n` +
        `- Uses 1-2 appropriate emojis\n` +
        `Keep it short — max 5-6 lines.` + lNote
      );

    case "complaint":
      return (
        `You are an expert customer relationship manager for a small business.\n\n` +
        `Business type: ${inputs.business}\n` +
        `Customer complaint: ${inputs.complaint}\n\n` +
        `Write a professional customer reply that:\n` +
        `- Opens with genuine empathy and calms the customer immediately\n` +
        `- Uses 1-2 smile emojis naturally to keep tone warm 😊\n` +
        `- Acknowledges the issue without making excuses\n` +
        `- Offers a clear solution or next step\n` +
        `- Ends in a way that strengthens the relationship\n` +
        `- Sounds human and caring, never corporate or cold\n` +
        `Keep it sincere and concise.` + lNote
      );

    case "review":
      return (
        `You are a customer relationship expert. Write a natural review request message.\n\n` +
        `Customer name: ${inputs.name}\n` +
        `What they bought: ${inputs.product}\n` +
        `Their experience: ${inputs.experience}\n\n` +
        `Write a warm, personal message asking for a review that:\n` +
        `- Feels genuine and personal, not copy-paste\n` +
        `- References their specific purchase naturally\n` +
        `- Makes leaving a review feel easy and appreciated\n` +
        `- Does NOT beg or pressure\n` +
        `- Includes where to leave the review (Google/Facebook)\n` +
        `- Is short enough to read in 10 seconds\n` +
        `The customer should WANT to leave a review after reading this.` + lNote
      );

    case "valuedefender":
      return (
        `You are a persuasive sales expert helping a small business owner respond to a price objection.\n\n` +
        `Our product/service: ${inputs.product}\n` +
        `Customer objection: ${inputs.objection}\n` +
        `Our unique advantages: ${inputs.advantages}\n\n` +
        `Write a confident, value-focused reply that:\n` +
        `- Acknowledges their concern without being defensive\n` +
        `- Highlights real value and difference — not just price\n` +
        `- Uses 1-2 specific reasons why we are worth it\n` +
        `- Keeps the customer engaged and interested\n` +
        `- Does NOT desperately chase or pressure them\n` +
        `- Ends with a soft next step that keeps conversation open\n` +
        `Tone: confident, friendly, professional. Not pushy.` + lNote
      );

    case "supplier":
      return (
        `You are a B2B negotiation expert with 20 years experience in supplier negotiations.\n\n` +
        `Product needed: ${inputs.product}\n` +
        `Quantity: ${inputs.quantity}\n` +
        `Current price offered: ${inputs.currentPrice}\n` +
        `Target price: ${inputs.targetPrice}\n\n` +
        `Write a professional negotiation message that:\n` +
        `- Opens by establishing a partnership mindset, not just haggling\n` +
        `- Uses volume/loyalty as leverage professionally\n` +
        `- Makes a specific counter-offer with clear reasoning\n` +
        `- Anticipates supplier pushback and addresses it proactively\n` +
        `- Shows you are serious buyer worth long-term relationship\n` +
        `- Ends with clear call to action\n\n` +
        `Also provide:\n` +
        `**Key negotiation points to mention in follow-up:**\n` +
        `[3 bullet points]\n\n` +
        `**If supplier says price is fixed:**\n` +
        `[What to say next]` + lNote
      );

    default:
      return `Help with: ${JSON.stringify(inputs)}${lNote}`;
  }
}

router.post("/agent", async (req: Request, res: Response) => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    res.status(503).json({ error: "GEMINI_API_KEY not configured on the server." });
    return;
  }

  const { agentId, inputs, language } = req.body as {
    agentId?: string;
    inputs?: Record<string, string>;
    language?: string;
  };

  if (!agentId || typeof agentId !== "string") {
    res.status(400).json({ error: "agentId is required." });
    return;
  }
  if (!inputs || typeof inputs !== "object") {
    res.status(400).json({ error: "inputs object is required." });
    return;
  }

  const lang = typeof language === "string" && language.trim() ? language.trim() : "English";
  const prompt = buildPrompt(agentId, inputs, lang);

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
