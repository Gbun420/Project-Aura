import type { VercelRequest, VercelResponse } from '@vercel/node';
import { z } from 'zod';
import { authenticateRequest } from '../_lib/middleware/auth.js';
import { handleCors } from '../_lib/middleware/cors.js';
import { validationSchemas } from '../_lib/lib/validation.js';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (handleCors(req, res)) return;

  try {
    if (req.method === 'GET') {
      const { db } = await authenticateRequest(req);
      const page = parseInt(req.query.page as string || '1');
      const limit = parseInt(req.query.limit as string || '10');

      const snapshot = await db.collection('vacancies')
        .where('status', '==', 'published')
        .orderBy('created_at', 'desc')
        .offset((page - 1) * limit)
        .limit(limit)
        .get();

      const jobs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      return res.status(200).json({ jobs, page, limit });
    }

    if (req.method === 'POST') {
      const { user, db } = await authenticateRequest(req);
      
      const profileSnap = await db.collection('profiles').doc(user.id).get();
      const profile = profileSnap.data();

      if (profile?.role !== 'employer' && profile?.role !== 'admin') {
        return res.status(403).json({ error: 'Unauthorized' });
      }

      const jobData = validationSchemas.job.parse(req.body);

      const docRef = await db.collection('vacancies').add({ 
        ...jobData, 
        employer_id: user.id,
        status: 'published',
        created_at: new Date().toISOString(),
        last_activity_at: new Date().toISOString()
      });

      const jobDoc = await docRef.get();
      return res.status(201).json({ job: { id: docRef.id, ...jobDoc.data() } });
    }

    return res.status(405).json({ error: 'Method Not Allowed' });

  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: 'Invalid input', details: error.issues });
    }
    console.error('Jobs API error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
