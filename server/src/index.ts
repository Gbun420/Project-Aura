import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import dotenv from 'dotenv';
import rateLimit from 'express-rate-limit';
import { createClient } from '@supabase/supabase-js';
import Stripe from 'stripe';

// Import Project Aura Hardened Subsystems
import { db } from './core/database.js';
import { SovereignVault } from './core/security/Vault.js';
import { BountyGuardian } from './core/ledger/BountyGuardian.js';
import { ManifestGenerator } from './services/auraOS/ManifestGenerator.js';
import { PulseAggregator } from './services/auraOS/PulseAggregator.js';
import { AuditExportService } from './services/auraOS/AuditExportService.js';
import { AuditTrailService } from './core/audit/AuditTrailService.js';
import { attachPilot } from './core/communications/SuccessPilot.js';
import { ShadowMonitor } from './workers/ShadowMonitor.js';

// Initialize Environment
dotenv.config();
const PORT = process.env.PORT || 3001;

// 1. Initialize Supabase Auth Client
const supabase = createClient(
  process.env.SUPABASE_URL || '',
  process.env.SUPABASE_ANON_KEY || ''
);

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
    'https://aura-os-v1.vercel.app', // Production URL
    'chrome-extension://ghost-link-id-placeholder' // Strict origin for Browser Extension
  ],
  methods: ['GET', 'POST', 'PUT'],
  credentials: true
}));

// Apply rate limiter to all API routes
app.use('/api/', apiLimiter);

interface AuthUser {
  id: string;
  email?: string;
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

  const { data: { user }, error } = await supabase.auth.getUser(token);

  if (error || !user) {
    return res.status(401).json({ error: "UNAUTHORIZED_ACCESS: Invalid or Expired Token." });
  }

  req.user = user as AuthUser;
  next();
};

// 5. CI/CD Health Endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'AURA_CORE_ONLINE', timestamp: new Date() });
});

// 6. Neural Endpoints: The Hard Logic
// ------------------------------------------------------------------

// Initiate Handshake (Protected)
app.post('/api/hiring/start', authGuard as any, async (req, res) => {
  try {
    const { candidateId } = req.body;
    const employerId = (req as AuthRequest).user?.id; 
    if (!employerId) throw new Error("UNAUTHORIZED_CONTEXT: Employer ID missing.");

    const signature = await BountyGuardian.logHandshake(db, employerId, candidateId);
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
    
    // 1. Mark Ledger as Released
    const update = await db.introductionLedger.updateMany({
      where: {
        candidateId: candidateId,
        employerId: employerId,
        feeStatus: 'LOCKED'
      },
      data: {
        feeStatus: 'RELEASED'
      }
    });

    if (update.count === 0) {
      throw new Error("LEDGER_UPDATE_FAILED: No active introduction found.");
    }

    // 2. Generate and Seal Manifest
    const rawManifest = await ManifestGenerator.generate(db, candidateId, employerId);
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

    const stripe = new Stripe(stripeSecretKey);

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      mode: 'subscription',
      success_url: successUrl || `${req.headers.origin}/portal/employer/applicants?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: cancelUrl || `${req.headers.origin}/portal/employer/pricing`,
      client_reference_id: user?.id,
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

    const pulseData = await PulseAggregator.getEmployerPulse(db, employerId);
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

    const auditLog = await AuditExportService.generateAuditLog(db, employerId);
    res.json({ success: true, auditLog });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// 7. WebSocket Core (The Success Pilot)
// ------------------------------------------------------------------
const io = new Server(server, {
  cors: {
    origin: ['http://localhost:5173', 'http://localhost:80', 'https://aura-os-v1.vercel.app'],
    methods: ['GET', 'POST']
  }
});

io.on('connection', (socket) => {
  console.log(`[AURA_COMMS] Secure link established: ${socket.id}`);
  attachPilot(io, socket);
  
  socket.on('disconnect', () => {
    console.log(`[AURA_COMMS] Link severed: ${socket.id}`);
  });
});

// 8. Workers & Background Tasks
// ------------------------------------------------------------------
setInterval(() => {
  ShadowMonitor.checkIntegrity(db);
}, 60000);

// 9. Ignition & Graceful Shutdown (Container Safety)
// ------------------------------------------------------------------
server.listen(PORT, () => {
  console.log(`[AURA_OS] Core Engine tracking on port ${PORT}`);
});

process.on('SIGTERM', () => {
  console.log('[AURA_OS] SIGTERM received. Initiating graceful shutdown...');
  server.close(async () => {
    await db.$disconnect();
    console.log('[AURA_OS] Sovereign Ledger secured. Core offline.');
    process.exit(0);
  });
});
