import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import { getDocumentService } from '@/infrastructure/factories/document-service-factory';
import { ApiErrorHandler } from '@/application/utils/api-error-handler';

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const documentService = getDocumentService();
    const { query, conversationId } = await request.json();

    if (!query || typeof query !== 'string') {
      return NextResponse.json(
        { error: 'Query is required and must be a string' },
        { status: 400 }
      );
    }

    const response = await documentService.query({ query, conversationId });

    return NextResponse.json(response);
  } catch (error) {
    return ApiErrorHandler.handleError(error);
  }
}