import { createClient } from '@supabase/supabase-js';
import { env } from '../config/env';

// Due to our centralized env.ts guard, we are guaranteed 
// these variables are strings if execution reaches here.
export const supabase = createClient(env.supabaseUrl!, env.supabaseAnonKey!, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  },
});
