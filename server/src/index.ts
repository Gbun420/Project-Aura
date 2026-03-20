import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import dotenv from 'dotenv';
import rateLimit from 'express-rate-limit';
import admin from 'firebase-admin';
import Stripe from 'stripe';
import crypto from 'crypto';
import { GoogleGenerativeAI } from "@google/generative-ai";

// Import Nova Hardened Subsystems
import { SovereignVault } from './core/security/Vault.js';
import { BountyGuardian } from './core/ledger/BountyGuardian.js';
import { ManifestGenerator } from './services/novaOS/ManifestGenerator.js';
import { PulseAggregator } from './services/novaOS/PulseAggregator.js';
import { AuditExportService } from './services/novaOS/AuditExportService.js';
import { AuditTrailService } from './core/audit/AuditTrailService.js';
import { attachPilot } from './core/communications/SuccessPilot.js';
import { ShadowMonitor } from './workers/ShadowMonitor.js';

// Initialize Environment
dotenv.config();
const PORT = process.env.PORT || 3001;

// 1. Initialize Firebase Admin
if (!admin.apps.length) {
  const firebaseConfig = process.env.FIREBASE_CONFIG_JSON;
  if (firebaseConfig) {
    try {
      const serviceAccount = JSON.parse(firebaseConfig);
      admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
      });
      console.log("FIREBASE_INIT: Using SERVICE_ACCOUNT_JSON");
    } catch (e) {
      console.error("FIREBASE_INIT_ERR: Failed to parse FIREBASE_CONFIG_JSON", e);
      admin.initializeApp({
        credential: admin.credential.applicationDefault(),
      });
    }
  } else {
    admin.initializeApp({
      credential: admin.credential.applicationDefault(),
    });
    console.log("FIREBASE_INIT: Using APPLICATION_DEFAULT");
  }
}

const firestore = admin.firestore();

// Boot Sequence
const app = express();
const server = http.createServer(app);

// 2. Production Hardening: Rate Limiting
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: { error: "TOO_MANY_REQUESTS: Please wait before retrying." }
});

// 3. Middleware Calibration
app.use(cors({
  origin: [
    'http://localhost:5173', // Local Dev
    'http://localhost:80',   // Staging Frontend
    'https://nova-os-v1.vercel.app', // Production URL
    'https://talentvault-446214.web.app', // Firebase Hosting (New)
    'https://talentvault-446214.firebaseapp.com', // Firebase Hosting Fallback
    'https://project-aura-backend-cw7d.onrender.com', // Render Backend
    'chrome-extension://ghost-link-id-placeholder' // Strict origin for Browser Extension
  ],
  methods: ['GET', 'POST', 'PUT'],
  credentials: true
}));

// Stripe Webhook needs raw body for signature verification
app.post('/api/billing/webhook', express.raw({ type: 'application/json' }), async (req, res) => {
  const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!stripeSecretKey || !webhookSecret) {
    console.error("STRIPE_KEYS_MISSING: STRIPE_SECRET_KEY and STRIPE_WEBHOOK_SECRET must be set");
    return res.status(500).json({ error: "PAYMENT_GATEWAY_NOT_CONFIGURED" });
  }

  const stripe = new Stripe(stripeSecretKey, {
    apiVersion: '2023-10-16' as any,
  });
  
  const signature = req.headers["stripe-signature"];
  if (!signature) return res.status(400).json({ error: "MISSING_STRIPE_SIGNATURE" });

  try {
    const event = stripe.webhooks.constructEvent(req.body, signature, webhookSecret);

    if (event.type === "checkout.session.completed") {
      const session = event.data.object as Stripe.Checkout.Session;
      const userId = session.client_reference_id;

      if (userId) {
        await firestore.collection("profiles").doc(userId).update({
          subscription_tier: "pulse_pro",
          subscription_expires_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
        });
        console.log(`[STRIPE] Activated Pulse Pro for User: ${userId}`);
      }
    }
    res.status(200).json({ received: true });
  } catch (err: any) {
    console.error("WEBHOOK_ERR:", err.message);
    res.status(400).send(`Webhook Error: ${err.message}`);
  }
});

