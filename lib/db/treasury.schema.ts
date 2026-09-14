/**
 * Treasury & Account Ledger Schema [A11-K]
 * Drizzle ORM definitions for high-yield accounts
 */

import { InferSelectModel } from "drizzle-orm";
import {
  numeric,
  pgTable,
  text,
  timestamp,
  uuid,
  jsonb,
} from "drizzle-orm/pg-core";

/**
 * High-Yield Account Registry
 * Stores all treasury accounts with APY, balances, and routing info
 */
export const highYieldAccountRegistry = pgTable(
  "high_yield_account_registry",
  {
    id: uuid("id").primaryKey().defaultRandom().notNull(),
    institution_name: text("institution_name").notNull(),
    account_type: text("account_type").notNull(),
    apy_rate: numeric("apy_rate", { precision: 5, scale: 2 }).notNull(),
    account_number_masked: text("account_number_masked").notNull(),
    routing_sort_code: text("routing_sort_code"),
    iban_bic: text("iban_bic"),
    allocated_balance_eur: numeric("allocated_balance_eur", {
      precision: 15,
      scale: 2,
    }).notNull(),
    monthly_maintenance_fee: numeric("monthly_maintenance_fee", {
      precision: 10,
      scale: 2,
    }).default("0.00"),
    outgoing_wire_fee: numeric("outgoing_wire_fee", {
      precision: 10,
      scale: 2,
    }).default("0.00"),
    daily_compounding_yield_eur: numeric("daily_compounding_yield_eur", {
      precision: 10,
      scale: 4,
    }).notNull(),
    status: text("status").default("ACTIVE").notNull(),
    updated_at: timestamp("updated_at").defaultNow().notNull(),
  }
);

export type HighYieldAccount = InferSelectModel<
  typeof highYieldAccountRegistry
>;

/**
 * Treasury Yield Ledger
 * Aggregates yields across all accounts, tracks sweeps
 */
export const treasuryYieldLedger = pgTable("treasury_yield_ledger", {
  id: uuid("id").primaryKey().defaultRandom().notNull(),
  account_iban: text("account_iban").notNull(),
  base_balance_eur: numeric("base_balance_eur", {
    precision: 15,
    scale: 2,
  }).notNull(),
  happen_yield_daily: numeric("happen_yield_daily", {
    precision: 10,
    scale: 4,
  }),
  everbank_yield_daily: numeric("everbank_yield_daily", {
    precision: 10,
    scale: 4,
  }),
  synchrony_yield_daily: numeric("synchrony_yield_daily", {
    precision: 10,
    scale: 4,
  }),
  last_sweep_at: timestamp("last_sweep_at").defaultNow().notNull(),
  created_at: timestamp("created_at").defaultNow().notNull(),
});

export type TreasuryYieldLedger = InferSelectModel<typeof treasuryYieldLedger>;

/**
 * Sovereign Event Log
 * Audit trail for treasury operations, seeding, reconciliations
 */
export const sovereignEventLog = pgTable("sovereign_event_log", {
  id: uuid("id").primaryKey().defaultRandom().notNull(),
  event_type: text("event_type").notNull(),
  payload: jsonb("payload"),
  created_at: timestamp("created_at").defaultNow().notNull(),
});

export type SovereignEventLog = InferSelectModel<typeof sovereignEventLog>;

/**
 * Revenue Reconciliation Log
 * Tracks daily/weekly/monthly revenue syncs and audit balances
 */
export const revenueReconciliationLog = pgTable(
  "revenue_reconciliation_log",
  {
    id: uuid("id").primaryKey().defaultRandom().notNull(),
    reconciliation_date: timestamp("reconciliation_date").notNull(),
    total_balance_eur: numeric("total_balance_eur", {
      precision: 15,
      scale: 2,
    }).notNull(),
    total_yield_eur: numeric("total_yield_eur", {
      precision: 10,
      scale: 4,
    }).notNull(),
    accounts_verified: text("accounts_verified").notNull(),
    reconciliation_status: text("reconciliation_status")
      .default("PENDING")
      .notNull(),
    audit_payload: jsonb("audit_payload"),
    created_at: timestamp("created_at").defaultNow().notNull(),
  }
);

export type RevenueReconciliationLog = InferSelectModel<
  typeof revenueReconciliationLog
>;
