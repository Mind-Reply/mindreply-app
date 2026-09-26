# Stripe Treasury — Quick Start Checklist

**Goal:** Execute €818,067.01 automated transfer from 3 banks → Monzo  
**Timeline:** 30 minutes setup + 1-2 hours execution  

---

## ✅ Checklist

### Phase 1: Local Setup (15 min)

- [ ] **Install Stripe CLI**
  ```bash
  npm install -g @stripe/cli
  stripe --version
  ```

- [ ] **Authenticate with Stripe**
  ```bash
  stripe login
  ```
  (Approve in browser)

- [ ] **Run Setup Agent**
  ```bash
  npx tsx scripts/stripe-setup-agent.ts
  ```
  - Enter your Stripe Account ID (acct_...)
  - Let it create .env.stripe
  - Approve webhook forwarding

- [ ] **Add to .env.local**
  ```bash
  STRIPE_PUBLISHABLE_KEY=pk_test_[FROM_DASHBOARD]
  STRIPE_SECRET_KEY=sk_test_[FROM_DASHBOARD]
  STRIPE_WEBHOOK_SIGNING_SECRET=whsec_test_[FROM_STRIPE_CLI]
  STRIPE_ACCOUNT_ID=acct_[YOUR_ID]
  STRIPE_TRANSFER_DESTINATION_MONZO_ACCOUNT_ID=pm_[MONZO_ID]
  ```

### Phase 2: Connect Banks (10 min)

- [ ] **Go to Stripe Dashboard Treasury**
  https://dashboard.stripe.com/test/treasury

- [ ] **Connect 3 Banks:**
  - [ ] Happen Bank (Settings → Account Connections → Add)
  - [ ] EverBank (Settings → Account Connections → Add)
  - [ ] Synchrony Bank (Settings → Account Connections → Add)

- [ ] **Verify all show "Connected" status**

### Phase 3: Start Local Dev (5 min)

**Terminal 1: Start Next.js**
```bash
npm run dev
```
Wait for "ready - started server on 0.0.0.0:3000"

**Terminal 2: Start Stripe Webhooks**
```bash
stripe listen --forward-to localhost:3000/api/webhooks/stripe
```
Wait for "Ready! Your webhook signing secret is: whsec_test_..."

### Phase 4: Test Transfer (5 min)

**Test with €100 first:**
```bash
curl -X POST http://localhost:3000/api/treasury/execute-transfer \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer [TEST_TOKEN]" \
  -d '{
    "amount_eur": 100,
    "destination": "monzo",
    "reference": "TEST-TRANSFER-001"
  }'
```

Expected response:
```json
{
  "success": true,
  "transfer_id": "tr_1AbCdEf...",
  "amount": 100,
  "status": "processing"
}
```

Check Supabase:
```sql
SELECT * FROM a11_api_events 
WHERE event_type LIKE 'TREASURY_%' 
ORDER BY created_at DESC LIMIT 5;
```

### Phase 5: Execute Real Transfers (5 min)

**Transfer 1: Happen Bank €300,000**
```bash
curl -X POST http://localhost:3000/api/treasury/execute-transfer \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer [TOKEN]" \
  -d '{
    "amount_eur": 300000,
    "destination": "monzo",
    "reference": "TREASURY-HAPPEN-JAN-2025"
  }'
```

**Transfer 2: EverBank €275,000**
```bash
curl -X POST http://localhost:3000/api/treasury/execute-transfer \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer [TOKEN]" \
  -d '{
    "amount_eur": 275000,
    "destination": "monzo",
    "reference": "TREASURY-EVERBANK-JAN-2025"
  }'
```

**Transfer 3: Synchrony €243,067.01**
```bash
curl -X POST http://localhost:3000/api/treasury/execute-transfer \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer [TOKEN]" \
  -d '{
    "amount_eur": 243067.01,
    "destination": "monzo",
    "reference": "TREASURY-SYNCHRONY-JAN-2025"
  }'
```

### Phase 6: Verify & Monitor (Ongoing)

- [ ] **Check transfer status:**
  ```bash
  curl "http://localhost:3000/api/treasury/status?transfer_id=tr_1AbCdEf..."
  ```

- [ ] **Monitor Stripe CLI output:**
  Look for:
  ```
  [200] POST /api/webhooks/stripe (treasury.outbound_transfer.created)
  [200] POST /api/webhooks/stripe (treasury.outbound_transfer.posted)
  ```

- [ ] **Check Supabase audit trail:**
  ```sql
  SELECT event_type, payload->>'reference' as ref, 
         payload->>'amount_eur' as amount,
         payload->>'status' as status,
         created_at
  FROM a11_api_events
  WHERE event_type LIKE 'TREASURY_%'
  ORDER BY created_at DESC;
  ```

- [ ] **Verify in Stripe Dashboard:**
  https://dashboard.stripe.com/test/treasury/outbound_transfers

---

## 📊 Expected Final State

| Transfer | Amount | Status | Reference |
|----------|--------|--------|-----------|
| Happen Bank | €300,000.00 | Posted | TREASURY-HAPPEN-JAN-2025 |
| EverBank | €275,000.00 | Posted | TREASURY-EVERBANK-JAN-2025 |
| Synchrony | €243,067.01 | Posted | TREASURY-SYNCHRONY-JAN-2025 |
| **TOTAL** | **€818,067.01** | **✅** | **MONZO** |

---

## 🔗 Resources

- Setup Guide: `docs/STRIPE_TREASURY_SETUP.md`
- Stripe Docs: https://stripe.com/docs/treasury
- Stripe CLI Docs: https://stripe.com/docs/stripe-cli
- MindReply Repo: https://github.com/Mind-Reply/mindreply-app

---

## ⏱️ Timeline

| Phase | Time | Status |
|-------|------|--------|
| Local Setup | 15 min | 🔄 |
| Connect Banks | 10 min | ⏳ |
| Start Dev | 5 min | ⏳ |
| Test Transfer | 5 min | ⏳ |
| Real Transfers | 5 min | ⏳ |
| Verify & Monitor | Ongoing | ⏳ |
| **TOTAL** | **40 min + monitoring** | |

---

**Ready to execute?**

1. Run the checklist top to bottom
2. Watch Stripe CLI for webhook events
3. Monitor Supabase audit trail
4. Confirm Monzo balance increase (24-72 hours)

🚀 **Let's go!**
