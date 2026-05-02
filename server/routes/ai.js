import express from "express";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { protect, checkAICredits } from "../middleware/auth.js";
import User from "../models/User.js";
import dotenv from "dotenv";
const router = express.Router();
router.use(protect, checkAICredits);

// Initialize Gemini client lazily on first use
let genAI = null;
function getGenAIClient() {
  if (!genAI) {
    if (!process.env.GEMINI_API_KEY) {
      throw new Error("GEMINI_API_KEY is not set in environment variables");
    }
    genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  }
  return genAI;
}

// ── Prompts ────────────────────────────────────────────────────
const PROMPTS = {
  improve_summary: ({ content, jobTitle }) => `
You are an expert resume writer. Improve this professional summary for a ${jobTitle || "professional"}.
Requirements:
- 3-4 sentences maximum
- Start with a strong action word or impressive credential
- Include relevant skills and value proposition
- ATS-optimized with keywords
- Do NOT use generic phrases like "results-driven" or "self-starter"
Return ONLY the improved summary text, nothing else.

ORIGINAL: ${content}`,

  generate_summary: ({ content, jobTitle }) => `
You are an expert resume writer. Write a compelling professional summary for a ${jobTitle || "professional"}.
Based on their experience: ${content}
Requirements:
- 3-4 sentences
- Specific and impressive
- ATS-friendly
Return ONLY the summary text, nothing else.`,

  improve_bullets: ({ content }) => `
You are an expert resume writer. Transform these job description points into powerful resume bullets.
Rules:
- Start each with a strong action verb (Led, Built, Engineered, Increased, Reduced, etc.)
- Add quantifiable metrics where reasonable (%, $, numbers, time)
- Keep each bullet under 20 words
- Make them ATS-friendly
Return ONLY the bullets, one per line, each starting with a dash (-). No other text.

ORIGINAL:
${content}`,

  generate_bullets: ({ content, jobTitle }) => `
You are an expert resume writer. Generate 4-5 strong resume bullet points for this role.
Position: ${jobTitle || "the role"}
Details: ${content}
Rules:
- Strong action verbs
- Include realistic metrics
- ATS-optimized
Return ONLY the bullets, one per line starting with dash (-). No other text.`,

  tailor_to_job: ({ content, context }) => `
You are an expert resume writer. Tailor this resume content to match the job description.
- Identify and incorporate keywords from the job description naturally
- Reframe experience to match the role's requirements  
- Keep all facts truthful, just reframed
Return ONLY the tailored content, no explanations.

JOB DESCRIPTION:
${context}

RESUME CONTENT:
${content}`,

  improve_skills: ({ content }) => `
You are an expert resume writer. Review and optimize this skills section.
- Group skills logically by category
- Add relevant industry-standard skills that complement existing ones
- Remove redundant or outdated skills
Return ONLY a JSON array like: [{"category": "Programming", "items": ["Python", "JavaScript"]}]
No markdown, no explanation, pure JSON only.

CURRENT SKILLS: ${content}`,
};

// ── POST /api/ai/generate ──────────────────────────────────────
router.post("/generate", async (req, res, next) => {
  try {
    const { action, content, jobTitle, context } = req.body;

    if (!action || !content) {
      return res.status(400).json({ error: "action and content are required." });
    }

    if (!PROMPTS[action]) {
      return res.status(400).json({ error: `Unknown action: ${action}` });
    }

    const prompt = PROMPTS[action]({ content, jobTitle, context });

    // Use Gemini
    const model = getGenAIClient().getGenerativeModel({ model: "gemini-2.0-flash" });
    const result = await model.generateContent(prompt);
    const text = result.response.text().trim();

    // Increment AI credits used
    await User.findByIdAndUpdate(req.user._id, {
      $inc: { "usage.aiCreditsUsed": 1 },
    });

    const updatedUser = await User.findById(req.user._id);

    res.json({
      success: true,
      result: text,
      creditsUsed: updatedUser.usage.aiCreditsUsed,
      creditsLimit: updatedUser.usage.aiCreditsLimit,
    });
  } catch (err) {
    console.error("Gemini AI error:", err.message);
    if (err.message?.includes("API_KEY")) {
      return res.status(500).json({ error: "AI service configuration error." });
    }
    if (err.message?.includes("quota")) {
      return res.status(429).json({ error: "AI quota exceeded. Please try again later." });
    }
    next(err);
  }
});

// ── GET /api/ai/credits ────────────────────────────────────────
router.get("/credits", protect, async (req, res) => {
  const user = await User.findById(req.user._id);
  res.json({
    success: true,
    used: user.usage.aiCreditsUsed,
    limit: user.usage.aiCreditsLimit,
    remaining: user.usage.aiCreditsLimit - user.usage.aiCreditsUsed,
  });
});

export default router;
