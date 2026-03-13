const { Client } = require('pg');

async function debugDiscovery() {
  const client = new Client({
    connectionString: "postgresql://postgres.shfaydzqdomkkfvnhcal:Buddy420!!!!!!!!!%40%23@aws-1-eu-west-2.pooler.supabase.com:5432/postgres",
    ssl: { rejectUnauthorized: false }
  });

  console.log('>>> SOVEREIGN_DISCOVERY: Searching all tables for Marco fragments...');

  try {
    await client.connect();

    console.log('\n--- PROFILES ---');
    const p = await client.query("SELECT id, email, full_name, role FROM public.profiles LIMIT 10");
    console.table(p.rows);

    console.log('\n--- INTRODUCTION_LEDGER ---');
    const l = await client.query("SELECT hash, employer_id, candidate_id, fee_status, expiry_date FROM public.introduction_ledger LIMIT 10");
    console.table(l.rows);

  } catch (err) {
    console.error('>>> DISCOVERY_FAILED:', err);
  } finally {
    await client.end();
  }
}

debugDiscovery();
