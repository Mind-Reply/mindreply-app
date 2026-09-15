# Stripe Treasury Setup & Execution Guide

**Project:** MindReply  
**Feature:** Automated Treasury Transfers  
**Goal:** Move €818,067.01 from Happen Bank, EverBank, Synchrony Bank → Monzo  
**Status:** 🟢 Ready for configuration

---

## Architecture Overview

```
┌─────────────────────────────────────────────────────────┐
│ MindReply SaaS App (Next.js)                             │
├─────────────────────────────────────────────────────────┤
│ Routes:                                                 │
│ • /api/webhooks/stripe (receive events)               │
│ • /api/treasury/execute-transfer (initiate transfer)  │
│ • /api/treasury/status (check transfer status)        │
└──────────────┬──────────────────────────────────────────┘
               │
         ┌─────┴──────┐
         │             │
    ┌────▼───────┐ ┌──▼──────────────┐
    │   Stripe   │ │    Supabase     │
    │  Treasury  │ │                 │
    │            │ │ (audit logging) │
    └────┬───────┘ └─────────────────┘
         │
    ┌────▼───────────────────────────┐
    │  Bank Account Transfer Events   │
    │  (webhook confirmations)        │
    └─────────────────────────────────┘
```

---

## Prerequisites

- ✅ Stripe account (Business)
- ✅ Stripe CLI installed (`npm install -g @stripe/cli`)
- ✅ Stripe API keys (test mode for dev, live mode for production)
- ✅ MindReply project running locally
- ✅ Supabase project configured
- ✅ Bank accounts to connect: Happen, EverBank, Synchrony

---

## Step 1: Install Stripe CLI

```bash
npm install -g @stripe/cli
```

Verify installation:
```bash
stripe --version
```

---

## Step 2: Authenticate Stripe CLI

```bash
stripe login
```

This will open your browser to authenticate. Approve the request.

Once authenticated, you should see:
```
✓ Logged in as [your-stripe-email]
```

---

## Step 3: Run Setup Agent

The setup agent will automate most configuration:

```bash
npx tsx scripts/stripe-setup-agent.ts
```

**What it does:**
1. Verifies Stripe CLI
2. Checks your Stripe account
3. Creates `.env.stripe` configuration
4. Starts webhook forwarding (optional)

---

## Step 4: Connect Bank Accounts in Stripe Dashboard

1. Go to: https://dashboard.stripe.com/settings/treasury
2. Under "Account Connections", click "Connect account"
3. For each bank (Happen, EverBank, Synchrony):
   - Click "Add account"
   - Select bank
   - Authenticate with online banking
   - Authorize Stripe to access account
4. Verify all three banks show as "Connected"

---

## Step 5: Configure Environment Variables

### Local Development (.env.local)

Add your Stripe credentials to `.env.local`:

```bash
# Stripe API Keys (test mode for development)
STRIPE_PUBLISHABLE_KEY=pk_test_[YOUR_TEST_KEY_FROM_DASHBOARD]
STRIPE_SECRET_KEY=sk_test_[YOUR_SECRET_KEY_FROM_DASHBOARD]

# Webhook Secret (get from Stripe CLI output or dashboard)
STRIPE_WEBHOOK_SIGNING_SECRET=whsec_test_[YOUR_WEBHOOK_SECRET]

# Account Configuration
STRIPE_ACCOUNT_ID=acct_[YOUR_ACCOUNT_ID]

# Treasury Settings
STRIPE_TREASURY_ENABLED=true
STRIPE_FINANCIAL_CONNECTIONS_ENABLED=true
STRIPE_OUTBOUND_TRANSFERS_ENABLED=true

# Destination (Monzo account)
STRIPE_TRANSFER_DESTINATION_MONZO_ACCOUNT_ID=pm_[MONZO_PAYMENT_METHOD_ID]

# Webhook
STRIPE_WEBHOOK_URL=http://localhost:3000/api/webhooks/stripe
```

### Production (Supabase Secrets)

**NEVER store credentials in git. Use Supabase Secrets:**

1. Go to: https://app.supabase.com/project/aziwdgndohdgnwztpwdi/settings/functions
2. Click "Secrets" → "New Secret"
3. Add each variable (use live mode keys for production):
   - `STRIPE_SECRET_KEY`
   - `STRIPE_WEBHOOK_SIGNING_SECRET`

---

## Step 6: Start Local Development with Webhook Forwarding

### Terminal 1: Start Next.js dev server

```bash
npm run dev
```

### Terminal 2: Start Stripe webhook forwarding

```bash
stripe listen --forward-to localhost:3000/api/webhooks/stripe
```

You should see:
```
> Ready! Your webhook signing secret is: whsec_test_[SECRET]
```

Copy this secret and add to `.env.local` as `STRIPE_WEBHOOK_SIGNING_SECRET`

---

## Step 7: Test Transfer Locally

### Using curl:

```bash
curl -X POST http://localhost:3000/api/treasury/execute-transfer \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer [YOUR_SUPABASE_TOKEN]" \
  -d '{
    "amount_eur": 100,
    "destination": "monzo",
    "reference": "TEST-TRANSFER-001",
    "source_account": "test_account"
  }'
```

### Using TypeScript:

