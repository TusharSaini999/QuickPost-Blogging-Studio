import { GoogleGenAI } from "@google/genai";

const lengthMap = {
  Short: "in 2–3 concise sentences",
  Medium: "in 4–6 well-structured sentences",
  Long: "in 8–10 detailed but readable sentences",
};

function buildPrompt({ title, shortDescription, content, length }) {
  return `
You are a professional blog editor and content summarization expert.

Your task is to write a clear, natural, reader-friendly summary of the blog post provided below.

Context:
- Blog title (for context only): "${title || "Not provided"}"
- Existing short description (for reference only, do NOT reuse wording): "${shortDescription || "Not provided"}"

Instructions:
- Summarize the blog in your own words
- Preserve the original meaning and key ideas
- Do NOT copy or rephrase sentences directly from the blog
- Do NOT add new information, opinions, or assumptions
- Use simple, human-like language
- Do NOT use bullet points, headings, emojis, or markdown
- Output must be plain text only

Length requirement:
Write the summary ${lengthMap[length] || lengthMap.Medium}.

Blog content:
${content}
`;
}


function extractGeminiText(response) {
  if (typeof response.text === "function") {
    return response.text();
  }

  if (response.candidates?.length) {
    return response.candidates[0].content.parts
      .map(p => p.text)
      .join(" ");
  }

  return null;
}

export async function summaryAI({ req, res, log, error }) {
  try {
    const body =
      typeof req.body === "string" ? JSON.parse(req.body) : req.body;

    const { title = "", shortDescription = "", content, length = "Medium" } = body;

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
      model: process.env.LLM_MODEL, // stable
      contents: buildPrompt({ title, shortDescription, content, length }),
    });

    const summary = extractGeminiText(response)?.trim();

    if (!summary) throw new Error("Empty AI response");

    log("Summary generated successfully");

    return res.json({ success: true, summary });
  } catch (err) {
    error("Summary AI Error: " + err.message);
    return res.json(
      { success: false, error: err.message },
      500
    );
  }
}
