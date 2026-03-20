import { db } from './core/database.js';
import * as crypto from 'node:crypto';

/**
 * NOVA_OS: SOVEREIGN LEDGER SEEDER v1.0
 * Populates the system with realistic 2026 scenarios for demo verification.
 */

async function main() {
  console.log('>>> INITIATING NEBULA SEEDING SEQUENCE...');

  // 1. Clear existing data
  await db.job.deleteMany();
  await db.introductionLedger.deleteMany();
  await db.permitStatus.deleteMany();
  await db.auditLog.deleteMany();

  // 2. Seed Jobs (2026 Multi-Sector Listings)
  await db.job.createMany({
    data: [
      { title: 'Critical Care Nurse', company: 'Mater Dei Hospital', location: 'Msida', sector: 'Healthcare', salary: '€35,000 - €50,000', description: 'Specialized role under 2026 Health Fast-Track.' },
      { title: 'Compliance Lead', company: 'Betsson Group', location: 'Ta\' Xbiex', sector: 'iGaming', salary: '€65,000 - €85,000', description: 'MGA-regulated role requiring high neural sync.' },
      { title: 'Solar Systems Engineer', company: 'EcoMalta', location: 'Gzira', sector: 'Green Energy', salary: '€40,000 - €55,000', description: 'Expanding renewable infrastructure projects.' }
    ]
  });

  // 3. Seed Introduction Ledger (The Scenarios)
  const marcoExpiry = new Date();
  marcoExpiry.setDate(marcoExpiry.getDate() + 4);
  const hashAlpha = crypto.createHmac('sha256', 'demo-salt').update('EMP-BETSSON-CAND-MARCO').digest('hex');

  const sarahExpiry = new Date();
  sarahExpiry.setDate(sarahExpiry.getDate() + 30);
  const hashBeta = crypto.createHmac('sha256', 'demo-salt').update('EMP-CASUMO-CAND-SARAH').digest('hex');

  await db.introductionLedger.createMany({
    data: [
      { hash: hashAlpha, employerId: 'EMP-BETSSON', candidateId: 'CAND-MARCO-ROSSI', notifiedAt: new Date(), expiryDate: marcoExpiry, feeStatus: 'PENDING' },
      { hash: hashBeta, employerId: 'EMP-CASUMO', candidateId: 'CAND-SARAH-ZAMMIT', notifiedAt: new Date(), expiryDate: sarahExpiry, feeStatus: 'RELEASED' },
      // BATCH 02 LEADS (Neural Sync v2.3)
      { hash: crypto.randomBytes(32).toString('hex'), employerId: 'EMP-NEPTUNE', candidateId: 'CAND-LUCA-BORG', notifiedAt: new Date(), expiryDate: marcoExpiry, feeStatus: 'PENDING' },
      { hash: crypto.randomBytes(32).toString('hex'), employerId: 'EMP-GIG', candidateId: 'CAND-ELENA-ABELA', notifiedAt: new Date(), expiryDate: sarahExpiry, feeStatus: 'PENDING' }
    ]
  });

  console.log('>>> SEEDING COMPLETE: AURA OS IS NOW PRIMED FOR PRESENTATION.');
  console.log('--- 3 Jobs Seeded');
  console.log('--- 1 Critical Handshake (Marco Rossi)');
  console.log('--- 1 Released Manifest (Sarah Zammit)');
  console.log('--- 2 Batch 02 Neural Leads Seeded');
}

main().catch((err) => {
  console.error('SEED_FAILURE:', err);
  process.exit(1);
}).finally(async () => {
  await db.$disconnect();
});
