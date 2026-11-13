# RWA Bridge Configuration
LEGAL_ENTITY_API_URL=https://api.otoco.io/v1
AGENT_WALLET_ADDRESS=0x321...AI_AGENT
AGENT_SESSION_KEY=0x_scoped_session_token

# Next.js Configuration
NODE_ENV=production
NEXT_TELEMETRY_DISABLED=1
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Supabase project (publishable values may be used by trusted clients)
SUPABASE_URL=https://example.supabase.co
SUPABASE_PUBLISHABLE_KEY=sb_publishable_example
SUPABASE_JWKS_URL=https://example.supabase.co/auth/v1/.well-known/jwks.json

# Server-only values — never commit real values or expose them to browser bundles
SUPABASE_SECRET_KEY=sb_secret_REPLACE_IN_SECRET_MANAGER
SUPABASE_DATABASE_URL=postgresql://postgres:REPLACE_PERCENT_ENCODED_PASSWORD@db.example.supabase.co:5432/postgres

# Stripe test-mode configuration
STRIPE_SECRET_KEY=sk_test_REPLACE_ME
STRIPE_WEBHOOK_SECRET=whsec_REPLACE_ME
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_REPLACE_ME
STRIPE_PRICE_ID_WEBSITE_COMPLETION=price_REPLACE_ME

# Optional: Gateway Services (if using EfficientCore gateway)
LITELLM_API_URL=http://litellm:4000
QDRANT_API_URL=http://qdrant:6333
SEARXNG_API_URL=http://searxng:8080
BROWSERLESS_URL=ws://browserless:3000

# Pressure Agent — server-only, minimum 32 characters
PRESSURE_AGENT_SECRET=replace-with-a-random-secret-at-least-32-characters
