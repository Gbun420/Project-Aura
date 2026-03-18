import Stripe from "stripe";
import { createClient } from "@supabase/supabase-js";
import type { VercelRequest, VercelResponse } from "@vercel/node";

// SECURITY: Stripe secret key must be configured via environment variables.
// Never hardcode Stripe keys in source code.
export default async function handler(req: VercelRequest, res: VercelResponse) {
  
  if (req.method !== "POST") {
    return res.status(405).json({ error: "METHOD_NOT_ALLOWED" });
  }

  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;
  const stripeSecretKey = process.env.STRIPE_SECRET_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    return res.status(500).json({ error: "SUPABASE_NOT_CONFIGURED" });
  }

  if (!stripeSecretKey) {
    console.error("STRIPE_SECRET_KEY_MISSING: STRIPE_SECRET_KEY must be set");
    return res.status(500).json({ error: "PAYMENT_GATEWAY_NOT_CONFIGURED" });
  }

  // Get authentication token
  const authHeader = req.headers.authorization || "";
  const token = authHeader.startsWith("Bearer ") ? authHeader.slice(7) : "";

  if (!token) {
    return res.status(401).json({ error: "UNAUTHORIZED" });
  }

  try {
    // Verify user with Supabase
    const supabase = createClient(supabaseUrl, supabaseAnonKey, {
      global: { headers: { Authorization: `Bearer ${token}` } }
    });

    const { data: { user }, error: userError } = await supabase.auth.getUser(token);
    
    if (userError || !user) {
      return res.status(401).json({ error: "INVALID_TOKEN" });
    }

    const { priceId, successUrl, cancelUrl } = req.body;

    if (!priceId) {
      return res.status(400).json({ error: "MISSING_PRICE_ID" });
    }

    // Default URLs if not provided
    const baseUrl = process.env.VERCEL_URL 
      ? `https://${process.env.VERCEL_URL}` 
      : `${req.headers.origin || 'http://localhost:3000'}`;
    
    const finalSuccessUrl = successUrl || `${baseUrl}/portal/employer/applicants?session_id={CHECKOUT_SESSION_ID}`;
    const finalCancelUrl = cancelUrl || `${baseUrl}/portal/employer/pricing`;

    // Initialize Stripe
    const stripe = new Stripe(stripeSecretKey, {
      apiVersion: '2026-02-25.clover',
    });

    // Create checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      mode: 'subscription',
      success_url: finalSuccessUrl,
      cancel_url: finalCancelUrl,
      client_reference_id: user.id,
      metadata: {
        userId: user.id,
      },
    });

    return res.status(200).json({ url: session.url });

  } catch (err: any) {
    console.error("CREATE_CHECKOUT_SESSION_ERROR:", err.message);
    return res.status(500).json({ error: "INTERNAL_SERVER_ERROR", detail: err.message });
  }
}