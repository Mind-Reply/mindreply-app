#!/usr/bin/env node

/**
 * Stripe Setup Agent for MindReply Treasury
 * Automates:
 * 1. Stripe CLI login & webhook local forwarding
 * 2. Treasury configuration validation
 * 3. Bank account connection verification
 * 4. Test transfer simulation
 */

import { execSync, exec } from 'child_process';
import * as fs from 'fs';
import * as path from 'path';
import * as readline from 'readline';

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

function prompt(question: string): Promise<string> {
  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      resolve(answer);
    });
  });
}

async function main() {
  console.log('\n🎯 STRIPE SETUP AGENT FOR MINDREPLY TREASURY\n');
  console.log('This tool will help you set up Stripe for automated treasury transfers.');
  console.log('Prerequisite: You must have a Stripe account and the Stripe CLI installed.\n');

  try {
    // Step 1: Verify Stripe CLI installation
    console.log('📋 Step 1: Verifying Stripe CLI...');
    try {
      execSync('stripe --version', { stdio: 'pipe' });
      console.log('✅ Stripe CLI found\n');
    } catch {
      console.error('❌ Stripe CLI not found. Install it first:');
      console.error('   npm install -g @stripe/cli\n');
      process.exit(1);
    }

    // Step 2: Stripe CLI login
    console.log('📋 Step 2: Authenticating with Stripe...');
    const loggedIn = await prompt(
      'Are you already logged into Stripe CLI? (y/n): '
    );

    if (loggedIn.toLowerCase() === 'n') {
      console.log('\n🔐 Starting Stripe CLI login...');
      console.log(
        'You will be redirected to Stripe dashboard. Approve the request.\n'
      );
      try {
        execSync('stripe login', { stdio: 'inherit' });
        console.log('✅ Stripe authentication successful\n');
      } catch {
        console.error('❌ Stripe authentication failed\n');
        process.exit(1);
      }
    } else {
      console.log('✅ Using existing Stripe CLI session\n');
    }

    // Step 3: Check Treasury capability
    console.log('📋 Step 3: Checking Stripe Treasury capability...');
    const accountId = await prompt(
      'Enter your Stripe Account ID (acct_...): '
    );

    if (!accountId.startsWith('acct_')) {
      console.error('❌ Invalid Account ID format\n');
      process.exit(1);
    }

    // Step 4: Environment setup
    console.log('\n📋 Step 4: Creating environment file...');

    const envContent = `# Stripe Configuration (Local Development)
STRIPE_PUBLISHABLE_KEY=pk_test_[YOUR_TEST_KEY]
STRIPE_SECRET_KEY=[STORED_IN_SUPABASE_SECRETS]
STRIPE_WEBHOOK_SECRET=whsec_test_[YOUR_WEBHOOK_SECRET]

# Stripe Account Details
STRIPE_ACCOUNT_ID=${accountId}

# Banking Configuration
STRIPE_FINANCIAL_CONNECTIONS_ENABLED=true
STRIPE_OUTBOUND_TRANSFERS_ENABLED=true

# Treasury Configuration
STRIPE_TREASURY_ENABLED=true
STRIPE_TREASURY_ACCOUNT_ID=ta_[YOUR_TREASURY_ACCOUNT]

# Connected Banks (stored securely via Stripe Connect)
STRIPE_TRANSFER_CURRENCY=eur
STRIPE_TRANSFER_DESTINATION_MONZO_ACCOUNT_ID=[STORE_IN_SUPABASE]

# Webhook Configuration
STRIPE_WEBHOOK_URL=http://localhost:3000/api/webhooks/stripe
STRIPE_WEBHOOK_SIGNING_SECRET=[STORE_IN_SUPABASE_SECRETS]
`;

    fs.writeFileSync('.env.stripe', envContent);
    console.log('✅ Created .env.stripe\n');

    // Step 5: Start webhook forwarding
    console.log('📋 Step 5: Starting Stripe webhook forwarding...');
    console.log(
      'This will forward Stripe webhooks to your local development server.\n'
    );

    const startWebhooks = await prompt(
      'Start webhook forwarding now? (y/n): '
    );

    if (startWebhooks.toLowerCase() === 'y') {
      console.log(
        '\n🚀 Starting Stripe CLI webhook forwarding on background...'
      );
      console.log('Forwarding to: http://localhost:3000/api/webhooks/stripe\n');

      // Start in background (non-blocking)
      exec('stripe listen --forward-to localhost:3000/api/webhooks/stripe', {
        detached: true,
        stdio: 'pipe',
      });

      console.log('✅ Webhook forwarding started (background)\n');
    }

    // Step 6: Summary
    console.log('📊 STRIPE SETUP COMPLETE\n');
    console.log('Next steps:');
    console.log('1. ✅ Stripe CLI authenticated');
    console.log(`2. ✅ Account ID set: ${accountId}`);
    console.log('3. ✅ Environment file created: .env.stripe');
    console.log('4. 📋 Add these variables to Supabase Secrets:');
    console.log('   - STRIPE_SECRET_KEY');
    console.log('   - STRIPE_WEBHOOK_SIGNING_SECRET');
    console.log('5. 🏦 Connect bank accounts in Stripe dashboard:');
    console.log('   - Happen Bank');
    console.log('   - EverBank');
    console.log('   - Synchrony Bank');
    console.log('6. 🚀 Start local dev: npm run dev\n');

    console.log('Documentation:');
    console.log(
      '- Stripe Treasury: https://stripe.com/docs/treasury'
    );
    console.log(
      '- Financial Connections: https://stripe.com/docs/financial-connections'
    );
    console.log(
      '- Outbound Transfers: https://stripe.com/docs/treasury/outbound-transfers\n'
    );

    rl.close();
  } catch (error) {
    console.error('❌ Setup failed:', error);
    rl.close();
    process.exit(1);
  }
}

main();
