import { NextRequest, NextResponse } from 'next/server';
import { documentService } from '@/infrastructure/factories/document-service-factory';
import { ApiErrorHandler } from '@/application/utils/api-error-handler';
import { QueryRequestDto } from '@/application/dtos/document-dtos';

/**
 * API route for querying the AutoRAG system
 */
export async function POST(request: NextRequest) {
  try {
    // Parse the request body
    const body = await request.json() as QueryRequestDto;

    // Query the document service
    const response = await documentService.query(body);

    // Return the response
    return NextResponse.json(response);
  } catch (error) {
    return ApiErrorHandler.handleError(error, 'Failed to query AutoRAG');
  }
}
