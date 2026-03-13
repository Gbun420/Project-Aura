import type { VercelRequest } from '@vercel/node';
import { createClient } from '@supabase/supabase-js';

export async function authenticateRequest(req: VercelRequest) {
  const authHeader = req.headers['authorization'] as string;
  const supabase = createClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_ANON_KEY!
  );

  if (!authHeader?.startsWith('Bearer ')) {
    throw new Error('Missing or invalid authorization header');
  }

  const token = authHeader.replace('Bearer ', '');
  const { data: { user }, error } = await supabase.auth.getUser(token);

  if (error || !user) {
    throw new Error('Invalid authentication token');
  }

  return { user, supabase };
}
