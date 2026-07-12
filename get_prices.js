const fs = require('fs');
const envContent = fs.readFileSync('.env.local', 'utf-8');
const match = envContent.match(/STRIPE_SECRET_KEY=(.*)/);
const stripeKey = match ? match[1].trim() : '';

const Stripe = require('stripe');
const stripe = new Stripe(stripeKey, { apiVersion: '2023-10-16' });

async function getPrices() {
  const prices1 = await stripe.prices.list({ product: 'prod_UrFQB9kqbN5fSF', active: true });
  console.log('Pago unico price ID:', prices1.data[0]?.id);

  const prices2 = await stripe.prices.list({ product: 'prod_UrFRDN82EhXr8y', active: true });
  console.log('Mensual price ID:', prices2.data[0]?.id);
}

getPrices().catch(console.error);
