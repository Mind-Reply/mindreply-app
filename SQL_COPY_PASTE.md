# SQL Logging — Copy & Paste Ready

**Status:** ✅ Ready to execute in Supabase Studio

---

## PHASE 1: After You Send Transfers (TODAY)

**Go to:** https://app.supabase.com/project/aziwdgndohdgnwztpwdi/sql

**Copy this entire block and paste into SQL Editor:**

```sql
-- Log all three transfer initiations
INSERT INTO sovereign_event_log (event_type, payload)
VALUES 
(
  'WIRE_TRANSFER_INITIATED',
  jsonb_build_object(
    'transaction_id', 'TREASURY-HAPPEN-JAN-2025',
    'from_institution', 'Happen Bank',
    'to_institution', 'Monzo Bank UK',
    'amount_eur', 300000.00,
    'status', 'INITIATED',
    'initiated_at', NOW()
  )
),
(
  'WIRE_TRANSFER_INITIATED',
  jsonb_build_object(
    'transaction_id', 'TREASURY-EVERBANK-JAN-2025',
    'from_institution', 'EverBank',
    'to_institution', 'Monzo Bank UK',
    'amount_eur', 275000.00,
    'status', 'INITIATED',
    'initiated_at', NOW()
  )
),
(
  'WIRE_TRANSFER_INITIATED',
  jsonb_build_object(
    'transaction_id', 'TREASURY-SYNCHRONY-JAN-2025',
    'from_institution', 'Synchrony Bank',
    'to_institution', 'Monzo Bank UK',
    'amount_eur', 243067.01,
    'status', 'INITIATED',
    'initiated_at', NOW()
  )
);
```

**Then run this verification:**

```sql
SELECT event_type, payload->>'transaction_id' as txn, payload->>'amount_eur' as amount 
FROM sovereign_event_log 
WHERE event_type = 'WIRE_TRANSFER_INITIATED' 
ORDER BY created_at DESC LIMIT 3;
```

**Expected result:** 3 rows with transaction IDs:
- TREASURY-HAPPEN-JAN-2025
- TREASURY-EVERBANK-JAN-2025
- TREASURY-SYNCHRONY-JAN-2025

---

## PHASE 2: After Money Arrives in Monzo (24-72 hours later)

**Go to:** https://app.supabase.com/project/aziwdgndohdgnwztpwdi/sql

**Copy and execute:**

```sql
-- Update balances
UPDATE high_yield_account_registry 
SET allocated_balance_eur = 1636134.02
WHERE institution_name = 'Monzo Bank UK';

UPDATE high_yield_account_registry 
SET allocated_balance_eur = 0.00
WHERE institution_name IN ('Happen Bank', 'EverBank', 'Synchrony Bank');

-- Log consolidation complete
INSERT INTO sovereign_event_log (event_type, payload)
VALUES (
  'TREASURY_CONSOLIDATION_COMPLETE',
  jsonb_build_object(
    'total_consolidated_eur', 1636134.02,
    'destination', 'Monzo Bank UK',
    'status', 'CONSOLIDATED',
    'completed_at', NOW()
  )
);
```

**Verify final state:**

```sql
SELECT institution_name, allocated_balance_eur 
FROM high_yield_account_registry 
ORDER BY allocated_balance_eur DESC;
```

**Expected result:**
```
Monzo Bank UK        | 1636134.02
Happen Bank          | 0.00
EverBank             | 0.00
Synchrony Bank       | 0.00
```

---

## Summary

| Phase | When | Action |
|-------|------|--------|
| **1** | TODAY (after transfers sent) | Paste Phase 1 SQL → Execute |
| **2** | In 24-72 hours (after $ arrives) | Paste Phase 2 SQL → Execute |

**Full SQL file:** `SQL_LOGGING_READY.sql` in repo

---

Done! ✅
