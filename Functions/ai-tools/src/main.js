import { summaryAI } from "./summary.js";
import aiMetaDataGenerator from "./ai_metadata_generator.js"

export default async (context) => {
  const { req, res } = context;

  if (req.method !== "POST") {
    return res.json({ error: "Only POST allowed" }, 405);
  }

  if (req.path === "/summary-ai") {
    return summaryAI(context);
  }

  if (req.path === "/ai-metadata-generator") {
    return aiMetaDataGenerator(context);
  }

  return res.json(
    { success: false, error: "Route not found" },
    404
  );
};
