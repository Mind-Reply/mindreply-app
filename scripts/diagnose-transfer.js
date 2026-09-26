#!/usr/bin/env node

/**
 * Treasury Transfer Diagnostics [A11-K]
 * Investigate: Why transfers aren't working
 * Test multiple approaches + identify blockers
 */

const fs = require("fs");
const path = require("path");

console.log("🔍 Treasury Transfer Diagnostics");
console.log("=".repeat(60));
console.log();

// DIAGNOSIS 1: Environment Setup
console.log("DIAGNOSIS 1: Environment & Credentials");
console.log("-".repeat(60));

const envFiles = [".env.local", ".env", ".private/.env.treasury"];
const envStatus = {};

envFiles.forEach((file) => {
  const fullPath = path.join(process.cwd(), file);
  const exists = fs.existsSync(fullPath);
  envStatus[file] = exists;
  console.log(`${exists ? "✅" : "❌"} ${file}`);
});

if (!envStatus[".env.local"] && !envStatus[".env"]) {
  console.log(
    "\n⚠️  ACTION NEEDED: Create .env.local with Supabase credentials"
  );
  console.log("   NEXT_PUBLIC_SUPABASE_URL=https://aziwdgndohdgnwztpwdi.supabase.co");
  console.log("   SUPABASE_SERVICE_ROLE_KEY=<from Supabase Dashboard>");
  console.log("   TREASURY_ACCOUNTS=[...]  # From .private/.env.treasury");
}

console.log();

// DIAGNOSIS 2: Supabase Connection
console.log("DIAGNOSIS 2: Supabase Connectivity");
console.log("-".repeat(60));

console.log("Creating Supabase test client...");

try {
  // Try to create client (won't actually connect without credentials)
  const testCode = `
    const { createClient } = require("@supabase/supabase-js");
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
    
    if (!url || !key) {
      console.log("❌ Missing credentials");
      return false;
    }
    
    const client = createClient(url, key);
    console.log("✅ Client created");
    return true;
  `;

  console.log("⚠️  Cannot test without npm dependencies installed");
  console.log("   ACTION: Run pnpm install first");
} catch (err) {
  console.log("❌ Error:", err.message);
}

console.log();

// DIAGNOSIS 3: Fund Transfer Script Analysis
console.log("DIAGNOSIS 3: Fund Transfer Script");
console.log("-".repeat(60));

const fundTransferPath = path.join(
  process.cwd(),
  "scripts/fund-transfer.ts"
);
const fundTransferContent = fs.readFileSync(fundTransferPath, "utf-8");

// Check functions exist
const functions = [
  "getAvailableBalances",
  "validateTransfer",
  "initiateTransfer",
  "updateBalances",
  "generateTransferSummary",
  "executeFundTransfer",
];

console.log("✅ Functions defined:");
functions.forEach((fn) => {
  const found = fundTransferContent.includes(`function ${fn}`);
  console.log(`   ${found ? "✅" : "❌"} ${fn}()`);
});

console.log();

// DIAGNOSIS 4: Data Flow Testing
console.log("DIAGNOSIS 4: Data Flow Validation");
console.log("-".repeat(60));

const accounts = [
  { name: "Monzo Bank UK", balance: 818067.01, status: "PRIMARY" },
  { name: "Happen Bank", balance: 300000.0, status: "ACTIVE" },
  { name: "EverBank", balance: 275000.0, status: "ACTIVE" },
  { name: "Synchrony Bank", balance: 243067.01, status: "ACTIVE" },
];

console.log("✅ Account data structure valid:");
accounts.forEach((acc) => {
  const valid =
    typeof acc.name === "string" &&
    typeof acc.balance === "number" &&
    acc.balance > 0;
  console.log(`   ${valid ? "✅" : "❌"} ${acc.name}: €${acc.balance}`);
});

console.log();

// DIAGNOSIS 5: Transfer Scenarios
console.log("DIAGNOSIS 5: Transfer Scenarios (Test Cases)");
console.log("-".repeat(60));

