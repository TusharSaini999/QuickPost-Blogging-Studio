import { Groq } from "groq-sdk";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

function normalizeList(value) {
    if (Array.isArray(value)) return value;
    if (typeof value === "string" && value.trim()) return value.split(",").map((item) => item.trim()).filter(Boolean);
    return [];
}

function normalizeContext(userContext = {}) {
    return {
        name: userContext?.name || "User",
        assistantMode: userContext?.assistantMode || "general",
        currentPageOnUser: userContext?.currentPageOnUser || userContext?.page || "App",
        pathname: userContext?.pathname || "",
        routeType: userContext?.routeType || "unknown",
        pageGoal: userContext?.pageGoal || "",
        quickPrompts: normalizeList(userContext?.quickPrompts),
        totalPosts: {
            Drafts: userContext?.totalPosts?.Drafts || 0,
            Private: userContext?.totalPosts?.Private || 0,
            Public: userContext?.totalPosts?.Public || 0,
        },
        postPerWeek: userContext?.postPerWeek || 0,
        navigationMenu: normalizeList(userContext?.navigationMenu),
        dashboardSummary: userContext?.dashboardSummary || {},
        visibleSections: normalizeList(userContext?.visibleSections),
        quickLinks: normalizeList(userContext?.quickLinks),
        currentPost: userContext?.currentPost || {},
        coverImage: userContext?.coverImage || {},
        formFields: userContext?.formFields || {},
        loadingSupport: userContext?.loadingSupport || {},
        livePageSnapshot: userContext?.livePageSnapshot || {},
    };
}
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
- Act like an assistant bot for the active page (navigation, usage, and quick troubleshooting)
- If user mentions loading issues, prioritize practical diagnostics and next actions
Response guidelines:
- Focus primarily on the current page context
- Prefer the live page snapshot when available (title, path, headings, visible actions)
- Give clear, direct, and helpful answers
- Use simple, natural, human-like language
- Do not make assumptions beyond the given context
- Do not hallucinate facts or features
- When generating content for TinyMCE, output plain text. Do not generate HTML.
`;
}

/**
 * Build user prompt with context
 */
function buildUserPrompt({ userQuery, userContext }) {
    const context = normalizeContext(userContext);

    // Extract common data
    const { name, assistantMode, pathname, routeType, pageGoal, quickPrompts, totalPosts, postPerWeek, navigationMenu, loadingSupport, livePageSnapshot } = context;
    const commonContext = `
User: ${name}
Assistant Mode: ${assistantMode}
Route Path: ${pathname}
Route Type: ${routeType}
Page Goal: ${pageGoal}
Suggested Prompt Starters: ${quickPrompts.join(", ")}
Total Posts: Drafts(${totalPosts.Drafts}), Private(${totalPosts.Private}), Public(${totalPosts.Public})
Posts Per Week: ${postPerWeek}
Navigation Menu: ${navigationMenu.join(", ")}
Loading Support Enabled: ${Boolean(loadingSupport?.enabled)}
Loading Guidance: ${loadingSupport?.guidance || ""}
Live Page Snapshot:
    Path: ${livePageSnapshot?.path || ""}
    Url: ${livePageSnapshot?.fullUrl || ""}
    Title: ${livePageSnapshot?.title || ""}
    Headings: ${livePageSnapshot?.headings?.join(", ") || ""}
    Visible Actions: ${livePageSnapshot?.visibleActions?.join(", ") || ""}
    Page Is Likely Loading: ${Boolean(livePageSnapshot?.pageIsLikelyLoading)}
    Captured At: ${livePageSnapshot?.capturedAt || ""}
`;

    // Determine page-specific context
    let pageContext = "";
    const currentPage = context.currentPageOnUser;

    if (currentPage === "Dashboard") {
        const { dashboardSummary, visibleSections, quickLinks } = context;
        pageContext = `
Current Page: Dashboard
Welcome Message: ${dashboardSummary?.welcomeMessage || ""}
Visible Sections: ${visibleSections?.join(", ") || ""}
Quick Links: ${quickLinks?.join(", ") || ""}
`;
    } else if (currentPage === "Create Post Page" || currentPage === "Edit Post Page") {
        const { currentPost, coverImage, formFields } = context;
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
    } else if (currentPage === "Login" || currentPage === "Signup" || currentPage === "Forgot Password" || currentPage === "Verify New Password" || currentPage === "Email Verification") {
        pageContext = `Current Page: ${currentPage}`;
    } else if (
        currentPage === "Home" ||
        currentPage === "Profile Page" ||
        currentPage === "Posts Page" ||
        currentPage === "Public Feed Page" ||
        currentPage === "Post View Page" ||
        currentPage === "Public Post View Page"
    ) {
        pageContext = `
Current Page: ${currentPage}
Visible Sections: ${context?.visibleSections?.join(", ") || ""}
Quick Links: ${context?.quickLinks?.join(", ") || ""}
Instructions for AI:
- Help user understand what this page is for.
- Suggest the best next actions for this page.
- If user reports loading delay or missing UI, suggest a short troubleshooting checklist tied to the visible sections.
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