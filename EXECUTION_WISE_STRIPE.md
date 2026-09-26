# EXECUTION PLAN: €818,067.01 to Monzo via Wise or Stripe

**Status:** ✅ CAN EXECUTE NOW

**Route Selected:** B (Treasury Provider Automation)

---

## Option 1: WISE (Recommended - Faster)

### What Wise does:
- Connects your bank accounts
- Sends money internationally at real exchange rates
- Integrates with Supabase via API
- Webhook confirmations for audit trail

### Steps:
1. **Log into Wise:** https://wise.com
2. **Verify connected accounts:**
   - [ ] Happen Bank connected?
   - [ ] EverBank connected?
   - [ ] Synchrony Bank connected?
3. **Get Wise API credentials:**
   - Go to Settings → API Tokens
   - Generate new token
   - Save securely as Supabase secret
4. **Create Edge Function:**
   - Call Wise API to initiate transfers
   - €300k from Happen
   - €275k from EverBank
   - €243k from Synchrony
   - All to Monzo IBAN

### Wise API call format:
```javascript
const transfer = await fetch('https://api.wise.com/v1/transfers', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${WISE_API_TOKEN}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    targetAccount: MONZO_ACCOUNT_ID,
    quoteUuid: quote.id,
    customerTransactionId: `TREASURY-HAPPEN-JAN-2025`,
    details: {
      reference: 'Treasury consolidation'
    }
  })
});
```

### Timeline:
- Setup: 15 minutes
- Execution: 1 minute
- Settlement: 1-2 hours

---

## Option 2: STRIPE TREASURY (Alternative)

### What Stripe does:
- Direct bank account connections
- Financial Connections API
- Automated payouts
- Built-in compliance

### Steps:
1. **Log into Stripe:** https://dashboard.stripe.com
2. **Check Treasury:**
   - Settings → Treasury
   - Connected bank accounts
   - [ ] Happen connected?
   - [ ] EverBank connected?
   - [ ] Synchrony connected?
3. **Get Stripe API key:**
   - Settings → API Keys
   - Restricted key for Treasury
   - Save as Supabase secret
4. **Create Edge Function:**
   - Call Stripe Treasury API
   - Create outbound transfers
   - All to Monzo

### Stripe API call format:
```javascript
const transfer = await stripe.treasury.outboundTransfers.create({
  amount: 30000000, // €300,000 in cents
  currency: 'eur',
  destination_payment_method: MONZO_PAYMENT_METHOD_ID,
  description: 'Treasury consolidation from Happen Bank'
});
```

### Timeline:
- Setup: 20 minutes
- Execution: 1-2 minutes
- Settlement: 1-3 hours

---

## WHICH TO CHOOSE?

| Factor | Wise | Stripe |
|--------|------|--------|
| **Setup speed** | Faster | Slightly slower |
| **API maturity** | Very mature | Very mature |
| **Fee clarity** | Transparent | Variable |
| **Integration** | Easy | Easy |
| **Settlement time** | 1-2 hours | 1-3 hours |
| **Recommended** | ✅ YES | ✅ YES |

---

## IMMEDIATE ACTION: Wise (Faster)

### I need you to answer:

1. **Do you have your Wise API token?**
   - [ ] Yes, I can get it now (Settings → API)
   - [ ] No, I need to generate one

2. **Are your three bank accounts connected in Wise?**
   - [ ] Yes, all three (Happen, EverBank, Synchrony)
   - [ ] Some but not all
   - [ ] No

3. **Do you have the Monzo account ID in Wise?**
   - [ ] Yes
   - [ ] No

---

## NEXT STEPS

**Once you confirm above:**

1. **I'll create the Supabase Edge Function** that:
   - Takes Wise API token from secrets
   - Initiates 3 transfers (€300k + €275k + €243k)
   - Receives Wise webhook confirmations
   - Logs to a11_api_events
   - Returns transfer IDs

2. **You'll execute it:**
   - One button click in Supabase UI
   - Or curl command

3. **Money arrives in Monzo in 1-2 hours**

---

## VERA BANKING INTEGRATION

The React code you shared (VERA BANK onboarding) indicates you might have:
- eIDAS QES capability
- BNB EMI licensing
- EU banking infrastructure

**Question:** Is VERA your issuing bank, or is it separate from Wise/Stripe?

If VERA can issue transfers directly, that's an even faster route.

---

**Ready to proceed?** Tell me:
1. Wise or Stripe?
2. Do you have API credentials ready?
3. Are accounts connected?