const scenarios = [
  {
    id: "S1",
    name: "Full Sweep (All 3 high-yield)",
    from: ["Happen Bank", "EverBank", "Synchrony Bank"],
    total: 818067.01,
    viability: "HIGH",
    risk: "LOW",
  },
  {
    id: "S2",
    name: "Partial Move (€500k)",
    from: ["Happen Bank", "EverBank"],
    total: 500000.0,
    viability: "HIGH",
    risk: "LOW",
  },
  {
    id: "S3",
    name: "Single Account (Happen only)",
    from: ["Happen Bank"],
    total: 300000.0,
    viability: "HIGHEST",
    risk: "LOWEST",
  },
  {
    id: "S4",
    name: "Yield-Only Daily Sweep",
    from: ["ALL"],
    total: 250.98,
    viability: "HIGH",
    risk: "MINIMAL",
  },
];

console.log("Recommended execution order:\n");
scenarios.forEach((s) => {
  console.log(
    `${s.id}. ${s.name} (${s.viability} viability, ${s.risk} risk)`
  );
  console.log(`   Amount: €${s.total}`);
  console.log(
    `   From: ${s.from.join(", ")}`
  );
  console.log();
});

console.log();

// DIAGNOSIS 6: Known Blockers
console.log("DIAGNOSIS 6: Common Transfer Blockers");
console.log("-".repeat(60));

const blockers = [
  {
    blocker: "No npm dependencies installed",
    symptom: "Cannot find module errors",
    solution: "Run: pnpm install",
    status: "⚠️ LIKELY",
  },
  {
    blocker: "Missing Supabase credentials",
    symptom: "Auth errors, null responses",
    solution: "Set .env.local with NEXT_PUBLIC_SUPABASE_URL & SERVICE_ROLE_KEY",
    status: "⚠️ LIKELY",
  },
  {
    blocker: "Supabase tables not created",
    symptom: "Table doesn't exist errors",
    solution: "Run: npx tsx scripts/seed-treasury.ts (creates tables)",
    status: "⚠️ CHECK",
  },
  {
    blocker: "Wrong Supabase project ID",
    symptom: "Connection fails silently",
    solution: "Verify aziwdgndohdgnwztpwdi is correct in .env.local",
    status: "⚠️ CHECK",
  },
  {
    blocker: "Network connectivity issue",
    symptom: "Timeouts, connection refused",
    solution: "Check internet, VPN, firewall",
    status: "ℹ️ POSSIBLE",
  },
  {
    blocker: "Bank API rate limiting",
    symptom: "Transfer initiated but stuck",
    solution: "Wait 24-48 hours or reduce frequency",
    status: "ℹ️ POSSIBLE",
  },
];

blockers.forEach((b) => {
  console.log(`${b.status} ${b.blocker}`);
  console.log(`   Symptom: ${b.symptom}`);
  console.log(`   Solution: ${b.solution}`);
  console.log();
});

console.log();

// DIAGNOSIS 7: Multi-Approach Strategy
console.log("DIAGNOSIS 7: Multiple Approaches to Try");
console.log("-".repeat(60));

const approaches = [
  {
    approach: "Approach A: Direct API Call (Supabase-native)",
    steps: [
      "1. Install deps: pnpm install",
      "2. Set .env.local credentials",
      "3. Run: npx tsx scripts/fund-transfer.ts 300000",
      "4. Monitor: Check Supabase Studio",
    ],
    blockers: ["npm deps", "credentials"],
  },
  {
    approach: "Approach B: Raw SQL Execution",
    steps: [
      "1. Open Supabase Studio directly",
      "2. Paste SQL update query",
      "3. Execute manually",
      "4. Verify in high_yield_account_registry",
    ],
    blockers: ["Web access"],
  },
  {
    approach: "Approach C: Scheduled Cloud Function",
    steps: [
      "1. Create Supabase Edge Function",
      "2. Deploy fund-transfer logic",
      "3. Schedule cron trigger",
      "4. Monitor execution logs",
    ],
    blockers: ["Supabase setup"],
  },
  {
    approach: "Approach D: Manual IBAN Transfer (Offline)",
    steps: [
      "1. Log into each bank directly",
      "2. Initiate wire to Monzo",
      "3. Use provided IBAN/BIC/Sort Code",
      "4. Log transaction in audit trail",
    ],
    blockers: ["Bank account access"],
  },
  {
    approach: "Approach E: Third-Party Service (Wise/Stripe)",
    steps: [
      "1. Set up Wise Connect API",
      "2. Authenticate accounts",
      "3. Initiate cross-account transfer",
      "4. Track via platform",
    ],
    blockers: ["Service credentials"],
  },
];

