import { NextRequest, NextResponse } from 'next/server';
import { autoragClient } from '@/lib/autorag/client';

/**
 * API route for querying the AutoRAG system
 */
export async function POST(request: NextRequest) {
  try {
    // Parse the request body
    const body = await request.json();
    const { query, conversationId } = body;

    // Validate the request
    if (!query || typeof query !== 'string') {
      return NextResponse.json(
        { error: 'Query is required and must be a string' },
        { status: 400 }
      );
    }

    // Query the AutoRAG system
    const response = await autoragClient.query(query, conversationId);

    // Return the response
    return NextResponse.json(response);
  } catch (error) {
    console.error('Error querying AutoRAG:', error);
    
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to query AutoRAG' },
      { status: 500 }
    );
  }
}
