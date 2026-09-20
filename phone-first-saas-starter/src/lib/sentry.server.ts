export function initSentryServer() { if (process.env.SENTRY_DSN) console.info("Sentry server DSN configured"); }
export function captureServerException(error: unknown) { if (process.env.SENTRY_DSN) console.error("Sentry exception", error); }
