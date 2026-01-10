import { summaryAI } from "./summary.js";
import { seoEnhancer } from "./seoEnhancer.js";

export default async (context) => {
  const { req, res } = context;

  if (req.method !== "POST") {
    return res.json({ error: "Only POST allowed" }, 405);
  }

  if (req.path === "/summary-ai") {
    return summaryAI(context);
  }

  if (req.path === "/ai-seo-enhancer") {
    return seoEnhancer(context);
  }

  return res.json(
    { success: false, error: "Route not found" },
    404
  );
};
