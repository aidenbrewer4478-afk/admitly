// app/api/admitly/webhook/route.ts
//
// Stripe calls this URL directly when a payment happens. The signature
// check below is what makes this trustworthy — without it, anyone could
// POST a fake "payment succeeded" event here and grant themselves a free
// subscription. Never remove that check.
//
// SETUP (once you're ready to wire up Stripe for real):
// 1. In Stripe Dashboard > Developers > Webhooks, click "Add endpoint"
// 2. Endpoint URL: https://YOUR-DOMAIN-HERE/api/admitly/webhook
// 3. Select event: checkout.session.completed
// 4. Stripe gives you a "Signing secret" (starts with whsec_) — add it to
//    Vercel as STRIPE_WEBHOOK_SECRET

import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { createClient } from '@supabase/supabase-js';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, { apiVersion: '2026-07-29.dahlia' });
const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: NextRequest) {
  const body = await req.text(); // raw text, NOT parsed JSON — required for signature check
  const signature = req.headers.get('stripe-signature');
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!signature || !webhookSecret) {
    return NextResponse.json({ error: 'Webhook not configured.' }, { status: 500 });
  }

  let event: Stripe.Event;
  try {
    // This is the check that matters — it proves the request really came
    // from Stripe and wasn't forged by someone who found this URL.
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
  } catch (err: any) {
    return NextResponse.json({ error: `Signature check failed: ${err.message}` }, { status: 400 });
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session;
    const email = session.client_reference_id;

    if (email) {
      await supabase
        .from('admitly_users')
        .update({
          subscription_status: 'active',
          stripe_customer_id: session.customer as string,
        })
        .eq('email', email);
    }
  }

  // Also handle cancellations, so a cancel actually removes access.
  if (event.type === 'customer.subscription.deleted') {
    const subscription = event.data.object as Stripe.Subscription;
    const customerId = subscription.customer as string;

    await supabase
      .from('admitly_users')
      .update({ subscription_status: 'canceled' })
      .eq('stripe_customer_id', customerId);
  }

  return NextResponse.json({ received: true });
}
