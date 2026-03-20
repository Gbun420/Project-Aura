import type { VercelRequest } from '@vercel/node';
import { adminAuth, adminDb } from '../firebase-admin.js';

export async function authenticateRequest(req: VercelRequest) {
  const authHeader = req.headers['authorization'] as string;

  if (!authHeader?.startsWith('Bearer ')) {
    throw new Error('Missing or invalid authorization header');
  }

  const token = authHeader.replace('Bearer ', '');
  
  try {
    const decodedToken = await adminAuth.verifyIdToken(token);
    const user = { id: decodedToken.uid, ...decodedToken };
    return { user, db: adminDb };
  } catch (error: any) {
    console.error("AUTH_MIDDLEWARE_ERROR:", error.message);
    throw new Error('Invalid authentication token');
  }
}
