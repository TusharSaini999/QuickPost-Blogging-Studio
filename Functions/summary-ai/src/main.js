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

Your task is to write a natural, reader-friendly summary for a blog post on a blogging platform.

Context:
- Blog Title: "${title || "Not provided"}"
- Existing Short Description (for reference only, do not reuse text): "${shortDescription || "Not provided"}"

Guidelines:
- Write a clear, human-like summary
- Do NOT copy sentences from the blog, title, or short description
- Preserve the original meaning and key ideas
- Avoid unnecessary jargon
- Do not add new information
- Do not use bullet points, headings, emojis, or markdown

Length requirement:
Write the summary ${lengthMap[length] || lengthMap.Medium}.

Blog Post Content:
${content}
`;
}

export default async ({ req, res, log, error }) => {
  try {
    if (req.method !== "POST") {
      return res.json({ error: "Only POST method is allowed" }, 405);
    }

    const body =
      typeof req.body === "string"
        ? JSON.parse(req.body)
        : req.body;

    const {
      title = "",
      shortDescription = "",
      content,
      length = "Medium",
    } = body;

    // Validation
    if (!content || content.trim().length < 50) {
      return res.json(
        { error: "Post content must be at least 50 characters long" },
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

    if (!summary) {
      throw new Error("Empty response from AI");
    }

    log("Summary generated successfully");

    return res.json({
      success: true,
      summary,
      meta: {
        length,
        titleProvided: Boolean(title),
        shortDescriptionProvided: Boolean(shortDescription),
      },
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
