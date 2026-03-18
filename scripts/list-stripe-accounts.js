import Stripe from 'stripe';

const STRIPE_SECRET_KEY = process.argv[2];
const stripe = new Stripe(STRIPE_SECRET_KEY);

async function findAccounts() {
  try {
    const list = await stripe.accounts.list();
    console.log('--- STRIPE_ACCOUNTS_FOUND ---');
    list.data.forEach(acc => {
      console.log(`ID: ${acc.id} | NAME: ${acc.settings?.dashboard?.display_name || acc.email}`);
    });
  } catch (err) {
    console.error('FAILED_TO_LIST_ACCOUNTS:', err.message);
  }
}

findAccounts();
