/**
 * Treasury Seed Runner [A11-K]
 * Safe TypeScript wrapper for seeding high-yield accounts to Supabase
 * ENTITY: Sofia Tech Register EOOD / CEO A.K.
 */

import { createClient } from "@supabase/supabase-js";
import fs from "fs";
import path from "path";

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

const treasuryAccounts: TreasuryAccount[] = [
  {
    institution_name: "Monzo Bank UK",
    account_type: "Primary SEPA Clearing Hub",
    apy_rate: 0.0,
    account_number_masked: "08425895",
    routing_sort_code: "04-00-04",
    iban_bic: "MONZGB2L",
    allocated_balance_eur: 818067.01,
    monthly_maintenance_fee: 0.0,
    outgoing_wire_fee: 0.0,
    daily_compounding_yield_eur: 0.0,
    status: "ACTIVE_PRIMARY_CLEARING",
  },
  {
    institution_name: "Happen Bank",
    account_type: "LevelUp High-Yield Savings",
    apy_rate: 4.0,
    account_number_masked: "****-8965",
    routing_sort_code: "ACH / Wire Direct",
    iban_bic: "US_HAPPEN_DIRECT",
    allocated_balance_eur: 300000.0,
    monthly_maintenance_fee: 0.0,
    outgoing_wire_fee: 0.0,
    daily_compounding_yield_eur: 89.65,
    status: "ACTIVE_HIGH_YIELD",
  },
  {
    institution_name: "EverBank",
    account_type: "Performance Savings",
    apy_rate: 3.9,
    account_number_masked: "****-8741",
    routing_sort_code: "ACH / Wire Direct",
    iban_bic: "US_EVERBANK_DIRECT",
    allocated_balance_eur: 275000.0,
    monthly_maintenance_fee: 0.0,
    outgoing_wire_fee: 25.0,
    daily_compounding_yield_eur: 87.41,
    status: "ACTIVE_HIGH_YIELD",
  },
  {
    institution_name: "Synchrony Bank",
    account_type: "High Yield Reserve",
    apy_rate: 3.3,
    account_number_masked: "****-7392",
    routing_sort_code: "ACH / Wire Direct",
    iban_bic: "US_SYNCHRONY_DIRECT",
    allocated_balance_eur: 243067.01,
    monthly_maintenance_fee: 0.0,
    outgoing_wire_fee: 25.0,
    daily_compounding_yield_eur: 73.92,
    status: "ACTIVE_RESERVE",
  },
];

async function seedTreasury() {
  console.log("🌱 Seeding Treasury Accounts...");

  try {
    // 1. Insert Treasury Accounts
    const { data: inserted, error: insertError } = await supabase
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
        account_iban: "MONZGB2L-SEPA-HUB",
        base_balance_eur: totalBalance,
        happen_yield_daily: 89.65,
        everbank_yield_daily: 87.41,
        synchrony_yield_daily: 73.92,
        last_sweep_at: new Date().toISOString(),
      });

    if (ledgerError) {
      console.error("❌ Ledger error:", ledgerError);
      throw ledgerError;
    }

    console.log("✅ Created Treasury Yield Ledger entry");

    // 3. Log Audit Event
    const auditPayload = {
      ceo_anchor: "Angel Lyubomirov Krastev",
      egn_seed: "9704106749",
      entity: "Sofia Tech Register EOOD",
      total_base_eur: totalBalance,
      clearing_iban: "MONZGB2L-SEPA-HUB",
      accounts_seeded: treasuryAccounts.length,
      happen_apy: 4.0,
      everbank_apy: 3.9,
      synchrony_apy: 3.3,
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
      .select("count", { count: "exact" });

    if (verifyError) {
      console.error("❌ Verify error:", verifyError);
      throw verifyError;
    }

    console.log("\n📊 Seed Summary:");
    console.log(`   Total Accounts: ${treasuryAccounts.length}`);
    console.log(`   Total Balance: €${totalBalance.toFixed(2)}`);
    console.log(`   Daily Yield: €${totalDailyYield.toFixed(2)}`);
    console.log(`   Monthly Yield (est.): €${(totalDailyYield * 30).toFixed(2)}`);
    console.log(`   Annual Yield (est.): €${(totalDailyYield * 365).toFixed(2)}`);
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
