import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: "postgresql://postgres.shfaydzqdomkkfvnhcal:Buddy420!!!!!!!!!%40%23@aws-1-eu-west-2.pooler.supabase.com:5432/postgres?sslmode=require"
    }
  }
});

async function auditMarcoRossi() {
  console.log('>>> SOVEREIGN_AUDIT: Initiating Compliance Check for Marco Rossi...');
  
  try {
    // 1. Identify Candidate
    const candidate = await (prisma as any).profiles.findFirst({
      where: { full_name: { contains: 'Marco Rossi' } }
    });

    if (!candidate) {
      console.log('>>> ALERT: Marco Rossi not found in profiles. Checking ledger...');
    }

    // 2. Check Ledger Handshake
    const ledgerEntry = await (prisma as any).introductionLedger.findFirst({
      where: { candidateId: { contains: 'MARCO-ROSSI' } }
    });

    if (ledgerEntry) {
      const now = new Date();
      const expiry = new Date(ledgerEntry.expiry_date || ledgerEntry.expiryDate);
      const daysLeft = Math.ceil((expiry.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));

      console.log('------------------------------------------------');
      console.log(`Identity:     ${candidate?.full_name || 'MARCO-ROSSI (Ledger Only)'}`);
      console.log(`Status:       ${ledgerEntry.fee_status || ledgerEntry.feeStatus}`);
      console.log(`PDC Expiry:   ${expiry.toISOString()}`);
      console.log(`Days Remain:  ${daysLeft} days`);
      console.log('------------------------------------------------');

      if (daysLeft <= 5) {
        console.log('>>> CRITICAL: PDC Expiry imminent. Triggering Success Pilot Intervention.');
      } else {
        console.log('>>> STABLE: Compliance window within Sovereign limits.');
      }
    } else {
      console.log('>>> ERROR: No introduction ledger found for Marco Rossi.');
    }

  } catch (error) {
    console.error('>>> AUDIT_FAILED:', error);
  } finally {
    await prisma.$disconnect();
  }
}

auditMarcoRossi();
