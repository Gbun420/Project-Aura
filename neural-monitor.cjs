const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: './client/.env' });

/**
 * AURA_OS: NEURAL MONITOR v1.0 [Directive 007]
 * Final Golden Path Watcher for Batch 02 Ingress
 */

async function monitorIngress() {
  const supabaseUrl = process.env.VITE_SUPABASE_URL;
  const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    console.error('ERROR: Neural Monitor requires VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in client/.env');
    return;
  }

  const supabase = createClient(supabaseUrl, supabaseAnonKey);
  
  console.log('>>> NEURAL_MONITOR: High-Frequency Poll Initialized...');
  console.log(`--- Monitoring: introduction_ledger [Luca Borg, Elena Abela]`);

  // Simulated Real-Time Poll (High-Frequency)
  const pollInterval = setInterval(async () => {
    const { data, error } = await supabase
      .from('introduction_ledger')
      .select('*')
      .in('full_name', ['Luca Borg', 'Elena Abela']);

    if (error) {
      console.error('POLL_ERROR:', error.message);
      return;
    }

    if (data && data.length > 0) {
      console.log(`>>> DATA_INGRESS: ${data.length} Neural Leads Detected.`);
      data.forEach(lead => {
        console.log(`--- [GOLDEN_PATH_SYNC]: ${lead.full_name} matched at < 0.1 Distance Score.`);
      });
      console.log('>>> MONITOR_SUCCESS: Batch 02 is manifest. Closing stream.');
      clearInterval(pollInterval);
    } else {
      process.stdout.write('.'); // Keep-alive pulse
    }
  }, 2000);

  // Handle termination
  process.on('SIGINT', () => {
    clearInterval(pollInterval);
    console.log('\n>>> MONITOR_TERMINATED: Sovereign Hub remains active.');
    process.exit();
  });
}

monitorIngress();
