import { adminDb } from "../_lib/firebase-admin.js";
import { getJsonBody } from "../_lib/body.js";
import { requireUser } from "../_lib/auth.js";
import { anonymizeCandidate } from "../_lib/anonymize.js";
import crypto from 'crypto';

import type { VercelRequest, VercelResponse } from "@vercel/node";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Handle GET for vacancy listing
  if (req.method === "GET") {
    try {
      const snapshot = await adminDb.collection("vacancies")
        .where("status", "==", "published")
        .orderBy("created_at", "desc")
        .get();

      const vacancies = await Promise.all(snapshot.docs.map(async (doc) => {
        const data = doc.data();
        // Fetch employer company name
        let companyName = "Unknown";
        if (data.employer_id) {
          const empDoc = await adminDb.collection("profiles").doc(data.employer_id).get();
          if (empDoc.exists) {
            companyName = empDoc.data()?.company_name || "Nova Partner";
          }
        }
        return {
          id: doc.id,
          ...data,
          employer: { company_name: companyName }
        };
      }));

      return res.status(200).json({ vacancies });
    } catch (error: any) {
      return res.status(500).json({ error: "VACANCY_LIST_FAILED", detail: error.message });
    }
  }

  if (req.method !== "POST") {
    return res.status(405).json({ error: "METHOD_NOT_ALLOWED" });
  }

  const body = getJsonBody(req);
  const action = body?.action;

  // ACTION: LIST_VACANCIES (Duplicate of GET for consistency)
  if (action === "LIST_VACANCIES") {
    try {
      const snapshot = await adminDb.collection("vacancies")
        .where("status", "==", "published")
        .orderBy("created_at", "desc")
        .get();

      const vacancies = await Promise.all(snapshot.docs.map(async (doc) => {
        const data = doc.data();
        let companyName = "Unknown";
        if (data.employer_id) {
          const empDoc = await adminDb.collection("profiles").doc(data.employer_id).get();
          if (empDoc.exists) {
            companyName = empDoc.data()?.company_name || "Nova Partner";
          }
        }
        return {
          id: doc.id,
          ...data,
          employer: { company_name: companyName }
        };
      }));
      return res.status(200).json({ vacancies });
    } catch (error: any) {
      return res.status(500).json({ error: "VACANCY_LIST_FAILED", detail: error.message });
    }
  }

  // AUTHENTICATED ACTIONS
  const auth = await requireUser(req);
  if (auth.error) {
    return res.status(auth.error.status).json({ error: auth.error.message });
  }

  // ACTION: CREATE_VACANCY
  if (action === "CREATE_VACANCY") {
    const title = body?.title?.toString().trim();
    const description = body?.description?.toString().trim();

    if (!title || !description) {
      return res.status(400).json({ error: "MISSING_FIELDS" });
    }

    const score = Number(body?.complianceScore ?? 0);
    const status = score >= 85 ? "published" : score > 0 ? "flagged" : "draft";

    try {
      const docRef = await adminDb.collection("vacancies").add({
        employer_id: auth.user.id,
        title,
        description,
        compliance_score: score,
        status,
        created_at: new Date().toISOString(),
        last_activity_at: new Date().toISOString()
      });

      const newDoc = await docRef.get();
      return res.status(200).json({ vacancy: { id: docRef.id, ...newDoc.data() } });
    } catch (error: any) {
      return res.status(400).json({ error: "VACANCY_INSERT_FAILED", detail: error.message });
    }
  }

  // ACTION: SUBMIT_APPLICATION
  if (action === "SUBMIT_APPLICATION") {
    const { jobId, employerId, matchScore, aiAnalysis } = body;
    if (!jobId || matchScore === undefined) {
      return res.status(400).json({ error: "MISSING_APPLICATION_DATA" });
    }

    try {
      const docRef = await adminDb.collection("applications").add({
        job_id: jobId,
        employer_id: employerId, // Pass through employer ID for filtering
        candidate_id: auth.user.id,
        match_score: matchScore,
        ai_analysis: aiAnalysis,
        status: 'applied',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      });

      const newDoc = await docRef.get();
      return res.status(200).json({ application: { id: docRef.id, ...newDoc.data() } });
    } catch (error: any) {
      return res.status(400).json({ error: "APPLICATION_SUBMISSION_FAILED", detail: error.message });
    }
  }

  // ACTION: LIST_APPLICANTS
  if (action === "LIST_APPLICANTS") {
    const { jobId } = body;
    if (!jobId) {
      return res.status(400).json({ error: "MISSING_JOB_ID" });
    }

    try {
      // 1. Verify Ownership
      const jobSnap = await adminDb.collection("vacancies").doc(jobId).get();
      if (!jobSnap.exists || jobSnap.data()?.employer_id !== auth.user.id) {
        return res.status(403).json({ error: "UNAUTHORIZED_JOB_ACCESS" });
      }

      const job = jobSnap.data();
      const profileSnap = await adminDb.collection("profiles").doc(auth.user.id).get();
      const employerProfile = profileSnap.data();

      const isPro = ['pro', 'pulse_pro', 'enterprise'].includes(employerProfile?.subscription_tier || '');
      const requiresTCN = job?.requires_tcn_compliance || false;

      // 2. Fetch Applications
      const appSnap = await adminDb.collection("applications")
        .where("job_id", "==", jobId)
        .orderBy("match_score", "desc")
        .get();

      const applicants = await Promise.all(appSnap.docs.map(async (doc) => {
        const appData = doc.data();
        const candSnap = await adminDb.collection("profiles").doc(appData.candidate_id).get();
        const candidate = candSnap.data();

        if (!candidate) return null;

        // Filter for Free tier TCN requirements
        if (!isPro && requiresTCN && candidate.tcn_status !== 'verified_skills_pass') {
          return null;
        }

        const anonymized = anonymizeCandidate({ ...candidate, id: candSnap.id, match_score: appData.match_score }, isPro, auth.user.id);

        return {
          id: doc.id,
          ...appData,
          candidate: anonymized,
          _compliance: isPro ? {
            tcn_ready: candidate.tcn_status === 'verified_skills_pass',
            expiry: candidate.tcn_expiry_date,
            verification_id: candidate.tcn_verification_id
          } : null
        };
      }));

      const safeApplicants = applicants.filter(Boolean);

      // 3. Mark Activity
      await adminDb.collection("vacancies").doc(jobId).update({ last_activity_at: new Date().toISOString() });

      return res.status(200).json({
        applicants: safeApplicants,
        metadata: {
          total: safeApplicants.length,
          isBlurred: !isPro,
          pro_required: !isPro && requiresTCN,
          upgrade_url: !isPro ? '/portal/employer/upgrade' : null
        }
      });
    } catch (error: any) {
      return res.status(500).json({ error: "APPLICANT_LIST_FAILED", detail: error.message });
    }
  }

  // ACTION: UPDATE_APPLICATION_STATUS
  if (action === "UPDATE_APPLICATION_STATUS") {
    const { applicationId, newStatus } = body;
    if (!applicationId || !newStatus) {
      return res.status(400).json({ error: "MISSING_STATUS_DATA" });
    }

    const allowedStatuses = ['reviewing', 'shortlisted', 'rejected', 'interview', 'hired'];
    if (!allowedStatuses.includes(newStatus)) {
      return res.status(400).json({ error: "INVALID_STATUS_VALUE" });
    }

    try {
      const appSnap = await adminDb.collection("applications").doc(applicationId).get();
      if (!appSnap.exists) {
        return res.status(404).json({ error: "APPLICATION_NOT_FOUND" });
      }

      const appData = appSnap.data();
      const jobSnap = await adminDb.collection("vacancies").doc(appData?.job_id).get();
      if (!jobSnap.exists || jobSnap.data()?.employer_id !== auth.user.id) {
        return res.status(403).json({ error: "UNAUTHORIZED_STATUS_CHANGE" });
      }

      await adminDb.collection("applications").doc(applicationId).update({
        status: newStatus,
        updated_at: new Date().toISOString()
      });

      // Update response rate
      const allAppsSnap = await adminDb.collection("applications").where("job_id", "==", appData?.job_id).get();
      const allApps = allAppsSnap.docs;
      const responded = allApps.filter(a => a.data().status !== 'applied').length;
      const rate = (responded / allApps.length) * 100;

      await adminDb.collection("vacancies").doc(appData?.job_id).update({
        last_activity_at: new Date().toISOString(),
        response_rate: rate,
        total_applications_processed: allApps.length
      });

      const updated = await adminDb.collection("applications").doc(applicationId).get();
      return res.status(200).json({ application: { id: updated.id, ...updated.data() } });
    } catch (error: any) {
      return res.status(500).json({ error: "STATUS_UPDATE_FAILED", detail: error.message });
    }
  }

  // ACTION: COMMIT_TO_LEDGER
  if (action === "COMMIT_TO_LEDGER") {
    const { applicationId, finalSalary, matchScore } = body;
    if (!applicationId) {
      return res.status(400).json({ error: "MISSING_APPLICATION_ID" });
    }

    try {
      const appSnap = await adminDb.collection("applications").doc(applicationId).get();
      if (!appSnap.exists) {
        return res.status(403).json({ error: "UNAUTHORIZED_LEDGER_COMMIT" });
      }

      const appData = appSnap.data()!;
      const jobSnap = await adminDb.collection("vacancies").doc(appData.job_id).get();
      if (!jobSnap.exists || jobSnap.data()?.employer_id !== auth.user.id) {
        return res.status(403).json({ error: "UNAUTHORIZED_LEDGER_COMMIT" });
      }

      const successHash = crypto
        .createHash('sha256')
        .update(`${applicationId}${finalSalary || "0"}${appData.created_at}`)
        .digest('hex');

      const ledgerRef = await adminDb.collection("introduction_ledger").add({
        applicationId: applicationId,
        employerId: auth.user.id,
        candidateId: appData.candidate_id,
        final_salary: finalSalary,
        success_hash: successHash,
        neural_match_snapshot: matchScore,
        feeStatus: 'RELEASED',
        created_at: new Date().toISOString(),
        releasedAt: new Date().toISOString()
      });

      await adminDb.collection("applications").doc(applicationId).update({ status: 'hired' });

      return res.status(200).json({
        status: 'COMMITTED',
        hash: successHash,
        ledgerId: ledgerRef.id
      });
    } catch (err: any) {
      return res.status(500).json({ error: "SYSTEM_COMMIT_EXCEPTION", message: err.message });
    }
  }

  if (action === "GET_SESSION") {
    return res.status(200).json({
      status: "AUTHORIZED",
      userId: auth.user.id,
    });
  }

  return res.status(400).json({ error: "INVALID_ACTION", action });
}