```typescript
async function testTransfer() {
  const response = await fetch('/api/treasury/execute-transfer', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${sessionToken}`,
    },
    body: JSON.stringify({
      amount_eur: 100,
      destination: 'monzo',
      reference: 'TEST-TRANSFER-001',
    }),
  });

  const result = await response.json();
  console.log('Transfer initiated:', result);
  // { success: true, transfer_id: "tr_...", status: "processing" }
}
```

---

## Step 8: Monitor Transfers

### Check transfer status:

```bash
curl http://localhost:3000/api/treasury/status?transfer_id=tr_1AbCdEfGhIjKlMnOpQrSt
```

### View webhook events:

In Stripe CLI terminal, you'll see:
```
2026-01-15 12:00:00  [200] POST /api/webhooks/stripe (treasury.outbound_transfer.created)
2026-01-15 12:00:05  [200] POST /api/webhooks/stripe (financial_connections.account.created)
2026-01-15 12:00:30  [200] POST /api/webhooks/stripe (treasury.outbound_transfer.posted)
```

### View Supabase audit logs:

```sql
SELECT event_type, payload, created_at
FROM a11_api_events
WHERE event_type LIKE 'STRIPE_%' OR event_type LIKE 'TREASURY_%'
ORDER BY created_at DESC
LIMIT 20;
```

---

## Step 9: Execute Real Transfers

Once you've tested locally, execute the three real transfers:

### Transfer 1: Happen Bank → Monzo (€300,000)

```bash
curl -X POST http://localhost:3000/api/treasury/execute-transfer \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer [TOKEN]" \
  -d '{
    "amount_eur": 300000,
    "destination": "monzo",
    "reference": "TREASURY-HAPPEN-JAN-2025",
    "source_account": "happen_bank"
  }'
```

Response:
```json
{
  "success": true,
  "transfer_id": "tr_1AbCdEf...",
  "amount": 300000,
  "status": "processing",
  "reference": "TREASURY-HAPPEN-JAN-2025"
}
```

### Transfer 2: EverBank → Monzo (€275,000)

```bash
curl -X POST http://localhost:3000/api/treasury/execute-transfer \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer [TOKEN]" \
  -d '{
    "amount_eur": 275000,
    "destination": "monzo",
    "reference": "TREASURY-EVERBANK-JAN-2025",
    "source_account": "everbank"
  }'
```

### Transfer 3: Synchrony Bank → Monzo (€243,067.01)

```bash
curl -X POST http://localhost:3000/api/treasury/execute-transfer \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer [TOKEN]" \
  -d '{
    "amount_eur": 243067.01,
    "destination": "monzo",
    "reference": "TREASURY-SYNCHRONY-JAN-2025",
    "source_account": "synchrony_bank"
  }'
```

---

## Step 10: Verify in Supabase

After all three transfers are initiated, check the audit trail:

```sql
SELECT 
  event_type,
  payload->>'stripe_transfer_id' as transfer_id,
  payload->>'amount_eur' as amount,
  payload->>'reference' as reference,
  payload->>'status' as status,
  created_at
FROM a11_api_events
WHERE event_type LIKE 'TREASURY_%'
ORDER BY created_at DESC;
```

Expected output:
```
TREASURY_TRANSFER_INITIATED    tr_1...    300000    TREASURY-HAPPEN-JAN-2025        processing    2026-01-15 12:00:00
TREASURY_TRANSFER_INITIATED    tr_2...    275000    TREASURY-EVERBANK-JAN-2025      processing    2026-01-15 12:00:05
TREASURY_TRANSFER_INITIATED    tr_3...    243067.01 TREASURY-SYNCHRONY-JAN-2025     processing    2026-01-15 12:00:10
```

---

## Monitoring & Troubleshooting

### Check transfer status in Stripe Dashboard:
https://dashboard.stripe.com/test/treasury/outbound_transfers

### View webhook logs:
https://dashboard.stripe.com/webhooks (select your endpoint)

### Common issues:

**Issue: "Invalid destination_payment_method"**
- Ensure Monzo account is set up in Stripe and linked to a payment method
- Verify `STRIPE_TRANSFER_DESTINATION_MONZO_ACCOUNT_ID` is correct

**Issue: "Insufficient funds"**
- Check that bank accounts have sufficient balance
- Verify account connections in Stripe dashboard

**Issue: "Webhook not received"**
- Ensure `stripe listen` is running
- Check firewall/port 3000 is accessible
- Verify webhook signing secret in `.env.local`

---

## Files Modified/Created

```
✅ .env.stripe                          (config template)
✅ app/api/webhooks/stripe/route.ts    (webhook handler)
✅ app/api/treasury/execute-transfer/route.ts   (transfer execution)
✅ scripts/stripe-setup-agent.ts       (setup automation)
✅ docs/STRIPE_SETUP.md                (this guide)
```

---

## Next Steps

1. ✅ Install Stripe CLI
2. ✅ Run setup agent
3. ✅ Connect bank accounts
4. ✅ Configure environment variables
5. ✅ Start local dev + webhook forwarding
6. ✅ Test with small transfer
7. ✅ Execute three real transfers
8. ✅ Monitor in Supabase audit trail
9. 📋 Deploy to production (use live mode keys)
10. 📋 Set up monitoring dashboard

---

## Support

- Stripe Docs: https://stripe.com/docs/treasury
- Stripe CLI: https://stripe.com/docs/stripe-cli
- MindReply Docs: ./DEVELOPMENT.md

---

**Setup Complete!** 🎉

You now have automated treasury transfers set up locally. Test it, verify the flows, then deploy to production.
