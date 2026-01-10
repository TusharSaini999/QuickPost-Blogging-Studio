import { GoogleGenAI } from "@google/genai";

function buildSeoPrompt({ title, content }) {
  return `
You are an SEO expert for blog content.

Analyze the blog and generate:
1. SEO-friendly title (max 60 characters)
2. Meta description (max 160 characters)
3. 5 relevant SEO tags

Rules:
- Do not repeat content verbatim
- Keep language natural
- Do not add new information

Current Title:
"${title || "Not provided"}"

Blog Content:
${content}
`;
}

export async function seoEnhancer({ req, res, log, error }) {
  try {
    const body =
      typeof req.body === "string" ? JSON.parse(req.body) : req.body;

    const { title = "", content } = body;

    if (!content || content.trim().length < 50) {
      return res.json(
        { success: false, error: "Content must be at least 50 characters" },
        400
      );
    }

    const ai = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
    });

    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: buildSeoPrompt({ title, content }),
    });

    const text = response.text?.trim();
    if (!text) throw new Error("Empty AI response");

    log("SEO content generated");

    return res.json({
      success: true,
      seoResult: text,
    });
  } catch (err) {
    error(err.message);
    return res.json(
      { success: false, error: "SEO enhancement failed" },
      500
    );
  }
}
