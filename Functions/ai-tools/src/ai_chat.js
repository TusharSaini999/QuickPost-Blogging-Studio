import { Groq } from "groq-sdk";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
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
Current Post Title: ${currentPost?.title || ""}
Current Short Description: ${currentPost?.shortDescription || ""}
Current Keywords: ${currentPost?.keywords?.join(", ") || ""}
Current Content: ${currentPost?.content || ""}
Instructions for AI:
- Use the above post data as the main context.
- If the user requests, generate additional related content based on the current post.
- Ensure any generated content is consistent with the existing title, short description, keywords, and content.
- Enhance, expand, or provide examples without removing valid existing data.
- Keep the style suitable for a modern blogging platform.
- Do not hallucinate facts or add unrelated content.
- Output plain text only.
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

export async function chatAI({ req, res, log, error }) {
    try {
        const body = typeof req.body === "string" ? JSON.parse(req.body) : req.body;
        const { userQuery, userContext } = body;

        if (!userQuery || userQuery.trim().length < 2) {
            return res.status(400).json({ success: false, error: "userQuery is required" });
        }

        // Build system + user prompts
        const systemPrompt = buildSystemPrompt();
        const userPrompt = buildUserPrompt({ userQuery, userContext });

        log("System Prompt: " + systemPrompt);
        log("User Prompt: " + userPrompt);

        // Call Groq API
        const response = await groq.chat.completions.create({
            model: process.env.LLM_MODEL || "openai/gpt-oss-120b",
            messages: [
                { role: "system", content: systemPrompt },
                { role: "user", content: userPrompt }
            ],
            temperature: 0.7,
            max_completion_tokens: 2000,
            top_p: 1,
            stream: false, // set to true for streaming
            reasoning_effort: "medium",
            // Optional: strict JSON if needed
            // response_format: { type: "json_object" }
        });

        // Extract text from Groq response
        const reply = response.choices?.[0]?.message?.content?.trim();

        if (!reply) throw new Error("Empty AI response");

        log("Chat response generated successfully");
        log(reply);

        return res.json({ success: true, reply });
    } catch (err) {
        error("Chat AI Error: " + err.message);
        return res.json({
            success: false,
            error: "The AI chat engine is currently unavailable. Please try again later.",
        });
    }
}