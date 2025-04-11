import { NextRequest, NextResponse } from 'next/server';
import { documentService } from '@/infrastructure/factories/document-service-factory';
import { ApiErrorHandler } from '@/application/utils/api-error-handler';

/**
 * API route for listing documents in the AutoRAG system
 */
export async function GET(request: NextRequest) {
  try {
    // List documents from the document service
    const documents = await documentService.listDocuments();

    // Return the response
    return NextResponse.json(documents);
  } catch (error) {
    return ApiErrorHandler.handleError(error, 'Failed to list documents');
  }
}
