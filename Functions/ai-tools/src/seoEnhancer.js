import { GoogleGenAI } from "@google/genai";

// Build AI prompt for SEO enhancement
function buildSeoPrompt({ title, shortDescription, keywords, content }) {
  return `
You are an expert SEO content writer.

Input:
- Title (for reference): "${title || ""}"
- Short Description (for reference): "${shortDescription || ""}"
- Keywords (for reference, may be empty): ${JSON.stringify(keywords || [])}
- Blog Content (required, minimum 50 characters): "${content}"

Task:
Generate a **SEO-friendly blog heading, meta description, and suggested keywords**.
Output format: JSON only, with these fields:

{
  "title": "SEO-optimized blog title",
  "metaDescription": "SEO-friendly meta description, max 160 chars",
  "keywords": ["keyword1", "keyword2", "keyword3", "..."]
}

Rules:
- Do NOT copy sentences verbatim from the input
- Do not hallucinate new content
- Use natural language
- Make it SEO optimized
- Ensure JSON is valid
`;
}

// Extract text safely from Gemini responses
function extractGeminiText(response) {
  if (typeof response.text === "function") return response.text();
  if (response.candidates?.length) {
    return response.candidates[0].content.parts.map(p => p.text).join(" ");
  }
  return null;
}

export async function seoEnhancer({ req, res, log, error }) {
  try {
    const body =
      typeof req.body === "string" ? JSON.parse(req.body) : req.body;

    const { title = "", shortDescription = "", keywords = [], content } = body;

    if (!content || content.trim().length < 50) {
      return res.json(
        { success: false, error: "Blog content must be at least 50 characters" },
        400
      );
    }

    const ai = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
    });

    // Build prompt
    const prompt = buildSeoPrompt({ title, shortDescription, keywords, content });

    // Generate content using Gemini 2.5 flash (stable)
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        response_mime_type: "application/json", // ensure JSON
      },
    });

    // Extract AI text safely
    const aiText = extractGeminiText(response)?.trim();
    if (!aiText) throw new Error("Empty AI response");
    log(aiText);
    // Parse JSON safely
    let seoResult;
    try {
      seoResult = JSON.parse(aiText);
    } catch (err) {
      throw new Error("AI returned invalid JSON: " + aiText);
    }

    log("SEO content generated successfully");

    return res.json({
      success: true,
      seoResult,
    });
  } catch (err) {
    error("SEO Enhancer Error: " + err.message);
    return res.json(
      { success: false, error: err.message },
      500
    );
  }
}
