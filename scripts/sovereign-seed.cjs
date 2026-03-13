const { Client } = require('pg');

async function seedBatch02() {
  const client = new Client({
    connectionString: "postgresql://postgres.shfaydzqdomkkfvnhcal:Buddy420!!!!!!!!!%40%23@aws-1-eu-west-2.pooler.supabase.com:5432/postgres",
    ssl: { rejectUnauthorized: false }
  });

  console.log('>>> SOVEREIGN_SEED: Initiating Batch 02 Injection (Hardened UUIDs)...');

  try {
    await client.connect();

    // 1. Valid UUIDs
    const marcoId = 'a1b2c3d4-e5f6-4a5b-8c9d-0e1f2a3b4c5d';
    const sarahId = 'b2c3d4e5-f6a7-4b6c-9d0e-1f2a3b4c5d6e';
    const employerId = '67bac6e5-3dc9-4b71-bb6d-6f5c6a77ad43';
    const jobId = 'f1e2d3c4-b5a6-4987-8765-43210fedcba9';

    // 2. Create Auth Users
    const users = [
      { id: marcoId, email: 'marco.rossi@igaming-example.com' },
      { id: sarahId, email: 'sarah.zammit@fintech-example.com' }
    ];

    for (const u of users) {
      await client.query(`
        INSERT INTO auth.users (id, email, raw_user_meta_data, raw_app_meta_data, aud, role, email_confirmed_at)
        VALUES ($1, $2, $3, $4, 'authenticated', 'authenticated', now())
        ON CONFLICT (id) DO NOTHING
      `, [u.id, u.email, JSON.stringify({ full_name: u.email.split('@')[0], role: 'candidate' }), JSON.stringify({ role: 'candidate' })]);
    }

    // 3. Create Profiles
    await client.query(`
      INSERT INTO public.profiles (id, email, full_name, role, tcn_status, tcn_expiry_date)
      VALUES 
        ($1, 'marco.rossi@igaming-example.com', 'Marco Rossi', 'candidate', 'verified_skills_pass', '2026-03-17'),
        ($2, 'sarah.zammit@fintech-example.com', 'Sarah Zammit', 'candidate', 'verified_skills_pass', '2026-12-01')
      ON CONFLICT (id) DO UPDATE SET
        tcn_status = EXCLUDED.tcn_status,
        tcn_expiry_date = EXCLUDED.tcn_expiry_date
    `, [marcoId, sarahId]);

    // 4. Create Job
    await client.query(`
      INSERT INTO public.vacancies (id, employer_id, title, description, status)
      VALUES ($1, $2, 'Head of Compliance', 'Strategic compliance lead for Betsson Group Malta.', 'published')
      ON CONFLICT (id) DO NOTHING
    `, [jobId, employerId]);

    // 5. Create Application
    await client.query(`
      INSERT INTO public.applications (id, job_id, candidate_id, match_score, status)
      VALUES (gen_random_uuid(), $1, $2, 98, 'applied')
      ON CONFLICT (job_id, candidate_id) DO NOTHING
    `, [jobId, marcoId]);

    console.log('>>> SEED_COMPLETE: Batch 02 is now live in the Sovereign Vault.');
    console.log('--- Marco Rossi: iGaming Compliance (PDC Expiry: 2026-03-17)');
    console.log('--- Sarah Zammit: Fintech Specialist');
    console.log('--- Job: Head of Compliance (Betsson)');

  } catch (err) {
    console.error('>>> SEED_FAILED:', err);
  } finally {
    await client.end();
  }
}

seedBatch02();
