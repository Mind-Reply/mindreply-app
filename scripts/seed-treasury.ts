/**
 * Treasury Seed Runner [Public Version]
 * Safe TypeScript wrapper for seeding treasury accounts to Supabase
 * 
 * NOTE: All sensitive data (PII, balances, credentials) loaded from environment variables.
 * See .env.local (not committed to git) or GitHub Secrets (CI/CD).
 */

import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  throw new Error(
    "Missing SUPABASE credentials. Set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY"
  );
}

const supabase = createClient(supabaseUrl, supabaseKey);

interface TreasuryAccount {
  institution_name: string;
  account_type: string;
  apy_rate: number;
  account_number_masked: string;
  routing_sort_code: string;
  iban_bic: string;
  allocated_balance_eur: number;
  monthly_maintenance_fee: number;
  outgoing_wire_fee: number;
  daily_compounding_yield_eur: number;
  status: string;
}

/**
 * Load treasury accounts from environment
 * Structure allows multiple accounts with flexible APY rates
 */
function loadTreasuryAccounts(): TreasuryAccount[] {
  const accountsJson = process.env.TREASURY_ACCOUNTS;
  if (!accountsJson) {
    console.warn(
      "⚠️  TREASURY_ACCOUNTS not in environment. Using empty array."
    );
    return [];
  }

  try {
    return JSON.parse(accountsJson);
  } catch (err) {
    throw new Error(
      `Failed to parse TREASURY_ACCOUNTS JSON: ${(err as Error).message}`
    );
  }
}

async function seedTreasury() {
  console.log("🌱 Seeding Treasury Accounts...");

  const treasuryAccounts = loadTreasuryAccounts();

  if (treasuryAccounts.length === 0) {
    console.warn(
      "⚠️  No accounts to seed. Set TREASURY_ACCOUNTS environment variable."
    );
    return;
  }

  try {
    // 1. Insert Treasury Accounts
    const { error: insertError } = await supabase
      .from("high_yield_account_registry")
      .insert(treasuryAccounts);

    if (insertError) {
      console.error("❌ Insert error:", insertError);
      throw insertError;
    }

    console.log(`✅ Inserted ${treasuryAccounts.length} treasury accounts`);

    // 2. Create Treasury Yield Ledger Entry
    const totalDailyYield = treasuryAccounts.reduce(
      (sum, acc) => sum + acc.daily_compounding_yield_eur,
      0
    );
    const totalBalance = treasuryAccounts.reduce(
      (sum, acc) => sum + acc.allocated_balance_eur,
      0
    );

    const { error: ledgerError } = await supabase
      .from("treasury_yield_ledger")
      .insert({
        account_iban: process.env.PRIMARY_IBAN || "PRIMARY_HUB",
        base_balance_eur: totalBalance,
        happen_yield_daily:
          treasuryAccounts.find((a) => a.institution_name.includes("Happen"))
            ?.daily_compounding_yield_eur || 0,
        everbank_yield_daily:
          treasuryAccounts.find((a) => a.institution_name.includes("Ever"))
            ?.daily_compounding_yield_eur || 0,
        synchrony_yield_daily:
          treasuryAccounts.find((a) => a.institution_name.includes("Synchrony"))
            ?.daily_compounding_yield_eur || 0,
        last_sweep_at: new Date().toISOString(),
      });

    if (ledgerError) {
      console.error("❌ Ledger error:", ledgerError);
      throw ledgerError;
    }

    console.log("✅ Created Treasury Yield Ledger entry");

    // 3. Log Audit Event
    const auditPayload = {
      entity: process.env.ENTITY_NAME || "Entity",
      ceo_anchor: process.env.CEO_NAME || "Anchor",
      total_base_eur: totalBalance,
      clearing_iban: process.env.PRIMARY_IBAN || "PRIMARY_HUB",
      accounts_seeded: treasuryAccounts.length,
      total_daily_yield_eur: totalDailyYield,
      timestamp: new Date().toISOString(),
    };

    const { error: auditError } = await supabase
      .from("sovereign_event_log")
      .insert({
        event_type: "TREASURY_ACCOUNTS_SEEDED",
        payload: auditPayload,
      });

    if (auditError) {
      console.error("❌ Audit error:", auditError);
      throw auditError;
    }

    console.log("✅ Logged audit event to sovereign_event_log");

    // 4. Verify Seed
    const { data: verify, error: verifyError } = await supabase
      .from("high_yield_account_registry")
      .select("*", { count: "exact" });

    if (verifyError) {
      console.error("❌ Verify error:", verifyError);
      throw verifyError;
    }

    console.log("\n📊 Seed Summary:");
    console.log(`   Total Accounts: ${treasuryAccounts.length}`);
    console.log(`   Total Balance: €${totalBalance.toFixed(2)}`);
    console.log(`   Daily Yield: €${totalDailyYield.toFixed(2)}`);
    console.log(`   Monthly Yield (est.): €${(totalDailyYield * 30).toFixed(2)}`);
    console.log(
      `   Annual Yield (est.): €${(totalDailyYield * 365).toFixed(2)}`
    );
    console.log("\n✅ Treasury seed complete!");
  } catch (error) {
    console.error("❌ Seed failed:", error);
    process.exit(1);
  }
}

// Run if called directly
if (require.main === module) {
  seedTreasury();
}

export { seedTreasury, TreasuryAccount };
