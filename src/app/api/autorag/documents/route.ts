import { NextRequest, NextResponse } from 'next/server';
import { autoragClient } from '@/lib/autorag/client';

/**
 * API route for listing documents in the AutoRAG system
 */
export async function GET(request: NextRequest) {
  try {
    // List documents from the AutoRAG system
    const documents = await autoragClient.listDocuments();

    // Return the response
    return NextResponse.json(documents);
  } catch (error) {
    console.error('Error listing documents from AutoRAG:', error);
    
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to list documents' },
      { status: 500 }
    );
  }
}

/**
 * API route for deleting a document from the AutoRAG system
 */
export async function DELETE(request: NextRequest) {
  try {
    // Get the document ID from the URL
    const url = new URL(request.url);
    const documentId = url.pathname.split('/').pop();

    if (!documentId) {
      return NextResponse.json(
        { error: 'Document ID is required' },
        { status: 400 }
      );
    }

    // Delete the document from the AutoRAG system
    const response = await autoragClient.deleteDocument(documentId);

    // Return the response
    return NextResponse.json(response);
  } catch (error) {
    console.error('Error deleting document from AutoRAG:', error);
    
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to delete document' },
      { status: 500 }
    );
  }
}
