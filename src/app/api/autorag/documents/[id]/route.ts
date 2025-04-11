import { NextRequest, NextResponse } from 'next/server';
import { documentService } from '@/infrastructure/factories/document-service-factory';
import { ApiErrorHandler } from '@/application/utils/api-error-handler';

/**
 * API route for deleting a document from the AutoRAG system
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    // Delete the document using the document service
    const response = await documentService.deleteDocument(id);

    // Return the response
    return NextResponse.json(response);
  } catch (error) {
    return ApiErrorHandler.handleError(error, 'Failed to delete document');
  }
}
