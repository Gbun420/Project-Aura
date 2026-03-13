import { createClient } from "@supabase/supabase-js";
import type { VercelRequest, VercelResponse } from "@vercel/node";

const supabaseUrl = process.env.SUPABASE_URL || "";
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY || "";

// Placeholder for Compliance API
// Implements: License Verification, GDPR Status, Audit Logging

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const { action, payload } = req.body || {};
  const supabase = createClient(supabaseUrl, supabaseAnonKey);

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  try {
    // 1. Log Audit Trail (Mock)
    console.log(`[AUDIT_TRAIL] Action: ${action} | IP: ${req.headers['x-forwarded-for'] || 'unknown'}`);

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
