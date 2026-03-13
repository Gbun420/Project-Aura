const ALLOWED_ORIGINS = (process.env.ALLOWED_ORIGINS || 'https://project-aura-one.vercel.app')
  .split(',')
  .map((o: string) => o.trim());

export const corsHeaders = {
  'Access-Control-Allow-Origin': ALLOWED_ORIGINS[0],
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Client-Info',
  'Access-Control-Max-Age': '86400'
}

export function handleCors(req: any, res: any) {
  const origin = req.headers.origin || '';
  
  // Dynamic origin matching for multiple allowed origins
  if (ALLOWED_ORIGINS.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
  } else {
    res.setHeader('Access-Control-Allow-Origin', ALLOWED_ORIGINS[0]);
  }

  res.setHeader('Access-Control-Allow-Methods', corsHeaders['Access-Control-Allow-Methods']);
  res.setHeader('Access-Control-Allow-Headers', corsHeaders['Access-Control-Allow-Headers']);
  res.setHeader('Access-Control-Max-Age', corsHeaders['Access-Control-Max-Age']);

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return true;
  }
  return false;
}
