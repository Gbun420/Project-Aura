import { adminDb, admin } from "../_lib/firebase-admin.js";
import { requireUser } from "../_lib/auth.js";
import type { VercelRequest, VercelResponse } from "@vercel/node";

export default async function handler(req: VercelRequest, res: VercelResponse) {

  // Handle simple ping for monitoring
  if (req.query.simple === 'true') {
    return res.status(200).json({ 
      status: 'ok', 
      timestamp: new Date().toISOString(),
      version: '1.2.1'
    });
  }

  if (req.method !== "GET") {
    return res.status(405).json({ error: "METHOD_NOT_ALLOWED" });
  }

  // Security: Only Admins can access full telemetry
  const auth = await requireUser(req);
  if (auth.error) {
    return res.status(401).json({ error: "UNAUTHORIZED_PULSE_ACCESS" });
  }

  try {
    const profileSnap = await adminDb.collection('profiles').doc(auth.user.id).get();
    const profile = profileSnap.data();

    if (profile?.role !== 'admin') {
      return res.status(403).json({ error: "ADMIN_ACCESS_REQUIRED" });
    }

    const [
      totalProfiles,
      totalEmployers,
      totalCandidates,
      totalProSubs,
      totalMatches,
      ledgerSum
    ] = await Promise.all([
      adminDb.collection('profiles').count().get(),
      adminDb.collection('profiles').where('role', '==', 'employer').count().get(),
      adminDb.collection('profiles').where('role', '==', 'candidate').count().get(),
      adminDb.collection('profiles').where('subscription_tier', 'in', ['pro', 'pulse_pro', 'enterprise']).count().get(),
      adminDb.collection('applications').count().get(),
      adminDb.collection('introduction_ledger').aggregate({
        totalSalary: admin.firestore.AggregateField.sum('final_salary')
      }).get()
    ]);

    const totalSalary = ledgerSum.data().totalSalary || 0;

    const metrics = {
      total_registrations: totalProfiles.data().count,
      employer_count: totalEmployers.data().count,
      candidate_count: totalCandidates.data().count,
      pro_subscriptions: totalProSubs.data().count,
      neural_match_events: totalMatches.data().count,
      gross_ledger_volume: totalSalary,
      mrr: totalProSubs.data().count * 29,
      sector_heatmap: [],
      health_status: "SYSTEM_OPTIMIZED",
      timestamp: new Date().toISOString()
    };

    // Log this pulse to telemetry
    await adminDb.collection('system_telemetry').add({
      registrations_count: metrics.total_registrations,
      employer_count: metrics.employer_count,
      candidate_count: metrics.candidate_count,
      pro_subscriptions_count: metrics.pro_subscriptions,
      neural_matches_count: metrics.neural_match_events,
      timestamp: admin.firestore.FieldValue.serverTimestamp()
    });

    return res.status(200).json(metrics);
  } catch (error: any) {
    console.error("Telemetry Error:", error);
    return res.status(500).json({ error: "TELEMETRY_GATHER_FAILED", detail: error.message });
  }
}
