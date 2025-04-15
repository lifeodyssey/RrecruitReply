/**
 * Utility for handling API errors and converting them to appropriate HTTP responses
 */
import { NextResponse } from 'next/server';

import { ValidationError } from '../errors/application-errors';

/**
 * API error response structure
 */
interface IApiErrorResponse {
  error: string;
  details?: unknown;
  code?: string;
}

/**
 * API Error class for standardized error handling
 */
export class ApiError extends Error {
  public readonly statusCode: number;
  public readonly details?: Record<string, unknown>;

  constructor(message: string, statusCode: number, details?: Record<string, unknown>) {
    super(message);
    this.name = 'ApiError';
    this.statusCode = statusCode;
    this.details = details;
  }
}

/**
 * Utility class for handling API errors
 */
export class ApiErrorHandler {
  /**
   * Maps error instances to HTTP status codes
   */
  private static getStatusCode(error: Error): number {
    // Check for specific error types
    if (
      error instanceof ValidationError ||
      error.name === 'ValidationError' ||
      error.message.toLowerCase().includes('required') ||
      error.message.toLowerCase().includes('invalid') ||
      error.message.toLowerCase().includes('must be')
    ) {
      return 400; // Bad Request
    }

    if (error instanceof TypeError) {
      return 400; // Bad Request
    }

    if (error.message.toLowerCase().includes('not found') || error.name === 'NotFoundError') {
      return 404; // Not Found
    }

    // Special handling for authorization errors - more specific checks first
    if (
      error.message.toLowerCase().includes('not authorized') ||
      error.message.toLowerCase().includes('unauthorized') ||
      error.name === 'UnauthorizedError'
    ) {
      return 401; // Unauthorized
    }

    if (error.message.toLowerCase().includes('forbidden') || error.name === 'ForbiddenError') {
      return 403; // Forbidden
    }

    return 500; // Internal Server Error
  }

  /**
   * Creates an appropriate error response
   *
   * @param error - The error that occurred
   * @param defaultMessage - Default message to use if none is provided
   * @returns NextResponse with appropriate status and error details
   */
  public static handleError(
    error: unknown,
    defaultMessage = 'An unexpected error occurred'
  ): NextResponse {
    console.error('API Error:', error);

    // Define default error response
    const errorResponse: IApiErrorResponse = {
      error: defaultMessage,
    };

    // Enhance error response based on the error type
    if (error instanceof Error) {
      errorResponse.error = error.message || defaultMessage;

      // Add stack trace in development environment
      if (process.env.NODE_ENV === 'development') {
        errorResponse.details = error.stack;
      }

      // Return with appropriate status code
      const statusCode = this.getStatusCode(error);
      return NextResponse.json({ ...errorResponse, status: statusCode }, { status: statusCode });
    }

    // For non-Error objects
    if (error && typeof error === 'object') {
      // Add stringified error in development environment
      if (process.env.NODE_ENV === 'development') {
        try {
          errorResponse.details = JSON.stringify(error);
        } catch (e) {
          errorResponse.details = 'Could not stringify error details';
        }
      }
    }

    // Default to 500 Internal Server Error for unknown errors
    return NextResponse.json({ ...errorResponse, status: 500 }, { status: 500 });
  }
}

/**
 * Handles API errors and returns appropriate responses
 */
export function handleApiError(error: unknown): Response {
  console.error('API Error:', error);

  if (error instanceof ApiError) {
    return new Response(
      JSON.stringify({
        error: {
          message: error.message,
          details: error.details,
        },
      }),
      {
        status: error.statusCode,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }

  // Handle unknown errors
  return new Response(
    JSON.stringify({
      error: {
        message: error instanceof Error ? error.message : 'An unknown error occurred',
      },
    }),
    {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    }
  );
}

/**
 * Creates common API errors
 */
export const createApiError = {
  badRequest: (message = 'Bad request', details?: Record<string, unknown>): ApiError =>
    new ApiError(message, 400, details),

  unauthorized: (message = 'Unauthorized', details?: Record<string, unknown>): ApiError =>
    new ApiError(message, 401, details),

  forbidden: (message = 'Forbidden', details?: Record<string, unknown>): ApiError =>
    new ApiError(message, 403, details),

  notFound: (message = 'Resource not found', details?: Record<string, unknown>): ApiError =>
    new ApiError(message, 404, details),

  conflict: (message = 'Resource conflict', details?: Record<string, unknown>): ApiError =>
    new ApiError(message, 409, details),

  tooManyRequests: (message = 'Too many requests', details?: Record<string, unknown>): ApiError =>
    new ApiError(message, 429, details),

  internal: (message = 'Internal server error', details?: Record<string, unknown>): ApiError =>
    new ApiError(message, 500, details),
};
