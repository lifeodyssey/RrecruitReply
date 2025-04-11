import { NextRequest, NextResponse } from 'next/server';
import { autoragClient } from '@/lib/autorag/client';

/**
 * API route for uploading documents to the AutoRAG system
 */
export async function POST(request: NextRequest) {
  try {
    // Check if the request is multipart/form-data
    const contentType = request.headers.get('content-type') || '';
    if (!contentType.includes('multipart/form-data')) {
      return NextResponse.json(
        { error: 'Request must be multipart/form-data' },
        { status: 400 }
      );
    }

    // Parse the form data
    const formData = await request.formData();
    const file = formData.get('file') as File | null;
    const title = formData.get('title') as string | null;
    const source = formData.get('source') as string | null;

    // Validate the request
    if (!file) {
      return NextResponse.json(
        { error: 'File is required' },
        { status: 400 }
      );
    }

    if (!title) {
      return NextResponse.json(
        { error: 'Title is required' },
        { status: 400 }
      );
    }

    // Upload the document to the AutoRAG system
    const response = await autoragClient.uploadDocument(file, title, source || undefined);

    // Return the response
    return NextResponse.json(response);
  } catch (error) {
    console.error('Error uploading document to AutoRAG:', error);
    
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to upload document' },
      { status: 500 }
    );
  }
}

// Configure the route to handle large files
export const config = {
  api: {
    bodyParser: false,
  },
};
