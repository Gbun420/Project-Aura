import Stripe from "stripe";
import { createClient } from "@supabase/supabase-js";

// SECURITY: Stripe webhook signature verification is MANDATORY.
// Without this, anyone can forge payment events and upgrade users for free.

export default async function handler(req: any, res: any) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "METHOD_NOT_ALLOWED" });
  }

  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!supabaseUrl || !supabaseServiceKey) {
    return res.status(500).json({ error: "SUPABASE_NOT_CONFIGURED" });
  }

  if (!stripeSecretKey || !webhookSecret) {
    console.error("STRIPE_KEYS_MISSING: STRIPE_SECRET_KEY and STRIPE_WEBHOOK_SECRET must be set");
    return res.status(500).json({ error: "PAYMENT_GATEWAY_NOT_CONFIGURED" });
  }

  // 1. Verify Stripe webhook signature
  const stripe = new Stripe(stripeSecretKey);
  const signature = req.headers["stripe-signature"];

  if (!signature) {
    return res.status(400).json({ error: "MISSING_STRIPE_SIGNATURE" });
  }

  let event: Stripe.Event;
  try {
    // req.body must be the raw body string for signature verification
    const rawBody = typeof req.body === "string" ? req.body : JSON.stringify(req.body);
    event = stripe.webhooks.constructEvent(rawBody, signature, webhookSecret);
  } catch (err: any) {
    console.error("WEBHOOK_SIGNATURE_VERIFICATION_FAILED:", err.message);
    return res.status(400).json({ error: "INVALID_SIGNATURE" });
  }

  // 2. Process verified event
  const supabase = createClient(supabaseUrl, supabaseServiceKey);

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    const userId = session.client_reference_id;

    if (!userId) {
      console.error("WEBHOOK: No client_reference_id in checkout session");
      return res.status(200).json({ status: "EVENT_RECEIVED_NO_USER_REF" });
    }

    const { error } = await supabase
      .from("profiles")
      .update({
        subscription_tier: "pulse_pro",
        subscription_expires_at: new Date(
          Date.now() + 30 * 24 * 60 * 60 * 1000
        ).toISOString(),
      })
      .eq("id", userId);

    if (error) {
      console.error("WEBHOOK_DB_UPDATE_FAILED", error);
      return res.status(500).json({ error: "DB_UPDATE_FAILED" });
    }

    return res
      .status(200)
      .json({ status: "PRO_SUBSCRIPTION_ACTIVATED", userId });
  }

  return res.status(200).json({ status: "EVENT_RECEIVED_BUT_SKIPPED" });
}
