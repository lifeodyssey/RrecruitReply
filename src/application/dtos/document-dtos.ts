/**
 * Data Transfer Objects for document operations
 */

// Request DTOs
export interface QueryRequestDto {
  query: string;
  conversationId?: string;
}

// Response DTOs with proper interfaces instead of type aliases
export interface SourceDto {
  name: string;
  url?: string;
}

export interface DocumentDto {
  id: string;
  title: string;
  filename: string;
  uploadDate: Date;
  source?: SourceDto;
}

export interface QueryResponseDto {
  answer: string;
  sources: SourceDto[];
}

export interface UploadResponseDto {
  success: boolean;
  documentId: string;
  message: string;
}

export interface DeleteResponseDto {
  success: boolean;
  documentId: string;
  message: string;
}

// Error DTO
export interface ErrorResponseDto {
  error: string;
  status: number;
}
