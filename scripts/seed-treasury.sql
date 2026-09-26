-- ==============================================================================
-- SEED HIGH-YIELD TREASURY & ACCOUNT LEDGER SCRIPT [A11-K]
-- ENTITY: Sofia Tech Register EOOD / CEO A.K. (Angel Lyubomirov Krastev)
-- PURPOSE: Seeds high-yield accounts, APY benchmarks, routing metadata, 
--          and initial redenominated EUR balances into Supabase Postgres.
-- ==============================================================================

-- 1. Ensure Table Structure
CREATE TABLE IF NOT EXISTS public.high_yield_account_registry (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    institution_name TEXT NOT NULL,
    account_type TEXT NOT NULL,
    apy_rate NUMERIC(5,2) NOT NULL,
    account_number_masked TEXT NOT NULL,
    routing_sort_code TEXT,
    iban_bic TEXT,
    allocated_balance_eur NUMERIC(15,2) NOT NULL,
    monthly_maintenance_fee NUMERIC(10,2) DEFAULT 0.00,
    outgoing_wire_fee NUMERIC(10,2) DEFAULT 0.00,
    daily_compounding_yield_eur NUMERIC(10,4) NOT NULL,
    status TEXT DEFAULT 'ACTIVE',
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Insert Core Treasury & High-Yield Accounts
INSERT INTO public.high_yield_account_registry (
    institution_name,
    account_type,
    apy_rate,
    account_number_masked,
    routing_sort_code,
    iban_bic,
    allocated_balance_eur,
    monthly_maintenance_fee,
    outgoing_wire_fee,
    daily_compounding_yield_eur,
    status
) VALUES 
(
    'Monzo Bank UK',
    'Primary SEPA Clearing Hub',
    0.00,
    '08425895',
    '04-00-04',
    'MONZGB2L',
    818067.01,
    0.00,
    0.00,
    0.0000,
    'ACTIVE_PRIMARY_CLEARING'
),
(
    'Happen Bank',
    'LevelUp High-Yield Savings',
    4.00,
    '****-8965',
    'ACH / Wire Direct',
    'US_HAPPEN_DIRECT',
    300000.00,
    0.00,
    0.00,
    89.6500,
    'ACTIVE_HIGH_YIELD'
),
(
    'EverBank',
    'Performance Savings',
    3.90,
    '****-8741',
    'ACH / Wire Direct',
    'US_EVERBANK_DIRECT',
    275000.00,
    0.00,
    25.00,
    87.4100,
    'ACTIVE_HIGH_YIELD'
),
(
    'Synchrony Bank',
    'High Yield Reserve',
    3.30,
    '****-7392',
    'ACH / Wire Direct',
    'US_SYNCHRONY_DIRECT',
    243067.01,
    0.00,
    25.00,
    73.9200,
    'ACTIVE_RESERVE'
)
ON CONFLICT (id) DO NOTHING;

-- 3. Create Treasury Yield Ledger Table (if not exists)
CREATE TABLE IF NOT EXISTS public.treasury_yield_ledger (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    account_iban TEXT NOT NULL,
    base_balance_eur NUMERIC(15,2) NOT NULL,
    happen_yield_daily NUMERIC(10,4),
    everbank_yield_daily NUMERIC(10,4),
    synchrony_yield_daily NUMERIC(10,4),
    last_sweep_at TIMESTAMPTZ DEFAULT NOW(),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Insert Master Treasury Yield Ledger Row
INSERT INTO public.treasury_yield_ledger (
    account_iban,
    base_balance_eur,
    happen_yield_daily,
    everbank_yield_daily,
    synchrony_yield_daily,
    last_sweep_at
) VALUES (
    'MONZGB2L-SEPA-HUB',
    818067.01,
    89.6500,
    87.4100,
    73.9200,
    NOW()
)
ON CONFLICT (id) DO NOTHING;

-- 5. Create Sovereign Audit Log Table (if not exists)
CREATE TABLE IF NOT EXISTS public.sovereign_event_log (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    event_type TEXT NOT NULL,
    payload JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. Log Seed Event to Sovereign Audit Ledger
INSERT INTO public.sovereign_event_log (event_type, payload)
VALUES (
    'TREASURY_ACCOUNTS_SEEDED',
    jsonb_build_object(
        'ceo_anchor', 'Angel Lyubomirov Krastev',
        'egn_seed', '9704106749',
        'entity', 'Sofia Tech Register EOOD',
        'total_base_eur', 818067.01,
        'clearing_iban', 'MONZGB2L-SEPA-HUB',
        'accounts_seeded', 4,
        'happen_apy', 4.00,
        'everbank_apy', 3.90,
        'synchrony_apy', 3.30,
        'total_daily_yield_eur', 250.98,
        'timestamp', NOW()
    )
);

-- 7. Verify Seed Success
SELECT COUNT(*) as account_count FROM public.high_yield_account_registry;
SELECT SUM(allocated_balance_eur) as total_balance_eur FROM public.high_yield_account_registry;
SELECT SUM(daily_compounding_yield_eur) as total_daily_yield FROM public.high_yield_account_registry;
