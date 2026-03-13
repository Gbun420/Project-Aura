import { GoogleGenerativeAI } from "@google/generative-ai";
import { getJsonBody } from "../_lib/body.js";

type AnalyzeRequest = {
  manifestData?: unknown;
};

export default async function handler(req: any, res: any) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "METHOD_NOT_ALLOWED" });
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: "GEMINI_KEY_MISSING" });
  }

  const body = getJsonBody<AnalyzeRequest>(req);
  if (!body?.manifestData) {
    return res.status(400).json({ error: "MISSING_MANIFEST_DATA" });
  }

  try {
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const prompt = `Analyze this Maltese Work Permit Manifest for compliance: ${JSON.stringify(
      body.manifestData
    )}`;

    const result = await model.generateContent(prompt);
    const response = await result.response;

    return res.status(200).json({
      status: "AI_ANALYSIS_COMPLETE",
      analysis: response.text(),
    });
  } catch (error: any) {
    return res.status(500).json({
      error: "NEURAL_CORE_TIMEOUT",
      message: error.message,
    });
  }
}
