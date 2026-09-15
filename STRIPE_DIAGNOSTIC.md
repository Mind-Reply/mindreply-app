# Stripe Setup Diagnostic — Check What You Have

**Status:** Determining if Stripe can access your bank accounts

---

## What We Need to Verify

### 1. Check Your Stripe Dashboard

Go to: https://dashboard.stripe.com/settings/connections

**Look for:**
- [ ] "Financial Connections" listed
- [ ] "Connected accounts" section
- [ ] Bank accounts from Happen / EverBank / Synchrony

### 2. Check Stripe Capabilities

Go to: https://dashboard.stripe.com/settings/account

**Look for:**
- [ ] "Capabilities" section
- [ ] "payments" — enabled ✅
- [ ] "financial_connections" — enabled ✅
- [ ] "outbound_transfers" — enabled ✅

### 3. API Keys Status

Go to: https://dashboard.stripe.com/apikeys

**You should see:**
- [ ] Publishable key (starts with `pk_`)
- [ ] Secret key (starts with `sk_`)
- [ ] Restricted keys available

---

## What Stripe Needs to Send Money

**If YES to all above:** → Ready to automate
**If NO to some:** → Need manual setup first

### Option A: Stripe Financial Connections (Automated)
- Stripe can access Happen/EverBank/Synchrony
- Pull money automatically
- Send to Monzo
- **Requires:** Those banks pre-connected

### Option B: Manual Stripe Payout + Link
- You authorize each bank directly via Stripe Link
- Stripe initiates transfers
- **Requires:** Step-by-step user auth (slower)

### Option C: Back to Manual Bank Transfer
- You wire manually from each bank
- We log confirmations in Supabase
- **Requires:** You access each bank's dashboard

---

## Fastest Resolution

**Answer these two questions:**

1. **Go to https://dashboard.stripe.com/settings/connections — what do you see?**
   - Bank accounts listed? (which ones)
   - Empty/nothing?
   - Error or "not set up"?

2. **What's your Stripe account type:**
   - [ ] Personal (can't receive/send large transfers)
   - [ ] Business (can use Treasury & Financial Connections)
   - [ ] Connect platform (advanced)

---

**Once you check, tell me what you find and I'll tell you the exact next step.**
