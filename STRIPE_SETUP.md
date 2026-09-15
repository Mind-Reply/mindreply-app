# Stripe Machine Payments Setup Guide

## Overview
MindReply now accepts autonomous payments from AI agents via Stripe Machine Payments Protocol (MPP) and x402 (stablecoin payments).

**Supported payment methods:**
- Shared Payment Tokens (SPT) – Card payments ($0.50 min)
- Stablecoin USDC – Solana, Tempo, Base networks (0.01 USDC min)

---

## Step 1: Stripe Account Setup

### 1a. Create or Log into Stripe
1. Go to [dashboard.stripe.com](https://dashboard.stripe.com)
2. Create a new account or log in

### 1b. Enable Machine Payments
1. Navigate to **Settings → Payment Methods**
2. Enable **Stablecoins and Cryptocurrency**
3. Stripe reviews your request (typically 24-48 hours)
4. Once approved, it becomes active in the Dashboard

### 1c. Get API Keys
1. Go to **Developers → API Keys**
2. Copy:
   - **Secret key** (begins with `sk_live_` or `sk_test_`)
   - **Publishable key** (begins with `pk_live_` or `pk_test_`)

### 1d. Create Webhook Endpoint
1. Go to **Developers → Webhooks**
2. Click **Add Endpoint**
3. Enter URL: `https://your-domain.com/api/payments/webhook`
4. Select events: `payment_intent.succeeded`, `payment_intent.payment_failed`
5. Copy the **Signing secret** (begins with `whsec_`)

---

## Step 2: Configure Local Environment

### 2a. Create `.env.local`
```bash
cp .env.production.example .env.local
```

### 2b. Fill in Stripe Secrets
Edit `.env.local`:
```env
STRIPE_SECRET_KEY=sk_live_your_actual_secret_key
STRIPE_PUBLISHABLE_KEY=pk_live_your_actual_publishable_key
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_signing_secret
```

### 2c. (Optional) For local testing with Stripe CLI
```bash
# Install Stripe CLI
brew install stripe/stripe-cli/stripe  # macOS
# or download from https://stripe.com/docs/stripe-cli

# Log in
stripe login

# Forward webhooks to local endpoint
stripe listen --forward-to localhost:3000/api/payments/webhook

# Run local server
docker compose up --pull always
```

---

## Step 3: Deploy to Production

### 3a. GitHub Secrets
1. Go to your GitHub repo → **Settings → Secrets and variables → Actions**
2. Add these secrets:
   - `STRIPE_SECRET_KEY` – Your live Stripe secret key
   - `STRIPE_PUBLISHABLE_KEY` – Your live Stripe publishable key
   - `STRIPE_WEBHOOK_SECRET` – Your live webhook signing secret
   - `VERCEL_TOKEN` – (for Vercel deployments)
   - `VERCEL_ORG_ID` – (for Vercel deployments)
   - `VERCEL_PROJECT_ID` – (for Vercel deployments)

### 3b. Update Webhook Endpoint
1. In Stripe Dashboard → **Developers → Webhooks**
2. Update the webhook URL to your production domain:
   ```
   https://your-production-domain.com/api/payments/webhook
   ```

### 3c. Deploy via GitHub Actions
```bash
git add .
git commit -m "feat: Add Stripe machine payments integration"
git push origin main
```
GitHub Actions will automatically:
- Build Docker images
- Push to GitHub Container Registry (ghcr.io)
- Deploy frontend to Vercel
- Run health checks

---

## Step 4: API Usage (For Agents)

### 4a. Request a Payment Challenge
**POST** `/api/payments`
```json
{
  "agent_id": "agent-uuid-12345",
  "service_type": "rwa_bridge",
  "amount_cents": 50,
  "currency": "usd",
  "payment_method": "spt"
}
```

**Response:**
```json
{
  "payment_id": "pi_1234567890abcdef",
  "client_secret": "pi_1234567890abcdef_secret_xyz",
  "amount": 50,
  "currency": "usd",
  "expires_at": 1234567890
}
```

### 4b. Agent Completes Payment
Agent uses the `client_secret` to present payment through Stripe Elements or their wallet.

### 4c. Poll Payment Status
**GET** `/api/payments/{payment_id}`
```json
{
  "payment_id": "pi_1234567890abcdef",
  "status": "succeeded",
  "amount": 50,
  "currency": "usd",
  "agent_id": "agent-uuid-12345",
  "service_type": "rwa_bridge"
}
```

### 4d. Execute Service After Payment
**POST** `/acquire-with-payment`
```json
{
  "asset_id": "SPV-REAL-ESTATE-NODE-88",
  "payment_id": "pi_1234567890abcdef"
}
```

The RWA Bridge verifies payment status, then executes the asset acquisition.

---

## Step 5: Submit to Stripe Directory

Once integrated and tested, submit to the **Stripe Directory** for agent discovery.

**Email:** machine-payments@stripe.com

**Include:**
- Business name: MindReply
- Stripe account ID: `acct_...`
- Stripe profile ID: (from https://dashboard.stripe.com/settings/profile)
- Link to your `llms.txt` file
- Links to agent skills/capabilities
- Example prompts:
  - "Acquire a real-world asset for $50 using machine payment"
  - "Programmatically settle a service payment via Stripe"
  - "Check payment status for an agent transaction"

---

## Environment Variables Reference

| Variable | Purpose | Example |
|----------|---------|---------|
| `STRIPE_SECRET_KEY` | Server-side secret (never expose) | `sk_live_abc123` |
| `STRIPE_PUBLISHABLE_KEY` | Client-side public key | `pk_live_xyz789` |
| `STRIPE_WEBHOOK_SECRET` | Webhook signing secret | `whsec_xyz789` |
| `STRIPE_ENDPOINT_SECRET` | Alternative webhook secret name | `whsec_xyz789` |

---

## Troubleshooting

### Payment Challenge Not Creating
- Check that `STRIPE_SECRET_KEY` is set correctly
- Verify Stripe account is in good standing
- Check for rate limiting (max 100 requests/sec)

### Webhook Not Receiving Events
- Verify webhook endpoint URL in Stripe Dashboard
- Check webhook signing secret matches `STRIPE_WEBHOOK_SECRET`
- Use Stripe CLI locally: `stripe listen --forward-to localhost:3000/api/payments/webhook`
- Check server logs for webhook processing errors

### Payment Status Always Pending
- Ensure agent has completed payment through their wallet
- Check payment intent status in Stripe Dashboard
- Verify `client_secret` was correctly passed to agent

### Stablecoin Payments Not Available
- Request access: Email machine-payments@stripe.com with Stripe account ID
- Ensure account is in a supported country (not NY for US)
- Wait for approval (typically 24-48 hours)

---

## Security Checklist

- [ ] `STRIPE_SECRET_KEY` is set in production (not in code)
- [ ] Webhook endpoint returns `200 OK` on success
- [ ] Webhook signature verification is enabled
- [ ] Payment amounts validated before execution
- [ ] Agent identity verified before processing payments
- [ ] Transaction logs captured for audit/compliance
- [ ] Rate limiting configured on payment endpoints
- [ ] HTTPS enforced on all payment endpoints

---

## Next Steps

1. **Local testing:** `docker compose up --pull always`
2. **Test payment flow:** Submit a test payment challenge
3. **Deploy to staging:** Push to a staging branch
4. **Enable webhooks:** Test Stripe webhook delivery
5. **Go live:** Deploy to production with real Stripe keys
6. **Submit to Directory:** List on Stripe Directory for agents
