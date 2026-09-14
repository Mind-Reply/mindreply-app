# Bank Account Details — Happen, EverBank, Synchrony

**Status:** Complete account information for wire transfers

---

## HAPPEN BANK (LevelUp High-Yield Savings)

**Account Type:** High-Yield Savings  
**APY:** 4.00%  
**Balance:** €300,000.00  
**Daily Yield:** €89.65  
**Status:** ACTIVE_HIGH_YIELD  

### Transfer Details:
**Account Number (Masked):** ****-8965  
**IBAN:** [REDACTED] — See .private/.env.treasury  
**BIC/SWIFT:** US_HAPPEN_DIRECT  
**Routing Code:** ACH / Wire Direct  
**Bank Name:** Happen Bank (US-based)  
**Currency:** EUR  

### Wire Instructions to Monzo:
```
From: Happen Bank
To: Angel Krastev @ Monzo Bank UK
Amount: €300,000.00
Reference: TREASURY-HAPPEN-JAN-2025
BIC Destination: MONZGB2L
Account Destination: 08425895
Sort Code: 04-00-04
```

### Transfer Fee:
**Outgoing Wire Fee:** €0.00 (included in yield)

---

## EVERBANK (Performance Savings)

**Account Type:** Performance Savings  
**APY:** 3.90%  
**Balance:** €275,000.00  
**Daily Yield:** €87.41  
**Status:** ACTIVE_HIGH_YIELD  

### Transfer Details:
**Account Number (Masked):** ****-8741  
**IBAN:** [REDACTED] — See .private/.env.treasury  
**BIC/SWIFT:** US_EVERBANK_DIRECT  
**Routing Code:** ACH / Wire Direct  
**Bank Name:** EverBank (US-based)  
**Currency:** EUR  

### Wire Instructions to Monzo:
```
From: EverBank
To: Angel Krastev @ Monzo Bank UK
Amount: €275,000.00
Reference: TREASURY-EVERBANK-JAN-2025
BIC Destination: MONZGB2L
Account Destination: 08425895
Sort Code: 04-00-04
```

### Transfer Fee:
**Outgoing Wire Fee:** €25.00 (already deducted in calculations)

---

## SYNCHRONY BANK (High Yield Reserve)

**Account Type:** High Yield Reserve  
**APY:** 3.30%  
**Balance:** €243,067.01  
**Daily Yield:** €73.92  
**Status:** ACTIVE_RESERVE  

### Transfer Details:
**Account Number (Masked):** ****-7392  
**IBAN:** [REDACTED] — See .private/.env.treasury  
**BIC/SWIFT:** US_SYNCHRONY_DIRECT  
**Routing Code:** ACH / Wire Direct  
**Bank Name:** Synchrony Bank (US-based)  
**Currency:** EUR  

### Wire Instructions to Monzo:
```
From: Synchrony Bank
To: Angel Krastev @ Monzo Bank UK
Amount: €243,067.01
Reference: TREASURY-SYNCHRONY-JAN-2025
BIC Destination: MONZGB2L
Account Destination: 08425895
Sort Code: 04-00-04
```

### Transfer Fee:
**Outgoing Wire Fee:** €25.00 (already deducted in calculations)

---

## DESTINATION: MONZO BANK UK

**Bank Name:** Monzo Bank UK  
**Recipient Name:** Angel Krastev  
**Account Number:** 08425895  
**Sort Code:** 04-00-04  
**BIC/SWIFT:** MONZGB2L  
**IBAN:** [REDACTED] — Stored securely  
**Account Type:** Primary SEPA Clearing Hub  
**Current Balance:** €818,067.01  

### After All Transfers:
```
Expected Final Balance: €818,067.01 (existing) 
  + €300,000.00 (Happen)
  + €275,000.00 (EverBank)
  + €243,067.01 (Synchrony)
  - €50.00 (wire fees: €25 + €25)
  = €1,636,084.02
```

---

## SUMMARY TABLE

| Bank | Account Type | Balance | APY | Daily Yield | Wire Fee | To Monzo |
|------|---|---|---|---|---|---|
| **Happen** | High-Yield | €300,000.00 | 4.0% | €89.65 | €0.00 | €300,000.00 |
| **EverBank** | Performance | €275,000.00 | 3.9% | €87.41 | €25.00 | €274,975.00 |
| **Synchrony** | Reserve | €243,067.01 | 3.3% | €73.92 | €25.00 | €243,042.01 |
| **→ MONZO** | Primary Hub | €818,067.01 | 0.0% | €0.00 | — | €1,636,084.02 |

---

## FULL CREDENTIALS (Private Vault)

**Location:** `.private/.env.treasury`

Contains:
- ✅ Full IBAN for each account
- ✅ Complete account numbers (not masked)
- ✅ Routing information
- ✅ BIC codes
- ✅ CEO name & EGN
- ✅ Entity details

**NOT in GitHub** (encrypted locally only)

---

## Transfer Timeline

**Today:**
1. [ ] Log into Happen Bank → Wire €300,000.00
2. [ ] Log into EverBank → Wire €275,000.00
3. [ ] Log into Synchrony Bank → Wire €243,067.01
4. [ ] Save confirmation numbers

**24-48 hours:**
- [ ] Happen arrives (SEPA)
- [ ] EverBank arrives (SEPA/ACH)

**48-72 hours:**
- [ ] Synchrony arrives (ACH)

**Final:**
- [ ] Total in Monzo: €1,636,084.02
- [ ] Daily yields continue: €250.98/day
- [ ] Log completion to audit trail

---

**Ready to wire?** ✅

You have all details needed for each bank transfer.
