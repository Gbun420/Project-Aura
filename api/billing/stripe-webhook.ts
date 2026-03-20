import Stripe from "stripe";
import { adminDb } from "../_lib/firebase-admin.js";
import type { VercelRequest, VercelResponse } from "@vercel/node";

export default async function handler(req: VercelRequest, res: VercelResponse) {

  if (req.method !== "POST") {
    return res.status(405).json({ error: "METHOD_NOT_ALLOWED" });
  }

  const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!stripeSecretKey || !webhookSecret) {
    console.error("STRIPE_KEYS_MISSING: STRIPE_SECRET_KEY and STRIPE_WEBHOOK_SECRET must be set");
    return res.status(500).json({ error: "PAYMENT_GATEWAY_NOT_CONFIGURED" });
  }

  const stripeContext = process.env.STRIPE_CONTEXT;
  
  // 1. Verify Stripe webhook signature
  const stripe = new Stripe(stripeSecretKey, {
    apiVersion: '2026-02-25.clover',
    ...(stripeContext ? { stripeAccount: stripeContext } : {})
  });
  const signature = req.headers["stripe-signature"];

  if (!signature) {
    return res.status(400).json({ error: "MISSING_STRIPE_SIGNATURE" });
  }

  let event: Stripe.Event;
  try {
    const rawBody = typeof req.body === "string" ? req.body : JSON.stringify(req.body);
    event = stripe.webhooks.constructEvent(rawBody, signature, webhookSecret);
  } catch (err: any) {
    console.error("WEBHOOK_SIGNATURE_VERIFICATION_FAILED:", err.message);
    return res.status(400).json({ error: "INVALID_SIGNATURE" });
  }

  // 2. Process verified event
  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    const userId = session.client_reference_id;

    if (!userId) {
      console.error("WEBHOOK: No client_reference_id in checkout session");
      return res.status(200).json({ status: "EVENT_RECEIVED_NO_USER_REF" });
    }

    try {
      await adminDb.collection("profiles").doc(userId).update({
        subscription_tier: "pulse_pro",
        subscription_expires_at: new Date(
          Date.now() + 30 * 24 * 60 * 60 * 1000
        ).toISOString(),
      });

      return res
        .status(200)
        .json({ status: "PRO_SUBSCRIPTION_ACTIVATED", userId });
    } catch (error: any) {
      console.error("WEBHOOK_DB_UPDATE_FAILED", error);
      return res.status(500).json({ error: "DB_UPDATE_FAILED", detail: error.message });
    }
  }

  return res.status(200).json({ status: "EVENT_RECEIVED_BUT_SKIPPED" });
}
