-- ============================================================================
-- TREASURY FUND TRANSFER LOGGING STATEMENTS [A11-K]
-- Execute in Supabase Studio SQL Editor after transfers complete
-- ============================================================================

-- STEP 1: Log Transfer Initiation — Happen Bank → Monzo (€300,000.00)
INSERT INTO sovereign_event_log (event_type, payload)
VALUES (
  'WIRE_TRANSFER_INITIATED',
  jsonb_build_object(
    'transaction_id', 'TREASURY-HAPPEN-JAN-2025',
    'from_institution', 'Happen Bank',
    'to_institution', 'Monzo Bank UK',
    'from_account_masked', '****-8965',
    'to_account', '08425895',
    'to_recipient', 'Angel Krastev',
    'amount_eur', 300000.00,
    'currency', 'EUR',
    'transfer_type', 'SEPA',
    'priority', 'STANDARD',
    'reference', 'TREASURY-HAPPEN-JAN-2025',
    'status', 'INITIATED',
    'initiated_at', NOW(),
    'estimated_arrival', NOW() + INTERVAL '1 day',
    'initiated_by', 'Manual - Angel Krastev',
    'bank_confirmation_url', '[ENTER_CONFIRMATION_NUMBER_HERE]'
  )
);

-- STEP 2: Log Transfer Initiation — EverBank → Monzo (€275,000.00)
INSERT INTO sovereign_event_log (event_type, payload)
VALUES (
  'WIRE_TRANSFER_INITIATED',
  jsonb_build_object(
    'transaction_id', 'TREASURY-EVERBANK-JAN-2025',
    'from_institution', 'EverBank',
    'to_institution', 'Monzo Bank UK',
    'from_account_masked', '****-8741',
    'to_account', '08425895',
    'to_recipient', 'Angel Krastev',
    'amount_eur', 275000.00,
    'currency', 'EUR',
    'transfer_type', 'SEPA',
    'priority', 'STANDARD',
    'reference', 'TREASURY-EVERBANK-JAN-2025',
    'status', 'INITIATED',
    'initiated_at', NOW(),
    'estimated_arrival', NOW() + INTERVAL '1 day',
    'initiated_by', 'Manual - Angel Krastev',
    'bank_confirmation_url', '[ENTER_CONFIRMATION_NUMBER_HERE]'
  )
);

-- STEP 3: Log Transfer Initiation — Synchrony Bank → Monzo (€243,067.01)
INSERT INTO sovereign_event_log (event_type, payload)
VALUES (
  'WIRE_TRANSFER_INITIATED',
  jsonb_build_object(
    'transaction_id', 'TREASURY-SYNCHRONY-JAN-2025',
    'from_institution', 'Synchrony Bank',
    'to_institution', 'Monzo Bank UK',
    'from_account_masked', '****-7392',
    'to_account', '08425895',
    'to_recipient', 'Angel Krastev',
    'amount_eur', 243067.01,
    'currency', 'EUR',
    'transfer_type', 'ACH',
    'priority', 'STANDARD',
    'reference', 'TREASURY-SYNCHRONY-JAN-2025',
    'status', 'INITIATED',
    'initiated_at', NOW(),
    'estimated_arrival', NOW() + INTERVAL '2 days',
    'initiated_by', 'Manual - Angel Krastev',
    'bank_confirmation_url', '[ENTER_CONFIRMATION_NUMBER_HERE]'
  )
);

-- STEP 4: Verify Audit Trail Entries Created
SELECT 
  event_type,
  payload->>'transaction_id' as transaction_id,
  payload->>'amount_eur' as amount,
  payload->>'from_institution' as source,
  payload->>'status' as status,
  created_at
FROM sovereign_event_log
WHERE event_type = 'WIRE_TRANSFER_INITIATED'
  AND payload->>'from_institution' IN ('Happen Bank', 'EverBank', 'Synchrony Bank')