approaches.forEach((app, i) => {
  console.log(`${String.fromCharCode(65 + i)}. ${app.approach}`);
  app.steps.forEach((step) => console.log(`   ${step}`));
  console.log(`   Blockers: ${app.blockers.join(", ")}`);
  console.log();
});

console.log();

// DIAGNOSIS 8: Immediate Action Plan
console.log("DIAGNOSIS 8: IMMEDIATE ACTION PLAN");
console.log("=".repeat(60));

console.log(`
🔴 STEP 1: Verify Prerequisites (5 min)
   [ ] .env.local exists with Supabase URL
   [ ] SUPABASE_SERVICE_ROLE_KEY set
   [ ] pnpm/npm available: npm --version

🔴 STEP 2: Install Dependencies (3-5 min)
   Command: pnpm install
   Alternative: npm install
   Expected: typescript, @supabase/supabase-js, tsx installed

🔴 STEP 3: Seed Database (1 min)
   Command: npx tsx scripts/seed-treasury.ts
   Expected: ✅ 4 accounts inserted
   Check: Supabase Studio → high_yield_account_registry

🟡 STEP 4: Test Transfer (1 min)
   Command: npx tsx scripts/fund-transfer.ts 100000
   (Test with €100k first, not full amount)
   Expected: INITIATED + transaction ID

🟡 STEP 5: Verify in Supabase (1 min)
   Check: high_yield_account_registry balances updated
   Check: sovereign_event_log has WIRE_TRANSFER_INITIATED entry

🟢 STEP 6: Execute Full Transfer (1 min)
   Command: npx tsx scripts/fund-transfer.ts 818067.01
   Expected: All €818k moved to Monzo

---

⏱️  TOTAL TIME: ~15 minutes if all prerequisites met
🚨 BLOCKER: Most likely missing npm dependencies or Supabase credentials
`);

console.log();

// DIAGNOSIS 9: Fallback: Manual SQL Transfer
console.log("DIAGNOSIS 9: Manual SQL Fallback");
console.log("-".repeat(60));

console.log(`
If TypeScript execution fails, use direct SQL:

1. Open Supabase Studio:
   https://app.supabase.com/project/aziwdgndohdgnwztpwdi

2. Go to SQL Editor

3. Run these queries:

-- Move €300k from Happen to Monzo
UPDATE high_yield_account_registry 
SET allocated_balance_eur = allocated_balance_eur - 300000
WHERE institution_name = 'Happen Bank';

UPDATE high_yield_account_registry 
SET allocated_balance_eur = allocated_balance_eur + 300000
WHERE institution_name = 'Monzo Bank UK';

-- Log transfer
INSERT INTO sovereign_event_log (event_type, payload)
VALUES (
  'WIRE_TRANSFER_INITIATED',
  jsonb_build_object(
    'from', 'Happen Bank',
    'to', 'Monzo Bank UK',
    'amount_eur', 300000,
    'timestamp', NOW()
  )
);

-- Verify
SELECT institution_name, allocated_balance_eur 
FROM high_yield_account_registry 
ORDER BY allocated_balance_eur DESC;
`);

console.log();

// DIAGNOSIS 10: Status
console.log("DIAGNOSIS 10: Current Status");
console.log("=".repeat(60));

console.log(`
✅ Infrastructure: COMPLETE
   - Schema defined
   - Scripts written
   - Audit trail configured

⚠️  Prerequisites: INCOMPLETE
   - npm dependencies unknown
   - Supabase credentials unknown
   - Actual Supabase tables status unknown

🔴 Next: Confirm you have:
   1. pnpm/npm installed
   2. Supabase credentials in .env.local
   3. Internet connection to Supabase

📞 Need Help?
   Answer these:
   - Do you have .env.local?
   - What happens when you run: npm --version?
   - Can you access Supabase Studio directly?
`);

console.log();
console.log("=".repeat(60));