// For all other routes, use standard JSON parsing
app.use(express.json());

// Apply rate limiter to all API routes
app.use('/api/', apiLimiter);

interface AuthUser {
  id: string;
  email?: string | undefined;
}

interface AuthRequest extends express.Request {
  user?: AuthUser;
}

// 4. Auth Guard Middleware
const authGuard = async (req: AuthRequest, res: express.Response, next: express.NextFunction) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).json({ error: "UNAUTHORIZED_ACCESS: Credentials Required." });
  }

  const token = authHeader.split(' ')[1];
  if (!token) {
    return res.status(401).json({ error: "UNAUTHORIZED_ACCESS: Malformed Token." });
  }

  try {
    const decodedToken = await admin.auth().verifyIdToken(token);
    req.user = {
      id: decodedToken.uid,
      email: decodedToken.email
    };
    next();
  } catch (err) {
    console.error("AUTH_GUARD_ERR:", err);
    return res.status(401).json({ error: "UNAUTHORIZED_ACCESS: Invalid or Expired Token." });
  }
};

// 5. CI/CD Health Endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'NOVA_CORE_ONLINE', timestamp: new Date() });
});

// ANONYMIZATION UTILITY
const anonymizeCandidate = (candidate: any, isPro: boolean, employerId: string) => {
  if (isPro) return candidate;
  const salt = process.env.ANONYMIZATION_SALT || 'nova_default_salt_2026';
  const hash = crypto.createHash('sha256').update(candidate.id + employerId + salt).digest('hex').slice(0, 8).toUpperCase();
  return {
    ...candidate,
    id: `nova_${hash}`,
    full_name: `Nova Candidate ${hash}`,
    email: null,
    phone: null,
    resume_text: candidate.resume_text ? candidate.resume_text.slice(0, 200) + "..." : "Unlock Pro to view verified resume history.",
    compliance_status: candidate.tcn_status,
    _metadata: {
      blurred: true,
      upgrade_prompt: "PIONEER_OFFER: Subscribe to Pulse Pro for €29/mo (was €49) to unlock direct contact",
      match_quality: candidate.match_score 
    }
  };
};