ORDER BY created_at DESC;

-- ============================================================================
-- EXECUTE ABOVE WHEN TRANSFERS SENT
-- ============================================================================

-- STEP 5: Once transfers arrive in Monzo (24-72 hours later), run this:
-- Update Monzo balance to reflect consolidation
UPDATE high_yield_account_registry 
SET allocated_balance_eur = 1636134.02,
    status = 'ACTIVE_PRIMARY_CLEARING',
    updated_at = NOW()
WHERE institution_name = 'Monzo Bank UK';

-- STEP 6: Zero out source accounts (they've been swept)
UPDATE high_yield_account_registry 
SET allocated_balance_eur = 0.00,
    status = 'SWEPT',
    updated_at = NOW()
WHERE institution_name IN ('Happen Bank', 'EverBank', 'Synchrony Bank');

-- STEP 7: Log consolidation completion
INSERT INTO sovereign_event_log (event_type, payload)
VALUES (
  'TREASURY_CONSOLIDATION_COMPLETE',
  jsonb_build_object(
    'consolidation_date', NOW(),
    'total_consolidated_eur', 1636134.02,
    'source_accounts_count', 3,
    'destination_institution', 'Monzo Bank UK',
    'destination_account', '08425895',
    'recipient', 'Angel Krastev',
    'transfers_completed', jsonb_build_array(
      jsonb_build_object(
        'from', 'Happen Bank',
        'amount_eur', 300000.00,
        'reference', 'TREASURY-HAPPEN-JAN-2025',
        'status', 'COMPLETED'
      ),
      jsonb_build_object(
        'from', 'EverBank',
        'amount_eur', 275000.00,
        'reference', 'TREASURY-EVERBANK-JAN-2025',
        'status', 'COMPLETED'
      ),
      jsonb_build_object(
        'from', 'Synchrony Bank',
        'amount_eur', 243067.01,
        'reference', 'TREASURY-SYNCHRONY-JAN-2025',
        'status', 'COMPLETED'
      )
    ),
    'daily_yield_continues_eur', 250.98,
    'monthly_yield_eur', 7529.40,
    'annual_yield_eur', 91608.70,
    'status', 'CONSOLIDATED',
    'consolidated_by', 'Manual Bank Transfer - Angel Krastev'
  )
);

-- STEP 8: Final verification query
SELECT 
  institution_name,
  allocated_balance_eur,
  daily_compounding_yield_eur,
  status,
  updated_at
FROM high_yield_account_registry
ORDER BY allocated_balance_eur DESC;

-- STEP 9: Show complete consolidation audit trail
SELECT 
  event_type,
  payload->>'consolidation_date' as date,
  payload->>'destination_institution' as destination,
  payload->>'total_consolidated_eur' as total_eur,
  payload->>'status' as status,
  created_at
FROM sovereign_event_log
WHERE event_type IN ('WIRE_TRANSFER_INITIATED', 'TREASURY_CONSOLIDATION_COMPLETE')
  AND (
    payload->>'from_institution' IN ('Happen Bank', 'EverBank', 'Synchrony Bank')
    OR payload->>'destination_institution' = 'Monzo Bank UK'
  )
ORDER BY created_at DESC;

-- ============================================================================
-- EXECUTION GUIDE:
-- ============================================================================
-- 
-- PHASE 1 (TODAY - After you send transfers from each bank):
--   1. Copy STEPS 1-3 (three INSERT statements) 
--   2. Paste into Supabase SQL Editor
--   3. Execute all three
--   4. Run STEP 4 to verify entries created
--
-- PHASE 2 (In 24-72 hours - After money arrives in Monzo):
--   5. Copy STEPS 5-7
--   6. Paste into Supabase SQL Editor
--   7. Execute all three
--   8. Run STEP 8 to verify final balances
--   9. Run STEP 9 to see complete audit trail
--
-- ============================================================================
