import { GoogleGenAI } from "@google/genai";

/**
 * Build system-level instructions for the AI
 */
function buildSystemPrompt() {
    return `
You are the built-in AI Assistant for "Quick Post", a modern blogging platform.
Your role:
- Help users while they are working inside Quick Post
- Provide accurate, practical, and context-aware answers
- Adapt your response based on the page the user is currently on
Response guidelines:
- Focus primarily on the current page context
- Give clear, direct, and helpful answers
- Use simple, natural, human-like language
- Avoid unnecessary explanations
- Do not make assumptions beyond the given context
- Do not hallucinate facts or features
- Do not use emojis, markdown, bullet points, or headings
- Output plain text only
`;
}

/**
 * Build user prompt with context
 */
function buildUserPrompt({ userQuery, userContext }) {
    // Extract common data
    const { name, totalPosts, postPerWeek, navigationMenu } = userContext;
    const commonContext = `
User: ${name}
Total Posts: Drafts(${totalPosts.Drafts}), Private(${totalPosts.Private}), Public(${totalPosts.Public})
Posts Per Week: ${postPerWeek}
Navigation Menu: ${navigationMenu.join(", ")}
`;

    // Determine page-specific context
    let pageContext = "";
    const currentPage = userContext.currentPageOnUser;

    if (currentPage === "Dashboard") {
        const { dashboardSummary, visibleSections, quickLinks } = userContext;
        pageContext = `
Current Page: Dashboard
Welcome Message: ${dashboardSummary?.welcomeMessage || ""}
Visible Sections: ${visibleSections?.join(", ") || ""}
Quick Links: ${quickLinks?.join(", ") || ""}
`;
    } else if (currentPage === "Create Post Page" || currentPage === "Edit Post Page") {
        const { currentPost, coverImage, formFields } = userContext;
        pageContext = `
Current Page: ${currentPage}
Post Title: ${currentPost?.title || ""}
Short Description: ${currentPost?.shortDescription || ""}
Keywords: ${currentPost?.keywords?.join(", ") || ""}
Content: ${currentPost?.content || ""}

Cover Image:
  Enabled: ${coverImage?.enabled}
  Optional: ${coverImage?.optional}
  Uploaded: ${coverImage?.uploaded}

Form Fields:
  - Title: 
      Label: ${formFields?.title?.label || ""}
      Placeholder: ${formFields?.title?.placeholder || ""}
      Value: ${formFields?.title?.value || ""}
      Required: ${formFields?.title?.required}
  - Short Description:
      Label: ${formFields?.shortDescription?.label || ""}
      Placeholder: ${formFields?.shortDescription?.placeholder || ""}
      Value: ${formFields?.shortDescription?.value || ""}
      Required: ${formFields?.shortDescription?.required}
  - Tags:
      Label: ${formFields?.tags?.label || ""}
      Placeholder: ${formFields?.tags?.placeholder || ""}
      Values: ${formFields?.tags?.values?.join(", ") || ""}
      Max Recommended: ${formFields?.tags?.maxRecommended || ""}
  - Visibility:
      Selected: ${formFields?.visibility?.selected || ""}
      Options: ${formFields?.visibility?.options?.join(", ") || ""}
Editor Type: ${formFields?.type || ""}
Editor State:
  Value: ${formFields?.state?.value || ""}
  Word Count: ${formFields?.state?.wordCount || 0}
  Shortcuts: ${JSON.stringify(formFields?.state?.shortcuts || {})}
Editor Capabilities: ${Object.keys(formFields?.capabilities || {}).join(", ")}
Editor Plugins: ${formFields?.plugins?.join(", ") || ""}
Toolbar Layout: ${formFields?.toolbar?.layout || ""}
Toolbar Actions: ${formFields?.toolbar?.actions?.join(", ") || ""}
Content Style:
  Font Family: ${formFields?.contentStyle?.fontFamily || ""}
  Font Size: ${formFields?.contentStyle?.fontSize || ""}
  Line Height: ${formFields?.contentStyle?.lineHeight || ""}
`;
    } else {
        pageContext = `Current Page: ${currentPage || "Unknown Page"}`;
    }

    // Final user prompt
    return `
Current User on this Page: ${currentPage}

Common user context:
${commonContext}

Page-specific context:
${pageContext}

User request:
${userQuery}
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

        const { userQuery, userContext } = body;

        if (!userQuery || userQuery.trim().length < 2) {
            return res.json(
                { success: false, error: "userQuery is required" },
                400
            );
        }

        const ai = new GoogleGenAI({
            apiKey: process.env.GEMINI_API_KEY,
        });

        // Build system + user prompts
        const systemPrompt = buildSystemPrompt();
        const userPrompt = buildUserPrompt({ userQuery, userContext });

        log("System Prompt: " + systemPrompt);
        log("User Prompt: " + userPrompt);

        const response = await ai.models.generateContent({
            model: process.env.LLM_MODEL,
            contents: [
                { role: "system", text: systemPrompt },
                { role: "user", text: userPrompt }
            ],
        });

        const reply = extractGeminiText(response)?.trim();

        if (!reply) throw new Error("Empty AI response");

        log("Chat response generated successfully");
        log(reply);
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
