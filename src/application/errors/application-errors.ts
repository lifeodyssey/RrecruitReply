/**
 * Application-specific error classes
 */

/**
 * Error classes for the application layer
 */

/**
 * Base class for all application errors
 */
export class ApplicationError extends Error {
  /**
   * Creates a new ApplicationError
   *
   * @param message - Error message
   * @param options - Error options
   */
  constructor(message: string, options?: ErrorOptions) {
    super(message, options);
    this.name = 'ApplicationError';
  }
}

/**
 * Error indicating a validation failure
 */
export class ValidationError extends ApplicationError {
  /**
   * Creates a new ValidationError
   *
   * @param message - Error message
   * @param options - Error options
   */
  constructor(message: string, options?: ErrorOptions) {
    super(message, options);
    this.name = 'ValidationError';
  }
}

/**
 * Error indicating a resource was not found
 */
export class NotFoundError extends ApplicationError {
  /**
   * Creates a new NotFoundError
   *
   * @param message - Error message
   * @param options - Error options
   */
  constructor(message: string, options?: ErrorOptions) {
    super(message, options);
    this.name = 'NotFoundError';
  }
}

/**
 * Error indicating unauthorized access
 */
export class UnauthorizedError extends ApplicationError {
  /**
   * Creates a new UnauthorizedError
   *
   * @param message - Error message
   * @param options - Error options
   */
  constructor(message: string, options?: ErrorOptions) {
    super(message, options);
    this.name = 'UnauthorizedError';
  }
}

/**
 * Error indicating forbidden access
 */
export class ForbiddenError extends ApplicationError {
  /**
   * Creates a new ForbiddenError
   *
   * @param message - Error message
   * @param options - Error options
   */
  constructor(message: string, options?: ErrorOptions) {
    super(message, options);
    this.name = 'ForbiddenError';
  }
}

/**
 * Error indicating a conflict with the current state
 */
export class ConflictError extends ApplicationError {
  /**
   * Creates a new ConflictError
   *
   * @param message - Error message
   * @param options - Error options
   */
  constructor(message: string, options?: ErrorOptions) {
    super(message, options);
    this.name = 'ConflictError';
  }
}

/**
 * Error for internal server errors (500 Internal Server Error)
 */
export class InternalServerError extends ApplicationError {
  constructor(message = 'Internal server error') {
    super(message);
    this.name = 'InternalServerError';
  }
}
