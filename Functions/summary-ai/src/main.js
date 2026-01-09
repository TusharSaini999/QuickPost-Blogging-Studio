import { Client } from "node-appwrite";
import { GoogleGenAI } from "@google/genai";

// Length instruction mapping
const lengthMap = {
  Short: "in 2–3 concise sentences",
  Medium: "in 4–6 well-structured sentences",
  Long: "in 8–10 detailed but readable sentences",
};

// Build AI prompt
function buildPrompt(content, length) {
  return `
You are an expert blog editor and content summarizer.

Your task is to summarize the following blog post for readers of a blogging platform.

Guidelines:
- Write a clear, human-like summary
- Do NOT copy sentences directly from the blog
- Preserve the original meaning and key ideas
- Avoid unnecessary jargon
- Do not add new information
- Do not use bullet points, headings, or emojis

Length requirement:
Write the summary ${lengthMap[length] || lengthMap.Medium}.

Blog Post Content:
${content}
`;
}

export default async ({ req, res, log, error }) => {
  try {
    // Only allow POST
    if (req.method !== "POST") {
      return res.json(
        { error: "Only POST method is allowed" },
        405
      );
    }

    // Parse request body
    const body =
      typeof req.body === "string"
        ? JSON.parse(req.body)
        : req.body;

    const { content, length } = body;

    // Validation
    if (!content || content.trim().length < 20) {
      return res.json(
        { error: "Post content is required and must be meaningful" },
        400
      );
    }

    // Init Gemini
    const ai = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
    });

    const prompt = buildPrompt(content, length);

    // Call Gemini
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
    });

    const summary = response.text?.trim();

    if (!summary) {
      throw new Error("Empty response from AI");
    }

    log("Summary generated successfully");

    return res.json({
      success: true,
      summary,
      length: length || "Medium",
    });

  } catch (err) {
    error("Summary generation failed: " + err.message);

    return res.json(
      {
        success: false,
        error: "Failed to generate summary",
      },
      500
    );
  }
};
