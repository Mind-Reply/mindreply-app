/**
 * Stripe Webhook Handler
 * POST /api/payments/webhook
 * Receives payment events from Stripe and processes them
 */

import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2024-11-20',
});

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET || '';

export async function POST(request: NextRequest): Promise<NextResponse> {
  const sig = request.headers.get('stripe-signature');
  const body = await request.text();

  if (!sig || !webhookSecret) {
    return NextResponse.json(
      { error: 'Missing Stripe signature or webhook secret' },
      { status: 400 }
    );
  }

  try {
    const event = stripe.webhooks.constructEvent(body, sig, webhookSecret);

    // Handle payment success
    if (event.type === 'payment_intent.succeeded') {
      const paymentIntent = event.data.object as Stripe.PaymentIntent;
      const agentId = paymentIntent.metadata?.agent_id;
      const serviceType = paymentIntent.metadata?.service_type;

      console.log(`✓ Payment succeeded: ${paymentIntent.id}`);
      console.log(`  Agent: ${agentId}`);
      console.log(`  Service: ${serviceType}`);
      console.log(`  Amount: ${paymentIntent.amount / 100} ${paymentIntent.currency.toUpperCase()}`);

      // TODO: Update agent credits, log transaction, trigger service execution
    }

    // Handle payment failure
    if (event.type === 'payment_intent.payment_failed') {
      const paymentIntent = event.data.object as Stripe.PaymentIntent;
      console.error(`✗ Payment failed: ${paymentIntent.id}`);
      console.error(`  Last error: ${paymentIntent.last_payment_error?.message}`);
      // TODO: Notify agent, log failure, allow retry
    }

    return NextResponse.json({ received: true }, { status: 200 });
  } catch (error) {
    console.error('Webhook error:', error);
    return NextResponse.json(
      { error: 'Webhook verification failed' },
      { status: 400 }
    );
  }
}