// HIRING HUB
app.post('/api/hiring/hub', authGuard as any, async (req, res) => {
  const { action, jobId, applicationId, newStatus, finalSalary, matchScore } = req.body;
  const auth = (req as AuthRequest);

  try {
    if (action === "LIST_VACANCIES") {
      const snapshot = await firestore.collection("vacancies").where("status", "==", "published").orderBy("created_at", "desc").get();
      const vacancies = await Promise.all(snapshot.docs.map(async (doc) => {
        const data = doc.data();
        let companyName = "Unknown";
        if (data.employer_id) {
          const empDoc = await firestore.collection("profiles").doc(data.employer_id).get();
          companyName = empDoc.exists ? (empDoc.data()?.company_name || "Nova Partner") : "Nova Partner";
        }
        return { id: doc.id, ...data, employer: { company_name: companyName } };
      }));
      return res.json({ vacancies });
    }

    if (action === "CREATE_VACANCY") {
      const { title, description, complianceScore, requiresTCN, complianceMeta } = req.body;
      const score = Number(complianceScore ?? 0);
      const status = score >= 85 ? "published" : score > 0 ? "flagged" : "draft";
      const docRef = await firestore.collection("vacancies").add({
        employer_id: auth.user?.id,
        title,
        description,
        compliance_score: score,
        status,
        requires_tcn_compliance: !!requiresTCN,
        compliance_meta: complianceMeta || {},
        created_at: new Date().toISOString(),
        last_activity_at: new Date().toISOString()
      });
      return res.json({ vacancy: { id: docRef.id } });
    }

    if (action === "GET_LEDGER_HISTORY") {
      const snapshot = await firestore.collection("introduction_ledger")
        .where("employerId", "==", auth.user?.id)
        .orderBy("created_at", "desc")
        .get();
      
      const history = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        // Map backend fields to frontend expected fields if necessary
        hash: doc.data().success_hash,
        notified_at: doc.data().created_at,
        fee_status: doc.data().feeStatus
      }));
      
      return res.json({ history });
    }

    if (action === "LIST_APPLICANTS") {
      if (!jobId) return res.status(400).json({ error: "MISSING_JOB_ID" });
      const jobSnap = await firestore.collection("vacancies").doc(jobId).get();
      if (!jobSnap.exists || jobSnap.data()?.employer_id !== auth.user?.id) {
        return res.status(403).json({ error: "UNAUTHORIZED_JOB_ACCESS" });
      }
      const employerSnap = await firestore.collection("profiles").doc(auth.user?.id!).get();
      const isPro = ['pro', 'pulse_pro', 'enterprise'].includes(employerSnap.data()?.subscription_tier || '');
      
      const appSnap = await firestore.collection("applications").where("job_id", "==", jobId).orderBy("match_score", "desc").get();
      const applicants = await Promise.all(appSnap.docs.map(async (doc) => {
        const appData = doc.data();
        const candSnap = await firestore.collection("profiles").doc(appData.candidate_id).get();
        if (!candSnap.exists) return null;
        const anonymized = anonymizeCandidate({ ...candSnap.data(), id: candSnap.id, match_score: appData.match_score }, isPro, auth.user?.id!);
        return { id: doc.id, ...appData, candidate: anonymized };
      }));
      return res.json({ applicants: applicants.filter(Boolean), metadata: { isBlurred: !isPro } });
    }

    if (action === "UPDATE_APPLICATION_STATUS") {
      await firestore.collection("applications").doc(applicationId).update({ status: newStatus, updated_at: new Date().toISOString() });
      return res.json({ success: true });
    }

    if (action === "COMMIT_TO_LEDGER") {
      const appSnap = await firestore.collection("applications").doc(applicationId).get();
      const successHash = crypto.createHash('sha256').update(`${applicationId}${finalSalary}${Date.now()}`).digest('hex');
      await firestore.collection("introduction_ledger").add({
        applicationId, employerId: auth.user?.id, candidateId: appSnap.data()?.candidate_id,
        final_salary: finalSalary, success_hash: successHash, feeStatus: 'RELEASED',
        created_at: new Date().toISOString()
      });
      return res.json({ status: 'COMMITTED', hash: successHash });
    }

    res.status(400).json({ error: "INVALID_ACTION" });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// NEURAL CORE
