import { NextRequest, NextResponse } from 'next/server';
import { autoragClient } from '@/lib/autorag/client';

/**
 * API route for deleting a document from the AutoRAG system
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    if (!id) {
      return NextResponse.json(
        { error: 'Document ID is required' },
        { status: 400 }
      );
    }

    // Delete the document from the AutoRAG system
    const response = await autoragClient.deleteDocument(id);

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
