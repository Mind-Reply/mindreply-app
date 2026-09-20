/**
 * Vercel Integrations & Services Configuration
 * Handles authentication, storage, analytics, and CMS connections
 */

import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';

// ===== VERCEL BLOB STORAGE =====
export const setupBlobStorage = () => {
  const token = process.env.VERCEL_BLOB_TOKEN;
  if (!token) {
    console.warn('⚠️  VERCEL_BLOB_TOKEN not configured');
    return null;
  }

  return {
    endpoint: 'https://blob.vercelusercontent.com',
    token,
    uploadDir: process.env.NODE_ENV === 'production' ? 'production' : 'dev',
  };
};

// ===== VERCEL KV (REDIS) =====
export const setupVercelKV = () => {
  const url = process.env.VERCEL_KV_REST_API_URL;
  const token = process.env.VERCEL_KV_REST_API_TOKEN;

  if (!url || !token) {
    console.warn('⚠️  VERCEL_KV not configured');
    return null;
  }

  return new Redis({
    url,
    token,
  });
};

// ===== RATE LIMITING =====
export const setupRateLimiting = () => {
  const redis = setupVercelKV();

  if (!redis) return null;

  return new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(
      parseInt(process.env.RATE_LIMIT_REQUESTS || '100', 10),
      parseInt(process.env.RATE_LIMIT_WINDOW_MS || '60000', 10) + 'ms'
    ),
  });
};

// ===== STRIPE INTEGRATION =====
export const setupStripe = () => {
  if (!process.env.STRIPE_SECRET_KEY) {
    console.error('❌ STRIPE_SECRET_KEY is required');
    process.exit(1);
  }

  // Replace with actual Stripe SDK
  return {
    apiKey: process.env.STRIPE_SECRET_KEY,
    webhookSecret: process.env.STRIPE_WEBHOOK_SECRET,
  };
};

// ===== CLERK AUTHENTICATION =====
export const setupClerk = () => {
  if (!process.env.CLERK_SECRET_KEY) {
    console.error('❌ CLERK_SECRET_KEY is required');
    process.exit(1);
  }

  return {
    secretKey: process.env.CLERK_SECRET_KEY,
    publishableKey: process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY,
  };
};

// ===== OPENAI / LLM PROVIDERS =====
export const setupLLMProviders = () => {
  const providers: Record<string, any> = {};

  if (process.env.OPENAI_API_KEY) {
    providers.openai = {
      apiKey: process.env.OPENAI_API_KEY,
      orgId: process.env.OPENAI_ORG_ID,
    };
  }

  if (process.env.ANTHROPIC_API_KEY) {
    providers.anthropic = {
      apiKey: process.env.ANTHROPIC_API_KEY,
    };
  }

  return providers;
};

// ===== SENTRY ERROR TRACKING =====
export const setupSentry = () => {
  if (!process.env.NEXT_PUBLIC_SENTRY_DSN) {
    console.warn('⚠️  SENTRY_DSN not configured');
    return null;
  }

  return {
    dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
    environment: process.env.VERCEL_ENV || 'development',
    release: process.env.VERCEL_GIT_COMMIT_SHA?.substring(0, 7),
  };
};

// ===== RESEND EMAIL SERVICE =====
export const setupResend = () => {
  if (!process.env.RESEND_API_KEY) {
    console.warn('⚠️  RESEND_API_KEY not configured');
    return null;
  }

  return {
    apiKey: process.env.RESEND_API_KEY,
    from: process.env.EMAIL_FROM || 'noreply@mind-reply.com',
  };
};

// ===== INITIALIZATION =====
export const initializeIntegrations = async () => {
  console.log('Initializing Vercel integrations...');

  const integrations = {
    blob: setupBlobStorage(),
    kv: setupVercelKV(),
    rateLimit: setupRateLimiting(),
    stripe: setupStripe(),
    clerk: setupClerk(),
    llm: setupLLMProviders(),
    sentry: setupSentry(),
    resend: setupResend(),
  };

  console.log('✓ Integrations initialized');
  return integrations;
};
