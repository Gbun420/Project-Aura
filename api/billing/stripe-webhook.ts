import { createClient } from "@supabase/supabase-js";
import { getJsonBody } from "../_lib/body";

// Note: In production, use Stripe's official SDK to verify webhook signatures.
// This is a simplified handler for the Aura v1.0 Production Prototype.

export default async function handler(req: any, res: any) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "METHOD_NOT_ALLOWED" });
  }

  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY; // Use Service Role for backend updates

  if (!supabaseUrl || !supabaseServiceKey) {
    return res.status(500).json({ error: "SUPABASE_NOT_CONFIGURED" });
  }

  const supabase = createClient(supabaseUrl, supabaseServiceKey);
  const body = getJsonBody<any>(req);

  // For Demo/Production: Assume we receive a 'checkout.session.completed' event
  // with the user's ID in the client_reference_id field.
  const eventType = body?.type;
  const session = body?.data?.object;

  if (eventType === 'checkout.session.completed' && session?.client_reference_id) {
    const userId = session.client_reference_id;

    const { error } = await supabase
      .from('profiles')
      .update({ 
        subscription_tier: 'pulse_pro',
        subscription_expires_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString() // 30 days
      })
      .eq('id', userId);

    if (error) {
      console.error("WEBHOOK_DB_UPDATE_FAILED", error);
      return res.status(500).json({ error: "DB_UPDATE_FAILED" });
    }

    return res.status(200).json({ status: 'PRO_SUBSCRIPTION_ACTIVATED', userId });
  }

  return res.status(200).json({ status: 'EVENT_RECEIVED_BUT_SKIPPED' });
}
