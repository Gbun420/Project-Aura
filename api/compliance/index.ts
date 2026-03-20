import { createClient } from "@supabase/supabase-js";
import { db } from "../_lib/db.js";
import type { VercelRequest, VercelResponse } from "@vercel/node";

const supabaseUrl = process.env.SUPABASE_URL || "";
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY || "";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const supabase = createClient(supabaseUrl, supabaseAnonKey);

  // 1. Handle daily integrity audit (Cron)
  if (req.method === "GET") {
    const authHeader = req.headers.authorization;
    if (process.env.CRON_SECRET && authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
      return res.status(401).json({ error: "UNAUTHORIZED_PULSE" });
    }

    try {
      console.log("[SHADOW_MONITOR] INITIATING_INTEGRITY_AUDIT...");
      const outliers = await (db as any).introductionLedger.findMany({
        where: { feeStatus: 'PENDING' }
      });

      outliers.forEach((outlier: any) => {
        console.log(`[SHADOW_MONITOR] ANALYZING_SOCIAL_PULSE: Candidate ${outlier.candidateId} at Employer ${outlier.employerId}`);
      });

      return res.status(200).json({
        success: true,
        timestamp: new Date().toISOString(),
        auditedCount: outliers.length
      });
    } catch (error: any) {
      console.error("[SHADOW_MONITOR] AUDIT_FAILED:", error);
      return res.status(500).json({ 
        error: "AUDIT_FAILED", 
        details: error.message,
        env_check: {
          hasDbUrl: Boolean(process.env.DATABASE_URL),
          hasDirectDbUrl: Boolean(process.env.DIRECT_DATABASE_URL)
        }
      });
    }
  }

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  const { action, payload } = req.body || {};

  try {
    // 1. Log Audit Trail (Live)
    await supabase.from('audit_trails').insert([{
      action: action,
      entity_type: 'SYSTEM',
      entity_id: payload?.userId || 'SYSTEM_CORE',
      details: { ip: req.headers['x-forwarded-for'] || 'unknown', payload },
      timestamp: new Date().toISOString()
    }]);

    // 2. Handle Actions
    switch (action) {
      case "VERIFY_LICENSE": {
        // Real connection to verify license
        const { data: licenseData, error: licenseError } = await supabase
          .from('employer_licenses')
          .select('*')
          .eq('trackingId', payload?.trackingId || payload?.employerId)
          .single();

        if (licenseError || !licenseData) {
          return res.status(404).json({ error: "LICENSE_NOT_FOUND" });
        }
        return res.status(200).json({
          status: licenseData.status || "VALID",
          licenseNumber: licenseData.licenseNumber,
          expiry: licenseData.expiry,
          competentPerson: licenseData.competentPerson
        });
      }

      case "RECORD_CONSENT": {
        // Persist to UserConsent table
        const { error: consentError } = await supabase.from('user_consent').insert(payload);
        if (consentError) {
          return res.status(500).json({ error: consentError.message });
        }
        return res.status(200).json({ status: "CONSENT_RECORDED", timestamp: new Date().toISOString() });
      }

      case "CHECK_TCN_ELIGIBILITY": {
        // Real check against candidates table for TCN eligibility
        const { data: tcnData, error: tcnError } = await supabase
          .from('candidate_eligibility')
          .select('*')
          .eq('candidateId', payload?.candidateId)
          .single();

        if (tcnError || !tcnData) {
          return res.status(404).json({ error: "ELIGIBILITY_DATA_NOT_FOUND" });
        }
        return res.status(200).json({
          eligible: tcnData.eligible || false,
          requirements: tcnData.requirements || [],
          processingTime: tcnData.processingTime || "Unknown"
        });
      }

      default:
        return res.status(400).json({ error: "INVALID_ACTION" });
    }
  } catch (error) {
    console.error("Compliance API Error:", error);
    return res.status(500).json({ error: "INTERNAL_SERVER_ERROR" });
  }
}
