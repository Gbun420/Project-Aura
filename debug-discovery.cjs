const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: './client/.env' });

async function checkMetadata() {
  const supabaseUrl = process.env.VITE_SUPABASE_URL;
  const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    console.error('ERROR: Missing Supabase credentials in client/.env');
    return;
  }

  const supabase = createClient(supabaseUrl, supabaseAnonKey);
  
  console.log('>>> AURA_DISCOVERY: Initializing Metadata Check...');
  console.log(`--- Target: ${supabaseUrl}`);

  const { data: { session }, error } = await supabase.auth.getSession();

  if (error) {
    console.error('AUTH_ERROR:', error.message);
    return;
  }

  if (!session) {
    console.log('--- STATUS: No active session found. Please login in the browser first.');
    return;
  }

  const user = session.user;
  console.log('--- USER_ID:', user.id);
  console.log('--- APP_METADATA:', JSON.stringify(user.app_metadata, null, 2));
  console.log('--- USER_METADATA:', JSON.stringify(user.user_metadata, null, 2));

  const role = user.user_metadata?.role || user.app_metadata?.role || 'candidate';
  console.log('>>> FINAL_RESOLVED_ROLE:', role.toUpperCase());

  if (role === 'employer') {
    console.log('--- VERIFICATION: Employer role detected. RLS policies should now be decoupled from profiles table.');
  } else {
    console.log('--- WARNING: Current role is not employer. Ensure you registered as an employer to test RLS bypass.');
  }
}

checkMetadata();
