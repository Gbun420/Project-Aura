import type { VercelRequest } from '@vercel/node';

const rateLimitMap = new Map();

export function rateLimit(req: VercelRequest, limit: number = 100, windowMs: number = 60000) {
  const ip = (req.headers['x-forwarded-for'] as string) || 'unknown';
  const now = Date.now();
  const windowStart = now - windowMs;

  const requests = (rateLimitMap.get(ip) || []).filter((time: number) => time > windowStart);
  
  if (requests.length >= limit) {
    throw new Error('Rate limit exceeded');
  }

  requests.push(now);
  rateLimitMap.set(ip, requests);
  
  return {
    remaining: limit - requests.length,
    reset: windowStart + windowMs
  };
}
