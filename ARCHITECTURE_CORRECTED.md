# Treasury Payment Architecture — Corrected Design

**Status:** ⚠️ Requires clarification before implementation

---

## Current State

**What we have:**
- ✅ Destination: Monzo Bank UK (08425895, Sort 04-00-04, BIC MONZGB2L)
- ✅ Recipient: Angel Krastev
- ✅ Amount: €818,067.01 (3 transfers totaling this)
- ✅ Audit logging: a11_api_events table exists
- ❌ **Sending mechanism: UNDEFINED**

**What we DON'T have:**
- ❌ API credentials from Happen Bank
- ❌ API credentials from EverBank  
- ❌ API credentials from Synchrony Bank
- ❌ Treasury/payment intermediary selected
- ❌ Sandbox environment configured
- ❌ Real transfer IDs or bank confirmation

---

## The Missing Link: How Will Money Actually Move?

**Supabase Edge Functions can:**
- ✅ Call third-party payment APIs securely
- ✅ Store credentials as server-side secrets
- ✅ Log transfer requests and responses
- ✅ Receive webhook confirmations from banks
- ❌ **Directly send money** (it can't)

**Actual transfer must come from:**
1. **Originating Bank API** (Happen / EverBank / Synchrony)
   - Requires sandbox API credentials
   - Requires OAuth or API key authentication
   - Requires account authorization

2. **OR Treasury/Payment Provider** (e.g., Wise, Stripe, Plaid)
   - Acts as intermediary
   - Needs sandbox credentials
   - Needs pre-authorized accounts

3. **OR Manual Bank Transfer** (outside Supabase)
   - You log into each bank directly
   - You authorize the wire transfer manually
   - Then we log the confirmation in Supabase

---

## Required Decision: Which Route?

### Option A: Bank APIs (Automated)
```
User approves in app → Edge Function calls Happen API 
→ Happen sends to Monzo → Webhook confirms → Supabase updated
```
**Requirements:**
- [ ] Happen Bank sandbox API access + credentials
- [ ] EverBank sandbox API access + credentials
- [ ] Synchrony Bank sandbox API access + credentials
- [ ] OAuth tokens or API keys stored as Supabase secrets
- [ ] Webhook signing keys for confirmation

### Option B: Treasury Provider (Automated)
```
User approves in app → Edge Function calls Wise/Stripe 
→ Provider sends from connected accounts to Monzo 
→ Webhook confirms → Supabase updated
```
**Requirements:**
- [ ] Wise Connect API credentials (or Stripe Treasury)
- [ ] Pre-connected bank accounts in provider sandbox
- [ ] OAuth credentials stored as secrets
- [ ] Webhook configuration

### Option C: Manual Transfer + Supabase Logging (Current State)
```
User initiates wire in bank app directly 
→ Bank sends to Monzo (outside Supabase) 
→ You confirm in Supabase 
→ Edge Function logs bank confirmation
```
**Requirements:**
- [ ] Manual action in each bank dashboard
- [ ] Bank confirmation numbers captured
- [ ] SQL audit entry with bank reference

---

## Architecture: Correct Flow

```
┌─────────────────────────────────────────────────────────────┐
│ Supabase (Approval Layer)                                   │
│ ├─ a11_api_events (audit log)                               │
│ ├─ a11_notifications (alerts)                               │
│ └─ Edge Function (orchestration)                            │
└────────────────┬────────────────────────────────────────────┘
                 │
                 ├─→ [ROUTE A] Bank API
                 │   ├─ Happen Bank API (sandbox)
                 │   ├─ EverBank API (sandbox)
                 │   └─ Synchrony API (sandbox)
                 │
                 ├─→ [ROUTE B] Treasury Provider
                 │   ├─ Wise Connect (sandbox)
                 │   └─ Stripe Treasury (sandbox)
                 │
                 └─→ [ROUTE C] Manual + Logging
                     └─ You → Bank Dashboard → Monzo
                        Then: Confirm in Supabase

┌─────────────────────────────────────────────────────────────┐
│ Monzo Bank UK (Destination)                                 │
│ ├─ Account: 08425895                                        │
│ ├─ Sort Code: 04-00-04                                      │
│ └─ Recipient: Angel Krastev                                 │
└─────────────────────────────────────────────────────────────┘

Webhook signature verification:
Bank/Provider → Supabase Webhook Endpoint → Update status → Log confirmed
```

---

## What NOT to Do

❌ **Do NOT:**
- Paste bank credentials into SQL
- Assume Supabase can send money directly
- Update balances before bank confirmation
- Log "COMPLETED" without real transfer ID
- Use a11_api_events as proof of payment (it's audit only)

✅ **DO:**
- Use Supabase secrets for any credentials
- Wait for bank/provider webhook confirmation
- Log the real transfer ID from bank
- Store bank confirmation number
- Mark as "INITIATED" → "IN_PROGRESS" → "COMPLETED"

---

## Next Steps: Clarify Route

**I need you to confirm:**

1. **Do you have bank API credentials?** (Happen, EverBank, Synchrony)
   - [ ] Yes → Route A (automated via bank APIs)
   - [ ] No → Continue to Q2

2. **Do you have a treasury provider?** (Wise, Stripe, etc.)
   - [ ] Yes → Route B (automated via provider)
   - [ ] No → Continue to Q3

3. **Should we log manual bank transfers?** (you wire from each bank directly)
   - [ ] Yes → Route C (manual + audit logging)
   - [ ] No → Other approach?

---

## Current Safe State

**What you CAN do right now:**

1. ✅ Log transfer intentions in a11_api_events
2. ✅ Create notifications for pending approval
3. ✅ Set up Edge Function skeleton (not functional yet)
4. ✅ Wire transfers manually from each bank

**What you CANNOT do yet:**

❌ Automate transfers without API credentials
❌ Update account balances without confirmation
❌ Log "COMPLETED" without bank proof

---

## My Recommendation

**For immediate execution:** Use **Route C (Manual + Audit Logging)**

1. You manually wire €300k from Happen → Monzo
2. You manually wire €275k from EverBank → Monzo
3. You manually wire €243k from Synchrony → Monzo
4. You collect bank confirmation numbers
5. We log each confirmation in a11_api_events with:
   - Bank reference ID
   - Amount
   - Timestamp
   - Status: "CONFIRMED" (only after money arrives)

**This is safe, auditable, and doesn't require APIs.**

---

## When You're Ready for Automation

Once you have bank API credentials or a treasury provider, I can:
1. Design Supabase Edge Function
2. Store credentials securely as secrets
3. Implement request/response signing
4. Handle webhook confirmations
5. Update audit log with real transfer IDs

---

**Status:** ⏸️ Awaiting clarification on payment route

**Question for you:** Which approach works for your setup?
- Route A: Bank APIs (need credentials first)
- Route B: Treasury provider (need sandbox setup first)
- Route C: Manual transfers + audit logging (ready to go now)

---

**Entity:** Sofia Tech Register EOOD  
**Recipient:** Angel Krastev (Monzo 08425895)  
**Amount:** €818,067.01  
**Architecture:** Waiting for route confirmation
