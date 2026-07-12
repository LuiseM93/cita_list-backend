import { NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || 'sk_test_dummy', {
  apiVersion: '2026-06-24.dahlia',
});

export async function POST(req: Request) {
  try {
    const { priceId, userId, mode } = await req.json();

    if (!userId) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
    }

    if (!priceId) {
      return NextResponse.json({ error: 'Price ID is required' }, { status: 400 });
    }

    if (!mode || !['payment', 'subscription'].includes(mode)) {
      return NextResponse.json({ error: 'Invalid mode' }, { status: 400 });
    }

    // Determine success and cancel URLs based on request origin
    const origin = req.headers.get('origin') || 'https://citalist.site';

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      mode: mode, // 'payment' for lifetime, 'subscription' for monthly
      success_url: `${origin}/?success=true`,
      cancel_url: `${origin}/?canceled=true`,
      client_reference_id: userId,
      metadata: {
        userId: userId,
      },
      allow_promotion_codes: true,
      // Store customer email for Stripe receipt
      ...(mode === 'subscription' ? {
        subscription_data: {
          metadata: {
            userId: userId,
          },
        },
      } : {}),
    });

    return NextResponse.json({ url: session.url });
  } catch (error: any) {
    console.error('Checkout: Error creating session:', error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
