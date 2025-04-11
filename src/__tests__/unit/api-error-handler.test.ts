import { ApiErrorHandler } from '@/application/utils/api-error-handler';

describe('ApiErrorHandler', () => {
  it('should handle Error objects with appropriate status codes', async () => {
    const testCases = [
      { error: new Error('Field is required'), expectedStatus: 400 },
      { error: new Error('Value must be a string'), expectedStatus: 400 },
      { error: new Error('Invalid input'), expectedStatus: 400 },
      { error: new Error('Document not found'), expectedStatus: 404 },
      { error: new Error('User is not authorized'), expectedStatus: 401 },
      { error: new Error('Access is forbidden'), expectedStatus: 403 },
      { error: new Error('Server error'), expectedStatus: 500 },
    ];

    for (const { error, expectedStatus } of testCases) {
      const response = ApiErrorHandler.handleError(error);

      // Check status code
      expect(response.status).toBe(expectedStatus);

      // Check the response body
      const body = await response.json();
      expect(body).toHaveProperty('error', error.message);
      expect(body).toHaveProperty('status', expectedStatus);
    }
  });

  it('should handle non-Error objects with default message', async () => {
    const defaultMessage = 'An unexpected error occurred';
    const response = ApiErrorHandler.handleError('string error');

    // Check status code
    expect(response.status).toBe(500);

    // Check the response body
    const body = await response.json();
    expect(body).toHaveProperty('error', defaultMessage);
    expect(body).toHaveProperty('status', 500);
  });

  it('should use custom default message when provided', async () => {
    const customMessage = 'Custom error message';
    const response = ApiErrorHandler.handleError('string error', customMessage);

    // Check the response body
    const body = await response.json();
    expect(body).toHaveProperty('error', customMessage);
  });
});
