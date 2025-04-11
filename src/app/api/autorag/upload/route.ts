import { NextRequest, NextResponse } from 'next/server';
import { documentService } from '@/infrastructure/factories/document-service-factory';
import { ApiErrorHandler } from '@/application/utils/api-error-handler';

/**
 * API route for uploading documents to the AutoRAG system
 */
export async function POST(request: NextRequest) {
  try {
    // Check if the request is multipart/form-data
    const contentType = request.headers.get('content-type') || '';
    if (!contentType.includes('multipart/form-data')) {
      throw new Error('Request must be multipart/form-data');
    }

    // Parse the form data
    const formData = await request.formData();
    const file = formData.get('file') as File | null;
    const title = formData.get('title') as string | null;
    const source = formData.get('source') as string | null;

    // Upload the document using the document service
    const response = await documentService.uploadDocument(
      file as File,
      title as string,
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
