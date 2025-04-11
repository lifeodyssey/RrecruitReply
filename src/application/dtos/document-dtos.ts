/**
 * Data Transfer Objects for document operations
 */

export interface QueryRequestDto {
  query: string;
  conversationId?: string;
}

export interface QueryResponseDto {
  answer: string;
  sources: Array<{
    id: string;
    title: string;
    source: string;
    content: string;
    similarity: number;
  }>;
}

export interface DocumentDto {
  id: string;
  title: string;
  source: string;
  timestamp: number;
  chunks: number;
}

export interface UploadResponseDto {
  success: boolean;
  documentId: string;
  chunks: number;
}

export interface DeleteResponseDto {
  success: boolean;
  documentId: string;
}

export interface ErrorResponseDto {
  error: string;
  status: number;
}
