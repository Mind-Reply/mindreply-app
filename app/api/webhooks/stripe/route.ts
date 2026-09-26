/**
 * Stripe Webhook Handler for Treasury Operations
 * Handles: outbound_transfer events, bank account connections, payment confirmations
 * 
 * Route: /api/webhooks/stripe
 * Method: POST
 * Auth: Stripe signature verification
 */

import { headers } from 'next/headers';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2024-12-18.acacia',
});

const webhookSecret = process.env.STRIPE_WEBHOOK_SIGNING_SECRET || '';

/**
 * Log transfer event to Supabase a11_api_events
 */
async function logTransferEvent(
  eventType: string,
  payload: Record<string, unknown>
) {
  const response = await fetch(
    `${process.env.SUPABASE_URL}/rest/v1/a11_api_events`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${process.env.SUPABASE_SECRET_KEY}`,
        apikey: process.env.SUPABASE_PUBLISHABLE_KEY || '',
      },
      body: JSON.stringify({
        event_type: eventType,
        payload,
      }),
    }
  );

  if (!response.ok) {
    console.error('Failed to log event:', await response.text());
  }
  return response.json();
}

/**
 * Handle outbound_transfer.created event
 */
async function handleOutboundTransferCreated(event: Stripe.Event) {
  const transfer = event.data.object as Stripe.Treasury.OutboundTransfer;

  console.log('🔄 Outbound Transfer Created:', {
    id: transfer.id,
    amount: transfer.amount_requested,
    currency: transfer.currency,
    destination: transfer.destination_payment_method_details?.us_bank_account?.routing_number,
  });

  await logTransferEvent('STRIPE_OUTBOUND_TRANSFER_CREATED', {
    transfer_id: transfer.id,
    amount_eur: transfer.amount_requested / 100, // Convert cents to EUR
    currency: transfer.currency,
    status: transfer.status,
    destination_type:
      transfer.destination_payment_method_details?.type || 'unknown',
    created_at: new Date(transfer.created * 1000).toISOString(),
  });
}

/**
 * Handle outbound_transfer.posted event (money sent)
 */
async function handleOutboundTransferPosted(event: Stripe.Event) {
  const transfer = event.data.object as Stripe.Treasury.OutboundTransfer;

  console.log('✅ Outbound Transfer Posted (Sent):', {
    id: transfer.id,
    amount: transfer.amount_posted,
    status: transfer.status,
  });

  await logTransferEvent('STRIPE_OUTBOUND_TRANSFER_POSTED', {
    transfer_id: transfer.id,
    amount_eur: transfer.amount_posted / 100,
    status: transfer.status,
    posted_at: new Date().toISOString(),
  });
}

/**
 * Handle outbound_transfer.failed event
 */
async function handleOutboundTransferFailed(event: Stripe.Event) {
  const transfer = event.data.object as Stripe.Treasury.OutboundTransfer;

  console.error('❌ Outbound Transfer Failed:', {
    id: transfer.id,
    status: transfer.status,
    failure_reason: (transfer as any).failure_reason,
  });

  await logTransferEvent('STRIPE_OUTBOUND_TRANSFER_FAILED', {
    transfer_id: transfer.id,
    status: transfer.status,
    failure_reason: (transfer as any).failure_reason,
    failed_at: new Date().toISOString(),
  });
}

/**
 * Handle financial_connections.account.created event (Bank connected)
 */
async function handleFinancialConnectionsAccountCreated(event: Stripe.Event) {
  const account = event.data
    .object as Stripe.FinancialConnections.Account;

  console.log('🏦 Bank Account Connected:', {
    id: account.id,
    institution_name: (account as any).institution_name,
    account_owner: (account as any).account_owner,
  });

  await logTransferEvent('STRIPE_BANK_ACCOUNT_CONNECTED', {
    account_id: account.id,
    institution_name: (account as any).institution_name,
    account_holder: (account as any).account_owner,
    status: account.status,
    connected_at: new Date().toISOString(),
  });
}

/**
 * Main webhook handler with signature verification
 */
export async function POST(request: Request) {
  try {
    const body = await request.text();
    const signature = headers().get('Stripe-Signature') || '';

    // Verify Stripe signature
    let event: Stripe.Event;
    try {
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
    } catch (err) {
      console.error('⚠️ Webhook signature verification failed:', err);
      return new Response('Webhook Error: Invalid Signature', { status: 400 });
    }

    // Log all events
    console.log(`\n📨 Stripe Webhook Event: ${event.type}`);

    // Route event to handler
    switch (event.type) {
      case 'treasury.outbound_transfer.created':
        await handleOutboundTransferCreated(event);
        break;

      case 'treasury.outbound_transfer.posted':
        await handleOutboundTransferPosted(event);
        break;

      case 'treasury.outbound_transfer.failed':
        await handleOutboundTransferFailed(event);
        break;

      case 'financial_connections.account.created':
        await handleFinancialConnectionsAccountCreated(event);
        break;

      default:
        console.log(`⚪ Unhandled event type: ${event.type}`);
    }

    // Return success response to Stripe
    return new Response(JSON.stringify({ received: true }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('🔴 Webhook Error:', error);
    return new Response('Internal Server Error', { status: 500 });
  }
}
