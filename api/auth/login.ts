import type { VercelRequest, VercelResponse } from '@vercel/node';
import { createClient } from '@supabase/supabase-js';
import { z } from 'zod';
import { rateLimit } from '../middleware/rateLimit.js';
import { handleCors } from '../middleware/cors.js';


const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8)
});

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (handleCors(req, res)) return;

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    // Rate limiting
    rateLimit(req, 5, 60000); // 5 attempts per minute

    const { email, password } = loginSchema.parse(req.body);

    const supabase = createClient(
      process.env.SUPABASE_URL!,
      process.env.SUPABASE_ANON_KEY!
    );

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });

    if (error) {
      return res.status(401).json({ error: error.message });
    }

    return res.status(200).json({
      user: data.user,
      session: data.session
    });

  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: 'Invalid input', details: error.issues });
    }
    if (error.message === 'Rate limit exceeded') {
      return res.status(429).json({ error: 'Too many requests' });
    }
    console.error('Login error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
