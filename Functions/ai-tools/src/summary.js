import { GoogleGenAI } from "@google/genai";

// Length instruction mapping
const lengthMap = {
  Short: "in 2–3 concise sentences",
  Medium: "in 4–6 well-structured sentences",
  Long: "in 8–10 detailed but readable sentences",
};

function buildPrompt({ title, shortDescription, content, length }) {
  return `
You are an expert blog editor and content summarizer.

Your task is to write a natural, reader-friendly summary for a blog post.

Context:
- Blog Title: "${title || "Not provided"}"
- Existing Short Description (reference only): "${shortDescription || "Not provided"}"

Guidelines:
- Write a clear, human-like summary
- Do NOT copy sentences
- Preserve original meaning
- Do not add new information
- No bullet points or formatting

Length requirement:
Write the summary ${lengthMap[length] || lengthMap.Medium}.

Blog Post Content:
${content}
`;
}

export async function summaryAI({ req, res, log, error }) {
  try {
    const body =
      typeof req.body === "string" ? JSON.parse(req.body) : req.body;

    const {
      title = "",
      shortDescription = "",
      content,
      length = "Medium",
    } = body;

    if (!content || content.trim().length < 50) {
      return res.json(
        { success: false, error: "Content must be at least 50 characters" },
        400
      );
    }

    const ai = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
    });

    const prompt = buildPrompt({
      title,
      shortDescription,
      content,
      length,
    });

    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
    });

    const summary = response.text?.trim();
    if (!summary) throw new Error("Empty AI response");

    log("Summary generated");

    return res.json({
      success: true,
      summary,
    });
  } catch (err) {
    error(err.message);
    return res.json(
      { success: false, error: "Summary generation failed" },
      500
    );
  }
}
