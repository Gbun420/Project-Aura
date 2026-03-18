import Stripe from 'stripe';
import fs from 'fs';
import path from 'path';

const STRIPE_SECRET_KEY = process.argv[2];
const STRIPE_ACCOUNT_ID = process.argv[3];

if (!STRIPE_SECRET_KEY) {
  console.error('Error: Please provide your Stripe Secret Key as an argument.');
  process.exit(1);
}

const config = {
  apiVersion: '2026-02-25.clover',
};

// Add Stripe-Context if account ID is provided
if (STRIPE_ACCOUNT_ID) {
  config.stripeAccount = STRIPE_ACCOUNT_ID;
}

const stripe = new Stripe(STRIPE_SECRET_KEY, config);

async function setup() {
  console.log('>>> AURA_STRIPE_SETUP: Initializing product creation...');
  
  try {
    // 1. Create Product
    const product = await stripe.products.create({
      name: 'Aura Pulse Pro',
      description: 'Unlock verified Identità identities and 2026 TCN compliance history',
    });
    console.log(`>>> SUCCESS: Product Created (ID: ${product.id})`);

    // 2. Create Price
    const price = await stripe.prices.create({
      product: product.id,
      unit_amount: 2900, // €29.00
      currency: 'eur',
      recurring: { interval: 'month' },
    });
    console.log(`>>> SUCCESS: Price Created (ID: ${price.id})`);

    // 3. Update .env file
    const envPath = path.resolve(process.cwd(), '.env');
    let envContent = fs.existsSync(envPath) ? fs.readFileSync(envPath, 'utf8') : '';
    
    // Add VITE_STRIPE_PRICE_ID_PULSE_PRO
    if (envContent.includes('VITE_STRIPE_PRICE_ID_PULSE_PRO')) {
        envContent = envContent.replace(/VITE_STRIPE_PRICE_ID_PULSE_PRO=.*/, `VITE_STRIPE_PRICE_ID_PULSE_PRO=${price.id}`);
    } else {
        envContent += `\nVITE_STRIPE_PRICE_ID_PULSE_PRO=${price.id}\n`;
    }

    // Add STRIPE_SECRET_KEY (if not present)
    if (!envContent.includes('STRIPE_SECRET_KEY')) {
        envContent += `STRIPE_SECRET_KEY=${STRIPE_SECRET_KEY}\n`;
    }

    fs.writeFileSync(envPath, envContent);
    console.log('>>> SUCCESS: .env file updated with Pulse Pro Price ID.');
    
    console.log('\n--- SETUP COMPLETE ---');
    console.log(`Price ID to commit to production: ${price.id}`);
    console.log('Use this ID for your Vercel/Production environment.');

  } catch (err) {
    console.error('>>> FATAL: Setup failed:', err.message);
  }
}

setup();
