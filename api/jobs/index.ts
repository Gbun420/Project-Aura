import type { VercelRequest, VercelResponse } from '@vercel/node';
import { z } from 'zod';
import { authenticateRequest } from '../middleware/auth';
import { handleCors } from '../middleware/cors';
import { validationSchemas } from '../lib/validation';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (handleCors(req, res)) return;

  try {
    if (req.method === 'GET') {
      const { user, supabase } = await authenticateRequest(req);
      const page = parseInt(req.query.page as string || '1');
      const limit = parseInt(req.query.limit as string || '10');

      const { data: jobs, error } = await supabase
        .from('vacancies')
        .select('*')
        .eq('status', 'published')
        .range((page - 1) * limit, page * limit - 1);

      if (error) throw error;
      return res.status(200).json({ jobs, page, limit });
    }

    if (req.method === 'POST') {
      const { user, supabase } = await authenticateRequest(req);
      
      const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single();

      if (profile?.role !== 'employer' && profile?.role !== 'admin') {
        return res.status(403).json({ error: 'Unauthorized' });
      }

      const jobData = validationSchemas.job.parse(req.body);

      const { data: job, error } = await supabase
        .from('vacancies')
        .insert([{ 
          ...jobData, 
          employer_id: user.id,
          status: 'published'
        }])
        .select()
        .single();

      if (error) throw error;

      // Trigger neural embedding generation (using the internal function)
      // Note: In production, this would call the Supabase Edge Function
      
      return res.status(201).json({ job });
    }

    return res.status(405).json({ error: 'Method Not Allowed' });

  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: 'Invalid input', details: error.errors });
    }
    console.error('Jobs API error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
