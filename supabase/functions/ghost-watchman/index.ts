// Version: 2.1.2 - Debugging Secret Injection
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const BRAIN_SYSTEM_PROMPT = `You are a Sovereign System Auditor for Nova OS (Malta 2026). 
Analyze the following HTTP Audit report for CSP, MIME, or 404 errors. 
Provide a concise, one-sentence fix if an error is found. 
If all is Sovereign, respond with: "FORTRESS_SECURE_V2.1.0"`;


async function askTheBrain(reportData: string) {
  const groqKey = Deno.env.get("GROQ_API_KEY");
  const orKey = Deno.env.get("OPENROUTER_API_KEY");

  console.log(`[WATCHMAN_DEBUG] GROQ_KEY_PRESENT: ${!!groqKey}`);
  console.log(`[WATCHMAN_DEBUG] OR_KEY_PRESENT: ${!!orKey}`);

  const providers = [
    {
      name: "GROQ",
      url: "https://api.groq.com/openai/v1/chat/completions",
      key: groqKey,
      model: "llama3-70b-8192"
    },
    {
      name: "OPENROUTER",
      url: "https://openrouter.ai/api/v1/chat/completions",
      key: orKey,
      model: "meta-llama/llama-3-8b-instruct:free"
    }
  ];

  for (const p of providers) {
    if (!p.key) {
      console.log(`[WATCHMAN_DEBUG] Skipping ${p.name}: Key is missing from environment.`);
      continue;
    }
    try {
      console.log(`[WATCHMAN_DEBUG] Attempting analysis via ${p.name}...`);
      const res = await fetch(p.url, {
        method: "POST",
        headers: { 
          "Authorization": `Bearer ${p.key}`, 
          "Content-Type": "application/json",
          "HTTP-Referer": "https://project-nova.vercel.app",
          "X-Title": "Nova Ghost Watchman"
        },
        body: JSON.stringify({ 
          model: p.model, 
          messages: [
            { role: "system", content: BRAIN_SYSTEM_PROMPT },
            { role: "user", content: reportData }
          ] 
        })
      });
      if (res.ok) {
        const data = await res.json();
        console.log(`[WATCHMAN_DEBUG] ${p.name} Success!`);
        return { provider: p.name, content: data.choices[0].message.content };
      } else {
        const errText = await res.text();
        console.error(`[WATCHMAN_DEBUG] ${p.name} Error: ${res.status} - ${errText}`);
      }
    } catch (e) {
      console.error(`[WATCHMAN_DEBUG] ${p.name} Exception:`, e);
    }
  }
  return { provider: "NONE", content: "BRAIN_OFFLINE: All providers failed or keys missing." };
}

serve(async (req) => {
  try {
    const target = 'https://project-nova.vercel.app/';
    const response = await fetch(target, {
      headers: { 'User-Agent': 'Nova-Sovereign-Watchman/2.1' }
    });

    const headers = Object.fromEntries(response.headers.entries());
    const auditReport = {
      status: response.status,
      contentType: headers['content-type'],
      csp: headers['content-security-policy'],
      timestamp: new Date().toISOString()
    };

    const brainAnalysis = await askTheBrain(JSON.stringify(auditReport));

    return new Response(JSON.stringify({ 
      status: 'Sovereign', 
      audit: auditReport,
      analysis: brainAnalysis
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
