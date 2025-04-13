import { NextResponse } from 'next/server';
import { getDocumentService } from '@/infrastructure/factories/document-service-factory';
import { ApiErrorHandler } from '@/application/utils/api-error-handler';

/**
 * API route for listing documents in the AutoRAG system
 */
export async function GET(): Promise<Response> {
  try {
    // Get the document service and list documents
    const documentService = getDocumentService();
    const documents = await documentService.listDocuments();

    // Return the response
    return NextResponse.json(documents);
  } catch (error) {
    return ApiErrorHandler.handleError(error, 'Failed to list documents');
  }
}
