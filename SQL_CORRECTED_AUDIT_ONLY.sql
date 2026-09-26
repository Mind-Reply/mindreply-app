-- ============================================================================
-- TREASURY CONSOLIDATION — AUDIT-ONLY APPROACH (CORRECTED)
-- Tables verified to exist in Supabase:
-- ✅ public.a11_api_events (use for transfers)
-- ✅ public.a11_notifications (use for alerts)
-- ❌ public.sovereign_event_log (does NOT exist)
-- ❌ public.high_yield_account_registry (does NOT exist)
-- ============================================================================

-- PHASE 1: Log transfer initiation (SAFE - uses existing table)
-- Execute TODAY after you send transfers from banks

INSERT INTO public.a11_api_events (event_type, payload)
VALUES 
(
  'WIRE_TRANSFER_INITIATED',
  jsonb_build_object(
    'transaction_id', 'TREASURY-HAPPEN-JAN-2025',
    'from_institution', 'Happen Bank',
    'to_institution', 'Monzo Bank UK',
    'amount_eur', 300000.00,
    'status', 'INITIATED',
    'initiated_at', NOW(),
    'recipient', 'Angel Krastev'
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
    'initiated_at', NOW(),
    'recipient', 'Angel Krastev'
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
    'initiated_at', NOW(),
    'recipient', 'Angel Krastev'
  )
);

-- Verify Phase 1
SELECT event_type, payload->>'transaction_id' as txn_id, payload->>'amount_eur' as amount 
FROM public.a11_api_events 
WHERE event_type = 'WIRE_TRANSFER_INITIATED' 
ORDER BY created_at DESC LIMIT 3;

-- ============================================================================
-- ALERT: Amount discrepancy detected
-- ============================================================================

INSERT INTO public.a11_notifications 
  (title, message, severity)
VALUES (
  'Treasury consolidation requires verification',
  'Three listed transfers total EUR 818,067.01, but the reported consolidation total is EUR 1,636,134.02 (exactly double). No transfer or arrival has been verified. Database record only; no account registry exists yet.',
  'critical'
);

-- ============================================================================
-- PHASE 2: Record consolidation (AFTER money arrives - 24-72 hours)
-- SAFE: Audit-only, does NOT update non-existent tables
-- WARNS: about the amount mismatch
-- ============================================================================

INSERT INTO public.a11_api_events (event_type, payload)
VALUES (
  'TREASURY_CONSOLIDATION_REPORTED',
  jsonb_build_object(
    'reported_at', NOW(),
    'listed_transfer_total_eur', 818067.01,
    'reported_consolidation_total_eur', 1636134.02,
    'discrepancy_eur', 818067.01,
    'discrepancy_pct', 100.0,
    'source_accounts', 3,
    'destination', 'Monzo Bank UK',
    'recipient', 'Angel Krastev',
    'status', 'REQUIRES_VERIFICATION',
    'note', 'Database record only; no bank transfer verified. Amount mismatch: listed transfers are EUR 818,067.01 but consolidation total claimed EUR 1,636,134.02 (exactly 2x)'
  )
);

-- ============================================================================
-- INVESTIGATION QUESTIONS (Answer these before proceeding)
-- ============================================================================

-- Q1: Is there an existing balance in Monzo of €818,067.01?
-- Q2: Where does the second €818,067.01 come from?
-- Q3: Is there another account/transfer not listed?
-- Q4: Should the consolidation total be €818,067.01 (single transfer) or €1,636,134.02 (if there's existing + new)?

-- ============================================================================
-- DO NOT RUN until discrepancy is resolved:
-- ============================================================================
-- 
-- ❌ BLOCKED: UPDATE high_yield_account_registry (table doesn't exist)
-- ❌ BLOCKED: INSERT INTO sovereign_event_log (table doesn't exist)
-- 
-- WHEN tables are created and amounts verified, new SQL will be:
-- 1) Create table: public.high_yield_account_registry
-- 2) Create table: public.sovereign_event_log
-- 3) Verify transfer amounts match Monzo receipt
-- 4) Update balances only after verification
-- ============================================================================
