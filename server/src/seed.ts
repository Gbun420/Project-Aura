import admin from 'firebase-admin';
import * as crypto from 'node:crypto';

/**
 * NOVA_OS: SOVEREIGN LEDGER SEEDER v1.0
 * Populates the system with realistic 2026 scenarios for demo verification.
 */

async function main() {
  console.log('>>> INITIATING NEBULA SEEDING SEQUENCE...');

  if (!admin.apps.length) {
    admin.initializeApp({
      credential: admin.credential.applicationDefault(),
    });
  }

  const db = admin.firestore();

  // 1. Clear existing data (Demo purpose - use with caution)
  console.log('--- Clearing Collections: vacancies, introduction_ledger, permit_status, audit_trails');
  
  const collections = ['vacancies', 'introduction_ledger', 'permit_status', 'audit_trails', 'candidate_profiles'];
  
  for (const collection of collections) {
    const snap = await db.collection(collection).get();
    const batch = db.batch();
    snap.docs.forEach(doc => batch.delete(doc.ref));
    await batch.commit();
  }

  // 2. Seed Jobs (2026 Multi-Sector Listings)
  const jobs = [
    { title: 'Critical Care Nurse', company: 'Mater Dei Hospital', location: 'Msida', sector: 'Healthcare', salary: '€35,000 - €50,000', description: 'Specialized role under 2026 Health Fast-Track.' },
    { title: 'Compliance Lead', company: 'Betsson Group', location: 'Ta\' Xbiex', sector: 'iGaming', salary: '€65,000 - €85,000', description: 'MGA-regulated role requiring high neural sync.' },
    { title: 'Solar Systems Engineer', company: 'EcoMalta', location: 'Gzira', sector: 'Green Energy', salary: '€40,000 - €55,000', description: 'Expanding renewable infrastructure projects.' }
  ];

  for (const job of jobs) {
    await db.collection('vacancies').add(job);
  }

  // 3. Seed Introduction Ledger (The Scenarios)
  const marcoExpiry = new Date();
  marcoExpiry.setDate(marcoExpiry.getDate() + 4);
  const hashAlpha = crypto.createHmac('sha256', 'demo-salt').update('EMP-BETSSON-CAND-MARCO').digest('hex');

  const sarahExpiry = new Date();
  sarahExpiry.setDate(sarahExpiry.getDate() + 30);
  const hashBeta = crypto.createHmac('sha256', 'demo-salt').update('EMP-CASUMO-CAND-SARAH').digest('hex');

  const introductions = [
    { hash: hashAlpha, employerId: 'EMP-BETSSON', candidateId: 'CAND-MARCO-ROSSI', notifiedAt: new Date().toISOString(), expiryDate: marcoExpiry.toISOString(), feeStatus: 'PENDING' },
    { hash: hashBeta, employerId: 'EMP-CASUMO', candidateId: 'CAND-SARAH-ZAMMIT', notifiedAt: new Date().toISOString(), expiryDate: sarahExpiry.toISOString(), feeStatus: 'RELEASED' },
    { hash: crypto.randomBytes(32).toString('hex'), employerId: 'EMP-NEPTUNE', candidateId: 'CAND-LUCA-BORG', notifiedAt: new Date().toISOString(), expiryDate: marcoExpiry.toISOString(), feeStatus: 'PENDING' },
    { hash: crypto.randomBytes(32).toString('hex'), employerId: 'EMP-GIG', candidateId: 'CAND-ELENA-ABELA', notifiedAt: new Date().toISOString(), expiryDate: sarahExpiry.toISOString(), feeStatus: 'PENDING' }
  ];

  for (const intro of introductions) {
    await db.collection('introduction_ledger').doc(intro.hash).set(intro);
  }

  // 4. Seed Candidate Profiles (for Manifest generation tests)
  const candidates = [
    { id: 'CAND-MARCO-ROSSI', firstName: 'Marco', lastName: 'Rossi', encryptedData: 'ENCRYPTED_MARCO_BIO_2026', pdcRef: 'PDC-123456', pdcExpiryDate: marcoExpiry.toISOString() },
    { id: 'CAND-SARAH-ZAMMIT', firstName: 'Sarah', lastName: 'Zammit', encryptedData: 'ENCRYPTED_SARAH_BIO_2026', pdcRef: 'PDC-789012', pdcExpiryDate: sarahExpiry.toISOString() }
  ];

  for (const cand of candidates) {
    await db.collection('candidate_profiles').doc(cand.id).set(cand);
  }

  console.log('>>> SEEDING COMPLETE: NOVA_OS IS NOW PRIMED FOR PRESENTATION.');
  console.log('--- 3 Jobs Seeded');
  console.log('--- 2 Candidate Profiles Seeded');
  console.log('--- 4 Introductions Seeded (1 Critical, 1 Released)');
}

main().catch((err) => {
  console.error('SEED_FAILURE:', err);
  process.exit(1);
});
