import { NextResponse, type NextRequest } from 'next/server';

/**
 * Global error handler middleware
 * Catches and formats all API errors
 */
export class ApiError extends Error {
  constructor(
    public statusCode: number,
    public code: string,
    message: string,
    public details?: Record<string, unknown>
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

export function createErrorResponse(error: unknown) {
  if (error instanceof ApiError) {
    return NextResponse.json(
      {
        error: {
          message: error.message,
          code: error.code,
          status: error.statusCode,
          details: error.details,
        },
      },
      { status: error.statusCode }
    );
  }

  if (error instanceof SyntaxError) {
    return NextResponse.json(
      {
        error: {
          message: 'Invalid JSON payload',
          code: 'INVALID_JSON',
          status: 400,
        },
      },
      { status: 400 }
    );
  }

  if (error instanceof Error) {
    console.error('Unhandled error:', error);
    return NextResponse.json(
      {
        error: {
          message: 'Internal server error',
          code: 'INTERNAL_SERVER_ERROR',
          status: 500,
          ...(process.env.NODE_ENV === 'development' && {
            details: error.message,
          }),
        },
      },
      { status: 500 }
    );
  }

  return NextResponse.json(
    {
      error: {
        message: 'Unknown error occurred',
        code: 'UNKNOWN_ERROR',
        status: 500,
      },
    },
    { status: 500 }
  );
}

/**
 * Validation schema helper
 */
export async function validateRequest<T>(req: NextRequest, schema: any): Promise<T> {
  try {
    const body = await req.json();
    return schema.parse(body);
  } catch (error: any) {
    throw new ApiError(
      400,
      'VALIDATION_ERROR',
      'Invalid request payload',
      error.errors
    );
  }
}

/**
 * Rate limiting helper
 */
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();

export function checkRateLimit(identifier: string, maxRequests: number = 100, windowMs: number = 60000): boolean {
  const now = Date.now();
  const limit = rateLimitMap.get(identifier);

  if (!limit || now > limit.resetTime) {
    rateLimitMap.set(identifier, { count: 1, resetTime: now + windowMs });
    return true;
  }

  if (limit.count >= maxRequests) {
    throw new ApiError(
      429,
      'RATE_LIMIT_EXCEEDED',
      'Too many requests. Please try again later.',
      { retryAfter: Math.ceil((limit.resetTime - now) / 1000) }
    );
  }

  limit.count++;
  return true;
}
