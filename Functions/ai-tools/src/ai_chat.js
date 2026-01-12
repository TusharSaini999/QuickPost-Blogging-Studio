export async function chatAI({ req, res, log, error }) {
  try {
    const body = typeof req.body === "string" ? JSON.parse(req.body) : req.body;
    const { userQuery, userContext } = body;

    if (!userQuery || userQuery.trim().length < 2) {
      return res.status(400).json({ success: false, error: "userQuery is required" });
    }

    const ai = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
    });

    const systemPrompt = buildSystemPrompt();
    const userPrompt = buildUserPrompt({ userQuery, userContext });

    log("System Prompt: " + systemPrompt);
    log("User Prompt: " + userPrompt);

    let response;
    try {
      response = await ai.models.generateContent({
        model: process.env.LLM_MODEL,
        contents: [
          { role: "system", text: systemPrompt },
          { role: "user", text: userPrompt }
        ],
      });
    } catch (apiErr) {
      // Handle 429 Quota / Rate limit errors
      if (apiErr.status === 429 || apiErr?.details?.some(d => d.quotaFailure)) {
        const retryAfter = apiErr.details?.find(d => d["@type"]?.includes("RetryInfo"))?.retryDelay || "a few seconds";
        const msg = `AI quota exceeded. Please try again after ${retryAfter}. Check your plan and usage.`;
        log("Gemini API Quota Exceeded: " + msg);
        return res.status(429).json({ success: false, error: msg });
      }

      // Other API errors
      throw apiErr;
    }

    const reply = extractGeminiText(response)?.trim();

    if (!reply) throw new Error("Empty AI response");

    log("Chat response generated successfully");
    log(reply);

    return res.json({ success: true, reply });
  } catch (err) {
    error("Chat AI Error: " + err.message);
    return res.status(500).json({ success: false, error: err.message });
  }
}
