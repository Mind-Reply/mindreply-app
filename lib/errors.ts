export class AppError extends Error {
  constructor(
    message: string,
    public code: string,
    public status: number = 500,
  ) {
    super(message);
    this.name = 'AppError';
  }
}

export function isAppError(error: unknown): error is AppError {
  return error instanceof AppError;
}

export function unauthorized(message = 'Unauthorized'): AppError {
  return new AppError(message, 'UNAUTHORIZED', 401);
}

export function forbidden(message = 'Forbidden'): AppError {
  return new AppError(message, 'FORBIDDEN', 403);
}

export function notFound(message = 'Not found'): AppError {
  return new AppError(message, 'NOT_FOUND', 404);
}

export function rateLimited(message = 'Too many requests'): AppError {
  return new AppError(message, 'RATE_LIMITED', 429);
}

export function validationError(message = 'Validation failed'): AppError {
  return new AppError(message, 'VALIDATION_ERROR', 422);
}

export function internalError(message = 'Internal server error'): AppError {
  return new AppError(message, 'INTERNAL_ERROR', 500);
}

export function toResponse(error: unknown): Response {
  if (isAppError(error)) {
    return Response.json(
      { error: { code: error.code, message: error.message } },
      { status: error.status },
    );
  }

  console.error('Unhandled error:', error);
  return Response.json(
    { error: { code: 'INTERNAL_ERROR', message: 'Internal server error' } },
    { status: 500 },
  );
}