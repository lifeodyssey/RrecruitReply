/**
 * Utility for handling API errors consistently
 */
import { NextResponse } from 'next/server';
import { ErrorResponseDto } from '../dtos/document-dtos';
import { ApplicationError } from '../errors/application-errors';

export class ApiErrorHandler {
  /**
   * Handle an error and return an appropriate NextResponse
   */
  static handleError(error: unknown, defaultMessage = 'An unexpected error occurred'): NextResponse<ErrorResponseDto> {
    console.error(`API Error: ${defaultMessage}`, error);

    // Determine error message and status code
    let errorMessage: string;
    let statusCode: number;

    if (error instanceof ApplicationError) {
      // If it's our application error, use its message and status code
      errorMessage = error.message;
      statusCode = error.statusCode;
    } else if (error instanceof Error) {
      // If it's a standard Error, use its message with appropriate status code
      errorMessage = error.message;
      
      // Check for common validation error messages
      if (error.message.includes('required') || 
          error.message.includes('must be') || 
          error.message.includes('Invalid input')) {
        statusCode = 400; // Bad Request
      } else if (error.message.includes('not found')) {
        statusCode = 404; // Not Found
      } else if (error.message.includes('not authorized')) {
        statusCode = 401; // Unauthorized
      } else if (error.message.includes('forbidden')) {
        statusCode = 403; // Forbidden
      } else {
        statusCode = 500; // Internal Server Error
      }
    } else {
      // For unknown errors, use the default message
      errorMessage = defaultMessage;
      statusCode = 500;
    }

    // Return the error response
    return NextResponse.json(
      { error: errorMessage, status: statusCode },
      { status: statusCode }
    );
  }
}