app.post('/api/ai/neural', authGuard as any, async (req, res) => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) return res.status(500).json({ error: "GEMINI_KEY_MISSING" });
  
  const { action, payload, content } = req.body;
  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

  try {
    if (action === "ANALYZE_COMPLIANCE") {
      const prompt = `Analyze job description for Maltese DIER compliance. JSON only: {"score": number, "flags": string[]}. Content: ${JSON.stringify(content)}`;
      const result = await model.generateContent(prompt);
      const text = (await result.response).text().replace(/```json|```/g, "").trim();
      return res.json(JSON.parse(text));
    }

    if (action === "RESUME_MATCH") {
      const { resumeText, jobDescription } = payload || {};
      if (!resumeText || !jobDescription) return res.status(400).json({ error: "MISSING_MATCH_DATA" });
      const prompt = `System: You are the Nova Neural Match Engine v2.0 (2026 Build). Task: Deep-level compatibility analysis between Candidate Resume and Job Description. Format: JSON only. { "matchScore": number (0-100), "alignment": string[], "behavioralAlignment": string, "culturalFit": number, "gaps": string[] }\nCandidate Resume: "${resumeText}"\nJob Description: "${jobDescription}"`;
      const result = await model.generateContent(prompt);
      const text = (await result.response).text().replace(/```json|```/g, "").trim();
      return res.json(JSON.parse(text));
    }

    if (action === "NOVA_MATCH") {
      return res.json({ status: "NOVA_MATCH_READY", message: "Neural matching engine online." });
    }

    if (action === "VERIFY_SKILLS_PASS") {
      const { fileData, mimeType } = payload || {};
      if (!fileData || !mimeType) return res.status(400).json({ error: "MISSING_DOCUMENT_DATA" });
      const prompt = `System: You are the Nova Compliance Validator for the 2026 Maltese labor market. Task: Analyze this document for 'Skills Pass' authenticity issued by Identità Malta. Output JSON only: { "verified": boolean, "expiryDate": string, "englishLevel": string, "confidence": number, "reasoning": string }`;
      const result = await model.generateContent([prompt, { inlineData: { data: fileData, mimeType } }]);
      const text = (await result.response).text().replace(/```json|```/g, "").trim();
      return res.json(JSON.parse(text));
    }

    if (action === "CONVERSATIONAL_ACTION") {
      const prompt = `You are Nova Assistant. Helping employer with candidate ${payload?.context?.candidateId}. User: ${payload?.message}`;
      const result = await model.generateContent(prompt);
      return res.json({ reply: (await result.response).text().trim() });
    }

    res.status(400).json({ error: "INVALID_ACTION" });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// COMPLIANCE
app.post('/api/compliance', authGuard as any, async (req, res) => {
  const { action, payload } = req.body;
  try {
    if (action === "VERIFY_LICENSE") {
      const docId = payload?.trackingId || payload?.employerId;
      const snap = await firestore.collection('employer_licenses').doc(docId).get();
      if (!snap.exists) return res.status(404).json({ error: "LICENSE_NOT_FOUND" });
      return res.json(snap.data());
    }
    res.status(400).json({ error: "INVALID_ACTION" });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// BILLING
app.post('/api/billing/create-checkout-session', authGuard as any, async (req, res) => {
  const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
  if (!stripeSecretKey) return res.status(500).json({ error: "PAYMENT_GATEWAY_NOT_CONFIGURED" });

  try {
    const { priceId, successUrl, cancelUrl } = req.body;
    if (!priceId) return res.status(400).json({ error: "MISSING_PRICE_ID" });

    const auth = (req as AuthRequest);
    const stripe = new Stripe(stripeSecretKey, {
      apiVersion: '2023-10-16' as any,
    });

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [{ price: priceId, quantity: 1 }],
      mode: 'subscription',
      success_url: successUrl || `${req.headers.origin}/portal/employer/applicants?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: cancelUrl || `${req.headers.origin}/portal/employer/pricing`,
      client_reference_id: auth.user?.id || undefined,
      metadata: { userId: auth.user?.id || '' },
    } as Stripe.Checkout.SessionCreateParams);

    res.json({ url: session.url });
  } catch (err: any) {
    console.error("STRIPE_ERR:", err.message);
    res.status(500).json({ error: err.message });
  }
});

// 7. WebSocket Core (The Success Pilot)
// ------------------------------------------------------------------
const io = new Server(server, {
  cors: {
    origin: ['http://localhost:5173', 'http://localhost:80', 'https://nova-os-v1.vercel.app', 'https://talentvault-446214.web.app', 'https://talentvault-446214.firebaseapp.com', 'https://project-aura-backend-cw7d.onrender.com'],
    methods: ['GET', 'POST']
  }
});

io.on('connection', (socket) => {
  console.log(`[NOVA_COMMS] Secure link established: ${socket.id}`);
  attachPilot(io, socket);
  
  socket.on('disconnect', () => {
    console.log(`[NOVA_COMMS] Link severed: ${socket.id}`);
  });
});

// 8. Workers & Background Tasks
// ------------------------------------------------------------------
setInterval(() => {
  ShadowMonitor.checkIntegrity(null);
}, 60000);

// 9. Ignition & Graceful Shutdown (Container Safety)
// ------------------------------------------------------------------
server.listen(PORT, () => {
  console.log(`[NOVA_OS] Core Engine tracking on port ${PORT}`);
});

process.on('SIGTERM', () => {
  console.log('[NOVA_OS] SIGTERM received. Initiating graceful shutdown...');
  server.close(async () => {
    console.log('[NOVA_OS] Sovereign Ledger secured. Core offline.');
    process.exit(0);
  });
});
