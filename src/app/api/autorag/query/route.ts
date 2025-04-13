import { NextRequest, NextResponse } from 'next/server';

import { QueryRequestDto } from '@/application/dtos/document-dtos';
import { ApiErrorHandler } from '@/application/utils/api-error-handler';
import { getDocumentService } from '@/infrastructure/factories/document-service-factory';

/**
 * API route for querying the AutoRAG system
 */
export async function POST(request: NextRequest): Promise<Response> {
  try {
    // Parse the request body
    const body = await request.json() as QueryRequestDto;

    // Get the document service and query it
    const documentService = getDocumentService();
    const response = await documentService.query(body);

    // Return the response
    return NextResponse.json(response);
  } catch (error) {
    return ApiErrorHandler.handleError(error, 'Failed to query AutoRAG');
  }
}
