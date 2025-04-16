import { type NextRequest, NextResponse } from 'next/server';

import { ApiErrorHandler } from '@/application/utils/api-error-handler';
import { getDocumentService } from '@/infrastructure/factories/document-service-factory';

/**
 * API route for querying documents in the AutoRAG system
 */
export async function POST(request: NextRequest): Promise<Response> {
  try {
    const documentService = getDocumentService();
    const { query, conversationId } = await request.json();

    if (!query || typeof query !== 'string') {
      return NextResponse.json(
        { error: 'Query is required and must be a string' },
        { status: 400 }
      );
    }

    const response = await documentService.query({ query, conversationId });

    // Ensure we're returning a serializable object
    // The response is already in DTO format from the service layer
    return NextResponse.json({
      answer: response.answer,
      sources: response.sources
    });
  } catch (error) {
    return ApiErrorHandler.handleError(error);
  }
}