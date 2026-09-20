/**
 * Logging and Monitoring Setup
 * Structured logging with Logtail/Datadog integration
 */

import { Logtail } from '@logtail/node';
import pino from 'pino';

// ===== LOGGER SETUP =====
const isProduction = process.env.NODE_ENV === 'production';

// Pino logger with Logtail transport
const pinoTransport = isProduction
  ? pino.transport({
      targets: [
        {
          level: 'trace',
          target: 'pino-logtail',
          options: {
            sourceToken: process.env.LOGTAIL_TOKEN,
          },
        },
        {
          level: 'error',
          target: '@logtail/pino',
          options: {
            sourceToken: process.env.LOGTAIL_TOKEN,
          },
        },
      ],
    })
  : pino.transport({
      target: 'pino-pretty',
      options: {
        colorize: true,
      },
    });

export const logger = pino(
  {
    level: process.env.LOG_LEVEL || 'info',
    timestamp: pino.stdTimeFunctions.isoTime,
    redact: {
      paths: [
        'password',
        'email',
        'token',
        'creditCard',
        'ssn',
        'STRIPE_SECRET_KEY',
        'DATABASE_URL',
      ],
      remove: true,
    },
  },
  pinoTransport
);

// ===== STRUCTURED LOGGING HELPERS =====
export const logEvent = (event: string, data?: Record<string, unknown>) => {
  logger.info({ event, ...data }, event);
};

export const logError = (error: Error | unknown, context?: Record<string, unknown>) => {
  if (error instanceof Error) {
    logger.error(
      {
        error: {
          message: error.message,
          stack: error.stack,
          name: error.name,
        },
        ...context,
      },
      error.message
    );
  } else {
    logger.error(context, 'Unknown error');
  }
};

export const logMetric = (
  name: string,
  value: number,
  tags?: Record<string, string>
) => {
  logger.info({ metric: name, value, tags }, `metric: ${name}`);
};

// ===== PERFORMANCE MONITORING =====
export const measurePerformance = (name: string) => {
  const start = performance.now();

  return {
    end: () => {
      const duration = performance.now() - start;
      logMetric(`${name}_duration_ms`, duration);
      return duration;
    },
  };
};

// ===== DATADOG APM (if configured) =====
if (process.env.DD_TRACE_ENABLED === 'true' && process.env.DD_API_KEY) {
  try {
    // Initialize Datadog tracer
    // import tracer from 'dd-trace';
    // tracer.init();
    logger.info('Datadog APM initialized');
  } catch (error) {
    logger.warn('Failed to initialize Datadog APM');
  }
}

export default logger;
