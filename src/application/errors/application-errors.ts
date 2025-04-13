/**
 * Application-specific error classes
 */

/**
 * Base class for all application errors
 */
export class ApplicationError extends Error {
  constructor(
    message: string,
    public readonly statusCode: number = 500
  ) {
    super(message);
    this.name = this.constructor.name;
    Error.captureStackTrace(this, this.constructor);
  }
}

/**
 * Error for invalid input data (400 Bad Request)
 */
export class ValidationError extends ApplicationError {
  constructor(message: string) {
    super(message, 400);
  }
}

/**
 * Error for unauthorized access (401 Unauthorized)
 */
export class UnauthorizedError extends ApplicationError {
  constructor(message: string = 'Unauthorized access') {
    super(message, 401);
  }
}

/**
 * Error for forbidden access (403 Forbidden)
 */
export class ForbiddenError extends ApplicationError {
  constructor(message: string = 'Access forbidden') {
    super(message, 403);
  }
}

/**
 * Error for resource not found (404 Not Found)
 */
export class NotFoundError extends ApplicationError {
  constructor(message: string = 'Resource not found') {
    super(message, 404);
  }
}

/**
 * Error for conflict with current state (409 Conflict)
 */
export class ConflictError extends ApplicationError {
  constructor(message: string) {
    super(message, 409);
  }
}

/**
 * Error for internal server errors (500 Internal Server Error)
 */
export class InternalServerError extends ApplicationError {
  constructor(message: string = 'Internal server error') {
    super(message, 500);
  }
}
