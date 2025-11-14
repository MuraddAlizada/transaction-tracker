import { AppError } from './AppError';

/**
 * 400 Bad Request - Client sent invalid data
 */
export class BadRequestError extends AppError {
  constructor(detail?: string, instance?: string) {
    super(
      'Bad Request',
      400,
      'https://httpstatuses.com/400',
      detail || 'The request could not be understood due to invalid syntax',
      instance
    );
  }
}

/**
 * 401 Unauthorized - Authentication required
 */
export class UnauthorizedError extends AppError {
  constructor(detail?: string, instance?: string) {
    super(
      'Unauthorized',
      401,
      'https://httpstatuses.com/401',
      detail || 'Authentication is required to access this resource',
      instance
    );
  }
}

/**
 * 403 Forbidden - Access denied
 */
export class ForbiddenError extends AppError {
  constructor(detail?: string, instance?: string) {
    super(
      'Forbidden',
      403,
      'https://httpstatuses.com/403',
      detail || 'You do not have permission to access this resource',
      instance
    );
  }
}

/**
 * 404 Not Found - Resource doesn't exist
 */
export class NotFoundError extends AppError {
  constructor(detail?: string, instance?: string) {
    super(
      'Not Found',
      404,
      'https://httpstatuses.com/404',
      detail || 'The requested resource could not be found',
      instance
    );
  }
}

/**
 * 409 Conflict - Resource conflict
 */
export class ConflictError extends AppError {
  constructor(detail?: string, instance?: string) {
    super(
      'Conflict',
      409,
      'https://httpstatuses.com/409',
      detail || 'The request could not be completed due to a conflict',
      instance
    );
  }
}

/**
 * 422 Unprocessable Entity - Validation failed
 */
export class ValidationError extends AppError {
  constructor(detail?: string, instance?: string) {
    super(
      'Unprocessable Entity',
      422,
      'https://httpstatuses.com/422',
      detail || 'The request was well-formed but contains invalid data',
      instance
    );
  }
}

/**
 * 500 Internal Server Error - Server-side error
 */
export class InternalServerError extends AppError {
  constructor(detail?: string, instance?: string) {
    super(
      'Internal Server Error',
      500,
      'https://httpstatuses.com/500',
      detail || 'An unexpected error occurred on the server',
      instance
    );
  }
}