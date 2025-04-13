import { type NextRequest, NextResponse } from 'next/server';

import { ApiErrorHandler } from '@/application/utils/api-error-handler';
import { getDocumentService } from '@/infrastructure/factories/document-service-factory';

/**
 * API route for deleting a document from the AutoRAG system
 */

// Export a function that matches Next.js 15 App Router's expected signature
export async function DELETE(
  _request: NextRequest,
  context: { params: Promise<{ id: string }> }
): Promise<Response> {
  try {
    const { id } = await context.params;
    const documentService = getDocumentService();
    const response = await documentService.deleteDocument(id);
    return NextResponse.json(response);
  } catch (error) {
    return ApiErrorHandler.handleError(error, 'Failed to delete document');
  }
}
