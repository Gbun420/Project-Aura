import { adminDb } from "../_lib/firebase-admin.js";
import type { VercelRequest, VercelResponse } from "@vercel/node";

export default async function handler(req: VercelRequest, res: VercelResponse) {

  // 1. Handle daily integrity audit (Cron)
  if (req.method === "GET") {
    const authHeader = req.headers.authorization;
    if (process.env.CRON_SECRET && authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
      return res.status(401).json({ error: "UNAUTHORIZED_PULSE" });
    }

    try {
      console.log("[SHADOW_MONITOR] INITIATING_INTEGRITY_AUDIT...");
      
      const snapshot = await adminDb.collection('introduction_ledger')
        .where('feeStatus', '==', 'PENDING')
        .get();

      const outliers = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() as any }));

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
        details: error.message
      });
    }
  }

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  const { action, payload } = req.body || {};

  try {
    // 1. Log Audit Trail (Live)
    await adminDb.collection('audit_trails').add({
      action: action,
      entity_type: 'SYSTEM',
      entity_id: payload?.userId || 'SYSTEM_CORE',
      details: { ip: req.headers['x-forwarded-for'] || 'unknown', payload },
      timestamp: new Date().toISOString()
    });

    // 2. Handle Actions
    switch (action) {
      case "VERIFY_LICENSE": {
        const docId = payload?.trackingId || payload?.employerId;
        const licenseSnap = await adminDb.collection('employer_licenses').doc(docId).get();

        if (!licenseSnap.exists) {
          return res.status(404).json({ error: "LICENSE_NOT_FOUND" });
        }
        
        const licenseData = licenseSnap.data();
        return res.status(200).json({
          status: licenseData?.status || "VALID",
          licenseNumber: licenseData?.licenseNumber,
          expiry: licenseData?.expiry,
          competentPerson: licenseData?.competentPerson
        });
      }

      case "RECORD_CONSENT": {
        await adminDb.collection('user_consent').add({
          ...payload,
          timestamp: new Date().toISOString()
        });
        return res.status(200).json({ status: "CONSENT_RECORDED", timestamp: new Date().toISOString() });
      }

      case "CHECK_TCN_ELIGIBILITY": {
        const tcnSnap = await adminDb.collection('candidate_eligibility').doc(payload?.candidateId).get();

        if (!tcnSnap.exists) {
          return res.status(404).json({ error: "ELIGIBILITY_DATA_NOT_FOUND" });
        }

        const tcnData = tcnSnap.data();
        return res.status(200).json({
          eligible: tcnData?.eligible || false,
          requirements: tcnData?.requirements || [],
          processingTime: tcnData?.processingTime || "Unknown"
        });
      }

      default:
        return res.status(400).json({ error: "INVALID_ACTION" });
    }
  } catch (error: any) {
    console.error("Compliance API Error:", error);
    return res.status(500).json({ error: "INTERNAL_SERVER_ERROR", detail: error.message });
  }
}
