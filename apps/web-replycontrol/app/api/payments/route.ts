/**
 * Stripe Machine Payments API
 * Accepts payment challenges from agents via MPP (Shared Payment Tokens) and x402 (stablecoin)
 * Returns payment verification tokens for autonomous settlement
 */

import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2024-11-20',
});

interface MachinePaymentRequest {
  agent_id: string;
  service_type: 'rwa_bridge' | 'api_call' | 'ai_inference';
  amount_cents: number; // Minimum: 50 (0.50 USD)
  currency: 'usd' | 'usdc';
  payment_method: 'spt' | 'stablecoin'; // SPT = card via Shared Payment Token, stablecoin = x402
  metadata?: Record<string, string>;
}

interface PaymentChallenge {
  payment_id: string;
  challenge: string;
  expires_at: number;
  agent_can_pay: boolean;
}

/**
 * POST /api/payments
 * Agent submits payment challenge request
 */
export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const body: MachinePaymentRequest = await request.json();

    // Validate minimum amounts
    if (body.currency === 'usd' && body.amount_cents < 50) {
      return NextResponse.json(
        { error: 'Minimum card payment is $0.50 (50 cents)' },
        { status: 400 }
      );
    }

    if (body.currency === 'usdc' && parseFloat((body.amount_cents / 1e6).toFixed(2)) < 0.01) {
      return NextResponse.json(
        { error: 'Minimum stablecoin payment is 0.01 USDC' },
        { status: 400 }
      );
    }

    // Create payment intent for machine payment
    const paymentIntent = await stripe.paymentIntents.create({
      amount: body.amount_cents,
      currency: body.currency,
      metadata: {
        agent_id: body.agent_id,
        service_type: body.service_type,
        payment_method: body.payment_method,
        ...body.metadata,
      },
      automatic_payment_methods: {
        enabled: true,
        allow_redirects: 'never', // No human redirect needed for agents
      },
    });

    const challenge: PaymentChallenge = {
      payment_id: paymentIntent.id,
      challenge: paymentIntent.client_secret || '',
      expires_at: Date.now() + 5 * 60 * 1000, // 5 minute expiry
      agent_can_pay: true,
    };

    return NextResponse.json(challenge, { status: 200 });
  } catch (error) {
    console.error('Payment challenge error:', error);
    return NextResponse.json(
      { error: 'Failed to create payment challenge' },
      { status: 500 }
    );
  }
}

/**
 * GET /api/payments/[payment_id]
 * Agent polls for payment status / settlement confirmation
 */
export async function GET(request: NextRequest): Promise<NextResponse> {
  try {
    const url = new URL(request.url);
    const payment_id = url.pathname.split('/').pop();

    if (!payment_id) {
      return NextResponse.json(
        { error: 'Payment ID required' },
        { status: 400 }
      );
    }

    const paymentIntent = await stripe.paymentIntents.retrieve(payment_id);

    const response = {
      payment_id: paymentIntent.id,
      status: paymentIntent.status, // 'succeeded', 'processing', 'requires_payment_method', etc.
      amount: paymentIntent.amount,
      currency: paymentIntent.currency,
      agent_id: paymentIntent.metadata?.agent_id,
      service_type: paymentIntent.metadata?.service_type,
      created_at: new Date(paymentIntent.created * 1000).toISOString(),
    };

    return NextResponse.json(response, { status: 200 });
  } catch (error) {
    console.error('Payment status error:', error);
    return NextResponse.json(
      { error: 'Failed to retrieve payment status' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/payments/webhook
 * Stripe webhook for payment events (succeeded, failed, etc.)
 * Called by Stripe after agent completes payment
 */
export async function handleStripeWebhook(request: NextRequest): Promise<NextResponse> {
  const sig = request.headers.get('stripe-signature');
  const body = await request.text();

  if (!sig) {
    return NextResponse.json(
      { error: 'Missing Stripe signature' },
      { status: 400 }
    );
  }

  try {
    const event = stripe.webhooks.constructEvent(
      body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET || ''
    );

    switch (event.type) {
      case 'payment_intent.succeeded': {
        const pi = event.data.object as Stripe.PaymentIntent;
        console.log(`Payment succeeded for agent: ${pi.metadata?.agent_id}`, pi.id);
        // Log successful payment, update agent credit, trigger service completion
        break;
      }
      case 'payment_intent.payment_failed': {
        const pi = event.data.object as Stripe.PaymentIntent;
        console.log(`Payment failed for agent: ${pi.metadata?.agent_id}`, pi.id);
        // Log failed payment, notify agent, allow retry
        break;
      }
      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    return NextResponse.json({ received: true }, { status: 200 });
  } catch (error) {
    console.error('Webhook verification error:', error);
    return NextResponse.json(
      { error: 'Webhook signature verification failed' },
      { status: 400 }
    );
  }
}
