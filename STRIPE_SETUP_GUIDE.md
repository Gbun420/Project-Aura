# Stripe Setup Guide for Project Aura

To enable monetization for Project Aura, you need to set up Stripe products and prices.

## Step 1: Get Your Stripe API Keys

1. Sign up for a Stripe account at https://stripe.com
2. Get your API keys from the Dashboard → Developers → API keys
3. You'll need:
   - **Secret Key** (starts with `sk_test_` for testing or `sk_live_` for production)
   - **Publishable Key** (starts with `pk_test_` for testing or `pk_live_` for production)

## Step 2: Create the Product and Price

### Option A: Using Stripe Dashboard (Recommended for Beginners)

1. Go to https://dashboard.stripe.com/test/products (or live dashboard for production)
2. Click "+ New"
3. Create a product:
   - **Name**: Aura Pulse Pro
   - **Description**: Unlock verified Identità identities and 2026 TCN compliance history
   - Click "Create product"
4. After creating the product, click "Add price":
   - **Price**: €29.00
   - **Recurring**: Monthly
   - **Currency**: EUR
   - Click "Save price"

### Option B: Using Stripe CLI

1. Install Stripe CLI: https://stripe.com/docs/stripe-cli
2. Login: `stripe login`
3. Create product:
   ```bash
   stripe products create \
     --name "Aura Pulse Pro" \
     --description "Unlock verified Identità identities and 2026 TCN compliance history"
   ```
4. Create price:
   ```bash
   stripe prices create \
     --product <product_id_from_previous_step> \
     --unit-amount 2900 \
     --currency eur \
     --recurring interval=month
   ```

## Step 3: Configure Environment Variables

Add these to your `.env` files:

### Server (.env)
```
STRIPE_SECRET_KEY=sk_test_your_secret_key_here
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret_here
STRIPE_PRICE_ID_PULSE_PRO=price_1PulseProMonthly_from_stripe
```

### Client (.env)
```
VITE_STRIPE_PRICE_ID_PULSE_PRO=price_1PulseProMonthly_from_stripe
```

## Step 4: Set Up Webhook (Critical for Subscription Updates)

The Stripe webhook at `/api/billing/stripe-webhook.ts` handles subscription activation.

To configure webhook:
1. In Stripe Dashboard → Developers → Webhooks → Add endpoint
2. Endpoint URL: `https://your-domain.com/api/billing/stripe-webhook` (or `http://localhost:3000/api/billing/stripe-webhook` for local testing)
3. Select events to send: `checkout.session.completed`
4. Copy the webhook signing secret and add it to your `.env` as `STRIPE_WEBHOOK_SECRET`

## Step 5: Test the Flow

1. Start your development servers:
   - Server: `npm run dev --prefix server`
   - Client: `npm run dev --prefix client`
2. Go to the pricing page: `http://localhost:5173/portal/employer/pricing`
3. Click "Unlock_Pioneer_Special" button
4. You should be redirected to Stripe checkout
5. Use test card: `4242 4242 4242 4242` with any future date and any CVC
6. After successful payment, you should be redirected back to the applicants page

## Step 6: Go Live

When you're ready to accept real payments:
1. Switch to your live Stripe keys
2. Update webhook to use live URL
3. Test with live mode using real card (you can refund immediately)
4. Announce your paid service!

## Important Notes

- The current price is set to €29/month (discounted from €49/month as shown in UI)
- You can adjust pricing in Stripe Dashboard at any time
- Existing subscriptions will keep their old price unless you migrate them
- Consider adding more tiers (Basic, Pro, Enterprise) as you grow
- Stripe takes a percentage of each transaction (check their pricing)

## Troubleshooting

- **Webhook not firing**: Check webhook delivery in Stripe Dashboard → Developers → Webhooks
- **Subscription not activating**: Check server logs for webhook processing errors
- **Price ID mismatch**: Ensure the price ID in .env matches the one in Stripe
- **CORS issues**: Ensure your frontend domain is in the CORS allowed list in server/src/index.ts

Once configured, you'll be able to accept payments and monetize your Project Aura platform!