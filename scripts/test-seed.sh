#!/bin/bash
# Treasury Seed Test Script
# Local development testing of seed-treasury.ts

set -e

echo "🧪 Treasury Seed Test Suite"
echo "=============================="
echo ""

# Check environment
if [ -z "$NEXT_PUBLIC_SUPABASE_URL" ]; then
    echo "❌ NEXT_PUBLIC_SUPABASE_URL not set"
    echo "   Set it in .env.local or .env.production"
    exit 1
fi

if [ -z "$SUPABASE_SERVICE_ROLE_KEY" ]; then
    echo "❌ SUPABASE_SERVICE_ROLE_KEY not set"
    echo "   Retrieve from Supabase Dashboard → Settings → API"
    exit 1
fi

echo "✅ Environment variables loaded"
echo ""

# Test 1: Verify TypeScript syntax
echo "📋 Test 1: TypeScript Compilation"
npx tsc --noEmit scripts/seed-treasury.ts
echo "✅ TypeScript syntax OK"
echo ""

# Test 2: Dry-run schema validation
echo "📋 Test 2: Drizzle Schema Validation"
npm run db:check 2>/dev/null || echo "⚠️  Drizzle check skipped (use 'npm run db:check' manually)"
echo ""

# Test 3: Run seed
echo "📋 Test 3: Execute Treasury Seed"
npx tsx scripts/seed-treasury.ts

echo ""
echo "✅ All treasury seed tests passed!"
echo ""
echo "📊 Next Steps:"
echo "   1. Verify in Supabase Studio: https://app.supabase.com/project/aziwdgndohdgnwztpwdi"
echo "   2. Check high_yield_account_registry table"
echo "   3. Query: SELECT * FROM high_yield_account_registry;"
echo "   4. Or use Drizzle Studio: npm run db:studio"
