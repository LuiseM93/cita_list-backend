import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { createClient } from '@supabase/supabase-js';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || 'sk_test_dummy', {
  apiVersion: '2026-06-24.dahlia',
});

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;

// IMPORTANT: Use Service Role Key to bypass RLS — the webhook has no auth context.
// This MUST be the service_role key, NOT the anon key.
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://dummy.supabase.co',
  process.env.SUPABASE_SERVICE_ROLE_KEY || 'dummy-key'
);

// Disable Next.js body parsing — Stripe needs the raw body for signature verification
export const runtime = 'nodejs';

async function handleSuccessfulCheckout(session: Stripe.Checkout.Session): Promise<NextResponse | null> {
  console.log(`[WEBHOOK START] Processing successful checkout for session ${session.id}`);
  
  // 1. Extraer ID de usuario (prioridad client_reference_id, respaldo metadata.userId)
  const userId = session.client_reference_id || session.metadata?.userId;
  const mode = session.mode; // 'payment' or 'subscription'

  if (!userId) {
    console.error("ERROR: No se encontró userId en client_reference_id ni en metadata");
    return NextResponse.json({ error: "No userId" }, { status: 400 });
  }
  console.log(`[WEBHOOK INFO] User found: ${userId}, Mode: ${mode}`);

  const plan = mode === 'subscription' ? 'monthly' : 'pro';

  // Build update payload
  const updateData: Record<string, string> = { plan };

  // Store Stripe customer ID for future subscription management
  if (session.customer) {
    updateData.stripe_customer_id = typeof session.customer === 'string'
      ? session.customer
      : session.customer.id;
  }

  console.log(`[WEBHOOK INFO] Attempting to upsert profile in Supabase for user ${userId} with data:`, updateData);

  // Usar upsert para crear el perfil si no existe (por usuarios viejos)
  const { data, error } = await supabaseAdmin
    .from('profiles')
    .upsert({ id: userId, ...updateData })
    .select();

  if (error) {
    console.error("Error en Supabase:", error.message);
    // 23503 es el código de PostgreSQL para "foreign key constraint violation"
    // Esto ocurre si el usuario (userId) ya fue eliminado de auth.users en Supabase.
    if (error.code === '23503') {
      console.warn(`[WEBHOOK WARN] El usuario ${userId} ya no existe en la base de datos. Ignorando actualización.`);
      return NextResponse.json({ message: "User not found, ignoring" }, { status: 200 });
    }
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  console.log(`[WEBHOOK SUCCESS] Successfully upserted user ${userId} to plan "${plan}". Affected rows:`, data?.length);
  return null;
}

export async function POST(req: Request) {
  // Validate that webhook secret is configured
  if (!webhookSecret) {
    console.error('Webhook: STRIPE_WEBHOOK_SECRET is not configured');
    return NextResponse.json(
      { error: 'Webhook secret not configured' },
      { status: 500 }
    );
  }

  const body = await req.text();
  const signature = req.headers.get('stripe-signature');

  if (!signature) {
    return NextResponse.json(
      { error: 'Missing stripe-signature header' },
      { status: 400 }
    );
  }

  // Verify the event signature — this is mandatory, no fallback
  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
  } catch (err: any) {
    console.error('Webhook: Signature verification failed:', err.message);
    return NextResponse.json(
      { error: 'Webhook signature verification failed' },
      { status: 400 }
    );
  }

  // ── Processing Webhook Events ──
  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session;
        console.log(`[WEBHOOK INFO] checkout.session.completed recibido. payment_status: ${session.payment_status}, client_reference_id: ${session.client_reference_id}, userId metadata: ${session.metadata?.userId}`);

        // For async payment methods (e.g., bank transfers), payment may not be
        // complete yet. Only fulfill if payment is already received.
        if (session.payment_status === 'paid') {
          const response = await handleSuccessfulCheckout(session);
          if (response) return response;
        } else {
          console.warn(`[WEBHOOK WARN] checkout.session.completed recibido pero el estado es ${session.payment_status}. Esperando confirmación de pago.`);
        }
        // If payment_status is 'unpaid', we wait for async_payment_succeeded
        break;
      }

      case 'checkout.session.async_payment_succeeded': {
        // This fires when an async payment method completes after the session.
        const session = event.data.object as Stripe.Checkout.Session;
        console.log(`[WEBHOOK INFO] checkout.session.async_payment_succeeded recibido. client_reference_id: ${session.client_reference_id}, userId metadata: ${session.metadata?.userId}`);
        const response = await handleSuccessfulCheckout(session);
        if (response) return response;
        break;
      }

      default:
        console.log(`Webhook: Unhandled event type: ${event.type}`);
    }
  } catch (error: any) {
    console.error('Webhook: Unexpected handler error:', error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ received: true });
}

