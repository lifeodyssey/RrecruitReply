import { ApiErrorHandler } from '@/application/utils/api-error-handler';
import { getDocumentService } from '@/infrastructure/factories/document-service-factory';
import { NextResponse } from 'next/server';

import type { IQueryRequestDto } from '@/application/dtos/document-dtos';
import type { NextRequest } from 'next/server';

/**
 * API route for querying the AutoRAG system
 *
 * @param request - The Next.js request object
 * @returns Response with query results or error
 */
export async function POST(request: NextRequest): Promise<Response> {
  try {
    // Validate the Content-Type header
    const contentType = request.headers.get('Content-Type');
    if (!contentType?.includes('application/json')) {
      return NextResponse.json({ error: 'Content-Type must be application/json' }, { status: 415 });
    }

    // Parse the request body
    const body = (await request.json()) as IQueryRequestDto;

    // Get the document service
    const documentService = getDocumentService();

    // Query the document service and return the response
    const response = await documentService.query(body);
    return NextResponse.json(response);
  } catch (error) {
    // Let the error handler take care of different error types
    return ApiErrorHandler.handleError(error, 'Failed to query AutoRAG');
  }
}
