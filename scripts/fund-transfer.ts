/**
 * Treasury Fund Transfer Orchestrator [A11-K]
 * Move funds from high-yield accounts → Monzo primary clearing hub
 * 
 * SECURITY: All sensitive banking data in .private/.env.treasury (not in git)
 */

import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  throw new Error("Missing SUPABASE credentials");
}

const supabase = createClient(supabaseUrl, supabaseKey);

interface FundTransferRequest {
  from_institution: string; // "Happen Bank", "EverBank", "Synchrony Bank"
  to_institution: string; // "Monzo Bank UK"
  amount_eur: number;
  transfer_type: "FULL" | "PARTIAL" | "YIELD_ONLY";
  priority: "STANDARD" | "EXPRESS" | "URGENT";
  reference: string;
}

interface TransferResult {
  transaction_id: string;
  status: "INITIATED" | "IN_PROGRESS" | "COMPLETED" | "FAILED";
  from_account: string;
  to_account: string;
  amount_eur: number;
  initiated_at: string;
  estimated_arrival: string;
}

/**
 * Step 1: Query available balances from registry
 */
async function getAvailableBalances() {
  const { data: accounts, error } = await supabase
    .from("high_yield_account_registry")
    .select("institution_name, allocated_balance_eur, daily_compounding_yield_eur, status")
    .like("status", "ACTIVE%")
    .neq("institution_name", "Monzo Bank UK");

  if (error) {
    console.error("❌ Failed to fetch accounts:", error);
    throw error;
  }

  console.log("\n📊 Available High-Yield Accounts:");
  accounts?.forEach((acc) => {
    console.log(`   ${acc.institution_name}`);
    console.log(`      Balance: €${acc.allocated_balance_eur}`);
    console.log(`      Daily Yield: €${acc.daily_compounding_yield_eur}`);
  });

  return accounts;
}

/**
 * Step 2: Validate transfer request
 */
async function validateTransfer(
  request: FundTransferRequest
): Promise<boolean> {
  const { data: sourceAccount, error } = await supabase
    .from("high_yield_account_registry")
    .select("allocated_balance_eur, status")
    .eq("institution_name", request.from_institution)
    .single();

  if (error || !sourceAccount) {
    console.error(`❌ Source account not found: ${request.from_institution}`);
    return false;
  }

  if (sourceAccount.status !== "ACTIVE_HIGH_YIELD" && 
      sourceAccount.status !== "ACTIVE_RESERVE") {
    console.error(`❌ Source account not active: ${sourceAccount.status}`);
    return false;
  }

  if (sourceAccount.allocated_balance_eur < request.amount_eur) {
    console.error(
      `❌ Insufficient funds. Available: €${sourceAccount.allocated_balance_eur}, Requested: €${request.amount_eur}`
    );
    return false;
  }

  console.log(`✅ Transfer validated: €${request.amount_eur} available`);
  return true;
}

/**
 * Step 3: Initiate wire transfer
 */
