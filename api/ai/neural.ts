import { GoogleGenerativeAI } from "@google/generative-ai";
import { getJsonBody } from "../_lib/body.js";
import { requireUser } from "../_lib/auth.js";
import type { VercelRequest, VercelResponse } from "@vercel/node";

export default async function handler(req: VercelRequest, res: VercelResponse) {

  if (req.method !== "POST") {
    return res.status(405).json({ error: "METHOD_NOT_ALLOWED" });
  }

  // AUTH GUARD: Prevent unauthenticated access to paid AI API
  const auth = await requireUser(req);
  if (auth.error) {
    return res.status(auth.error.status).json({ error: auth.error.message });
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: "GEMINI_KEY_MISSING" });
  }

  const body = getJsonBody(req);
  const action = body?.action || "ANALYZE_COMPLIANCE";

  try {
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    if (action === "ANALYZE_COMPLIANCE") {
      if (!body?.manifestData && !body?.content) {
        return res.status(400).json({ error: "MISSING_PAYLOAD" });
      }

      if (body.content) {
        const content = typeof body.content === "string" ? body.content : JSON.stringify(body.content);
        const prompt = `System: You are the Nova AI Compliance Officer for a Maltese job board.
Task: Analyze the following job description for compliance with Maltese DIER regulations and discriminatory language.
Output JSON only in the format: {"score": number, "flags": string[]}
Content: ${content}`;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text().trim();
        const cleaned = text.replace(/```json|```/g, "").trim();

        try {
          const parsed = JSON.parse(cleaned);
          const score = Number(parsed?.score ?? 0);
          const flags = Array.isArray(parsed?.flags) ? parsed.flags : [];
          return res.status(200).json({ score, flags });
        } catch (parseError: any) {
          return res.status(200).json({
            score: 0,
            flags: ["AI_PARSE_ERROR", cleaned.slice(0, 200)],
          });
        }
      }

      const prompt = `Analyze this Maltese Work Permit Manifest for compliance: ${JSON.stringify(
        body.manifestData
      )}`;

      const result = await model.generateContent(prompt);
      const response = await result.response;

      return res.status(200).json({
        status: "AI_ANALYSIS_COMPLETE",
        analysis: response.text(),
      });
    }

    if (action === "RESUME_MATCH") {
      const { resumeText, jobDescription } = body.payload || {};
      
      if (!resumeText || !jobDescription) {
        return res.status(400).json({ error: "MISSING_MATCH_DATA" });
      }

      const prompt = `
        System: You are the Nova Neural Match Engine v2.0 (2026 Build). 
        Task: Deep-level compatibility analysis between Candidate Resume and Job Description.
        Context: High-performance Maltese sectors (iGaming, Fintech, AI).
        
        Candidate Resume: "${resumeText}"
        Job Description: "${jobDescription}"
        
        Output Requirements: Analyze hard skills, behavioral working styles, and cultural fit.
        Format: JSON only. 
        { 
          "matchScore": number (0-100), 
          "alignment": string[], (3 specific hard-skill alignments)
          "behavioralAlignment": string, (Brief summary of work-style fit)
          "culturalFit": number (0-100),
          "gaps": string[] (2 critical growth gaps) 
        }
      `;

      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text().trim();
      const cleanJson = text.replace(/```json|```/g, "").trim();
      
      try {
        return res.status(200).json(JSON.parse(cleanJson));
      } catch (e) {
        return res.status(500).json({ error: "AI_PARSING_FAILED", raw: text });
      }
    }

    if (action === "NOVA_MATCH") {
      return res.status(200).json({
        status: "NOVA_MATCH_READY",
        message: "Neural matching engine online.",
      });
    }

    if (action === "VERIFY_SKILLS_PASS") {
      const { fileData, mimeType } = body.payload || {};
      
      if (!fileData || !mimeType) {
        return res.status(400).json({ error: "MISSING_DOCUMENT_DATA" });
      }

      const prompt = `
        System: You are the Nova Compliance Validator for the 2026 Maltese labor market.
        Task: Analyze this document for 'Skills Pass' authenticity issued by Identità Malta.
        Checks: 
        1. Presence of 'Identità Malta' logo/text.
        2. Valid Expiry Date (must be in the future, 2026 or later).
        3. English Proficiency result (A2 or higher required).
        4. Candidate Name matching (if provided).
        
        Output JSON only:
        { 
          "verified": boolean, 
          "expiryDate": string, 
          "englishLevel": string,
          "confidence": number (0-1.0),
          "reasoning": string 
        }
      `;

      // Multimodal request
      const result = await model.generateContent([
        prompt,
        {
          inlineData: {
            data: fileData, // Base64 encoded string
            mimeType: mimeType
          }
        }
      ]);

      const response = await result.response;
      const text = response.text().trim();
      const cleanJson = text.replace(/```json|```/g, "").trim();
      
      try {
        const parsed = JSON.parse(cleanJson);
        return res.status(200).json(parsed);
      } catch (e) {
        return res.status(500).json({ error: "AI_VERIFICATION_PARSING_FAILED", raw: text });
      }
    }

    if (action === "CONVERSATIONAL_ACTION") {
      const { message, context } = body.payload || {};
      
      const prompt = `
        System: You are the 'Nova Assistant', a high-performance recruitment facilitator for the 2026 Maltese market.
        Context: You are helping an Employer who is currently reviewing a candidate.
        Candidate Data (Blurred): ID ${context?.candidateId}, Match Score ${context?.matchScore}%, TCN Status: ${context?.tcnStatus}.
        Employer Subscription: ${context?.isPro ? 'PRO' : 'FREE'}.
        
        Rules:
        1. If the Employer is FREE and wants to contact or see details, explain the "Pulse Pro" upgrade (€49/mo) to unlock all identities and compliance history.
        2. Be professional, direct, and efficient.
        3. Mention the 2026 Skills Pass relevance if the candidate is verified.
        4. Keep responses under 3 sentences.
        
        User Message: "${message}"
      `;

      const result = await model.generateContent(prompt);
      const response = await result.response;
      return res.status(200).json({ reply: response.text().trim() });
    }

    return res.status(400).json({ error: "INVALID_ACTION", action });
  } catch (error: any) {
    return res.status(500).json({
      error: "NEURAL_CORE_TIMEOUT",
      message: error.message,
    });
  }
}
