import { createClient } from "@supabase/supabase-js";
import { getJsonBody } from "../_lib/body.js";
import { requireUser } from "../_lib/auth.js";
import { anonymizeCandidate } from "../_lib/anonymize.js";
import crypto from 'crypto';

import type { VercelRequest, VercelResponse } from "@vercel/node";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    return res.status(500).json({ error: "SUPABASE_NOT_CONFIGURED" });
  }

  // Handle GET for legacy or direct listing
  if (req.method === "GET") {
    const supabase = createClient(supabaseUrl, supabaseAnonKey);
    const { data, error } = await supabase
      .from("vacancies")
      .select(
        "id, title, description, compliance_score, status, created_at, last_activity_at, response_rate, employer:profiles!vacancies_employer_id_fkey(company_name)"
      )
      .eq("status", "published")
      .order("created_at", { ascending: false });

    if (error) {
      return res.status(500).json({ error: "VACANCY_LIST_FAILED", detail: error.message });
    }
    return res.status(200).json({ vacancies: data ?? [] });
  }

  if (req.method !== "POST") {
    return res.status(405).json({ error: "METHOD_NOT_ALLOWED" });
  }

  const body = getJsonBody(req);
  const action = body?.action;

  // ACTION: LIST_VACANCIES
  if (action === "LIST_VACANCIES") {
    const supabase = createClient(supabaseUrl, supabaseAnonKey);
    const { data, error } = await supabase
      .from("vacancies")
      .select(
        "id, title, description, compliance_score, status, created_at, last_activity_at, response_rate, employer:profiles!vacancies_employer_id_fkey(company_name)"
      )
      .eq("status", "published")
      .order("created_at", { ascending: false });

    if (error) {
      return res.status(500).json({ error: "VACANCY_LIST_FAILED", detail: error.message });
    }
    return res.status(200).json({ vacancies: data ?? [] });
  }

  // AUTHENTICATED ACTIONS
  const auth = await requireUser(req);
  if (auth.error) {
    return res.status(auth.error.status).json({ error: auth.error.message });
  }

  const authHeader = req.headers.authorization || "";
  const token = authHeader.startsWith("Bearer ") ? authHeader.slice(7) : "";
  const options = token ? { global: { headers: { Authorization: `Bearer ${token}` } } } : {};
  const supabase = createClient(supabaseUrl, supabaseAnonKey, options);

  // ACTION: CREATE_VACANCY
  if (action === "CREATE_VACANCY") {
    const title = body?.title?.toString().trim();
    const description = body?.description?.toString().trim();

    if (!title || !description) {
      return res.status(400).json({ error: "MISSING_FIELDS" });
    }

    const score = Number(body?.complianceScore ?? 0);
    const status = score >= 85 ? "published" : score > 0 ? "flagged" : "draft";

    const { data, error } = await supabase
      .from("vacancies")
      .insert({
        employer_id: auth.user.id,
        title,
        description,
        compliance_score: score,
        status,
      })
      .select()
      .single();

    if (error) {
      return res.status(400).json({ error: "VACANCY_INSERT_FAILED", detail: error.message });
    }

    return res.status(200).json({ vacancy: data });
  }

  // ACTION: SUBMIT_APPLICATION
  if (action === "SUBMIT_APPLICATION") {
    const { jobId, matchScore, aiAnalysis } = body;
    if (!jobId || matchScore === undefined) {
      return res.status(400).json({ error: "MISSING_APPLICATION_DATA" });
    }

    const { data, error } = await supabase
      .from("applications")
      .insert({
        job_id: jobId,
        candidate_id: auth.user.id,
        match_score: matchScore,
        ai_analysis: aiAnalysis,
      })
      .select()
      .single();

    if (error) {
      return res.status(400).json({ error: "APPLICATION_SUBMISSION_FAILED", detail: error.message });
    }

    return res.status(200).json({ application: data });
  }

  // ACTION: LIST_APPLICANTS (Enhanced with Anonymization and Compliance filtering)
  if (action === "LIST_APPLICANTS") {
    const { jobId } = body;
    if (!jobId) {
      return res.status(400).json({ error: "MISSING_JOB_ID" });
    }

    // 1. Check Employer's Subscription Tier and Job Compliance Requirements
    const { data: job, error: jobError } = await supabase
      .from("vacancies")
      .select("id, requires_tcn_compliance")
      .eq("id", jobId)
      .eq("employer_id", auth.user.id)
      .single();

    if (jobError || !job) {
      return res.status(403).json({ error: "UNAUTHORIZED_JOB_ACCESS" });
    }

    const { data: employerProfile } = await supabase
      .from("profiles")
      .select("subscription_tier")
      .eq("id", auth.user.id)
      .single();

    const isPro = employerProfile?.subscription_tier === "pro" || employerProfile?.subscription_tier === "pulse_pro" || employerProfile?.subscription_tier === "enterprise";
    const requiresTCN = job.requires_tcn_compliance || false;

    // 2. Build Query
    let query = supabase
      .from("applications")
      .select(`
        id,
        match_score,
        ai_analysis,
        status,
        created_at,
        candidate:profiles!applications_candidate_id_fkey(
          id,
          full_name,
          email,
          role,
          tcn_status,
          tcn_expiry_date,
          tcn_verification_id,
          resume_text
        )
      `)
      .eq("job_id", jobId)
      .order("match_score", { ascending: false });

    const { data: applicants, error: appError } = await query;

    if (appError) {
      return res.status(500).json({ error: "APPLICANT_LIST_FAILED", detail: appError.message });
    }

    // 3. Anonymize and Add Compliance Metadata based on Subscription
    const safeApplicants = (applicants || []).map(app => {
      const candidate = app.candidate as any;
      
      // Determine if this applicant should be filtered out on Free tier (only show TCN-ready if job requires it)
      if (!isPro && requiresTCN && candidate.tcn_status !== 'verified_skills_pass') {
        return null; 
      }

      const anonymized = anonymizeCandidate({ ...candidate, match_score: app.match_score }, isPro, auth.user.id);
      
      return {
        ...app,
        candidate: anonymized,
        _compliance: isPro ? {
          tcn_ready: candidate.tcn_status === 'verified_skills_pass',
          expiry: candidate.tcn_expiry_date,
          verification_id: candidate.tcn_verification_id
        } : null
      };
    }).filter(Boolean);

    // 4. Update Trust Engine: Mark activity
    await supabase.from("vacancies").update({ last_activity_at: new Date().toISOString() }).eq("id", jobId);

    return res.status(200).json({ 
      applicants: safeApplicants,
      metadata: {
        total: safeApplicants.length,
        isBlurred: !isPro,
        pro_required: !isPro && requiresTCN,
        upgrade_url: !isPro ? '/portal/employer/upgrade' : null
      }
    });
  }

  // ACTION: UPDATE_APPLICATION_STATUS
  if (action === "UPDATE_APPLICATION_STATUS") {
    const { applicationId, newStatus } = body;
    if (!applicationId || !newStatus) {
      return res.status(400).json({ error: "MISSING_STATUS_DATA" });
    }

    // SECURITY: Whitelist allowed status transitions
    const allowedStatuses = ['reviewing', 'shortlisted', 'rejected', 'interview', 'hired'];
    if (!allowedStatuses.includes(newStatus)) {
      return res.status(400).json({ error: "INVALID_STATUS_VALUE" });
    }

    // SECURITY: Verify employer owns the job linked to this application
    const { data: appCheck } = await supabase
      .from("applications")
      .select("job_id")
      .eq("id", applicationId)
      .single();

    if (!appCheck) {
      return res.status(404).json({ error: "APPLICATION_NOT_FOUND" });
    }

    const { data: jobCheck } = await supabase
      .from("vacancies")
      .select("id")
      .eq("id", appCheck.job_id)
      .eq("employer_id", auth.user.id)
      .single();

    if (!jobCheck) {
      return res.status(403).json({ error: "UNAUTHORIZED_STATUS_CHANGE" });
    }

    const { data, error } = await supabase
      .from("applications")
      .update({ status: newStatus, updated_at: new Date().toISOString() })
      .eq("id", applicationId)
      .select()
      .single();

    // 4. Update Trust Engine: Recalculate response rate for the job
    const { data: allApps } = await supabase
      .from("applications")
      .select("status")
      .eq("job_id", appCheck.job_id);
    
    if (allApps && allApps.length > 0) {
      const responded = allApps.filter(a => a.status !== 'applied').length;
      const rate = (responded / allApps.length) * 100;
      await supabase.from("vacancies")
        .update({ 
          last_activity_at: new Date().toISOString(),
          response_rate: rate,
          total_applications_processed: allApps.length
        })
        .eq("id", appCheck.job_id);
    }

    return res.status(200).json({ application: data });
  }

  // ACTION: COMMIT_TO_LEDGER (Finalize Hire)
  if (action === "COMMIT_TO_LEDGER") {
    const { applicationId, finalSalary, matchScore } = body;
    if (!applicationId) {
      return res.status(400).json({ error: "MISSING_APPLICATION_ID" });
    }

    try {
      // 1. Verification: Ensure Employer owns the Job linked to this Application
      const { data: appData, error: appError } = await supabase
        .from("applications")
        .select("job_id, created_at")
        .eq("id", applicationId)
        .single();

      if (appError || !appData) {
        return res.status(403).json({ error: "UNAUTHORIZED_LEDGER_COMMIT" });
      }

      // SECURITY: Verify employer actually owns this job
      const { data: ownerCheck } = await supabase
        .from("vacancies")
        .select("id")
        .eq("id", appData.job_id)
        .eq("employer_id", auth.user.id)
        .single();

      if (!ownerCheck) {
        return res.status(403).json({ error: "UNAUTHORIZED_LEDGER_COMMIT" });
      }

      // 2. Generate the immutable "Aura Success Certificate" Hash
      // Deterministic: ID + Salary + Creation Timestamp
      const successHash = crypto
        .createHash('sha256')
        .update(`${applicationId}${finalSalary || "0"}${appData.created_at}`)
        .digest('hex');

      // 3. Insert into Ledger with Snapshot integrity
      const { data: ledgerEntry, error: ledgerError } = await supabase
        .from("ledger")
        .insert({
          application_id: applicationId,
          employer_id: auth.user.id,
          final_salary: finalSalary,
          success_hash: successHash,
          neural_match_snapshot: matchScore
        })
        .select()
        .single();

      if (ledgerError) {
        // Log to internal telemetry if DB insert fails
        console.error("LEDGER_DB_FAILURE", ledgerError);
        return res.status(500).json({ error: "LEDGER_COMMIT_FAILED", detail: ledgerError.message });
      }

      // 4. Atomic status update
      await supabase.from("applications").update({ status: 'hired' }).eq("id", applicationId);

      return res.status(200).json({ 
        status: 'COMMITTED', 
        hash: successHash,
        ledgerId: ledgerEntry.id 
      });
    } catch (err: any) {
      return res.status(500).json({ error: "SYSTEM_COMMIT_EXCEPTION", message: err.message });
    }
  }

  // ACTION: UPGRADE_SUBSCRIPTION — DISABLED
  // SECURITY: Self-service tier escalation removed. Subscription changes
  // must only occur through verified Stripe webhook events.
  if (action === "UPGRADE_SUBSCRIPTION") {
    return res.status(403).json({ 
      error: "UPGRADE_VIA_CHECKOUT_ONLY",
      message: "Subscription upgrades must go through the payment flow.",
      checkout_url: "/portal/employer/upgrade"
    });
  }

  // ACTION: GET_SESSION (Auth Consolidation)
  if (action === "GET_SESSION") {
    return res.status(200).json({
      status: "AUTHORIZED",
      userId: auth.user.id,
    });
  }

  return res.status(400).json({ error: "INVALID_ACTION", action });
}
