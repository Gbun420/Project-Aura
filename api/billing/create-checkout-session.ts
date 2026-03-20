import Stripe from "stripe";
import { requireUser } from "../_lib/auth.js";
import type { VercelRequest, VercelResponse } from "@vercel/node";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  
  if (req.method !== "POST") {
    return res.status(405).json({ error: "METHOD_NOT_ALLOWED" });
  }

  const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
  if (!stripeSecretKey) {
    console.error("STRIPE_SECRET_KEY_MISSING: STRIPE_SECRET_KEY must be set");
    return res.status(500).json({ error: "PAYMENT_GATEWAY_NOT_CONFIGURED" });
  }

  // 1. Authenticate with Firebase
  const auth = await requireUser(req);
  if (auth.error) {
    return res.status(auth.error.status).json({ error: auth.error.message });
  }

  try {
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

    const stripeContext = process.env.STRIPE_CONTEXT;
    
    // Initialize Stripe
    const stripe = new Stripe(stripeSecretKey, {
      apiVersion: '2026-02-25.clover',
      ...(stripeContext ? { stripeAccount: stripeContext } : {})
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
      client_reference_id: auth.user.id,
      metadata: {
        userId: auth.user.id,
      },
    });

    return res.status(200).json({ url: session.url });

  } catch (err: any) {
    console.error("CREATE_CHECKOUT_SESSION_ERROR:", err.message);
    return res.status(500).json({ error: "INTERNAL_SERVER_ERROR", detail: err.message });
  }
}