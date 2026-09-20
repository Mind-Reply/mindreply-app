export function initSentryClient() { if (typeof window !== "undefined" && process.env.NEXT_PUBLIC_SENTRY_DSN) console.info("Sentry client DSN configured"); }
