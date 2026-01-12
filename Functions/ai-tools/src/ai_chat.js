import { GoogleGenAI } from "@google/genai";

/**
 * Build chat prompt
 */
function buildChatPrompt({ userQuery, contextData }) {
    return `
You are the built-in AI Assistant for "Quick Post", a modern blogging platform.

Your role:
- Help users while they are working inside Quick Post
- Provide accurate, practical, and context-aware answers
- Adapt your response based on the page the user is currently on

Current page context:
${contextData || "No page-specific context provided."}

User request:
${userQuery}

Response guidelines:
- Focus primarily on the current page context
- Give clear, direct, and helpful answers
- Use simple, natural, human-like language
- Avoid unnecessary explanations
- Do not make assumptions beyond the given context
- Do not hallucinate facts or features
- Do not use emojis, markdown, bullet points, or headings
- Output plain text only

Answer now:
`;
}


/**
 * Extract Gemini response safely
 */
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

/**
 * Chat AI Handler
 */
export async function chatAI({ req, res, log, error }) {
    try {
        const body =
            typeof req.body === "string" ? JSON.parse(req.body) : req.body;

        const { userQuery, contextData = "" } = body;

        if (!userQuery || userQuery.trim().length < 2) {
            return res.json(
                { success: false, error: "userQuery is required" },
                400
            );
        }

        const ai = new GoogleGenAI({
            apiKey: process.env.GEMINI_API_KEY,
        });

        const response = await ai.models.generateContent({
            model: process.env.LLM_MODEL, // same model as summary
            contents: buildChatPrompt({ userQuery, contextData }),
        });

        const reply = extractGeminiText(response)?.trim();

        if (!reply) throw new Error("Empty AI response");

        log("Chat response generated successfully");

        return res.json({
            success: true,
            reply,
        });
    } catch (err) {
        error("Chat AI Error: " + err.message);
        return res.json(
            { success: false, error: err.message },
            500
        );
    }
}
