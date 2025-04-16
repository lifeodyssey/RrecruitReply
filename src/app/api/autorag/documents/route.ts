import { NextResponse } from 'next/server';

import { ApiErrorHandler } from '@/application/utils/api-error-handler';
import { getDocumentService } from '@/infrastructure/factories/document-service-factory';

/**
 * API route for listing documents in the AutoRAG system
 */
export async function GET(): Promise<Response> {
  try {
    // During build, return empty array to avoid fetch errors
    if (typeof window === 'undefined' && process.env.NODE_ENV === 'production') {
      return NextResponse.json([]);
    }

    // Get the document service and list documents
    const documentService = getDocumentService();
    const documents = await documentService.listDocuments();

    // Ensure we're returning a serializable object
    // The documents are already in DTO format from the service layer
    return NextResponse.json(documents.map(doc => ({
      id: doc.id,
      title: doc.title,
      filename: doc.filename,
      uploadDate: doc.uploadDate.toISOString(),
      source: doc.source
    })));
  } catch (error) {
    return ApiErrorHandler.handleError(error, 'Failed to list documents');
  }
}
