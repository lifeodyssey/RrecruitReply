import { NextRequest, NextResponse } from 'next/server';
import { getDocumentService } from '@/infrastructure/factories/document-service-factory';
import { ApiErrorHandler } from '@/application/utils/api-error-handler';
import { ValidationError } from '@/application/errors/application-errors';

/**
 * API route for uploading documents to the AutoRAG system
 */
export async function POST(request: NextRequest): Promise<Response> {
  try {
    // Check if the request is multipart/form-data
    const contentType = request.headers.get('content-type') || '';
    if (!contentType.includes('multipart/form-data')) {
      throw new ValidationError('Request must be multipart/form-data');
    }

    // Parse the form data
    const formData = await request.formData();
    const file = formData.get('file') as File | null;
    const title = formData.get('title') as string | null;
    const source = formData.get('source') as string | null;

    // Validate inputs
    if (!file) {
      throw new ValidationError('File is required');
    }

    if (!title) {
      throw new ValidationError('Title is required');
    }

    // Get the document service and upload the document
    const documentService = getDocumentService();
    const response = await documentService.uploadDocument(
      file,
      title,
      source || undefined
    );

    // Return the response
    return NextResponse.json(response);
  } catch (error) {
    return ApiErrorHandler.handleError(error, 'Failed to upload document');
  }
}

// Configure the route to handle large files
export const config = {
  api: {
    bodyParser: false,
  },
};
