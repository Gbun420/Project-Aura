const { Client } = require('pg');

async function auditMarcoRossi() {
  const client = new Client({
    connectionString: "postgresql://postgres.shfaydzqdomkkfvnhcal:Buddy420!!!!!!!!!%40%23@aws-1-eu-west-2.pooler.supabase.com:5432/postgres",
    ssl: {
      rejectUnauthorized: false
    }
  });

  console.log('>>> SOVEREIGN_AUDIT: Initiating Compliance Check for Marco Rossi (Direct PG Mode)...');

  try {
    await client.connect();

    // 1. Check Profiles
    const profileRes = await client.query("SELECT full_name, role FROM public.profiles WHERE full_name ILIKE '%Marco Rossi%'");
    const candidate = profileRes.rows[0];

    // 2. Check Ledger
    const ledgerRes = await client.query("SELECT * FROM public.introduction_ledger WHERE candidate_id ILIKE '%MARCO-ROSSI%'");
    const ledgerEntry = ledgerRes.rows[0];

    if (ledgerEntry) {
      const now = new Date();
      const expiry = new Date(ledgerEntry.expiry_date);
      const daysLeft = Math.ceil((expiry.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));

      console.log('------------------------------------------------');
      console.log(`Identity:     ${candidate?.full_name || 'MARCO-ROSSI (Ledger Only)'}`);
      console.log(`Status:       ${ledgerEntry.fee_status}`);
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

  } catch (err) {
    console.error('>>> AUDIT_FAILED:', err);
  } finally {
    await client.end();
  }
}

auditMarcoRossi();
