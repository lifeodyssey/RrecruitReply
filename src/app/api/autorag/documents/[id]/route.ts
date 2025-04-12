import { NextRequest, NextResponse } from 'next/server';
import { documentService } from '@/infrastructure/factories/document-service-factory';
import { ApiErrorHandler } from '@/application/utils/api-error-handler';

/**
 * API route for deleting a document from the AutoRAG system
 */

// Export a function that matches Next.js 15 App Router's expected signature
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const response = await documentService.deleteDocument(id);
    return NextResponse.json(response);
  } catch (error) {
    return ApiErrorHandler.handleError(error, 'Failed to delete document');
  }
}
