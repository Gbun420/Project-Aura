import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import dotenv from 'dotenv';
import rateLimit from 'express-rate-limit';
import admin from 'firebase-admin';
import Stripe from 'stripe';

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
app.use(express.json());
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

// 6. Neural Endpoints: The Hard Logic
// ------------------------------------------------------------------

// Initiate Handshake (Protected)
app.post('/api/hiring/start', authGuard as any, async (req, res) => {
  try {
    const { candidateId } = req.body;
    const employerId = (req as AuthRequest).user?.id; 
    if (!employerId) throw new Error("UNAUTHORIZED_CONTEXT: Employer ID missing.");

    // Note: BountyGuardian.logHandshake now handles Firestore internally
    const signature = await BountyGuardian.logHandshake(null, employerId, candidateId);
    res.json({ success: true, hash: signature });
  } catch (error: any) {
    res.status(400).json({ success: false, error: error.message });
  }
});

// Finalize Introduction (Protected)
app.post('/api/billing/finalize', authGuard as any, async (req, res) => {
  try {
    const { candidateId } = req.body;
    const employerId = (req as AuthRequest).user?.id;
    if (!employerId) throw new Error("UNAUTHORIZED_CONTEXT: Employer ID missing.");
    
    // 1. Mark Ledger as Released in Firestore
    const ledgerSnap = await firestore.collection('introduction_ledger')
      .where('candidateId', '==', candidateId)
      .where('employerId', '==', employerId)
      .where('feeStatus', '==', 'LOCKED')
      .get();

    if (ledgerSnap.empty) {
      throw new Error("LEDGER_UPDATE_FAILED: No active introduction found.");
    }

    const batch = firestore.batch();
    ledgerSnap.docs.forEach(doc => {
      batch.update(doc.ref, { feeStatus: 'RELEASED', releasedAt: new Date().toISOString() });
    });
    await batch.commit();

    // 2. Generate and Seal Manifest
    const rawManifest = await ManifestGenerator.generate(null, candidateId, employerId);
    const sealedPayload = SovereignVault.sealManifest(rawManifest.payload);
    
    // Log to Immutable Audit Trail
    await AuditTrailService.logEvent('RELEASE', { candidateId, employerId, manifestId: rawManifest.manifestId });

    res.json({ success: true, manifest: { ...rawManifest, payload: sealedPayload } });
  } catch (error: any) {
    res.status(400).json({ success: false, error: error.message });
  }
});

// Create Stripe Checkout Session (Protected)
app.post('/api/billing/create-checkout-session', authGuard as any, async (req, res) => {
  try {
    const { priceId, successUrl, cancelUrl } = req.body;
    const user = (req as AuthRequest).user;

    if (!priceId) {
      return res.status(400).json({ error: "MISSING_PRICE_ID" });
    }

    const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
    if (!stripeSecretKey) {
      return res.status(500).json({ error: "PAYMENT_GATEWAY_NOT_CONFIGURED" });
    }

    const stripe = new Stripe(stripeSecretKey, {
      apiVersion: '2023-10-16' as any,
    });

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      mode: 'subscription',
      success_url: (successUrl as string) || `${req.headers.origin}/portal/employer/applicants?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: (cancelUrl as string) || `${req.headers.origin}/portal/employer/pricing`,
      ...(user?.id ? { client_reference_id: user.id } : {}),
      metadata: {
        userId: user?.id || '',
      },
    });

    res.json({ url: session.url });
  } catch (error: any) {
    console.error("STRIPE_SESSION_ERR:", error);
    res.status(500).json({ error: error.message });
  }
});

// Live Compliance Pulse (Protected)
app.get('/api/hiring/pulse', authGuard as any, async (req, res) => {
  try {
    const employerId = (req as AuthRequest).user?.id;
    if (!employerId) throw new Error("UNAUTHORIZED_CONTEXT: Employer ID missing.");

    const pulseData = await PulseAggregator.getEmployerPulse(null, employerId);
    res.json({ success: true, pulseData });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// DIER Regulatory Shield Export (Protected)
app.get('/api/hiring/audit', authGuard as any, async (req, res) => {
  try {
    const employerId = (req as AuthRequest).user?.id;
    if (!employerId) throw new Error("UNAUTHORIZED_CONTEXT: Employer ID missing.");

    const auditLog = await AuditExportService.generateAuditLog(null, employerId);
    res.json({ success: true, auditLog });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
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
