import { AppError, ValidationError, AuthenticationError, AuthorizationError, NotFoundError, RateLimitError } from '../utils/errors';
import { appLogger } from '../utils/logger';

interface ErrorResponse {
  error: {
    code: string;
    message: string;
    details?: unknown;
  };
}

export function errorHandler(error: Error): Response {
  let status = 500;
  const response: ErrorResponse = {
    error: {
      code: 'INTERNAL_ERROR',
      message: 'An unexpected error occurred'
    }
  };

  if (error instanceof AppError) {
    status = error.statusCode;
    response.error.code = error.code;
    response.error.message = error.message;
    if (error instanceof ValidationError) {
      response.error.details = error.errors.flatten();
    }
  }

  // Log error with appropriate level
  if (status >= 500) {
    appLogger.error(error);
  } else {
    appLogger.warn(error.message, { code: response.error.code });
  }

  return new Response(JSON.stringify(response), {
    status,
    headers: {
      'Content-Type': 'application/json'
    }
  });
}