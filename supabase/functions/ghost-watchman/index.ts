import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

serve(async (req) => {
  try {
    const target = 'https://aura-cloud-2026.vercel.app/';
    const response = await fetch(target, {
      headers: {
        'User-Agent': 'Aura-Sovereign-Watchman/1.0'
      }
    });

    const body = await response.text();
    const headers = Object.fromEntries(response.headers.entries());

    // Basic CSP Audit
    const csp = headers['content-security-policy'] || 'MISSING_CSP';
    const isHardened = csp.includes('supabase.co') && csp.includes('vercel.live');

    // MIME Audit (Check if index.html is actually HTML)
    const contentType = headers['content-type'] || 'MISSING_CONTENT_TYPE';
    const isMimeValid = contentType.includes('text/html');

    return new Response(JSON.stringify({ 
      status: 'Sovereign', 
      httpStatus: response.status,
      isMimeValid,
      isHardened,
      csp_report: csp,
      content_type: contentType,
      timestamp: new Date().toISOString()
    }), {
      headers: { "Content-Type": "application/json" }
    });
  } catch (err: any) {
    return new Response(JSON.stringify({ status: 'Infected', error: err.message }), { 
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
})
