/**
 * Stripe Treasury Transfer Edge Function
 * Executes automated outbound transfers via Stripe Treasury API
 * 
 * Route: /api/treasury/execute-transfer
 * Method: POST
 * Auth: Supabase auth required
 * 
 * Body: {
 *   amount_eur: number,
 *   destination: "monzo" | "other",
 *   reference: string,
 *   source_account: string (optional - can infer from Stripe)
 * }
 */

import { createClient } from '@supabase/supabase-js';
import Stripe from 'stripe';
import { NextRequest, NextResponse } from 'next/server';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2024-12-18.acacia',
});

const supabase = createClient(
  process.env.SUPABASE_URL || '',
  process.env.SUPABASE_SECRET_KEY || ''
);

/**
 * Execute a single outbound transfer via Stripe Treasury
 */
async function executeTransfer(params: {
  amount_eur: number;
  destination: string;
  reference: string;
  source_account?: string;
}) {
  try {
    console.log('🔄 Executing Stripe Treasury transfer:', params);

    // Step 1: Convert EUR to cents
    const amountCents = Math.round(params.amount_eur * 100);

    // Step 2: Create outbound transfer
    const transfer = await stripe.treasury.outboundTransfers.create({
      amount: amountCents,
      currency: 'eur',
      destination_payment_method: process.env
        .STRIPE_TRANSFER_DESTINATION_MONZO_ACCOUNT_ID,
      description: params.reference,
    } as any);

    console.log('✅ Transfer created:', {
      id: transfer.id,
      amount: params.amount_eur,
      status: transfer.status,
    });

    // Step 3: Log to Supabase
    const { data, error } = await supabase
      .from('a11_api_events')
      .insert({
        event_type: 'TREASURY_TRANSFER_INITIATED',
        payload: {
          stripe_transfer_id: transfer.id,
          amount_eur: params.amount_eur,
          destination: params.destination,
          reference: params.reference,
          status: transfer.status,
          initiated_at: new Date().toISOString(),
        },
      });

    if (error) {
      throw new Error(`Supabase logging failed: ${error.message}`);
    }

    return {
      success: true,
      transfer_id: transfer.id,
      amount: params.amount_eur,
      status: transfer.status,
      reference: params.reference,
    };
  } catch (error) {
    console.error('❌ Transfer execution failed:', error);

    // Log failure
    await supabase.from('a11_api_events').insert({
      event_type: 'TREASURY_TRANSFER_FAILED',
      payload: {
        error: error instanceof Error ? error.message : String(error),
        amount_eur: params.amount_eur,
        reference: params.reference,
        failed_at: new Date().toISOString(),
      },
    });

    throw error;
  }
}

/**
 * Main POST handler
 */
export async function POST(request: NextRequest) {
  try {
    // Verify authentication
    const authHeader = request.headers.get('authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const token = authHeader.slice(7);
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser(token);

    if (authError || !user) {
      return NextResponse.json(
        { error: 'Invalid token' },
        { status: 401 }
      );
    }

    // Parse request body
    const body = await request.json();
    const { amount_eur, destination, reference, source_account } = body;

    // Validation
    if (!amount_eur || amount_eur <= 0) {
      return NextResponse.json(
        { error: 'Invalid amount' },
        { status: 400 }
      );
    }

    if (!destination || !reference) {
      return NextResponse.json(
        { error: 'Missing destination or reference' },
        { status: 400 }
      );
    }

    // Execute transfer
    const result = await executeTransfer({
      amount_eur,
      destination,
      reference,
      source_account,
    });

    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    console.error('API Error:', error);

    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

/**
 * GET handler for checking transfer status
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const transferId = searchParams.get('transfer_id');

    if (!transferId) {
      return NextResponse.json(
        { error: 'Missing transfer_id parameter' },
        { status: 400 }
      );
    }

    // Retrieve transfer from Stripe
    const transfer = await stripe.treasury.outboundTransfers.retrieve(
      transferId
    );

    return NextResponse.json(
      {
        id: transfer.id,
        amount: transfer.amount_requested / 100,
        currency: transfer.currency,
        status: transfer.status,
        created: new Date(transfer.created * 1000).toISOString(),
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Status check error:', error);

    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