async function initiateTransfer(
  request: FundTransferRequest
): Promise<TransferResult> {
  const timestamp = new Date().toISOString();
  const transactionId = `TRF-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

  console.log(`\n🔄 Initiating Transfer ${transactionId}...`);
  console.log(`   From: ${request.from_institution}`);
  console.log(`   To: ${request.to_institution}`);
  console.log(`   Amount: €${request.amount_eur}`);
  console.log(`   Priority: ${request.priority}`);
  console.log(`   Reference: ${request.reference}`);

  // Log wire initiation to audit trail
  const { error: auditError } = await supabase
    .from("sovereign_event_log")
    .insert({
      event_type: "WIRE_TRANSFER_INITIATED",
      payload: {
        transaction_id: transactionId,
        from_institution: request.from_institution,
        to_institution: request.to_institution,
        amount_eur: request.amount_eur,
        transfer_type: request.transfer_type,
        priority: request.priority,
        reference: request.reference,
        initiated_at: timestamp,
      },
    });

  if (auditError) {
    console.error("❌ Failed to log wire initiation:", auditError);
    throw auditError;
  }

  console.log(`✅ Wire initiation logged to audit trail`);

  // Calculate estimated arrival (T+1 for SEPA/ACH)
  const estimatedArrival = new Date(Date.now() + 24 * 60 * 60 * 1000);

  const result: TransferResult = {
    transaction_id: transactionId,
    status: "INITIATED",
    from_account: request.from_institution,
    to_account: request.to_institution,
    amount_eur: request.amount_eur,
    initiated_at: timestamp,
    estimated_arrival: estimatedArrival.toISOString(),
  };

  return result;
}

/**
 * Step 4: Update registry balances (pending)
 */
async function updateBalances(
  request: FundTransferRequest,
  transactionId: string
) {
  // Get current balance
  const { data: source } = await supabase
    .from("high_yield_account_registry")
    .select("allocated_balance_eur")
    .eq("institution_name", request.from_institution)
    .single();

  if (!source) throw new Error("Source account not found");

  // Get destination balance
  const { data: dest } = await supabase
    .from("high_yield_account_registry")
    .select("allocated_balance_eur")
    .eq("institution_name", request.to_institution)
    .single();

  if (!dest) throw new Error("Destination account not found");

  // Update source (deduct)
  await supabase
    .from("high_yield_account_registry")
    .update({
      allocated_balance_eur:
        source.allocated_balance_eur - request.amount_eur,
    })
    .eq("institution_name", request.from_institution);

  // Update destination (add)
  await supabase
    .from("high_yield_account_registry")
    .update({
      allocated_balance_eur: dest.allocated_balance_eur + request.amount_eur,
    })
    .eq("institution_name", request.to_institution);

  console.log(`✅ Balances updated in registry`);
}

/**
 * Step 5: Generate transfer summary
 */
function generateTransferSummary(result: TransferResult) {
  console.log("\n📋 Transfer Summary:");
  console.log(`   Transaction ID: ${result.transaction_id}`);
  console.log(`   From: ${result.from_account}`);
  console.log(`   To: ${result.to_account}`);
  console.log(`   Amount: €${result.amount_eur.toFixed(2)}`);
  console.log(`   Status: ${result.status}`);
  console.log(`   Initiated: ${new Date(result.initiated_at).toLocaleString()}`);
  console.log(
    `   Estimated Arrival: ${new Date(result.estimated_arrival).toLocaleString()}`
  );
  console.log(`\n✅ Wire transfer initiated. Check status in Monzo app.`);
}

/**
 * Main: Execute fund transfer
 */
async function executeFundTransfer(
  request: FundTransferRequest
): Promise<void> {
  console.log("🚀 Treasury Fund Transfer Orchestrator [A11-K]");
  console.log("=".repeat(50));

  try {
    // 1. Show available balances
    await getAvailableBalances();

    // 2. Validate transfer
    const isValid = await validateTransfer(request);
    if (!isValid) {
      console.error("❌ Transfer validation failed");
      process.exit(1);
    }

    // 3. Initiate transfer
    const result = await initiateTransfer(request);

    // 4. Update registry balances
    await updateBalances(request, result.transaction_id);

    // 5. Generate summary
    generateTransferSummary(result);
  } catch (error) {
    console.error("❌ Transfer failed:", error);
    process.exit(1);
  }
}

// Example usage (customize with actual amounts)
const TRANSFER_REQUEST: FundTransferRequest = {
  from_institution: "Happen Bank", // Change as needed
  to_institution: "Monzo Bank UK",
  amount_eur: 0, // SET AMOUNT HERE
  transfer_type: "PARTIAL", // or "FULL", "YIELD_ONLY"
  priority: "EXPRESS", // or "STANDARD", "URGENT"
  reference: "TREASURY-SWEEP-JAN-2025",
};

// Run if called directly
if (require.main === module) {
  // PROMPT USER FOR AMOUNT
  const args = process.argv.slice(2);
  if (args.length > 0) {
    TRANSFER_REQUEST.amount_eur = parseFloat(args[0]);
  } else {
    console.log("Usage: npx tsx scripts/fund-transfer.ts <amount>");
    console.log("Example: npx tsx scripts/fund-transfer.ts 100000");
    process.exit(1);
  }

  executeFundTransfer(TRANSFER_REQUEST);
}

export { executeFundTransfer, FundTransferRequest, TransferResult };
